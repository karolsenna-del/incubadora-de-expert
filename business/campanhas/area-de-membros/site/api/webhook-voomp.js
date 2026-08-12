// Endpoint temporário de captura — recebe o webhook de vendas da Voomp e só REGISTRA o payload
// nos logs da Vercel (`vercel logs`), sem gravar nada no banco ainda. A Voomp não documenta
// publicamente o formato exato do JSON, então o próximo passo é ver um payload real antes de
// escrever a lógica de gravação em `matriculas` (ver tracker.md, Fase 4).
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method not allowed' });
    return;
  }

  console.log('[webhook-voomp] payload recebido:', JSON.stringify(req.body));

  res.status(200).json({ ok: true });
}
