#!/usr/bin/env node
// Fila de abordagem — envio assistido da 1ª mensagem (Karol, 10/11/2026).
// Nada aqui toca o Instagram: a página só copia a mensagem e abre o perfil no navegador da Karol.
// Quem clica em "Enviar mensagem", cola e envia é ela, na conta dela (REGRA-004 do Garimpeiro: robô nunca
// manda mensagem). Depois ela clica em "Enviei" e a linha da aba Garimpo vira Status "Abordagem feita"
// + revisão "aprovado" + data do dia.
//
// Uso:
//   node fila-abordagem.mjs [--perfil karol] [--porta 4317]   → abre http://127.0.0.1:4317 no navegador
//
// Fila = Status "Sem abordagem", revisão vazia/aprovado, com Copy. Ordem: Prioridade (Alta → Baixa), depois Score.
// Fecha sozinho depois de 2h sem uso ou pelo botão "Encerrar".

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { exec } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerValores, atualizar, letra, indiceDe, token } from './planilha.mjs';

const RAIZ_WORKER = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = (k, padrao) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] ? argv[i + 1] : padrao; };
const perfil = JSON.parse(readFileSync(join(RAIZ_WORKER, 'data', 'perfis', `${opt('perfil', 'karol')}.json`), 'utf8'));
const destino = perfil.destino;
const PORTA = Number(opt('porta', 4317));
const OCIOSO_MS = 2 * 60 * 60 * 1000;

process.env.GARIMPO_TOKEN ||= token(); // lê o cofre uma vez só

const COL = Object.fromEntries(['@', 'Nome', 'Link do perfil', 'Fato-gancho', 'Copy', 'Status revisão', 'Status',
  'Data Última Interação', 'Prioridade de abordagem', 'Score de Fit (0-4)'].map((c) => [c, indiceDe(c)]));
const ORDEM_PRIO = { Alta: 1, 'Média': 2, Baixa: 3 };
const norm = (s) => String(s || '').trim().replace(/^@/, '').toLowerCase();
const hoje = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Cuiaba' }); // AAAA-MM-DD

async function fila() {
  const [, ...linhas] = await lerValores(destino);
  return linhas
    .filter((l) => (l[COL.Status] || 'Sem abordagem') === 'Sem abordagem')
    .filter((l) => ['', 'aprovado'].includes(l[COL['Status revisão']] || ''))
    .filter((l) => (l[COL.Copy] || '').trim() && (l[COL['@']] || '').trim())
    .map((l) => ({
      arroba: norm(l[COL['@']]),
      nome: l[COL.Nome] || '',
      link: `https://www.instagram.com/${norm(l[COL['@']])}/`,
      gancho: l[COL['Fato-gancho']] || '',
      copy: l[COL.Copy],
      prioridade: l[COL['Prioridade de abordagem']] || '',
      score: Number(l[COL['Score de Fit (0-4)']]) || 0,
    }))
    .sort((a, b) => (ORDEM_PRIO[a.prioridade] || 9) - (ORDEM_PRIO[b.prioridade] || 9) || b.score - a.score);
}

// Procura a linha pelo @ na hora de gravar: a aba pode ter sido reordenada desde que a fila carregou.
async function marcar({ arroba, acao, copy }) {
  const [, ...linhas] = await lerValores(destino);
  const k = linhas.findIndex((l) => norm(l[COL['@']]) === norm(arroba));
  if (k < 0) throw new Error(`@${arroba} não está mais na aba`);
  const linha = k + 2;
  const cel = (nome) => `${letra(COL[nome])}${linha}:${letra(COL[nome])}${linha}`; // célula sozinha sem ":" dá 500 no n8n
  const l = linhas[k];
  if (acao === 'descartar') {
    await atualizar(destino, cel('Status revisão'), [['descartado']]);
    return { linha, acao };
  }
  if (acao !== 'enviei') throw new Error(`ação desconhecida: ${acao}`);
  if (copy && copy.trim() && copy !== l[COL.Copy]) await atualizar(destino, cel('Copy'), [[copy]]); // guarda o texto que foi de fato
  await atualizar(destino, cel('Status'), [['Abordagem feita']]);
  await atualizar(destino, cel('Status revisão'), [['aprovado']]);
  if (!l[COL['Data Última Interação']]) await atualizar(destino, cel('Data Última Interação'), [[hoje()]], true);
  return { linha, acao };
}

