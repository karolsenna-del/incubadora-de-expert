'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CRED_DIR = path.join(os.homedir(), '.arcane');
const CRED_FILE = path.join(CRED_DIR, 'credentials.json');

function ensureDir() {
  if (!fs.existsSync(CRED_DIR)) {
    fs.mkdirSync(CRED_DIR, { recursive: true, mode: 0o700 });
  } else {
    try {
      fs.chmodSync(CRED_DIR, 0o700);
    } catch {}
  }
}

function load() {
  if (!fs.existsSync(CRED_FILE)) return null;
  try {
    const raw = fs.readFileSync(CRED_FILE, 'utf8');
    const data = JSON.parse(raw);
    if (!data.access_token || !data.refresh_token || !data.user) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function save(cred) {
  ensureDir();
  const payload = {
    access_token: cred.access_token,
    refresh_token: cred.refresh_token,
    expires_at: cred.expires_at,
    user: {
      id: cred.user.id,
      email: cred.user.email,
    },
    last_validated_at: cred.last_validated_at || Math.floor(Date.now() / 1000),
    last_status: cred.last_status || 'unknown',
  };
  fs.writeFileSync(CRED_FILE, JSON.stringify(payload, null, 2), { mode: 0o600 });
  try {
    fs.chmodSync(CRED_FILE, 0o600);
  } catch {}
  return payload;
}

function clear() {
  if (fs.existsSync(CRED_FILE)) {
    fs.unlinkSync(CRED_FILE);
    return true;
  }
  return false;
}

function isExpired(cred) {
  if (!cred || !cred.expires_at) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= cred.expires_at - 60;
}

module.exports = { load, save, clear, isExpired, CRED_DIR, CRED_FILE };
