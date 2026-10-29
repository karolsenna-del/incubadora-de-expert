#!/usr/bin/env node
/**
 * Freio "trabalhar até o fim" (Stop do Claude Code, 2.8.4).
 *
 * Confere a última resposta da IA antes de ela chegar ao aluno. Se a resposta termina pedindo licença
 * para um passo de rotina ("quer que eu...?", "posso seguir?") ou manda o aluno rodar um comando que
 * ele não pediu para rodar sozinho, devolve a vez à IA uma única vez, para ela fazer e responder de novo.
 *
 * Até a 2.8.3 era um gancho de IA (`type: "prompt"`). Quando ele segurava uma resposta, o Claude Code
 * mostrava ao aluno o texto inteiro das instruções ("Stop hook feedback: [Você confere a última
 * resposta...]"), e não há como esconder. Gancho de comando mostra só o comando e o motivo curto abaixo.
 *
 * Libera: o que é do aluno (senha, código, pagamento, apagar, mensagem a outra pessoa, publicar,
 * GitHub), "Decide: A ou B?", passo a passo que o aluno pediu e relatório de IA da equipe.
 * Qualquer falha sai em silêncio com código 0: o freio nunca trava a conversa.
 */

'use strict';

const fs = require('node:fs');

const MOTIVO = 'Auroq: faça você mesmo o que a resposta deixava para o aluno e responda de novo, curto. Não comente esta conferência.';
const LER_DO_FIM = 512 * 1024;

const PEDE_LICENCA = [
  /\b(?:quer|queres|deseja|gostaria)\s+que\s+eu\b[^?\n]{0,160}\?/i,
  /\bposso\s+(?:seguir|continuar|prosseguir|come[cç]ar|fazer|rodar|executar|criar|ajustar|aplicar|corrigir|instalar|configurar|montar|gerar|atualizar|salvar)\b[^?\n]{0,160}\?/i,
  /\b(?:sigo|continuo|prossigo|fa[cç]o|aplico|rodo)\s*\?/i,
  /\bse\s+(?:voc[eê]\s+)?quiser,?\s+(?:eu\s+)?(?:posso|fa[cç]o|j[aá]\s+fa[cç]o)\b/i,
  /\bme\s+(?:avise|avisa|diga|diz|fala)\s+(?:se|quando)\s+(?:quiser|puder|posso)\b/i,
];
const MANDA_RODAR = /\b(?:rode|roda|execute|executa|cole|cola|digite|digita)\b[^.\n]{0,80}\b(?:comando|terminal|powershell|prompt de comando)\b/i;
const DO_ALUNO = /\b(?:senha|c[oó]digo|captcha|biometria|2fa|pagamento|pagar|cart[aã]o|compra|comprar|apagar|excluir|deletar|remover|mensagem|enviar\s+para|mandar\s+para|publicar|publica[cç][aã]o|no\s+ar|github|push|entregar|entregue|decide:)/i;
const ALUNO_PEDIU_PASSO = /\b(?:eu\s+mesm[oa]|sozinh[oa]|me\s+ensin|passo\s+a\s+passo|como\s+(?:eu\s+)?fa[cç]o|me\s+explic|quero\s+aprender)/i;

function lerEntrada() {
  try { return JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return {}; }
}

function textoDe(conteudo) {
  if (typeof conteudo === 'string') return conteudo;
  if (!Array.isArray(conteudo)) return '';
  return conteudo.filter(p => p && p.type === 'text').map(p => p.text || '').join('\n');
}

// Lê do transcript a última resposta da IA, o último pedido do aluno e se a conversa é de equipe.
function lerConversa(caminho) {
  const r = { resposta: '', pedido: '', equipe: false };
  if (!caminho) return r;
  let bruto;
  try {
    const fd = fs.openSync(caminho, 'r');
    try {
      const tam = fs.fstatSync(fd).size;
      const inicio = Math.max(0, tam - LER_DO_FIM);
      const buf = Buffer.alloc(tam - inicio);
      fs.readSync(fd, buf, 0, buf.length, inicio);
      bruto = buf.toString('utf8');
      const cabeca = Buffer.alloc(Math.min(tam, 64 * 1024));
      fs.readSync(fd, cabeca, 0, cabeca.length, 0);
      r.equipe = cabeca.toString('utf8').includes('BRIEFING DA EQUIPE');
    } finally { fs.closeSync(fd); }
  } catch { return r; }
  for (const linha of bruto.split('\n')) {
    let ev;
    try { ev = JSON.parse(linha); } catch { continue; }
    const msg = ev && ev.message;
    if (!msg || ev.isMeta) continue;
    const texto = textoDe(msg.content).trim();
    if (!texto) continue;
    if (ev.type === 'assistant') r.resposta = texto;
    else if (ev.type === 'user' && !texto.startsWith('<')) r.pedido = texto;
  }
  return r;
}

function deveSegurar(resposta, pedido) {
  if (!resposta) return false;
  // Só o fim da resposta importa: a pergunta de licença costuma fechar a mensagem.
  const fim = resposta.split(/\n\s*\n/).slice(-2).join('\n');
  if (DO_ALUNO.test(fim)) return false;
  if (PEDE_LICENCA.some(re => re.test(fim))) return true;
  if (MANDA_RODAR.test(resposta) && /```/.test(resposta) && !ALUNO_PEDIU_PASSO.test(pedido)) return true;
  return false;
}

function main() {
  const entrada = lerEntrada();
  if (entrada.stop_hook_active) return;
  const conversa = lerConversa(entrada.transcript_path);
  if (conversa.equipe) return;
  const resposta = String(entrada.last_assistant_message || conversa.resposta || '');
  if (!deveSegurar(resposta, conversa.pedido)) return;
  process.stdout.write(JSON.stringify({ decision: 'block', reason: MOTIVO }));
}

if (require.main === module) {
  try { main(); } catch { /* nunca trava a conversa */ }
  process.exit(0);
}

module.exports = { deveSegurar };
