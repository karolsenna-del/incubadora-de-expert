#!/usr/bin/env node
// Garimpo de leads no Instagram — fases 1 e 2, sem custo e sem login.
//   Fase 1 (descoberta): o agente busca na web (WebSearch, site:instagram.com) e grava os @ num arquivo.
//   Fase 2 (perfil público): este script lê a página pública de cada @ (nome, bio, seguidores, posts),
//   faz dedup e filtro mecânico. A leitura de bio, as perguntas de fit e o fato-gancho ficam com o agente.
//   Fase 3 (logada, só quem passou da fase 2): tools/logado.mjs.
//
// Uso:
//   node garimpo.mjs coletar --perfil karol --candidatos rodadas/candidatos-{data}.txt
//   node garimpo.mjs coletar --perfil karol --arrobas "fulana,ciclana" [--termo "servidora pública"]
//
// Arquivo de candidatos: uma linha por perfil, "@arroba<TAB>termo de busca" (o termo é opcional).
// Saída: agents/garimpeiro-leads-instagram/rodadas/{AAAA-MM-DD}-{HHMM}-{perfil}.json  (pasta no .gitignore — dado pessoal)

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
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
const PAUSA_PUBLICA_MS = 2500; // entre páginas públicas — devagar pra não levar bloqueio temporário
const MAX_POR_RODADA = 150;

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

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function decodificar(s) {
  return String(s || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#039;|&apos;/g, "'");
}

// "1,234" / "12K" / "1.2M" / "3 mil" → número
function numero(txt) {
  const t = String(txt).trim().toLowerCase().replace(/\s/g, '');
  const m = t.match(/^([\d.,]+)(k|m|mil|mi)?$/);
  if (!m) return null;
  let base = m[1];
  if (m[2]) return Math.round(parseFloat(base.replace(',', '.')) * (m[2] === 'k' || m[2] === 'mil' ? 1e3 : 1e6));
  return Number(base.replace(/[.,]/g, ''));
}

// Página pública (sem login). A meta "description" traz: "{seg} Followers, {seg} Following, {n} Posts - {Nome} (@user) on Instagram: "{bio}""
export async function perfilPublico(arroba) {
  const r = await fetch(`https://www.instagram.com/${arroba}/`, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'manual' });
  if (r.status === 404) return { status: 'nao_existe' };
  if (r.status >= 300 && r.status < 400) return { status: 'bloqueio', detalhe: `redirecionou (${r.status}) — Instagram pediu login` };
  if (!r.ok) return { status: 'erro', detalhe: `HTTP ${r.status}` };
  const html = await r.text();
  const desc = (html.match(/<meta content="([^"]*)" name="description"/) || html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const titulo = (html.match(/<meta property="og:title" content="([^"]*)"/) || [])[1];
  if (!desc) return { status: html.includes('login') ? 'bloqueio' : 'nao_existe', detalhe: 'página sem dados públicos' };
  const d = decodificar(desc);
  const m = d.match(/^([\d.,]+\s*[KkMm]?(?:il|i)?)\s+\S+,\s*([\d.,]+\s*[KkMm]?)\s+\S+,\s*([\d.,]+\s*[KkMm]?)\s+\S+\s+-\s+(.*?)\s*\(@([^)]+)\)(?:[^:]*:\s*"([\s\S]*)")?\s*$/);
  if (!m) return { status: 'erro', detalhe: 'formato da página mudou', bruto: d.slice(0, 200) };
  const nomeTitulo = decodificar(titulo || '').replace(/\s*\(@[^)]*\).*$/, '').trim();
  return {
    status: 'ok',
    seguidores: numero(m[1]),
    seguindo: numero(m[2]),
    posts: numero(m[3]),
    nome: (m[4] || nomeTitulo || '').trim(),
    bio: (m[6] || '').trim(),
  };
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
  // Descartados nunca vão pra aba — sem isso, o mesmo perfil seria lido e descartado de novo na próxima rodada.
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
  const bio = semAcento(`${p.nome || ''} ${p.bio || ''}`);
  const desc = perfil.descartes_palavras.find((w) => bio.includes(semAcento(w)));
  if (desc) return `descarte: "${desc}" no nome/bio`;
  const seg = p.seguidores ?? null;
  if (seg !== null && (seg < perfil.faixa_seguidores.min || seg > perfil.faixa_seguidores.max)) return `fora da faixa de seguidores (${seg})`;
  if (!p.bio) return 'bio vazia';
  return null;
}

