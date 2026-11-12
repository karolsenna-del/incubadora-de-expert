-- Painel Comercial da Karol (11/11/2026). Painel: site/comercial.html
-- Funil: novo → abordado → respondeu (em conversa) → sessão → proposta → aluno | perdido | descartado
-- Doc de trabalho: business/processos/painel-comercial.md
-- Aprovado pela Karol em 11/11/2026 ("ok A": painel vira o lugar de trabalho, planilha se aposenta).
-- Não mexe em "status" (usado pelo sync antigo com a planilha do closer): a etapa do funil é coluna nova.

-- 1) Colunas novas no lead -------------------------------------------------------------------
alter table public.crm_leads
  add column if not exists etapa        text,
  add column if not exists etapa_em     timestamptz,
  add column if not exists etapa_fonte  text,          -- quem mudou por último: painel, whatsapp, diagnostico, matricula, migracao, garimpo
  add column if not exists garimpo      jsonb,         -- dados do Garimpo (bio, fato-gancho, copy, score...)
  add column if not exists produto      text,          -- o que comprou (quando vira aluno)
  add column if not exists valor_venda  numeric(12,2),
  add column if not exists motivo_perda text;

alter table public.crm_leads drop constraint if exists crm_leads_etapa_check;
alter table public.crm_leads add constraint crm_leads_etapa_check
  check (etapa in ('novo', 'abordado', 'respondeu', 'sessao', 'proposta', 'aluno', 'perdido', 'descartado'));

create index if not exists crm_leads_etapa_idx on public.crm_leads (etapa);
create index if not exists crm_leads_email_lower_idx on public.crm_leads (lower(email));
create index if not exists crm_leads_insta_idx on public.crm_leads (lower(instagram));

-- 2) Histórico de etapas (uma linha por mudança) ---------------------------------------------
create table if not exists public.crm_etapas (
  id       uuid primary key default gen_random_uuid(),
  lead_id  uuid not null references public.crm_leads(id) on delete cascade,
  etapa    text not null,
  em       timestamptz not null default now(),
  fonte    text not null default 'painel',
  aproximada boolean not null default false     -- true = data reconstruída na migração (não é o momento exato)
);
create index if not exists crm_etapas_lead_idx on public.crm_etapas (lead_id, em);
create index if not exists crm_etapas_em_idx on public.crm_etapas (em);

-- Toda mudança de etapa grava a data e o histórico sozinha.
create or replace function public.crm_etapa_registrar() returns trigger language plpgsql as $$
begin
  if new.etapa is null then new.etapa := 'novo'; end if;
  if tg_op = 'INSERT' then
    new.etapa_em := coalesce(new.etapa_em, now());
    new.etapa_fonte := coalesce(new.etapa_fonte, 'painel');
  elsif new.etapa is distinct from old.etapa then
    -- quem muda pode mandar a data e a fonte; se não mandou, vale agora e "painel"
    if new.etapa_em is not distinct from old.etapa_em then new.etapa_em := now(); end if;
    if new.etapa_fonte is not distinct from old.etapa_fonte then new.etapa_fonte := 'painel'; end if;
  end if;
  return new;
end $$;

create or replace function public.crm_etapa_historico() returns trigger language plpgsql as $$
begin
  if coalesce(current_setting('crm.sem_historico', true), '') = 'sim' then return null; end if;
  if tg_op = 'INSERT' or new.etapa is distinct from old.etapa then
    insert into public.crm_etapas (lead_id, etapa, em, fonte) values (new.id, new.etapa, new.etapa_em, coalesce(new.etapa_fonte, 'painel'));
  end if;
  return null;
end $$;

drop trigger if exists crm_leads_etapa_antes on public.crm_leads;
-- Sem "of etapa": a etapa também muda por dentro de outro gatilho (diagnóstico), sem estar no UPDATE.
create trigger crm_leads_etapa_antes before insert or update on public.crm_leads
  for each row execute function public.crm_etapa_registrar();
drop trigger if exists crm_leads_etapa_depois on public.crm_leads;
create trigger crm_leads_etapa_depois after insert or update on public.crm_leads
  for each row execute function public.crm_etapa_historico();

-- 3) Mudanças automáticas -------------------------------------------------------------------
-- a) Mensagem RECEBIDA no WhatsApp: novo/abordado → em conversa
create or replace function public.crm_auto_whatsapp() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.event_kind = 'message' and new.direction = 'entrada' and new.lead_id is not null then
    update public.crm_leads set etapa = 'respondeu', etapa_fonte = 'whatsapp', etapa_em = coalesce(new.occurred_at, now())
     where id = new.lead_id and coalesce(etapa, 'novo') in ('novo', 'abordado');
  end if;
  return null;
