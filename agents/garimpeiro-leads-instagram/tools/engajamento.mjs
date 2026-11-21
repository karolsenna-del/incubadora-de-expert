#!/usr/bin/env node
// Garimpo de quem ENGAJOU com o perfil da Karol (pedido 18/11/2026): quem comentou e quem curtiu os posts dela.
//   Posts: a lista (curtidas e comentários de cada um) vem do robô diário das métricas (workflow instagram-metricas),
//     arquivo business/instagram/metricas/{data}.md no GitHub (origin/master), grátis.
//   Comentários: o @ de quem comentou vem do Apify (apidojo/instagram-comments-scraper, US$0,0005/comentário): a API oficial esconde.
//   Curtidas: a API oficial não diz quem curtiu → Apify (datadoping/instagram-likes-scraper, ~US$0,00155 por curtida).
//     Regra da Karol: SEMPRE dentro do crédito grátis de US$5/mês do Apify. O script calcula quanto cabe e para antes.
//
// Uso:
//   node engajamento.mjs coletar [--teto-usd 1.5] [--sem-curtidas]
//       → gera rodadas/candidatos-{data}-engajamento-karol.txt + rodadas/engajamento-{data}-karol.json (o que cada um fez)
//   node engajamento.mjs anexar --rodada rodadas/{arquivo}.json --contexto rodadas/engajamento-{data}-karol.json
//       → depois do `garimpo.mjs coletar`: põe em cada perfil o que ele comentou/curtiu e em qual post, Grupo "Seguidores engajados"
//   node engajamento.mjs saldo
// Depois segue a rodada normal (rodada-garimpo.md): posts → classificação → copy (citando o comentário/post) → planilha.mjs enviar.
// Estado (o que já foi lido, pra não pagar duas vezes): rodadas/engajamento-estado-karol.json (pasta gitignorada: dado pessoal).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { normalizarArroba, rodarAtor, saldoApify } from './garimpo.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ_WORKER = resolve(AQUI, '..');
const RAIZ_REPO = resolve(RAIZ_WORKER, '..', '..');
const PASTA_RODADAS = join(RAIZ_WORKER, 'rodadas');
const ESTADO = join(PASTA_RODADAS, 'engajamento-estado-karol.json');
const PROPRIAS = new Set(['karolsenna._', 'referenciasgpt', 'incubadoradeexpert']);
const ATOR_CURTIDAS = 'datadoping~instagram-likes-scraper';
const ATOR_COMENTARIOS = 'apidojo~instagram-comments-scraper';
const PRECO_CURTIDA = 0.00155;
// Custo estimado de cada curtida até virar lead: a curtida + ler o perfil (US$0,0013) + posts de ~30% que passam (US$0,016).
const CUSTO_POR_CURTIDA_TOTAL = PRECO_CURTIDA + 0.0013 + 0.3 * 0.016;
const RESERVA_USD = Number(process.env.RESERVA_APIFY_USD ?? 1.0); // sobra do mês pro garimpo normal (REGRA-002 do Garimpeiro: saldo abaixo de US$1 = avisar)
const DIAS_PRA_CURTIDA_ASSENTAR = 2; // post muito novo ainda está recebendo curtida: lê depois, uma vez só

