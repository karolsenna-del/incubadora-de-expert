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
  'diagnostico-ferramentas': ['consultorias'],
  'incubadora-express': ['expert360', 'consultorias']
};

// Prazo de acesso por oferta, em meses (decisão 17/10). Oferta fora daqui = vitalício (expira_em NULL).
const MESES_DE_ACESSO = {
  'incubadora-express': 6
};

function calcularExpiraEm(produtoSlug) {
  const meses = MESES_DE_ACESSO[produtoSlug];
  if (!meses) return null;
  const data = new Date();
  data.setMonth(data.getMonth() + meses);
  return data.toISOString();
}

// IDs de produto na Voomp Creators (ver business/vault/supabase.md / gestor-infra-vault.md, missão #30)
const PRODUTO_POR_ID = {
  15514: 'expert360',
  16363: 'metodo-express',
  16364: 'metodo-vip',
  16365: 'sprint-do-metodo',
  16366: 'grupo',
  16367: 'individual',
  16368: 'diagnostico-ferramentas',
  17442: 'incubadora-express'
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

// ---------- Boas-vindas por WhatsApp (Karol, 13/11/2026) ----------
// Sai pelo número da API 99884-3543 (WABA 1086482547720701), modelo aprovado pela Meta por produto
// (texto = business/processos/onboarding-pos-compra.md). Só manda quando a matrícula é NOVA (a Voomp
// reenviando o mesmo aviso não gera 2ª mensagem). Desligado até ONBOARDING_WHATSAPP_ATIVO=1.
// Destrava e Diagnóstico Ferramentas ainda não têm mensagem: ficam sem envio.
const MODELO_ONBOARDING = {
  'sprint-do-metodo': 'onboarding_sprint', 'individual': 'onboarding_individual', 'grupo': 'onboarding_grupo',
  'incubadora-express': 'onboarding_express', 'metodo-vip': 'onboarding_vip', 'expert360': 'onboarding_expert360'
};
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || '1289879864218064';

// REGRA-013: só dígitos, com 55 na frente
function normalizarTelefone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = '55' + d;
  return d.length === 12 || d.length === 13 ? d : null;
}

