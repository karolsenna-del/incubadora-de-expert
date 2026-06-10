import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = fs.realpathSync(process.cwd());
const script = path.join(root, 'scripts', 'sync-codex-skills.mjs');

function run(home, args, cwd = root) {
  return execFileSync(process.execPath, [script, ...args], {
    cwd,
    env: { ...process.env, HOME: home },
    encoding: 'utf8',
  });
}

test('sync global e portavel, deterministico e preserva skills externas', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'auroq-os-test-'));
  const out = path.join(home, '.agents', 'skills');
  try {
    fs.mkdirSync(path.join(out, 'externa'), { recursive: true });
    fs.writeFileSync(path.join(out, 'externa', 'SKILL.md'), 'externa\n');
    const first = run(home, ['--global', '--clean'], os.tmpdir());
    assert.match(first, /9 skills sincronizadas/);
    assert.equal(fs.readFileSync(path.join(out, 'externa', 'SKILL.md'), 'utf8'), 'externa\n');
    assert.ok(fs.existsSync(path.join(out, 'companion', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(out, 'ops', 'SKILL.md')));
    assert.match(fs.readFileSync(path.join(out, 'companion', 'SKILL.md'), 'utf8'), new RegExp(root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(run(home, ['--global', '--check']), /9 skills verificadas/);
    const snapshot = fs.readFileSync(path.join(out, 'ops', 'SKILL.md'), 'utf8');
    run(home, ['--global', '--clean']);
    assert.equal(fs.readFileSync(path.join(out, 'ops', 'SKILL.md'), 'utf8'), snapshot);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});

test('check detecta drift e sync bloqueia colisao externa', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'auroq-os-test-'));
  const out = path.join(home, '.agents', 'skills');
  try {
    run(home, ['--global']);
    fs.appendFileSync(path.join(out, 'ops', 'SKILL.md'), '\ndrift\n');
    const drift = spawnSync(process.execPath, [script, '--global', '--check'], {
      cwd: root,
      env: { ...process.env, HOME: home },
      encoding: 'utf8',
    });
    assert.notEqual(drift.status, 0);
    assert.match(drift.stderr, /Drift de conteudo: ops/);

    fs.rmSync(path.join(out, 'ops'), { recursive: true, force: true });
    fs.mkdirSync(path.join(out, 'ops'), { recursive: true });
    fs.writeFileSync(path.join(out, 'ops', 'SKILL.md'), 'externa\n');
    const collision = spawnSync(process.execPath, [script, '--global'], {
      cwd: root,
      env: { ...process.env, HOME: home },
      encoding: 'utf8',
    });
    assert.notEqual(collision.status, 0);
    assert.match(collision.stderr, /Recusando sobrescrever/);
  } finally {
    fs.rmSync(home, { recursive: true, force: true });
  }
});
