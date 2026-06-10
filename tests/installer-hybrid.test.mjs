import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const root = fs.realpathSync(process.cwd());

test('installer entrega projeto hibrido funcional sem sobrescrever package scripts', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'auroq-install-test-'));
  const fakeHome = fs.mkdtempSync(path.join(os.tmpdir(), 'auroq-home-test-'));
  try {
    fs.writeFileSync(path.join(target, 'package.json'), `${JSON.stringify({
      name: 'negocio-do-aluno',
      private: true,
      scripts: { negocio: 'echo preservado' },
    }, null, 2)}\n`);

    execFileSync(process.execPath, [path.join(root, 'bin', 'auroq-os.js'), 'init'], {
      cwd: target,
      env: { ...process.env, NODE_ENV: 'test', AUROQ_SKIP_AUTH: '1', HOME: fakeHome },
      encoding: 'utf8',
      stdio: 'pipe',
    });

    const installedPackage = JSON.parse(fs.readFileSync(path.join(target, 'package.json'), 'utf8'));
    assert.equal(installedPackage.scripts.negocio, 'echo preservado');
    assert.equal(installedPackage.scripts['auroq:sync:codex'], 'node scripts/sync-codex-skills.mjs --clean');
    assert.ok(fs.existsSync(path.join(target, '.agents', 'skills', 'companion', 'SKILL.md')));
    assert.ok(fs.existsSync(path.join(target, '.agents', 'skills', 'ops', 'SKILL.md')));
    assert.equal(fs.existsSync(path.join(fakeHome, '.agents', 'skills')), false);

    const check = execFileSync(process.execPath, [path.join(target, 'scripts', 'sync-codex-skills.mjs'), '--check'], {
      cwd: os.tmpdir(),
      encoding: 'utf8',
    });
    assert.match(check, /9 skills verificadas/);

    const validation = execFileSync('npm', ['run', 'auroq:validate'], {
      cwd: target,
      encoding: 'utf8',
    });
    assert.match(validation, /Validacao hibrida passou \(9 comandos descobertos\)/);

    fs.writeFileSync(path.join(target, '.claude', 'commands', 'squad-anuncios-arcane.md'), `# squad-anuncios-arcane

CRITICAL: Read and execute \`agents/squad-anuncios-arcane/tasks/start.md\`.
`);
    fs.mkdirSync(path.join(target, 'agents', 'squad-anuncios-arcane', 'tasks'), { recursive: true });
    fs.writeFileSync(path.join(target, 'agents', 'squad-anuncios-arcane', 'tasks', 'start.md'), '# Start\n');
    execFileSync(process.execPath, [path.join(target, 'scripts', 'sync-codex-skills.mjs'), '--clean'], { cwd: target });
    assert.ok(fs.existsSync(path.join(target, '.agents', 'skills', 'squad-anuncios-arcane', 'SKILL.md')));
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
    fs.rmSync(fakeHome, { recursive: true, force: true });
  }
});
