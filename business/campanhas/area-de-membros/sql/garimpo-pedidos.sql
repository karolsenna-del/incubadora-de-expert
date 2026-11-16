-- Pedidos de garimpo feitos pelo botão da aba Abordar (Karol, 13/11/2026).
-- O painel grava o pedido; o robô local (agents/garimpeiro-leads-instagram/tools/pedidos.mjs) pega,
-- roda o Garimpeiro e grava o resultado. Só a Karol lê e grava pelo painel.

create table if not exists public.garimpo_pedidos (
  id bigint generated always as identity primary key,
  criado_em timestamptz not null default now(),
  termos text[] not null check (cardinality(termos) between 1 and 30),
  quantidade int not null default 50 check (quantidade between 5 and 50),
  status text not null default 'pendente' check (status in ('pendente', 'rodando', 'feito', 'erro', 'cancelado')),
  iniciado_em timestamptz,
  concluido_em timestamptz,
  novos int,
  resumo text
);

alter table public.garimpo_pedidos enable row level security;
drop policy if exists "so a karol" on public.garimpo_pedidos;
create policy "so a karol" on public.garimpo_pedidos for all to authenticated
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
  with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');

-- Semente: a última rodada (25/10/2026, 15h24) vira o "último garimpo" pra o campo já vir preenchido.
insert into public.garimpo_pedidos (criado_em, termos, quantidade, status, iniciado_em, concluido_em, resumo)
select '2026-10-25 15:24-03', array['nutricionista','fisioterapeuta','advogada','fonoaudióloga','psicóloga/psicopedagoga','enfermeira','terapeuta ocupacional','arquiteta'],
       50, 'feito', '2026-10-25 15:24-03', '2026-10-25 15:24-03', 'Rodada feita à mão antes do botão existir.'
where not exists (select 1 from public.garimpo_pedidos);
