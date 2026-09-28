const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const messagesFixture = require('./fixtures/dualhook/messages.json');
const echoesFixture = require('./fixtures/dualhook/smb-message-echoes.json');
const historyFixture = require('./fixtures/dualhook/history.json');
const contactsFixture = require('./fixtures/dualhook/smb-app-state-sync.json');

const handler = require('../business/campanhas/crm-reativacao-leads/paginas-vendas/site/api/whatsapp-webhook.js');

function response() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    send(body) { this.body = body; return this; },
    json(body) { this.body = body; return this; },
    end(body) { this.body = body; return this; }
  };
}

test('GET devolve o challenge quando modo e verify token são válidos', async () => {
  process.env.META_WEBHOOK_VERIFY_TOKEN = 'token-de-teste';
  const req = {
    method: 'GET',
    query: {
      'hub.mode': 'subscribe',
      'hub.verify_token': 'token-de-teste',
      'hub.challenge': '1903260781'
    }
  };
  const res = response();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(res.body, '1903260781');
});

test('GET rejeita verificação quando o token do ambiente está ausente', async () => {
  delete process.env.META_WEBHOOK_VERIFY_TOKEN;
  const req = {
    method: 'GET',
    query: { 'hub.mode': 'subscribe', 'hub.challenge': 'não-devolver' }
  };
  const res = response();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.notEqual(res.body, 'não-devolver');
});

test('POST rejeita quando o segredo de ingresso não está configurado', async () => {
  delete process.env.META_WEBHOOK_INGRESS_TOKEN;
  const req = { method: 'POST', query: {}, body: {} };
  const res = response();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
});

test('POST registra mensagem recebida normalizada no RPC do CRM', async (t) => {
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const calls = [];
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, options, body: JSON.parse(options.body) });
    return { ok: true, json: async () => ({ inserted: true }) };
  });
  const req = {
    method: 'POST',
    query: { token: 'ingresso-secreto' },
    body: messagesFixture
  };
  const res = response();

  await handler(req, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://supabase.example/rest/v1/rpc/crm_ingest_whatsapp_event');
  assert.deepEqual(calls[0].body, {
    p_event_key: 'wamid.inbound-1',
    p_event_kind: 'message',
    p_phone_e164: '+5511987654321',
    p_contact_name: 'Lead Exemplo',
    p_direction: 'entrada',
    p_occurred_at: '2025-01-03T21:20:00.000Z',
    p_message_type: 'text',
    p_message_text: 'Quero entender a mentoria',
    p_metadata: { source_field: 'messages' }
  });
});

test('POST registra echo do WhatsApp Business como saída', async (t) => {
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const calls = [];
  t.mock.method(global, 'fetch', async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return { ok: true };
  });
  const res = response();

  await handler({ method: 'POST', query: { token: 'ingresso-secreto' }, body: echoesFixture }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].p_event_key, 'wamid.echo-1');
  assert.equal(calls[0].p_phone_e164, '+5511987654321');
  assert.equal(calls[0].p_direction, 'saida');
  assert.equal(calls[0].p_message_text, 'Resposta enviada pela Karol');
  assert.deepEqual(calls[0].p_metadata, { source_field: 'smb_message_echoes' });
});

test('POST registra histórico e conclusão do chunk progress 100', async (t) => {
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const calls = [];
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return { ok: true };
  });
  const res = response();

  await handler({ method: 'POST', query: { token: 'ingresso-secreto' }, body: historyFixture }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].body.p_event_key, 'wamid.history-1');
  assert.equal(calls[0].body.p_direction, 'entrada');
  assert.equal(calls[0].body.p_phone_e164, '+5511987654321');
  assert.deepEqual(calls[0].body.p_metadata, {
    source_field: 'history', phase: 2, chunk_order: 4
  });
  assert.match(calls[1].url, /crm_record_whatsapp_sync$/);
  assert.deepEqual(calls[1].body, {
    p_sync_key: 'waba-123:phone-123:history:2:4',
    p_sync_type: 'history',
    p_phase: 2,
    p_chunk_order: 4,
    p_progress: 100,
    p_completed: true,
    p_error_code: null
  });
});

