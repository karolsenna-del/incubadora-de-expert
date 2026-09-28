'use strict';

const crypto = require('crypto');

function equalSecret(left, right) {
  if (!left || !right) return false;
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function normalizeE164(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 8 || digits.length > 15) return null;
  return `+${digits}`;
}

function isoFromUnix(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds)) return null;
  return new Date(seconds * 1000).toISOString();
}

function textFromMessage(message) {
  if (message.type === 'text') return message.text && message.text.body || null;
  if (message.type === 'button') return message.button && message.button.text || null;
  if (message.type === 'interactive') {
    const interactive = message.interactive || {};
    const reply = interactive.button_reply || interactive.list_reply || {};
    return reply.title || null;
  }
  return null;
}

async function postRpc(name, body) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('supabase not configured');

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) throw new Error(`supabase rpc failed (${response.status})`);
}

async function ingestEvent(event) {
  return postRpc('crm_ingest_whatsapp_event', event);
}

function eventsFromMessages(value) {
  const names = new Map((value.contacts || []).map(contact => [
    contact.wa_id,
    contact.profile && contact.profile.name || null
  ]));

  return (value.messages || []).flatMap(message => {
    const phone = normalizeE164(message.from);
    if (!phone || !message.id) return [];
    return [{
      p_event_key: message.id,
      p_event_kind: 'message',
      p_phone_e164: phone,
      p_contact_name: names.get(message.from) || null,
      p_direction: 'entrada',
      p_occurred_at: isoFromUnix(message.timestamp),
      p_message_type: message.type || 'unknown',
      p_message_text: textFromMessage(message),
      p_metadata: { source_field: 'messages' }
    }];
  });
}

function eventsFromEchoes(value) {
  return (value.message_echoes || []).flatMap(message => {
    const phone = normalizeE164(message.to);
    if (!phone || !message.id) return [];
    return [{
      p_event_key: message.id,
      p_event_kind: 'message',
      p_phone_e164: phone,
      p_contact_name: null,
      p_direction: 'saida',
      p_occurred_at: isoFromUnix(message.timestamp),
      p_message_type: message.type || 'unknown',
      p_message_text: textFromMessage(message),
      p_metadata: { source_field: 'smb_message_echoes' }
    }];
  });
}

function historyData(entryId, value) {
  const events = [];
  const syncs = [];
  const businessPhone = normalizeE164(value.metadata && value.metadata.display_phone_number);
  const phoneId = value.metadata && value.metadata.phone_number_id || 'unknown';

  for (const chunk of value.history || []) {
    const metadata = chunk.metadata || {};
    const errorCode = chunk.errors && chunk.errors[0] && chunk.errors[0].code || null;
    const phase = metadata.phase == null ? null : metadata.phase;
    const order = metadata.chunk_order == null ? null : metadata.chunk_order;
    syncs.push({
      p_sync_key: `${entryId}:${phoneId}:history:${phase}:${order}`,
      p_sync_type: 'history',
      p_phase: phase,
      p_chunk_order: order,
      p_progress: metadata.progress == null ? null : metadata.progress,
      p_completed: metadata.progress === 100,
      p_error_code: errorCode
    });

    for (const thread of chunk.threads || []) {
      if (String(thread.id || '').includes('@g.us')) continue;
      const threadPhone = normalizeE164(thread.id);
      if (!threadPhone) continue;
      for (const message of thread.messages || []) {
        if (!message.id) continue;
        const from = normalizeE164(message.from);
        events.push({
          p_event_key: message.id,
          p_event_kind: 'history',
          p_phone_e164: threadPhone,
          p_contact_name: null,
          p_direction: from && businessPhone && from === businessPhone ? 'saida' : 'entrada',
          p_occurred_at: isoFromUnix(message.timestamp),
          p_message_type: message.type || 'unknown',
          p_message_text: textFromMessage(message),
          p_metadata: { source_field: 'history', phase, chunk_order: order }
        });
      }
    }
  }
  return { events, syncs };
}

