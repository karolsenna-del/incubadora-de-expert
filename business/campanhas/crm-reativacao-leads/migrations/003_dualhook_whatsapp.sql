-- CRM Reativação · Dualhook/WhatsApp Coexistence
-- Migration 003 aditiva e idempotente.
-- Não cria follow-up nem prazo automaticamente: apenas sinaliza revisão humana.

alter table public.crm_leads
  add column if not exists whatsapp_last_contact_at timestamptz,
  add column if not exists whatsapp_last_direction text,
  add column if not exists whatsapp_followup_state text not null default 'sem_regra';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'crm_leads_whatsapp_direction_check'
  ) then
    alter table public.crm_leads add constraint crm_leads_whatsapp_direction_check
      check (whatsapp_last_direction is null or whatsapp_last_direction in ('entrada', 'saida'));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'crm_leads_whatsapp_followup_state_check'
  ) then
    alter table public.crm_leads add constraint crm_leads_whatsapp_followup_state_check
      check (whatsapp_followup_state in ('sem_regra', 'revisao_pendente', 'revisado'));
  end if;
end $$;

comment on column public.crm_leads.whatsapp_followup_state is
  'Estado derivado para revisão humana. revisao_pendente não agenda nem envia follow-up; sem_regra significa que nenhuma regra comercial foi aplicada.';

