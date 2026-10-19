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
//   node planilha.mjs recalcular --perfil karol → régua mudou: reescreve fit, prioridade, "postou 30 dias" e "Revisar:" das rodadas locais

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
  'Categoria', 'Sinais', 'Aderência', 'Postou nos últimos 30 dias?', 'Motivo da nota', 'Fato-gancho', 'Fonte do gancho',
  'Status revisão', 'Copy',
];

// Perguntas de fit (v2, Karol 18/10/2026). Aderência (coluna L) diz "é do público?"; o fit diz "vale abordar agora?".
// Carreira clara e "ainda não vende método" saíram do fit: são peneira da Aderência.
export const FITS = [
  { coluna: 'Tem anos de experiência na área?', campo: 'fit_experiencia', revisar: 'experiência: olhar destaques/posts antigos atrás de tempo de carreira, especialização ou cargo anterior' },
  { coluna: 'Mostra a dor que a Incubadora resolve?', campo: 'fit_dor', revisar: 'dor: olhar legendas e stories atrás de cansaço do trabalho, sensação de valer mais do que ganha ou vontade de renda com o que sabe' },
  { coluna: 'Já cria conteúdo profissional?', campo: 'fit_conteudo', revisar: 'conteúdo: abrir os últimos posts e ver se a maioria é da área dela ou vida pessoal' },
  { coluna: 'Quer ser autoridade na área?', campo: 'fit_autoridade', revisar: 'autoridade: ver se dá aula, palestra ou se apresenta como especialista' },
];
export const A_AVALIAR = 'A avaliar';

// Bloco do rastreador (começa na coluna S). Ordem = ordem das colunas.
export const RASTREADOR = [
  'Grupo', ...FITS.map((f) => f.coluna), 'Score de Fit (0-4)', 'Prioridade de abordagem', 'Perfil', 'Status',
  'Data Última Interação', 'Próxima Ação', 'Data Próxima Ação', 'Fechou?', 'Valor', 'Data Fechamento',
  'Depoimento', 'Observações',
];
const COL_INICIO_RASTREADOR = COLUNAS.length; // índice 18 = coluna S

const SIM_NAO = ['Sim', 'Não'];
const MENUS = {
  // "Seguidor sem interação" (Karol, 18/10/2026): segue mas nunca comentou/respondeu — não é "Seguidores engajados".
  'Grupo': ['Círculo íntimo', 'Colegas da área', 'Já me pediu ajuda', 'Seguidores engajados', 'Seguidor sem interação', 'Conexões frias qualificadas', 'Veio até mim'],
  ...Object.fromEntries(FITS.map((f) => [f.coluna, [...SIM_NAO, A_AVALIAR]])),
  'Postou nos últimos 30 dias?': SIM_NAO,
  'Prioridade de abordagem': ['Alta', 'Média', 'Baixa'],
  'Perfil': ['Conector', 'Analista', 'Diretivo'],
  'Status': ['Sem abordagem', 'Abordagem feita', 'Respondeu', 'Sessão agendada', 'Sessão realizada', 'Proposta enviada', 'Cliente', 'Vai pensar', 'Lead frio'],
  'Fechou?': ['Sim', 'Não', 'Em aberto'],
  'Depoimento': ['Pendente', 'Solicitado', 'Recebido'],
  'Status revisão': ['aprovado', 'descartado'],
};

// Prioridade de abordagem (Karol, 18/10/2026): Score manda, Aderência trava.
//   Alta = Score 4, ou Score 3 com aderência alta · Baixa = Score 0-1 ou aderência baixa · Média = o resto
// "A avaliar" não penaliza: a proporção de Sim é calculada só sobre as perguntas respondidas
// (com as 4 respondidas, dá o mesmo que a régua original). Alta exige ao menos 3 respondidas.
export function prioridadeAbordagem(p) {
  const respondidas = FITS.filter((f) => p[f.campo] === 'Sim' || p[f.campo] === 'Não');
  const sim = respondidas.filter((f) => p[f.campo] === 'Sim').length;
  const ad = String(p.aderencia || '').toLowerCase().replace('é', 'e');
  if (ad === 'baixa') return 'Baixa';
  if (!respondidas.length) return 'Média';
  const taxa = sim / respondidas.length;
  if (taxa <= 0.25) return 'Baixa';
  if ((taxa === 1 && respondidas.length >= 3) || (taxa >= 0.75 && ad === 'alta')) return 'Alta';
  return 'Média';
}