function eventsFromContactSync(entryId, value) {
  const phoneId = value.metadata && value.metadata.phone_number_id || 'unknown';
  return (value.state_sync || []).flatMap(item => {
    if (item.type !== 'contact') return [];
    const contact = item.contact || {};
    const phone = normalizeE164(contact.phone_number);
    const timestamp = item.metadata && item.metadata.timestamp;
    if (!phone || !timestamp) return [];
    return [{
      p_event_key: `${entryId}:${phoneId}:contact:${phone}:${item.action}:${timestamp}`,
      p_event_kind: 'contact_sync',
      p_phone_e164: phone,
      p_contact_name: contact.full_name || contact.first_name || null,
      p_direction: null,
      p_occurred_at: isoFromUnix(timestamp),
      p_message_type: null,
      p_message_text: null,
      p_metadata: { source_field: 'smb_app_state_sync', action: item.action || 'unknown' }
    }];
  });
}

function validateTenant(payload) {
  if (!payload || payload.object !== 'whatsapp_business_account' || !Array.isArray(payload.entry)) return false;
  const expectedWaba = process.env.META_EXPECTED_WABA_ID;
  const expectedPhone = process.env.META_EXPECTED_PHONE_NUMBER_ID;

  return payload.entry.every(entry => {
    if (expectedWaba && entry.id !== expectedWaba) return false;
    return (entry.changes || []).every(change => {
      const phoneId = change.value && change.value.metadata && change.value.metadata.phone_number_id;
      return !expectedPhone || !phoneId || phoneId === expectedPhone;
    });
  });
}

function hasValidSignature(req) {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true;
  if (!req.rawBody) return false;
  const expected = `sha256=${crypto.createHmac('sha256', appSecret).update(req.rawBody).digest('hex')}`;
  const supplied = req.headers && req.headers['x-hub-signature-256'];
  return equalSecret(supplied, expected);
}

async function handler(req, res) {
  if (req.method === 'GET') {
    const query = req.query || {};
    const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
    if (!verifyToken) return res.status(503).send('webhook not configured');

    const valid = query['hub.mode'] === 'subscribe'
      && equalSecret(query['hub.verify_token'], verifyToken);

    if (!valid) return res.status(403).send('forbidden');
    return res.status(200).send(String(query['hub.challenge'] || ''));
  }

  if (req.method === 'POST') {
    const ingressToken = process.env.META_WEBHOOK_INGRESS_TOKEN;
    if (!ingressToken) return res.status(503).json({ ok: false, error: 'webhook not configured' });
    if (!equalSecret(req.query && req.query.token, ingressToken)) {
      return res.status(403).json({ ok: false, error: 'forbidden' });
    }
    if (!hasValidSignature(req)) {
      return res.status(403).json({ ok: false, error: 'invalid signature' });
    }

    const payload = req.body;
    if (!validateTenant(payload)) return res.status(403).json({ ok: false, error: 'invalid tenant' });

    try {
      const events = [];
      const syncs = [];
      for (const entry of payload.entry) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') events.push(...eventsFromMessages(change.value || {}));
          if (change.field === 'smb_message_echoes') events.push(...eventsFromEchoes(change.value || {}));
          if (change.field === 'smb_app_state_sync') {
            events.push(...eventsFromContactSync(entry.id, change.value || {}));
          }
          if (change.field === 'history') {
            const parsed = historyData(entry.id, change.value || {});
            events.push(...parsed.events);
            syncs.push(...parsed.syncs);
          }
        }
      }
      if (events.length === 1) {
        await ingestEvent(events[0]);
      } else if (events.length > 1) {
        await postRpc('crm_ingest_whatsapp_events', { p_events: events });
      }
      for (const sync of syncs) await postRpc('crm_record_whatsapp_sync', sync);
      return res.status(200).json({ ok: true, accepted: events.length });
    } catch (error) {
      console.error('[whatsapp-webhook] processing failed');
      return res.status(500).json({ ok: false, error: 'processing failed' });
    }
  }

  return res.status(405).json({ ok: false, error: 'method not allowed' });
}

module.exports = handler;
module.exports.normalizeE164 = normalizeE164;