// Campos de telefone/nome do aviso da Voomp ainda não confirmados num payload real: o 1º que existir vale.
// Sem telefone no aviso, usa o que a pessoa deixou antes (pré-checkout/painel em crm_leads, ou pessoas).
async function contatoDoComprador(payload, email) {
  let telefone = normalizarTelefone(pegar(payload, ['client.cellphone', 'client.phone', 'client.telefone', 'client.celular',
    'client.mobile', 'client.phone_number', 'client.whatsapp', 'customer.cellphone', 'customer.phone']));
  let nome = pegar(payload, ['client.name', 'client.nome', 'client.full_name', 'customer.name']);
  let fonte = telefone ? 'aviso' : null;
  if (!telefone || !nome) {
    const h = { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` };
    const e = encodeURIComponent(email);
    const consultas = [
      `${SUPABASE_URL}/rest/v1/crm_leads?email=ilike.${e}&select=telefone,nome&order=updated_at.desc&limit=5`,
      `${SUPABASE_URL}/rest/v1/pessoas?email=ilike.${e}&select=telefone,nome&limit=5`
    ];
    for (const url of consultas) {
      try {
        const rows = await (await fetch(url, { headers: h })).json();
        for (const r of Array.isArray(rows) ? rows : []) {
          if (!telefone && normalizarTelefone(r.telefone)) { telefone = normalizarTelefone(r.telefone); fonte = url.includes('crm_leads') ? 'crm_leads' : 'pessoas'; }
          if (!nome && r.nome) nome = r.nome;
        }
      } catch (err) { console.error('[webhook-voomp] busca de contato falhou:', err.message); }
    }
  }
  const primeiroNome = nome ? String(nome).trim().split(/\s+/)[0] : null;
  return { telefone, fonte, primeiroNome: primeiroNome ? primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase() : null };
}

async function enviarBoasVindas(payload, email, produtoSlug) {
  const modelo = MODELO_ONBOARDING[produtoSlug];
  if (process.env.ONBOARDING_WHATSAPP_ATIVO !== '1' || !WHATSAPP_TOKEN || !modelo) {
    console.log(`[webhook-voomp] boas-vindas não enviada (${!modelo ? 'produto sem mensagem' : 'envio desligado'}): ${produtoSlug}`);
    return;
  }
  const { telefone, fonte, primeiroNome } = await contatoDoComprador(payload, email);
  if (!telefone) { console.error(`[webhook-voomp] boas-vindas SEM TELEFONE: ${email} -> ${produtoSlug} (mandar à mão)`); return; }
  const template = primeiroNome
    ? { name: modelo, language: { code: 'pt_BR' }, components: [{ type: 'body', parameters: [{ type: 'text', text: primeiroNome }] }] }
    : { name: modelo + '_sem_nome', language: { code: 'pt_BR' } };
  const resp = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: telefone, type: 'template', template })
  });
  const j = await resp.json().catch(() => ({}));
  if (resp.ok) console.log(`[webhook-voomp] boas-vindas enviada: ${email} -> ${template.name} (telefone via ${fonte}) id=${j.messages && j.messages[0] && j.messages[0].id}`);
  else console.error(`[webhook-voomp] boas-vindas FALHOU: ${email} -> ${template.name} (${resp.status}) ${JSON.stringify(j.error || j)}`);
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
    body: JSON.stringify({ email, produto_slug: produtoSlug, trilha_id: trilhaId, origem: 'voomp_webhook', ativo: true, expira_em: calcularExpiraEm(produtoSlug) })
  });
  if (!resp.ok) {
    const texto = await resp.text();
    throw new Error(`insert matriculas falhou (${resp.status}): ${texto}`);
  }
}


// ---------- Financeiro (Karol, 03/11/2026): venda paga entra sozinha no painel financeiro ----------
// Só e-mail e product.id foram conferidos no payload real (14/08). Os campos de id da venda, valor, taxa,
// meio e data de liberação abaixo são CANDIDATOS: o 1º que existir vale. Todo aviso fica guardado cru em
// fin_voomp_avisos; na 1ª venda real, conferir contra o extrato da Voomp e fixar os campos certos aqui.
// Taxa e liberação que não vierem no aviso são estimadas e marcadas na observação (extrato corrige).
const NOME_PRODUTO = {
  'expert360': 'Expert360º', 'metodo-express': 'Destrava Expert - Sessão única', 'metodo-vip': 'Método VIP',
  'sprint-do-metodo': 'Sprint do Método', 'grupo': 'Grupo', 'individual': 'Individual',
  'diagnostico-ferramentas': 'Diagnóstico Ferramentas', 'incubadora-express': 'Incubadora Express'
};
const TAXA_ESTIMADA = 90.85 / 1500; // taxa real das vendas do Método VIP no extrato (~6,06%)

function pegar(obj, caminhos) {
  for (const c of caminhos) {
    const v = c.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return undefined;
}
const numero = v => {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return NaN;
  const t = v.replace(/[^\d,.-]/g, '');
  return Number(t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t);
};
const diaCuiaba = d => new Date(new Date(d).getTime() - 4 * 3600 * 1000).toISOString().slice(0, 10);
const somaDias = (dia, n) => { const d = new Date(dia + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };

function vendaDoAviso(payload, produtoSlug) {
  const vendaId = pegar(payload, ['sale.id', 'sale.code', 'sale.transaction_id', 'sale.transaction', 'transaction.id', 'transaction', 'id']);
  const bruto = numero(pegar(payload, ['sale.price', 'sale.value', 'sale.amount', 'sale.total', 'sale.total_price', 'sale.full_price', 'price', 'value', 'amount', 'product.price']));
  if (!vendaId || !(bruto > 0)) return { erro: 'aviso sem id da venda ou valor reconhecido' };
  let taxa = numero(pegar(payload, ['sale.fee', 'sale.fees', 'sale.tax', 'sale.taxes', 'sale.platform_fee', 'fee']));
  const liquido = numero(pegar(payload, ['sale.net', 'sale.net_value', 'sale.net_amount', 'sale.liquid_value', 'sale.producer_value', 'sale.commission', 'net']));
  const avisos = [];
  if (!(taxa >= 0) && liquido > 0 && liquido <= bruto) taxa = bruto - liquido;
  if (!(taxa >= 0)) { taxa = bruto * TAXA_ESTIMADA; avisos.push('taxa estimada'); }
  const meioCru = String(pegar(payload, ['sale.payment_method', 'sale.payment.method', 'sale.payment_type', 'payment.method', 'payment_method']) || '').toLowerCase();
  const meio = /pix/.test(meioCru) ? 'pix' : /bol|bill|ticket/.test(meioCru) ? 'boleto' : /card|cart|credit/.test(meioCru) ? 'cartao' : null;
  const pagoEm = pegar(payload, ['sale.paid_at', 'sale.approved_at', 'sale.payment_date', 'sale.updated_at', 'sale.created_at', 'sale.date']);
  const diaVenda = diaCuiaba(pagoEm && !isNaN(new Date(pagoEm)) ? pagoEm : Date.now());
  const liberaCru = pegar(payload, ['sale.release_date', 'sale.available_at', 'sale.available_date', 'sale.released_at', 'release_date']);
  let disponivel = liberaCru && !isNaN(new Date(liberaCru)) ? diaCuiaba(liberaCru) : null;
  if (!disponivel) { disponivel = somaDias(diaVenda, meio === 'cartao' ? 30 : 2); avisos.push('liberação estimada (' + (meio === 'cartao' ? 'cartão D+30' : 'pix/boleto D+2') + ')'); }
  const parcelas = pegar(payload, ['sale.installments', 'sale.installment', 'payment.installments']);
  const obs = ['via aviso da Voomp'];
  if (parcelas && Number(parcelas) > 1) obs.push(parcelas + 'x');
  if (avisos.length) obs.push(avisos.join(', ') + ' — conferir no extrato');
  return {
    vendaId: String(vendaId),
    linha: {
      natureza: 'receita', dono: 'PJ', data_competencia: diaVenda, data_caixa: disponivel,
      descricao: 'Venda Voomp #' + vendaId, produto: NOME_PRODUTO[produtoSlug] || null, categoria: null,
      conta: 'voomp', meio, valor_bruto: Math.round(bruto * 100) / 100, taxa: Math.round(taxa * 100) / 100,
      origem: 'voomp', origem_id: String(vendaId), observacao: obs.join('; ')
    }
  };
}

async function supabasePost(tabela, corpo, prefer) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/${tabela}`, {
    method: 'POST',
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: prefer || 'return=minimal' },
    body: JSON.stringify(corpo)
  });
  if (!resp.ok) throw new Error(`${tabela} (${resp.status}): ${await resp.text()}`);
}

