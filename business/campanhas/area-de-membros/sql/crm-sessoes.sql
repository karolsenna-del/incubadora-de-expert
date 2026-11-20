-- Sessões do comercial (18/11/2026): cada horário marcado é uma linha.
-- Remarcar = a linha velha vira 'remarcada' e nasce outra 'marcada' apontando pra ela.
-- Faltou = 'faltou' (o lead fica em Sessão, com aviso de remarcar). Conta: realizadas e faltas por semana.
create table if not exists public.crm_sessoes (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references public.crm_leads(id) on delete set null,
  nome        text,
  quando      timestamptz not null,
  status      text not null default 'marcada' check (status in ('marcada', 'realizada', 'faltou', 'remarcada', 'cancelada')),
  remarcada_de uuid references public.crm_sessoes(id) on delete set null,
  fonte       text not null default 'painel',   -- painel | retroativo
  obs         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists crm_sessoes_lead on public.crm_sessoes (lead_id);
create index if not exists crm_sessoes_quando on public.crm_sessoes (quando);

alter table public.crm_sessoes enable row level security;
drop policy if exists "so a karol" on public.crm_sessoes;
create policy "so a karol" on public.crm_sessoes for all to authenticated
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
  with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');
grant select, insert, update, delete on public.crm_sessoes to authenticated;
revoke all on public.crm_sessoes from anon;
