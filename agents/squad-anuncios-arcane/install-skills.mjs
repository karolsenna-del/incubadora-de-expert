#!/usr/bin/env node
// =============================================================================
// install-skills.mjs — Squad Anúncios Arcane
// Instala as 3 skills do pipeline (competitor-research, scrape-ads, ad-brief)
// embarcadas no squad em .claude/skills/ do projeto, pra que funcionem como
// slash commands e fiquem acessíveis pela ferramenta Skill.
//
// USO: rode a partir da RAIZ do projeto:
//   node squads/squad-anuncios-arcane/install-skills.mjs
// =============================================================================

import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const squadDir = dirname(fileURLToPath(import.meta.url));
const skillsSrc = join(squadDir, 'skills');
const projectRoot = process.cwd();
const skillsDest = resolve(projectRoot, '.claude', 'skills');

const SKILLS = ['competitor-research', 'scrape-ads', 'ad-brief'];

console.log('═══════════════════════════════════════════════════');
console.log('  Squad Anúncios Arcane — Instalação das Skills');
console.log('═══════════════════════════════════════════════════\n');

if (!existsSync(skillsSrc)) {
  console.error(`ERRO: pasta de skills não encontrada em ${skillsSrc}`);
  console.error('Confirme que o squad foi extraído por completo.');
  process.exit(1);
}

if (!existsSync(join(projectRoot, '.claude'))) {
  console.warn('AVISO: não há pasta .claude/ no diretório atual.');
  console.warn(`Diretório atual: ${projectRoot}`);
  console.warn('Se este não for a raiz do seu projeto, cancele (Ctrl+C) e rode de novo a partir da raiz.\n');
}

mkdirSync(skillsDest, { recursive: true });

let ok = 0;
for (const skill of SKILLS) {
  const src = join(skillsSrc, skill);
  const dest = join(skillsDest, skill);
  if (!existsSync(join(src, 'SKILL.md'))) {
    console.warn(`  ⚠ ${skill}: SKILL.md não encontrado — pulando`);
    continue;
  }
  cpSync(src, dest, { recursive: true });
  console.log(`  ✓ ${skill}  →  .claude/skills/${skill}/`);
  ok++;
}

console.log(`\n${ok}/${SKILLS.length} skills instaladas em ${skillsDest}`);

if (ok === SKILLS.length) {
  console.log('\nPronto. Reinicie o Claude Code para que os comandos');
  console.log('/competitor-research, /scrape-ads e /ad-brief fiquem disponíveis.');
} else {
  console.log('\nATENÇÃO: nem todas as skills foram instaladas — verifique os avisos acima.');
  process.exit(1);
}
