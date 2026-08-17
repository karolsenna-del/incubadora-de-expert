#!/usr/bin/env node
// build-carousel.mjs — Motor de produção de carrosséis (padrão validado 12/06/2026)
//
// Uso:
//   node build-carousel.mjs <slides.json> [--out <dir>]
//
// slides.json:
//   {
//     "template": "euriler-tweet-light",      // pasta em ~/.carrossel-arcane/templates/
//     "name": "carrossel-mythos",             // vira ~/Downloads/<name>/
//     "slides": [
//       { "text": "texto com <strong>bold</strong>", "image": "/abs/path/card1.png" },
//       { "text": "...", "image": null }       // image:null = slide text-only (centralizado)
//     ]
//   }
//
// Convenção do squad: card{N} = bloco {N} da copy. Bloco sem card → text-only.
// Cada slide vira slide-NN.png (1080x1350) em ~/Downloads/<name>/.
//
// O "chassis" (header tweet + auto-fit do texto + imagem full-width com bordinha) é
// fixo aqui. A "identidade" (avatar, nome, @, fonte, cores, margem da imagem) vem do
// meta.yaml do template. Mude o look no template, não aqui.

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';

const HOME = os.homedir();
const TEMPLATES_DIR = path.join(HOME, '.carrossel-arcane', 'templates');

// ---------- args ----------
const args = process.argv.slice(2);
const cfgPath = args.find(a => !a.startsWith('--'));
if (!cfgPath) { console.error('Uso: node build-carousel.mjs <slides.json> [--out <dir>]'); process.exit(1); }
const outFlagIdx = args.indexOf('--out');
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));

// ---------- template / identidade ----------
const tdir = path.join(TEMPLATES_DIR, cfg.template);
if (!fs.existsSync(tdir)) { console.error(`ERRO: template não encontrado: ${tdir}`); process.exit(1); }
const metaRaw = fs.readFileSync(path.join(tdir, 'meta.yaml'), 'utf8');
const meta = (k, def) => {
  const m = metaRaw.match(new RegExp(`^\\s*${k}\\s*:\\s*"([^"]*)"|^\\s*${k}\\s*:\\s*([^\\n#]+)`, 'm'));
  if (!m) return def;
  const v = (m[1] !== undefined ? m[1] : m[2]).trim();
  return v || def;
};
const id = {
  name:    meta('author_name', 'Autor'),
  handle:  meta('author_handle', 'usuario'),
  verified: meta('verified', 'true') === 'true',
  font:    meta('font', 'Open Sans'),
  bg:      meta('bg', '#FFFFFF'),
  text:    meta('text_color', '#0F1419'),
  side:    parseInt(meta('image_side_margin', '38'), 10),
  radius:  parseInt(meta('image_radius', '0'), 10),
  sizeImg: parseInt(meta('text_size_image', '44'), 10),
  sizeTxt: parseInt(meta('text_size_textonly', '48'), 10),
};
const avatarCandidates = [
  path.join(tdir, 'assets', 'avatar.png'),
  path.join(tdir, 'avatar.png'),
];
const avatarSrc = avatarCandidates.find(p => fs.existsSync(p));
const hasAvatar = !!avatarSrc;

// ---------- build dir ----------
const buildDir = path.join(os.tmpdir(), `carousel-build-${cfg.name}`);
fs.rmSync(buildDir, { recursive: true, force: true });
fs.mkdirSync(buildDir, { recursive: true });
if (hasAvatar) fs.copyFileSync(avatarSrc, path.join(buildDir, 'avatar.png'));

const VERIFIED_SVG = `<svg class="verified" viewBox="0 0 22 22" fill="none"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.751-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.275.213-1.816.568s-.972.854-1.245 1.44c-.608-.223-1.264-.27-1.898-.14-.633.131-1.218.437-1.687.882-.445.47-.751 1.053-.882 1.687-.13.633-.083 1.29.14 1.897-.586.274-1.084.705-1.439 1.246-.354.541-.55 1.17-.568 1.816.018.647.214 1.276.568 1.817.355.54.853.972 1.44 1.245-.224.608-.27 1.264-.14 1.898.13.633.436 1.218.881 1.687.47.445 1.054.751 1.687.882.634.13 1.29.083 1.898-.14.273.587.704 1.086 1.245 1.44s1.17.551 1.816.569c.647-.018 1.276-.214 1.817-.569.54-.354.972-.853 1.245-1.44.608.223 1.264.27 1.898.14.633-.131 1.217-.437 1.687-.882.445-.47.751-1.053.882-1.687.13-.634.083-1.29-.14-1.898.586-.273 1.084-.704 1.439-1.245.354-.541.55-1.17.568-1.817zM9.7 14.62l-3.39-3.42 1.41-1.41 1.98 1.98 4.85-4.86 1.42 1.42-6.27 6.29z" fill="#1D9BF0"/></svg>`;

function fontHref(family) {
  return `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap`;
}