test('POST transforma contact sync add em upsert idempotente de contato', async (t) => {
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const calls = [];
  t.mock.method(global, 'fetch', async (_url, options) => {
    calls.push(JSON.parse(options.body));
    return { ok: true };
  });
  const res = response();

  await handler({ method: 'POST', query: { token: 'ingresso-secreto' }, body: contactsFixture }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0], {
    p_event_key: 'waba-123:phone-123:contact:+5511977700011:add:1739321024',
    p_event_kind: 'contact_sync',
    p_phone_e164: '+5511977700011',
    p_contact_name: 'Contato Sincronizado',
    p_direction: null,
    p_occurred_at: '2025-02-12T00:43:44.000Z',
    p_message_type: null,
    p_message_text: null,
    p_metadata: { source_field: 'smb_app_state_sync', action: 'add' }
  });
});

test('POST rejeita assinatura inválida quando META_APP_SECRET está disponível', async (t) => {
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_APP_SECRET = 'app-secret-de-teste';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  t.after(() => delete process.env.META_APP_SECRET);
  const rawBody = Buffer.from(JSON.stringify(messagesFixture));
  t.mock.method(global, 'fetch', async () => ({ ok: true }));
  const res = response();

  await handler({
    method: 'POST',
    query: { token: 'ingresso-secreto' },
    body: messagesFixture,
    rawBody,
    headers: { 'x-hub-signature-256': 'sha256=incorreta' }
  }, res);

  assert.equal(res.statusCode, 403);
});

test('POST ignora threads de grupo no histórico', async (t) => {
  delete process.env.META_APP_SECRET;
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const payload = structuredClone(historyFixture);
  payload.entry[0].changes[0].value.history[0].threads[0].id = '120363000000000@g.us';
  const calls = [];
  t.mock.method(global, 'fetch', async (url) => {
    calls.push(url);
    return { ok: true };
  });
  const res = response();

  await handler({ method: 'POST', query: { token: 'ingresso-secreto' }, body: payload }, res);

  assert.equal(res.statusCode, 200);
  assert.equal(calls.filter(url => url.endsWith('crm_ingest_whatsapp_event')).length, 0);
});

test('migration usa event_key como chave idempotente dos eventos WhatsApp', () => {
  const migration = fs.readFileSync(path.join(
    __dirname,
    '../business/campanhas/crm-reativacao-leads/migrations/003_dualhook_whatsapp.sql'
  ), 'utf8');

  assert.match(migration, /create table if not exists public\.crm_whatsapp_events/i);
  assert.match(migration, /event_key\s+text\s+primary key/i);
  assert.match(migration, /on conflict \(event_key\) do nothing/i);
});

test('migration cria estado de revisão humana sem gerar follow-up automático', () => {
  const migration = fs.readFileSync(path.join(
    __dirname,
    '../business/campanhas/crm-reativacao-leads/migrations/003_dualhook_whatsapp.sql'
  ), 'utf8');

  assert.match(migration, /whatsapp_followup_state\s+text\s+not null\s+default 'sem_regra'/i);
  assert.match(migration, /'revisao_pendente'/i);
  assert.match(migration, /p_event_kind = 'message'.*p_direction = 'entrada'/is);
  assert.doesNotMatch(migration, /insert\s+into\s+(public\.)?crm_followups/i);
});

test('POST agrupa múltiplas mensagens de history em um RPC', async (t) => {
  delete process.env.META_APP_SECRET;
  process.env.META_WEBHOOK_INGRESS_TOKEN = 'ingresso-secreto';
  process.env.META_EXPECTED_WABA_ID = 'waba-123';
  process.env.META_EXPECTED_PHONE_NUMBER_ID = 'phone-123';
  process.env.SUPABASE_URL = 'https://supabase.example';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-de-teste';
  const payload = structuredClone(historyFixture);
  const second = structuredClone(payload.entry[0].changes[0].value.history[0].threads[0].messages[0]);
  second.id = 'wamid.history-2';
  payload.entry[0].changes[0].value.history[0].threads[0].messages.push(second);
  const calls = [];
  t.mock.method(global, 'fetch', async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return { ok: true };
  });
  const res = response();

  await handler({ method: 'POST', query: { token: 'ingresso-secreto' }, body: payload }, res);

  const bulkCalls = calls.filter(call => call.url.endsWith('crm_ingest_whatsapp_events'));
  assert.equal(bulkCalls.length, 1);
  assert.equal(bulkCalls[0].body.p_events.length, 2);
});
