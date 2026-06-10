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
const { execSync } = require('child_process');
const auth = require('../lib/auth');

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

${PURPLE}${BOLD}       ▄▀█ █  █ █▀█ █▀█ █▀█${RESET}  ${DIM}OS v1.0${RESET}
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
    '.gitignore',
    '.env.example',
    'README.md',

    // Codex CLI adapter
    'AGENTS.md',
    'scripts/sync-codex-skills.mjs',
    'scripts/validate-hybrid.mjs',
  ];

  // Arquivos do ALUNO — nunca sobrescrever se ja existem
  const studentFiles = [
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

  // ─── Fase 4c: Adaptador Codex CLI (skills locais por projeto)
  step('Configurando Codex CLI...');
  try {
    execSync('node scripts/sync-codex-skills.mjs --clean', { cwd: targetDir, stdio: 'pipe' });
    execSync('node scripts/sync-codex-skills.mjs --check', { cwd: targetDir, stdio: 'pipe' });
    success('Codex CLI pronto — skills locais verificadas ($companion, $ops, etc.)');
  } catch {
    warn('Sync de skills do Codex falhou — rode "npx auroq-os sync-codex" para diagnosticar');
  }

  // ─── Fase 5: Package.json + npm install
  step('Configurando dependencias...');

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

  // ─── Fase 7: Health check rapido
  step('Verificando integridade...');

  const checks = [
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

  let passed = 0;
  for (const [file, label] of checks) {
    if (await fs.pathExists(path.join(targetDir, file))) {
      passed++;
    } else {
      warn(`${label} nao encontrado`);
    }
  }

  if (passed === checks.length) {
    success(`${passed}/${checks.length} verificacoes OK`);
  } else {
    warn(`${passed}/${checks.length} verificacoes OK — rode *bootstrap pra corrigir`);
  }

  // ─── Resultado final
  console.log(`
${PURPLE}${BOLD}  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}

${GREEN}${BOLD}  Auroq OS instalado com sucesso.${RESET}

${DIM}  Proximo passo:${RESET}

    ${CYAN}cd ${path.basename(targetDir)}${RESET}
    ${CYAN}claude${RESET} ${DIM}ou${RESET} ${CYAN}codex${RESET}
    ${CYAN}/auroq-companion${RESET} ${DIM}ou${RESET} ${CYAN}\$companion${RESET}

${DIM}  O Companion vai te receber e guiar a partir daqui.${RESET}

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
${DIM}  Auroq OS v2.1.0 — Sistema Operacional de IA para Experts${RESET}
${DIM}  "Tu aumentaste o meu poder como do boi selvagem." — Sl 92:10${RESET}
`);
}

// ─── CLI ─────────────────────────────────────────────────
const command = process.argv[2];

if (command === 'init' || command === 'install') {
  init().catch(err => {
    error(`Falha na instalacao: ${err.message}`);
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
  log(`  ${CYAN}init${RESET}     Instalar Auroq OS no diretorio atual`);
  log(`  ${CYAN}login${RESET}    Autenticar com email + senha da Mentoria Arcane`);
  log(`  ${CYAN}logout${RESET}   Encerrar sessao local`);
  log(`  ${CYAN}whoami${RESET}   Mostrar usuario autenticado`);
  log(`  ${CYAN}check-access${RESET}  Validar acesso ativo (online; exit 0=ativo, 1=bloqueado)`);
  log(`  ${CYAN}update${RESET}   Atualizar (via Ops dentro do Claude Code)`);
  log(`  ${CYAN}sync-codex${RESET}  Gerar e verificar as skills locais do Codex CLI ($nome)`);
  log('');
  log(`${DIM}Uso: npx auroq-os init${RESET}`);
  log('');
}