let fim;
const reiniciarOcioso = () => { clearTimeout(fim); fim = setTimeout(() => process.exit(0), OCIOSO_MS); };
let fila_de_escrita = Promise.resolve(); // um clique por vez na planilha

const corpo = (req) => new Promise((ok, erro) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { ok(d ? JSON.parse(d) : {}); } catch (e) { erro(e); } }); });
const json = (res, status, obj) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };

const servidor = createServer(async (req, res) => {
  reiniciarOcioso();
  try {
    if (req.method === 'GET' && req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(PAGINA);
    }
    if (req.method === 'GET' && req.url === '/fila') return json(res, 200, await fila());
    if (req.method === 'POST' && req.url === '/marcar') {
      const pedido = await corpo(req);
      const feito = (fila_de_escrita = fila_de_escrita.catch(() => {}).then(() => marcar(pedido)));
      return json(res, 200, await feito);
    }
    if (req.method === 'POST' && req.url === '/encerrar') { json(res, 200, { ok: true }); return setTimeout(() => process.exit(0), 200); }
    json(res, 404, { erro: 'não existe' });
  } catch (e) {
    json(res, 500, { erro: e.message });
  }
});

servidor.listen(PORTA, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${PORTA}`;
  console.log(JSON.stringify({ fila_aberta: url }));
  reiniciarOcioso();
  exec(process.platform === 'win32' ? `start "" "${url}"` : `open "${url}"`);
});

const PAGINA = /* html */ `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fila de abordagem</title>
<style>
  :root { --laranja:#F05A28; --preto:#111; --cinza:#6b6b6b; --linha:#e6e6e6; --fundo:#f6f6f4; }
  * { box-sizing:border-box } body { margin:0; font:16px/1.5 system-ui,Segoe UI,sans-serif; background:var(--fundo); color:var(--preto) }
  main { max-width:720px; margin:0 auto; padding:24px 16px 48px }
  header { display:flex; justify-content:space-between; align-items:baseline; gap:12px; margin-bottom:16px }
  h1 { font-size:20px; margin:0 } .conta { color:var(--cinza); font-size:14px }
  .cartao { background:#fff; border:1px solid var(--linha); border-radius:14px; padding:20px }
  .nome { font-size:20px; font-weight:700; margin:0 } .arroba { color:var(--cinza) }
  .etiqueta { display:inline-block; font-size:12px; font-weight:700; padding:2px 8px; border-radius:99px; background:#fde6dc; color:#a8360f; margin-left:6px }
  .gancho { font-size:14px; color:var(--cinza); margin:10px 0 14px; border-left:3px solid var(--laranja); padding-left:10px }
  textarea { width:100%; min-height:170px; font:inherit; padding:12px; border:1px solid var(--linha); border-radius:10px; resize:vertical }
  .passos { color:var(--cinza); font-size:14px; margin:10px 0 16px }
  .botoes { display:flex; flex-wrap:wrap; gap:10px }
  button { font:inherit; font-weight:600; border-radius:10px; padding:12px 16px; cursor:pointer; border:1px solid var(--preto); background:#fff; color:var(--preto) }
  button.principal { background:var(--laranja); border-color:var(--laranja); color:#fff }
  button.escuro { background:var(--preto); color:#fff }
  button:disabled { opacity:.45; cursor:default }
  .aviso { min-height:24px; margin-top:12px; font-size:14px } .erro { color:#b00020 }
  .fim { text-align:center; padding:40px 20px }
</style></head><body><main>
<header><h1>Fila de abordagem</h1><span class="conta" id="conta">carregando…</span></header>
<div id="area"></div>
<p class="aviso" id="aviso"></p>
<p style="margin-top:32px"><button id="encerrar">Encerrar a fila</button></p>
</main>
<script>
let fila = [], i = 0, enviados = 0, descartados = 0;
const $ = (id) => document.getElementById(id);
const aviso = (t, erro) => { $('aviso').textContent = t; $('aviso').className = 'aviso' + (erro ? ' erro' : ''); };
const el = (tag, props = {}, ...filhos) => { const e = Object.assign(document.createElement(tag), props); filhos.forEach((f) => e.append(f)); return e; };

async function carregar() {
  const r = await fetch('/fila'); const d = await r.json();
  if (!r.ok) return aviso('Não consegui ler a planilha: ' + d.erro, true);
  fila = d; desenhar();
}

function desenhar() {
  $('conta').textContent = enviados + ' enviadas · ' + descartados + ' descartadas · ' + Math.max(fila.length - i, 0) + ' na fila';
  const area = $('area'); area.innerHTML = '';
  if (i >= fila.length) { area.append(el('div', { className: 'cartao fim' }, el('p', { className: 'nome', textContent: 'Fila zerada.' }), el('p', { className: 'arroba', textContent: 'Tudo marcado na planilha. Pode encerrar.' }))); return; }
  const l = fila[i];
  const texto = el('textarea', { value: l.copy, id: 'texto' });
  const copiar = el('button', { className: 'principal', textContent: '1. Copiar mensagem e abrir perfil' });
  const enviei = el('button', { className: 'escuro', textContent: '2. Enviei', disabled: true });
  const descartar = el('button', { textContent: 'Descartar lead' });
  const pular = el('button', { textContent: 'Pular por agora' });
  copiar.onclick = async () => {
    try { await navigator.clipboard.writeText(texto.value); } catch { texto.select(); document.execCommand('copy'); }
    window.open(l.link, 'instagram');
    enviei.disabled = false;
    aviso('Mensagem copiada. No Instagram: "Enviar mensagem" → Ctrl+V → Enter. Depois volte e clique em "Enviei".');
  };
  enviei.onclick = () => gravar('enviei', texto.value, [copiar, enviei, descartar, pular]);
  descartar.onclick = () => gravar('descartar', '', [copiar, enviei, descartar, pular]);
  pular.onclick = () => { fila.push(fila.splice(i, 1)[0]); aviso('Foi pro fim da fila.'); desenhar(); };
  area.append(el('div', { className: 'cartao' },
    el('p', { className: 'nome' }, l.nome || ('@' + l.arroba), l.prioridade ? el('span', { className: 'etiqueta', textContent: 'Prioridade ' + l.prioridade }) : ''),
    el('div', { className: 'arroba', textContent: '@' + l.arroba }),
    l.gancho ? el('p', { className: 'gancho', textContent: l.gancho }) : '',
    texto,
    el('p', { className: 'passos', textContent: 'Pode ajustar o texto antes de copiar. O que você enviar fica guardado na planilha.' }),
    el('div', { className: 'botoes' }, copiar, enviei, descartar, pular)));
}

async function gravar(acao, copy, botoes) {
  botoes.forEach((b) => (b.disabled = true));
  aviso('Marcando na planilha…');
  const r = await fetch('/marcar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ arroba: fila[i].arroba, acao, copy }) });
  const d = await r.json();
  if (!r.ok) { botoes.forEach((b) => (b.disabled = false)); return aviso('Não marcou: ' + d.erro + '. Tente de novo.', true); }
  acao === 'enviei' ? enviados++ : descartados++;
  aviso((acao === 'enviei' ? 'Marcado como abordagem feita' : 'Marcado como descartado') + ' (linha ' + d.linha + ').');
  i++; desenhar();
}

$('encerrar').onclick = async () => { await fetch('/encerrar', { method: 'POST' }).catch(() => {}); document.body.innerHTML = '<main><p>Fila encerrada. Pode fechar esta aba.</p></main>'; };
carregar();
</script></body></html>`;
