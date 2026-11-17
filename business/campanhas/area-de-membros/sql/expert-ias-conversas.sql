-- Expert-IAs: conversas salvas por aluno e "Meu contexto" (17/11/2026).
-- Cada aluno lê e grava só as suas; a dona da plataforma lê todas (mesma regra de acesso da tabela crm_leads).
create table if not exists ia_conversas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  agente_id text not null,
  titulo text,
  mensagens jsonb not null default '[]'::jsonb,
  resumo text,               -- resumo da conversa anterior, quando esta nasceu de "continuar em conversa nova"
  criada_em timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);
create index if not exists ia_conversas_user_agente on ia_conversas (user_id, agente_id, atualizada_em desc);

create table if not exists ia_contexto (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  persona text,
  posicionamento text,
  processo text,
  outros text,
  atualizado_em timestamptz not null default now()
);

alter table ia_conversas enable row level security;
alter table ia_contexto enable row level security;
drop policy if exists "aluno cuida das suas conversas" on ia_conversas;
create policy "aluno cuida das suas conversas" on ia_conversas for all using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "aluno cuida do seu contexto" on ia_contexto;
create policy "aluno cuida do seu contexto" on ia_contexto for all using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update, delete on ia_conversas, ia_contexto to authenticated;

-- leitura da dona: copia a condição da política "so a karol" de crm_leads
do $$
declare cond text;
begin
  select qual into cond from pg_policies where tablename = 'crm_leads' and policyname = 'so a karol';
  execute 'drop policy if exists "dona le as conversas" on ia_conversas';
  execute format('create policy "dona le as conversas" on ia_conversas for select using (%s)', cond);
  execute 'drop policy if exists "dona le os contextos" on ia_contexto';
  execute format('create policy "dona le os contextos" on ia_contexto for select using (%s)', cond);
end $$;
