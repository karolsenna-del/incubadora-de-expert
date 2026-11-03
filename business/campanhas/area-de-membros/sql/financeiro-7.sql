-- Financeiro, ajuste 7 (Karol, 02/11/2026): o David pagou direto na conta PF dela (receita da PJ que caiu na PF).
-- Desfaz o acréscimo do ajuste 6 nos repasses e marca os recebimentos do David como conta_pf.
update public.fin_lancamentos set valor_bruto = valor_bruto - x.add, observacao = replace(observacao, ' (+ David, ajuste 6)', '')
from (values ('repasse-2026-02',1401.89),('repasse-2026-03',1400.55),('repasse-2026-04',1400.03),('repasse-2026-05',1400.02),('repasse-2026-07',1397.26)) x(id,add)
where origem='manual' and origem_id = x.id and observacao like '%ajuste 6%';
update public.fin_lancamentos set conta='conta_pf', observacao='Informado pela Karol em 02/11; faturamento = recebimento; pago direto na conta PF da Karol'
where origem='manual' and origem_id like 'david-individual-2026-m%';
select json_build_object(
 'repasses', (select json_object_agg(origem_id, valor_bruto) from public.fin_lancamentos where origem_id in ('repasse-2026-02','repasse-2026-03','repasse-2026-04','repasse-2026-05','repasse-2026-07')),
 'david', (select json_agg(json_build_object('d',data_caixa,'v',valor_bruto,'c',conta) order by data_caixa) from public.fin_lancamentos where origem_id like 'david-%'));
