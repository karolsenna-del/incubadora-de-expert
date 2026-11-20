// Garimpo diário dos seguidores da Karol (decisão 19/11/2026: caminho A, só no crédito grátis do Apify).
// O Agendador do Windows roda `node seguidores-diario.mjs` 1x por dia. Ele:
//   1. confere se sobra crédito grátis no Apify (deixa RESERVA_USD pro garimpo normal e pro de quem engajou);
//   2. lê a próxima página da lista de seguidores pela conta auxiliar (logado.mjs seguidores, ~50 por dia,
//      continua de onde parou; conta privada já sai);
//   3. abre o Garimpeiro em modo automático (claude -p) pra qualificar, escrever a mensagem e mandar pro painel.
// No painel o lead entra como "Novo", Grupo "Seguidor sem interação", e conta como abordagem QUENTE.
// Log: rodadas/seguidores-diario.log (resumo) e rodadas/seguidores-{data}.log (detalhe).
// Uso: node seguidores-diario.mjs [--forcar]   (--forcar roda de novo no mesmo dia)
import { spawn, execSync, execFileSync } from 'child_process';
import { appendFileSync, createWriteStream, existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve, relative } from 'path';
import { fileURLToPath } from 'url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(AQUI, '../../..');
const RODADAS = resolve(AQUI, '../rodadas');
const PROJETO = 'pxnbcbhgoewrwyreohki';
const CLAUDE = process.env.CLAUDE_BIN || resolve(process.env.USERPROFILE || process.env.HOME || '', '.local/bin/claude.exe');
const TETO_SEGUIDORES = 50;     // 1 página da lista ≈ 50 seguidores ≈ 20-25 contas abertas
const CREDITO_GRATIS_USD = 5;
const RESERVA_USD = 1.5;        // fica pro garimpo do botão e pro de quem engajou
const LIMITE_HORAS = 3;

const hoje = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Cuiaba' });
const resumoLog = resolve(RODADAS, 'seguidores-diario.log');
const marca = resolve(RODADAS, 'seguidores-diario-estado.json');
const anotar = (t) => { mkdirSync(RODADAS, { recursive: true }); appendFileSync(resumoLog, `${new Date().toISOString()} · ${t}\n`); console.log(t); };

async function sql(query) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) throw new Error('SUPABASE_ACCESS_TOKEN ausente');
  const r = await fetch(`https://api.supabase.com/v1/projects/${PROJETO}/database/query`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query })
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`banco (${r.status}): ${t.slice(0, 300)}`);
  return JSON.parse(t);
}
const contarSeguidores = async () => Number((await sql("select count(*)::int n from crm_leads where origem = 'garimpo_instagram' and garimpo->>'Grupo' = 'Seguidor sem interação'"))[0].n);

