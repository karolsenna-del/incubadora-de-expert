// Webhook de automacao de Direct do Instagram — responde palavra-gatilho com o link da oferta.
// Pedido da Karol (23/08/2026): "como ManyChat" — manda 1 mensagem automatica de boas-vindas
// com o link, avisa que pode mandar duvida ali, e ela continua manual dali em diante (sem bot
// de conversa, sem qualificacao automatica).
//
// ATUALIZADO 24/08/2026 — achado real durante a configuracao: mensageria do Instagram vive
// numa "app" e API totalmente separada (Login do Instagram, base graph.instagram.com), com seu
// proprio App ID (3074711462723810, distinto do META_APP_ID usado pra publicar) e seu proprio
// token (IG_MESSAGING_TOKEN, ver vault). NAO usa o META_TOKEN nem graph.facebook.com — eram os
// nomes certos, so o sistema de auth que estava errado (Facebook Login classico nao aceita
// escopo instagram_business_manage_messages, so o fluxo de Login do Instagram aceita).
//
// AINDA NAO TESTADO CONTRA A API REAL — token gerado em 24/08 (Acesso Padrao, tester
// karolsenna._), mas o envio de mensagem em si ainda nao foi exercitado. Antes de confiar:
// 1. Registrar esse webhook no painel do App (Casos de Uso > API do Instagram > secao "3.
//    Configurar webhooks"), campo "messages", com a URL deste endpoint publicado +
//    INSTAGRAM_WEBHOOK_VERIFY_TOKEN
// 2. Mandar 1 Direct de teste (da propria Karol, ela e tester) com a palavra-gatilho
// 3. Pra funcionar com leads de verdade (nao so a propria Karol): ainda depende da analise do
//    app (App Review) ser aprovada pela Meta — enviada em 24/08, aguardando

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gatilhos = JSON.parse(readFileSync(join(__dirname, 'data', 'gatilhos-direct.json'), 'utf-8'));

const IG_TOKEN = process.env.IG_MESSAGING_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
const IG_BASE = 'https://graph.instagram.com/v21.0';

function normalizar(texto) {
  return (texto || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toUpperCase()
    .trim();
}

// Monta um mapa palavra normalizada -> {link, nome_oferta} a partir do gatilhos-direct.json
function montarMapaPalavras() {
  const mapa = {};
  for (const [slug, dados] of Object.entries(gatilhos)) {
    if (slug.startsWith('_')) continue;
    mapa[normalizar(dados.palavra)] = { slug, ...dados };
  }
  return mapa;
}

async function enviarMensagem(destinatarioId, texto) {
  const resp = await fetch(`${IG_BASE}/${IG_USER_ID}/messages?access_token=${encodeURIComponent(IG_TOKEN)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: destinatarioId },
      message: { text: texto }
    })
  });
  const data = await resp.json();
  if (!resp.ok || data.error) {
    throw new Error(`send message falhou: ${JSON.stringify(data)}`);
  }
  return data;
}

function montarMensagemBoasVindas(nomeOferta, link) {
  return `Oi! Segue o link de ${nomeOferta}: ${link}\n\nQualquer dúvida, é só mandar aqui que eu te respondo.`;
}

export default async function handler(req, res) {
  // Verificacao do webhook (Meta manda GET na hora de registrar/confirmar o endpoint)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
      return;
    }
    res.status(403).send('Verificacao falhou');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const payload = req.body || {};
  console.log('[webhook-instagram-dm] payload recebido:', JSON.stringify(payload));

  try {
    const entradas = payload.entry || [];
    const mapaPalavras = montarMapaPalavras();

    for (const entrada of entradas) {
      const mensagens = entrada.messaging || [];
      for (const evento of mensagens) {
        // Ignora eco de mensagem que a propria conta mandou (evita loop respondendo a si mesma)
        if (evento.message && evento.message.is_echo) continue;

        const remetenteId = evento.sender && evento.sender.id;
        const textoRecebido = evento.message && evento.message.text;
        if (!remetenteId || !textoRecebido) continue;

        const textoNormalizado = normalizar(textoRecebido);
        const match = mapaPalavras[textoNormalizado];

        if (!match) {
          console.log(`[webhook-instagram-dm] sem match pra "${textoRecebido}" — ignorado, sem resposta automatica`);
          continue;
        }

        const mensagem = montarMensagemBoasVindas(match.nome_oferta, match.link);
        await enviarMensagem(remetenteId, mensagem);
        console.log(`[webhook-instagram-dm] respondido: ${remetenteId} -> ${match.slug} (palavra "${textoRecebido}")`);
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[webhook-instagram-dm] erro:', err.message);
    res.status(200).json({ ok: false, erro: err.message }); // 200 pra Meta nao ficar re-tentando em loop; erro fica so no log
  }
}
