#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fs.realpathSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..'));
const args = new Set(process.argv.slice(2));
const localOut = path.join(root, '.agents', 'skills');
const globalOut = path.join(os.homedir(), '.agents', 'skills');
const targets = args.has('--all') ? [localOut, globalOut] : [args.has('--global') ? globalOut : localOut];
const clean = args.has('--clean');
const check = args.has('--check');
const dryRun = args.has('--dry-run');
const adoptLegacy = args.has('--adopt-legacy');
const markerFile = '.auroq-codex-managed';
const legacyMarker = 'managed by scripts/sync-codex-skills.mjs\n';
const packageFile = path.join(root, 'package.json');
const packageJson = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, 'utf8')) : {};
const projectName = packageJson.name || path.basename(root);
const projectId = `${projectName}:${crypto.createHash('sha256').update(root).digest('hex').slice(0, 16)}`;
const marker = `${JSON.stringify({ schema: 2, projectId, projectName, sourceRoot: root }, null, 2)}\n`;
const skills = new Map();

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function kebab(input) {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function sourceRef(file, outRoot) {
  return (outRoot === globalOut ? fs.realpathSync(file) : relative(file)).replaceAll('\\', '/');
}

function summaryFromMarkdown(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const output = [];
  let inFrontmatter = lines[0] === '---';
  for (let index = inFrontmatter ? 1 : 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (inFrontmatter) {
      if (line === '---') inFrontmatter = false;
      continue;
    }
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('CRITICAL:') || line.startsWith('ACTIVATION-NOTICE:') || line.startsWith('```')) break;
    output.push(line);
    if (output.join(' ').length > 420) break;
  }
  return output.join(' ').replace(/\s+/g, ' ').replaceAll('"', "'") || 'Agente do Auroq OS.';
}

const avisos = [];

// Comando oficial = `auroq-<nome>.md` ou o Ops. Numa colisao de nome ele vence; o
// outro comando continua valendo no Claude/Grok e so fica sem skill no Codex.
const oficial = (file) => /^auroq-/.test(path.basename(file)) || relative(file).startsWith('.claude/commands/AuroqOS/');

function registerSkill(name, commandFile) {
  if (!/^[a-z0-9-]+$/.test(name)) {
    avisos.push(`Comando ${relative(commandFile)} ignorado no Codex: nome de skill invalido '${name}'.`);
    return;
  }
  if (skills.has(name)) {
    // Uma colisao (ex: companion.md de antes do prefixo auroq- ao lado de auroq-companion.md)
    // derrubava o sync inteiro — e junto a skill $companion, que a manutencao exige.
    const atual = skills.get(name);
    const [fica, sai] = oficial(commandFile) && !oficial(atual) ? [commandFile, atual] : [atual, commandFile];
    skills.set(name, fica);
    avisos.push(`Colisao de nome '${name}': usando ${relative(fica)}; ${relative(sai)} continua valendo no Claude, sem skill propria no Codex.`);
    return;
  }
  skills.set(name, commandFile);
}

// O aluno da um nome ao Companion no bootstrap (FASE 10 do Ops: /atlas-companion).
// Se o comando base sumiu, $companion continua existindo, apontando pro comando dele.
function comandoDoCompanion(file) {
  try {
    const texto = fs.readFileSync(file, 'utf8');
    return /recurso_id\s*`?companion`?/.test(texto) || /agents\/companion\//.test(texto);
  } catch {
    return false;
  }
}

function garantirAliasCompanion() {
  if (skills.has('companion')) return;
  const candidatos = [...skills.entries()]
    .filter(([name, file]) => name.endsWith('-companion') && comandoDoCompanion(file))
    .sort(([a], [b]) => a.localeCompare(b));
  if (candidatos.length) skills.set('companion', candidatos[0][1]);
}