async function creditoUsado() {
  const token = process.env.APIFY_TOKEN || execSync('op read "op://Claude/Apify/credential"', { encoding: 'utf8' }).trim();
  const r = await fetch('https://api.apify.com/v2/users/me/limits', { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`Apify respondeu ${r.status}`);
  return (await r.json()).data.current.monthlyUsageUsd;
}

function instrucao(candidatos) {
  return [
    'Você é o Garimpeiro. Leia e adote a persona de agents/garimpeiro-leads-instagram/agents/garimpeiro-leads-instagram.md',
    'e as regras em agents/garimpeiro-leads-instagram/data/garimpeiro-leads-instagram-rules.md.',
    'Execute a task agents/garimpeiro-leads-instagram/tasks/rodada-garimpo.md para o cliente karol, no caminho 2b (seguidores da Karol).',
    `A lista de seguidores de hoje JÁ FOI LIDA: os candidatos estão em ${candidatos}. Não rode o logado.mjs seguidores de novo e pule a fase 1 de busca.`,
    'Siga os passos 3–4 pelo Apify (garimpo.mjs coletar --fonte apify, peneira da bio, garimpo.mjs posts), depois 5, 5b e 6 (planilha.mjs enviar).',
    'Em cada item aprovado, grave "grupo": "Seguidor sem interação". A copy pode dizer que a pessoa acompanha o perfil da Karol, nunca desde quando.',
    'Você está rodando SOZINHO, pelo agendador diário: ninguém vai responder. Não faça perguntas nem espere confirmação.',
    'Pule a calibração e a fase logada (reserva). Se algo travar, entregue o que tiver pronto.',
    'Não faça commit, push nem deploy. Não mexa fora da pasta agents/garimpeiro-leads-instagram, exceto o que o enviar grava.',
    'Faça o passo 8 (Mission Log e playbook do Garimpeiro).',
    'Na ÚLTIMA linha da resposta escreva exatamente: RESULTADO: <relatório da rodada em uma linha, curto, em português>'
  ].join('\n');
}

function rodarClaude(texto, log) {
  return new Promise((ok) => {
    const args = ['-p', texto, '--permission-mode', 'acceptEdits',
      '--allowedTools', 'Bash(node:*)', 'Read', 'Write', 'Edit', 'Glob', 'Grep'];
    const filho = spawn(CLAUDE, args, { cwd: REPO, windowsHide: true, env: process.env });
    let saida = '';
    filho.stdout.on('data', (d) => { saida += d; log.write(d); });
    filho.stderr.on('data', (d) => log.write(d));
    const morte = setTimeout(() => filho.kill(), LIMITE_HORAS * 3600 * 1000);
    filho.on('error', (e) => { clearTimeout(morte); log.write('\nERRO ao abrir o Claude: ' + e.message + '\n'); ok({ codigo: -1, saida }); });
    filho.on('close', (codigo) => { clearTimeout(morte); ok({ codigo, saida }); });
  });
}

async function main() {
  const estado = existsSync(marca) ? JSON.parse(readFileSync(marca, 'utf8')) : {};
  if (estado.dia === hoje && !process.argv.includes('--forcar')) return console.log('já rodou hoje');

  if ((await sql("select 1 from garimpo_pedidos where status = 'rodando' limit 1")).length) return anotar('pulei: garimpo do botão rodando (tenta na próxima)');
  const usado = await creditoUsado();
  if (usado > CREDITO_GRATIS_USD - RESERVA_USD) {
    writeFileSync(marca, JSON.stringify({ dia: hoje, resultado: 'sem crédito' }));
    return anotar(`pulei: crédito grátis do Apify no fim (US$${usado.toFixed(2)} de ${CREDITO_GRATIS_USD}); volta quando o ciclo renovar`);
  }

  // 1 página da lista de seguidores (conta auxiliar, janela do Chrome abre e fecha sozinha)
  const saidaLista = execFileSync(process.execPath, [resolve(AQUI, 'logado.mjs'), 'seguidores', '--perfil', 'karol', '--teto', String(TETO_SEGUIDORES)], { cwd: REPO, encoding: 'utf8', timeout: 15 * 60 * 1000 });
  const linhaJson = saidaLista.trim().split('\n').reverse().find((l) => l.trim().startsWith('{'));
  const lista = linhaJson ? JSON.parse(linhaJson) : {};
  if (lista.fim && !lista.candidatos) { writeFileSync(marca, JSON.stringify({ dia: hoje, resultado: 'lista no fim' })); return anotar('lista de seguidores inteira já lida'); }
  if (!lista.candidatos) throw new Error('a leitura da lista não devolveu candidatos: ' + saidaLista.slice(-300));
  const abertos = (lista.lidos_agora || 0) - (lista.privados || 0);
  if (lista.parada) anotar('aviso da lista: ' + lista.parada);
  if (abertos <= 0) { writeFileSync(marca, JSON.stringify({ dia: hoje, resultado: '0 abertos' })); return anotar(`li ${lista.lidos_agora || 0} seguidores, nenhuma conta aberta`); }

  const log = createWriteStream(resolve(RODADAS, `seguidores-${hoje}.log`), { flags: 'a' });
  const antes = await contarSeguidores();
  const { codigo, saida } = await rodarClaude(instrucao(relative(REPO, lista.candidatos).replace(/\\/g, '/')), log);
  log.end();
  const linha = (saida.match(/RESULTADO:\s*(.+)\s*$/m) || [])[1] || `Garimpeiro terminou com código ${codigo}, sem relatório`;
  const novos = (await contarSeguidores()) - antes;
  writeFileSync(marca, JSON.stringify({ dia: hoje, resultado: linha, novos }));
  anotar(`lidos ${lista.lidos_agora} (${abertos} abertos, total ${lista.lidos_total}) · ${novos} na fila · ${linha}`);
}

try { await main(); } catch (e) { anotar('ERRO: ' + e.message); process.exit(1); }
