#!/usr/bin/env node
// build-tipografico.mjs — Motor de produção pro template "diagnostico-tipografico"
// (e outros templates 100% tipográficos com template.html próprio + placeholders/modifiers,
// que build-carousel.mjs não sabe renderizar porque ele só implementa o chassis "tweet card").
//
// Uso:
//   node build-tipografico.mjs <slides.json> [--out <dir>]
//
// slides.json:
//   {
//     "template": "diagnostico-tipografico",   // pasta em ~/.carrossel-arcane/templates/
//     "name": "5-erros-estruturar-metodo",     // vira ~/Downloads/<name>/
//     "slides": [
//       { "numero": "1", "texto": "<strong>Erro 1:</strong> ...", "modifiers": [] },
//       { "numero": "", "texto": "capa/virada/cta...", "modifiers": ["sem-numero"] }
//     ]
//   }
//
// Le o template.html do template (placeholders {{NUMERO}} / {{TEXTO}}), aplica os
// modifiers como classes na div.slide, e renderiza via Chromium headless.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const HOME = os.homedir();
const TEMPLATES_DIR = path.join(HOME, '.carrossel-arcane', 'templates');

const args = process.argv.slice(2);
const cfgPath = args.find(a => !a.startsWith('--'));
if (!cfgPath) { console.error('Uso: node build-tipografico.mjs <slides.json> [--out <dir>]'); process.exit(1); }
const outFlagIdx = args.indexOf('--out');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

const tdir = path.join(TEMPLATES_DIR, cfg.template);
const templatePath = path.join(tdir, 'template.html');
if (!fs.existsSync(templatePath)) { console.error(`ERRO: template.html não encontrado: ${templatePath}`); process.exit(1); }
const templateRaw = fs.readFileSync(templatePath, 'utf8');

const buildDir = path.join(os.tmpdir(), `tipografico-build-${cfg.name}`);
fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

// auto-fit: encolhe .texto se estourar a altura do slide (o template não tem isso nativo)
const AUTOFIT_SCRIPT = `
<script>
  async function fit() {
    try { await document.fonts.ready; } catch(e){}
    const slide = document.querySelector('.slide');
    const texto = document.querySelector('.texto');
    let size = parseFloat(getComputedStyle(texto).fontSize), guard = 0;
    while (slide.scrollHeight > slide.clientHeight && size > 28 && guard < 240) {
      size -= 1; texto.style.fontSize = size + 'px'; guard++;
    }
  }
  fit();
</script>`;

function html(slide) {
  const modifiers = (slide.modifiers || []).join(' ');
  let out = templateRaw
    .replace('{{NUMERO}}', slide.numero || '')
    .replace('{{TEXTO}}', slide.texto || '')
    .replace('<div class="slide">', `<div class="slide ${modifiers}">`)
    .replace('</body>', `${AUTOFIT_SCRIPT}</body>`);
  return out;
}

// Chrome headless (Windows) recorta a janela sem preencher o viewport inteiro —
// sobra uma barra preta (~18px direita, ~96px embaixo) quando o slide não é fundo
// preto. Validado empiricamente em 10/08/2026 (constante, não escala com o tamanho).
// Fix: renderiza maior que o alvo e corta a sobra de volta pro tamanho exato via ffmpeg.
const WIN_BORDER_X = 18;
const WIN_BORDER_Y = 96;

function findFFmpeg() {
  const candidates = ['ffmpeg', 'ffmpeg.exe'];
  const winget = path.join(HOME, 'AppData/Local/Microsoft/WinGet/Packages');
  if (fs.existsSync(winget)) {
    for (const pkg of fs.readdirSync(winget)) {
      if (!pkg.toLowerCase().includes('ffmpeg')) continue;
      const pkgDir = path.join(winget, pkg);
      const stack = [pkgDir];
      while (stack.length) {
        const dir = stack.pop();
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          const p = path.join(dir, entry.name);
          if (entry.isDirectory()) stack.push(p);
          else if (entry.name.toLowerCase() === 'ffmpeg.exe') candidates.push(p);
        }
      }
    }
  }
  for (const c of candidates) {
    try { execFileSync(c, ['-version'], { stdio: 'ignore' }); return c; } catch (e) { /* tenta próximo */ }
  }
  return null;
}
const FFMPEG = findFFmpeg();

function screenshot(chromeArgsExtra, htmlPath, finalOutPath, w, h) {
  if (!FFMPEG) {
    execFileSync(CHROME, [
      '--headless', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
      `--window-size=${w},${h}`, '--virtual-time-budget=6000',
      `--screenshot=${finalOutPath}`, ...chromeArgsExtra, `file://${htmlPath}`,
    ], { stdio: 'ignore' });
    return;
  }
  const rawPath = finalOutPath.replace(/\.png$/, '.raw.png');
  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
    `--window-size=${w + WIN_BORDER_X},${h + WIN_BORDER_Y}`, '--virtual-time-budget=6000',
    `--screenshot=${rawPath}`, ...chromeArgsExtra, `file://${htmlPath}`,
  ], { stdio: 'ignore' });
  execFileSync(FFMPEG, ['-y', '-i', rawPath, '-vf', `crop=${w}:${h}:0:0`, finalOutPath], { stdio: 'ignore' });
  fs.rmSync(rawPath, { force: true });
}

function findChrome() {
  const candidates = [];
  const pwMac = path.join(HOME, 'Library/Caches/ms-playwright');
  if (fs.existsSync(pwMac)) {
    for (const d of fs.readdirSync(pwMac)) {
      const p = path.join(pwMac, d, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (fs.existsSync(p)) candidates.push(p);
      const p2 = path.join(pwMac, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (fs.existsSync(p2)) candidates.push(p2);
    }
  }
  candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  candidates.push('/Applications/Chromium.app/Contents/MacOS/Chromium');

  const pwWin = path.join(HOME, 'AppData/Local/ms-playwright');
  if (fs.existsSync(pwWin)) {
    for (const d of fs.readdirSync(pwWin)) {
      if (!d.startsWith('chromium-')) continue;
      const p = path.join(pwWin, d, 'chrome-win64', 'chrome.exe');
      if (fs.existsSync(p)) candidates.push(p);
      const p32 = path.join(pwWin, d, 'chrome-win', 'chrome.exe');
      if (fs.existsSync(p32)) candidates.push(p32);
    }
  }
  candidates.push('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
  candidates.push('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe');

  candidates.push('/usr/bin/google-chrome', '/usr/bin/chromium-browser', '/usr/bin/chromium');

  return candidates.find(c => fs.existsSync(c));
}
const CHROME = findChrome();
if (!CHROME) { console.error('ERRO: Chromium não encontrado (npx @playwright/mcp install-browser chromium)'); process.exit(1); }

const outDir = outFlagIdx >= 0 ? path.resolve(args[outFlagIdx + 1]) : path.join(HOME, 'Downloads', cfg.name);
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (/^slide-\d+\.png$/.test(f)) fs.rmSync(path.join(outDir, f));

cfg.slides.forEach((slide, i) => {
  const nn = String(i + 1).padStart(2, '0');
  const htmlPath = path.join(buildDir, `slide-${nn}.html`);
  fs.writeFileSync(htmlPath, html(slide), 'utf8');
  screenshot([], htmlPath, path.join(outDir, `slide-${nn}.png`), 1080, 1350);
});

const total = fs.readdirSync(outDir).filter(f => /^slide-\d+\.png$/.test(f)).length;
console.log(`OK: ${total}/${cfg.slides.length} slides → ${outDir}`);
console.log(`   template: ${cfg.template}`);