end $$;
drop trigger if exists crm_whatsapp_auto_etapa on public.crm_whatsapp_events;
create trigger crm_whatsapp_auto_etapa after insert on public.crm_whatsapp_events
  for each row execute function public.crm_auto_whatsapp();

-- b) Data de diagnóstico preenchida: → sessão (se ainda não passou dela)
create or replace function public.crm_auto_diagnostico() returns trigger language plpgsql as $$
begin
  if new.diagnostico_em is not null and (tg_op = 'INSERT' or old.diagnostico_em is null)
     and coalesce(new.etapa, 'novo') in ('novo', 'abordado', 'respondeu') then
    new.etapa := 'sessao'; new.etapa_fonte := 'diagnostico'; new.etapa_em := new.diagnostico_em;
  end if;
  return new;
end $$;
drop trigger if exists crm_leads_auto_diagnostico on public.crm_leads;
create trigger crm_leads_auto_diagnostico before insert or update of diagnostico_em on public.crm_leads
  for each row execute function public.crm_auto_diagnostico();
-- (roda antes do crm_leads_etapa_antes por ordem alfabética: "auto" < "etapa")

-- c) Matrícula nova (compra na Voomp ou liberação): lead com o mesmo e-mail → aluno.
--    Comprador que não estava no CRM entra como lead novo, origem compra_direta.
create or replace function public.crm_auto_matricula() returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if new.email is null or new.email = '' then return null; end if;
  update public.crm_leads set etapa = 'aluno', etapa_fonte = 'matricula', etapa_em = coalesce(new.liberado_em, now()),
         produto = coalesce(produto, new.produto_slug)
   where lower(email) = lower(new.email) and coalesce(etapa, 'novo') <> 'aluno';
  get diagnostics n = row_count;
  if n = 0 and not exists (select 1 from public.crm_leads where lower(email) = lower(new.email)) then
    insert into public.crm_leads (email, origem, origem_detalhe, status, etapa, etapa_fonte, etapa_em, produto)
    values (lower(new.email), 'compra_direta', 'Comprou sem passar pelo CRM', 'fechou', 'aluno', 'matricula', coalesce(new.liberado_em, now()), new.produto_slug);
  end if;
  return null;
end $$;
drop trigger if exists matriculas_auto_crm on public.matriculas;
create trigger matriculas_auto_crm after insert on public.matriculas
  for each row execute function public.crm_auto_matricula();

-- 4) Acesso: só a Karol, pelo login da área de membros (o resto continua só pelo servidor) -----
alter table public.crm_etapas enable row level security;
do $$
declare t text;
begin
  foreach t in array array['crm_leads', 'crm_etapas', 'crm_followups'] loop
    execute format('drop policy if exists "so a karol" on public.%I', t);
    execute format($p$create policy "so a karol" on public.%I for all to authenticated
      using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
      with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')$p$, t);
  end loop;
end $$;
drop policy if exists "karol le whatsapp" on public.crm_whatsapp_events;
create policy "karol le whatsapp" on public.crm_whatsapp_events for select to authenticated
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');
grant select, insert, update, delete on public.crm_leads, public.crm_etapas, public.crm_followups to authenticated;
grant select on public.crm_whatsapp_events to authenticated;
revoke all on public.crm_etapas from anon;

-- 5) Etapa inicial dos leads que já existem (migração, uma vez só) ----------------------------
do $$
begin
  perform set_config('crm.sem_historico', 'sim', true);
  update public.crm_leads l set
    etapa = case
      when exists (select 1 from public.matriculas m where lower(m.email) = lower(l.email)) or l.status = 'fechou' then 'aluno'
      when l.status = 'desistiu' then 'perdido'
      when l.diagnostico_em is not null or l.origem = 'sessao_estrategica' then 'sessao'
      when l.status in ('em_conversa', 'follow_up_marcado') then 'respondeu'
      else 'novo' end,
    etapa_fonte = 'migracao',
    etapa_em = case
      when l.diagnostico_em is not null and l.status not in ('fechou', 'desistiu') then l.diagnostico_em
      else coalesce(l.updated_at, l.created_at) end
  where l.etapa is null;
  perform set_config('crm.sem_historico', '', true);
end $$;

insert into public.crm_etapas (lead_id, etapa, em, fonte, aproximada)
select id, etapa, etapa_em, 'migracao', true from public.crm_leads l
 where etapa_fonte = 'migracao' and not exists (select 1 from public.crm_etapas e where e.lead_id = l.id);

alter table public.crm_leads alter column etapa set default 'novo';
alter table public.crm_leads alter column etapa set not null;
