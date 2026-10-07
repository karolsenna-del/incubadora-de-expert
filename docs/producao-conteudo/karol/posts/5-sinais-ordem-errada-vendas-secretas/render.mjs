#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const root = path.dirname(new URL(import.meta.url).pathname);
const htmlPath = path.join(root, 'carrossel-editavel.html');
const outDir = path.join(root, 'laminas');
const downloadsDir = path.join(os.homedir(), 'Downloads', '5-sinais-ordem-errada-vendas-secretas');

const chromeCandidates = [
  path.join(os.homedir(), '.cache/ms-playwright/chromium-1234/chrome-linux64/chrome'),
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];
const chrome = chromeCandidates.find(fs.existsSync);
if (!chrome) throw new Error('Chromium não encontrado.');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(downloadsDir, { recursive: true });
for (const dir of [outDir, downloadsDir]) {
  for (const file of fs.readdirSync(dir)) {
    if (/^(slide-\d{2}|prancha-revisao)\.png$/.test(file)) fs.rmSync(path.join(dir, file));
  }
}

function screenshot(url, target, width, height) {
  execFileSync(chrome, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=1', `--window-size=${width},${height}`,
    '--virtual-time-budget=2500', `--screenshot=${target}`, url,
  ], { stdio: 'pipe' });
}

const baseUrl = pathToFileURL(htmlPath).href;
for (let i = 1; i <= 6; i += 1) {
  const filename = `slide-${String(i).padStart(2, '0')}.png`;
  const target = path.join(outDir, filename);
  screenshot(`${baseUrl}?slide=${i}`, target, 1080, 1350);
  fs.copyFileSync(target, path.join(downloadsDir, filename));
}

const boardPath = path.join(root, 'prancha-revisao.html');
const cards = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return `<figure><img src="laminas/slide-${n}.png" alt="Lâmina ${n}"><figcaption>LÂMINA ${n}</figcaption></figure>`;
}).join('');
fs.writeFileSync(boardPath, `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Prancha de revisão</title><style>*{box-sizing:border-box}body{margin:0;width:1800px;height:1520px;overflow:hidden;background:#171719;color:#f7f7f4;font-family:Arial,sans-serif;padding:54px 60px}header{display:flex;justify-content:space-between;align-items:end;margin-bottom:34px}h1{font-size:34px;margin:0}p{margin:0;color:#aaa;font-size:18px}.grid{display:grid;grid-template-columns:repeat(3,480px);gap:34px 70px}figure{margin:0}img{display:block;width:480px;height:600px;object-fit:cover;box-shadow:0 16px 35px #0008}figcaption{font-size:15px;letter-spacing:.14em;color:#ff6b1a;margin-top:12px;font-weight:bold}</style><body><header><h1>5 sinais — ordem errada</h1><p>Card Black · 6 lâminas · 1080 × 1350</p></header><main class="grid">${cards}</main></body></html>`);

const boardTarget = path.join(root, 'prancha-revisao.png');
screenshot(pathToFileURL(boardPath).href, boardTarget, 1800, 1520);
fs.copyFileSync(boardTarget, path.join(downloadsDir, 'prancha-revisao.png'));
for (const file of ['legenda.txt', 'carrossel-editavel.html', 'slides.json', 'roteiro.md', 'render.mjs']) {
  fs.copyFileSync(path.join(root, file), path.join(downloadsDir, file));
}
fs.cpSync(path.join(root, 'assets'), path.join(downloadsDir, 'assets'), { recursive: true });

console.log(`OK: 6 slides em ${outDir}`);
console.log(`OK: cópia de entrega em ${downloadsDir}`);
console.log(`OK: prancha em ${boardTarget}`);
