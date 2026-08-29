// Chat interno da Biblioteca de Agentes de IA — motor pronto (29/08), aguardando 2 coisas da Karol
// antes de qualquer um dos 6 agentes reais usar isso de verdade:
//   1. As instruções (prompt) de cada Custom GPT, extraídas da aba Configure do ChatGPT
//   2. Uma chave da API da OpenAI (OPENAI_API_KEY, env var de produção na Vercel)
// Até lá, AGENTES_CONFIG fica vazio — não inventar prompt de agente real (regra "não inventar").
// Endpoint verifica a matrícula (produto_slug='biblioteca-ia', ativo e não-expirado) usando o próprio
// access_token da sessão do aluno + RLS existente ("aluna lê a própria matrícula") — não precisa da
// service_role key aqui, o token do usuário já basta pra essa leitura específica.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'; // custo-benefício — trocar via env var se a Karol quiser mais qualidade

// Config de cada agente vive só aqui no servidor — nunca é enviada pro navegador do aluno.
// PLACEHOLDER: preencher com o texto real da aba Configure de cada Custom GPT quando a Karol mandar.
const AGENTES_CONFIG = {
  // 'persona-compradora': { nome: 'Agente da Persona Compradora', systemPrompt: '...' },
};

async function validarAcesso(accessToken) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/matriculas?produto_slug=eq.biblioteca-ia&ativo=eq.true&select=expira_em`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` }
  });
  if (!resp.ok) return false; // token inválido/expirado — RLS nem deixa a query passar
  const rows = await resp.json();
  const agora = new Date();
  return Array.isArray(rows) && rows.some(r => !r.expira_em || new Date(r.expira_em) > agora);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  const { agenteId, mensagens, accessToken } = req.body || {};

  if (!accessToken) {
    res.status(401).json({ error: 'sem sessão' });
    return;
  }

  const agente = AGENTES_CONFIG[agenteId];
  if (!agente) {
    res.status(404).json({ error: 'agente ainda não configurado — pendente do prompt real (Karol)' });
    return;
  }

  const temAcesso = await validarAcesso(accessToken);
  if (!temAcesso) {
    res.status(403).json({ error: 'sem acesso à Biblioteca de IA' });
    return;
  }

  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: 'OPENAI_API_KEY não configurada em produção — pendente da Karol' });
    return;
  }

  const historico = Array.isArray(mensagens) ? mensagens.slice(-20) : []; // caps histórico — controla custo por request

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'system', content: agente.systemPrompt }, ...historico]
      })
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error('[chat-agente] erro da OpenAI:', JSON.stringify(data));
      res.status(502).json({ error: 'falha ao chamar a IA' });
      return;
    }
    const resposta = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    res.status(200).json({ resposta: resposta || '' });
  } catch (err) {
    console.error('[chat-agente] erro:', err.message);
    res.status(500).json({ error: 'erro interno' });
  }
}
