// Webhook de vendas da Voomp — payload real confirmado em 14/08/2026 (compra de teste, Diagnóstico
// Ferramentas, ver Mission Log). Evento que libera acesso: trigger === "salePaid" (sale.status "paid").
// Outros triggers (waiting_payment, refund, chargeback etc.) ainda não têm payload real conferido —
// não inventar o formato, só logar e responder 200 sem tocar em `matriculas` até aparecer um de verdade.

import { createHash } from 'crypto';

// Mesmo mapa de `TRILHA_POR_OFERTA` do js/data.js (decisão 14/08: Grupo/Individual dão acesso
// direto à trilha Expert360º também, não duplicam conteúdo).
const TRILHA_POR_OFERTA = {
  'expert360': ['expert360'],
  'grupo': ['expert360', 'mentoria'],
  'individual': ['expert360', 'mentoria'],
  'metodo-vip': ['consultorias'],
  'metodo-express': ['consultorias'],
  'sprint-do-metodo': ['consultorias'],
  'diagnostico-ferramentas': ['consultorias']
};

// IDs de produto na Voomp Creators (ver business/vault/supabase.md / gestor-infra-vault.md, missão #30)
const PRODUTO_POR_ID = {
  15514: 'expert360',
  16363: 'metodo-express',
  16364: 'metodo-vip',
  16365: 'sprint-do-metodo',
  16366: 'grupo',
  16367: 'individual',
  16368: 'diagnostico-ferramentas'
};

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GA4_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID;
const GA4_API_SECRET = process.env.GA4_API_SECRET;
const META_PIXEL_ID = process.env.META_PIXEL_ID;
const META_CAPI_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

// SHA-256 hash — exigido pelo Meta CAPI pra email/telefone (nunca em texto puro)
function sha256(valor) {
  return createHash('sha256').update(valor.trim().toLowerCase()).digest('hex');
}

// Dispara evento de compra confirmada pro GA4 (Measurement Protocol) e pro Meta (Conversions API).
// Roda em paralelo com a gravação da matricula — falha aqui NUNCA bloqueia a matricula do aluno.
async function dispararEventosDeCompra({ email, produtoSlug, valor, transactionId }) {
  const tarefas = [];

  if (GA4_MEASUREMENT_ID && GA4_API_SECRET) {
    tarefas.push(
      fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`, {
        method: 'POST',
        body: JSON.stringify({
          client_id: `voomp.${transactionId || email}`,
          events: [{
            name: 'purchase',
            params: {
              currency: 'BRL',
              value: valor || 0,
              transaction_id: transactionId || `${produtoSlug}-${Date.now()}`,
              items: [{ item_id: produtoSlug, item_name: produtoSlug }]
            }
          }]
        })
      }).catch(err => console.error('[webhook-voomp] GA4 purchase event falhou:', err.message))
    );
  }

  if (META_PIXEL_ID && META_CAPI_ACCESS_TOKEN) {
    const emailHash = sha256(email);
    tarefas.push(
      fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${META_CAPI_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [{
            event_name: 'Purchase',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: { em: [emailHash] },
            custom_data: { currency: 'BRL', value: valor || 0, content_ids: [produtoSlug] }
          }]
        })
      }).catch(err => console.error('[webhook-voomp] Meta CAPI purchase event falhou:', err.message))
    );
  }

  if (tarefas.length) await Promise.allSettled(tarefas);
}

async function matriculaJaExiste(email, produtoSlug, trilhaId) {
  const url = `${SUPABASE_URL}/rest/v1/matriculas?email=eq.${encodeURIComponent(email)}&produto_slug=eq.${produtoSlug}&trilha_id=eq.${trilhaId}&select=id`;
  const resp = await fetch(url, {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` }
  });
  const rows = await resp.json();
  return Array.isArray(rows) && rows.length > 0;
}

async function inserirMatricula(email, produtoSlug, trilhaId) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/matriculas`, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ email, produto_slug: produtoSlug, trilha_id: trilhaId, origem: 'voomp_webhook', ativo: true })
  });
  if (!resp.ok) {
    const texto = await resp.text();
    throw new Error(`insert matriculas falhou (${resp.status}): ${texto}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const payload = req.body || {};
  console.log('[webhook-voomp] payload recebido:', JSON.stringify(payload));

  if (payload.trigger !== 'salePaid') {
    console.log(`[webhook-voomp] trigger "${payload.trigger}" ainda não tratado — só logando, matriculas não tocada`);
    res.status(200).json({ ok: true, tratado: false });
    return;
  }

  const email = payload.client && payload.client.email;
  const produtoId = payload.product && payload.product.id;
  const produtoSlug = PRODUTO_POR_ID[produtoId];

  if (!email || !produtoSlug) {
    console.error('[webhook-voomp] payload salePaid sem email ou produto reconhecido — nao gravado', { email, produtoId });
    res.status(200).json({ ok: true, tratado: false, erro: 'email ou produto nao reconhecido' });
    return;
  }

  const trilhas = TRILHA_POR_OFERTA[produtoSlug] || [];
  try {
    for (const trilhaId of trilhas) {
      const jaExiste = await matriculaJaExiste(email, produtoSlug, trilhaId);
      if (!jaExiste) await inserirMatricula(email, produtoSlug, trilhaId);
    }
    console.log(`[webhook-voomp] matricula gravada: ${email} -> ${produtoSlug} (trilhas: ${trilhas.join(', ') || 'nenhuma'})`);

    // Evento de compra pro GA4 + Meta CAPI — best-effort, nunca bloqueia a resposta.
    // Valor/transaction_id da venda ainda nao foram confirmados no payload real da Voomp
    // (so email e product.id foram confirmados na missao #27/#44 — ver comentario no topo
    // do arquivo). Nao inventar o campo: manda sem valor por enquanto. Quando cair uma
    // venda de verdade, conferir o payload cru nos logs da Vercel e completar aqui.
    dispararEventosDeCompra({ email, produtoSlug, valor: null, transactionId: null })
      .catch(err => console.error('[webhook-voomp] dispararEventosDeCompra falhou:', err.message));

    res.status(200).json({ ok: true, tratado: true, email, produtoSlug, trilhas });
  } catch (err) {
    console.error('[webhook-voomp] erro ao gravar matricula:', err.message);
    res.status(200).json({ ok: true, tratado: false, erro: err.message }); // 200 pra Voomp nao ficar re-tentando em loop; erro fica so no log
  }
}