function collectSkills() {
  const commandRoot = path.join(root, '.claude', 'commands');
  if (!fs.existsSync(commandRoot)) return;

  for (const entry of fs.readdirSync(commandRoot, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const basename = entry.name.replace(/\.md$/, '');
    // Aposentar distribuicao nao apaga comandos vitalicios. Se as duas grafias
    // oficiais coexistem, a ponte usa a antiga preservada; nao mascara outras colisoes.
    const legacyAlias = { 'clone-forge': 'cloneForge', 'mind-forge': 'mindForge', 'squad-forge': 'squadForge', 'worker-forge': 'workerForge' }[basename.replace(/^auroq-/, '')];
    if (legacyAlias && fs.existsSync(path.join(commandRoot, `${legacyAlias}.md`))) continue;
    const name = kebab(basename.replace(/^auroq-/, ''));
    registerSkill(name, path.join(commandRoot, entry.name));
  }

  const coreAgents = path.join(commandRoot, 'AuroqOS', 'agents');
  if (fs.existsSync(coreAgents)) {
    for (const file of fs.readdirSync(coreAgents).filter((name) => name.endsWith('.md')).sort()) {
      registerSkill(kebab(file.replace(/\.md$/, '')), path.join(coreAgents, file));
    }
  }
  garantirAliasCompanion();
}

function skillContent(name, commandFile, outRoot) {
  const commandRef = sourceRef(commandFile, outRoot);
  // Casca de MCP: mandar o Codex "resolver em agents/" faz ele varrer pasta vazia
  // e improvisar. Quando o comando ja aponta pro MCP, a skill tem que dizer o mesmo.
  let viaMcp = false;
  try {
    viaMcp = /MCP `arcane`/.test(fs.readFileSync(commandFile, 'utf8'));
  } catch { /* comando ilegivel = trata como local */ }
  const agentsRef = sourceRef(path.join(root, 'agents'), outRoot);
  const agentsMdRef = sourceRef(path.join(root, 'AGENTS.md'), outRoot);
  const description = `Ativa o agente Auroq '${name}' no Codex CLI. Use quando o usuario digitar $${name}, /${name}, /auroq-${name}, @${name}, pedir o agente '${name}', ou solicitar seu fluxo de trabalho. Fonte de verdade: ${commandRef}.`;
  return `---
name: ${name}
description: >-
  ${description}
---

# ${name}

${summaryFromMarkdown(commandFile)}

## Ativacao

- Leia \`${commandRef}\` por completo.
- Siga as instrucoes CRITICAL exatamente como escritas, incluindo persona, task, dependencias e exit behavior.
${viaMcp
  ? '- O conteudo deste agente vem pelo MCP `arcane`. Nao procurar em `' + agentsRef + '` — la nao ha nada deste agente.'
  : '- Resolva referencias relativas a partir de `' + root.replaceAll('\\', '/') + '`; agentes e squads ficam em `' + agentsRef + '`.'}
- Carregue KBs, tasks e assets apenas quando o comando ou pedido exigir.
- Mantenha a persona ativa ate \`*exit\` ou troca explicita.

## Compatibilidade

- Esta skill e uma ponte fina: Claude Code e Codex compartilham o mesmo comando como fonte de verdade.
- Respeite primeiro \`${agentsMdRef}\`, que replica para o Codex as regras operacionais do Auroq OS.
`;
}

function readOwner(dir) {
  const file = path.join(dir, markerFile);
  if (!fs.existsSync(file)) return { kind: 'unmanaged' };
  const content = fs.readFileSync(file, 'utf8');
  if (content === legacyMarker) return { kind: 'legacy' };
  try {
    const data = JSON.parse(content);
    if (data.projectId === projectId) return { kind: 'owned', data };
    // Mesma pasta de projeto = mesmo dono, mesmo que o name do package tenha
    // mudado depois (ex: marcador gerado antes do package.json existir).
    if (data.sourceRoot && path.resolve(data.sourceRoot) === root) return { kind: 'owned', data };
    // .agents/skills mora DENTRO do projeto: marcador do nosso gerador com outro caminho
    // e a mesma pasta de negocio movida, copiada ou vinda de outra maquina. Tratar como
    // estranho travava o sync inteiro (e com ele a skill $companion) pra sempre.
    if (path.dirname(dir) === localOut && data.schema === 2 && data.projectId) return { kind: 'owned', data, movido: true };
    return { kind: 'foreign', data };
  } catch {
    return { kind: 'foreign', data: { invalidMarker: true } };
  }
}

// Local: pasta de skill sem o nosso marcador e do aluno — fica como esta, com aviso,
// e o resto do sync segue. Global (~/.agents/skills, dividido entre projetos): recusa tudo.
function collisions(outRoot) {
  const preservadas = new Set();
  for (const [name, commandFile] of skills) {
    const dir = path.join(outRoot, name);
    if (!fs.existsSync(dir)) continue;
    const owner = readOwner(dir);
    if (owner.kind === 'owned') continue;
    if (adoptLegacy && owner.kind === 'legacy') continue;
    if (adoptLegacy && owner.kind === 'foreign' && owner.data?.projectName === projectName) continue;
    const existing = path.join(dir, 'SKILL.md');
    if (owner.kind === 'legacy' && fs.existsSync(existing) && fs.readFileSync(existing, 'utf8') === skillContent(name, commandFile, outRoot)) continue;
    if (outRoot === localOut && owner.kind === 'legacy') continue;
    if (outRoot === localOut) {
      preservadas.add(name);
      continue;
    }
    throw new Error(`Recusando sobrescrever ${dir}; ownership: ${owner.kind}.`);
  }
  for (const name of preservadas) avisos.push(`Skill ${name} em ${relative(path.join(outRoot, name))} nao foi gerada por este sync: mantida como esta.`);
  return preservadas;
}

function inspect(outRoot) {
  const issues = [];
  if (!fs.existsSync(outRoot)) return [`Diretorio ausente: ${outRoot}`];
  for (const [name, commandFile] of skills) {
    const dir = path.join(outRoot, name);
    if (!fs.existsSync(dir)) {
      issues.push(`Skill ausente: ${name}`);
      continue;
    }
    const owner = readOwner(dir);
    if (outRoot === localOut && owner.kind === 'unmanaged') continue; // skill do aluno, preservada
    if (owner.kind !== 'owned' || owner.movido) issues.push(`Ownership invalido: ${name}`);
    const file = path.join(dir, 'SKILL.md');
    if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== skillContent(name, commandFile, outRoot)) {
      issues.push(`Drift de conteudo: ${name}`);
    }
  }
  for (const entry of fs.readdirSync(outRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || skills.has(entry.name)) continue;
    if (readOwner(path.join(outRoot, entry.name)).kind === 'owned') issues.push(`Skill obsoleta: ${entry.name}`);
  }
  return issues;
}

