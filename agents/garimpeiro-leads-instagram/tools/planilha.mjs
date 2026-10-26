#!/usr/bin/env node
// Ponte com a aba de Garimpo (Google Sheets) via webhook n8n "Garimpo - planilha (webhook)" (id XlJH1qP21KSzpueh).
// O webhook só aceita planilhas da lista permitida e abas que começam com "Garimpo" — nunca toca a aba CRM.
//
// A aba tem 2 blocos:
//   A–R  garimpo (quem é, por que entrou, fato-gancho)
//   S–AI rastreador de leads qualificados (pré-CRM: grupo, 4 perguntas de fit, score, perfil, status, follow-up, fechamento)
//   AJ   Ordem (fórmula oculta usada pra ordenar por prioridade)
//
// Uso:
//   node planilha.mjs enviar --rodada agents/garimpeiro-leads-instagram/rodadas/2026-10-17-karol.json
//   node planilha.mjs listar --perfil karol
//   node planilha.mjs preparar --perfil karol   → cabeçalho do rastreador + menus suspensos + fórmula do Score (idempotente)
//   node planilha.mjs migrar --perfil karol     → preenche o rastreador das linhas antigas (só onde "Grupo" está vazio)
//   node planilha.mjs recalcular --perfil karol → régua mudou: reescreve fit, prioridade, "postou 30 dias" e "Revisar:" das rodadas locais
//   node planilha.mjs formatar --perfil karol   → aparência (cores por situação, colunas de sistema ocultas, ordem por prioridade) + aba Legenda (idempotente)
//   node planilha.mjs copy --perfil karol --arquivo {json fora do repo: {"@arroba": "mensagem"}} [--sobrescrever] → grava a 1ª mensagem do Vendedor Expert na coluna Copy (só onde está vazia)

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
  // 25/10/2026: substitui "Mostra a dor que a Incubadora resolve?" (dava Não em quase todos — liberal posta a dor do cliente, não a própria).
  // Sim = só ganha atendendo 1 a 1 (consulta, sessão, projeto) ou é CLT/servidor sem produto próprio. Não = já tem produto que vende sem ela.
  { coluna: 'Vende só o próprio tempo?', campo: 'fit_tempo', revisar: 'tempo: abrir o link da bio e ver se ela já vende curso, e-book, desafio ou mentoria em grupo' },
  { coluna: 'Já cria conteúdo profissional?', campo: 'fit_conteudo', revisar: 'conteúdo: abrir os últimos posts e ver se a maioria é da área dela ou vida pessoal' },
  { coluna: 'Quer ser autoridade na área?', campo: 'fit_autoridade', revisar: 'autoridade: ver se dá aula, palestra ou se apresenta como especialista' },
];
export const A_AVALIAR = 'A avaliar';

