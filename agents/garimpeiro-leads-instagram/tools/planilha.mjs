#!/usr/bin/env node
// Ponte com a aba de Garimpo (Google Sheets) via webhook n8n "Garimpo - planilha (webhook)" (id XlJH1qP21KSzpueh).
// O webhook só aceita planilhas da lista permitida e abas que começam com "Garimpo" — nunca toca a aba CRM.
//
// A aba tem 2 blocos:
//   A–R  garimpo (quem é, por que entrou, fato-gancho)
//   S–AI rastreador de leads qualificados (pré-CRM: grupo, 4 perguntas de fit, score, perfil, status, follow-up, fechamento)
//
// Uso:
//   node planilha.mjs enviar --rodada agents/garimpeiro-leads-instagram/rodadas/2026-10-17-karol.json
//   node planilha.mjs listar --perfil karol
//   node planilha.mjs preparar --perfil karol   → cabeçalho do rastreador + menus suspensos + fórmula do Score (idempotente)
//   node planilha.mjs migrar --perfil karol     → preenche o rastreador das linhas antigas (só onde "Grupo" está vazio)

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_WORKER = resolve(AQUI, '..');
const PASTA_RODADAS = join(RAIZ_WORKER, 'rodadas');
const WEBHOOK = 'https://webhook.karolsenna.com.br/webhook/garimpo';
const MAX_POR_RODADA = 50;

export const COLUNAS = [
  'Data rodada', 'Cliente', 'Termo', 'Nome', '@', 'Link do perfil', 'Bio', 'Link externo', 'Seguidores',
  'Categoria', 'Sinais', 'Aderência', 'Prioridade', 'Motivo da nota', 'Fato-gancho', 'Fonte do gancho',
  'Status revisão', 'Copy',
];

// Bloco do rastreador (começa na coluna S). Ordem = ordem das colunas.
export const RASTREADOR = [
  'Grupo', 'Tem carreira clara?', 'Ainda não vende o próprio método?', 'Sinal de empreender/transição?',
  'Já cria conteúdo profissional?', 'Score de Fit (0-4)', 'Prioridade de abordagem', 'Perfil', 'Status',
  'Data Última Interação', 'Próxima Ação', 'Data Próxima Ação', 'Fechou?', 'Valor', 'Data Fechamento',
  'Depoimento', 'Observações',
];
const COL_INICIO_RASTREADOR = COLUNAS.length; // índice 18 = coluna S

const SIM_NAO = ['Sim', 'Não'];
const MENUS = {
  // "Seguidor sem interação" (Karol, 18/10/2026): segue mas nunca comentou/respondeu — não é "Seguidores engajados".
  'Grupo': ['Círculo íntimo', 'Colegas da área', 'Já me pediu ajuda', 'Seguidores engajados', 'Seguidor sem interação', 'Conexões frias qualificadas', 'Veio até mim'],
  'Tem carreira clara?': SIM_NAO,
  'Ainda não vende o próprio método?': SIM_NAO,
  'Sinal de empreender/transição?': SIM_NAO,
  'Já cria conteúdo profissional?': SIM_NAO,
  'Prioridade de abordagem': ['Alta', 'Média', 'Baixa'],
  'Perfil': ['Conector', 'Analista', 'Diretivo'],
  'Status': ['Sem abordagem', 'Abordagem feita', 'Respondeu', 'Sessão agendada', 'Sessão realizada', 'Proposta enviada', 'Cliente', 'Vai pensar', 'Lead frio'],
  'Fechou?': ['Sim', 'Não', 'Em aberto'],
  'Depoimento': ['Pendente', 'Solicitado', 'Recebido'],
  'Status revisão': ['aprovado', 'descartado'],
};
const PRIORIDADE_ABORDAGEM = { alta: 'Alta', media: 'Média', média: 'Média', baixa: 'Baixa' };

export function letra(indice) {
  let s = '', n = indice + 1;
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
const colunaDe = (nome) => {
  const i = COLUNAS.indexOf(nome);
  return letra(i >= 0 ? i : COL_INICIO_RASTREADOR + RASTREADOR.indexOf(nome));
};
const COL_FIT_1 = colunaDe('Tem carreira clara?');
const COL_FIT_4 = colunaDe('Já cria conteúdo profissional?');
const COL_SCORE = colunaDe('Score de Fit (0-4)');
const COL_FIM = letra(COL_INICIO_RASTREADOR + RASTREADOR.length - 1);
// Sem separador de argumento — funciona em planilha pt-BR e en (REGRA-025 do Gestor de Infra).
const formulaScore = (linha) => `=SUMPRODUCT((${COL_FIT_1}${linha}:${COL_FIT_4}${linha}="Sim")*1)`;

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
  await chamar({ acao: 'anexar', planilha: destino.planilha, aba: destino.aba, linhas: [[...COLUNAS, ...RASTREADOR]] });
  return true;
}

