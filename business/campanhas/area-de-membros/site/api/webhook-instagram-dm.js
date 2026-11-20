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
//
// EXTENSAO 07/09/2026 (SOP-022) — pedido da Karol: mesma automacao pra quem COMENTA a
// palavra-gatilho num POST/Reels (nao so quem manda Direct). Adiciona handling do campo de
// webhook "comments" (entry[].changes[], nao entry[].messaging[]) e responde via Private Reply
// (POST /{IG_USER_ID}/messages com recipient.comment_id em vez de recipient.id — mesmo endpoint
// de mensagem, so muda o formato do destinatario). Meta permite 1 unica private reply por
// comentario, pra sempre, dentro de ate 7 dias do comentario — retry/reenvio no mesmo
// comment_id vai falhar (ver troubleshooting no Playbook SOP-022).
// IMPORTANTE — Story "comentada" != Post comentado: resposta a um Story chega como Direct
// normal (campo "messages", ja tratado abaixo), NAO como campo "comments". Este bloco novo so
// cobre comentario publico em post/Reels/carrossel do feed.
// Requer registrar TAMBEM o campo "comments" no webhook do painel do App (alem de "messages",
// ja registrado) — mesma URL de callback, so marcar a caixa extra.

// Dados embutidos direto no arquivo (mesmo padrao do webhook-voomp.js) — a Vercel compila este
// arquivo de ESM pra CommonJS, e import.meta.url (usado antes pra ler o JSON externo em disco)
// nao sobrevive a essa conversao, causava FUNCTION_INVOCATION_FAILED (achado 24/08, 1o deploy).
//
// FONTE DE VERDADE fica em business/campanhas/area-de-membros/site/api/data/gatilhos-direct.json
// (o Expert-Stories le esse arquivo pra saber a palavra certa de cada oferta). Se mudar uma
// palavra ou link la, ATUALIZAR AQUI TAMBEM manualmente — os dois precisam ficar iguais.
const gatilhos = {
  'diagnostico-ferramentas': {
    palavra: 'DIAGNOSTICO',
    nome_oferta: 'Diagnóstico Ferramentas',
    link: 'https://vendas.incubadoradeexpert.com.br/diagnostico-ferramentas/'
  },
  'expert360': {
    palavra: 'METODO',
    nome_oferta: 'Expert360º',
    link: 'https://vendas.incubadoradeexpert.com.br/expert360/'
  },
  'sprint-do-metodo': {
    palavra: 'SPRINT',
    nome_oferta: 'Sprint do Método',
    link: 'https://vendas.incubadoradeexpert.com.br/sprint-do-metodo/'
  },
  'grupo': {
    palavra: 'GRUPO',
    nome_oferta: 'Grupo',
    link: 'https://vendas.incubadoradeexpert.com.br/grupo/'
  },
  'individual': {
    palavra: 'INDIVIDUAL',
    nome_oferta: 'Individual',
    link: 'https://vendas.incubadoradeexpert.com.br/individual/'
  },
  'grupo-lives': {
    palavra: 'LIVE',
    nome_oferta: 'Grupo de Lives (gratuito, ao vivo toda semana)',
    link: 'https://grupo.incubadoradeexpert.com.br/'
  }
};

const IG_TOKEN = process.env.IG_MESSAGING_TOKEN;
const IG_USER_ID = process.env.IG_USER_ID;
const VERIFY_TOKEN = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN;
const IG_BASE = 'https://graph.instagram.com/v21.0';

// EXTENSAO 18/11/2026 — pedido da Karol ("seguro"): TODA pessoa que comentar num post recebe a
// 1a mensagem sozinha, pela Private Reply oficial (1 por comentario, ate 7 dias). Uma vez por
// pessoa: quem ja esta no CRM fora da etapa "novo" (ja abordado, conversando, aluno, descartado)
// nao recebe. Quem recebe entra/move no painel como "abordado". Desligar: trocar pra false.
const ABORDAR_QUEM_COMENTA = true;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function mensagemQuemComentou() {
  return 'Oi! Vi seu comentário no meu post e quis passar aqui pra agradecer.\n\nFiquei curiosa: o que você faz hoje?';
}

