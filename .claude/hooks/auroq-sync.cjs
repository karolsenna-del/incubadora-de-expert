#!/usr/bin/env node
'use strict';
/**
 * Auroq OS — Sync Hook
 *
 *   --session-start  (SessionStart)      checa o GitHub ao abrir; PUXA se for seguro; relata o que chegou
 *   --remind         (UserPromptSubmit)  lembra, com moderacao, de trabalho nao entregue
 *
 * Regras de ouro:
 * - Nunca bloqueia a sessao (sempre exit 0) e fica em silencio quando nao ha o que dizer.
 * - So PUXA quando nao ha trabalho local em risco (working tree limpo, nada por enviar).
 * - NUNCA entrega (commit/push) sozinho — entregar e decisao do expert.
 * - Estado fica fora do repositorio (tmpdir) — nunca suja o git do aluno.
 * - Cross-platform (Mac/Windows/Linux): git via execFileSync, sem shell.
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const MODE = process.argv[2] || '--session-start';
const CWD = process.cwd();
const STATE_FILE = path.join(os.tmpdir(), 'auroq-sync', crypto.createHash('md5').update(CWD).digest('hex') + '.json');
const REMIND_AFTER_MS = 30 * 60 * 1000; // lembra quando ha trabalho nao entregue ha 30 min
const REMIND_EVERY_MS = 30 * 60 * 1000; // e no maximo 1 vez a cada 30 min

function git(args, timeout) {
  return execFileSync('git', args, { cwd: CWD, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: timeout || 5000 }).trim();
}
function tryGit(args, timeout) { try { return git(args, timeout); } catch { return null; } }

function emit(eventName, text) {
  if (!text) return;
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: eventName, additionalContext: text } }));
}

function readState() { try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return {}; } }
function writeState(s) { try { fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true }); fs.writeFileSync(STATE_FILE, JSON.stringify(s)); } catch { /* silencioso */ } }

function isRepo() { return fs.existsSync(path.join(CWD, '.git')) && tryGit(['rev-parse', '--is-inside-work-tree']) === 'true'; }
function hasRemote() { const r = tryGit(['remote']); return !!(r && r.length); }
function dirtyFiles() { const out = tryGit(['status', '--porcelain']); return out ? out.split('\n').filter(Boolean) : []; }
function upstream() { return tryGit(['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']); }
function countRange(range) { const n = tryGit(['rev-list', '--count', range]); return n === null ? 0 : (parseInt(n, 10) || 0); }
function describeCommits(range, limit) {
  const out = tryGit(['log', '--no-merges', '--format=%an|%s', range, `-${limit || 8}`]) || '';
  return out.split('\n').filter(Boolean).map(l => { const i = l.indexOf('|'); return `- ${l.slice(0, i)}: ${l.slice(i + 1)}`; });
}

// ─── Aviso de versao nova (1x por dia) ───────────────────
const VERSION_CHECK_EVERY_MS = 24 * 60 * 60 * 1000;
// Consulta que falhou (sem internet, npm fora): tenta de novo em 1 h, nao em 24 h. Antes a
// checagem era marcada ANTES de consultar e uma falha deixava o aluno 24 h sem aviso.
const VERSION_RETRY_AFTER_FAIL_MS = 60 * 60 * 1000;

function localVersion() {
  try {
    const y = fs.readFileSync(path.join(CWD, '.auroq-core', 'core-config.yaml'), 'utf8');
    const m = y.match(/^\s*version:\s*["']?(\d+\.\d+\.\d+)/m);
    return m ? m[1] : null;
  } catch { return null; }
}
function npmLatest() {
  try {
    const out = execFileSync('npm', ['view', 'auroq-os', 'version'], {
      encoding: 'utf8', timeout: 8000, stdio: ['ignore', 'pipe', 'ignore'],
      shell: process.platform === 'win32',
    });
    const v = String(out).trim();
    return /^\d+\.\d+\.\d+$/.test(v) ? v : null;
  } catch { return null; }
}
function cmpVer(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) { if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0); }
  return 0;
}
function versionNotice() {
  const local = localVersion();
  if (!local) return null; // pasta sem Auroq OS instalado
  const st = readState();
  const now = Date.now();
  if (st.lastVersionCheck && now - st.lastVersionCheck < VERSION_CHECK_EVERY_MS) return null;
  if (st.lastVersionFail && now - st.lastVersionFail < VERSION_RETRY_AFTER_FAIL_MS) return null;
  const latest = npmLatest();
  if (!latest) {
    st.lastVersionFail = now; // offline nao vira insistencia, mas tambem nao cala 24 h
    writeState(st);
    return null;
  }
  st.lastVersionCheck = now; // so marca as 24 h depois de o npm responder
  st.lastVersionFail = 0;
  writeState(st);
  if (cmpVer(latest, local) <= 0) return null;
  return `[Auroq update] Saiu versao nova do sistema: v${local} instalada → v${latest} disponivel. Na sua primeira resposta, avise o expert em 1 frase simples e pergunte: "Quer que eu atualize agora? Leva uns 5 minutos e voce nao precisa fazer nada." Se ele disser sim: a atualizacao e feita pelo Ops, sem o expert abrir terminal — chame a tool forja_bundle (MCP arcane) com forge_id "ops" e fase "manutencao" e siga aqueles passos a risca (e o mesmo que ele pedir ao Ops "atualiza o sistema"). Se ele disser nao, nao pergunte de novo nesta conversa.`;
}

