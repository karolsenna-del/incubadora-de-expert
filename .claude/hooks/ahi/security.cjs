'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const SECRET_KEY = /(?:password|passwd|senha|secret|token|authorization|cookie|api.?key|private.?key|credentials?|^env$|^environment$)/i;
const REDACTED = '[REDACTED]';
function hash(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function id(value) { const h = hash(value); return `${h.slice(0, 8)}-${h.slice(8, 12)}-5${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`; }
function scrub(value) {
  let redacted = false; let excluded = 0;
  const replace = (s, re, out = REDACTED) => s.replace(re, () => { redacted = true; return out; });
  function text(s) {
    s = replace(s, /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g);
    s = s.replace(/((?:minha\s+)?(?:senha|password|token|api[_-]?key)\s+(?:é|eh|is)\s+)(?:"[^"\n]*"|'[^'\n]*'|[^\s,;}]+)/gi, (_, prefix) => { redacted = true; return `${prefix}${REDACTED}`; });
    s = replace(s, /\b(?:Bearer|Basic)\s+\S+/gi);
    s = replace(s, /\b(?:sk-(?:proj-|ant-|live_|test_)?|gh[pousr]_|github_pat_|xox[baprs]-|AKIA|ASIA|AIza)[A-Za-z0-9_\-]{12,}/g);
    s = replace(s, /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g);
    s = s.replace(/([a-z][a-z0-9+.-]*:\/\/)([^\s/@]+@)/gi, (_, scheme) => { redacted = true; return `${scheme}${REDACTED}@`; });
    s = s.replace(/([?&](?:[^=\s]*(?:token|key|secret|password|signature|credential)[^=\s]*)=)[^&#\s]*/gi, (_, prefix) => { redacted = true; return `${prefix}${REDACTED}`; });
    s = s.replace(/((?:password|passwd|senha|secret|token|api[_-]?key|authorization|cookie)[\"']?\s*[=:]\s*)(?:"[^"\n]*"|'[^'\n]*'|[^\s,;}]+)/gi, (_, prefix) => { redacted = true; return `${prefix}${REDACTED}`; });
    // Unknown long opaque strings are not safe to archive. Fail closed for that value.
    s = replace(s, /\b[A-Za-z0-9_+/=-]{32,}\b/g);
    return s;
  }
  function walk(v, depth) {
    if (depth > 10) { excluded++; return '[EXCLUDED:depth]'; }
    if (typeof v === 'string') {
      if (/^\s*[\[{"]/.test(v)) { try { return JSON.stringify(walk(JSON.parse(v), depth + 1)); } catch {} }
      return text(v);
    }
    if (v === null || typeof v === 'boolean' || (typeof v === 'number' && Number.isFinite(v))) return v;
    if (Array.isArray(v)) { if (v.length > 200) excluded += v.length - 200; return v.slice(0, 200).map(x => walk(x, depth + 1)); }
    if (v && typeof v === 'object') {
      const out = {}; const entries = Object.entries(v);
      if (entries.length > 200) excluded += entries.length - 200;
      for (const [k, x] of entries.slice(0, 200)) {
        if (['__proto__', 'constructor', 'prototype'].includes(k)) { excluded++; continue; }
        if (SECRET_KEY.test(k)) { out[k] = REDACTED; redacted = true; }
        else out[text(k)] = walk(x, depth + 1);
      }
      return out;
    }
    excluded++; return '[EXCLUDED:type]';
  }
  const clean = walk(value, 0);
  return { value: clean, redacted, excluded };
}
function safePath(file) {
  let cursor = path.resolve(file);
  while (cursor !== path.dirname(cursor)) {
    try { if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('UNSAFE_SYMLINK'); } catch (e) { if (e.code !== 'ENOENT') throw e; }
    cursor = path.dirname(cursor);
  }
}
function powershell(script, input) {
  // Windows PowerShell 5.1 must build its own module path when launched through Node/pwsh 7.
  // Keep the caller's environment unchanged, including differently cased Windows names.
  const env = Object.fromEntries(Object.entries(process.env).filter(([name]) => name.toLowerCase() !== 'psmodulepath'));
  const result = spawnSync('powershell.exe', ['-NoLogo', '-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(`$ErrorActionPreference='Stop'; $PSModuleAutoLoadingPreference='None'; ${script}`, 'utf16le').toString('base64')], { input, env, encoding: 'utf8', timeout: 5000, windowsHide: true, maxBuffer: 65536 });
  if (result.status !== 0 || result.error) throw new Error('SECURE_STORAGE_UNAVAILABLE');
  return result.stdout.trim();
}
function protectMany(dirs) {
  const unique = [...new Set(dirs)]; if (!unique.length) return;
  for (const dir of unique) { safePath(dir); fs.mkdirSync(dir, { recursive: true, mode: 0o700 }); }
  if (process.platform === 'win32') {
    // Core .NET APIs avoid the variable cold cost of preparing PowerShell cmdlet modules.
    // Keep the exact same private DACL: current owner + SYSTEM, no inherited external access.
    const encoded = unique.map(dir => `'${Buffer.from(dir).toString('base64')}'`).join(',');
    powershell(`$sid=[Security.Principal.WindowsIdentity]::GetCurrent().User; foreach($encoded in @(${encoded})){ $p=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($encoded)); $acl=[Security.AccessControl.DirectorySecurity]::new(); $acl.SetOwner($sid); $acl.SetAccessRuleProtection($true,$false); foreach($s in @($sid,[Security.Principal.SecurityIdentifier]::new('S-1-5-18'))){ $rule=[Security.AccessControl.FileSystemAccessRule]::new($s,[Security.AccessControl.FileSystemRights]::FullControl,[Security.AccessControl.InheritanceFlags]'ContainerInherit,ObjectInherit',[Security.AccessControl.PropagationFlags]::None,[Security.AccessControl.AccessControlType]::Allow); [void]$acl.AddAccessRule($rule) }; [void][IO.Directory]::SetAccessControl($p,$acl) }`);
  } else {
    for (const dir of unique) {
      fs.chmodSync(dir, 0o700);
      const stat = fs.statSync(dir);
      if ((stat.mode & 0o077) !== 0 || (process.getuid && stat.uid !== process.getuid())) throw new Error('UNSAFE_PERMISSIONS');
    }
  }
}
function protect(dir) { protectMany([dir]); }
// Non-durable mode is only for transient process lock/activity hints, never queue/ACK/key material.
function atomic(file, value, exclusive = false, durable = true) {
  safePath(file);
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  const fd = fs.openSync(tmp, 'wx', 0o600);
  try { fs.writeFileSync(fd, typeof value === 'string' ? value : JSON.stringify(value)); if (durable) fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  try {
    if (exclusive) { fs.linkSync(tmp, file); fs.unlinkSync(tmp); }
    else fs.renameSync(tmp, file);
    if (durable && process.platform !== 'win32') { const dir = fs.openSync(path.dirname(file), 'r'); try { fs.fsyncSync(dir); } finally { fs.closeSync(dir); } }
  } catch (e) { try { fs.unlinkSync(tmp); } catch {} throw e; }
}
function read(file, fallback = null) {
  try { safePath(file); const st = fs.statSync(file); if (st.size > 1024 * 1024) return fallback; return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function keyFor(ctx, create = false) {
  if (process.env.NODE_ENV === 'test' && process.env.AHI_TEST_MODE === '1' && process.env.AHI_TEST_NATIVE_KEYSTORE !== '1') {
    if (!/^[a-f0-9]{64}$/.test(process.env.AHI_TEST_KEY || '')) throw new Error('SECURE_STORAGE_UNAVAILABLE');
    return Buffer.from(process.env.AHI_TEST_KEY, 'hex');
  }
  if (!/^[a-f0-9]{64}$/.test(ctx.accountKey)) throw new Error('UNSAFE_ACCOUNT_KEY');
  if (process.platform === 'darwin') {
    const service = 'education.arka.ahi.v2'; const account = ctx.accountKey;
    const keychain = ctx.keychainPath && /^[A-Za-z0-9_./-]+$/.test(ctx.keychainPath) ? ctx.keychainPath : null;
    const find = () => spawnSync('/usr/bin/security', ['find-generic-password', '-s', service, '-a', account, '-w', ...(keychain ? [keychain] : [])], { encoding: 'utf8', timeout: 1200, maxBuffer: 4096 });
    let result = find();
    if (result.status !== 0 && create) {
      const key = crypto.randomBytes(32).toString('hex');
      // Interactive command from stdin keeps key material out of process arguments.
      const add = spawnSync('/usr/bin/security', ['-i'], { input: `add-generic-password -s ${service} -a ${account} -w ${key}${keychain ? ` ${keychain}` : ''}\n`, encoding: 'utf8', timeout: 1500, maxBuffer: 4096 });
      if (add.error) throw new Error('SECURE_STORAGE_UNAVAILABLE');
      result = find();
    }
    const raw = (result.stdout || '').trim();
    if (result.status !== 0 || !/^[a-f0-9]{64}$/.test(raw)) throw new Error('SECURE_STORAGE_UNAVAILABLE');
    return Buffer.from(raw, 'hex');
  }
  if (process.platform === 'win32') {
    const file = path.join(ctx.accountDir, 'key.dpapi');
    if (!fs.existsSync(file)) {
      if (!create) throw new Error('SECURE_STORAGE_UNAVAILABLE');
      const wrapped = powershell("[void][Reflection.Assembly]::Load('System.Security, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'); $b=[byte[]]::new(32); $rng=[Security.Cryptography.RandomNumberGenerator]::Create(); try { $rng.GetBytes($b); [Console]::Write([Convert]::ToBase64String([Security.Cryptography.ProtectedData]::Protect($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser))) } finally { $rng.Dispose(); [Array]::Clear($b,0,$b.Length) }");
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(wrapped) || Buffer.from(wrapped, 'base64').length < 32) throw new Error('SECURE_STORAGE_UNAVAILABLE');
      try { atomic(file, wrapped, true); } catch (e) { if (e.code !== 'EEXIST') throw e; }
    }
    safePath(file);
    const wrapped = fs.readFileSync(file, 'utf8');
    const raw = powershell("[void][Reflection.Assembly]::Load('System.Security, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a'); $b=[Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()); $plain=[Security.Cryptography.ProtectedData]::Unprotect($b,$null,[Security.Cryptography.DataProtectionScope]::CurrentUser); try { [Console]::Write([Convert]::ToBase64String($plain)) } finally { [Array]::Clear($plain,0,$plain.Length) }", wrapped);
    const key = Buffer.from(raw, 'base64'); if (key.length !== 32) throw new Error('SECURE_STORAGE_UNAVAILABLE'); return key;
  }
  throw new Error('UNSUPPORTED_OS_KEYSTORE');
}
function encrypt(value, key, scope) {
  const iv = crypto.randomBytes(12); const cipher = crypto.createCipheriv('aes-256-gcm', key, iv); cipher.setAAD(Buffer.from(`ahi-envelope-v2:${scope}`));
  const body = Buffer.concat([cipher.update(JSON.stringify(value)), cipher.final()]);
  return { v: 2, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), body: body.toString('base64') };
}
function decrypt(value, key, scope) {
  if (!value || value.v !== 2) throw new Error('QUEUE_CORRUPT');
  const cipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(value.iv, 'base64')); cipher.setAAD(Buffer.from(`ahi-envelope-v2:${scope}`)); cipher.setAuthTag(Buffer.from(value.tag, 'base64'));
  return JSON.parse(Buffer.concat([cipher.update(Buffer.from(value.body, 'base64')), cipher.final()]).toString('utf8'));
}
function privateKey(seed) {
  return crypto.createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b656e04220420', 'hex'), seed]), format: 'der', type: 'pkcs8' });
}
function publicKey(seed) { return crypto.createPublicKey(privateKey(seed)).export({ format: 'der', type: 'spki' }).toString('base64'); }
function seal(value, recipient, scope) {
  const pair = crypto.generateKeyPairSync('x25519');
  const publicRecipient = crypto.createPublicKey({ key: Buffer.from(recipient, 'base64'), format: 'der', type: 'spki' });
  const shared = crypto.diffieHellman({ privateKey: pair.privateKey, publicKey: publicRecipient });
  const key = Buffer.from(crypto.hkdfSync('sha256', shared, Buffer.from(scope), Buffer.from('ahi-envelope-v2'), 32));
  const result = encrypt(value, key, scope); key.fill(0); shared.fill(0);
  result.ephemeral = pair.publicKey.export({ format: 'der', type: 'spki' }).toString('base64');
  return result;
}
function open(value, seed, scope) {
  const publicSender = crypto.createPublicKey({ key: Buffer.from(value.ephemeral, 'base64'), format: 'der', type: 'spki' });
  const shared = crypto.diffieHellman({ privateKey: privateKey(seed), publicKey: publicSender });
  const key = Buffer.from(crypto.hkdfSync('sha256', shared, Buffer.from(scope), Buffer.from('ahi-envelope-v2'), 32));
  try { return decrypt(value, key, scope); } finally { key.fill(0); shared.fill(0); }
}
module.exports = { hash, id, scrub, protect, protectMany, safePath, atomic, read, keyFor, encrypt, decrypt, publicKey, seal, open };
