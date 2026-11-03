-- Financeiro, ajuste 8 (Karol, 03/11/2026): venda da Voomp entra sozinha pelo aviso (webhook).
-- Guarda cópia crua de todo aviso recebido, pra conferir os campos de valor/taxa/liberação na 1ª venda real.
create table if not exists public.fin_voomp_avisos (
  id bigserial primary key,
  recebido_em timestamptz not null default now(),
  trigger text,
  venda_id text,
  payload jsonb not null,
  lancado boolean not null default false,
  erro text
);
alter table public.fin_voomp_avisos enable row level security;
drop policy if exists "so a karol" on public.fin_voomp_avisos;
create policy "so a karol" on public.fin_voomp_avisos for select to authenticated
  using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br');
revoke all on public.fin_voomp_avisos from anon;
select json_build_object('tabela', to_regclass('public.fin_voomp_avisos')::text, 'rls', (select relrowsecurity from pg_class where oid = 'public.fin_voomp_avisos'::regclass));
