#!/usr/bin/env node

/**
 * Auroq OS — Installer
 *
 * Usage:
 *   npx @auroq-os/core init          (quando publicado no npm)
 *   node bin/auroq-os.js init        (local)
 *
 * @module auroq-os/installer
 */

'use strict';

const path = require('path');
const fs = require('fs-extra');
const { execSync, execFileSync } = require('child_process');
const auth = require('../lib/auth');

const PKG_VERSION = require('../package.json').version;

// ─── CORES ───────────────────────────────────────────────
const PURPLE = '\x1b[38;2;120;80;200m';
const GOLD = '\x1b[38;2;245;158;11m';
const CYAN = '\x1b[38;2;34;211;238m';
const GREEN = '\x1b[38;2;52;211;153m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

// ─── BANNER ──────────────────────────────────────────────
function showBanner() {
  const banner = `

${PURPLE}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${PURPLE}${BOLD}       ▄▀█ █  █ █▀█ █▀█ █▀█${RESET}  ${DIM}OS v${PKG_VERSION}${RESET}
${PURPLE}${BOLD}       █▀█ █▄▄█ █▀▄ █▄█ ▀▀█${RESET}

${DIM}       Sistema Operacional de IA para Experts${RESET}
${DIM}       Pensar. Fazer. Lembrar. Com IA.${RESET}

${PURPLE}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
`;

  console.log(banner);
}

// ─── HELPERS ─────────────────────────────────────────────
function log(msg) { console.log(`  ${msg}`); }
function step(msg) { console.log(`\n  ${CYAN}▸${RESET} ${msg}`); }
function success(msg) { console.log(`  ${GREEN}✓${RESET} ${msg}`); }
function warn(msg) { console.log(`  ${GOLD}!${RESET} ${msg}`); }
function error(msg) { console.log(`  ${PURPLE}✗${RESET} ${msg}`); }

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Pergunta sim/nao no terminal. Funciona em TTY e com stdin encadeado (pipe).
// Se o stdin estiver fechado (automatos/CI), question() nunca resolve — por isso
// a corrida com o evento 'close': EOF vira resposta vazia, ou seja, "nao".
async function askYesNo(question) {
  const readline = require('node:readline/promises');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    const closed = new Promise(resolve => rl.once('close', () => resolve('')));
    const answer = String(await Promise.race([rl.question(question), closed])).trim().toLowerCase();
    return answer === 's' || answer === 'sim' || answer === 'y' || answer === 'yes';
  } catch {
    return false;
  } finally {
    rl.close();
  }
}

// ─── PROTECAO DE SEGREDOS (gitignore canonico) ───────────
// Gerado por codigo, nao copiado de arquivo: o tarball do npm nem sempre
// preserva .gitignore, e o merge preserva as linhas proprias do expert.
const GITIGNORE_PROTECTIONS = [
  ['Segredos — NUNCA sobem pro GitHub', ['.env', '.env.local', '.env.*.local', '.npmrc', 'business/vault/', '*.key', '*.pem']],
  ['Runtime — se recria sozinho em cada maquina', ['node_modules/', '.auroq/', '.synapse/sessions/', '.tmp/', '*.tmp', '*.log']],
  ['Skills do Codex — geradas por maquina', ['.agents/skills/']],
  ['Sistema operacional', ['.DS_Store', 'Thumbs.db']],
  ['Midia pesada — fica no Drive, nao no repo', ['*.png', '*.jpeg', '*.jpg', '*.mp4', '*.mov', '*.mp3', '*.wav']],
];

async function ensureGitignore(targetDir) {
  const giPath = path.join(targetDir, '.gitignore');
  const existing = (await fs.pathExists(giPath)) ? await fs.readFile(giPath, 'utf8') : '';
  const have = new Set(existing.split('\n').map(l => l.trim()).filter(Boolean));
  const missingBlocks = [];
  for (const [comment, lines] of GITIGNORE_PROTECTIONS) {
    const missing = lines.filter(l => !have.has(l));
    if (missing.length) missingBlocks.push(`# ${comment}\n${missing.join('\n')}`);
  }
  if (!missingBlocks.length) return [];
  const base = existing.trim().length ? existing.replace(/\s*$/, '\n\n') : '';
  const header = '# ── Protecoes do Auroq OS (adicionadas automaticamente) ──\n';
  await fs.writeFile(giPath, base + header + missingBlocks.join('\n\n') + '\n');
  return missingBlocks.flatMap(b => b.split('\n').filter(l => l && !l.startsWith('#')));
}

