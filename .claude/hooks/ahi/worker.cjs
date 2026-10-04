'use strict';
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const https = require('node:https');
const R = require('./runtime.cjs');
const S = require('./security.cjs');
function baseUrl() {
  if (process.env.NODE_ENV === 'test' && process.env.AHI_TEST_MODE === '1' && process.env.AHI_TEST_URL) {
    const url = new URL(process.env.AHI_TEST_URL);
    if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) throw new Error('UNSAFE_TEST_ENDPOINT');
    return url.origin;
  }
  return 'https://arcane.arka.education';
}
function request(url, token, body, extraHeaders = {}) {
  return new Promise(resolve => {
    let finished = false; let timer;
    const finish = value => { if (finished) return; finished = true; clearTimeout(timer); resolve(value); };
    const target = new URL(url); const data = body === undefined ? null : JSON.stringify(body);
    const transport = target.protocol === 'https:' ? https : http;
    const req = transport.request(target, { method: data ? 'POST' : 'GET', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}), ...extraHeaders }, timeout: 4000 }, res => {
      let bytes = 0; let text = '';
      res.on('data', chunk => { bytes += chunk.length; if (bytes > 128 * 1024) { req.destroy(); finish({ code: 0, error: 'RESPONSE_TOO_LARGE' }); } else text += chunk; });
      res.on('end', () => { let json; try { json = JSON.parse(text); } catch {} const numericRetry = Number(res.headers['retry-after']); const retry = Number.isFinite(numericRetry) ? numericRetry * 1000 : Date.parse(res.headers['retry-after']) - Date.now(); finish({ code: res.statusCode, body: json, retryMs: Number.isFinite(retry) ? Math.min(300000, Math.max(0, retry)) : 0 }); });
    });
    req.on('error', () => finish({ code: 0, error: 'NETWORK_ERROR' }));
    req.on('timeout', () => { req.destroy(); finish({ code: 0, error: 'NETWORK_TIMEOUT' }); });
    timer = setTimeout(() => { req.destroy(); finish({ code: 0, error: 'NETWORK_TIMEOUT' }); }, 4000);
    if (data) req.write(data); req.end();
  });
}
async function getCredential(ctx) {
  let cred = R.credential();
  if (!cred || cred.user.id !== ctx.authId) return null;
  if (Number(cred.expires_at) > Date.now() / 1000 + 60) return cred;
  if (!cred.refresh_token) return cred;
  if (!fs.existsSync(ctx.accountDir)) S.protect(ctx.accountDir);
  const release = R.lock({ ...ctx, dir: ctx.accountDir }, 'auth.lock', 0);
  if (!release) return cred;
  try {
    cred = R.credential();
    if (!cred || cred.user.id !== ctx.authId) return null;
    if (Number(cred.expires_at) > Date.now() / 1000 + 60) return cred;
    const auth = require('./auth-config.cjs');
    const endpoint = process.env.NODE_ENV === 'test' && process.env.AHI_TEST_MODE === '1' ? `${baseUrl()}/auth/v1/token?grant_type=refresh_token` : `${auth.url}/auth/v1/token?grant_type=refresh_token`;
    const response = await request(endpoint, null, { refresh_token: cred.refresh_token }, { apikey: auth.publicKey });
    if (response.code !== 200 || typeof response.body?.access_token !== 'string' || typeof response.body?.refresh_token !== 'string' || response.body?.user?.id !== ctx.authId) return R.credential()?.user?.id === ctx.authId ? R.credential() : null;
    // MCP can also refresh this shared login. Reread after network and preserve a newer token/account.
    const current = R.credential();
    if (!current || current.user.id !== ctx.authId) return null;
    if (current.access_token !== cred.access_token || current.refresh_token !== cred.refresh_token) return current;
    const updated = { ...current, access_token: response.body.access_token, refresh_token: response.body.refresh_token, expires_at: response.body.expires_at || Math.floor(Date.now() / 1000) + response.body.expires_in };
    S.atomic(path.join(os.homedir(), '.arcane', 'credentials.json'), updated);
    const saved = R.credential(); return saved?.user?.id === ctx.authId ? saved : null;
  } finally { release(); }
}
function discard(ctx, files, reason) {
  let count = 0;
  for (const file of files) { try { S.safePath(file); fs.unlinkSync(file); R.removeOrder(ctx, path.basename(file, '.json')); count++; } catch {} }
  if (count) R.record(ctx, 'discarded', reason, count);
}
async function lease(ctx, session) {
  if (!R.configured(ctx.project, ctx.host)) return { stop: true, reason: 'MCP_DISABLED' };
  const leaseFile = path.join(ctx.dir, `lease-${S.hash(`${ctx.host}:${session}`)}.json`);
  const cred = await getCredential(ctx); if (!cred) { S.atomic(leaseFile, { enabled: false }); return { stop: true, reason: 'ACCOUNT_CHANGED' }; }
  const response = await request(`${baseUrl()}/api/ahi/v1/capture-status?${new URLSearchParams({ project_key: ctx.projectKey, host: ctx.host, native_session_id: session, adapter_version: R.VERSION })}`, cred.access_token);
  const body = response.body;
  if (response.code === 200 && body?.enabled === true && body.auth_user_id === ctx.authId) {
    const expiry = Date.parse(body.expires_at); const duration = Math.min(55000, expiry - Date.now());
    if (!Number.isFinite(duration) || duration <= 0) return { retry: true, reason: 'INVALID_LEASE' };
    const publicKey = S.read(path.join(ctx.dir, 'public-key.json'))?.key;
    if (!publicKey) return { stop: true, reason: 'SECURE_STORAGE_UNAVAILABLE' };
    S.atomic(leaseFile, { enabled: true, host: ctx.host, native_session_id: session, auth_user_id: ctx.authId, subject_id: body.subject_id, policy_version: body.policy_version, key_fingerprint: S.hash(publicKey), until: Date.now() + duration, uptime: os.uptime(), untilUptime: os.uptime() + duration / 1000, boot: R.boot() });
    return { credential: cred };
  }
  S.atomic(leaseFile, { enabled: false });
  if (response.code === 401) return { stop: true, reason: 'AUTH_REQUIRED' };
  if (response.code === 403 || (response.code === 200 && body?.enabled === false)) {
    const scoped = ['DELETED', 'REVOKED'].includes(body?.reason);
    if (scoped) { const sf = path.join(ctx.dir, `session-${S.hash(`${ctx.host}:${session}`)}.json`); const sessionState = S.read(sf, {}); S.atomic(sf, { ...sessionState, active: false, revoked: true }); }
    discard(ctx, R.queueFiles(ctx).filter(f => S.read(f)?.session_key === S.hash(`${ctx.host}:${session}`)), response.code === 403 ? 'LICENSE_REVOKED' : 'CAPTURE_DISABLED');
    return { stop: !scoped, sessionBlocked: scoped, reason: response.code === 403 ? 'LICENSE_REVOKED' : body?.reason || 'CAPTURE_DISABLED' };
  }
  return { retry: true, reason: response.error || 'STATUS_UNAVAILABLE', retryMs: response.retryMs };
}
function markTerminal(ctx, file, eventId, kind, reason) {
  // Write tombstone before deleting ciphertext: crash/restart will finish cleanup, not replay it.
  S.atomic(path.join(ctx.dir, `terminal-${eventId}.json`), { kind, reason, at: new Date().toISOString() });
  try { fs.unlinkSync(file); R.removeOrder(ctx, eventId); } catch (e) { if (e.code !== 'ENOENT') throw e; }
}
async function drain(ctx, cred) {
  // Configuration is checked after selecting the queued host below.
  const fresh = await getCredential(ctx); if (!fresh || (cred && fresh.user.id !== cred.user.id)) return { stop: true, reason: 'ACCOUNT_CHANGED' };
  const files = R.queueFiles(ctx).slice(0, 50);
  if (!files.length) return { empty: true };
  const key = S.keyFor(ctx);
  const rows = [];
  try {
    for (const file of files) {
      const eventId = path.basename(file, '.json');
      if (S.read(path.join(ctx.dir, `terminal-${eventId}.json`))) { fs.unlinkSync(file); R.removeOrder(ctx, eventId); continue; }
      try {
        const row = S.open(S.read(file), key, ctx.scope);
        if (row.project_key !== ctx.projectKey || row.event.event_id !== eventId) throw new Error('QUEUE_IDENTITY_MISMATCH');
        if (Date.now() - row.captured_at > R.TTL) {
          const gapId = S.id(`${eventId}:ttl`);
          const gap = { ...row, captured_at: Date.now(), event: { event_id: gapId, source_event_id: `CoverageGap:${S.hash(gapId)}`, type: 'coverage.gap', occurred_at: new Date().toISOString(), evidence_kind: 'observed', redacted: false, truncated: true, payload: { reason: 'QUEUE_TTL', excluded_count: 1 } } };
          const publicKey = S.read(path.join(ctx.dir, 'public-key.json'))?.key;
          if (publicKey) R.queueRow(ctx, gap, publicKey);
          markTerminal(ctx, file, eventId, 'discarded', 'QUEUE_TTL'); R.record(ctx, 'discarded', 'QUEUE_TTL'); continue;
        }
        rows.push({ file, row });
      } catch {
        // Preserve corrupt ciphertext for manual diagnosis; stop repeated upload attempts.
        fs.renameSync(file, `${file}.corrupt`); R.removeOrder(ctx, eventId); R.record(ctx, 'excluded', 'QUEUE_CORRUPT');
      }
    }
  } finally { key.fill(0); }
  rows.sort((a, b) => a.row.captured_at - b.row.captured_at || (a.row.capture_order || 0) - (b.row.capture_order || 0) || a.row.event.event_id.localeCompare(b.row.event.event_id));
  if (!rows.length) return { empty: true };
  const first = rows[0].row;
  ctx.host = first.host;
  if (!R.configured(ctx.project, first.host)) { discard(ctx, rows.filter(x => x.row.host === first.host).map(x => x.file), 'MCP_DISABLED'); return { sent: 0 }; }
  if (!R.validLease(ctx, first.native_session_id)) { const check = await lease(ctx, first.native_session_id); if (check.stop || check.retry || check.sessionBlocked) return check.sessionBlocked ? { sent: 0 } : check; }
  const selected = rows.filter(x => x.row.native_session_id === first.native_session_id && x.row.host === first.host).slice(0, 6);
  const envelope = { schema_version: 1, host: first.host, adapter_version: R.VERSION, project_key: ctx.projectKey, native_session_id: first.native_session_id, events: selected.map(x => x.row.event) };
  const response = await request(`${baseUrl()}/api/ahi/v1/ingest`, fresh.access_token, envelope);
  if (response.code === 401) return { stop: true, reason: 'AUTH_REQUIRED' };
  if (response.code === 403 || response.code === 410) {
    discard(ctx, R.queueFiles(ctx).filter(f => S.read(f)?.session_key === S.hash(`${first.host}:${first.native_session_id}`)), 'REVOKED');
    if (response.code === 410) { const sf = path.join(ctx.dir, `session-${S.hash(`${first.host}:${first.native_session_id}`)}.json`); S.atomic(sf, { ...S.read(sf, {}), active: false, revoked: true }); return { sent: 0 }; }
    return { stop: true, reason: 'LICENSE_REVOKED' };
  }
  if ([400, 413, 422, 426].includes(response.code)) { discard(ctx, selected.map(x => x.file), response.code === 426 ? 'UPGRADE_REQUIRED' : 'INVALID_ENVELOPE'); return { stop: true, reason: response.code === 426 ? 'UPGRADE_REQUIRED' : 'INVALID_ENVELOPE' }; }
  if (response.code < 200 || response.code >= 300 || !Array.isArray(response.body?.accepted_ids) || !Array.isArray(response.body?.duplicate_ids)) return { retry: true, reason: response.error || 'INGEST_RETRY', retryMs: response.retryMs };
  const receipt = response.body;
  const ack = new Set([...receipt.accepted_ids, ...receipt.duplicate_ids]);
  const rejects = new Map((Array.isArray(receipt.rejected) ? receipt.rejected : []).map(x => [x.id, x]));
  let accepted = 0; let rejected = 0; let pending = 0;
  for (const item of selected) {
    const eventId = item.row.event.event_id;
    if (ack.has(eventId)) { markTerminal(ctx, item.file, eventId, 'acked', 'DURABLE_ACK'); accepted++; }
    else {
      const rejection = rejects.get(eventId);
      if (rejection && ['CONFLICT', 'DELETED', 'REVOKED', 'INVALID', 'INVALID_EVENT', 'EVENT_ID_CONFLICT'].includes(rejection.code)) { markTerminal(ctx, item.file, eventId, 'discarded', rejection.code); rejected++; }
      else pending++;
    }
  }
  if (accepted) {
    const release = R.lock(ctx, 'state.lock');
    if (release) { try { const state = R.state(ctx); R.update(ctx, { acked: state.acked + accepted, last_ack_at: new Date().toISOString(), last_problem: null }); } finally { release(); } }
  }
  if (rejected) R.record(ctx, 'discarded', 'SERVER_TERMINAL_REJECTION', rejected);
  return pending ? { retry: true, reason: 'MISSING_DURABLE_ACK' } : { sent: accepted };
}
function cleanup(ctx) {
  // Only v2 ciphertext/metadata generated by this collector; never legacy JSONL or host history.
  for (const name of fs.readdirSync(ctx.outbox)) {
    if (!/\.(corrupt|tmp)$/.test(name)) continue;
    const file = path.join(ctx.outbox, name); const stat = fs.lstatSync(file);
    if (stat.isFile() && Date.now() - stat.mtimeMs > R.TTL) { fs.unlinkSync(file); R.record(ctx, 'discarded', 'QUARANTINE_TTL'); }
  }
  for (const name of fs.readdirSync(ctx.dir)) {
    if (!/^terminal-[a-f0-9-]+\.json$/.test(name)) continue;
    const file = path.join(ctx.dir, name); const receipt = S.read(file);
    if (receipt && Date.now() - Date.parse(receipt.at) > 90 * 24 * 3600 * 1000) fs.unlinkSync(file);
  }
}
async function work(cwd, host, options = {}) {
  const ctx = R.context(cwd, host, true); if (!ctx) return { reason: 'AUTH_REQUIRED' };
  const release = R.lock(ctx, 'worker.lock', 0); if (!release) return { reason: 'WORKER_RUNNING' };
  const started = Date.now(); let attempts = 0;
  const wait = options.wait || (ms => new Promise(resolve => {
    let timer; const finish = () => { clearTimeout(timer); options.signal?.removeEventListener('abort', finish); resolve(); };
    timer = setTimeout(finish, ms); options.signal?.addEventListener('abort', finish, { once: true });
    if (options.signal?.aborted) finish();
  }));
  let nextAttemptAt = options.once ? 0 : Date.parse(R.state(ctx).next_retry_at || '') || 0; let leaseRetryAt = 0;
  try {
    // All OS ACL/keychain/DPAPI work is off the host's critical path.
    S.protectMany([path.dirname(ctx.accountDir), ctx.accountDir, ctx.dir, ctx.outbox, ctx.orderDir]);
    const seed = S.keyFor(ctx, true); const publicKey = S.publicKey(seed); seed.fill(0);
    S.atomic(path.join(ctx.dir, 'public-key.json'), { algorithm: 'X25519-HKDF-SHA256-AES256GCM', key: publicKey });
    cleanup(ctx);
    // An active turn may outlive five minutes; idle/orphan deadlines, not process age, end production workers.
    while (!options.signal?.aborted && (!options.maxRunMs || Date.now() - started < options.maxRunMs)) {
      let result;
      const sessions = fs.readdirSync(ctx.dir).filter(f => /^session-[a-f0-9]+\.json$/.test(f)).map(f => S.read(path.join(ctx.dir, f))).filter(s => s?.native_session_id && s.active);
      for (const session of sessions) {
        if (session.turn_active && Number(session.turn_deadline) <= Date.now()) {
          const sf = path.join(ctx.dir, `session-${S.hash(`${session.host}:${session.native_session_id}`)}.json`);
          const unlock = R.lock(ctx, 'capture.lock', 0);
          if (unlock) {
            try {
              const currentSession = S.read(sf);
              if (currentSession?.turn_active && Number(currentSession.turn_deadline) <= Date.now()) {
                S.atomic(sf, { ...currentSession, turn_active: false, turn_expired: true });
                R.record(ctx, 'excluded', 'ACTIVE_TURN_EXPIRED', 0);
              }
            } finally { unlock(); }
          }
          session.turn_active = false;
        }
        if (!(session.seen_mcp && session.turn_active) && Date.now() - (session.last_seen || started) > R.IDLE_TTL) continue;
        const sessionCtx = { ...ctx, host: session.host };
        if (!R.configured(cwd, session.host)) continue;
        const current = R.validLease(sessionCtx, session.native_session_id);
        if ((!current || current.until - Date.now() < 30000) && Date.now() >= leaseRetryAt) {
          const checked = await lease(sessionCtx, session.native_session_id);
          if (checked.stop || checked.retry) { result = { ...checked, leaseRetry: true }; break; }
        }
      }
      const activity = S.read(path.join(ctx.dir, 'activity.json'), { at: started });
      const activeTurn = sessions.some(session => session.active && session.seen_mcp && session.turn_active && Number(session.turn_deadline) > Date.now() && R.configured(cwd, session.host));
      if (!options.once && !result?.stop && !activeTurn) {
        if (!R.queueFiles(ctx).length && Date.now() - activity.at > R.IDLE_TTL) return { empty: true };
        // A failed upload without a live turn gets a bounded grace period; ciphertext/retry state survive.
        if (Date.now() - Math.max(started, activity.at) > 5 * 60 * 1000) return { reason: 'WORKER_IDLE_BUDGET' };
      }
      // Rate limiting uploads must not suspend license renewal for new educational turns.
      if (!result && Date.now() < nextAttemptAt) {
        await wait(Math.min(1000, nextAttemptAt - Date.now())); continue;
      }
      if (!result) result = await drain(ctx);
      if (result?.stop) { R.record(ctx, 'excluded', result.reason, 0); return result; }
      if (result?.retry) {
        attempts++;
        const retryMs = result.retryMs || Math.min(60000, 1000 * (2 ** Math.min(attempts, 6)));
        nextAttemptAt = Date.now() + retryMs;
        if (result.leaseRetry) leaseRetryAt = nextAttemptAt;
        R.update(ctx, { next_retry_at: new Date(nextAttemptAt).toISOString(), last_problem: result.reason });
        if (options.once) return result;
        await wait(Math.min(1000, retryMs));
      } else {
        attempts = 0; nextAttemptAt = 0;
        if (R.state(ctx).next_retry_at) R.update(ctx, { next_retry_at: null });
        if (options.once) return result;
        if (result?.empty && !activeTurn && Date.now() - activity.at > R.IDLE_TTL) return result;
        await wait(result?.empty ? 1000 : 10);
      }
    }
    return { reason: options.signal?.aborted ? 'WORKER_CANCELLED' : 'WORKER_TIME_BUDGET' };
  } catch (e) { R.record(ctx, 'excluded', /^(UNSUPPORTED|SECURE_|UNSAFE_)/.test(e.message) ? e.message : 'WORKER_FAILED', 0); return { stop: true, reason: 'WORKER_FAILED' }; }
  finally { release(); }
}
if (require.main === module) {
  process.on('uncaughtException', () => process.exit(0)); process.on('unhandledRejection', () => process.exit(0));
  work(process.argv[2] || process.cwd(), process.argv[3] || 'claude-code').then(() => process.exit(0), () => process.exit(0));
}
module.exports = { baseUrl, request, getCredential, lease, drain, cleanup, work };