async function sb(caminho, opcoes = {}) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${caminho}`, {
    ...opcoes,
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal', ...(opcoes.headers || {}) }
  });
  if (!resp.ok) throw new Error(`supabase ${caminho.split('?')[0]} ${resp.status}: ${await resp.text()}`);
  return resp.status === 204 || resp.headers.get('content-length') === '0' ? null : resp.json().catch(() => null);
}

// Decide se aborda e ja reserva a pessoa no CRM (antes de enviar, pra 2 comentarios seguidos
// nao gerarem 2 mensagens). Devolve uma funcao pra desfazer se o envio falhar.
async function reservarAbordagem(username, textoComentario, mediaId) {
  const insta = String(username).replace(/^@/, '').toLowerCase();
  const achados = await sb(`crm_leads?instagram=ilike.${encodeURIComponent(insta)}&select=id,etapa,garimpo&limit=5`, { method: 'GET', headers: { Prefer: '' } });
  const registro = { 'Abordagem automática': new Date().toISOString().slice(0, 10), 'Comentário': String(textoComentario).slice(0, 300), 'Post do comentário (id)': mediaId || '' };
  if (achados && achados.length) {
    const lead = achados[0];
    if (lead.etapa !== 'novo' || (lead.garimpo && lead.garimpo['Abordagem automática'])) return null;
    const garimpo = { ...(lead.garimpo || {}), ...registro };
    await sb(`crm_leads?id=eq.${lead.id}`, { method: 'PATCH', body: JSON.stringify({ etapa: 'abordado', etapa_fonte: 'instagram_auto', garimpo }) });
    return () => sb(`crm_leads?id=eq.${lead.id}`, { method: 'PATCH', body: JSON.stringify({ etapa: 'novo', etapa_fonte: 'instagram_auto', garimpo: lead.garimpo }) });
  }
  const novo = await sb('crm_leads?select=id', {
    method: 'POST', headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ nome: null, instagram: insta, origem: 'comentario_instagram', origem_detalhe: 'Comentou num post — 1a mensagem automática', status: 'a_reativar', etapa: 'abordado', etapa_fonte: 'instagram_auto', garimpo: registro })
  });
  const id = novo && novo[0] && novo[0].id;
  return () => (id ? sb(`crm_leads?id=eq.${id}`, { method: 'DELETE' }) : null);
}

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

// `recipient` no formato da Graph API: { id: psid } pra Direct normal, ou
// { comment_id: id } pra Private Reply de comentario de post/Reels.
async function enviarMensagem(recipient, texto) {
  const resp = await fetch(`${IG_BASE}/${IG_USER_ID}/messages?access_token=${encodeURIComponent(IG_TOKEN)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient,
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
      // Direct message (Story reply tambem chega aqui, como Direct normal)
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
          console.log(`[webhook-instagram-dm] sem match pra "${textoRecebido}" (direct) — ignorado, sem resposta automatica`);
          continue;
        }

        const mensagem = montarMensagemBoasVindas(match.nome_oferta, match.link);
        await enviarMensagem({ id: remetenteId }, mensagem);
        console.log(`[webhook-instagram-dm] respondido (direct): ${remetenteId} -> ${match.slug} (palavra "${textoRecebido}")`);
      }

      // Comentario publico em post/Reels/carrossel (campo "comments", nao "messaging")
      const mudancas = entrada.changes || [];
      for (const mudanca of mudancas) {
        // 'live_comments' = comentario durante a live (18/11: quem comentava LIVE na live nao recebia).
        // A Meta so aceita private reply de live ENQUANTO a live esta no ar.
        if (mudanca.field !== 'comments' && mudanca.field !== 'live_comments') continue;
        const ehLive = mudanca.field === 'live_comments';
        const valor = mudanca.value || {};

        const comentarioId = valor.id;
        const textoRecebido = valor.text;
        const remetenteId = valor.from && valor.from.id;
        if (!comentarioId || !textoRecebido) continue;

        // Ignora comentario feito pela propria conta (ex: a Karol respondendo no proprio post)
        if (remetenteId && String(remetenteId) === String(IG_USER_ID)) continue;

        const textoNormalizado = normalizar(textoRecebido);
        const match = mapaPalavras[textoNormalizado];

        if (!match) {
          const username = valor.from && valor.from.username;
          // Resposta dentro de uma conversa de comentarios (parent_id) nao conta: a pessoa ja foi respondida ali.
          if (!ABORDAR_QUEM_COMENTA || ehLive || !username || valor.parent_id) {
            console.log(`[webhook-instagram-dm] sem match pra comentario ${comentarioId} — ignorado`);
            continue;
          }
          let desfazer = null;
          try {
            desfazer = await reservarAbordagem(username, textoRecebido, valor.media && valor.media.id);
            if (!desfazer) {
              console.log(`[webhook-instagram-dm] comentario ${comentarioId}: @${username} ja esta no CRM (abordado/em conversa) — sem mensagem`);
              continue;
            }
            await enviarMensagem({ comment_id: comentarioId }, mensagemQuemComentou());
            console.log(`[webhook-instagram-dm] 1a mensagem automatica enviada: comentario ${comentarioId} (@${username})`);
          } catch (err) {
            console.log(`[webhook-instagram-dm] abordagem automatica falhou no comentario ${comentarioId}: ${err.message}`);
            if (desfazer) { try { await desfazer(); } catch (e) { console.log('[webhook-instagram-dm] desfazer falhou:', e.message); } }
          }
          continue;
        }

        const mensagem = montarMensagemBoasVindas(match.nome_oferta, match.link);
        try {
          await enviarMensagem({ comment_id: comentarioId }, mensagem);
          console.log(`[webhook-instagram-dm] private reply enviada: comentario ${comentarioId} -> ${match.slug} (palavra "${textoRecebido}")`);
        } catch (err) {
          // Meta permite so 1 private reply por comentario, pra sempre — retry/reenvio do
          // mesmo webhook (comum em picos) vai cair aqui. Nao e erro real, so log.
          console.log(`[webhook-instagram-dm] private reply falhou pra comentario ${comentarioId} (provavel duplicata ou fora da janela de 7 dias): ${err.message}`);
        }
      }
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[webhook-instagram-dm] erro:', err.message);
    res.status(200).json({ ok: false, erro: err.message }); // 200 pra Meta nao ficar re-tentando em loop; erro fica so no log
  }
}
