-- "Lead desde" (19/11/2026): a data em que a pessoa virou lead de verdade (ex.: entrou no grupo de lives),
-- não só quando apareceu no painel. lead_desde = data que a Karol digita na ficha (manda sobre tudo).
-- crm_lead_vestigios() = o vestígio mais antigo que o banco conhece de cada lead, pro painel usar quando
-- lead_desde está vazio: primeira mensagem no WhatsApp, lista da live, captura de página, diagnóstico,
-- primeira etapa e a criação do lead. Só responde pra Karol (as tabelas de origem não têm leitura pra ela).
alter table public.crm_leads add column if not exists lead_desde timestamptz;

create or replace function public.crm_lead_vestigios()
returns table (lead_id uuid, desde timestamptz, fonte text)
language sql stable security definer set search_path = public as $$
  with l as (
    select id, lower(nullif(email, '')) em, nullif(right(regexp_replace(coalesce(telefone, ''), '\D', '', 'g'), 8), '') tel,
           created_at, diagnostico_em
    from crm_leads
    where (auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br'
  ), v as (
    select l.id, l.created_at d, 'entrada no painel' f from l
    union all select l.id, l.diagnostico_em, 'pré-diagnóstico' from l where l.diagnostico_em is not null
    union all select e.lead_id, min(e.em), 'funil' from crm_etapas e group by 1
    union all
    select l.id, min(w.occurred_at), 'WhatsApp' from l join crm_whatsapp_events w
      on (w.lead_id = l.id or (l.tel is not null and right(regexp_replace(coalesce(w.phone_e164, ''), '\D', '', 'g'), 8) = l.tel))
      where w.occurred_at > '2020-01-01' and w.event_kind <> 'contact_sync' group by 1
    union all
    select l.id, min(x.created_at), 'lista da live' from l join leads_live_expert360 x
      on (lower(x.email) = l.em or (l.tel is not null and right(regexp_replace(coalesce(x.whatsapp, ''), '\D', '', 'g'), 8) = l.tel)) group by 1
    union all
    select l.id, least(min(p.created_at), min(c.created_at)), 'captura de página' from l join pessoas p
      on (lower(p.email) = l.em or (l.tel is not null and right(regexp_replace(coalesce(p.telefone, ''), '\D', '', 'g'), 8) = l.tel))
      left join capturas c on c.pessoa_id = p.id group by 1
  )
  select distinct on (v.id) v.id, v.d, v.f from v join l on l.id = v.id where v.d is not null order by v.id, v.d;
$$;
revoke all on function public.crm_lead_vestigios() from public, anon;
grant execute on function public.crm_lead_vestigios() to authenticated;
