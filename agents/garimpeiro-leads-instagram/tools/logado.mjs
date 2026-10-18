#!/usr/bin/env node
// Fase 3 do garimpo — aprofundamento LOGADO, só pra quem passou da fase 2 (perfil público).
// Usa o Chrome instalado com uma sessão própria do Garimpeiro, fora do repositório (cookie não vai pro OneDrive/git).
// Conta logada: referenciasgpt (decisão da Karol 18/10/2026) — nunca a conta principal da Karol.
//
// Uso:
//   node logado.mjs login                                  → abre o Chrome; a Karol entra na conta à mão (1 vez)
//   node logado.mjs conferir                               → diz se a sessão está ativa e em qual conta
//   node logado.mjs aprofundar --rodada rodadas/{arquivo}.json [--teto 15]
//   node logado.mjs seguidores --perfil karol [--teto 300]   → lê a lista de seguidores do cliente aos poucos
//                                                            (continua de onde parou) e grava rodadas/candidatos-*.txt
//
// Aprofundar: lê bio completa, link externo, categoria e os últimos posts de cada perfil que NÃO está
// como "descarte" e ainda não foi aprofundado. Grava no próprio JSON da rodada (campo fase: 3).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const RAIZ_WORKER = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PASTA_RODADAS = join(RAIZ_WORKER, 'rodadas');
const SESSAO = join(homedir(), '.auroq', 'garimpeiro', 'sessao-instagram');
const SEGUIDORES_POR_PAGINA = 50;
const SEGUIDORES_TETO_PADRAO = 300; // por dia
const SEGUIDORES_TETO_MAXIMO = 600; // por dia
const PAUSA_PAGINA_MIN_MS = 20000;
const PAUSA_PAGINA_MAX_MS = 40000;
const CONTA_ESPERADA = 'referenciasgpt';
const APP_ID = '936619743392459'; // app id público do instagram.com (mesmo que o site usa)
const TETO_PADRAO = 15;
const TETO_MAXIMO = 30;
const PAUSA_MIN_MS = 8000;
const PAUSA_MAX_MS = 15000;

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const pausaHumana = () => esperar(PAUSA_MIN_MS + Math.random() * (PAUSA_MAX_MS - PAUSA_MIN_MS));

function args() {
  const [cmd, ...resto] = process.argv.slice(2);
  const o = { cmd };
  for (let i = 0; i < resto.length; i++) {
    if (!resto[i].startsWith('--')) continue;
    const k = resto[i].slice(2);
    o[k] = resto[i + 1] && !resto[i + 1].startsWith('--') ? resto[++i] : true;
  }
  return o;
}

async function abrir() {
  mkdirSync(SESSAO, { recursive: true });
  // Janela visível: Chrome headless é mais fácil de o Instagram marcar como robô.
  const ctx = await chromium.launchPersistentContext(SESSAO, { channel: 'chrome', headless: false, viewport: { width: 1200, height: 850 } });
  const page = ctx.pages()[0] || (await ctx.newPage());
  return { ctx, page };
}

// Conta da sessão. `/users/{id}/info/` e `web_profile_info` deram 429 logo depois do login (18/10/2026);
// `accounts/edit/web_form_data` respondeu 200 com o username — é o que vale.
async function contaLogada(ctx, page) {
  if (!(await ctx.cookies('https://www.instagram.com')).some((c) => c.name === 'sessionid')) return null;
  const r = await api(page, '/api/v1/accounts/edit/web_form_data/');
  if (r.ok) return r.json?.form_data?.username || null;
  throw new Error(`Sessão existe, mas o Instagram respondeu ${r.status} ao conferir a conta — esperar e tentar mais tarde`);
}

// Chamada feita de dentro da página logada (mesmos cookies e cabeçalhos do site).
async function api(page, caminho) {
  return page.evaluate(async ({ caminho, APP_ID }) => {
    const r = await fetch(caminho, { headers: { 'x-ig-app-id': APP_ID }, credentials: 'include' });
    const txt = await r.text();
    let json = null;
    try { json = JSON.parse(txt); } catch { /* página de checkpoint/login */ }
    return { ok: r.ok && !!json, status: r.status, json, inicio: json ? '' : txt.slice(0, 120) };
  }, { caminho, APP_ID });
}

