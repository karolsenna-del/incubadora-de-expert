-- Financeiro, ajuste 3 (Karol, 02/11/2026)
-- Consultoria Elider é faturamento recorrente (mensal), não venda parcelada:
-- cada pagamento é o faturamento do próprio mês (competência = data do recebimento).
update public.fin_lancamentos
   set data_competencia = data_caixa,
       descricao = replace(descricao, '(parcela ', '(mês '),
       observacao = 'Faturamento recorrente mensal (Karol, 02/11)'
 where origem = 'manual' and origem_id like 'elider-consultoria-2026-01-p%';

select origem_id, data_competencia, data_caixa, descricao, valor_bruto
  from public.fin_lancamentos where origem_id like 'elider-consultoria-%' order by data_caixa;

-- Recorrente: cada mês conta como 1 faturamento em "Vendas por produto" (sufixo -mNN, não -pNN de parcela).
update public.fin_lancamentos
   set origem_id = replace(origem_id, '-2026-01-p', '-2026-m')
 where origem = 'manual' and origem_id like 'elider-consultoria-2026-01-p%';
