#!/usr/bin/env node
/**
 * workshop-cycle.mjs — operacao do ciclo de workshop NDF
 *
 * Fonte de verdade: tabela `workshop_config` no Supabase.
 * Todos os workflows (WF-AGENT-CORE-CLOUD, WF-RECOVERY-CRON, WF-COMPRAS) leem dali.
 * Atualizar via este script — NUNCA editar diretamente no SQL editor sem dry-run.
 *
 * Uso:
 *   ./workshop-cycle.mjs status
 *   ./workshop-cycle.mjs shift --slug ndf-2026-06 --event-date-start 2026-06-20 --event-date-end 2026-06-21 \
 *     --event-time-start 10h --event-time-end 19h --duracao "2 dias" \
 *     --end-signup-at 2026-06-19T23:00:00Z
 *   ./workshop-cycle.mjs update --end-signup-at 2026-05-22T20:00:00Z
 *   ./workshop-cycle.mjs smoke --agent bia-recovery
 */

import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';

// Configure via variaveis de ambiente antes de rodar:
//   export SUPABASE_URL="https://SEU_PROJECT_REF.supabase.co"
//   export SUPABASE_SERVICE_ROLE_KEY="sua_service_role_key"
const SUPA_URL = process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA_URL || !SUPA_KEY) {
  console.error('FAIL: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
  process.exit(1);
}

// === Supabase REST helpers ===
async function sb(path, opts = {}) {
  const res = await fetch(`${SUPA_URL}/rest/v1${path}`, {
    ...opts,
    headers: {
      'apikey': SUPA_KEY,
      'Authorization': `Bearer ${SUPA_KEY}`,
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    }
  });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) throw new Error(`Supabase ${path}: HTTP ${res.status} → ${text.slice(0, 300)}`);
  return data;
}

// === CLI args ===
const args = process.argv.slice(2);
const cmd = args[0];
function getArg(flag) {
  const i = args.indexOf(flag);
  return i > -1 ? args[i + 1] : null;
}

// === Validações ===
function isDate(s) { return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)); }
function isTime(s) { return /^\d{1,2}h(\d{2})?$/.test(s); }
function isDuracao(s) { return /^\d+\s+dias?$/.test(s); }
function isIso(s) { return !isNaN(Date.parse(s)) && s.includes('T'); }

// === Deriva strings formatadas a partir dos campos estruturados ===
const MESES_PT = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
const DOWS_PT  = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const DOWS_PT_LOWER = DOWS_PT.map(d => d.toLowerCase());

function derive(input) {
  // input: { event_date_start, event_date_end, event_time_start, event_time_end, duracao, end_signup_at }
  const ds = new Date(input.event_date_start + 'T12:00:00Z');
  const de = new Date(input.event_date_end + 'T12:00:00Z');
  const dStart = ds.getUTCDate();
  const dEnd = de.getUTCDate();
  const monthStart = MESES_PT[ds.getUTCMonth()];
  const monthEnd = MESES_PT[de.getUTCMonth()];
  const yearStart = ds.getUTCFullYear();
  const dowStart = DOWS_PT[ds.getUTCDay()];
  const dowEnd = DOWS_PT[de.getUTCDay()];

  // pad
  const pad = n => String(n).padStart(2,'0');
  const m1 = pad(ds.getUTCMonth()+1);
  const m2 = pad(de.getUTCMonth()+1);

  // strings formatadas
  let data_full_text, data_short_text, data_event_range, data_template_var;
  if (monthStart === monthEnd) {
    data_full_text = `${dowStart} e ${dowEnd}, ${dStart} e ${dEnd} de ${monthStart} de ${yearStart}, das ${input.event_time_start} às ${input.event_time_end}`;
    data_short_text = `${dStart} e ${dEnd}/${m1}`;
    data_event_range = `${pad(dStart)}-${pad(dEnd)}/${m1}/${yearStart}`;
    data_template_var = `${dowStart.toLowerCase()} e ${dowEnd.toLowerCase()}, ${dStart} e ${dEnd} de ${monthStart}, das ${input.event_time_start} às ${input.event_time_end}`;
  } else {
    data_full_text = `${dowStart} ${dStart} de ${monthStart} e ${dowEnd} ${dEnd} de ${monthEnd} de ${yearStart}, das ${input.event_time_start} às ${input.event_time_end}`;
    data_short_text = `${dStart}/${m1} e ${dEnd}/${m2}`;
    data_event_range = `${pad(dStart)}/${m1}-${pad(dEnd)}/${m2}/${yearStart}`;
    data_template_var = `${dowStart.toLowerCase()} ${dStart} de ${monthStart} e ${dowEnd.toLowerCase()} ${dEnd} de ${monthEnd}, das ${input.event_time_start} às ${input.event_time_end}`;
  }

  // end_signup_text — formato "sexta 22/05/2026"
  const signupDate = new Date(input.end_signup_at);
  const signupDow = DOWS_PT[signupDate.getUTCDay()].toLowerCase();
  const end_signup_text = `${signupDow} ${pad(signupDate.getUTCDate())}/${pad(signupDate.getUTCMonth()+1)}/${signupDate.getUTCFullYear()}`;

  return { data_full_text, data_short_text, data_event_range, data_template_var, end_signup_text };
}

