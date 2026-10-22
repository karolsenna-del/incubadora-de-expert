#!/usr/bin/env node
/**
 * Gancho da compactação do Claude Code (2.7.0).
 *
 * Quando a conversa enche, o Claude Code resume e "compacta" o histórico. O resumo perde detalhe e a
 * IA costuma esquecer o que estava fazendo e as regras de fechamento. Este gancho roda em dois momentos:
 *
 * - PreCompact: lê o fim da conversa (arquivo `transcript_path` que o Claude Code entrega) e grava em
 *   `.auroq/compactacao/ultima.md` os últimos pedidos do aluno, os arquivos mexidos e a última resposta.
 *   Fica só no computador do aluno (`.auroq/` não vai para o GitHub) e passa pelo mesmo filtro de
 *   senhas e chaves do registro de conversas.
 * - SessionStart com origem "compact" (logo depois do resumo): devolve à IA um lembrete curto com esse
 *   retrato e as regras que mais escapam em conversa longa.
 *
 * Nunca bloqueia a compactação nem a conversa: qualquer falha sai em silêncio com código 0.
 * Até a 2.6.10 este arquivo carregava um executor de `.auroq-core/hooks/unified/` que não
 * existe no pacote, e só exportava uma função que ninguém chamava: não salvava nada.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..', '..');
const PASTA = path.join(RAIZ, '.auroq', 'compactacao');
const ARQUIVO = path.join(PASTA, 'ultima.md');
const LER_DO_FIM = 4 * 1024 * 1024; // conversa grande: só o fim interessa
const VALE_POR_MS = 2 * 60 * 60 * 1000; // retrato com mais de 2 h não volta para a conversa
const MAX_PEDIDOS = 6;
const MAX_ARQUIVOS = 15;

let limpar = s => String(s);
try {
  const { scrub } = require('./ahi/security.cjs');
  limpar = s => String(scrub(String(s)).value);
} catch { /* sem o filtro do registro de conversas: o texto passa pelo corte abaixo */ }

