-- Financeiro, ajuste 2 (Karol, 01-02/11/2026)
-- 1) Transferência ganha conta de destino; saques da Voomp vão pra conta PJ (confirmado pela Karol).
-- 2) Reembolso da compra de teste: a Voomp devolveu o bruto inteiro (R$90,19 + R$6,81), a taxa não volta.
-- 3) Comissões de afiliada de 2026 que estavam fora (R$2,27) — extrato Voomp lido em 02/11.
-- Com isso o saldo na Voomp calculado bate com o da Voomp (disponível R$0,00, a liberar R$2.818,30).

alter table public.fin_lancamentos add column if not exists conta_destino text;

update public.fin_lancamentos
   set conta_destino = 'conta_pj', observacao = 'Voomp → conta PJ'
 where origem = 'voomp' and natureza = 'transferencia' and origem_id like 'saque-%';

update public.fin_lancamentos
   set taxa = 0,
       observacao = 'Reembolso da compra de teste: a Voomp devolveu o bruto inteiro (a taxa de R$6,81 não volta)'
 where origem = 'voomp' and origem_id = '1761484-reembolso';

insert into public.fin_lancamentos
  (natureza, dono, data_competencia, data_caixa, descricao, produto, conta, meio, valor_bruto, taxa, origem, origem_id, observacao)
values
  ('receita', 'PJ', '2026-04-17', '2026-04-19', 'Comissão Voomp #1564529', 'Comissões de afiliada', 'voomp', 'pix',    0.05, 0, 'voomp', '1564529', null),
  ('receita', 'PJ', '2026-04-17', '2026-04-19', 'Comissão Voomp #1564592', 'Comissões de afiliada', 'voomp', 'pix',    0.05, 0, 'voomp', '1564592', null),
  ('receita', 'PJ', '2026-04-29', '2026-05-01', 'Comissão Voomp #1581998', 'Comissões de afiliada', 'voomp', 'pix',    0.05, 0, 'voomp', '1581998', null),
  ('receita', 'PJ', '2026-05-01', '2026-05-03', 'Comissão Voomp #1585161', 'Comissões de afiliada', 'voomp', 'pix',    0.05, 0, 'voomp', '1585161', null),
  ('receita', 'PJ', '2026-05-02', '2026-06-01', 'Comissão Voomp #1586377', 'Comissões de afiliada', 'voomp', 'cartao', 0.74, 0, 'voomp', '1586377', null),
  ('receita', 'PJ', '2026-05-02', '2026-06-01', 'Comissão Voomp #1586378', 'Comissões de afiliada', 'voomp', 'cartao', 0.49, 0, 'voomp', '1586378', null),
  ('receita', 'PJ', '2026-05-07', '2026-05-09', 'Comissão Voomp #1595882', 'Comissões de afiliada', 'voomp', 'pix',    0.74, 0, 'voomp', '1595882', null),
  ('receita', 'PJ', '2026-05-15', '2026-05-17', 'Comissão Voomp #1610494', 'Comissões de afiliada', 'voomp', 'pix',    0.02, 0, 'voomp', '1610494', null),
  ('receita', 'PJ', '2026-05-15', '2026-05-17', 'Comissão Voomp #1610600', 'Comissões de afiliada', 'voomp', 'pix',    0.02, 0, 'voomp', '1610600', null),
  ('receita', 'PJ', '2026-05-15', '2026-05-17', 'Comissão Voomp #1610621', 'Comissões de afiliada', 'voomp', 'pix',    0.02, 0, 'voomp', '1610621', null),
  ('receita', 'PJ', '2026-05-15', '2026-05-18', 'Comissão Voomp #1611192', 'Comissões de afiliada', 'voomp', 'pix',    0.02, 0, 'voomp', '1611192', null),
  ('receita', 'PJ', '2026-05-15', '2026-05-18', 'Comissão Voomp #1611233', 'Comissões de afiliada', 'voomp', 'pix',    0.02, 0, 'voomp', '1611233', null)
on conflict (origem, origem_id) do nothing;