// === Comandos ===

async function cmdStatus() {
  const rows = await sb('/workshop_config?status=eq.active&select=*');
  if (!rows.length) {
    console.log('⚠️  NENHUM ciclo ativo. Use `shift` pra criar um.');
    return;
  }
  const w = rows[0];
  const evDate = new Date(w.event_date_start + 'T00:00:00-03:00');
  const daysToEvent = Math.ceil((evDate - new Date()) / 86400e3);
  console.log('\n=== WORKSHOP_CONFIG — Ciclo ativo ===\n');
  console.log(`Slug:              ${w.slug}`);
  console.log(`Status:            ${w.status}`);
  console.log(`Event date:        ${w.event_date_start} → ${w.event_date_end}  (${daysToEvent} dias a partir de hoje)`);
  console.log(`Horário:           ${w.event_time_start} → ${w.event_time_end}`);
  console.log(`Duração:           ${w.duracao}`);
  console.log(`Fim inscrição:     ${w.end_signup_at}`);
  console.log(`\nStrings derivadas:`);
  console.log(`  data_full_text:    ${w.data_full_text}`);
  console.log(`  data_short_text:   ${w.data_short_text}`);
  console.log(`  data_event_range:  ${w.data_event_range}`);
  console.log(`  data_template_var: ${w.data_template_var}`);
  console.log(`  end_signup_text:   ${w.end_signup_text}`);
  console.log(`\nAtualizado em:     ${w.updated_at}`);
  if (w.notes) console.log(`Notes:             ${w.notes}`);
  console.log('');
}

async function cmdShift() {
  const slug = getArg('--slug');
  const eventDateStart = getArg('--event-date-start');
  const eventDateEnd = getArg('--event-date-end');
  const eventTimeStart = getArg('--event-time-start');
  const eventTimeEnd = getArg('--event-time-end');
  const duracao = getArg('--duracao');
  const endSignup = getArg('--end-signup-at');
  const notes = getArg('--notes') || null;

  // Validações
  const errs = [];
  if (!slug) errs.push('--slug required');
  if (!isDate(eventDateStart)) errs.push('--event-date-start invalid (YYYY-MM-DD)');
  if (!isDate(eventDateEnd)) errs.push('--event-date-end invalid (YYYY-MM-DD)');
  if (isDate(eventDateStart) && isDate(eventDateEnd) && eventDateEnd < eventDateStart) errs.push('event_date_end < event_date_start');
  if (!isTime(eventTimeStart)) errs.push('--event-time-start invalid (ex: 10h, 10h30)');
  if (!isTime(eventTimeEnd)) errs.push('--event-time-end invalid');
  if (!isDuracao(duracao)) errs.push('--duracao invalid (ex: "2 dias")');
  if (!isIso(endSignup)) errs.push('--end-signup-at invalid (ISO 8601 com T)');

  if (errs.length) {
    console.error('Erros:'); errs.forEach(e => console.error(`  • ${e}`));
    process.exit(1);
  }

  const input = { event_date_start: eventDateStart, event_date_end: eventDateEnd, event_time_start: eventTimeStart, event_time_end: eventTimeEnd, duracao, end_signup_at: endSignup };
  const derived = derive(input);

  console.log('\n=== Novo ciclo (dry-run) ===\n');
  console.log(`slug: ${slug}`);
  console.log(`event_date_start: ${eventDateStart}  event_date_end: ${eventDateEnd}`);
  console.log(`event_time_start: ${eventTimeStart}  event_time_end: ${eventTimeEnd}`);
  console.log(`duracao: ${duracao}`);
  console.log(`end_signup_at: ${endSignup}`);
  console.log(`\nStrings derivadas:`);
  for (const [k, v] of Object.entries(derived)) console.log(`  ${k}: ${v}`);
  console.log(`\nnotes: ${notes || '(nenhum)'}`);

  const confirmed = await confirm('\nAplicar? Arquiva o ciclo ativo atual e insere este como novo active.');
  if (!confirmed) { console.log('Cancelado.'); process.exit(0); }

  // 1. Archive current active
  await sb(`/workshop_config?status=eq.active`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'archived' })
  });

  // 2. Insert new
  const row = await sb('/workshop_config', {
    method: 'POST',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify({ slug, status: 'active', ...input, ...derived, notes })
  });

  console.log(`\n✓ Ciclo ${slug} ativo (id: ${row[0].id})`);
  console.log(`✓ Ciclo anterior arquivado`);
  console.log('\nProxima execução dos workflows usa nova config.');
}