function args() {
  const [cmd, ...r] = process.argv.slice(2);
  const o = { cmd };
  for (let i = 0; i < r.length; i++) if (r[i].startsWith('--')) o[r[i].slice(2)] = r[i + 1] && !r[i + 1].startsWith('--') ? r[++i] : true;
  return o;
}
const git = (c) => execSync(`git ${c}`, { cwd: RAIZ_REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const hoje = () => new Date().toISOString().slice(0, 10);
const lerEstado = () => (existsSync(ESTADO) ? JSON.parse(readFileSync(ESTADO, 'utf8')) : { comentarios_vistos: [], posts_curtidas_lidos: {} });

// Posts da tabela "Posts dos últimos 10 dias" do arquivo de métricas mais novo: data, legenda, curtidas, link.
function postsRecentes() {
  const md = git('ls-tree --name-only origin/master business/instagram/metricas/').split('\n').filter((f) => /\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().pop();
  const texto = git(`show "origin/master:${md}"`);
  const ano = md.match(/(\d{4})-/)[1];
  const posts = [];
  for (const l of texto.split('\n')) {
    const c = l.split('|').map((x) => x.trim());
    // | Data | Tipo | Legenda | Alcance | Views | Curtidas | Comentários | Saves | Shares | Interações | Skip | Tempo | Link |
    // Conta de trás pra frente: legenda com "|" desalinha a contagem da frente.
    if (c.length < 15 || !/^\d{2}\/\d{2}/.test(c[1])) continue;
    const link = c[c.length - 2];
    if (!/instagram\.com/.test(link)) continue;
    const [d, m] = c[1].slice(0, 5).split('/');
    posts.push({ data: `${ano}-${m}-${d}`, tipo: c[2], legenda: c[3], curtidas: Number(c[c.length - 9]) || 0, comentarios: Number(c[c.length - 8]) || 0, link });
  }
  return posts;
}

async function coletar(o) {
  git('fetch -q origin');
  const estado = lerEstado();
  const vistos = new Set(estado.comentarios_vistos);
  const pessoas = new Map(); // arroba -> [{tipo, texto?, data, post, legenda}]
  const add = (a, ev) => { if (!a || PROPRIAS.has(a)) return; if (!pessoas.has(a)) pessoas.set(a, []); pessoas.get(a).push(ev); };

  // 1) comentários. A API oficial devolve o texto mas esconde QUEM comentou (username só vem nos comentários da
  //    própria Karol — conferido 18/11/2026: 31 de 57 sem autor, os outros 26 eram dela). Então o @ vem do Apify
  //    (apidojo/instagram-comments-scraper, US$0,0005 por comentário), só dos posts com comentário novo.
  const saldo = await saldoApify();
  let tetoTotal = Math.min(Number(o['teto-usd']) || 1.5, +(saldo.livre - RESERVA_USD).toFixed(4));
  const todosPosts = postsRecentes();
  estado.posts_comentarios_lidos ||= {};
  const postsComent = todosPosts.filter((p) => p.comentarios > (estado.posts_comentarios_lidos[p.link]?.comentarios || 0));
  const novosComent = [];
  let custoComent = 0;
  if (postsComent.length && tetoTotal > 0) {
    const max = postsComent.reduce((s, p) => s + p.comentarios, 0) + 20;
    const { itens, custo } = await rodarAtor(ATOR_COMENTARIOS, { startUrls: postsComent.map((p) => p.link), maxItems: max });
    custoComent = custo; tetoTotal -= custo;
    const porCodigo = new Map(postsComent.map((p) => [p.link.split('/').filter(Boolean).pop(), p]));
    for (const x of itens) {
      if (vistos.has(x.id)) continue;
      const a = normalizarArroba(x.user?.username);
      const p = porCodigo.get(x.postId);
      novosComent.push(x.id);
      if (x.user?.isPrivate === true) continue;
      add(a, { tipo: 'comentou', texto: String(x.message || '').slice(0, 300), data: String(x.createdAt || '').slice(0, 10), post: p?.link || '', legenda: p?.legenda || '' });
    }
    for (const p of postsComent) estado.posts_comentarios_lidos[p.link] = { lido_em: hoje(), comentarios: p.comentarios };
  }

  // 2) curtidas (Apify, dentro do crédito grátis)
  let custoCurtidas = 0, postsLidos = [], aviso = null, privados = 0;
  if (!o['sem-curtidas']) {
    const teto = +tetoTotal.toFixed(4);
    const limite = new Date(Date.now() - DIAS_PRA_CURTIDA_ASSENTAR * 864e5).toISOString().slice(0, 10);
    const fila = todosPosts.filter((p) => p.curtidas > 0 && p.data <= limite && !estado.posts_curtidas_lidos[p.link])
      .sort((a, b) => b.curtidas - a.curtidas);
    let previsto = 0;
    for (const p of fila) {
      const custo = p.curtidas * CUSTO_POR_CURTIDA_TOTAL;
      if (previsto + custo > teto) continue;
      previsto += custo; postsLidos.push(p);
    }
    if (teto <= 0) aviso = `crédito do Apify no limite (livre US$${saldo.livre}, reserva US$${RESERVA_USD}): curtidas ficaram pra mês que vem`;
    else if (!postsLidos.length && fila.length) aviso = `nenhum post cabe no teto de US$${teto}`;
    if (postsLidos.length) {
      const maxPorPost = Math.max(...postsLidos.map((p) => p.curtidas)) + 5;
      const { itens, custo } = await rodarAtor(ATOR_CURTIDAS, { posts: postsLidos.map((p) => p.link), max_count: maxPorPost });
      custoCurtidas = custo;
      const porCodigo = new Map(postsLidos.map((p) => [p.link.split('/').filter(Boolean).pop(), p]));
      for (const x of itens) {
        if (x.is_private === true) { privados++; continue; } // conta privada não recebe DM fria (Karol, 21/10): nem paga a leitura do perfil
        const a =normalizarArroba(x.username || x.user?.username || x.owner?.username);
        const ref = String(x.post_url || x.postUrl || x.inputUrl || x.post || x.shortcode || x.post_code || '');
        const p = [...porCodigo.entries()].find(([cod]) => ref.includes(cod))?.[1] || (postsLidos.length === 1 ? postsLidos[0] : null);
        add(a, { tipo: 'curtiu', data: p?.data || '', post: p?.link || '', legenda: p?.legenda || '' });
      }
      if (itens.length && !pessoas.size) console.error('AVISO: o robô de curtidas devolveu itens sem @ reconhecível:', JSON.stringify(itens[0]).slice(0, 300));
    }
  }

  // 3) arquivos da rodada
  const data = hoje();
  const cand = join(PASTA_RODADAS, `candidatos-${data}-engajamento-karol.txt`);
  const ctx = join(PASTA_RODADAS, `engajamento-${data}-karol.json`);
  const ctxAntigo = existsSync(ctx) ? JSON.parse(readFileSync(ctx, 'utf8')) : {};
  for (const [a, evs] of pessoas) ctxAntigo[a] = [...(ctxAntigo[a] || []), ...evs];
  writeFileSync(ctx, JSON.stringify(ctxAntigo, null, 2));
  writeFileSync(cand, Object.entries(ctxAntigo).map(([a, evs]) => `@${a}\tengajou: ${[...new Set(evs.map((e) => e.tipo))].join(' + ')}`).join('\n') + '\n');

  // 4) estado: só marca o que foi lido de verdade
  estado.comentarios_vistos = [...vistos, ...novosComent];
  for (const p of postsLidos) estado.posts_curtidas_lidos[p.link] = { lido_em: data, curtidas: p.curtidas };
  writeFileSync(ESTADO, JSON.stringify(estado, null, 2));

  const custoTotal = custoComent + custoCurtidas;
  const comentaram = [...pessoas.values()].filter((e) => e.some((x) => x.tipo === 'comentou')).length;
  console.log(JSON.stringify({ comentarios_novos: novosComent.length, pessoas: pessoas.size, comentaram, so_curtiram: pessoas.size - comentaram,
    posts_curtidas_lidos: postsLidos.length, curtidas_privadas_puladas: privados, custo_comentarios_usd: +custoComent.toFixed(4), custo_curtidas_usd: +custoCurtidas.toFixed(4), custo_total_usd: +custoTotal.toFixed(4), aviso, candidatos: cand, contexto: ctx }));
}

function resumo(evs) {
  const c = evs.filter((e) => e.tipo === 'comentou');
  const fmt = (d) => (d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '');
  if (c.length) {
    const u = c.sort((a, b) => b.data.localeCompare(a.data))[0];
    return { fato: `Comentou "${u.texto}" no seu post de ${fmt(u.data)} ("${u.legenda.replace(/\s+/g, ' ').slice(0, 60)}…")${c.length > 1 ? ` (+${c.length - 1} comentário(s))` : ''}`, fonte: u.post };
  }
  const k = evs.sort((a, b) => b.data.localeCompare(a.data))[0];
  return { fato: `Curtiu seu post de ${fmt(k.data)} ("${k.legenda.replace(/\s+/g, ' ').slice(0, 60)}…")${evs.length > 1 ? ` (+${evs.length - 1} curtida(s))` : ''}`, fonte: k.post };
}

function anexar(o) {
  if (!o.rodada || !o.contexto) throw new Error('Passe --rodada X --contexto Y');
  const arq = resolve(o.rodada);
  const rodada = JSON.parse(readFileSync(arq, 'utf8'));
  const ctx = JSON.parse(readFileSync(resolve(o.contexto), 'utf8'));
  let n = 0;
  for (const p of [...(rodada.para_classificar || []), ...(rodada.descartados || [])]) {
    const evs = ctx[normalizarArroba(p['@'])];
    if (!evs) continue;
    const r = resumo(evs);
    Object.assign(p, { engajamento: evs, grupo: 'Seguidores engajados', engajamento_resumo: r.fato, engajamento_post: r.fonte });
    n++;
  }
  rodada.fonte = 'engajamento';
  writeFileSync(arq, JSON.stringify(rodada, null, 2));
  console.log(JSON.stringify({ anexados: n }));
}

const o = args();
try {
  if (o.cmd === 'coletar') await coletar(o);
  else if (o.cmd === 'anexar') anexar(o);
  else if (o.cmd === 'saldo') console.log(await saldoApify());
  else console.log('Comandos: coletar [--teto-usd 1.5] [--sem-curtidas] | anexar --rodada X --contexto Y | saldo');
} catch (e) {
  console.error('ERRO:', e.message);
  process.exit(1);
}
