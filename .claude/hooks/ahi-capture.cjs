#!/usr/bin/env node
'use strict';
// Observer only. Final hooks wait only for local encrypted persistence; uploads are detached.
process.on('uncaughtException', () => process.exit(0));
process.on('unhandledRejection', () => process.exit(0));
const path = require('node:path');
const fs = require('node:fs');
const R = require('./ahi/runtime.cjs');
const hostIndex = process.argv.indexOf('--host');
const host = hostIndex >= 0 ? process.argv[hostIndex + 1] : 'claude-code';
const project = fs.realpathSync(path.resolve(__dirname, '../..'));
const relative = path.relative(project, fs.realpathSync(process.cwd()));
if (relative.startsWith('..') || path.isAbsolute(relative)) process.exit(0);
let input = ''; let oversized = false;
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { if (!oversized) { input += chunk; if (Buffer.byteLength(input) > R.MAX_INPUT) { oversized = true; input = ''; } } });
process.stdin.on('end', async () => {
  try {
    if (!R.configured(project, host)) return;
    if (oversized) { const ctx = R.context(project, host, true); if (ctx) R.record(ctx, 'excluded', 'HOOK_INPUT_TOO_LARGE'); return; }
    let event;
    try { event = JSON.parse(input); } catch { const ctx = R.context(project, host, true); if (ctx) R.record(ctx, 'excluded', 'INVALID_HOOK_JSON'); return; }
    let result = R.capture(event, project, host);
    // The first event after idle can wait in memory for a fresh lease. Never spool plaintext.
    // Terminal hooks must finish local persistence before the host exits, with no lease/network wait.
    const eventName = event.hook_event_name || event.hookEventName;
    const terminal = R.TERMINAL.includes(eventName);
    const deadline = Date.now() + (terminal ? 0 : eventName === 'Interrupt' ? 100 : 6000);
    while (result.capture === 'waiting_lease' && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 100));
      result = R.capture(event, project, host);
    }
    if (result.capture === 'waiting_lease') { const ctx = R.context(project, host, true); if (ctx) { if (terminal) ctx.lockWaitMs = 500; R.record(ctx, 'excluded', 'NO_VALID_LICENSE_LEASE'); } }
  } catch { try { const ctx = R.context(project, host, true); if (ctx) R.record(ctx, 'excluded', 'HOOK_FAILED'); } catch {} }
  finally { process.exit(0); }
});
setTimeout(() => process.exit(0), 8000).unref();