function cortar(texto, max) {
  const t = String(texto || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

function lerEntrada() {
  try {
    const bruto = fs.readFileSync(0, 'utf8');
    const dados = JSON.parse(bruto.replace(/^﻿/, ''));
    return dados && typeof dados === 'object' ? dados : {};
  } catch { return {}; }
}

function fimDoArquivo(arquivo) {
  const fd = fs.openSync(arquivo, 'r');
  try {
    const { size } = fs.fstatSync(fd);
    const inicio = Math.max(0, size - LER_DO_FIM);
    const buf = Buffer.alloc(size - inicio);
    fs.readSync(fd, buf, 0, buf.length, inicio);
    const linhas = buf.toString('utf8').split('\n');
    if (inicio > 0) linhas.shift(); // primeira linha pode ter vindo cortada
    return linhas;
  } finally { fs.closeSync(fd); }
}

const textoDe = conteudo => (typeof conteudo === 'string'
  ? conteudo
  : (Array.isArray(conteudo) ? conteudo.filter(p => p && p.type === 'text').map(p => p.text || '').join('\n') : ''));

// /tmp e /private/tmp (Mac), atalhos e letras de unidade: compara o caminho de verdade dos dois lados.
// Arquivo que já não existe: resolve a pasta mais próxima que existe e junta o resto.
function real(p) {
  let base = path.resolve(p);
  const resto = [];
  for (;;) {
    try { return path.join(fs.realpathSync.native(base), ...resto); } catch { /* sobe uma pasta */ }
    const acima = path.dirname(base);
    if (acima === base) return path.resolve(p);
    resto.unshift(path.basename(base));
    base = acima;
  }
}

function relativo(arquivo) {
  const abs = real(path.resolve(RAIZ, String(arquivo)));
  const rel = path.relative(real(RAIZ), abs);
  return (rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel : abs).split(path.sep).join('/');
}

function retrato(transcript) {
  const pedidos = [];
  const arquivos = [];
  let ultimaResposta = '';
  for (const linha of fimDoArquivo(transcript)) {
    if (!linha.trim()) continue;
    let ev;
    try { ev = JSON.parse(linha); } catch { continue; }
    const msg = ev && ev.message;
    if (!msg || ev.isMeta || ev.isSidechain) continue;
    if (ev.type === 'user' && msg.role === 'user') {
      const texto = textoDe(msg.content).trim();
      // Resultado de ferramenta, lembrete do sistema e comando com marcação não são pedido do aluno.
      if (texto && !texto.startsWith('<')) pedidos.push(texto);
    } else if (ev.type === 'assistant' && Array.isArray(msg.content)) {
      for (const parte of msg.content) {
        if (parte && parte.type === 'text' && String(parte.text || '').trim()) ultimaResposta = parte.text;
        const alvo = parte && parte.type === 'tool_use' && parte.input && (parte.input.file_path || parte.input.notebook_path);
        if (alvo && /^(Edit|MultiEdit|Write|NotebookEdit)$/.test(String(parte.name))) {
          const rel = relativo(alvo);
          const i = arquivos.indexOf(rel);
          if (i >= 0) arquivos.splice(i, 1);
          arquivos.push(rel);
        }
      }
    }
  }
  return {
    pedidos: pedidos.slice(-MAX_PEDIDOS).map(p => cortar(limpar(p), 400)),
    arquivos: arquivos.slice(-MAX_ARQUIVOS).map(a => cortar(a, 200)), // caminho não passa no filtro: ele apaga nome longo
    ultimaResposta: cortar(limpar(ultimaResposta), 700),
  };
}

function antesDeCompactar(entrada) {
  const transcript = entrada.transcript_path;
  if (!transcript || !fs.existsSync(transcript)) return;
  const r = retrato(transcript);
  const quando = new Date().toISOString();
  const md = [
    '# Antes da última compactação',
    '',
    `- Quando: ${quando}`,
    `- Conversa: ${cortar(entrada.session_id || '?', 80)} (${entrada.trigger === 'manual' ? 'compactação pedida' : 'compactação automática'})`,
    '',
    '## Últimos pedidos do aluno (do mais antigo ao mais novo)',
    '',
    ...(r.pedidos.length ? r.pedidos.map(p => `- ${p}`) : ['- (nenhum pedido em texto no fim da conversa)']),
    '',
    '## Arquivos mexidos',
    '',
    ...(r.arquivos.length ? r.arquivos.map(a => `- \`${a}\``) : ['- (nenhum)']),
    '',
    '## Última resposta da IA',
    '',
    r.ultimaResposta || '(sem texto)',
    '',
  ].join('\n');
  fs.mkdirSync(PASTA, { recursive: true });
  const tmp = `${ARQUIVO}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, md, { mode: 0o600 });
  fs.renameSync(tmp, ARQUIVO);
}

function depoisDeCompactar() {
  let st;
  try { st = fs.statSync(ARQUIVO); } catch { return; }
  if (Date.now() - st.mtimeMs > VALE_POR_MS) return;
  const md = fs.readFileSync(ARQUIVO, 'utf8');
  const secao = nome => {
    const m = md.split(`## ${nome}`)[1];
    return m ? m.split('\n## ')[0].trim() : '';
  };
  const ultimoPedido = (secao('Últimos pedidos do aluno (do mais antigo ao mais novo)').split('\n').filter(l => l.startsWith('- ')).pop() || '').slice(2);
  const arquivos = secao('Arquivos mexidos').split('\n').filter(l => l.startsWith('- `')).map(l => l.slice(2)).slice(-8);
  const contexto = [
    'A conversa acabou de ser compactada. O retrato de antes do resumo está em `.auroq/compactacao/ultima.md` (leia se precisar do detalhe).',
    ultimoPedido ? `Último pedido do aluno: ${ultimoPedido}` : '',
    arquivos.length ? `Arquivos mexidos: ${arquivos.join(', ')}` : '',
    'Antes de seguir: se uma tarefa já terminou e a memória não foi salva (`agents/companion/data/contexto-dinamico.md` e `log-decisoes.md`), salve agora.',
    'Continua valendo: fechar a resposta que fez trabalho com **Resumo:** e **Onde parou:**; as travas do AGENTS.md (dinheiro, mensagem ou post para outra pessoa, apagar, force push, senha) só com ordem do aluno para aquela ação.',
  ].filter(Boolean).join('\n');
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: contexto } }));
}

function principal() {
  const entrada = lerEntrada();
  const evento = String(entrada.hook_event_name || '');
  if (evento === 'PreCompact') antesDeCompactar(entrada);
  else if (evento === 'SessionStart' && entrada.source === 'compact') depoisDeCompactar();
}

try { principal(); } catch { /* nunca atrapalha a conversa */ }
process.exitCode = 0;