async function cmdUpdate() {
  // Update campos do ciclo ativo
  const updates = {};
  for (const k of ['event-date-start','event-date-end','event-time-start','event-time-end','duracao','end-signup-at','notes']) {
    const v = getArg(`--${k}`);
    if (v !== null) updates[k.replace(/-/g,'_')] = v;
  }
  if (!Object.keys(updates).length) { console.error('Nenhum --flag fornecido'); process.exit(1); }

  // pega atual
  const current = (await sb('/workshop_config?status=eq.active&select=*'))[0];
  if (!current) { console.error('Sem ciclo ativo'); process.exit(1); }
  const merged = { ...current, ...updates };
  const derived = derive(merged);
  Object.assign(merged, derived);

  console.log('Updates:', updates);
  console.log('Strings rederivadas:', derived);

  const confirmed = await confirm('Aplicar?');
  if (!confirmed) { console.log('Cancelado'); process.exit(0); }

  const result = await sb(`/workshop_config?id=eq.${current.id}`, {
    method: 'PATCH',
    headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify({ ...updates, ...derived })
  });
  console.log(`✓ Atualizado. updated_at: ${result[0].updated_at}`);
}

async function cmdSmoke() {
  const agentId = getArg('--agent') || 'bia-recovery';
  const rows = await sb('/workshop_config?status=eq.active&select=*');
  if (!rows.length) { console.error('Sem ciclo ativo'); process.exit(1); }
  const w = rows[0];

  console.log(`\n=== Smoke: prompt do agente ${agentId} com substituições ===\n`);
  console.log(`Workshop ativo: ${w.slug}`);
  console.log(`Substituições aplicadas:`);
  for (const k of ['data_full_text','data_short_text','data_event_range','data_template_var','event_time_start','event_time_end','duracao','end_signup_text']) {
    console.log(`  {{${k}}} → "${w[k]}"`);
  }
  console.log(`\nO workflow WF-AGENT-CORE-CLOUD aplica essas substituições antes de mandar pro Claude.`);
  console.log(`Use: node scripts/workshop-cycle.mjs status pra ver dados atuais.`);
}

function help() {
  console.log(`workshop-cycle.mjs — operação ciclo workshop NDF

Comandos:
  status                                       Ver ciclo ativo
  shift --slug X --event-date-start ...        Iniciar novo ciclo (arquiva atual + insere novo)
  update --end-signup-at ...                   Atualizar campos do ciclo ativo
  smoke --agent bia-recovery                   Ver substituições que serão aplicadas
  help                                         Esta tela

Flags do shift:
  --slug ndf-2026-06
  --event-date-start YYYY-MM-DD
  --event-date-end   YYYY-MM-DD
  --event-time-start (ex: 10h, 10h30)
  --event-time-end
  --duracao "2 dias"
  --end-signup-at 2026-06-19T23:00:00Z
  [--notes "..."]
`);
}

function confirm(msg) {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${msg} [Y/n] `, ans => {
      rl.close();
      resolve(ans.trim().toLowerCase() !== 'n');
    });
  });
}

(async () => {
  try {
    if (cmd === 'status') await cmdStatus();
    else if (cmd === 'shift') await cmdShift();
    else if (cmd === 'update') await cmdUpdate();
    else if (cmd === 'smoke') await cmdSmoke();
    else if (cmd === 'help' || !cmd) help();
    else { console.error(`Comando desconhecido: ${cmd}`); help(); process.exit(1); }
  } catch (e) {
    console.error(`ERROR: ${e.message}`);
    process.exit(1);
  }
})();