// Postou nos últimos 30 dias (a contar da data da rodada) — desempate entre leads da mesma prioridade.
export function postouRecente(p, dataRodada) {
  const ref = new Date(dataRodada || Date.now()).getTime();
  const datas = [p.post_da_hashtag?.data, ...(p.posts_recentes || []).map((x) => x.data)].filter(Boolean).map((d) => new Date(d).getTime());
  if (!datas.length) return '';
  return datas.some((d) => ref - d <= 30 * 864e5) ? 'Sim' : 'Não';
}

// Observação automática pra Karol revisar: fit que não deu pra avaliar + lead sem leitura logada.
export function observacaoRevisao(p) {
  const pendentes = FITS.filter((f) => p[f.campo] === A_AVALIAR);
  const itens = pendentes.map((f) => f.revisar);
  if (pendentes.length) itens.push(`prioridade calculada só com ${FITS.length - pendentes.length} de ${FITS.length} perguntas`);
  if (p.fase === 2) itens.push('sem leitura logada, avaliado só pela bio: abrir o perfil e conferir os posts antes de abordar');
  if (p.observacao_revisao) itens.push(p.observacao_revisao);
  return itens.length ? `Revisar: ${itens.join('; ')}` : '';
}

export function letra(indice) {
  let s = '', n = indice + 1;
  while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
const colunaDe = (nome) => {
  const i = COLUNAS.indexOf(nome);
  return letra(i >= 0 ? i : COL_INICIO_RASTREADOR + RASTREADOR.indexOf(nome));
};
const COL_FIT_1 = colunaDe(FITS[0].coluna);
const COL_FIT_4 = colunaDe(FITS[FITS.length - 1].coluna);
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
    ...Object.fromEntries(FITS.map((f) => [f.coluna, p[f.campo] || ''])),
    'Score de Fit (0-4)': '',
    'Prioridade de abordagem': prioridadeAbordagem(p),
    'Perfil': p.perfil_leitura || '',
    'Status': 'Sem abordagem',
    'Fechou?': 'Em aberto',
    'Depoimento': 'Pendente',
    'Observações': observacaoRevisao(p),
  };
  return RASTREADOR.map((c) => v[c] ?? '');
}

