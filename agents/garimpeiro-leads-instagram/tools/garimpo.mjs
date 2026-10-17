#!/usr/bin/env node
// Garimpo de leads no Instagram — coleta (Apify), enriquecimento, dedup e filtro mecânico.
// A leitura de bio, a nota de aderência e o fato-gancho ficam com o agente (não com este script).
//
// Uso:
//   node garimpo.mjs coletar --perfil karol --termos "psicologa,nutricionista" [--modo hashtag|busca|ambos] [--limite 60] [--estimar]
//   node garimpo.mjs saldo
//
// Saída: agents/garimpeiro-leads-instagram/rodadas/{AAAA-MM-DD}-{HHMM}-{perfil}.json  (pasta no .gitignore — dado pessoal)

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_WORKER = resolve(AQUI, '..');
const RAIZ_REPO = (() => {
  let d = RAIZ_WORKER;
  while (!existsSync(join(d, '.git')) && dirname(d) !== d) d = dirname(d);
  return d;
})();
const PASTA_RODADAS = join(RAIZ_WORKER, 'rodadas');
const PRECO = { hashtag: 0.0026, busca: 0.0027, perfil: 0.0026 }; // US$ por item, faixa FREE (conferido 17/10/2026)

// ---------- utilitários ----------
function args() {
  const [cmd, ...resto] = process.argv.slice(2);
  const o = { cmd };
  for (let i = 0; i < resto.length; i++) {
    if (!resto[i].startsWith('--')) continue;
    const k = resto[i].slice(2);
    const v = resto[i + 1] && !resto[i + 1].startsWith('--') ? resto[++i] : true;
    o[k] = v;
  }
  return o;
}

export function normalizarArroba(x) {
  if (!x) return '';
  return String(x).trim().toLowerCase()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '')
    .replace(/^@/, '')
    .split('/')[0]
    .trim();
}