// Bloco do rastreador (começa na coluna S). Ordem = ordem das colunas.
export const RASTREADOR = [
  'Grupo', ...FITS.map((f) => f.coluna), 'Score de Fit (0-4)', 'Prioridade de abordagem', 'Perfil', 'Status',
  'Data Última Interação', 'Próxima Ação', 'Data Próxima Ação', 'Fechou?', 'Valor', 'Data Fechamento',
  'Depoimento', 'Observações', 'Ordem',
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
  'Status': ['Sem abordagem', 'Abordagem feita', 'Em conversa', 'Respondeu', 'Sessão agendada', 'Sessão realizada', 'Proposta enviada', 'Cliente', 'Vai pensar', 'Lead frio'],
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
  if (p.fase === 2) itens.push('sem leitura logada, avaliado só pela bio: abrir o perfil, ver se a conta não é privada e conferir os posts antes de abordar');
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
// Ordem (coluna oculta, Karol 25/10/2026): Prioridade Alta → Média → Baixa; descartado, lead frio e "Fechou? Não" vão pro fim.
const COL_ORDEM = colunaDe('Ordem');
const [C_REV, C_STATUS, C_PRIO, C_FECHOU] = ['Status revisão', 'Status', 'Prioridade de abordagem', 'Fechou?'].map(colunaDe);
// "reprovado"/"Reprovado" e "Em conversa": palavras que a Karol digita fora do menu — tratadas como descartado / perdido / em conversa.
const formulaOrdem = (l) => `=($${C_REV}${l}="descartado")*10+($${C_REV}${l}="reprovado")*10+($${C_STATUS}${l}="Lead frio")*10+($${C_STATUS}${l}="Reprovado")*10+($${C_FECHOU}${l}="Não")*10`
  + `+($${C_PRIO}${l}="Alta")*1+($${C_PRIO}${l}="Média")*2+($${C_PRIO}${l}="Baixa")*3`;

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

// Fórmulas do Score e da Ordem em todas as linhas de dado (as colunas são só fórmula — reescrever não perde nada).
async function escreverScores(destino, totalLinhas) {
  if (totalLinhas < 1) return;
  const linhas = Array.from({ length: totalLinhas }, (_, i) => [formulaScore(i + 2)]);
  await atualizar(destino, `${COL_SCORE}2:${COL_SCORE}${totalLinhas + 1}`, linhas, true);
  const ordem = Array.from({ length: totalLinhas }, (_, i) => [formulaOrdem(i + 2)]);
  await atualizar(destino, `${COL_ORDEM}2:${COL_ORDEM}${totalLinhas + 1}`, ordem, true);
}

// ---- Aparência da aba (Karol 25/10/2026): identidade da Incubadora (preto, branco, cinza, laranja) ----
const COR = {
  preto: '#1A1A1A', branco: '#FFFFFF', laranja: '#F05A28', laranjaClaro: '#FCE4D6',
  cinzaClaro: '#F2F2F2', cinza: '#D9D9D9', cinzaTexto: '#8C8C8C', linha: '#E6E6E6',
};
const rgb = (hex) => ({ red: parseInt(hex.slice(1, 3), 16) / 255, green: parseInt(hex.slice(3, 5), 16) / 255, blue: parseInt(hex.slice(5, 7), 16) / 255 });
const indiceDe = (nome) => { const i = COLUNAS.indexOf(nome); return i >= 0 ? i : COL_INICIO_RASTREADOR + RASTREADOR.indexOf(nome); };
const TOTAL_COLUNAS = COLUNAS.length + RASTREADOR.length;

// O que a Karol usa fica à mostra, com largura; o resto (sistema, log, respostas que já viraram Score) fica oculto.
const VISIVEIS = {
  'Nome': 190, 'Link do perfil': 170, 'Bio': 260, 'Fato-gancho': 280, 'Status revisão': 105, 'Copy': 260,
  'Score de Fit (0-4)': 60, 'Prioridade de abordagem': 95, 'Perfil': 85, 'Status': 140, 'Data Última Interação': 105,
  'Próxima Ação': 180, 'Data Próxima Ação': 105, 'Fechou?': 80, 'Valor': 90, 'Data Fechamento': 105, 'Depoimento': 100, 'Observações': 280,
};
const DATAS = ['Data Última Interação', 'Data Próxima Ação', 'Data Fechamento'];
// Em conversa e sem resposta: follow-up vence na "Data Próxima Ação" ou, sem ela, 3 dias depois da última interação.
const EM_CONVERSA = ['Abordagem feita', 'Em conversa', 'Respondeu', 'Vai pensar', 'Proposta enviada', 'Sessão realizada'];
const DIAS_FOLLOW_UP = 3;

// Situações da linha, na ordem de prioridade das cores (a primeira que bate vale). Usada também na aba Legenda.
function situacoes() {
  const c = (nome) => `$${colunaDe(nome)}2`;
  const [rev, st, ult, prox, fechou] = [c('Status revisão'), c('Status'), c('Data Última Interação'), c('Data Próxima Ação'), c('Fechou?')];
  const conversa = EM_CONVERSA.map((s) => `(${st}="${s}")`).join('+');
  // Sem separador de argumento (funciona em planilha pt-BR e en — REGRA-025 do Gestor de Infra).
  return [
    { nome: 'Descartado', quando: 'Você marcou "descartado" (ou "reprovado") na revisão', formula: `=(${rev}="descartado")+(${rev}="reprovado")>0`, fundo: COR.cinza, texto: COR.cinzaTexto, tachado: true },
    { nome: 'Perdido', quando: 'Status "Lead frio" ou "Reprovado", ou Fechou? "Não"', formula: `=(${st}="Lead frio")+(${st}="Reprovado")+(${fechou}="Não")>0`, fundo: COR.cinza, texto: COR.cinzaTexto },
    { nome: 'Cliente', quando: 'Status "Cliente" ou Fechou? "Sim"', formula: `=(${st}="Cliente")+(${fechou}="Sim")>0`, fundo: COR.preto, texto: COR.laranja, negrito: true },
    { nome: 'Follow-up vencido', quando: `Em conversa e a Data Próxima Ação chegou (sem data: ${DIAS_FOLLOW_UP} dias depois da última interação)`, formula: `=(${conversa})*((${prox}<>"")*(${prox}<=TODAY())+(${prox}="")*(${ult}<>"")*(${ult}<=TODAY()-${DIAS_FOLLOW_UP}))>0`, fundo: COR.laranja, texto: COR.branco, negrito: true },
    { nome: 'Em conversa', quando: 'Já abordado e o follow-up ainda não venceu', formula: `=(${st}<>"")*(${st}<>"Sem abordagem")>0`, fundo: COR.cinzaClaro, texto: COR.preto },
    { nome: 'Pronto pra abordar', quando: 'Você aprovou e ainda não abordou', formula: `=(${rev}="aprovado")*((${st}="")+(${st}="Sem abordagem"))>0`, fundo: COR.laranjaClaro, texto: COR.preto },
    { nome: 'A revisar', quando: 'Status revisão em branco: falta você aprovar ou descartar', formula: null, fundo: COR.branco, texto: COR.preto },
  ];
}

const faixa = (r0, r1, c0, c1) => ({ sheetId: 0, startRowIndex: r0, endRowIndex: r1, startColumnIndex: c0, endColumnIndex: c1 });
const formatoTexto = (s) => ({ backgroundColor: rgb(s.fundo), textFormat: { foregroundColor: rgb(s.texto), bold: !!s.negrito, strikethrough: !!s.tachado } });

function pedidosAparencia(totalLinhas) {
  const FIM = 5000;
  const p = [];
  // Corpo: letra 10, centralizado na altura, texto longo cortado (linha fica com uma altura só).
  p.push({ repeatCell: { range: faixa(1, FIM, 0, TOTAL_COLUNAS), cell: { userEnteredFormat: { verticalAlignment: 'MIDDLE', wrapStrategy: 'CLIP', textFormat: { fontSize: 10, foregroundColor: rgb(COR.preto) } } }, fields: 'userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)' } });
  // Cabeçalho preto, letra branca em negrito.
  p.push({ repeatCell: { range: faixa(0, 1, 0, TOTAL_COLUNAS), cell: { userEnteredFormat: { backgroundColor: rgb(COR.preto), horizontalAlignment: 'CENTER', verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP', textFormat: { fontSize: 10, bold: true, foregroundColor: rgb(COR.branco) } } }, fields: 'userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,wrapStrategy,textFormat)' } });
  p.push({ updateDimensionProperties: { range: { sheetId: 0, dimension: 'ROWS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 44 }, fields: 'pixelSize' } });
  p.push({ updateDimensionProperties: { range: { sheetId: 0, dimension: 'ROWS', startIndex: 1, endIndex: Math.max(totalLinhas + 1, 2) }, properties: { pixelSize: 21 }, fields: 'pixelSize' } }); // 1 linha só: bio com quebra de linha não aparece pela metade
  // Colunas: mostra as da Karol com largura, esconde o resto.
  for (let i = 0; i < TOTAL_COLUNAS; i++) {
    const nome = i < COLUNAS.length ? COLUNAS[i] : RASTREADOR[i - COLUNAS.length];
    const largura = VISIVEIS[nome];
    p.push({ updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 }, properties: largura ? { hiddenByUser: false, pixelSize: largura } : { hiddenByUser: true }, fields: largura ? 'hiddenByUser,pixelSize' : 'hiddenByUser' } });
  }
  // Colunas curtas centralizadas.
  for (const nome of ['Status revisão', 'Score de Fit (0-4)', 'Prioridade de abordagem', 'Perfil', 'Fechou?', ...DATAS]) {
    const i = indiceDe(nome);
    p.push({ repeatCell: { range: faixa(1, FIM, i, i + 1), cell: { userEnteredFormat: { horizontalAlignment: 'CENTER' } }, fields: 'userEnteredFormat.horizontalAlignment' } });
  }
  // Datas com calendário (clique duplo) e formato dd/mm/aaaa; Valor em reais.
  for (const nome of DATAS) {
    const i = indiceDe(nome);
    p.push({ repeatCell: { range: faixa(1, FIM, i, i + 1), cell: { userEnteredFormat: { numberFormat: { type: 'DATE', pattern: 'dd/mm/yyyy' } } }, fields: 'userEnteredFormat.numberFormat' } });
    p.push({ setDataValidation: { range: faixa(1, FIM, i, i + 1), rule: { condition: { type: 'DATE_IS_VALID' }, strict: false, showCustomUi: true } } });
  }
  const iValor = indiceDe('Valor');
  p.push({ repeatCell: { range: faixa(1, FIM, iValor, iValor + 1), cell: { userEnteredFormat: { numberFormat: { type: 'CURRENCY', pattern: '"R$" #,##0.00' } } }, fields: 'userEnteredFormat.numberFormat' } });
  // Linhas finas entre os leads.
  p.push({ updateBorders: { range: faixa(0, FIM, 0, TOTAL_COLUNAS), innerHorizontal: { style: 'SOLID', color: rgb(COR.linha) }, bottom: { style: 'SOLID', color: rgb(COR.linha) } } });
  // Cor da linha pela situação.
  situacoes().filter((s) => s.formula).forEach((s, index) => p.push({ addConditionalFormatRule: { index, rule: { ranges: [faixa(1, FIM, 0, TOTAL_COLUNAS)], booleanRule: { condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: s.formula }] }, format: formatoTexto(s) } } } }));
  // Cabeçalho e Nome/Link fixos ao rolar; filtro em todas as colunas; aba em laranja.
  p.push({ updateSheetProperties: { properties: { sheetId: 0, gridProperties: { frozenRowCount: 1, frozenColumnCount: indiceDe('Link do perfil') + 1 }, tabColorStyle: { rgbColor: rgb(COR.laranja) } }, fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount,tabColorStyle' } });
  p.push({ setBasicFilter: { filter: { range: faixa(0, FIM, 0, TOTAL_COLUNAS) } } });
  return p;
}

// Prioridade decrescente (Alta → Baixa; descartados e perdidos no fim) e, dentro dela, Score maior primeiro.
const pedidoOrdenar = (totalLinhas) => ({ sortRange: { range: faixa(1, totalLinhas + 1, 0, TOTAL_COLUNAS), sortSpecs: [
  { dimensionIndex: indiceDe('Ordem'), sortOrder: 'ASCENDING' }, { dimensionIndex: indiceDe('Score de Fit (0-4)'), sortOrder: 'DESCENDING' },
] } });

async function formatarAba(destino, totalLinhas) {
  await chamar({ acao: 'formatar', planilha: destino.planilha, aba: destino.aba, colunas: TOTAL_COLUNAS, pedidos: pedidosAparencia(totalLinhas) });
}

// Ordena e reescreve as fórmulas (depois da ordenação cada linha volta a apontar pra ela mesma).
async function organizar(destino) {
  const total = (await lerValores(destino)).length - 1;
  if (total < 1) return 0;
  await escreverScores(destino, total);
  await chamar({ acao: 'formatar', planilha: destino.planilha, aba: destino.aba, colunas: TOTAL_COLUNAS, pedidos: [pedidoOrdenar(total)] });
  await escreverScores(destino, total);
  return total;
}

// Aba "Garimpo - Legenda": o que cada cor quer dizer, pintada com a mesma cor.
async function escreverLegenda(destino) {
  const leg = { planilha: destino.planilha, aba: `${destino.aba} - Legenda` };
  const { sheets = [] } = await chamar({ acao: 'abas', planilha: leg.planilha });
  if (!sheets.some((s) => s.properties.title === leg.aba)) await chamar({ acao: 'criar_aba', planilha: leg.planilha, aba: leg.aba });
  const sit = situacoes();
  const linhas = [
    ['Cor da linha', 'O que quer dizer', 'O que fazer'],
    ...sit.map((s) => [s.nome, s.quando, {
      'Follow-up vencido': 'Fazer o follow-up hoje', 'Pronto pra abordar': 'Abordar (a Copy já está na linha)', 'A revisar': 'Aprovar ou descartar',
      'Em conversa': 'Esperar; anotar a Data Próxima Ação', 'Cliente': 'Pedir depoimento', 'Perdido': 'Nada', 'Descartado': 'Nada',
    }[s.nome]]),
    [''], ['A aba Garimpo vem ordenada por Prioridade (Alta → Baixa), com descartados e perdidos no fim. Para ver só uma situação, use o filtro no cabeçalho.'],
  ];
  await atualizar(leg, `A1:C${linhas.length}`, linhas.map((l) => [...l, '', ''].slice(0, 3)));
  const p = [
    { repeatCell: { range: faixa(0, 1, 0, 3), cell: { userEnteredFormat: { backgroundColor: rgb(COR.preto), textFormat: { bold: true, foregroundColor: rgb(COR.branco) }, verticalAlignment: 'MIDDLE' } }, fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment)' } },
    ...sit.map((s, i) => ({ repeatCell: { range: faixa(i + 1, i + 2, 0, 3), cell: { userEnteredFormat: { ...formatoTexto(s), verticalAlignment: 'MIDDLE', wrapStrategy: 'WRAP' } }, fields: 'userEnteredFormat(backgroundColor,textFormat,verticalAlignment,wrapStrategy)' } })),
    { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, properties: { pixelSize: 170 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, properties: { pixelSize: 420 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: 0, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, properties: { pixelSize: 260 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: 0, dimension: 'ROWS', startIndex: 0, endIndex: sit.length + 1 }, properties: { pixelSize: 34 }, fields: 'pixelSize' } },
    { updateSheetProperties: { properties: { sheetId: 0, tabColorStyle: { rgbColor: rgb(COR.preto) } }, fields: 'tabColorStyle' } },
  ];
  await chamar({ acao: 'formatar', planilha: leg.planilha, aba: leg.aba, pedidos: p });
}

async function formatar(destino) {
  const valores = await lerValores(destino);
  await formatarAba(destino, valores.length - 1); // antes do cabeçalho: cria a coluna da Ordem se a aba ainda não tem
  await atualizar(destino, `A1:${COL_FIM}1`, [[...COLUNAS, ...RASTREADOR]]);
  const total = await organizar(destino);
  await escreverLegenda(destino);
  console.log(JSON.stringify({ linhas: total, colunas_visiveis: Object.keys(VISIVEIS).length, colunas_ocultas: TOTAL_COLUNAS - Object.keys(VISIVEIS).length, situacoes: situacoes().map((s) => s.nome) }));
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
  await organizar(perfil.destino);
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

// Grava na coluna "Copy" as mensagens redigidas pelo Vendedor Expert. Por padrão não mexe em Copy já preenchida
// (pode ter sido editada pela Karol). O arquivo de entrada tem dado de prospect: fica fora do repositório.
async function gravarCopy(perfil, arquivo, sobrescrever) {
  const copias = new Map(Object.entries(JSON.parse(readFileSync(resolve(arquivo), 'utf8'))).map(([a, m]) => [String(a).replace(/^@/, '').toLowerCase(), m]));
  const [, ...linhas] = await lerValores(perfil.destino);
  const [iArroba, iCopy] = [COLUNAS.indexOf('@'), COLUNAS.indexOf('Copy')];
  let gravadas = 0, mantidas = 0;
  const coluna = linhas.map((l) => {
    const atual = l[iCopy] ?? '';
    const nova = copias.get(String(l[iArroba] || '').replace(/^@/, '').toLowerCase());
    if (!nova) return [atual];
    if (atual && !sobrescrever) { mantidas++; return [atual]; }
    gravadas++;
    return [nova];
  });
  if (!coluna.length) return console.log('Aba sem linhas.');
  await atualizar(perfil.destino, `${letra(iCopy)}2:${letra(iCopy)}${linhas.length + 1}`, coluna);
  console.log(JSON.stringify({ gravadas, mantidas_ja_preenchidas: mantidas, nao_achadas_na_aba: copias.size - gravadas - mantidas }));
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
    else if (cmd === 'formatar') await formatar(perfil().destino);
    else if (cmd === 'copy') await gravarCopy(perfil(), opt.arquivo, resto.includes('--sobrescrever'));
    else if (cmd) console.log('Comandos: enviar | listar | preparar | migrar | recalcular | formatar | copy');
  } catch (e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}
