-- Painel Comercial (11/11/2026): refaz o histórico importado dos leads do CRM antigo (não Garimpo).
-- Motivo: a 1ª versão usou updated_at, que o sync da planilha do closer regrava a cada 15 min (leads velhos
-- apareciam como "novos nos últimos 30 dias"), e o aluno antigo ficava sem a passagem pela sessão.
-- Regra: novo = data de criação; sessão = data do diagnóstico (ou criação, se veio de sessão sem data);
-- em conversa / perdido sem data = criação; aluno = liberação da matrícula, senão diagnóstico, senão criação.
-- Tudo marcado como aproximado.

with alvo as (
  select l.id, l.etapa, l.created_at, l.diagnostico_em, l.origem,
         (select min(m.liberado_em) from public.matriculas m where lower(m.email) = lower(l.email)) as matricula_em
  from public.crm_leads l
  where l.origem <> 'garimpo_instagram' and l.etapa_fonte = 'migracao'
),
apaga as (
  delete from public.crm_etapas e using alvo a where e.lead_id = a.id and e.fonte = 'migracao' returning 1
),
linhas as (
  select id, 'novo' etapa, created_at em from alvo
  union all
  select id, 'sessao', coalesce(diagnostico_em, created_at) from alvo
   where diagnostico_em is not null or (origem = 'sessao_estrategica' and etapa in ('sessao', 'aluno', 'perdido'))
  union all
  -- em conversa: 1ª mensagem recebida no WhatsApp, quando existe
  select a.id, 'respondeu', coalesce((select min(w.occurred_at) from public.crm_whatsapp_events w
                                      where w.lead_id = a.id and w.event_kind = 'message' and w.direction = 'entrada'), a.created_at)
    from alvo a where a.etapa = 'respondeu'
  union all
  select id, 'aluno', greatest(coalesce(matricula_em, diagnostico_em, created_at), coalesce(diagnostico_em, created_at)) from alvo where etapa = 'aluno'
  union all
  select id, 'perdido', coalesce(diagnostico_em, created_at) from alvo where etapa = 'perdido'
)
insert into public.crm_etapas (lead_id, etapa, em, fonte, aproximada)
select id, etapa, em, 'migracao', true from linhas;

-- etapa_em do lead = data da última linha (sem disparar histórico novo)
do $$
begin
  perform set_config('crm.sem_historico', 'sim', true);
  update public.crm_leads l set etapa_em = x.em
    from (select distinct on (lead_id) lead_id, em from public.crm_etapas where fonte = 'migracao' order by lead_id, em desc) x
   where x.lead_id = l.id and l.etapa_fonte = 'migracao' and l.origem <> 'garimpo_instagram';
  perform set_config('crm.sem_historico', '', true);
end $$;

select etapa, count(*), min(em)::date, max(em)::date from public.crm_etapas group by 1 order by 1;
