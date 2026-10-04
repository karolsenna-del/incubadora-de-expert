'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const S = require('./security.cjs');
const VERSION = 'ahi-hooks-v2';
const MAX_INPUT = 1024 * 1024;
const MAX_EVENT = 60 * 1024;
const MAX_QUEUE = 100 * 1024 * 1024;
const MAX_FILES = 10000;
const TTL = 7 * 24 * 3600 * 1000;
const ACTIVE_TURN_TTL = 60 * 60 * 1000;
const IDLE_TTL = 60 * 1000;
const TERMINAL = ['Stop', 'SubagentStop', 'StopFailure', 'SessionEnd'];
const TYPES = { UserPromptSubmit: 'message.user', Stop: 'message.assistant', SubagentStop: 'message.assistant', PreToolUse: 'tool.started', PostToolUse: 'tool.completed', PostToolUseFailure: 'tool.failed', SessionStart: 'session.started', SessionEnd: 'session.ended', Interrupt: 'coverage.gap', StopFailure: 'coverage.gap' };
function credential() {
  const cred = S.read(path.join(os.homedir(), '.arcane', 'credentials.json'));
  return cred && /^[a-zA-Z0-9_-]{1,200}$/.test(cred.user?.id || '') && typeof cred.access_token === 'string' ? cred : null;
}
function configured(cwd, host = 'claude-code') {
  if (host === 'codex') {
    try {
      const toml = fs.readFileSync(path.join(cwd, '.codex', 'config.toml'), 'utf8');
      const block = toml.match(/^\[mcp_servers\.arcane\]\s*\n([\s\S]*?)(?=^\[|$(?![\s\S]))/m)?.[1];
      if (!block || /^\s*enabled\s*=\s*false/m.test(block)) return false;
    } catch { return false; }
  }
  const mcp = S.read(path.join(cwd, '.mcp.json'))?.mcpServers?.arcane;
  if (!mcp || mcp.disabled === true || mcp.enabled === false) return false;
  if (host === 'claude-code') {
    for (const file of ['settings.json', 'settings.local.json']) {
      const settings = S.read(path.join(cwd, '.claude', file), {});
      if (settings.disableAllHooks || settings.disabledMcpjsonServers?.includes('arcane')) return false;
    }
  }
  return true;
}
function resolveProject(cwd) {
  const original = fs.realpathSync(cwd); let current = original;
  for (let depth = 0; depth < 32; depth++) {
    if (fs.existsSync(path.join(current, '.mcp.json')) || fs.existsSync(path.join(current, '.claude/hooks/ahi-capture.cjs'))) return current;
    if (fs.existsSync(path.join(current, '.git'))) return original;
    const parent = path.dirname(current); if (parent === current) break; current = parent;
  }
  return original;
}
function context(cwd = process.cwd(), host = 'claude-code', initialize = false) {
  const project = resolveProject(cwd); const cred = credential();
  if (!cred) return null;
  const accountKey = S.hash(cred.user.id); const projectKey = S.hash(project);
  const root = path.join(os.homedir(), '.arcane', 'ahi-v2');
  const accountDir = path.join(root, accountKey); const dir = path.join(accountDir, projectKey);
  const ctx = { project, host, cred, authId: cred.user.id, accountKey, projectKey, accountDir, dir, outbox: path.join(dir, 'outbox'), orderDir: path.join(dir, 'order'), scope: `${accountKey}:${projectKey}` };
  if (initialize) {
    for (const folder of [root, accountDir, dir, ctx.outbox, ctx.orderDir]) { S.safePath(folder); fs.mkdirSync(folder, { recursive: true, mode: 0o700 }); }
  }
  return ctx;
}
function lock(ctx, name, waitMs = ctx.lockWaitMs ?? 1500) {
  const dir = path.join(ctx.dir, name); const start = Date.now();
  while (true) {
    try { fs.mkdirSync(dir, { mode: 0o700 }); S.atomic(path.join(dir, 'owner.json'), { pid: process.pid, created: Date.now() }, false, false); return () => { try { fs.rmSync(dir, { recursive: true }); } catch {} }; }
    catch (e) {
      if (e.code !== 'EEXIST') throw e;
      S.safePath(dir);
      const owner = S.read(path.join(dir, 'owner.json'));
      let alive = true;
      if (owner?.pid) { try { process.kill(owner.pid, 0); } catch (err) { alive = err.code !== 'ESRCH'; } }
      else { try { alive = Date.now() - fs.statSync(dir).mtimeMs < 10000; } catch { continue; } }
      if (!alive) { try { fs.rmSync(dir, { recursive: true }); } catch {} continue; }
      if (Date.now() - start >= waitMs) return null;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 10);
    }
  }
}
function state(ctx) { return S.read(path.join(ctx.dir, 'status.json'), { captured: 0, acked: 0, discarded: 0, excluded: 0, coverage: 'partial' }); }
function update(ctx, changes) { S.atomic(path.join(ctx.dir, 'status.json'), { ...state(ctx), ...changes }); }
function record(ctx, kind, reason, count = 1) {
  const release = lock(ctx, 'state.lock'); if (!release) return;
  try {
    const current = state(ctx);
    const changes = { [kind]: (current[kind] || 0) + count, last_problem: reason, last_problem_at: new Date().toISOString(), coverage: 'partial' };
    update(ctx, changes);
    const file = path.join(ctx.dir, 'receipts.jsonl');
    if (fs.existsSync(file) && fs.statSync(file).size > 1024 * 1024) fs.renameSync(file, path.join(ctx.dir, 'receipts.previous.jsonl'));
    fs.appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), kind, reason, count }) + '\n', { mode: 0o600 });
  } finally { release(); }
}
function validLease(ctx, session) {
  const lease = S.read(path.join(ctx.dir, `lease-${S.hash(`${ctx.host}:${session || ''}`)}.json`));
  // Boot marker + monotonic uptime prevent restart/offline and clock rollback extending a lease.
  return lease?.enabled === true && lease.host === ctx.host && lease.native_session_id === session && lease.auth_user_id === ctx.authId && lease.boot === boot() && os.uptime() >= lease.uptime && os.uptime() < lease.untilUptime && Date.now() < lease.until ? lease : null;
}
function boot() { return Math.round((Date.now() / 1000 - os.uptime()) / 10); }
function orderName(row) {
  return `${String(row.captured_at).padStart(13, '0')}-${String(row.capture_order || 0).padStart(10, '0')}-${row.event.event_id}`;
}
function queueFiles(ctx) {
  try {
    const indexed = fs.readdirSync(ctx.orderDir).filter(name => /^\d{13}-\d{10}-[0-9a-f-]{36}$/.test(name)).sort();
    const rows = indexed.map(name => ({ order: name, file: path.join(ctx.outbox, `${name.slice(-36)}.json`) })).filter(x => fs.existsSync(x.file));
    const known = new Set(rows.map(x => path.basename(x.file)));
    // Recovery for an interrupted upgrade/legacy v2 writer: rare orphans only, not every ciphertext per batch.
    for (const name of fs.readdirSync(ctx.outbox).filter(n => /^[0-9a-f-]{36}\.json$/.test(n) && !known.has(n))) {
      const file = path.join(ctx.outbox, name); const envelope = S.read(file);
      const time = Number(envelope?.queued_at) || fs.statSync(file).mtimeMs;
      rows.push({ order: `${String(Math.floor(time)).padStart(13, '0')}-${String(envelope?.capture_order || 0).padStart(10, '0')}-${name}`, file });
    }
    return rows.sort((a, b) => a.order.localeCompare(b.order)).map(x => x.file);
  } catch { return []; }
}
function removeOrder(ctx, eventId) {
  try { for (const name of fs.readdirSync(ctx.orderDir).filter(x => x.endsWith(eventId))) fs.unlinkSync(path.join(ctx.orderDir, name)); } catch {}
}
function queueBytes(ctx) {
  try { return fs.readdirSync(ctx.outbox).reduce((n, name) => { const st = fs.lstatSync(path.join(ctx.outbox, name)); return n + (st.isFile() ? st.size : 0); }, 0); } catch { return 0; }
}
function queueRow(ctx, row, publicKey) {
  const file = path.join(ctx.outbox, `${row.event.event_id}.json`);
  if (fs.existsSync(file)) return false;
  if (S.read(path.join(ctx.dir, `terminal-${row.event.event_id}.json`))) return false;
  const sealed = S.seal(row, publicKey, ctx.scope); sealed.session_key = S.hash(`${row.host}:${row.native_session_id}`); sealed.queued_at = row.captured_at; sealed.capture_order = row.capture_order || 0;
  const order = path.join(ctx.orderDir, orderName(row));
  try { S.atomic(order, '', true); } catch (e) { if (e.code !== 'EEXIST') throw e; }
  S.atomic(file, sealed, true);
  return true;
}
function launch(ctx) {
  if (process.env.NODE_ENV === 'test' && process.env.AHI_TEST_NO_WORKER === '1') return;
  try {
    const owner = S.read(path.join(ctx.dir, 'worker.lock', 'owner.json'));
    if (owner?.pid) { try { process.kill(owner.pid, 0); return; } catch {} }
    const child = spawn(process.execPath, [path.join(__dirname, 'worker.cjs'), ctx.project, ctx.host], { cwd: ctx.project, detached: true, windowsHide: true, stdio: 'ignore' });
    child.unref();
  } catch { record(ctx, 'excluded', 'WORKER_UNAVAILABLE', 0); }
}
function sessionFile(ctx, session) { return path.join(ctx.dir, `session-${S.hash(`${ctx.host}:${session}`)}.json`); }
function eventFrom(input, session, occurrence) {
  const name = input.hook_event_name || input.hookEventName;
  const native = input.tool_use_id || input.call_id || input.event_id || input.message_id || (input.turn_id ? `${input.turn_id}:${input.agent_id || ''}` : null);
  const origin = `${name}:${native || `local-${occurrence}`}`;
  let type = TYPES[name];
  if (name === 'PostToolUse' && (input.tool_response?.isError || input.tool_response?.error)) type = 'tool.failed';
  let raw;
  if (type === 'message.user') raw = { text: input.prompt };
  else if (type === 'message.assistant') raw = { text: input.last_assistant_message, agent: input.agent_type || null };
  else if (type?.startsWith('tool.')) raw = { tool: input.tool_name, input: input.tool_input ?? null, output: input.tool_response ?? null, error: input.error ?? null };
  else raw = { reason: name === 'Interrupt' ? 'HOST_INTERRUPTED' : name === 'StopFailure' ? 'HOST_FAILED' : name };
  let reason = null;
  if (!type) { type = 'coverage.gap'; reason = 'UNSUPPORTED_HOOK'; }
  if ((type === 'message.user' || type === 'message.assistant') && typeof raw.text !== 'string') { type = 'coverage.gap'; reason = 'MISSING_MESSAGE_TEXT'; }
  const clean = S.scrub(raw);
  if (Buffer.byteLength(JSON.stringify(clean.value)) > MAX_EVENT) { type = 'coverage.gap'; reason = 'EVENT_TOO_LARGE'; }
  const payload = reason ? { reason, excluded_count: 1 } : { ...clean.value, identity_quality: native ? 'native' : 'local-occurrence', coverage: 'partial', excluded_fields: clean.excluded };
  return { origin, event: { type, occurred_at: new Date().toISOString(), evidence_kind: 'observed', payload, redacted: clean.redacted, truncated: Boolean(reason || clean.excluded) } };
}
function capture(input, cwd = process.cwd(), host = 'claude-code') {
  if (!['claude-code', 'codex'].includes(host) || !configured(cwd, host)) return { capture: 'off', reason: 'MCP_DISABLED' };
  const ctx = context(cwd, host, true);
  if (!ctx) return { capture: 'off', reason: 'AUTH_REQUIRED' };
  const nativeSession = input.session_id || input.sessionId;
  const session = typeof nativeSession === 'string' ? (/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(nativeSession) ? nativeSession.toLowerCase() : S.id(nativeSession)) : null;
  const name = input.hook_event_name || input.hookEventName;
  // Allow an ordinary concurrent capture to finish; two bounded local waits stay below the host's 3s timeout.
  if (TERMINAL.includes(name)) ctx.lockWaitMs = 500;
  if (typeof session !== 'string' || !/^[a-zA-Z0-9_-]{1,200}$/.test(session) || !TYPES[name]) { record(ctx, 'excluded', 'UNSUPPORTED_SCHEMA'); return { capture: 'unsupported' }; }
  S.atomic(path.join(ctx.dir, 'activity.json'), { at: Date.now(), host }, false, false);
  const release = lock(ctx, 'capture.lock');
  if (!release) { record(ctx, 'excluded', 'CAPTURE_BUSY'); return { capture: 'error' }; }
  try {
    const sf = sessionFile(ctx, session); const sess = S.read(sf, { seen_mcp: false, occurrence: 0 });
    if (sess.revoked) return { capture: 'off', reason: 'SESSION_REVOKED' };
    const usesMcp = /^mcp__arcane__/.test(input.tool_name || '') && /^(PreToolUse|PostToolUse|PostToolUseFailure)$/.test(name);
    if (usesMcp) sess.seen_mcp = true;
    sess.native_session_id = session; sess.occurrence++; sess.last_hook = name; sess.host = host; sess.active = name !== 'SessionEnd'; sess.last_seen = Date.now();
    // Only real host activity extends a turn. License heartbeats never touch this deadline.
    if (name === 'UserPromptSubmit' || ['PreToolUse', 'PostToolUse', 'PostToolUseFailure'].includes(name)) {
      sess.turn_active = true; sess.turn_deadline = sess.last_seen + ACTIVE_TURN_TTL; sess.turn_expired = false;
    } else if (['Stop', 'StopFailure', 'SessionEnd', 'Interrupt'].includes(name)) {
      sess.turn_active = false; sess.turn_deadline = null;
    } else if (name === 'SubagentStop' && sess.turn_active) {
      // The child finishing is activity, not the end of its parent's turn.
      sess.turn_deadline = sess.last_seen + ACTIVE_TURN_TTL;
    }
    S.atomic(sf, sess);
    if (!sess.seen_mcp) { launch(ctx); return { capture: 'waiting_mcp', reason: 'NO_MCP_USE_IN_SESSION' }; }
    if (!validLease(ctx, session)) { launch(ctx); return { capture: 'waiting_lease' }; }
    const publicKey = S.read(path.join(ctx.dir, 'public-key.json'))?.key;
    if (!publicKey || S.hash(publicKey) !== validLease(ctx, session).key_fingerprint) { record(ctx, 'excluded', 'SECURE_STORAGE_UNAVAILABLE'); launch(ctx); return { capture: 'unsupported' }; }
    const files = queueFiles(ctx); const bytes = queueBytes(ctx);
    if (files.length >= MAX_FILES || bytes >= MAX_QUEUE) { record(ctx, 'excluded', 'QUEUE_QUOTA'); launch(ctx); return { capture: 'limited' }; }
    const current = state(ctx);
    if (current.excluded > (current.reported_excluded || 0)) {
      const gapId = S.id(`${ctx.scope}:local-exclusions:${current.excluded}`);
      const gap = { schema_version: 1, host, adapter_version: VERSION, project_key: ctx.projectKey, native_session_id: session, captured_at: Date.now(), event: { event_id: gapId, source_event_id: `CoverageGap:${S.hash(gapId)}`, type: 'coverage.gap', occurred_at: new Date().toISOString(), evidence_kind: 'observed', redacted: false, truncated: true, payload: { reason: 'LOCAL_EXCLUSIONS', scope: 'project', excluded_count: current.excluded - (current.reported_excluded || 0), latest_reason: current.last_problem || 'UNKNOWN', coverage: 'partial' } } };
      queueRow(ctx, gap, publicKey);
      update(ctx, { reported_excluded: current.excluded });
    }
    const item = eventFrom(input, session, sess.occurrence);
    const eventId = S.id(`${ctx.scope}:${host}:${session}:${item.origin}:${S.hash(JSON.stringify(item.event.payload))}`);
    item.event.event_id = eventId; item.event.source_event_id = `${name}:${S.hash(`${item.origin}:${S.hash(JSON.stringify(item.event.payload))}`)}`;
    // Stable identity/revisions, plus first observed timestamp, survive transport retries.
    const row = { schema_version: 1, host, adapter_version: VERSION, project_key: ctx.projectKey, native_session_id: session, captured_at: Date.now(), capture_order: sess.occurrence, event: item.event };
    const added = queueRow(ctx, row, publicKey);
    if (added) {
      const releaseState = lock(ctx, 'state.lock');
      if (releaseState) { try { const st = state(ctx); update(ctx, { captured: st.captured + 1, last_capture_at: new Date().toISOString(), capability: `${host}:hooks-partial`, last_host: host }); } finally { releaseState(); } }
    }
    launch(ctx); return { capture: 'queued', event_id: eventId, duplicate: !added };
  } finally { release(); }
}
function status(cwd = process.cwd(), host = 'claude-code') {
  cwd = resolveProject(cwd);
  const on = configured(cwd, host); const ctx = context(cwd, host);
  const st = ctx ? state(ctx) : {};
  const installed = fs.existsSync(path.join(cwd, '.claude/hooks/ahi-capture.cjs'));
  const files = ctx ? queueFiles(ctx) : [];
  const sessions = ctx && fs.existsSync(ctx.dir) ? fs.readdirSync(ctx.dir).filter(x => /^session-[a-f0-9]+\.json$/.test(x)).map(x => S.read(path.join(ctx.dir, x))).filter(Boolean) : [];
  const activeTurns = sessions.filter(x => x.host === host && x.active && x.turn_active && x.turn_deadline > Date.now()).length;
  const lease = ctx ? sessions.some(x => x.host === host && x.seen_mcp && x.active && validLease(ctx, x.native_session_id)) : null;
  const reason = !on ? 'MCP_DISABLED' : !installed ? 'HOOK_NOT_INSTALLED' : !ctx ? 'AUTH_REQUIRED' : !lease ? 'NO_VALID_LICENSE_LEASE' : !st.last_capture_at ? 'NO_CAPTURE_PROVEN' : null;
  return { ok: true, configured: on, capture: reason ? 'inactive' : 'active_partial', reason, host, adapter_version: VERSION, coverage: 'partial', active_turns: activeTurns, active_turn_timeout_ms: ACTIVE_TURN_TTL, capability: 'visible_hook_messages_and_tools', unsupported: ['intermediate_assistant_messages', 'transcripts', 'binary_artifacts', 'global_history'], pending: files.length, pending_bytes: ctx ? queueBytes(ctx) : 0, last_ack_at: st.last_ack_at || null, captured: st.captured || 0, acked: st.acked || 0, discarded: st.discarded || 0, excluded: st.excluded || 0, last_problem: st.last_problem || null, pause: false, legacy_plaintext_exists: fs.existsSync(path.join(cwd, '.auroq/ahi/events.jsonl')), legacy_imported: false, secure_storage: S.read(ctx ? path.join(ctx.dir, 'public-key.json') : '', {})?.key ? 'public_envelope_os_keystore' : 'unavailable' };
}
module.exports = { VERSION, MAX_INPUT, MAX_EVENT, MAX_QUEUE, MAX_FILES, TTL, ACTIVE_TURN_TTL, IDLE_TTL, TERMINAL, TYPES, credential, configured, resolveProject, context, lock, state, update, record, validLease, boot, queueFiles, queueBytes, queueRow, removeOrder, launch, capture, status };