function html(slide, imgRef) {
  const hasImg = !!imgRef;
  const cls = hasImg ? 'has-image' : 'text-only';
  const startSize = hasImg ? id.sizeImg : id.sizeTxt;
  const avatarCss = hasAvatar
    ? `background-image:url('avatar.png'); background-size:cover; background-position:center;`
    : `background:#E1E8ED;`;
  const media = hasImg ? `<div class="media"><img src="${imgRef}" alt=""></div>` : '';
  const verified = id.verified ? VERIFIED_SVG : '';
  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${fontHref(id.font)}" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { width:1080px; height:1350px; background:${id.bg};
    font-family:'${id.font}',-apple-system,BlinkMacSystemFont,sans-serif; color:${id.text}; overflow:hidden; }
  .slide { width:1080px; height:1350px; padding:70px; display:flex; flex-direction:column;
    justify-content:center; background:${id.bg}; }
  .inner { display:flex; flex-direction:column; }
  .header { display:flex; align-items:center; gap:24px; margin-bottom:40px; flex-shrink:0; }
  .avatar { width:128px; height:128px; min-width:128px; max-width:128px; max-height:128px;
    ${avatarCss} border-radius:50%; flex-shrink:0; }
  .author { display:flex; flex-direction:column; justify-content:center; }
  .name-row { display:flex; align-items:center; gap:12px; }
  .name { font-weight:700; font-size:48px; line-height:1.1; color:${id.text}; letter-spacing:-0.5px; }
  .verified { width:40px; height:40px; flex-shrink:0; }
  .username { font-weight:400; font-size:35px; color:#536471; margin-top:6px; }
  .text { font-weight:400; font-size:${startSize}px; line-height:1.38; color:${id.text}; letter-spacing:-0.3px; }
  .text strong, .text b { font-weight:700; }
  .media { width:calc(100% + ${id.side * 2}px); margin:36px -${id.side}px 0; background:${id.bg};
    border-radius:${id.radius}px; overflow:hidden; }
  .media img { width:100%; height:auto; display:block; }
  .slide.text-only .text { line-height:1.45; }
</style></head>
<body>
<div class="slide ${cls}">
  <div class="inner">
    <div class="header">
      <div class="avatar"></div>
      <div class="author">
        <div class="name-row"><div class="name">${id.name}</div>${verified}</div>
        <div class="username">@${id.handle}</div>
      </div>
    </div>
    <div class="text">${slide.text}</div>
    ${media}
  </div>
</div>
<script>
  // AUTO-FIT: reduz a fonte do texto até o conjunto caber harmônico em 1350px
  async function fit() {
    try { await document.fonts.ready; } catch(e){}
    await Promise.all([...document.images].map(im => im.complete ? null : new Promise(r => { im.onload = im.onerror = r; })));
    const AVAIL = 1350 - 140;
    const inner = document.querySelector('.inner');
    const text = document.querySelector('.text');
    let size = parseFloat(getComputedStyle(text).fontSize), guard = 0;
    while (inner.scrollHeight > AVAIL && size > 26 && guard < 240) {
      size -= 1; text.style.fontSize = size + 'px'; guard++;
    }
    document.title = 'fit:' + size;
  }
  fit();
</script>
</body></html>`;
}

// ---------- resolve Chrome ----------
function findChrome() {
  const candidates = [];
  const pw = path.join(HOME, 'Library/Caches/ms-playwright');
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw)) {
      const p = path.join(pw, d, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (fs.existsSync(p)) candidates.push(p);
      const p2 = path.join(pw, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing');
      if (fs.existsSync(p2)) candidates.push(p2);
    }
  }
  candidates.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  candidates.push('/Applications/Chromium.app/Contents/MacOS/Chromium');

  // Windows
  const pwWin = path.join(HOME, 'AppData/Local/ms-playwright');
  if (fs.existsSync(pwWin)) {
    for (const d of fs.readdirSync(pwWin)) {
      const p = path.join(pwWin, d, 'chrome-win/chrome.exe');
      if (fs.existsSync(p)) candidates.push(p);
    }
  }
  candidates.push('C:/Program Files/Google/Chrome/Application/chrome.exe');
  candidates.push('C:/Program Files (x86)/Google/Chrome/Application/chrome.exe');

  // Linux
  candidates.push('/usr/bin/google-chrome');
  candidates.push('/usr/bin/chromium-browser');
  candidates.push('/usr/bin/chromium');

  return candidates.find(c => fs.existsSync(c));
}
const CHROME = findChrome();
if (!CHROME) { console.error('ERRO: Chromium não encontrado (npx @playwright/mcp install-browser chromium)'); process.exit(1); }

// ---------- output ----------
const outDir = outFlagIdx >= 0 ? path.resolve(args[outFlagIdx + 1]) : path.join(HOME, 'Downloads', cfg.name);
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (/^slide-\d+\.png$/.test(f)) fs.rmSync(path.join(outDir, f));

// ---------- render ----------
let withImg = 0, textOnly = 0;
cfg.slides.forEach((slide, i) => {
  const nn = String(i + 1).padStart(2, '0');
  let imgRef = null;
  if (slide.image) {
    if (!fs.existsSync(slide.image)) { console.error(`AVISO slide ${nn}: imagem não existe → ${slide.image} (vira text-only)`); }
    else { imgRef = `img-${nn}.png`; fs.copyFileSync(slide.image, path.join(buildDir, imgRef)); withImg++; }
  }
  if (!imgRef) textOnly++;
  fs.writeFileSync(path.join(buildDir, `slide-${nn}.html`), html(slide, imgRef), 'utf8');
  execFileSync(CHROME, [
    '--headless', '--disable-gpu', '--hide-scrollbars',
    '--window-size=1080,1350', '--virtual-time-budget=6000',
    `--screenshot=${path.join(outDir, `slide-${nn}.png`)}`,
    `file://${path.join(buildDir, `slide-${nn}.html`)}`,
  ], { stdio: 'ignore' });
});

const total = fs.readdirSync(outDir).filter(f => /^slide-\d+\.png$/.test(f)).length;
console.log(`OK: ${total}/${cfg.slides.length} slides → ${outDir}`);
console.log(`   com imagem: ${withImg} · text-only: ${textOnly} · template: ${cfg.template}`);
