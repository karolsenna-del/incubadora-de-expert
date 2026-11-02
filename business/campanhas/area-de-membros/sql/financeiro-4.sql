-- Financeiro, ajuste 4 (Karol, 02/11/2026): a conta PJ tem R$700,49 hoje (inclui os R$700 da Milena de nov);
-- o resto já foi repassado pra Karol (PF). Repasse acumulado = caixa calculado da PJ (R$21.488,76) − R$700,49.
-- Lançado numa linha só, na data de hoje (Karol não detalhou as datas dos repasses).
insert into public.fin_lancamentos
  (natureza, dono, data_competencia, data_caixa, descricao, categoria, conta, conta_destino, meio, valor_bruto, taxa, origem, origem_id, observacao)
values
  ('transferencia', 'PJ', '2026-11-02', '2026-11-02', 'Repasse PJ → Karol (acumulado até 02/11/2026)', 'Repasse ao sócio', 'conta_pj', 'conta_pf', 'pix', 20788.27, 0, 'manual', 'repasse-ate-2026-11-02',
   'Karol (02/11): conta PJ com R$700,49 hoje; o resto foi repassado pra PF. Valor = caixa calculado R$21.488,76 − R$700,49')
on conflict (origem, origem_id) do nothing;