// ---------- comandos ----------
function lerCandidatos(o) {
  const lista = new Map(); // arroba -> termo
  if (o.candidatos) {
    for (const linha of readFileSync(resolve(o.candidatos), 'utf8').split(/\r?\n/)) {
      const [a, termo] = linha.split('\t');
      const n = normalizarArroba(a);
      if (n && !lista.has(n)) lista.set(n, (termo || '').trim());
    }
  }
  if (o.arrobas) for (const a of String(o.arrobas).split(',')) {
    const n = normalizarArroba(a);
    if (n && !lista.has(n)) lista.set(n, String(o.termo || '').trim());
  }
  return lista;
}

async function coletar(o) {
  const perfil = lerPerfil(o.perfil || 'karol');
  const candidatos = lerCandidatos(o);
  if (!candidatos.size) throw new Error('Passe --candidatos {arquivo} ou --arrobas "a,b"');

  // 1) dedup
  const jaVistos = new Set();
  if (perfil.dedup_crm_karol) for (const a of await arrobasDoCrmKarol()) jaVistos.add(a);
  try { for (const a of await arrobasDoGarimpo(perfil)) jaVistos.add(a); }
  catch (e) { console.warn(`AVISO: não consegui ler a aba de garimpo (${e.message}). Dedup contra CRM e rodadas locais.`); }
  for (const a of arrobasDasRodadasLocais(perfil)) jaVistos.add(a);
  const bloqueio = new Set((perfil.nao_abordar || []).map(normalizarArroba));
  const duplicados = [], novos = [];
  for (const a of candidatos.keys()) (jaVistos.has(a) || bloqueio.has(a) ? duplicados : novos).push(a);
  const lote = novos.slice(0, MAX_POR_RODADA);

  // 2) perfil público + filtro mecânico
  const aprovadosFiltro = [], descartados = [], naoLidos = [];
  let parouPorBloqueio = false;
  for (const [i, a] of lote.entries()) {
    if (i) await esperar(PAUSA_PUBLICA_MS);
    const p = await perfilPublico(a);
    if (p.status === 'bloqueio') { parouPorBloqueio = true; naoLidos.push(...lote.slice(i)); break; }
    const base = { '@': a, nome: p.nome || '', termo: candidatos.get(a) };
    if (p.status === 'nao_existe') { descartados.push({ ...base, motivo: 'perfil não existe' }); continue; }
    if (p.status !== 'ok') { naoLidos.push(a); continue; }
    const motivo = filtroMecanico(p, perfil);
    if (motivo) { descartados.push({ ...base, motivo }); continue; }
    aprovadosFiltro.push({
      '@': a,
      link_perfil: `https://instagram.com/${a}`,
      nome: p.nome || 'não público',
      bio: p.bio,
      link_externo: '',
      seguidores: p.seguidores ?? 'não público',
      posts: p.posts ?? null,
      categoria: '',
      termo: candidatos.get(a),
      ...(String(candidatos.get(a) || '').startsWith('seguidor de @')
        ? { origem: 'seguidores', grupo: 'Seguidor sem interação' }
        : { origem: 'busca web', grupo: 'Conexões frias qualificadas' }),
      fase: 2,
      posts_recentes: [],
    });
  }

  mkdirSync(PASTA_RODADAS, { recursive: true });
  const hoje = new Date().toISOString().slice(0, 10);
  const hora = new Date().toTimeString().slice(0, 5).replace(':', '');
  const arq = join(PASTA_RODADAS, `${hoje}-${hora}-${perfil.id}.json`); // hora evita sobrescrever 2 rodadas no mesmo dia
  const termos = [...new Set([...candidatos.values()].filter(Boolean))];
  const saida = {
    perfil: perfil.id, data: hoje, termos, modo: 'busca web + perfil público', custo_usd: 0,
    contagem: {
      candidatos: candidatos.size, duplicados: duplicados.length, fora_do_lote: novos.length - lote.length,
      lidos: lote.length - naoLidos.length, nao_lidos: naoLidos.length, descartados_filtro: descartados.length,
      para_classificar: aprovadosFiltro.length,
    },
    para_classificar: aprovadosFiltro,
    descartados,
    nao_lidos: naoLidos,
  };
  writeFileSync(arq, JSON.stringify(saida, null, 2));
  console.log(JSON.stringify({ arquivo: arq, ...saida.contagem }, null, 2));
  if (parouPorBloqueio) console.warn(`AVISO: o Instagram parou de mostrar perfil público (pediu login). ${naoLidos.length} perfil(s) ficaram em "nao_lidos" — tentar de novo mais tarde.`);
}

const o = args();
if (process.argv[1]?.endsWith('garimpo.mjs')) {
  try {
    if (o.cmd === 'coletar') await coletar(o);
    else if (o.cmd === 'publico') console.log(await perfilPublico(normalizarArroba(o.arroba)));
    else console.log('Comandos: coletar | publico --arroba X');
  } catch (e) {
    console.error('ERRO:', e.message);
    process.exit(1);
  }
}