async function lerValores(destino) {
  await garantirAba(destino);
  const { values = [] } = await chamar({ acao: 'listar', planilha: destino.planilha, aba: destino.aba });
  return values;
}

export async function listarAba(destino) {
  const [cab = [], ...linhas] = await lerValores(destino);
  return linhas.map((l) => Object.fromEntries(cab.map((c, i) => [c, l[i] ?? ''])));
}

function lerPerfil(nome) {
  return JSON.parse(readFileSync(join(RAIZ_WORKER, 'data', 'perfis', `${nome}.json`), 'utf8'));
}

async function atualizar(destino, intervalo, linhas, formula = false) {
  return chamar({ acao: 'atualizar', planilha: destino.planilha, aba: destino.aba, intervalo, linhas, formula });
}

// Fórmula do Score em todas as linhas de dado (a coluna é só fórmula — reescrever não perde nada).
async function escreverScores(destino, totalLinhas) {
  if (totalLinhas < 1) return;
  const linhas = Array.from({ length: totalLinhas }, (_, i) => [formulaScore(i + 2)]);
  await atualizar(destino, `${COL_SCORE}2:${COL_SCORE}${totalLinhas + 1}`, linhas, true);
}

// Valores do rastreador pra um perfil classificado (sem o Score, que é fórmula).
function blocoRastreador(p) {
  const v = {
    'Grupo': p.grupo || 'Conexões frias qualificadas',
    'Tem carreira clara?': p.fit_carreira || '',
    'Ainda não vende o próprio método?': p.fit_nao_vende || '',
    'Sinal de empreender/transição?': p.fit_transicao || '',
    'Já cria conteúdo profissional?': p.fit_conteudo || '',
    'Score de Fit (0-4)': '',
    'Prioridade de abordagem': PRIORIDADE_ABORDAGEM[p.aderencia] || '',
    'Perfil': p.perfil_leitura || '',
    'Status': 'Sem abordagem',
    'Fechou?': 'Em aberto',
    'Depoimento': 'Pendente',
  };
  return RASTREADOR.map((c) => v[c] ?? '');
}

async function enviar(caminhoRodada) {
  const rodada = JSON.parse(readFileSync(resolve(caminhoRodada), 'utf8'));
  const perfil = lerPerfil(rodada.perfil);
  const classificados = (rodada.para_classificar || []).filter((p) => p.aderencia && p.aderencia !== 'descarte');
  const semGancho = classificados.filter((p) => !p.fato_gancho || !p.fonte_gancho);
  if (semGancho.length) throw new Error(`${semGancho.length} perfil(s) sem fato-gancho ou fonte — classificação incompleta`);
  const semFit = classificados.filter((p) => !p.fit_carreira || !p.fit_nao_vende || !p.fit_transicao);
  if (semFit.length) throw new Error(`${semFit.length} perfil(s) sem as perguntas de fit 1-3 — classificação incompleta`);
  const ordem = { alta: 0, media: 1, média: 1, baixa: 2 };
  classificados.sort((a, b) => (a.prioridade - b.prioridade) || (ordem[a.aderencia] - ordem[b.aderencia]));
  const lote = classificados.slice(0, MAX_POR_RODADA);

  const jaNaAba = new Set((await listarAba(perfil.destino)).map((l) => String(l['@']).toLowerCase()));
  const linhas = lote.filter((p) => !jaNaAba.has(p['@'])).map((p) => [
    rodada.data, perfil.nome, p.termo || '', p.nome, p['@'], p.link_perfil, p.bio, p.link_externo,
    String(p.seguidores), p.categoria || '', p.sinais || '', p.aderencia, String(p.prioridade),
    p.motivo_nota || '', p.fato_gancho, p.fonte_gancho, '', '',
    ...blocoRastreador(p),
  ]);
  if (!linhas.length) return console.log('Nada novo pra enviar.');
  await chamar({ acao: 'anexar', planilha: perfil.destino.planilha, aba: perfil.destino.aba, linhas });
  await escreverScores(perfil.destino, (await lerValores(perfil.destino)).length - 1);
  console.log(JSON.stringify({ enviados: linhas.length, aba: perfil.destino.aba, fora_do_corte: classificados.length - lote.length }));
}

