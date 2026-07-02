#!/usr/bin/env node
// build-cinema.mjs — Motor do chassis "Cinema Editorial" (foto full-bleed + texto overlay)
//
// Uso:
//   node build-cinema.mjs <slides.json> [--out <dir>]
//
// slides.json:
//   {
//     "template": "cinema-editorial",          // pasta em ~/.carrossel-arcane/templates/
//     "name": "carrossel-x",                   // vira ~/Downloads/<name>/
//     "slides": [
//       { "type":"capa",  "image":"/abs/card1.png", "kicker":"As principais", "title":"QUEM FICA DE FORA" },
//       { "type":"card",  "image":"/abs/card2.png", "header":"Figurinhas", "text":"Frase de impacto do slide." },
//       { "type":"cta",   "image":"/abs/card6.png", "header":"Figurinhas", "text":"Manda pro pai ou mae...", "cta":"siga @david" }
//     ]
//   }
//
// type: capa  -> kicker (script) + title (display Cinzel) central
//       card  -> header (script topo) + text (rodape, com linha divisoria)
//       cta   -> igual card + bloco de cta no canto inferior direito
//
// Identidade (fontes, cores, acento) vem do meta.yaml do template. Chassis vive aqui.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const HOME = os.homedir();
const TEMPLATES_DIR = path.join(HOME, '.carrossel-arcane', 'templates');

// ---------- args ----------
const args = process.argv.slice(2);
const cfgPath = args.find(a => !a.startsWith('--'));
if (!cfgPath) { console.error('Uso: node build-cinema.mjs <slides.json> [--out <dir>]'); process.exit(1); }
const outFlagIdx = args.indexOf('--out');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

// ---------- template / identidade ----------
const tdir = path.join(TEMPLATES_DIR, cfg.template);
if (!fs.existsSync(tdir)) { console.error(`ERRO: template nao encontrado: ${tdir}`); process.exit(1); }
const metaRaw = fs.readFileSync(path.join(tdir, 'meta.yaml'), 'utf8');
const meta = (k, def) => {
  const line = metaRaw.match(new RegExp(`^\\s*${k}\\s*:\\s*(.+)$`, 'm'));
  if (!line) return def;
  let v = line[1].trim();
  const q = v.match(/^"([^"]*)"/);
  if (q) return q[1];
  v = v.replace(/\s+#.*$/, '').trim();
  return v || def;
};
const id = {
  fontScript:  meta('font_script', 'Kaushan Script'),
  fontDisplay: meta('font_display', 'Cinzel'),
  fontBody:    meta('font_body', 'Space Grotesk'),
  accent:      meta('accent', '#22D3EE'),
};

// ---------- build dir ----------
const buildDir = path.join(os.tmpdir(), `cinema-build-${cfg.name}`);
fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });

const fontHref = `https://fonts.googleapis.com/css2?family=${id.fontScript.replace(/ /g,'+')}&family=${id.fontDisplay.replace(/ /g,'+')}:wght@600;700&family=${id.fontBody.replace(/ /g,'+')}:wght@500;600;700&display=swap`;

// Chrome headless corta ~87px do fundo do --window-size (vira faixa branca).
// Renderiza com folga embaixo e corta o topo 1350px depois.
const PAD = 96;

const css = `
* { box-sizing:border-box; margin:0; padding:0; }
body { width:1080px; height:${1350 + PAD}px; overflow:hidden; background:#0b0e13;
  font-family:'${id.fontBody}',-apple-system,sans-serif; }
.slide { position:relative; width:1080px; height:1350px; color:#fff; overflow:hidden;
  background-size:cover; background-position:center; background-color:#14181f; }
.slide::before { content:''; position:absolute; left:0; top:0; right:0; height:340px;
  background:linear-gradient(to bottom, rgba(0,0,0,0.50), rgba(0,0,0,0)); }
.slide::after { content:''; position:absolute; left:0; right:0; bottom:0; height:620px;
  background:linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0)); }

.brand { position:absolute; top:64px; left:60px; right:60px; text-align:center; z-index:2;
  font-family:'${id.fontScript}',cursive; font-size:84px; line-height:1; color:#fff;
  text-shadow:0 4px 24px rgba(0,0,0,0.55); }

.footer { position:absolute; left:80px; right:80px; bottom:96px; z-index:2; text-align:center; }
.footer .text { font-family:'${id.fontBody}',sans-serif; font-weight:700; font-style:italic;
  font-size:64px; line-height:1.12; letter-spacing:-0.5px; text-shadow:0 3px 18px rgba(0,0,0,0.7); }
.footer .text b, .footer .text strong { color:${id.accent}; }
.footer .divider { width:78%; height:3px; background:#fff; margin:30px auto 0;
  box-shadow:0 2px 10px rgba(0,0,0,0.5); }

/* capa */
.cover { position:absolute; left:60px; right:60px; top:50%; transform:translateY(-50%);
  z-index:2; text-align:center; }
.cover .kicker { font-family:'${id.fontScript}',cursive; font-size:60px; color:#fff;
  text-shadow:0 3px 18px rgba(0,0,0,0.6); margin-bottom:6px; }
.cover .title { font-family:'${id.fontDisplay}',serif; font-weight:700; font-size:104px;
  line-height:1.02; letter-spacing:1px; text-transform:uppercase; text-shadow:0 4px 24px rgba(0,0,0,0.65); }

/* cta */
.ctabox { position:absolute; right:70px; bottom:70px; z-index:3; text-align:right;
  font-family:'${id.fontBody}',sans-serif; font-weight:600; font-size:32px; line-height:1.25;
  color:#fff; text-shadow:0 2px 12px rgba(0,0,0,0.7); }
.ctabox b { color:${id.accent}; }
`;

