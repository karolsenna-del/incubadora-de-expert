#!/usr/bin/env node
// =============================================================================
// consolidate-final.mjs — Squad Anúncios Arcane
// Consolida o entregável final do squad em 3 formatos:
//   - markdown master (resumo + brief + anúncios + log de bugs + links Airtable)
//   - HTML standalone (CSS embutido, pra abrir no browser)
//   - PDF (via pandoc — tenta xelatex/wkhtmltopdf/chrome headless em sequência)
//
// USO: rode a partir da raiz do projeto:
//   node squads/squad-anuncios-arcane/consolidate-final.mjs
// =============================================================================

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync, spawnSync } from 'node:child_process';

const projectRoot = process.cwd();
const today = new Date().toISOString().slice(0, 10);
const briefsDir = join(projectRoot, 'research', 'briefs');
const adsDir = join(projectRoot, 'research', 'anuncios');
const outDir = join(projectRoot, 'research', 'entregaveis');
const claudeMdPath = join(projectRoot, '.claude', 'CLAUDE.md');
const bugsLogPath = join(
  process.env.HOME,
  '.claude/projects/-Users-euriler-aios/memory/project_squad_anuncios_arcane_runtime_bugs.md'
);

mkdirSync(outDir, { recursive: true });

console.log('═══════════════════════════════════════════════════');
console.log('  Squad Anúncios Arcane — Consolidação Final');
console.log('═══════════════════════════════════════════════════\n');

// ─────────────────────────────────────────────────────────────────────────────
// Step 1: localizar inputs mais recentes
// ─────────────────────────────────────────────────────────────────────────────
function latestFile(dir, prefix) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith('.md'))
    .map((f) => ({ path: join(dir, f), mtime: statSync(join(dir, f)).mtime.getTime() }))
    .sort((a, b) => b.mtime - a.mtime);
  return files[0]?.path;
}

const briefPath = latestFile(briefsDir, 'ad-brief-');
const adsPath = latestFile(adsDir, 'anuncios-sugeridos-');

if (!briefPath) {
  console.error('✗ ERRO: Brief não encontrado em research/briefs/. Rode a Fase 3 (skill ad-brief) primeiro.');
  process.exit(1);
}
if (!adsPath) {
  console.error('✗ ERRO: Lote de anúncios não encontrado em research/anuncios/. Rode a Fase 4 (Téo) primeiro.');
  process.exit(1);
}