async function enviar(caminhoRodada) {
  const rodada = JSON.parse(readFileSync(resolve(caminhoRodada), 'utf8'));
  const perfil = lerPerfil(rodada.perfil);
  const classificados = (rodada.para_classificar || []).filter((p) => p.aderencia && p.aderencia !== 'descarte');
  const semGancho = classificados.filter((p) => !p.fato_gancho || !p.fonte_gancho);
  if (semGancho.length) throw new Error(`${semGancho.length} perfil(s) sem fato-gancho ou fonte — classificação incompleta`);
  // Sem resposta ≠ "A avaliar": toda pergunta precisa de Sim, Não ou A avaliar (essa vira observação pra Karol).
  const semFit = classificados.filter((p) => FITS.some((f) => !p[f.campo]));
  if (semFit.length) throw new Error(`${semFit.length} perfil(s) com pergunta de fit sem resposta (use "${A_AVALIAR}" quando não der pra avaliar)`);
  const ordem = { Alta: 0, Média: 1, Baixa: 2 };
  const recente = (p) => (postouRecente(p, rodada.data) === 'Sim' ? 0 : 1);
  classificados.sort((a, b) => (ordem[prioridadeAbordagem(a)] - ordem[prioridadeAbordagem(b)]) || (recente(a) - recente(b)));
  const lote = classificados.slice(0, MAX_POR_RODADA);

  const jaNaAba = new Set((await listarAba(perfil.destino)).map((l) => String(l['@']).toLowerCase()));
  const linhas = lote.filter((p) => !jaNaAba.has(p['@'])).map((p) => [
    rodada.data, perfil.nome, p.termo || '', p.nome, p['@'], p.link_perfil, p.bio, p.link_externo,
    String(p.seguidores), p.categoria || '', p.sinais || '', p.aderencia, postouRecente(p, rodada.data),
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
  await atualizar(destino, `A1:${COL_FIM}1`, [[...COLUNAS, ...RASTREADOR]]);
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
    if (FITS.some((f) => !p[f.campo])) semClassificacao++;
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

// Quando a régua muda: reescreve, a partir das rodadas locais, "Postou nos últimos 30 dias?", as 4 perguntas de fit,
// a Prioridade de abordagem e a observação automática ("Revisar: ..."). Observação escrita pela Karol não é tocada.
// Linha sem rodada local fica como está.
async function recalcular(perfil) {
  const [cab = [], ...linhas] = await lerValores(perfil.destino);
  if (cab[COL_INICIO_RASTREADOR] !== RASTREADOR[0]) throw new Error('Cabeçalho do rastreador ausente — rodar "preparar" antes.');
  const locais = classificacoesLocais(perfil.id);
  const datas = rodadasPorArroba(perfil.id);
  const idx = (nome) => { const i = COLUNAS.indexOf(nome); return i >= 0 ? i : COL_INICIO_RASTREADOR + RASTREADOR.indexOf(nome); };
  const [iM, iFit1, iY, iObs, iArroba] = [idx('Postou nos últimos 30 dias?'), idx(FITS[0].coluna), idx('Prioridade de abordagem'), idx('Observações'), idx('@')];
  let recalculadas = 0;
  const novo = linhas.map((l) => {
    const atual = { m: l[iM] ?? '', fits: FITS.map((_, k) => l[iFit1 + k] ?? ''), y: l[iY] ?? '', obs: l[iObs] ?? '' };
    const a = String(l[iArroba] || '').toLowerCase();
    const p = locais.get(a);
    if (!p || FITS.some((f) => !p[f.campo])) return atual;
    recalculadas++;
    const obsKarol = atual.obs && !atual.obs.startsWith('Revisar:');
    return { m: postouRecente(p, datas.get(a)), fits: FITS.map((f) => p[f.campo]), y: prioridadeAbordagem(p), obs: obsKarol ? atual.obs : observacaoRevisao(p) };
  });
  if (!novo.length) return console.log('Aba sem linhas.');
  const fim = linhas.length + 1;
  await atualizar(perfil.destino, `${letra(iM)}2:${letra(iM)}${fim}`, novo.map((n) => [n.m]));
  await atualizar(perfil.destino, `${letra(iFit1)}2:${letra(iFit1 + FITS.length - 1)}${fim}`, novo.map((n) => n.fits));
  await atualizar(perfil.destino, `${letra(iY)}2:${letra(iY)}${fim}`, novo.map((n) => [n.y]));
  await atualizar(perfil.destino, `${letra(iObs)}2:${letra(iObs)}${fim}`, novo.map((n) => [n.obs]));
  await escreverScores(perfil.destino, linhas.length);
  const conta = (k) => novo.reduce((m, n) => ({ ...m, [n[k]]: (m[n[k]] || 0) + 1 }), {});
  console.log(JSON.stringify({ linhas: linhas.length, recalculadas, prioridade: conta('y'), postou_30d: conta('m'), com_revisar: novo.filter((n) => n.obs.startsWith('Revisar:')).length }));
}

function rodadasPorArroba(perfilId) {
  const mapa = new Map();
  if (!existsSync(PASTA_RODADAS)) return mapa;
  for (const f of readdirSync(PASTA_RODADAS).filter((n) => n.endsWith(`-${perfilId}.json`)).sort()) {
    const r = JSON.parse(readFileSync(join(PASTA_RODADAS, f), 'utf8'));
    for (const p of r.para_classificar || []) mapa.set(String(p['@']).toLowerCase(), r.data);
  }
  return mapa;
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
    else if (cmd === 'recalcular') await recalcular(perfil());
    else if (cmd) console.log('Comandos: enviar | listar | preparar | migrar | recalcular');
  } catch (e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}