// Tira do controle de versao segredos que ja foram rastreados (ficam no disco).
async function untrackSecrets(targetDir) {
  if (!(await fs.pathExists(path.join(targetDir, '.git')))) return [];
  let tracked = [];
  try {
    const out = execFileSync('git', ['ls-files', '--', 'business/vault', '.env', '.env.local', '*.key', '*.pem', '.npmrc'], { cwd: targetDir, encoding: 'utf8' });
    tracked = out.split('\n').map(s => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
  if (!tracked.length) return [];
  try {
    execFileSync('git', ['rm', '-r', '--cached', '--quiet', '--', ...tracked], { cwd: targetDir, stdio: 'pipe' });
  } catch {
    return [];
  }
  return tracked;
}

async function applySecretProtections(targetDir) {
  const added = await ensureGitignore(targetDir);
  if (added.length) {
    success(`Protecoes adicionadas ao .gitignore (${added.length} regras: vault, .env, runtime, midia)`);
  } else {
    success('.gitignore ja protege segredos e runtime');
  }
  const untracked = await untrackSecrets(targetDir);
  if (untracked.length) {
    warn(`${untracked.length} arquivo(s) sensivel(is) removido(s) do controle de versao (continuam no seu disco):`);
    for (const f of untracked.slice(0, 8)) log(`${DIM}    - ${f}${RESET}`);
    if (untracked.length > 8) log(`${DIM}    ... e mais ${untracked.length - 8}${RESET}`);
    warn('No proximo commit isso vira permanente.');
    let hasRemote = false;
    try { hasRemote = execFileSync('git', ['remote'], { cwd: targetDir, encoding: 'utf8' }).trim().length > 0; } catch { /* sem git */ }
    if (hasRemote) {
      warn(`${GOLD}IMPORTANTE: esses arquivos podem ja ter subido pro GitHub em commits antigos.${RESET}`);
      warn(`${GOLD}Troque as chaves que estavam neles — peca ajuda ao Ops: "minhas chaves do vault${RESET}`);
      warn(`${GOLD}podem ter vazado no git, me ajuda a trocar e limpar".${RESET}`);
    }
  }
  return { added, untracked };
}

// ─── HEALTH CHECK (compartilhado por init e clone) ───────
const HEALTH_CHECKS = [
  ['.auroq-core/constitution.md', 'Constitution'],
  ['.claude/CLAUDE.md', 'CLAUDE.md'],
  ['.claude/hooks/synapse-engine.cjs', 'Synapse Hook'],
  ['agents/companion/agents/companion.md', 'Companion'],
  ['agents/organizer/agents/organizer.md', 'Organizer'],
  ['.claude/commands/AuroqOS/agents/ops.md', 'Ops'],
  ['agents/squad-forge/agents/forge-chief.md', 'Squad Forge'],
  ['agents/mind-forge/agents/forge-chief.md', 'Mind Forge'],
  ['agents/worker-forge/agents/worker-chief.md', 'Worker Forge'],
  ['agents/clone-forge/agents/clone-forge-chief.md', 'Clone Forge'],
  ['agents/etlmaker/agents/etl-chief.md', 'ETLmaker'],
  ['business/cockpit.md', 'Cockpit'],
  ['.synapse/manifest', 'Synapse Manifest'],
  ['AGENTS.md', 'Codex AGENTS.md'],
  ['.agents/skills/companion/SKILL.md', 'Codex Companion'],
  ['.agents/skills/ops/SKILL.md', 'Codex Ops'],
  ['scripts/validate-hybrid.mjs', 'Validador hibrido'],
];

async function runHealthChecks(targetDir) {
  let passed = 0;
  for (const [file, label] of HEALTH_CHECKS) {
    if (await fs.pathExists(path.join(targetDir, file))) {
      passed++;
    } else {
      warn(`${label} nao encontrado`);
    }
  }
  if (passed === HEALTH_CHECKS.length) {
    success(`${passed}/${HEALTH_CHECKS.length} verificacoes OK`);
  } else {
    warn(`${passed}/${HEALTH_CHECKS.length} verificacoes OK — rode *bootstrap pra corrigir`);
  }
  return { passed, total: HEALTH_CHECKS.length };
}

// ─── INSTALACAO ──────────────────────────────────────────
async function init() {
  showBanner();
  await sleep(500);

  const targetDir = process.cwd();
  const sourceDir = path.resolve(__dirname, '..');
  const homeDir = require('os').homedir();

  // ─── PROTECAO: Nunca instalar na home do usuario
  if (targetDir === homeDir || targetDir === path.resolve(homeDir)) {
    error('');
    error(`${GOLD}ATENCAO: Voce esta na pasta HOME do seu usuario (${targetDir}).${RESET}`);
    error(`${GOLD}O Auroq OS nao pode ser instalado aqui — vai baguncar seu sistema.${RESET}`);
    error('');
    error('Crie uma pasta pro seu projeto e rode o comando de dentro dela:');
    error('');
    error(`  ${CYAN}mkdir meu-negocio${RESET}`);
    error(`  ${CYAN}cd meu-negocio${RESET}`);
    error(`  ${CYAN}npx auroq-os init${RESET}`);
    error('');
    error('Troque "meu-negocio" pelo nome que quiser pro seu projeto.');
    process.exit(1);
  }

  // ─── GUARDRAIL: segunda maquina usa clone, nao init
  // So pergunta em instalacao NOVA (pasta sem .auroq-core) — update/reinstall pula direto.
  const isNewInstall = !(await fs.pathExists(path.join(targetDir, '.auroq-core')));
  if (isNewInstall && process.env.AUROQ_INIT_MODE !== 'novo') {
    const jaUsa = await askYesNo(`  Voce JA usa o Auroq OS em outra maquina e quer continuar o MESMO negocio aqui? ${DIM}(s/N)${RESET} `);
    if (jaUsa) {
      log('');
      log(`${BOLD}Entao o caminho certo NAO e instalar do zero — e clonar o que ja existe.${RESET}`);
      log('');
      log('O seu negocio ja vive no GitHub (o Ops fez isso no Bootstrap 1).');
      log('Instalar do zero aqui criaria um segundo Auroq desconectado do primeiro.');
      log('');
      log(`Rode: ${CYAN}npx auroq-os clone${RESET}`);
      log('');
      log(`${DIM}Ele baixa o seu negocio inteiro do GitHub — sistema, memoria e documentos —${RESET}`);
      log(`${DIM}e deixa tudo pronto. Depois e so reconectar o cofre com *conectar-1password.${RESET}`);
      log('');
      process.exit(0);
    }
  }

  log(`${DIM}Instalando em: ${targetDir}${RESET}\n`);

  // ─── Fase 1: Verificar pre-requisitos
  step('Verificando pre-requisitos...');

  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    success(`Node.js ${nodeVersion}`);
  } catch {
    error('Node.js nao encontrado. Instale em https://nodejs.org');
    process.exit(1);
  }

  try {
    execSync('git --version', { encoding: 'utf8', stdio: 'pipe' });
    success('Git instalado');
  } catch {
    error('Git nao encontrado. Instale git primeiro.');
    process.exit(1);
  }

  // ─── Fase 1b: Gate de acesso (Mentoria Arcane)
  step('Verificando acesso...');
  const testAuthBypass = process.env.NODE_ENV === 'test' && process.env.AUROQ_SKIP_AUTH === '1';
  if (testAuthBypass) {
    success('Gate de acesso ignorado em ambiente de teste');
  } else {
    try {
      await auth.getValidSession();
    } catch (e) {
      error(`Falha na autenticacao: ${e.message}`);
      process.exit(1);
    }
  }

  // ─── Fase 2: Copiar estrutura do framework
  step('Criando estrutura do Auroq OS...');

  const dirs = [
    '.auroq-core/core/synapse',
    '.auroq-core/development',
    '.auroq-core/infrastructure/schemas',
    '.auroq-core/hooks/unified/runners',
    '.claude/commands/AuroqOS/agents',
    '.claude/rules',
    '.claude/hooks',
    '.synapse/sessions',
    '.synapse/metrics',
    'business/campanhas/_template/arsenal/criativos',
    'business/campanhas/_template/arsenal/conversas',
    'business/campanhas/_template/arsenal/paginas',
    'business/campanhas/_template/arsenal/relatorios',
    'business/processos',
    'business/agente',
    'business/vault',
    'business/templates',
    'docs/knowledge/expert-mind',
    'docs/knowledge/expert-business/metodologia',
    'docs/knowledge/biblioteca-pmi/proposito',
    'docs/knowledge/biblioteca-pmi/marketing',
    'docs/knowledge/biblioteca-pmi/ia',
    'docs/diagrams',
    'agents/companion/agents',
    'agents/companion/data',
    'agents/companion/knowledge',
    'agents/companion/tasks',
    'agents/organizer/agents',
    'agents/organizer/data',
    'agents/organizer/tasks',
    'agents/consultor/agents',
    'agents/consultor/tasks',
    'agents/consultor/knowledge',
    'scripts',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(targetDir, dir));
  }
  success(`${dirs.length} pastas criadas`);

  // ─── Fase 3: Copiar arquivos do framework
  step('Instalando framework...');

  const frameworkFiles = [
    // Core
    '.auroq-core/constitution.md',
    '.auroq-core/core-config.yaml',
    '.auroq-core/dna-operacional.md',
    '.auroq-core/development/sistema-gestao-projetos.md',
    '.auroq-core/development/sistema-memoria.md',

    // Claude bridge
    '.claude/CLAUDE.md',
    '.claude/settings.json',
    '.claude/settings.local.json',
    '.claude/commands/auroq-companion.md',
    '.claude/commands/auroq-organizer.md',
    '.claude/commands/AuroqOS/agents/ops.md',
    '.claude/commands/auroq-squad-forge.md',
    '.claude/commands/auroq-mind-forge.md',
    '.claude/commands/auroq-worker-forge.md',
    '.claude/commands/auroq-clone-forge.md',
    '.claude/commands/auroq-etlmaker.md',
    '.claude/commands/auroq-consultor.md',

    // Rules
    '.claude/rules/agent-authority.md',
    '.claude/rules/agent-handoff.md',
    '.claude/rules/commit-inteligente.md',
    '.claude/rules/dna-operacional.md',
    '.claude/rules/evolucao-incremental.md',
    '.claude/rules/mcp-usage.md',
    '.claude/rules/memoria-inteligente.md',
    '.claude/rules/project-tracker.md',
    '.claude/rules/tool-response-filtering.md',
    '.claude/rules/natural-language-first.md',
    '.claude/rules/custom-do-aluno.md',

    // Hooks
    '.claude/hooks/synapse-engine.cjs',
    '.claude/hooks/precompact-session-digest.cjs',

    // Synapse domain files
    '.synapse/manifest',
    '.synapse/constitution',
    '.synapse/global',
    '.synapse/context',
    '.synapse/.gitignore',

    // Companion
    'agents/companion/agents/companion.md',
    'agents/companion/tasks/start.md',
    'agents/companion/tasks/weekly-review.md',
    'agents/companion/tasks/save-memory.md',
    'agents/companion/tasks/new-project.md',
    'agents/companion/data/contexto-dinamico.md',
    'agents/companion/data/log-decisoes.md',
    'agents/companion/data/padroes-observados.md',
    'agents/companion/data/demandas-backlog.md',
    'agents/companion/knowledge/companion-foundation.md',
    'agents/companion/knowledge/expert-essencial.md',
    'agents/companion/knowledge/modus-operandi.md',
    'agents/companion/knowledge/system-guide.md',
    'agents/companion/knowledge/arcane-method.md',

    // Organizer
    'agents/organizer/agents/organizer.md',
    'agents/organizer/data/organizer-kb.md',
    'agents/organizer/tasks/start.md',

    // Consultor
    'agents/consultor/agents/consultor.md',
    'agents/consultor/tasks/start.md',
    'agents/consultor/knowledge/01-arquitetura-e-engenharia.md',
    'agents/consultor/knowledge/02-operar-o-negocio.md',
    'agents/consultor/knowledge/03-os-8-agentes.md',
    'agents/consultor/knowledge/04-filosofia-e-didatica.md',
    'agents/consultor/knowledge/05-fazer-no-dia-a-dia.md',
    'agents/consultor/knowledge/06-quando-criar-agente-ou-squad.md',
    'agents/consultor/knowledge/07-logicas-de-uso-e-higiene.md',

    // Business templates
    'business/campanhas/_template/BRIEFING.md',
    'business/campanhas/_template/CHECKLIST.md',
    'business/campanhas/_template/DIARIO.md',
    'business/campanhas/_template/RETROVISOR.md',
    'business/cockpit.md',
    'business/templates/tracker-template.md',

    // Expert templates
    'docs/knowledge/expert-mind/identidade.md',
    'docs/knowledge/expert-mind/valores.md',
    'docs/knowledge/expert-mind/tom-de-voz.md',
    'docs/knowledge/expert-mind/historia.md',
    'docs/knowledge/expert-business/posicionamento.md',
    'docs/knowledge/expert-business/publico-alvo.md',

    // Root
    // (.gitignore NAO entra aqui: e gerado por codigo em applySecretProtections —
    //  o tarball do npm nem sempre o preserva, e a copia cega apagaria linhas do expert)
    '.env.example',
    'README.md',

    // Codex CLI adapter
    'AGENTS.md',
    'scripts/sync-codex-skills.mjs',
    'scripts/validate-hybrid.mjs',
  ];

  // Arquivos do ALUNO — nunca sobrescrever se ja existem
  const studentFiles = [
    // Config/customizacao pessoal — o lugar oficial pra regras e overrides do aluno.
    // O update do framework cria a semente na 1a vez e NUNCA mais toca.
    '.claude/rules/custom-do-aluno.md',
    '.claude/settings.local.json',
    'agents/companion/data/contexto-dinamico.md',
    'agents/companion/data/log-decisoes.md',
    'agents/companion/data/padroes-observados.md',
    'agents/companion/data/demandas-backlog.md',
    'agents/companion/knowledge/expert-essencial.md',
    'docs/knowledge/expert-mind/identidade.md',
    'docs/knowledge/expert-mind/valores.md',
    'docs/knowledge/expert-mind/tom-de-voz.md',
    'docs/knowledge/expert-mind/historia.md',
    'docs/knowledge/expert-business/posicionamento.md',
    'docs/knowledge/expert-business/publico-alvo.md',
    'business/cockpit.md',
  ];

  // Detectar se ja existe companion personalizado (ex: taquion-companion.md)
  // Se existir, NAO copiar companion.md generico pra nao duplicar
  const commandsDir = path.join(targetDir, '.claude', 'commands');
  let hasCustomCompanion = false;
  if (await fs.pathExists(commandsDir)) {
    const cmdFiles = await fs.readdir(commandsDir);
    hasCustomCompanion = cmdFiles.some(f => f.endsWith('-companion.md') && f !== 'companion.md');
    if (hasCustomCompanion) {
      const customName = cmdFiles.find(f => f.endsWith('-companion.md') && f !== 'companion.md');
      log(`${DIM}  Companion personalizado detectado: ${customName} — pulando companion.md generico${RESET}`);
    }

    // Limpar commands antigos em camelCase (versoes anteriores usavam camelCase)
    const legacyCommands = ['cloneForge.md', 'mindForge.md', 'squadForge.md', 'workerForge.md', 'etlmaker.md'];
    // Nota: etlmaker.md nao muda de nome, os outros sim
    const camelToKebab = { 'cloneForge.md': 'clone-forge.md', 'mindForge.md': 'mind-forge.md', 'squadForge.md': 'squad-forge.md', 'workerForge.md': 'worker-forge.md' };
    let legacyCleaned = 0;
    for (const legacy of Object.keys(camelToKebab)) {
      const legacyPath = path.join(commandsDir, legacy);
      if (await fs.pathExists(legacyPath)) {
        await fs.remove(legacyPath);
        legacyCleaned++;
      }
    }
    if (legacyCleaned > 0) {
      log(`${DIM}  Removidos ${legacyCleaned} commands antigos (camelCase → kebab-case)${RESET}`);
    }
  }

  // Migrar meta squads de squads/ → agents/ (versoes antigas usavam squads/)
  const legacySquadsDir = path.join(targetDir, 'squads');
  if (await fs.pathExists(legacySquadsDir)) {
    const metaSquadNames = ['squad-forge', 'mind-forge', 'worker-forge', 'clone-forge', 'etlmaker', 'organizer', 'companion'];
    let migrated = 0;
    for (const name of metaSquadNames) {
      const oldPath = path.join(legacySquadsDir, name);
      if (await fs.pathExists(oldPath)) {
        await fs.remove(oldPath);
        migrated++;
      }
    }
    if (migrated > 0) {
      log(`${DIM}  Removidos ${migrated} meta squads antigos de squads/ (agora ficam em agents/)${RESET}`);
    }
    // Se squads/ ficou vazia, remover a pasta
    const remaining = await fs.readdir(legacySquadsDir);
    if (remaining.length === 0) {
      await fs.remove(legacySquadsDir);
      log(`${DIM}  Pasta squads/ vazia removida${RESET}`);
    }
  }

  let copied = 0;
  for (const file of frameworkFiles) {
    // Pular companion.md generico se ja tem personalizado
    if (file === '.claude/commands/companion.md' && hasCustomCompanion) {
      continue;
    }
    const src = path.join(sourceDir, file);
    const dst = path.join(targetDir, file);
    if (await fs.pathExists(src)) {
      const isStudentFile = studentFiles.includes(file);
      const dstExists = await fs.pathExists(dst);
      // Framework files: SEMPRE sobrescrever (atualizar)
      // Student files: so copiar se NAO existem (preservar dados)
      if (isStudentFile && dstExists) {
        // Nao sobrescrever dados do aluno
      } else {
        await fs.copy(src, dst, { overwrite: true });
      }
      copied++;
    }
  }
  success(`${copied} arquivos instalados`);

  // ─── Fase 4: Copiar Synapse Engine
  step('Instalando Synapse Engine...');

  const synapseSrc = path.join(sourceDir, '.auroq-core', 'core', 'synapse');
  const synapseDst = path.join(targetDir, '.auroq-core', 'core', 'synapse');
  if (await fs.pathExists(synapseSrc)) {
    await fs.copy(synapseSrc, synapseDst, { overwrite: false });
    const synapseFiles = await fs.readdir(synapseSrc, { recursive: true });
    success(`Synapse Engine instalado (${synapseFiles.length} arquivos)`);
  } else {
    warn('Synapse Engine nao encontrado na fonte — pulando');
  }

  // ─── Fase 4b: Copiar Meta Squads e scripts (diretorios inteiros)
  step('Instalando Meta Squads e scripts...');

  const dirsToCopy = [
    { src: 'agents/squad-forge', label: 'Squad Forge' },
    { src: 'agents/mind-forge', label: 'Mind Forge' },
    { src: 'agents/worker-forge', label: 'Worker Forge' },
    { src: 'agents/clone-forge', label: 'Clone Forge' },
    { src: 'agents/etlmaker', label: 'ETLmaker' },
    { src: '.auroq-core/development/scripts', label: 'Squad Scripts' },
  ];

  let dirsCopied = 0;
  for (const { src, label } of dirsToCopy) {
    const srcPath = path.join(sourceDir, src);
    const dstPath = path.join(targetDir, src);
    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, dstPath, { overwrite: true });
      dirsCopied++;
    }
  }
  success(`${dirsCopied} modulos instalados (Meta Squads + scripts)`);

  // O package.json precisa existir ANTES do sync do Codex: o ownership das
  // skills usa o name do package — gerar skills antes dele criava marcador
  // com o nome da pasta e todo sync seguinte recusava ("foreign").
  const pkgPath = path.join(targetDir, 'package.json');
  if (!(await fs.pathExists(pkgPath))) {
    await fs.writeJSON(pkgPath, {
      name: 'meu-negocio',
      version: '1.0.0',
      description: 'Meu negocio com Auroq OS',
      private: true,
      dependencies: {
        'js-yaml': '^4.1.0',
      },
    }, { spaces: 2 });
  }

  // ─── Fase 4c: Adaptador Codex CLI (skills locais por projeto)
  step('Configurando Codex CLI...');
  try {
    execSync('node scripts/sync-codex-skills.mjs --clean', { cwd: targetDir, stdio: 'pipe' });
    execSync('node scripts/sync-codex-skills.mjs --check', { cwd: targetDir, stdio: 'pipe' });
    success('Codex CLI pronto — skills locais verificadas ($companion, $ops, etc.)');
  } catch {
    warn('Sync de skills do Codex falhou — rode "npx auroq-os sync-codex" para diagnosticar');
  }

  // ─── Fase 5: npm install
  step('Configurando dependencias...');

  // Comandos namespaced: adiciona a manutencao Auroq sem sobrescrever scripts do negocio.
  const targetPackage = await fs.readJSON(pkgPath);
  targetPackage.scripts = targetPackage.scripts || {};
  targetPackage.scripts['auroq:sync:codex'] = 'node scripts/sync-codex-skills.mjs --clean';
  targetPackage.scripts['auroq:sync:codex:check'] = 'node scripts/sync-codex-skills.mjs --check';
  targetPackage.scripts['auroq:validate'] = 'node scripts/validate-hybrid.mjs';
  await fs.writeJSON(pkgPath, targetPackage, { spaces: 2 });

  try {
    execSync('npm install --silent', { cwd: targetDir, stdio: 'pipe' });
    success('Dependencias instaladas');
  } catch {
    warn('npm install falhou — rode manualmente depois');
  }

  // ─── Fase 6: Git init
  step('Inicializando repositorio...');

  const gitDir = path.join(targetDir, '.git');
  if (!(await fs.pathExists(gitDir))) {
    try {
      execSync('git init', { cwd: targetDir, stdio: 'pipe' });
      success('Git inicializado');
    } catch {
      warn('git init falhou — inicialize manualmente');
    }
  } else {
    success('Git ja inicializado');
  }

  // Protecoes de segredo: .gitignore canonico + destraquear o que nao pode viajar.
  // Roda em toda instalacao E em todo update (o update reexecuta o init) — e assim
  // que alunos com instalacao antiga sao migrados automaticamente.
  step('Protegendo segredos...');
  await applySecretProtections(targetDir);

  // ─── Fase 7: Health check rapido
  step('Verificando integridade...');
  await runHealthChecks(targetDir);

  // ─── Resultado final
  console.log(`
${PURPLE}${BOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${GREEN}${BOLD}  Auroq OS instalado com sucesso.${RESET}

${DIM}  Proximo passo:${RESET}

    ${CYAN}cd ${path.basename(targetDir)}${RESET}
    ${CYAN}claude${RESET} ${DIM}ou${RESET} ${CYAN}codex${RESET}
    ${CYAN}/auroq-companion${RESET} ${DIM}ou${RESET} ${CYAN}\$companion${RESET}

${DIM}  O Companion vai te receber e guiar a partir daqui.${RESET}

${DIM}  Suas customizacoes (sobrevivem a todo update):${RESET}
    ${CYAN}.claude/rules/custom-do-aluno.md${RESET}   ${DIM}— suas regras e overrides${RESET}
    ${CYAN}.claude/settings.local.json${RESET}        ${DIM}— suas configuracoes locais${RESET}

${DIM}  Agentes core disponiveis:${RESET}
    ${PURPLE}/companion${RESET}              ${DIM}— Parceiro cognitivo${RESET}
    ${PURPLE}/AuroqOS:agents:ops${RESET}     ${DIM}— Git, deploy, ambiente${RESET}
    ${PURPLE}/organizer${RESET}              ${DIM}— Organizacao e backup${RESET}

${DIM}  Meta Squads (criadores de agentes):${RESET}
    ${PURPLE}/squad-forge${RESET}            ${DIM}— Cria squads multi-agente${RESET}
    ${PURPLE}/mind-forge${RESET}             ${DIM}— Cria mentes sinteticas${RESET}
    ${PURPLE}/worker-forge${RESET}           ${DIM}— Cria workers${RESET}
    ${PURPLE}/clone-forge${RESET}            ${DIM}— Clona mentes reais${RESET}
    ${PURPLE}/etlmaker${RESET}               ${DIM}— Extrai e estrutura conhecimento${RESET}

${DIM}  Claude Code e Codex sao runtimes oficiais. Escolha um por sessao; ambos usam os mesmos agentes e arquivos.${RESET}

${PURPLE}${BOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
${DIM}  Auroq OS v${PKG_VERSION} — Sistema Operacional de IA para Experts${RESET}
${DIM}  "Tu aumentaste o meu poder como do boi selvagem." — Sl 92:10${RESET}
`);
}