function esc(s='') { return s; } // texto ja vem com <strong> opcional

function page(s) {
  let inner = '';
  const bg = s.image ? `style="background-image:url('${s._imgRef}')"` : '';
  if (s.type === 'capa') {
    inner = `<div class="cover">
      ${s.kicker ? `<div class="kicker">${esc(s.kicker)}</div>` : ''}
      <div class="title">${esc(s.title || '')}</div>
    </div>`;
  } else {
    inner = `
      ${s.header ? `<div class="brand">${esc(s.header)}</div>` : ''}
      <div class="footer">
        <div class="text">${esc(s.text || '')}</div>
        <div class="divider"></div>
      </div>
      ${s.cta ? `<div class="ctabox">${esc(s.cta)}</div>` : ''}`;
  }
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontHref}" rel="stylesheet">
<style>${css}</style></head>
<body><div class="slide" ${bg}>${inner}</div>
<script>
  async function fit(){
    try{ await document.fonts.ready; }catch(e){}
    await Promise.all([...document.images].map(im=>im.complete?null:new Promise(r=>{im.onload=im.onerror=r;})));
    // auto-fit do texto do rodape pra nao passar de ~3 linhas
    const t = document.querySelector('.footer .text');
    if (t){ let size=parseFloat(getComputedStyle(t).fontSize), g=0;
      while (t.scrollHeight/size > 3.6 && size>34 && g<120){ size-=2; t.style.fontSize=size+'px'; g++; } }
    document.title='ok';
  }
  fit();
</script></body></html>`;
}

// ---------- resolve Chrome ----------
function findChrome() {
  const c = [];
  const pw = path.join(HOME, 'Library/Caches/ms-playwright');
  if (fs.existsSync(pw)) for (const d of fs.readdirSync(pw)) {
    for (const sub of ['', 'chrome-mac-arm64/', 'chrome-mac/']) {
      const p = path.join(pw, d, sub + 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (fs.existsSync(p)) c.push(p);
    }
  }
  c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  c.push('/Applications/Chromium.app/Contents/MacOS/Chromium');
  return c.find(x => fs.existsSync(x));
}
const CHROME = findChrome();
if (!CHROME) { console.error('ERRO: Chromium nao encontrado'); process.exit(1); }

// ---------- output ----------
const outDir = outFlagIdx >= 0 ? path.resolve(args[outFlagIdx + 1]) : path.join(HOME, 'Downloads', cfg.name);
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (/^slide-\d+\.png$/.test(f)) fs.rmSync(path.join(outDir, f));

// ---------- render ----------
let withImg = 0;
cfg.slides.forEach((slide, i) => {
  const nn = String(i + 1).padStart(2, '0');
  if (slide.image) {
    if (!fs.existsSync(slide.image)) { console.error(`AVISO slide ${nn}: imagem nao existe -> ${slide.image}`); }
    else { const ref = `img-${nn}.png`; fs.copyFileSync(slide.image, path.join(buildDir, ref)); slide._imgRef = ref; withImg++; }
  }
  fs.writeFileSync(path.join(buildDir, `slide-${nn}.html`), page(slide), 'utf8');
  const shot = path.join(outDir, `slide-${nn}.png`);
  execFileSync(CHROME, ['--headless','--disable-gpu','--hide-scrollbars',
    `--window-size=1080,${1350 + PAD}`,'--virtual-time-budget=8000',
    `--screenshot=${shot}`,
    `file://${path.join(buildDir, `slide-${nn}.html`)}`], { stdio:'ignore' });
  // corta o topo 1080x1350 (remove a folga do PAD)
  execFileSync('python3', ['-c',
    `from PIL import Image;i=Image.open(r'${shot}').convert('RGB');i.crop((0,0,1080,1350)).save(r'${shot}')`
  ], { stdio:'ignore' });
});

const total = fs.readdirSync(outDir).filter(f => /^slide-\d+\.png$/.test(f)).length;
console.log(`OK: ${total}/${cfg.slides.length} slides -> ${outDir}`);
console.log(`   com imagem: ${withImg} · chassis: cinema-editorial · template: ${cfg.template}`);