console.log(`✓ Brief:    ${briefPath}`);
console.log(`✓ Anúncios: ${adsPath}\n`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 2: ler conteúdo
// ─────────────────────────────────────────────────────────────────────────────
const brief = readFileSync(briefPath, 'utf8');
const ads = readFileSync(adsPath, 'utf8');
const claudeMd = existsSync(claudeMdPath) ? readFileSync(claudeMdPath, 'utf8') : '';
const bugs = existsSync(bugsLogPath) ? readFileSync(bugsLogPath, 'utf8') : '';

// Extrair config do CLAUDE.md
function extractSection(text, header) {
  const re = new RegExp(`## ${header}[\\s\\S]*?(?=\\n## |$)`, 'i');
  return text.match(re)?.[0] || '';
}

const configSection = extractSection(claudeMd, 'Ad Research Config');
const brandMatch = configSection.match(/Brand:\s*(.+)/i);
const brand = brandMatch ? brandMatch[1].trim() : 'Brand';

// ─────────────────────────────────────────────────────────────────────────────
// Step 3: compor resumo executivo
// ─────────────────────────────────────────────────────────────────────────────
function extractTop5Findings(briefText) {
  // Pega Section 1 (Executive Summary) do brief
  const sec1 = briefText.match(/##\s*Seção 1[\s\S]*?(?=\n## |\n---)/i);
  return sec1 ? sec1[0] : '_(Seção 1 do brief não encontrada)_';
}

function extractPriorityAds(adsText) {
  // Pega a parte "3 anúncios pra produzir PRIMEIRO" do lote
  const part3 = adsText.match(/# Parte 3[\s\S]*?(?=\n# Parte |\n---)/);
  return part3 ? part3[0] : '_(Parte 3 do lote não encontrada)_';
}

const top5 = extractTop5Findings(brief);
const prio3 = extractPriorityAds(ads);

// ─────────────────────────────────────────────────────────────────────────────
// Step 4: montar markdown master
// ─────────────────────────────────────────────────────────────────────────────
const master = `# Entregável Final — Inteligência de Anúncios

**Brand:** ${brand}
**Data:** ${today}
**Pipeline:** Squad Anúncios Arcane (4 agentes: Argus + Nina + Vera + Téo)
**Conteúdo:** Resumo executivo + Brief estratégico + Lote de anúncios + Banco + Bugs

---

## Como usar este documento

1. **Resumo executivo** (próxima seção) — 1 página. Os achados-chave + os 3 anúncios pra produzir primeiro. **Leia primeiro.**
2. **Brief estratégico completo** — análise competitiva de 8 seções (~25k chars). Pra entender o porquê de cada recomendação.
3. **Lote de 20+ anúncios** — cada um pronto pra produção (ângulo + formato + hook + roteiro + nota). Pra o time de criação.
4. **Banco bruto no Airtable** — link no fim, pra explorar manualmente.
5. **Log de bugs** — apêndice de transparência sobre o que aconteceu no pipeline.

---

# 📋 Resumo Executivo

${top5}

${prio3}

---

# 📊 Brief Estratégico Completo

${brief.replace(/^# .*\n/, '')}

---

# 🎬 Lote de Anúncios Sugeridos

${ads.replace(/^# .*\n/, '')}

---

# 🔗 Banco Bruto

As tabelas no Airtable contêm todos os dados que alimentaram este entregável.

- **Competitors** (concorrentes mapeados): https://airtable.com/appDfIcG7JH6VVpfm/tbltkQSU2F7tt5mYW
- **Ad Research** (todos os anúncios scrapeados + transcrições): https://airtable.com/appDfIcG7JH6VVpfm/tblukJN0nZ1kruwiZ

> Atualize mensalmente rodando \`/squad-anuncios-arcane\` em modo refresh.

---

# 🐛 Apêndice: Log de Bugs e Correções

Pipeline transparente — tudo que rolou no squad runtime.

${bugs.replace(/^---\nname:[\s\S]*?\n---\n*/, '')}

---

*Gerado automaticamente por \`consolidate-final.mjs\` (Squad Anúncios Arcane) em ${today}. Próxima rodada recomendada: ${nextMonth(today)}.*
`;

function nextMonth(dateStr) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 5: salvar markdown master
// ─────────────────────────────────────────────────────────────────────────────
const mdOut = join(outDir, `entregavel-final-${today}.md`);
writeFileSync(mdOut, master);
console.log(`✓ Markdown:  ${mdOut}  (${master.length} chars)`);

// ─────────────────────────────────────────────────────────────────────────────
// Step 6: gerar HTML standalone via pandoc — design system Euriler Jubé (EJ)
// ─────────────────────────────────────────────────────────────────────────────
const htmlOut = join(outDir, `entregavel-final-${today}.html`);

// Carregar fontes EJ em base64 (Clash Display + Space Grotesk)
const fontsDir = resolve(projectRoot, '.agents/skills/euriler-jube-design/fonts');
function fontB64(filename) {
  const p = join(fontsDir, filename);
  if (!existsSync(p)) return null;
  return readFileSync(p).toString('base64');
}
const fonts = {
  clashRegular: fontB64('ClashDisplay-Regular.woff2'),
  clashMedium: fontB64('ClashDisplay-Medium.woff2'),
  clashSemibold: fontB64('ClashDisplay-Semibold.woff2'),
  spaceRegular: fontB64('SpaceGrotesk-Regular.woff2'),
  spaceMedium: fontB64('SpaceGrotesk-Medium.woff2'),
  spaceSemibold: fontB64('SpaceGrotesk-SemiBold.woff2'),
  spaceBold: fontB64('SpaceGrotesk-Bold.woff2'),
};
const fontFaces = `
  @font-face { font-family: "Clash Display"; src: url(data:font/woff2;base64,${fonts.clashRegular}) format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
  @font-face { font-family: "Clash Display"; src: url(data:font/woff2;base64,${fonts.clashMedium}) format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
  @font-face { font-family: "Clash Display"; src: url(data:font/woff2;base64,${fonts.clashSemibold}) format("woff2"); font-weight: 600; font-style: normal; font-display: swap; }
  @font-face { font-family: "Space Grotesk"; src: url(data:font/woff2;base64,${fonts.spaceRegular}) format("woff2"); font-weight: 400; font-style: normal; font-display: swap; }
  @font-face { font-family: "Space Grotesk"; src: url(data:font/woff2;base64,${fonts.spaceMedium}) format("woff2"); font-weight: 500; font-style: normal; font-display: swap; }
  @font-face { font-family: "Space Grotesk"; src: url(data:font/woff2;base64,${fonts.spaceSemibold}) format("woff2"); font-weight: 600; font-style: normal; font-display: swap; }
  @font-face { font-family: "Space Grotesk"; src: url(data:font/woff2;base64,${fonts.spaceBold}) format("woff2"); font-weight: 700; font-style: normal; font-display: swap; }
`;

const css = `
<style>
  ${fontFaces}

  :root {
    --ej-abyss:        #07090F;
    --ej-bg:           #0A0E1A;
    --ej-surface:      #0D1B2A;
    --ej-surface-high: #1E293B;
    --ej-line:         #1A2438;
    --ej-line-soft:    #14202F;
    --ej-light:        #F0F4F8;
    --ej-mist:         #C8D2E0;
    --ej-silver:       #94A3B8;
    --ej-dim:          #54627A;
    --ej-electric:     #3B82F6;
    --ej-electric-hi:  #60A5FA;
    --ej-bio:          #06B6D4;
    --ej-bio-hi:       #22D3EE;
  }

  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }

  /* body = container central simples. max-width + margin auto. SEM flex. */
  body {
    background:
      radial-gradient(60% 50% at 50% 0%, #0F1C2E 0%, transparent 70%),
      radial-gradient(80% 60% at 50% 100%, #0B1422 0%, transparent 65%),
      var(--ej-bg);
    background-attachment: fixed;
    color: var(--ej-mist);
    font-family: "Space Grotesk", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    max-width: 820px;
    margin: 0 auto;
    padding: 56px 40px 96px;
  }

  /* tipografia — Clash Display nos títulos */
  h1, h2, h3, h4, h5 {
    font-family: "Clash Display", "Space Grotesk", system-ui, sans-serif;
    font-weight: 500;
    color: var(--ej-light);
    text-wrap: balance;
    letter-spacing: -0.015em;
    line-height: 1.2;
  }
  h1 {
    font-size: 2rem;
    margin: 48px 0 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--ej-line);
  }
  h1:first-child { margin-top: 8px; font-size: 2.5rem; padding-bottom: 18px; border-bottom: 2px solid var(--ej-bio); }
  h2 {
    font-size: 1.5rem;
    margin: 40px 0 16px;
    color: var(--ej-light);
  }
  h2::before {
    content: "";
    display: block;
    width: 28px;
    height: 2px;
    background: var(--ej-bio);
    margin-bottom: 12px;
  }
  h3 {
    font-size: 1.2rem;
    margin: 28px 0 10px;
    color: var(--ej-light);
  }
  h4 {
    font-size: 1rem;
    margin: 20px 0 8px;
    color: var(--ej-mist);
    font-weight: 600;
    letter-spacing: 0;
  }

  /* parágrafos */
  p {
    margin: 0 0 14px;
    color: var(--ej-mist);
    text-wrap: pretty;
    font-size: 0.95rem;
  }

  /* strong / em */
  strong { color: var(--ej-light); font-weight: 600; }
  em { color: var(--ej-mist); font-style: italic; }

  /* links */
  a {
    color: var(--ej-electric-hi);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
    transition: color 0.18s cubic-bezier(0.22, 0.61, 0.36, 1);
  }
  a:hover { color: var(--ej-bio-hi); }

  /* listas */
  ul, ol { padding-left: 24px; margin: 0 0 20px; color: var(--ej-mist); }
  li { margin: 6px 0; }
  li::marker { color: var(--ej-bio); }

  /* code inline */
  code {
    font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
    background: var(--ej-surface);
    color: var(--ej-bio-hi);
    padding: 0.15em 0.4em;
    border-radius: 4px;
    font-size: 0.875em;
    border: 1px solid var(--ej-line);
  }

  /* code blocks */
  pre {
    background: var(--ej-surface);
    border: 1px solid var(--ej-line);
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    margin: 20px 0;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  pre code {
    background: none;
    border: none;
    color: var(--ej-mist);
    padding: 0;
  }

  /* blockquote — borda lateral bio */
  blockquote {
    border-left: 2px solid var(--ej-bio);
    background: var(--ej-surface);
    padding: 16px 24px;
    margin: 24px 0;
    color: var(--ej-light);
    border-radius: 0 8px 8px 0;
    font-style: normal;
  }
  blockquote p { color: var(--ej-light); margin: 0; }
  blockquote p + p { margin-top: 12px; }

  /* TABELAS — fix do overflow + design EJ */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 24px 0;
    background: var(--ej-surface);
    border-radius: 8px;
    overflow: hidden;
    table-layout: auto;
    font-size: 0.9rem;
  }
  /* Wrapper pra overflow horizontal quando tabela exceder */
  .table-wrapper { overflow-x: auto; margin: 24px 0; border-radius: 8px; }

  th, td {
    border: 1px solid var(--ej-line);
    padding: 12px 16px;
    text-align: left;
    vertical-align: top;
    word-wrap: break-word;
    overflow-wrap: anywhere;
    max-width: 360px;
  }
  th {
    background: var(--ej-surface-high);
    color: var(--ej-bio);
    font-weight: 600;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    line-height: 1.3;
  }
  td { color: var(--ej-mist); }
  tr:nth-child(even) td { background: rgba(255, 255, 255, 0.012); }

  /* Tabela com hook longo — coluna específica com truncamento */
  td:last-child { font-size: 0.85rem; color: var(--ej-silver); }

  /* hr — divisor com luz bio */
  hr {
    border: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--ej-bio), transparent);
    margin: 64px 0;
    opacity: 0.4;
  }

  /* primeira página / hero do entregável */
  body > h1:first-child {
    text-align: left;
    margin-top: 24px;
    padding-bottom: 24px;
    border-bottom: 2px solid var(--ej-bio);
    font-size: clamp(2.5rem, 5vw, 4rem);
    color: var(--ej-light);
    letter-spacing: -0.02em;
  }

  /* labels / eyebrows quando aparecerem */
  .eyebrow {
    font-family: "Space Grotesk", sans-serif;
    font-size: 0.75rem;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--ej-bio);
    font-weight: 500;
    margin-bottom: 8px;
  }

  /* impressão (PDF) — ajustes finos */
  @media print {
    body { background: var(--ej-bg); padding: 32px; }
    h1, h2 { page-break-after: avoid; }
    table, blockquote, pre { page-break-inside: avoid; }
  }
</style>
`;

try {
  // GFM é mais previsível que markdown padrão do pandoc — sem grid_tables nem multiline_tables
  // que confundem com indentação de bullets
  execSync(`pandoc "${mdOut}" -f gfm -t html5 -H /dev/stdin -o "${htmlOut}"`, {
    input: `<meta charset="utf-8">\n<title>Entregável Final — ${brand}</title>\n${css}`,
    stdio: ['pipe', 'inherit', 'inherit'],
  });
  console.log(`✓ HTML:      ${htmlOut}`);
} catch (e) {
  console.error(`✗ HTML falhou: ${e.message.slice(0,200)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 7: gerar PDF — tenta engines em sequência
// ─────────────────────────────────────────────────────────────────────────────
const pdfOut = join(outDir, `entregavel-final-${today}.pdf`);

function tryEngine(args, label) {
  try {
    execSync(`pandoc "${mdOut}" -f gfm ${args} -o "${pdfOut}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.log(`  • ${label}: ${e.stderr?.toString().slice(0, 150) || 'erro desconhecido'}`);
    return false;
  }
}

console.log('\nTentando gerar PDF (engines em sequência)...');

// Estratégia 1: HTML → PDF via Chrome headless (mais confiável no Mac sem LaTeX)
let pdfOk = false;
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const chromiumPath = '/Applications/Chromium.app/Contents/MacOS/Chromium';
let chrome = null;
if (existsSync(chromePath)) chrome = chromePath;
else if (existsSync(chromiumPath)) chrome = chromiumPath;

if (chrome && existsSync(htmlOut)) {
  try {
    execSync(
      `"${chrome}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfOut}" "file://${htmlOut}"`,
      { stdio: 'pipe' }
    );
    pdfOk = existsSync(pdfOut) && statSync(pdfOut).size > 1000;
    if (pdfOk) console.log('  ✓ Chrome headless: OK');
  } catch (e) {
    console.log(`  • Chrome headless: ${e.message.slice(0, 100)}`);
  }
}

if (!pdfOk) pdfOk = tryEngine('--pdf-engine=xelatex', 'xelatex');
if (!pdfOk) pdfOk = tryEngine('--pdf-engine=wkhtmltopdf', 'wkhtmltopdf');
if (!pdfOk) pdfOk = tryEngine('--pdf-engine=weasyprint', 'weasyprint');

if (pdfOk) {
  console.log(`✓ PDF:       ${pdfOut}`);
} else {
  console.log(`\n⚠ PDF não pôde ser gerado. Pra habilitar, instale uma destas:`);
  console.log(`   - brew install --cask mactex (xelatex, mais completo)`);
  console.log(`   - brew install --cask wkhtmltopdf`);
  console.log(`   - Google Chrome (já comum, geralmente já está instalado)`);
}

console.log('\n═══════════════════════════════════════════════════');
console.log('  Entregável final pronto.');
console.log('═══════════════════════════════════════════════════');
console.log(`\nAbra um destes:\n`);
console.log(`  open "${mdOut}"`);
console.log(`  open "${htmlOut}"`);
if (pdfOk) console.log(`  open "${pdfOut}"`);
