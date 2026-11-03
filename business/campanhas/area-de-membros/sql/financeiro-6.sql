-- Financeiro, ajuste 6 (Karol, 02/11/2026): recebimentos do aluno David (Incubadora Individual) que faltavam.
-- Faturamento e recebimento na mesma data (recorrente, como a Elider: cada mês conta como venda). Entrou na conta PJ.
insert into public.fin_lancamentos (natureza,dono,data_competencia,data_caixa,descricao,conta,valor_bruto,taxa,origem,origem_id,observacao)
select 'receita','PJ',v.d::date,v.d::date,'Incubadora Individual — David (mês '||v.n||')','conta_pj',v.val,0,'manual','david-individual-2026-m'||lpad(v.n::text,2,'0'),'Informado pela Karol em 02/11; faturamento = recebimento'
from (values (1,'2026-02-10',1401.89),(2,'2026-03-12',1400.55),(3,'2026-04-10',1400.03),(4,'2026-05-20',1400.02),(5,'2026-07-08',755.29),(6,'2026-07-31',641.97)) v(n,d,val)
on conflict (origem, origem_id) do nothing;
-- O dinheiro também foi repassado pra PF no fim do mês: soma no repasse de cada mês (saldo da conta PJ continua zerando).
update public.fin_lancamentos set valor_bruto = valor_bruto + x.add, observacao = observacao || ' (+ David, ajuste 6)'
from (values ('repasse-2026-02',1401.89),('repasse-2026-03',1400.55),('repasse-2026-04',1400.03),('repasse-2026-05',1400.02),('repasse-2026-07',1397.26)) x(id,add)
where origem='manual' and origem_id = x.id and observacao not like '%ajuste 6%';
select json_build_object(
 'david', (select sum(valor_bruto) from public.fin_lancamentos where origem_id like 'david-individual-%'),
 'repasses', (select json_object_agg(origem_id, valor_bruto) from public.fin_lancamentos where origem_id in ('repasse-2026-02','repasse-2026-03','repasse-2026-04','repasse-2026-05','repasse-2026-07')),
 'fat2026', (select sum(valor_bruto) from public.fin_lancamentos where natureza='receita' and dono='PJ' and data_competencia between '2026-01-01' and '2026-12-31'),
 'caixa2026', (select sum(valor_bruto) from public.fin_lancamentos where natureza='receita' and dono='PJ' and data_caixa between '2026-01-01' and '2026-12-31'),
 'total', (select count(*) from public.fin_lancamentos));
