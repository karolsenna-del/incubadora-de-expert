'use strict';

// Rascunho dos diagnósticos pós-venda: guarda as respostas no banco enquanto a pessoa
// responde, pra nada se perder se o celular desligar ou ela reabrir em outro app.
// Dados de contrato (RG, CPF, endereço) nunca entram no rascunho.

const FORMULARIOS = new Set(['metodo-vip']);
const CAMPOS_PROIBIDOS = /^contrato_/;
const MAX_BYTES = 120000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function soDigitos(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 10 || d.length === 11) d = '55' + d;
  return d;
}

// Celular BR com e sem o nono dígito (REGRA-013)
function variacoes(whats) {
  const out = new Set([whats]);
  if (whats.length === 13) out.add(whats.slice(0, 4) + whats.slice(5));
  if (whats.length === 12) out.add(whats.slice(0, 4) + '9' + whats.slice(4));
  return [...out];
}

function primeiroNome(v) {
  return String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .trim().toLowerCase().split(/\s+/)[0] || '';
}

function limparRespostas(r) {
  const out = {};
  if (!r || typeof r !== 'object') return out;
  for (const k of Object.keys(r)) {
    if (CAMPOS_PROIBIDOS.test(k)) continue;
    out[k] = r[k];
  }
  return out;
}

async function supa(path, opts) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('supabase not configured');
  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(opts && opts.headers)
    }
  });
  if (!res.ok) throw new Error(`supabase ${res.status}`);
  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  let body = req.body;
  if (typeof body === 'string') {
    if (body.length > MAX_BYTES) return res.status(413).json({ ok: false });
    try { body = JSON.parse(body); } catch (e) { return res.status(400).json({ ok: false }); }
  }
  body = body || {};
  if (JSON.stringify(body).length > MAX_BYTES) return res.status(413).json({ ok: false });

  const formulario = String(body.formulario || '');
  if (!FORMULARIOS.has(formulario)) return res.status(400).json({ ok: false });
  const acao = String(body.acao || '');

  try {
    if (acao === 'salvar' || acao === 'concluir') {
      const id = String(body.id || '');
      const whats = soDigitos(body.whats);
      const nome = String(body.nome || '').trim().slice(0, 200);
      if (!UUID.test(id) || whats.length < 12 || !nome) return res.status(400).json({ ok: false });
      const linha = {
        id, formulario, whats, nome,
        etapa: Math.max(0, parseInt(body.etapa, 10) || 0),
        respostas: limparRespostas(body.respostas),
        enviado: acao === 'concluir',
        atualizado_em: new Date().toISOString()
      };
      // Não reabre rascunho já enviado
      const atual = await supa(`diagnostico_rascunhos?id=eq.${id}&select=enviado,whats`, { method: 'GET' });
      if (atual && atual[0]) {
        if (atual[0].whats !== whats && !variacoes(whats).includes(atual[0].whats)) {
          return res.status(409).json({ ok: false });
        }
        if (atual[0].enviado) return res.status(200).json({ ok: true });
      }
      await supa('diagnostico_rascunhos?on_conflict=id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(linha)
      });
      return res.status(200).json({ ok: true });
    }

    if (acao === 'recuperar') {
      const whats = soDigitos(body.whats);
      const nome = primeiroNome(body.nome);
      if (whats.length < 12 || !nome) return res.status(400).json({ ok: false });
      const lista = variacoes(whats).join(',');
      const rows = await supa(
        `diagnostico_rascunhos?formulario=eq.${formulario}&whats=in.(${lista})&enviado=eq.false` +
        '&select=id,nome,etapa,respostas,atualizado_em&order=atualizado_em.desc&limit=5',
        { method: 'GET' }
      );
      const achado = (rows || []).find(r => primeiroNome(r.nome) === nome);
      if (!achado) return res.status(200).json({ ok: true, achou: false });
      return res.status(200).json({
        ok: true, achou: true,
        id: achado.id, etapa: achado.etapa, respostas: achado.respostas
      });
    }

    return res.status(400).json({ ok: false });
  } catch (e) {
    return res.status(500).json({ ok: false });
  }
}

module.exports = handler;
