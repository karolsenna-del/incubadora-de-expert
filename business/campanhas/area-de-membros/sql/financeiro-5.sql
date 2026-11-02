-- Financeiro, ajuste 5 (Karol, 02/11/2026): a Karol zera a conta PJ no fim de cada mês (tudo pra PF); hoje a conta tem R$700,49.
-- Troca o repasse único (financeiro-4) por um repasse no último dia de cada mês = movimento da conta no mês.
-- Mês negativo (despesa > entrada) vira aporte: a Karol cobriu do bolso. Out/2026 deixa R$0,49 na conta (o resto dos R$700,49 é a Milena de nov).
delete from public.fin_lancamentos where origem='manual' and origem_id='repasse-ate-2026-11-02';
insert into public.fin_lancamentos (natureza,dono,data_competencia,data_caixa,descricao,categoria,conta,conta_destino,valor_bruto,origem_id,origem,observacao)
select v.*, 'manual', 'Fim do mês: conta PJ zerada (Karol, 02/11); valor = movimento da conta no mês' from (values
('transferencia','PJ','2025-11-30'::date,'2025-11-30'::date,'Repasse PJ → Karol (11/2025)','Repasse ao sócio','conta_pj','conta_pf',1000.00,'repasse-2025-11'),
('transferencia','PJ','2025-12-31'::date,'2025-12-31'::date,'Repasse PJ → Karol (12/2025)','Repasse ao sócio','conta_pj','conta_pf',1000.00,'repasse-2025-12'),
('transferencia','PJ','2026-01-31'::date,'2026-01-31'::date,'Repasse PJ → Karol (01/2026)','Repasse ao sócio','conta_pj','conta_pf',1810.24,'repasse-2026-01'),
('transferencia','PJ','2026-02-28'::date,'2026-02-28'::date,'Repasse PJ → Karol (02/2026)','Repasse ao sócio','conta_pj','conta_pf',2692.92,'repasse-2026-02'),
('transferencia','PJ','2026-03-31'::date,'2026-03-31'::date,'Repasse PJ → Karol (03/2026)','Repasse ao sócio','conta_pj','conta_pf',2488.50,'repasse-2026-03'),
('transferencia','PJ','2026-04-30'::date,'2026-04-30'::date,'Repasse PJ → Karol (04/2026)','Repasse ao sócio','conta_pj','conta_pf',2585.31,'repasse-2026-04'),
('transferencia','PJ','2026-05-31'::date,'2026-05-31'::date,'Repasse PJ → Karol (05/2026)','Repasse ao sócio','conta_pj','conta_pf',5685.85,'repasse-2026-05'),
('transferencia','PJ','2026-06-30'::date,'2026-06-30'::date,'Aporte Karol → PJ (06/2026): cobriu despesa do bolso','Repasse ao sócio','conta_pf','conta_pj',876.07,'aporte-2026-06'),
('transferencia','PJ','2026-07-31'::date,'2026-07-31'::date,'Repasse PJ → Karol (07/2026)','Repasse ao sócio','conta_pj','conta_pf',522.29,'repasse-2026-07'),
('transferencia','PJ','2026-08-31'::date,'2026-08-31'::date,'Repasse PJ → Karol (08/2026)','Repasse ao sócio','conta_pj','conta_pf',608.38,'repasse-2026-08'),
('transferencia','PJ','2026-09-30'::date,'2026-09-30'::date,'Repasse PJ → Karol (09/2026)','Repasse ao sócio','conta_pj','conta_pf',3938.06,'repasse-2026-09'),
('transferencia','PJ','2026-10-31'::date,'2026-10-31'::date,'Aporte Karol → PJ (10/2026): cobriu despesa do bolso','Repasse ao sócio','conta_pf','conta_pj',667.21,'aporte-2026-10')
) v on conflict (origem, origem_id) do nothing;
-- repasse líquido total 20788.27
