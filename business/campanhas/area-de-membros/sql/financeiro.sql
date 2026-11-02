-- Controle financeiro da Karol (01/11/2026). Painel: site/financeiro.html
-- Acesso: só karolsenna@incubadoradeexpert.com.br (RLS). Nenhum aluno lê ou grava.
-- Doc de trabalho: business/financeiro/controle-financeiro.md

create table if not exists public.fin_lancamentos (
  id               uuid primary key default gen_random_uuid(),
  natureza         text not null check (natureza in ('receita', 'estorno', 'despesa', 'transferencia')),
  dono             text not null default 'PJ' check (dono in ('PJ', 'PF')),
  data_competencia date not null,          -- venda ou compra
  data_caixa       date,                   -- dinheiro disponível/saiu; null = a receber / a pagar
  descricao        text not null,
  produto          text,                   -- só receitas/estornos
  categoria        text,                   -- despesas
  conta            text,                   -- onde o dinheiro está: voomp, conta_pj, conta_pf, cartao_pf (pix/cartão vão em meio)
  meio             text,                   -- pix, cartao, boleto...
  valor_bruto      numeric(12,2) not null check (valor_bruto >= 0),
  taxa             numeric(12,2) not null default 0 check (taxa >= 0),
  valor_liquido    numeric(12,2) generated always as (valor_bruto - taxa) stored,
  origem           text not null default 'manual',  -- manual, voomp, fatura
  origem_id        text,                   -- id da venda na Voomp, linha da fatura...
  reembolso_em     date,                   -- despesa PJ paga com dinheiro PF: dia em que a PJ devolveu
  observacao       text,
  criado_em        timestamptz not null default now(),
  unique (origem, origem_id)
);

create index if not exists fin_lanc_comp_idx on public.fin_lancamentos (data_competencia);
create index if not exists fin_lanc_caixa_idx on public.fin_lancamentos (data_caixa);

-- Regras que o painel aprende na fatura: "CANVA" -> PJ, Ferramentas
create table if not exists public.fin_regras (
  padrao        text primary key,          -- trecho da descrição, em maiúsculas
  dono          text not null check (dono in ('PJ', 'PF')),
  categoria     text,
  atualizado_em timestamptz not null default now()
);

create table if not exists public.fin_config (
  chave text primary key,
  valor text not null
);

alter table public.fin_lancamentos enable row level security;
alter table public.fin_regras      enable row level security;
alter table public.fin_config      enable row level security;

do $$
declare t text;
begin
  foreach t in array array['fin_lancamentos', 'fin_regras', 'fin_config'] loop
    execute format('drop policy if exists "so a karol" on public.%I', t);
    execute format($p$create policy "so a karol" on public.%I for all to authenticated
      using ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')
      with check ((auth.jwt() ->> 'email') = 'karolsenna@incubadoradeexpert.com.br')$p$, t);
  end loop;
end $$;

revoke all on public.fin_lancamentos, public.fin_regras, public.fin_config from anon;

insert into public.fin_config (chave, valor) values
  ('teto_mei_anual', '81000'),
  ('teto_mei_obs', 'R$81.000 vigente; PLP 186/2026 (R$140.000) aguardava sanção em 20/10/2026 — conferir')
on conflict (chave) do nothing;

-- Extrato Voomp 2026 (lido no painel da Voomp em 01/11/2026). Sem nome de cliente aqui de propósito.
insert into public.fin_lancamentos
  (natureza, dono, data_competencia, data_caixa, descricao, produto, conta, meio, valor_bruto, taxa, origem, origem_id, observacao)
values
  ('receita', 'PJ', '2026-08-14', '2026-08-16', 'Venda Voomp #1761484', 'Diagnóstico Ferramentas', 'voomp', 'pix',    97.00,   6.81, 'voomp', '1761484', 'Compra de teste da Karol (14/08), reembolsada em 08/09'),
  ('estorno', 'PJ', '2026-09-08', '2026-09-08', 'Reembolso Voomp #1761484', 'Diagnóstico Ferramentas', 'voomp', 'pix', 97.00,   6.81, 'voomp', '1761484-reembolso', 'Reembolso da compra de teste'),
  ('receita', 'PJ', '2026-08-20', '2026-09-19', 'Venda Voomp #1771428', 'Sprint do Método',        'voomp', 'cartao', 1300.00, 78.87, 'voomp', '1771428', 'Oferta Sprint do Método - Alunos, 12x'),
  ('receita', 'PJ', '2026-09-14', '2026-09-16', 'Venda Voomp #1816284', 'Sprint do Método',        'voomp', 'pix',    3000.00, 180.70, 'voomp', '1816284', null),
  ('receita', 'PJ', '2026-09-24', '2026-09-26', 'Venda Voomp #1830031', 'Método VIP',              'voomp', 'pix',    1500.00, 90.85, 'voomp', '1830031', null),
  ('receita', 'PJ', '2026-10-27', '2026-11-26', 'Venda Voomp #1876115', 'Método VIP',              'voomp', 'cartao', 1500.00, 90.85, 'voomp', '1876115', '12x'),
  ('receita', 'PJ', '2026-10-29', '2026-11-29', 'Venda Voomp #1879697', 'Método VIP',              'voomp', 'cartao', 1500.00, 90.85, 'voomp', '1879697', '12x'),
  ('transferencia', 'PJ', '2026-09-21', '2026-09-21', 'Saque da Voomp', null, 'voomp', 'pix', 4030.90, 0, 'voomp', 'saque-2026-09-21', 'Conta de destino não registrada'),
  ('despesa',  'PJ', '2026-09-21', '2026-09-21', 'Taxa de saque Voomp', null, 'voomp', null, 4.99, 0, 'voomp', 'taxa-saque-2026-09-21', null),
  ('transferencia', 'PJ', '2026-10-01', '2026-10-01', 'Saque da Voomp', null, 'voomp', 'pix', 1404.16, 0, 'voomp', 'saque-2026-10-01', 'Conta de destino não registrada'),
  ('despesa',  'PJ', '2026-10-01', '2026-10-01', 'Taxa de saque Voomp', null, 'voomp', null, 4.99, 0, 'voomp', 'taxa-saque-2026-10-01', null)
on conflict (origem, origem_id) do nothing;

update public.fin_lancamentos set categoria = 'Taxas e tarifas' where origem_id like 'taxa-saque-%' and categoria is null;