async function login() {
  const { ctx, page } = await abrir();
  await page.goto('https://www.instagram.com/accounts/login/');
  await page.bringToFront();
  console.log(`Faça login na conta ${CONTA_ESPERADA} na janela do Chrome que abriu. Espero até 60 minutos.`);
  const inicio = Date.now();
  while (Date.now() - inicio < 60 * 60 * 1000) {
    await esperar(3000);
    if ((await ctx.cookies('https://www.instagram.com')).some((c) => c.name === 'sessionid')) break;
  }
  if (!page.url().startsWith('https://www.instagram.com')) await page.goto('https://www.instagram.com/');
  await esperar(3000);
  const conta = await contaLogada(ctx, page);
  await ctx.close();
  if (!conta) throw new Error('Login não concluído (sem sessão depois de 60 min).');
  if (conta !== CONTA_ESPERADA) throw new Error(`Logou na conta "${conta}", não na ${CONTA_ESPERADA}. Rode "login" de novo e troque de conta.`);
  console.log(`Sessão salva: ${conta}.`);
}

async function conferir() {
  const { ctx, page } = await abrir();
  await page.goto('https://www.instagram.com/');
  await esperar(2000);
  const conta = await contaLogada(ctx, page);
  await ctx.close();
  console.log(JSON.stringify({ sessao_ativa: !!conta, conta, conta_certa: conta === CONTA_ESPERADA }));
  if (conta !== CONTA_ESPERADA) process.exit(1);
}

function resumo(u) {
  const posts = (u.edge_owner_to_timeline_media?.edges || []).slice(0, 6).map(({ node: n }) => ({
    data: n.taken_at_timestamp ? new Date(n.taken_at_timestamp * 1000).toISOString().slice(0, 10) : '',
    legenda: (n.edge_media_to_caption?.edges?.[0]?.node?.text || '').slice(0, 400),
    url: n.shortcode ? `https://www.instagram.com/p/${n.shortcode}/` : '',
  }));
  const links = [u.external_url, ...(u.bio_links || []).map((l) => l.url)].filter(Boolean);
  return {
    nome: u.full_name || '',
    bio: u.biography || '',
    link_externo: [...new Set(links)].join(' · '),
    seguidores: u.edge_followed_by?.count ?? null,
    posts: u.edge_owner_to_timeline_media?.count ?? null,
    categoria: u.category_name || u.business_category_name || '',
    conta_comercial: !!u.is_business_account,
    privado: !!u.is_private,
    posts_recentes: posts,
  };
}

async function aprofundar(o) {
  if (!o.rodada) throw new Error('Passe --rodada {arquivo}');
  const arq = resolve(o.rodada);
  const rodada = JSON.parse(readFileSync(arq, 'utf8'));
  const teto = Math.min(Number(o.teto || TETO_PADRAO), TETO_MAXIMO);
  const fila = (rodada.para_classificar || []).filter((p) => p.aderencia !== 'descarte' && p.fase !== 3).slice(0, teto);
  if (!fila.length) return console.log('Nada pra aprofundar (todo mundo já foi aprofundado ou descartado).');

  const { ctx, page } = await abrir();
  await page.goto('https://www.instagram.com/');
  await esperar(3000);
  const conta = await contaLogada(ctx, page);
  if (conta !== CONTA_ESPERADA) {
    await ctx.close();
    throw new Error(conta ? `Sessão está na conta "${conta}", não na ${CONTA_ESPERADA}.` : 'Sessão expirou — rodar "node logado.mjs login".');
  }

  let feitos = 0, parada = null;
  for (const [i, p] of fila.entries()) {
    if (i) await pausaHumana();
    const r = await api(page, `/api/v1/users/web_profile_info/?username=${encodeURIComponent(p['@'])}`);
    if (!r.ok) {
      if ([401, 403, 429].includes(r.status) || !r.json) { parada = `Instagram respondeu ${r.status} — parei pra não forçar a conta`; break; }
      p.erro_fase3 = `HTTP ${r.status}`;
      continue;
    }
    const u = r.json?.data?.user;
    if (!u) { p.erro_fase3 = 'perfil não encontrado logado'; continue; }
    Object.assign(p, resumo(u), { fase: 3, aprofundado_em: new Date().toISOString().slice(0, 10) });
    feitos++;
    writeFileSync(arq, JSON.stringify(rodada, null, 2)); // salva a cada perfil — se parar no meio, não perde
  }
  await ctx.close();
  const pendentes = (rodada.para_classificar || []).filter((p) => p.aderencia !== 'descarte' && p.fase !== 3).length;
  console.log(JSON.stringify({ aprofundados: feitos, pendentes, conta, parada }));
  if (parada) process.exit(2);
}

