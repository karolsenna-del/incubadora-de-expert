-- Backup antes da mudança de 13/11/2026
CREATE OR REPLACE FUNCTION public.crm_ingest_whatsapp_event(p_event_key text, p_event_kind text, p_phone_e164 text, p_contact_name text, p_direction text, p_occurred_at timestamp with time zone, p_message_type text, p_message_text text, p_metadata jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$
;