function sessionStart() {
  const vNotice = versionNotice();
  if (!isRepo() || !hasRemote()) { emit('SessionStart', vNotice); return; }
  const up = upstream();
  if (!up) { emit('SessionStart', vNotice); return; }
  const dirty = dirtyFiles();
  if (tryGit(['fetch', '--quiet'], 8000) === null) {
    emit('SessionStart', [vNotice, '[Auroq sync] Nao consegui checar o GitHub agora (sem conexao?). O trabalho local esta intacto. So mencione se o expert perguntar de sincronizacao.'].filter(Boolean).join('\n'));
    return;
  }
  const behind = countRange(`HEAD..${up}`);
  const ahead = countRange(`${up}..HEAD`);
  const lines = [];

  if (behind > 0 && dirty.length === 0 && ahead === 0) {
    const before = tryGit(['rev-parse', 'HEAD']);
    if (tryGit(['pull', '--ff-only', '--quiet'], 10000) !== null) {
      lines.push(`[Auroq sync] Puxei ${behind} atualizacao(oes) do GitHub automaticamente ao abrir a sessao. O que chegou:`);
      lines.push(...describeCommits(`${before}..HEAD`));
      lines.push('Informe o expert em 1-3 linhas, em portugues de negocio (traduza as mensagens de commit; cite o autor quando houver colaborador). Se algo tocar no que ele vai fazer agora, aponte.');
    } else {
      lines.push(`[Auroq sync] Ha ${behind} atualizacao(oes) no GitHub que nao consegui puxar sozinho (historico divergiu). Sugira ao expert: "puxa as atualizacoes" — o ritual de sync (rule puxar-e-entregar) resolve com ele.`);
    }
  } else if (behind > 0) {
    lines.push(`[Auroq sync] Ha ${behind} atualizacao(oes) no GitHub, mas NAO puxei: existe trabalho local nao entregue (${dirty.length} arquivo(s) alterado(s)${ahead ? `, ${ahead} commit(s) nao enviado(s)` : ''}). Puxar agora poderia misturar coisa pela metade.`);
    lines.push('Diga ao expert em 1-2 linhas: ha atualizacoes esperando; primeiro "salva e entrega" o que ficou pendente, depois "puxa". Se ele pedir, execute o ritual (rule puxar-e-entregar) sem trocar de agente.');
  } else if (ahead > 0 && dirty.length === 0) {
    lines.push(`[Auroq sync] Em dia com o GitHub, mas ha ${ahead} commit(s) salvo(s) e NAO entregue(s) (push pendente). Ofereca em 1 linha: "quer que eu entregue pro GitHub agora?"`);
  } else if (dirty.length > 0) {
    lines.push(`[Auroq sync] Sem novidades no GitHub, mas ha trabalho local nao entregue de uma sessao anterior (${dirty.length} arquivo(s)). Mencione em 1 linha e siga; quando ele fechar um bloco, ofereca "salva e entrega".`);
  } else {
    lines.push('[Auroq sync] Tudo em dia com o GitHub. Nao precisa mencionar, a menos que o expert pergunte.');
  }

  const st = readState();
  st.dirtySince = dirty.length ? (st.dirtySince || Date.now()) : 0;
  st.lastRemind = 0;
  writeState(st);
  if (vNotice) lines.unshift(vNotice);
  emit('SessionStart', lines.join('\n'));
}

function remind() {
  if (!isRepo()) return;
  const dirty = dirtyFiles();
  const up = upstream();
  const ahead = up ? countRange(`${up}..HEAD`) : 0;
  const st = readState();
  const now = Date.now();
  if (dirty.length === 0 && ahead === 0) {
    if (st.dirtySince) { st.dirtySince = 0; writeState(st); }
    return;
  }
  if (!st.dirtySince) { st.dirtySince = now; writeState(st); return; }
  if (now - st.dirtySince < REMIND_AFTER_MS) return;
  if (st.lastRemind && now - st.lastRemind < REMIND_EVERY_MS) return;
  st.lastRemind = now;
  writeState(st);
  const mins = Math.round((now - st.dirtySince) / 60000);
  emit('UserPromptSubmit', `[Auroq lembrete] Ha trabalho nao entregue ha ~${mins} min (${dirty.length} arquivo(s) alterado(s)${ahead ? `, ${ahead} commit(s) sem push` : ''}). NAO interrompa o raciocinio atual. Ao fechar o bloco em andamento, ofereca em UMA linha: "quer que eu salve e entregue pro GitHub?". Nunca entregue sem o expert pedir.`);
}

let ran = false;
function main() {
  if (ran) return;
  ran = true;
  try { if (MODE === '--remind') remind(); else sessionStart(); }
  catch (e) { console.error(`[auroq-sync] ${e.message}`); }
  process.exit(0);
}

// Consome o JSON que o Claude Code envia no stdin (nao depende dele) e roda no fim;
// fallback por timer garante execucao mesmo se o stdin nao fechar.
process.stdin.resume();
process.stdin.on('data', () => {});
process.stdin.on('end', main);
process.stdin.on('error', main);
setTimeout(main, 400).unref();