// Lista de seguidores do cliente (conta pública), em páginas de 50, devagar e com teto diário.
// Estado (cursor + contagem do dia) em rodadas/seguidores-estado-{perfil}.json — a próxima execução continua dali.
async function seguidores(o) {
  const perfil = JSON.parse(readFileSync(join(RAIZ_WORKER, 'data', 'perfis', `${o.perfil || 'karol'}.json`), 'utf8'));
  const alvo = perfil.instagram_proprio;
  if (!alvo) throw new Error(`Perfil "${perfil.id}" sem "instagram_proprio" (o @ do cliente).`);
  const hoje = new Date().toISOString().slice(0, 10);
  mkdirSync(PASTA_RODADAS, { recursive: true });
  const arqEstado = join(PASTA_RODADAS, `seguidores-estado-${perfil.id}.json`);
  const estado = existsSync(arqEstado) ? JSON.parse(readFileSync(arqEstado, 'utf8')) : { alvo, cursor: null, lidos_total: 0, fim: false };
  if (estado.fim) return console.log(JSON.stringify({ fim: true, lidos_total: estado.lidos_total, aviso: 'Lista inteira já lida. Apague o arquivo de estado pra recomeçar do início.' }));
  if (estado.dia !== hoje) { estado.dia = hoje; estado.lidos_hoje = 0; }
  const teto = Math.min(Number(o.teto || SEGUIDORES_TETO_PADRAO), SEGUIDORES_TETO_MAXIMO);
  const restante = teto - estado.lidos_hoje;
  if (restante <= 0) return console.log(JSON.stringify({ lidos_hoje: estado.lidos_hoje, aviso: `Teto do dia (${teto}) já atingido. Continua amanhã.` }));

  const { ctx, page } = await abrir();
  await page.goto('https://www.instagram.com/');
  await esperar(3000);
  const conta = await contaLogada(ctx, page);
  if (conta !== CONTA_ESPERADA) {
    await ctx.close();
    throw new Error(conta ? `Sessão está na conta "${conta}", não na ${CONTA_ESPERADA}.` : 'Sessão expirou — rodar "node logado.mjs login".');
  }
  if (!estado.alvo_id) {
    const r = await api(page, `/api/v1/users/web_profile_info/?username=${encodeURIComponent(alvo)}`);
    estado.alvo_id = r.json?.data?.user?.id;
    if (!estado.alvo_id) { await ctx.close(); throw new Error(`Não achei o id de @${alvo} (HTTP ${r.status}).`); }
  }

  const novos = [];
  let parada = null;
  while (novos.length < restante) {
    if (novos.length) await esperar(PAUSA_PAGINA_MIN_MS + Math.random() * (PAUSA_PAGINA_MAX_MS - PAUSA_PAGINA_MIN_MS));
    const q = `count=${SEGUIDORES_POR_PAGINA}&search_surface=follow_list_page${estado.cursor ? `&max_id=${encodeURIComponent(estado.cursor)}` : ''}`;
    const r = await api(page, `/api/v1/friendships/${estado.alvo_id}/followers/?${q}`);
    if (!r.ok) { parada = `Instagram respondeu ${r.status} — parei pra não forçar a conta`; break; }
    for (const u of r.json.users || []) novos.push({ arroba: String(u.username).toLowerCase(), privado: !!u.is_private });
    estado.cursor = r.json.next_max_id || null;
    if (!estado.cursor) { estado.fim = true; break; }
  }
  await ctx.close();

  estado.lidos_hoje += novos.length;
  estado.lidos_total += novos.length;
  estado.atualizado_em = new Date().toISOString();
  writeFileSync(arqEstado, JSON.stringify(estado, null, 2));
  const hora = new Date().toTimeString().slice(0, 5).replace(':', '');
  const arqCand = join(PASTA_RODADAS, `candidatos-${hoje}-${hora}-${perfil.id}.txt`);
  writeFileSync(arqCand, novos.map((n) => `${n.arroba}\tseguidor de @${alvo}`).join('\n') + '\n');
  console.log(JSON.stringify({ candidatos: arqCand, lidos_agora: novos.length, privados: novos.filter((n) => n.privado).length, lidos_hoje: estado.lidos_hoje, lidos_total: estado.lidos_total, fim: !!estado.fim, parada }));
  if (parada) process.exit(2);
}

const o = args();
try {
  if (o.cmd === 'login') await login();
  else if (o.cmd === 'conferir') await conferir();
  else if (o.cmd === 'aprofundar') await aprofundar(o);
  else if (o.cmd === 'seguidores') await seguidores(o);
  else console.log('Comandos: login | conferir | aprofundar --rodada X [--teto 15] | seguidores --perfil X [--teto 300]');
} catch (e) {
  console.error('ERRO:', e.message);
  process.exit(1);
}
