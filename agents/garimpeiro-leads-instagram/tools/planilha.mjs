#!/usr/bin/env node
// Ponte com a aba de Garimpo (Google Sheets) via webhook n8n "Garimpo - planilha (webhook)" (id XlJH1qP21KSzpueh).
// O webhook só aceita planilhas da lista permitida e abas que começam com "Garimpo" — nunca toca a aba CRM.
//
// Uso:
//   node planilha.mjs enviar --rodada agents/garimpeiro-leads-instagram/rodadas/2026-10-17-karol.json
//   node planilha.mjs listar --perfil karol

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_WORKER = resolve(AQUI, '..');
const WEBHOOK = 'https://webhook.karolsenna.com.br/webhook/garimpo';
const MAX_POR_RODADA = 50;

export const COLUNAS = [
  'Data rodada', 'Cliente', 'Termo', 'Nome', '@', 'Link do perfil', 'Bio', 'Link externo', 'Seguidores',
  'Categoria', 'Sinais', 'Aderência', 'Prioridade', 'Motivo da nota', 'Fato-gancho', 'Fonte do gancho',
  'Status revisão', 'Copy',
];

function token() {
  if (process.env.GARIMPO_TOKEN) return process.env.GARIMPO_TOKEN;
  return execSync('op read "op://Claude/Garimpo - webhook n8n/credential"', { encoding: 'utf8' }).trim();
}

async function chamar(corpo) {
  const r = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Garimpo-Token': token() },
    body: JSON.stringify(corpo),
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Webhook ${r.status}: ${txt.slice(0, 200)}`);
  const d = JSON.parse(txt);
  if (d.error) throw new Error(`Sheets: ${JSON.stringify(d.error).slice(0, 200)}`);
  return d;
}

async function garantirAba(destino) {
  const { sheets = [] } = await chamar({ acao: 'abas', planilha: destino.planilha });
  if (sheets.some((s) => s.properties.title === destino.aba)) return false;
  await chamar({ acao: 'criar_aba', planilha: destino.planilha, aba: destino.aba });
  await chamar({ acao: 'anexar', planilha: destino.planilha, aba: destino.aba, linhas: [COLUNAS] });
  return true;
}

export async function listarAba(destino) {
  await garantirAba(destino);
  const { values = [] } = await chamar({ acao: 'listar', planilha: destino.planilha, aba: destino.aba });
  const [cab = [], ...linhas] = values;
  return linhas.map((l) => Object.fromEntries(cab.map((c, i) => [c, l[i] ?? ''])));
}

function lerPerfil(nome) {
  return JSON.parse(readFileSync(join(RAIZ_WORKER, 'data', 'perfis', `${nome}.json`), 'utf8'));
}

async function enviar(caminhoRodada) {
  const rodada = JSON.parse(readFileSync(resolve(caminhoRodada), 'utf8'));
  const perfil = lerPerfil(rodada.perfil);
  const classificados = (rodada.para_classificar || []).filter((p) => p.aderencia && p.aderencia !== 'descarte');
  const semGancho = classificados.filter((p) => !p.fato_gancho || !p.fonte_gancho);
  if (semGancho.length) throw new Error(`${semGancho.length} perfil(s) sem fato-gancho ou fonte — classificação incompleta`);
  const ordem = { alta: 0, media: 1, média: 1, baixa: 2 };
  classificados.sort((a, b) => (a.prioridade - b.prioridade) || (ordem[a.aderencia] - ordem[b.aderencia]));
  const lote = classificados.slice(0, MAX_POR_RODADA);

  const jaNaAba = new Set((await listarAba(perfil.destino)).map((l) => String(l['@']).toLowerCase()));
  const linhas = lote.filter((p) => !jaNaAba.has(p['@'])).map((p) => [
    rodada.data, perfil.nome, p.termo || '', p.nome, p['@'], p.link_perfil, p.bio, p.link_externo,
    String(p.seguidores), p.categoria || '', p.sinais || '', p.aderencia, String(p.prioridade),
    p.motivo_nota || '', p.fato_gancho, p.fonte_gancho, '', '',
  ]);
  if (!linhas.length) return console.log('Nada novo pra enviar.');
  await chamar({ acao: 'anexar', planilha: perfil.destino.planilha, aba: perfil.destino.aba, linhas });
  console.log(JSON.stringify({ enviados: linhas.length, aba: perfil.destino.aba, fora_do_corte: classificados.length - lote.length }));
}

const [cmd, ...resto] = process.argv.slice(2);
const opt = Object.fromEntries(resto.reduce((acc, v, i, a) => (v.startsWith('--') ? [...acc, [v.slice(2), a[i + 1]]] : acc), []));
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('planilha.mjs')) {
  try {
    if (cmd === 'enviar') await enviar(opt.rodada);
    else if (cmd === 'listar') console.log(JSON.stringify(await listarAba(lerPerfil(opt.perfil || 'karol').destino), null, 2));
    else if (cmd) console.log('Comandos: enviar | listar');
  } catch (e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}
