// Recebe cadastro da LP do grupo Live Expert360 e grava no Supabase (leads_live_expert360).
// Usa a service_role key (bypassa RLS) — nunca exposta no client, só aqui via env var.
// Falha de gravacao NUNCA deve bloquear o lead de entrar no grupo: o client redireciona pra
// obrigada.html independente da resposta desta funcao (ver index.html).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'method not allowed' });
    return;
  }

  const { nome, email, whatsapp } = req.body || {};

  if (!nome || !email || !whatsapp) {
    res.status(400).json({ ok: false, error: 'campos obrigatorios faltando' });
    return;
  }

  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/leads_live_expert360`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        nome: String(nome).trim(),
        email: String(email).trim().toLowerCase(),
        whatsapp: String(whatsapp).trim(),
        origem: 'lp-grupo-live'
      })
    });

    if (!resp.ok) {
      const texto = await resp.text();
      console.error('[lead] insert falhou:', resp.status, texto);
      res.status(200).json({ ok: false, error: 'insert falhou' }); // 200 pra nao travar o client
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[lead] erro:', err.message);
    res.status(200).json({ ok: false, error: err.message });
  }
}