// Nunca derruba o webhook: o acesso da aluna vem primeiro; erro fica no aviso guardado e no log.
async function registrarNoFinanceiro(payload, produtoSlug) {
  let venda = { erro: null }, lancado = false;
  try {
    if (payload.trigger === 'salePaid') {
      venda = vendaDoAviso(payload, produtoSlug);
      if (venda.linha) {
        // on_conflict = mesmo id do extrato: se a venda já foi lançada, não duplica
        await supabasePost('fin_lancamentos?on_conflict=origem,origem_id', venda.linha, 'resolution=ignore-duplicates,return=minimal');
        lancado = true;
      }
    }
  } catch (err) { venda.erro = err.message; }
  try {
    await supabasePost('fin_voomp_avisos', { trigger: payload.trigger || null, venda_id: venda.vendaId || null, payload, lancado, erro: venda.erro || null });
  } catch (err) { console.error('[webhook-voomp] guardar aviso falhou:', err.message); }
  if (venda.erro) console.error('[webhook-voomp] financeiro:', venda.erro);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const payload = req.body || {};
  console.log('[webhook-voomp] payload recebido:', JSON.stringify(payload));

  const slugDoAviso = PRODUTO_POR_ID[payload.product && payload.product.id];
  await registrarNoFinanceiro(payload, slugDoAviso);

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
    let matriculaNova = false;
    for (const trilhaId of trilhas) {
      const jaExiste = await matriculaJaExiste(email, produtoSlug, trilhaId);
      if (!jaExiste) { await inserirMatricula(email, produtoSlug, trilhaId); matriculaNova = true; }
    }
    console.log(`[webhook-voomp] matricula gravada: ${email} -> ${produtoSlug} (trilhas: ${trilhas.join(', ') || 'nenhuma'})`);

    // Boas-vindas só na 1ª vez (aviso repetido da Voomp não manda de novo). Nunca derruba a resposta.
    if (matriculaNova) {
      await enviarBoasVindas(payload, email, produtoSlug)
        .catch(err => console.error('[webhook-voomp] boas-vindas erro:', err.message));
    }

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
