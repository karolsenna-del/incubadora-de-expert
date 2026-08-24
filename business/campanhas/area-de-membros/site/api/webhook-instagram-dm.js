// Webhook de automacao de Direct do Instagram — responde palavra-gatilho com o link da oferta.
// Pedido da Karol (23/08/2026): "como ManyChat" — manda 1 mensagem automatica de boas-vindas
// com o link, avisa que pode mandar duvida ali, e ela continua manual dali em diante (sem bot
// de conversa, sem qualificacao automatica).
//
// AINDA NAO TESTADO CONTRA A API REAL — construido a partir da documentacao oficial da Meta
// (Instagram Messaging API), nao foi validado com um Direct de verdade ainda. Antes de confiar:
// 1. Gerar META_TOKEN novo com a permissao instagram_manage_messages (nome certo pro nosso caso —
//    nosso setup usa Facebook Login/graph.facebook.com, "instagram_manage_messages" e diferente de
//    "instagram_business_manage_messages", que e so pro outro tipo de login/Instagram Login).
//    Adicionar essa, junto com instagram_content_publish + instagram_manage_contents que ja tem.
// 2. ACHADO IMPORTANTE (pesquisa 23/08): permissao de mensageria normalmente exige "Advanced Access"
//    + App Review da Meta pra funcionar com contas de verdade (nao so a sua propria conta de teste).
//    Sem isso, pode funcionar so em modo Standard/dev (voce mandando Direct pra voce mesma), mas nao
//    pra leads reais. Verificar isso no painel do App antes de contar que vai funcionar com todo mundo.
// 3. Registrar esse webhook no painel do App da Meta (developers.facebook.com > app > Webhooks),
//    campo "messages", apontando pra URL deste endpoint publicado + o INSTAGRAM_WEBHOOK_VERIFY_TOKEN
// 4. Mandar 1 Direct de teste com a palavra-gatilho pra ver se a resposta chega de verdade

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const gatilhos = JSON.parse(readFileSync(join(__dirname, 'data', 'gatilhos-direct.json'), 'utf-8'));

const META_TOKEN = process.env.META_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
const META_BASE = 'https://graph.facebook.com/v21.0';

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
  const resp = await fetch(`${META_BASE}/${IG_USER_ID}/messages`, {
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
