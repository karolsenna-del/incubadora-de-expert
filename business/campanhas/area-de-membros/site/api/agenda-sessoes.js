// Agenda Google → sessões do painel comercial (18/11/2026).
// Lê o "endereço secreto no formato iCal" da agenda da Karol (env GOOGLE_AGENDA_ICAL, só leitura) e devolve
// os eventos de 60 dias pra trás até 60 dias pra frente, com os e-mails dos convidados. O painel liga
// o evento ao lead pelo e-mail (o mesmo do pré-diagnóstico) e grava em crm_sessoes com o login dela (RLS).
// Só responde pra sessão logada da Karol: confere o token no Supabase Auth.

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_tVRpUaJhU7JCMfOiE2lXfQ__osqLrIB';
const ICAL = process.env.GOOGLE_AGENDA_ICAL;
const DONA = 'karolsenna@incubadoradeexpert.com.br';
const JANELA = 60 * 86400000;

async function ehKarol(token) {
  if (!token) return false;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` } });
  if (!r.ok) return false;
  const u = await r.json();
  return (u.email || '').toLowerCase() === DONA;
}

// diferença (ms) entre o relógio do fuso e o UTC naquele instante
function offsetFuso(t, tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(new Date(t)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - t;
}

function dataIcal(valor, params) {
  const m = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(valor || '');
  if (!m) return null;
  const local = Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 12), +(m[5] || 0), +(m[6] || 0));
  if (m[7] || !m[4]) return local;
  const tz = (/TZID=([^;:]+)/.exec(params || '') || [])[1] || 'America/Cuiaba';
  try { const g = local - offsetFuso(local, tz); return local - offsetFuso(g, tz); } catch { return local - offsetFuso(local, 'America/Cuiaba'); }
}

function lerEventos(ics) {
  const linhas = ics.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '').split(/\r?\n/);
  const eventos = [];
  let ev = null;
  for (const l of linhas) {
    if (l === 'BEGIN:VEVENT') { ev = { emails: [] }; continue; }
    if (l === 'END:VEVENT') { if (ev) eventos.push(ev); ev = null; continue; }
    if (!ev) continue;
    const i = l.indexOf(':');
    if (i < 0) continue;
    const chave = l.slice(0, i), valor = l.slice(i + 1);
    const nome = chave.split(';')[0];
    if (nome === 'UID') ev.uid = valor;
    else if (nome === 'RECURRENCE-ID') ev.rec = valor;
    else if (nome === 'RRULE') ev.repete = true;
    else if (nome === 'SUMMARY') ev.titulo = valor.replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\n/gi, ' ');
    else if (nome === 'STATUS') ev.status = valor;
    else if (nome === 'DTSTART') ev.inicio = dataIcal(valor, chave);
    else if (nome === 'ATTENDEE' || nome === 'ORGANIZER') {
      const e = (/mailto:(.+)$/i.exec(valor) || [])[1];
      if (e && nome === 'ATTENDEE') ev.emails.push(e.trim().toLowerCase());
    }
  }
  return eventos;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!(await ehKarol(token))) return res.status(401).json({ erro: 'sem acesso' });
  if (!ICAL) return res.status(200).json({ ligada: false, eventos: [] });
  const r = await fetch(ICAL);
  if (!r.ok) return res.status(502).json({ erro: 'a agenda não respondeu (' + r.status + ')' });
  const agora = Date.now();
  const eventos = lerEventos(await r.text())
    .filter((e) => e.uid && e.inicio && !e.repete && Math.abs(e.inicio - agora) <= JANELA)
    .map((e) => ({
      id: e.uid + (e.rec ? '#' + e.rec : ''),
      quando: new Date(e.inicio).toISOString(),
      titulo: e.titulo || '',
      cancelado: e.status === 'CANCELLED',
      emails: [...new Set(e.emails.filter((x) => x !== DONA))],
    }))
    .filter((e) => e.emails.length);
  return res.status(200).json({ ligada: true, de: new Date(agora - JANELA).toISOString(), ate: new Date(agora + JANELA).toISOString(), eventos });
};
