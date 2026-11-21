-- Painel Comercial (21/11/2026): follow-up de volta (era o alerta da planilha).
--   1. crm_followups.tipo: 'nota' (anotação da ficha) ou 'followup' (botão "Fiz follow-up" na aba Abordar).
--      Só 'followup' conta na meta diária e na contagem de follow-ups até a compra.
--   2. crm_contatos_whatsapp(): dias em que a Karol mandou mensagem pra cada lead pelos chips ligados à conta
--      oficial (sem mensagem automática de modelo). Entra na conta de "follow-ups até a compra".
--      Só responde pra Karol. Conversa pelo celular pessoal ou pelo Direct não chega aqui.
alter table public.crm_followups add column if not exists tipo text not null default 'nota';

create or replace function public.crm_contatos_whatsapp()
returns table (lead_id uuid, dia date)
language sql stable security definer set search_path = public as $$
  with l as (
    select id, nullif(right(regexp_replace(coalesce(telefone, ''), '\D', '', 'g'), 8), '') tel
    from crm_leads
    where (auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br'
  )
  select distinct l.id, (w.occurred_at at time zone 'America/Cuiaba')::date
  from l join crm_whatsapp_events w
    on (w.lead_id = l.id or (l.tel is not null and right(regexp_replace(coalesce(w.phone_e164, ''), '\D', '', 'g'), 8) = l.tel))
  where w.direction = 'saida' and w.event_kind <> 'contact_sync'
    and coalesce(w.message_type, '') not in ('template', 'reaction')
    and w.occurred_at > '2020-01-01';
$$;
revoke all on function public.crm_contatos_whatsapp() from public, anon;
grant execute on function public.crm_contatos_whatsapp() to authenticated;
