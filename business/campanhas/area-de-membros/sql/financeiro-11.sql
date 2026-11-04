-- Financeiro, ajuste 11 (Karol, 03/11/2026): despesas recorrentes que o painel repete sozinho todo mês.
-- O painel, ao abrir, gera os meses que faltam (de "gerado_ate" até o mês atual) e avança "gerado_ate":
-- lançamento apagado à mão não volta. Parcelado: para quando chega na última parcela.
create table if not exists public.fin_recorrentes (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  dono text not null check (dono in ('PJ', 'PF')),
  categoria text,
  conta text not null default 'cartao_pf',
  meio text,
  valor numeric(12,2) not null check (valor > 0),
  dia smallint not null check (dia between 1 and 31),
  inicio date not null,                 -- 1º mês que o painel gera (dia 1 do mês)
  parcela_inicial smallint,             -- parcelado: número da parcela do mês "inicio"
  parcelas_total smallint,              -- parcelado: última parcela (null = sem fim)
  gerado_ate date,                      -- último mês já gerado (dia 1)
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);
alter table public.fin_recorrentes enable row level security;
drop policy if exists "so a karol" on public.fin_recorrentes;
create policy "so a karol" on public.fin_recorrentes for all to authenticated
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
  with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');
revoke all on public.fin_recorrentes from anon;
-- As 3 da fatura Nubank (nov/2026 já lançado à mão no ajuste 10: começa em dez)
insert into public.fin_recorrentes (descricao, dono, categoria, conta, meio, valor, dia, inicio, parcela_inicial, parcelas_total, gerado_ate)
select * from (values
  ('Seguro de vida', 'PF', 'Casa e contas', 'cartao_pf', 'cartao', 18.83, 15, '2026-12-01'::date, null::smallint, null::smallint, '2026-11-01'::date),
  ('APPLE.COM/BILL', 'PJ', 'Ferramentas e software', 'cartao_pf', 'cartao', 19.90, 15, '2026-12-01'::date, null, null, '2026-11-01'::date),
  ('Curso de marketing', 'PJ', 'Educação', 'cartao_pf', 'cartao', 39.96, 15, '2026-12-01'::date, 10, 12, '2026-11-01'::date)
) v where not exists (select 1 from public.fin_recorrentes);
select json_agg(json_build_object('d',descricao,'dono',dono,'v',valor,'ini',inicio,'parc',parcela_inicial,'tot',parcelas_total)) from public.fin_recorrentes;