function sync(outRoot) {
  ensureDir(outRoot);
  const preservadas = collisions(outRoot);
  const stage = fs.mkdtempSync(path.join(outRoot, '.auroq-stage-'));
  try {
    for (const [name, commandFile] of skills) {
      if (preservadas.has(name)) continue;
      const dir = path.join(stage, name);
      ensureDir(dir);
      fs.writeFileSync(path.join(dir, markerFile), marker, 'utf8');
      fs.writeFileSync(path.join(dir, 'SKILL.md'), skillContent(name, commandFile, outRoot), 'utf8');
    }
    for (const name of skills.keys()) {
      if (preservadas.has(name)) continue;
      const target = path.join(outRoot, name);
      fs.rmSync(target, { recursive: true, force: true });
      fs.renameSync(path.join(stage, name), target);
    }
    if (clean) {
      for (const entry of fs.readdirSync(outRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || skills.has(entry.name)) continue;
        const dir = path.join(outRoot, entry.name);
        if (readOwner(dir).kind === 'owned') fs.rmSync(dir, { recursive: true, force: true });
      }
    }
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

function cleanLegacyLocalLocation() {
  if (!clean) return;
  const legacyRoot = path.join(root, '.codex', 'skills');
  if (!fs.existsSync(legacyRoot)) return;
  for (const entry of fs.readdirSync(legacyRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const markerPath = path.join(legacyRoot, entry.name, markerFile);
    if (fs.existsSync(markerPath)) fs.rmSync(path.join(legacyRoot, entry.name), { recursive: true, force: true });
  }
  if (fs.readdirSync(legacyRoot).length === 0) fs.rmSync(legacyRoot, { recursive: true, force: true });
}

if (args.has('--help')) {
  console.log(`Uso: node scripts/sync-codex-skills.mjs [--global|--all] [--clean] [--check] [--dry-run] [--adopt-legacy]

Padrao      gera skills locais em .agents/skills (recomendado)
--global    gera em ~/.agents/skills (opcional e explicito)
--all       gera local e global
--clean     remove skills obsoletas pertencentes a este projeto
--check     detecta drift sem escrever
--dry-run   valida fontes e colisoes sem escrever
--adopt-legacy  migra uma instalacao criada pelo gerador antigo`);
  process.exit(0);
}

collectSkills();
if (targets.includes(localOut)) cleanLegacyLocalLocation();

const mostrarAvisos = () => {
  for (const aviso of new Set(avisos)) console.error(`Aviso: ${aviso}`);
  avisos.length = 0;
};

for (const target of targets) {
  if (check) {
    const issues = inspect(target);
    if (issues.length) {
      console.error(issues.join('\n'));
      process.exitCode = 1;
    } else {
      console.log(`Auroq: ${skills.size} skills verificadas em ${target}`);
    }
  } else if (dryRun) {
    if (fs.existsSync(target)) collisions(target);
    console.log(`Auroq: ${skills.size} skills validadas para ${target}`);
  } else {
    sync(target);
    console.log(`Auroq: ${skills.size} skills sincronizadas em ${target}`);
  }
  mostrarAvisos();
}