create table if not exists public.crm_whatsapp_events (
  event_key text primary key,
  created_at timestamptz not null default now(),
  lead_id uuid references public.crm_leads(id) on delete set null,
  event_kind text not null check (event_kind in ('message', 'history', 'contact_sync')),
  phone_e164 text not null,
  direction text check (direction is null or direction in ('entrada', 'saida')),
  occurred_at timestamptz,
  message_type text,
  message_text text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_crm_whatsapp_events_lead_time
  on public.crm_whatsapp_events (lead_id, occurred_at desc);
create index if not exists idx_crm_whatsapp_events_phone
  on public.crm_whatsapp_events (phone_e164);

alter table public.crm_whatsapp_events enable row level security;
comment on table public.crm_whatsapp_events is
  'Eventos WhatsApp minimizados. event_key (wamid ou chave estável do contact sync) impede duplicação; payload bruto não é persistido.';

create table if not exists public.crm_whatsapp_sync_state (
  sync_key text primary key,
  sync_type text not null check (sync_type in ('history', 'contacts')),
  phase integer,
  chunk_order integer,
  progress integer check (progress is null or progress between 0 and 100),
  completed boolean not null default false,
  error_code text,
  updated_at timestamptz not null default now()
);

alter table public.crm_whatsapp_sync_state enable row level security;
comment on table public.crm_whatsapp_sync_state is
  'Controle idempotente dos one-shots do Coexistence. History só está concluído quando progress=100.';

create or replace function public.crm_ingest_whatsapp_event(
  p_event_key text,
  p_event_kind text,
  p_phone_e164 text,
  p_contact_name text,
  p_direction text,
  p_occurred_at timestamptz,
  p_message_type text,
  p_message_text text,
  p_metadata jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_digits text := regexp_replace(coalesce(p_phone_e164, ''), '\D', '', 'g');
  v_lead_id uuid;
  v_inserted integer := 0;
  v_action text := coalesce(p_metadata ->> 'action', '');
begin
  if p_event_key is null or length(v_digits) < 8 then
    raise exception 'evento WhatsApp sem identificador ou telefone válido';
  end if;

  perform pg_advisory_xact_lock(hashtext(v_digits));

  select id into v_lead_id
  from public.crm_leads
  where regexp_replace(coalesce(telefone, ''), '\D', '', 'g') = v_digits
  order by created_at asc
  limit 1;

  if v_lead_id is null and not (p_event_kind = 'contact_sync' and v_action = 'remove') then
    insert into public.crm_leads (nome, telefone, origem, origem_detalhe)
    values (nullif(p_contact_name, ''), v_digits, 'dualhook_whatsapp', 'WhatsApp Coexistence')
    returning id into v_lead_id;
  end if;

  insert into public.crm_whatsapp_events (
    event_key, lead_id, event_kind, phone_e164, direction, occurred_at,
    message_type, message_text, metadata
  ) values (
    p_event_key, v_lead_id, p_event_kind, p_phone_e164, p_direction, p_occurred_at,
    p_message_type, p_message_text, coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (event_key) do nothing;

  get diagnostics v_inserted = row_count;
  if v_inserted = 0 then
    return jsonb_build_object('inserted', false, 'lead_id', v_lead_id);
  end if;

  if v_lead_id is not null and p_event_kind = 'contact_sync' and v_action = 'add'
     and nullif(p_contact_name, '') is not null then
    update public.crm_leads set nome = p_contact_name where id = v_lead_id;
  end if;

  if v_lead_id is not null and p_direction is not null then
    update public.crm_leads
    set whatsapp_last_contact_at = p_occurred_at,
        whatsapp_last_direction = p_direction,
        whatsapp_followup_state = case
          when p_event_kind = 'message' and p_direction = 'entrada' then 'revisao_pendente'
          else whatsapp_followup_state
        end
    where id = v_lead_id
      and (whatsapp_last_contact_at is null or p_occurred_at >= whatsapp_last_contact_at);
  end if;

  return jsonb_build_object('inserted', true, 'lead_id', v_lead_id);
end;
$$;

create or replace function public.crm_ingest_whatsapp_events(p_events jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event jsonb;
  v_count integer := 0;
begin
  if jsonb_typeof(p_events) <> 'array' then
    raise exception 'p_events deve ser array JSON';
  end if;

  for v_event in select value from jsonb_array_elements(p_events)
  loop
    perform public.crm_ingest_whatsapp_event(
      v_event ->> 'p_event_key',
      v_event ->> 'p_event_kind',
      v_event ->> 'p_phone_e164',
      v_event ->> 'p_contact_name',
      v_event ->> 'p_direction',
      nullif(v_event ->> 'p_occurred_at', '')::timestamptz,
      v_event ->> 'p_message_type',
      v_event ->> 'p_message_text',
      coalesce(v_event -> 'p_metadata', '{}'::jsonb)
    );
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

create or replace function public.crm_record_whatsapp_sync(
  p_sync_key text,
  p_sync_type text,
  p_phase integer,
  p_chunk_order integer,
  p_progress integer,
  p_completed boolean,
  p_error_code text
) returns void
language sql
security definer
set search_path = public
as $$
  insert into public.crm_whatsapp_sync_state (
    sync_key, sync_type, phase, chunk_order, progress, completed, error_code, updated_at
  ) values (
    p_sync_key, p_sync_type, p_phase, p_chunk_order, p_progress,
    coalesce(p_completed, false), p_error_code, now()
  )
  on conflict (sync_key) do update set
    progress = greatest(public.crm_whatsapp_sync_state.progress, excluded.progress),
    completed = public.crm_whatsapp_sync_state.completed or excluded.completed,
    error_code = coalesce(excluded.error_code, public.crm_whatsapp_sync_state.error_code),
    updated_at = now();
$$;

revoke all on function public.crm_ingest_whatsapp_event(text,text,text,text,text,timestamptz,text,text,jsonb) from public;
revoke all on function public.crm_ingest_whatsapp_events(jsonb) from public;
revoke all on function public.crm_record_whatsapp_sync(text,text,integer,integer,integer,boolean,text) from public;
grant execute on function public.crm_ingest_whatsapp_event(text,text,text,text,text,timestamptz,text,text,jsonb) to service_role;
grant execute on function public.crm_ingest_whatsapp_events(jsonb) to service_role;
grant execute on function public.crm_record_whatsapp_sync(text,text,integer,integer,integer,boolean,text) to service_role;

-- Rollback reversível (executar manualmente somente se a integração for removida):
-- drop function if exists public.crm_record_whatsapp_sync(text,text,integer,integer,integer,boolean,text);
-- drop function if exists public.crm_ingest_whatsapp_events(jsonb);
-- drop function if exists public.crm_ingest_whatsapp_event(text,text,text,text,text,timestamptz,text,text,jsonb);
-- drop table if exists public.crm_whatsapp_sync_state;
-- drop table if exists public.crm_whatsapp_events;
-- alter table public.crm_leads drop constraint if exists crm_leads_whatsapp_followup_state_check;
-- alter table public.crm_leads drop constraint if exists crm_leads_whatsapp_direction_check;
-- alter table public.crm_leads drop column if exists whatsapp_followup_state;
-- alter table public.crm_leads drop column if exists whatsapp_last_direction;
-- alter table public.crm_leads drop column if exists whatsapp_last_contact_at;
