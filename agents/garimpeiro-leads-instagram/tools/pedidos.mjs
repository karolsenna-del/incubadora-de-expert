// Robô dos pedidos de garimpo do painel (botão "Garimpar novos leads" da aba Abordar, Karol 13/11/2026).
// O Agendador do Windows roda `node pedidos.mjs proximo` a cada 15 min. Se há pedido pendente e nenhum rodando:
// marca "rodando", abre o Garimpeiro em modo automático (claude -p) com os termos do pedido e, no fim,
// grava feito/erro + quantos leads novos entraram no painel. Log de cada pedido: rodadas/pedido-{id}.log.
// Uso: node pedidos.mjs proximo | status
import { spawn } from 'child_process';
import { createWriteStream, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(AQUI, '../../..');
const RODADAS = resolve(AQUI, '../rodadas');
const PROJETO = 'pxnbcbhgoewrwyreohki';
const CLAUDE = process.env.CLAUDE_BIN || resolve(process.env.USERPROFILE || process.env.HOME || '', '.local/bin/claude.exe');
const LIMITE_HORAS = 4; // "rodando" há mais que isso = travou

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
const lit = (s) => "'" + String(s).replace(/'/g, "''") + "'";
const contarGarimpo = async () => Number((await sql("select count(*)::int n from crm_leads where origem = 'garimpo_instagram'"))[0].n);

function instrucao(p) {
  return [
    'Você é o Garimpeiro. Leia e adote a persona de agents/garimpeiro-leads-instagram/agents/garimpeiro-leads-instagram.md',
    'e as regras em agents/garimpeiro-leads-instagram/data/garimpeiro-leads-instagram-rules.md.',
    `Execute a task agents/garimpeiro-leads-instagram/tasks/rodada-garimpo.md para o cliente karol, com estes termos (escolhidos pela Karol no painel): ${p.termos.join('; ')}.`,
    `Entregue no máximo ${p.quantidade} leads: mire ~3x isso em candidatos e no passo 6 rode o enviar com --max ${p.quantidade}.`,
    'Você está rodando SOZINHO, pedido pelo botão do painel: ninguém vai responder. Não faça perguntas nem espere confirmação.',
    'Use o caminho padrão (busca na web + Apify). Pule a calibração e a fase logada (reserva). Se algo travar, entregue o que tiver pronto.',
    'Não faça commit, push nem deploy. Não mexa fora da pasta agents/garimpeiro-leads-instagram, exceto o que o enviar grava.',
    'Faça o passo 8 (Mission Log e playbook do Garimpeiro).',
    'Na ÚLTIMA linha da resposta escreva exatamente: RESULTADO: <relatório da rodada em uma linha, curto, em português>'
  ].join('\n');
}

function rodarClaude(p, log) {
  return new Promise((ok) => {
    const args = ['-p', instrucao(p), '--permission-mode', 'acceptEdits',
      '--allowedTools', 'Bash(node:*)', 'WebSearch', 'WebFetch', 'Read', 'Write', 'Edit', 'Glob', 'Grep'];
    const filho = spawn(CLAUDE, args, { cwd: REPO, windowsHide: true, env: process.env });
    let saida = '';
    filho.stdout.on('data', (d) => { saida += d; log.write(d); });
    filho.stderr.on('data', (d) => log.write(d));
    const morte = setTimeout(() => filho.kill(), LIMITE_HORAS * 3600 * 1000 - 600000);
    filho.on('error', (e) => { clearTimeout(morte); log.write('\nERRO ao abrir o Claude: ' + e.message + '\n'); ok({ codigo: -1, saida }); });
    filho.on('close', (codigo) => { clearTimeout(morte); ok({ codigo, saida }); });
  });
}

async function proximo() {
  // Destrava pedido "rodando" esquecido (computador desligou no meio, por exemplo).
  await sql(`update garimpo_pedidos set status = 'erro', concluido_em = now(), resumo = 'Parou no meio (computador desligou ou travou). Peça de novo.'
             where status = 'rodando' and iniciado_em < now() - interval '${LIMITE_HORAS} hours'`);
  if ((await sql("select 1 from garimpo_pedidos where status = 'rodando' limit 1")).length) return console.log('já tem garimpo rodando');
  const [p] = await sql(`update garimpo_pedidos set status = 'rodando', iniciado_em = now()
    where id = (select id from garimpo_pedidos where status = 'pendente' order by criado_em limit 1) and status = 'pendente'
    returning id, termos, quantidade`);
  if (!p) return console.log('nenhum pedido');

  mkdirSync(RODADAS, { recursive: true });
  const log = createWriteStream(resolve(RODADAS, `pedido-${p.id}.log`), { flags: 'a' });
  log.write(`Pedido ${p.id} · ${new Date().toISOString()} · ${p.termos.join(', ')} · max ${p.quantidade}\n\n`);
  console.log(`pedido ${p.id}: garimpando`);
  let antes = null;
  try { antes = await contarGarimpo(); } catch (e) { log.write('contagem inicial falhou: ' + e.message + '\n'); }

  const { codigo, saida } = await rodarClaude(p, log);
  const linha = (saida.match(/RESULTADO:\s*(.+)\s*$/m) || [])[1];
  let novos = null;
  try { if (antes != null) novos = (await contarGarimpo()) - antes; } catch (e) { log.write('contagem final falhou: ' + e.message + '\n'); }
  const feito = codigo === 0 && !!linha;
  const resumo = (linha || (codigo === 0 ? 'Terminou sem relatório.' : `O Garimpeiro parou (código ${codigo}). Detalhe em rodadas/pedido-${p.id}.log.`)).slice(0, 500);
  await sql(`update garimpo_pedidos set status = ${lit(feito ? 'feito' : 'erro')}, concluido_em = now(),
             novos = ${novos == null ? 'null' : Number(novos)}, resumo = ${lit(resumo)} where id = ${Number(p.id)}`);
  log.end(`\nFim: ${feito ? 'feito' : 'erro'} · novos ${novos} · ${resumo}\n`);
  console.log(`pedido ${p.id}: ${feito ? 'feito' : 'erro'} · novos ${novos}`);
}

const cmd = process.argv[2];
try {
  if (cmd === 'proximo') await proximo();
  else if (cmd === 'status') console.table(await sql('select id, criado_em, status, quantidade, novos, left(resumo, 80) resumo from garimpo_pedidos order by criado_em desc limit 5'));
  else console.log('Comandos: proximo | status');
} catch (e) {
  console.error('ERRO:', e.message);
  process.exit(1);
}