async function preparar(destino) {
  const valores = await lerValores(destino);
  await atualizar(destino, `${letra(COL_INICIO_RASTREADOR)}1:${COL_FIM}1`, [RASTREADOR]);
  const regras = Object.entries(MENUS).map(([nome, opcoes]) => ({ coluna: colunaDe(nome), opcoes }));
  await chamar({ acao: 'validacao', planilha: destino.planilha, aba: destino.aba, regras });
  await escreverScores(destino, valores.length - 1);
  console.log(JSON.stringify({ cabecalho: `${letra(COL_INICIO_RASTREADOR)}1:${COL_FIM}1`, menus: regras.length, linhas_com_score: valores.length - 1 }));
}

// Classificação local das rodadas (fit, perfil) indexada por @ — dado pessoal fica só em rodadas/ (gitignorada).
function classificacoesLocais(perfilId) {
  const mapa = new Map();
  if (!existsSync(PASTA_RODADAS)) return mapa;
  for (const f of readdirSync(PASTA_RODADAS).filter((n) => n.endsWith(`-${perfilId}.json`)).sort()) {
    for (const p of JSON.parse(readFileSync(join(PASTA_RODADAS, f), 'utf8')).para_classificar || []) mapa.set(String(p['@']).toLowerCase(), p);
  }
  return mapa;
}

async function migrar(perfil) {
  const [cab = [], ...linhas] = await lerValores(perfil.destino);
  if (cab[COL_INICIO_RASTREADOR] !== RASTREADOR[0]) throw new Error('Cabeçalho do rastreador ausente — rodar "preparar" antes.');
  const locais = classificacoesLocais(perfil.id);
  const iArroba = COLUNAS.indexOf('@');
  let preenchidas = 0, semClassificacao = 0;
  const bloco = linhas.map((l) => {
    const atual = RASTREADOR.map((_, j) => l[COL_INICIO_RASTREADOR + j] ?? '');
    if (atual[0]) return atual; // já tem Grupo → linha já é do rastreador; não mexe no que a Karol editou
    const p = locais.get(String(l[iArroba] || '').toLowerCase()) || { aderencia: String(l[COLUNAS.indexOf('Aderência')] || '').toLowerCase() };
    if (!p.fit_carreira) semClassificacao++;
    preenchidas++;
    return blocoRastreador(p);
  });
  if (!bloco.length) return console.log('Aba sem linhas.');
  // Score fica de fora do bloco de texto (é fórmula); escreve antes e depois dele.
  const iScore = RASTREADOR.indexOf('Score de Fit (0-4)');
  const fim = linhas.length + 1;
  await atualizar(perfil.destino, `${letra(COL_INICIO_RASTREADOR)}2:${letra(COL_INICIO_RASTREADOR + iScore - 1)}${fim}`, bloco.map((b) => b.slice(0, iScore)));
  await atualizar(perfil.destino, `${letra(COL_INICIO_RASTREADOR + iScore + 1)}2:${COL_FIM}${fim}`, bloco.map((b) => b.slice(iScore + 1)));
  await escreverScores(perfil.destino, linhas.length);
  console.log(JSON.stringify({ linhas: linhas.length, preenchidas, sem_perguntas_de_fit: semClassificacao }));
}

const [cmd, ...resto] = process.argv.slice(2);
const opt = Object.fromEntries(resto.reduce((acc, v, i, a) => (v.startsWith('--') ? [...acc, [v.slice(2), a[i + 1]]] : acc), []));
if (process.argv[1]?.endsWith('planilha.mjs')) {
  try {
    const perfil = () => lerPerfil(opt.perfil || 'karol');
    if (cmd === 'enviar') await enviar(opt.rodada);
    else if (cmd === 'listar') console.log(JSON.stringify(await listarAba(perfil().destino), null, 2));
    else if (cmd === 'preparar') await preparar(perfil().destino);
    else if (cmd === 'migrar') await migrar(perfil());
    else if (cmd) console.log('Comandos: enviar | listar | preparar | migrar');
  } catch (e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}