// ─── CLONE (segunda maquina / colaborador) ───────────────
// O Auroq nao mora no computador — mora no GitHub. Clonar JA E a instalacao:
// o sistema vem inteiro no clone. Este comando so completa o que nao viaja
// (dependencias, skills do Codex) e confere a integridade.
async function clone(repoArg) {
  showBanner();
  await sleep(300);

  const cwd = process.cwd();

  if (await fs.pathExists(path.join(cwd, '.auroq-core'))) {
    error('Voce ja esta DENTRO de um projeto Auroq.');
    error('Va pra pasta onde quer criar a copia (ex: cd ~/Documents) e rode de novo.');
    process.exit(1);
  }

  log(`${DIM}Clonando o seu negocio para: ${cwd}${RESET}\n`);

  // ─── Fase 1: Pre-requisitos
  step('Verificando pre-requisitos...');
  try {
    execSync('git --version', { encoding: 'utf8', stdio: 'pipe' });
    success('Git instalado');
  } catch {
    error('Git nao encontrado. Instale git primeiro.');
    process.exit(1);
  }

  // Sem gate de aluno aqui — decisao de produto (05/08/2026): colaborador NAO
  // precisa ser aluno. O gate real do clone e o convite do GitHub (repo privado);
  // um git clone puro ja entregaria o mesmo conteudo. Os gates de aluno ficam
  // onde ha valor do framework: init (criar do zero) e *update-auroq (atualizar).

  // ─── Fase 2: Resolver o repositorio
  let repoRef = repoArg;
  if (!repoRef) {
    step('Localizando o seu negocio no GitHub...');
    try {
      execSync('gh --version', { encoding: 'utf8', stdio: 'pipe' });
    } catch {
      error('GitHub CLI (gh) nao encontrado e nenhum repositorio informado.');
      error('');
      error('Duas opcoes:');
      error(`  1. Instale o gh (https://cli.github.com) e rode de novo: ${CYAN}npx auroq-os clone${RESET}`);
      error(`  2. Ou informe o endereco direto: ${CYAN}npx auroq-os clone https://github.com/SEU-USUARIO/SEU-REPO.git${RESET}`);
      process.exit(1);
    }
    try {
      execSync('gh auth status', { encoding: 'utf8', stdio: 'pipe' });
      success('GitHub conectado');
    } catch {
      warn('GitHub nao conectado nesta maquina — abrindo o login...');
      try {
        execSync('gh auth login', { stdio: 'inherit' });
      } catch {
        error('Login no GitHub falhou. Rode "gh auth login" e tente de novo.');
        process.exit(1);
      }
    }
    let repos = [];
    try {
      const out = execSync('gh repo list --json nameWithOwner,updatedAt --limit 30', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
      repos = JSON.parse(out);
    } catch { /* lista vazia tratada abaixo */ }
    if (!repos.length) {
      error('Nenhum repositorio encontrado na sua conta do GitHub.');
      error(`Informe o endereco direto: ${CYAN}npx auroq-os clone https://github.com/SEU-USUARIO/SEU-REPO.git${RESET}`);
      process.exit(1);
    }
    const prompts = require('prompts');
    const resp = await prompts({
      type: 'select',
      name: 'repo',
      message: 'Qual repositorio e o seu negocio?',
      choices: repos.map(r => ({ title: r.nameWithOwner, value: r.nameWithOwner })),
    }, { onCancel: () => { error('Cancelado.'); process.exit(1); } });
    repoRef = resp.repo;
  }

  // ─── Fase 3: Clonar
  step(`Baixando o negocio inteiro (${repoRef})...`);
  const destName = path.basename(String(repoRef).replace(/[\\/]+$/, '')).replace(/\.git$/, '');
  const destDir = path.join(cwd, destName);
  if (await fs.pathExists(destDir)) {
    error(`A pasta "${destName}" ja existe aqui. Entre nela (cd ${destName}) ou rode em outro lugar.`);
    process.exit(1);
  }
  const isOwnerRepo = /^[\w.-]+\/[\w.-]+$/.test(String(repoRef));
  try {
    if (isOwnerRepo) {
      execFileSync('gh', ['repo', 'clone', String(repoRef)], { cwd, stdio: 'inherit' });
    } else {
      execFileSync('git', ['clone', String(repoRef), destName], { cwd, stdio: 'inherit' });
    }
    success('Negocio baixado do GitHub');
  } catch {
    error('Falha ao clonar. Confira o endereco e o seu acesso ao repositorio.');
    process.exit(1);
  }

  // ─── Fase 4: Reconhecer o projeto
  if (await fs.pathExists(path.join(destDir, '.auroq-core'))) {
    success('Projeto Auroq reconhecido — o sistema veio inteiro no clone');
  } else {
    warn('Este repositorio nao parece um projeto Auroq (.auroq-core ausente).');
    warn('Se for o repo errado, apague a pasta e rode de novo com o repo certo.');
  }

  // ─── Fase 5: Protecoes de segredo
  step('Protegendo segredos...');
  await applySecretProtections(destDir);

  // ─── Fase 6: Dependencias (nao viajam no git — de proposito)
  step('Instalando dependencias...');
  try {
    execSync('npm install --silent', { cwd: destDir, stdio: 'pipe' });
    success('Dependencias instaladas');
  } catch {
    warn('npm install falhou — entre na pasta e rode "npm install" manualmente');
  }

  // ─── Fase 7: Skills do Codex (geradas por maquina)
  if (await fs.pathExists(path.join(destDir, 'scripts', 'sync-codex-skills.mjs'))) {
    step('Configurando Codex CLI...');
    try {
      execSync('node scripts/sync-codex-skills.mjs --clean', { cwd: destDir, stdio: 'pipe' });
      success('Skills locais do Codex regeneradas');
    } catch {
      warn('Sync de skills do Codex falhou — rode "npx auroq-os sync-codex" depois');
    }
  }

  // ─── Fase 8: Health check
  step('Verificando integridade...');
  await runHealthChecks(destDir);

  // ─── Resultado final
  console.log(`
${PURPLE}${BOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${GREEN}${BOLD}  Negocio clonado com sucesso. Esta maquina esta pronta.${RESET}

${DIM}  Uma vez so, nesta maquina:${RESET}

    ${CYAN}cd ${destName}${RESET}
    ${CYAN}claude${RESET} ${DIM}ou${RESET} ${CYAN}codex${RESET}
    ${CYAN}/AuroqOS:agents:ops${RESET}
    ${CYAN}*conectar-1password${RESET}   ${DIM}— reconectar o cofre de senhas${RESET}
    ${DIM}(dono do negocio: se o sistema pedir login em algum momento, ${RESET}${CYAN}npx auroq-os login${RESET}${DIM})${RESET}

${DIM}  Ritual de todo dia, em toda maquina:${RESET}

    ${GOLD}Sentou${RESET}    → ${CYAN}*sync${RESET}              ${DIM}— puxa o que mudou nas outras maquinas${RESET}
    ${GOLD}Levantou${RESET}  → ${CYAN}*commit${RESET} + ${CYAN}*push${RESET}   ${DIM}— entrega o seu trabalho pro GitHub${RESET}

${DIM}  Nunca levante da maquina com trabalho nao entregue.${RESET}

${PURPLE}${BOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}
${DIM}  Auroq OS v${PKG_VERSION} — Sistema Operacional de IA para Experts${RESET}
`);
}

// ─── CLI ─────────────────────────────────────────────────
const command = process.argv[2];

if (command === 'init' || command === 'install') {
  init().catch(err => {
    error(`Falha na instalacao: ${err.message}`);
    process.exit(1);
  });
} else if (command === 'clone') {
  clone(process.argv[3]).catch(err => {
    error(`Falha ao clonar: ${err.message}`);
    process.exit(1);
  });
} else if (command === 'fix-gitignore') {
  (async () => {
    step('Protegendo segredos...');
    await applySecretProtections(process.cwd());
  })().catch(err => {
    error(`Falha: ${err.message}`);
    process.exit(1);
  });
} else if (command === 'login') {
  auth.interactiveLogin().catch(err => {
    error(`Falha no login: ${err.message}`);
    process.exit(1);
  });
} else if (command === 'logout') {
  auth.logout().catch(err => {
    error(`Falha no logout: ${err.message}`);
    process.exit(1);
  });
} else if (command === 'whoami') {
  try {
    auth.whoami();
  } catch (err) {
    error(`Falha: ${err.message}`);
    process.exit(1);
  }
} else if (command === 'check-access') {
  // Gate estrito (online) — usado pelo Ops antes de *update e pelo arcane-pack.
  // Exit 0 = contrato ativo validado agora; exit 1 = bloqueado / sem conexao.
  auth.requireActiveAccess()
    .then(() => process.exit(0))
    .catch(err => {
      error(`Falha ao verificar acesso: ${err.message}`);
      process.exit(1);
    });
} else if (command === 'update') {
  // Update e feito pelo Ops dentro do Claude Code, nao pelo CLI diretamente
  log(`${BOLD}Para atualizar o Auroq OS:${RESET}`);
  log('');
  log(`  1. Abra o Claude Code: ${CYAN}claude${RESET}`);
  log(`  2. Ative o Ops: ${CYAN}/AuroqOS:agents:ops${RESET}`);
  log(`  3. Digite: ${CYAN}*update${RESET}`);
  log('');
  log(`${DIM}O Ops atualiza o framework sem tocar nos seus dados.${RESET}`);
} else if (command === 'conectar-1password' || command === 'connect-1password') {
  const onepassword = require('../lib/onepassword');
  onepassword.connect().catch(e => {
    error(`Falha ao conectar 1Password: ${e.message}`);
    process.exit(1);
  });
} else if (command === 'sync-codex') {
  // Regenera as skills do Codex CLI a partir dos comandos atuais do projeto.
  try {
    execSync('node scripts/sync-codex-skills.mjs --clean', { cwd: process.cwd(), stdio: 'inherit' });
    execSync('node scripts/sync-codex-skills.mjs --check', { cwd: process.cwd(), stdio: 'inherit' });
    success('Skills locais do Codex atualizadas e verificadas. Use $companion, $ops, $consultor, ...');
  } catch (err) {
    error(`Falha ao sincronizar skills do Codex: ${err.message}`);
    process.exit(1);
  }
} else {
  showBanner();
  log(`${BOLD}Comandos disponiveis:${RESET}`);
  log(`  ${CYAN}init${RESET}     Instalar Auroq OS no diretorio atual (primeira maquina)`);
  log(`  ${CYAN}clone${RESET}    Continuar o seu negocio NESTA maquina (segunda maquina / colaborador)`);
  log(`  ${CYAN}fix-gitignore${RESET}  Garantir protecoes de segredo no .gitignore (vault, .env)`);
  log(`  ${CYAN}login${RESET}    Autenticar com email + senha da Mentoria Arcane`);
  log(`  ${CYAN}logout${RESET}   Encerrar sessao local`);
  log(`  ${CYAN}whoami${RESET}   Mostrar usuario autenticado`);
  log(`  ${CYAN}check-access${RESET}  Validar acesso ativo (online; exit 0=ativo, 1=bloqueado)`);
  log(`  ${CYAN}update${RESET}   Atualizar (via Ops dentro do Claude Code)`);
  log(`  ${CYAN}sync-codex${RESET}  Gerar e verificar as skills locais do Codex CLI ($nome)`);
  log(`  ${CYAN}conectar-1password${RESET}  Conectar o 1Password CLI (token lido do Ctrl+C, nunca digitado)`);
  log('');
  log(`${DIM}Uso: npx auroq-os init${RESET}`);
  log('');
}