function semAcento(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

function tokenApify() {
  if (process.env.APIFY_TOKEN) return process.env.APIFY_TOKEN;
  return execSync('op read "op://Claude/Apify/credential"', { encoding: 'utf8' }).trim();
}

async function apify(caminho, { metodo = 'GET', corpo, timeout } = {}) {
  const url = `https://api.apify.com/v2${caminho}${timeout ? (caminho.includes('?') ? '&' : '?') + 'timeout=' + timeout : ''}`;
  const r = await fetch(url, {
    method: metodo,
    headers: { Authorization: `Bearer ${tokenApify()}`, 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Apify ${r.status} em ${caminho}: ${txt.slice(0, 300)}`);
  return JSON.parse(txt);
}

// Roda o ator e devolve os itens. Usa execução assíncrona + espera, pra não perder a run se passar de 300s.
async function rodarAtor(ator, input) {
  const run = (await apify(`/acts/${ator}/runs`, { metodo: 'POST', corpo: input })).data;
  let estado = run;
  const inicio = Date.now();
  while (!['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(estado.status)) {
    if (Date.now() - inicio > 15 * 60 * 1000) throw new Error(`Run ${run.id} passou de 15 min — conferir no painel, não rodar de novo`);
    estado = (await apify(`/actor-runs/${run.id}?waitForFinish=60`)).data;
  }
  if (estado.status !== 'SUCCEEDED') throw new Error(`Run ${run.id} terminou ${estado.status}`);
  const itens = await apify(`/datasets/${estado.defaultDatasetId}/items?clean=true&format=json`);
  return { itens, custo: estado.usageTotalUsd ?? null, runId: run.id };
}

async function saldo() {
  const d = (await apify('/users/me/limits')).data;
  const teto = d.limits?.maxMonthlyUsageUsd ?? 0;
  const usado = d.current?.monthlyUsageUsd ?? 0;
  return { teto, usado, livre: +(teto - usado).toFixed(4), fimCiclo: d.monthlyUsageCycle?.endAt };
}

function lerPerfil(nome) {
  const p = join(RAIZ_WORKER, 'data', 'perfis', `${nome}.json`);
  if (!existsSync(p)) throw new Error(`Perfil de busca não encontrado: ${p}`);
  return JSON.parse(readFileSync(p, 'utf8'));
}

// ---------- dedup ----------
async function arrobasDoCrmKarol() {
  const vault = readFileSync(join(RAIZ_REPO, 'business', 'vault', 'supabase.md'), 'utf8');
  const chave = (vault.match(/sb_secret_[A-Za-z0-9_-]+/) || [])[0];
  if (!chave) throw new Error('Chave secreta do Supabase não achada em business/vault/supabase.md');
  const r = await fetch('https://pxnbcbhgoewrwyreohki.supabase.co/rest/v1/crm_leads?select=instagram&instagram=not.is.null', {
    headers: { apikey: chave },
  });
  if (!r.ok) throw new Error(`Supabase ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return new Set((await r.json()).map((x) => normalizarArroba(x.instagram)).filter(Boolean));
}

async function arrobasDoGarimpo(perfil) {
  // Histórico do próprio garimpo (aprovados e descartados) — vem da aba de destino via webhook n8n.
  const { listarAba } = await import('./planilha.mjs');
  const linhas = await listarAba(perfil.destino);
  return new Set(linhas.map((l) => normalizarArroba(l['@'])).filter(Boolean));
}

function arrobasDasRodadasLocais(perfil) {
  // Descartados nunca vão pra aba — sem isso, o mesmo perfil seria pago e descartado de novo na próxima rodada.
  const vistos = new Set();
  if (!existsSync(PASTA_RODADAS)) return vistos;
  for (const f of readdirSync(PASTA_RODADAS).filter((n) => n.endsWith(`-${perfil.id}.json`))) {
    const r = JSON.parse(readFileSync(join(PASTA_RODADAS, f), 'utf8'));
    for (const p of [...(r.para_classificar || []), ...(r.descartados || [])]) vistos.add(normalizarArroba(p['@']));
  }
  return vistos;
}

// ---------- filtro mecânico ----------
function filtroMecanico(p, perfil) {
  const bio = semAcento(`${p.fullName || ''} ${p.biography || ''} ${p.businessCategoryName || ''}`);
  const desc = perfil.descartes_palavras.find((w) => bio.includes(semAcento(w)));
  if (desc) return `descarte: "${desc}" no nome/bio/categoria`;
  const seg = p.followersCount ?? null;
  if (seg !== null && (seg < perfil.faixa_seguidores.min || seg > perfil.faixa_seguidores.max)) return `fora da faixa de seguidores (${seg})`;
  if (!p.biography) return 'bio vazia';
  return null;
}

// ---------- comandos ----------
async function coletar(o) {
  const perfil = lerPerfil(o.perfil || 'karol');
  const termos = String(o.termos || '').split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
  if (!termos.length) throw new Error('Passe --termos "termo1,termo2"');
  const modo = o.modo || 'hashtag';
  const limite = Number(o.limite || 60); // por termo

  const coletaMax = termos.length * limite * (modo === 'ambos' ? 2 : 1);
  const estimativa = +(coletaMax * PRECO.hashtag + coletaMax * PRECO.perfil).toFixed(2); // teto (cada coletado vira perfil)
  const s = await saldo();
  console.log(`Saldo Apify: US$${s.livre} livre de US$${s.teto} (ciclo até ${s.fimCiclo?.slice(0, 10)}). Teto estimado da rodada: US$${estimativa}`);
  if (o.estimar) return;
  if (estimativa > s.livre && !o['aprovado-acima-do-saldo']) {
    throw new Error('Rodada pode passar do saldo do mês. Reduza --limite ou peça OK da Karol (nível 3).');
  }
  // Custo real = diferença do uso mensal antes/depois. O `usageTotalUsd` da run NÃO inclui as cobranças por
  // evento (pay-per-event) — na rodada de 17/10 ele marcou US$0,15 contra US$0,70 reais.
  const usoAntes = s.usado;

  // 1) candidatos
  const candidatos = new Map(); // arroba -> {termo, origem}
  let custo = 0;
  if (modo === 'hashtag' || modo === 'ambos') {
    for (const t of termos) {
      const { itens, custo: c } = await rodarAtor('apify~instagram-hashtag-scraper', { hashtags: [t], resultsType: 'posts', resultsLimit: limite });
      custo += c || 0;
      for (const it of itens) {
        const a = normalizarArroba(it.ownerUsername);
        if (a && !candidatos.has(a)) candidatos.set(a, { termo: `#${t}`, origem: 'hashtag', post: { data: it.timestamp, legenda: (it.caption || '').slice(0, 400), url: it.url } });
      }
    }
  }
  if (modo === 'busca' || modo === 'ambos') {
    for (const t of termos) {
      const { itens, custo: c } = await rodarAtor('apify~instagram-search-scraper', { search: t, searchType: 'user', searchLimit: limite });
      custo += c || 0;
      for (const it of itens) {
        const a = normalizarArroba(it.username);
        if (a && !candidatos.has(a)) candidatos.set(a, { termo: t, origem: 'busca' });
      }
    }
  }

  // 2) dedup
  const jaVistos = new Set();
  if (perfil.dedup_crm_karol) for (const a of await arrobasDoCrmKarol()) jaVistos.add(a);
  try { for (const a of await arrobasDoGarimpo(perfil)) jaVistos.add(a); }
  catch (e) { console.warn(`AVISO: não consegui ler a aba de garimpo (${e.message}). Dedup contra CRM e rodadas locais.`); }
  for (const a of arrobasDasRodadasLocais(perfil)) jaVistos.add(a);
  const bloqueio = new Set((perfil.nao_abordar || []).map(normalizarArroba));
  const duplicados = [], novos = [];
  for (const a of candidatos.keys()) (jaVistos.has(a) || bloqueio.has(a) ? duplicados : novos).push(a);

  // 3) enriquecimento
  let perfis = [];
  if (novos.length) {
    const { itens, custo: c } = await rodarAtor('apify~instagram-profile-scraper', { usernames: novos });
    custo += c || 0;
    perfis = itens;
  }

  // 4) filtro mecânico
  const aprovadosFiltro = [], descartados = [];
  for (const p of perfis) {
    const a = normalizarArroba(p.username);
    const motivo = filtroMecanico(p, perfil);
    const base = { '@': a, nome: p.fullName || '', termo: candidatos.get(a)?.termo, motivo };
    if (motivo) { descartados.push(base); continue; }
    aprovadosFiltro.push({
      '@': a,
      link_perfil: `https://instagram.com/${a}`,
      nome: p.fullName || 'não público',
      bio: p.biography || 'não público',
      link_externo: p.externalUrl || (p.externalUrls || [])[0]?.url || 'não público',
      seguidores: p.followersCount ?? 'não público',
      posts: p.postsCount ?? null,
      categoria: p.businessCategoryName || '',
      conta_comercial: !!p.isBusinessAccount,
      privado: !!p.private,
      termo: candidatos.get(a)?.termo,
      origem: candidatos.get(a)?.origem,
      post_da_hashtag: candidatos.get(a)?.post || null,
      posts_recentes: (p.latestPosts || []).slice(0, 4).map((x) => ({ data: x.timestamp, legenda: (x.caption || '').slice(0, 300), url: x.url })),
    });
  }

  mkdirSync(PASTA_RODADAS, { recursive: true });
  const hoje = new Date().toISOString().slice(0, 10);
  const hora = new Date().toTimeString().slice(0, 5).replace(':', '');
  const arq = join(PASTA_RODADAS, `${hoje}-${hora}-${perfil.id}.json`); // hora evita sobrescrever 2 rodadas no mesmo dia
  await new Promise((r) => setTimeout(r, 5000)); // uso mensal demora alguns segundos pra refletir
  const usoDepois = (await saldo()).usado;
  const saida = {
    perfil: perfil.id, data: hoje, termos, modo, limite_por_termo: limite,
    custo_usd: +Math.max(usoDepois - usoAntes, custo).toFixed(4),
    contagem: { candidatos: candidatos.size, duplicados: duplicados.length, enriquecidos: perfis.length, descartados_filtro: descartados.length, para_classificar: aprovadosFiltro.length },
    para_classificar: aprovadosFiltro,
    descartados,
  };
  writeFileSync(arq, JSON.stringify(saida, null, 2));
  console.log(JSON.stringify({ arquivo: arq, custo_usd: saida.custo_usd, ...saida.contagem }, null, 2));
}

const o = args();
try {
  if (o.cmd === 'coletar') await coletar(o);
  else if (o.cmd === 'saldo') console.log(await saldo());
  else console.log('Comandos: coletar | saldo');
} catch (e) {
  console.error('ERRO:', e.message);
  process.exit(1);
}
