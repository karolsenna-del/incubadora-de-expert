#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fs.realpathSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const errors = [];
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const isDistributionRepo = packageJson.name === 'auroq-os';

const requiredPaths = [
  'AGENTS.md',
  'README.md',
  '.auroq-core/constitution.md',
  '.auroq-core/core-config.yaml',
  '.claude/CLAUDE.md',
  '.claude/commands',
  '.claude/rules',
  '.synapse/manifest',
  'agents',
  'scripts/sync-codex-skills.mjs',
];
if (isDistributionRepo) requiredPaths.push('bin/auroq-os.js');

for (const relative of requiredPaths) {
  if (!fs.existsSync(path.join(root, relative))) errors.push(`Ausente: ${relative}`);
}

const requiredScripts = isDistributionRepo
  ? ['lint', 'typecheck', 'test', 'build', 'sync:codex', 'sync:codex:check']
  : ['auroq:sync:codex', 'auroq:sync:codex:check', 'auroq:validate'];
for (const script of requiredScripts) {
  if (!packageJson.scripts?.[script]) errors.push(`Script ausente: ${script}`);
}

const commandRoot = path.join(root, '.claude', 'commands');
let commandCount = 0;
for (const entry of fs.readdirSync(commandRoot, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.md')) commandCount += 1;
}
const coreAgents = path.join(commandRoot, 'AuroqOS', 'agents');
if (fs.existsSync(coreAgents)) commandCount += fs.readdirSync(coreAgents).filter((name) => name.endsWith('.md')).length;
if (commandCount < 9) errors.push(`Poucos comandos descobertos: ${commandCount}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validacao hibrida passou (${commandCount} comandos descobertos)`);
