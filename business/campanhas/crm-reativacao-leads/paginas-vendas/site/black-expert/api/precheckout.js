// Pré-checkout da Black Expert: grava nome + celular de quem clicou em comprar, ANTES de ir pra Voomp.
// Serve pra recuperar a venda de quem não finalizou. Vai pro CRM (crm_leads, origem black_expert_precheckout).
// Usa a service_role key (bypassa RLS) — só aqui via env var, nunca no client.
// Falha de gravação NUNCA bloqueia a compra: o client segue pro checkout independente da resposta.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ORIGEM = 'black_expert_precheckout';

const headers = () => ({
  'Content-Type': 'application/json',
  apikey: SUPABASE_SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
});

// REGRA-013: só dígitos, com 55 na frente.
function normalizar(tel) {
  let d = String(tel || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = '55' + d;
  return d;
}

// Mesmo celular com/sem o nono dígito (evita duplicar o lead).
function alternativo(tel) {
  if (tel.length === 13) return tel.slice(0, 4) + tel.slice(5);
  if (tel.length === 12) return tel.slice(0, 4) + '9' + tel.slice(4);
  return tel;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }

  const nome = String(body.nome || '').trim().slice(0, 120);
  const telefone = normalizar(body.celular);
  const utms = body.utms && typeof body.utms === 'object' ? body.utms : {};

  if (!nome || telefone.length < 12 || telefone.length > 13) {
    res.status(400).json({ ok: false, error: 'nome ou celular invalido' });
    return;
  }

  const partesUtm = Object.keys(utms)
    .filter((k) => /^(utm_source|utm_medium|utm_campaign|utm_content|utm_term)$/.test(k))
    .map((k) => `${k}=${String(utms[k]).slice(0, 80)}`);
  const detalhe = ['clicou em comprar na página da Black Expert'].concat(partesUtm).join(' · ');

  try {
    const alt = alternativo(telefone);
    const busca = await fetch(
      `${SUPABASE_URL}/rest/v1/crm_leads?select=id&origem=eq.${ORIGEM}&telefone=in.(${telefone},${alt})&limit=1`,
      { headers: headers() }
    );
    const existentes = busca.ok ? await busca.json() : [];

    let resp;
    if (existentes.length) {
      // Clicou de novo: atualiza nome/detalhe (updated_at sobe pelo trigger = último clique).
      resp = await fetch(`${SUPABASE_URL}/rest/v1/crm_leads?id=eq.${existentes[0].id}`, {
        method: 'PATCH',
        headers: { ...headers(), Prefer: 'return=minimal' },
        body: JSON.stringify({ nome, origem_detalhe: detalhe })
      });
    } else {
      resp = await fetch(`${SUPABASE_URL}/rest/v1/crm_leads`, {
        method: 'POST',
        headers: { ...headers(), Prefer: 'return=minimal' },
        body: JSON.stringify({ nome, telefone, origem: ORIGEM, origem_detalhe: detalhe })
      });
    }

    if (!resp.ok) {
      console.error('[precheckout] gravacao falhou:', resp.status, await resp.text());
      res.status(200).json({ ok: false }); // 200 pra não travar o client
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[precheckout] erro:', err.message);
    res.status(200).json({ ok: false });
  }
}
