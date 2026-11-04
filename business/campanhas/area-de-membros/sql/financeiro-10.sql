-- Financeiro, ajuste 10 (Karol, 03/11/2026): fatura do cartão Nubank com vencimento 15/11/2026 (3 itens informados por ela).
-- Data da compra não informada: usa o vencimento (parcela já entra no mês da fatura, decisão A). Despesa PJ fica pendente de reembolso.
insert into public.fin_lancamentos (natureza,dono,data_competencia,data_caixa,descricao,categoria,conta,meio,valor_bruto,taxa,origem,origem_id,observacao) values
('despesa','PF','2026-11-15','2026-11-15','Seguro de vida','Casa e contas','cartao_pf','cartao',18.83,0,'fatura','nubank-pf-2026-11-15-1','Fatura Nubank; recorrente (Karol, 03/11)'),
('despesa','PJ','2026-11-15','2026-11-15','APPLE.COM/BILL','Ferramentas e software','cartao_pf','cartao',19.90,0,'fatura','nubank-2026-11-15-1','Fatura Nubank; recorrente (Karol, 03/11)'),
('despesa','PJ','2026-11-15','2026-11-15','Curso de marketing (parcela 09/12)','Educação','cartao_pf','cartao',39.96,0,'fatura','nubank-2026-11-15-2','Fatura Nubank (Karol, 03/11)')
on conflict (origem, origem_id) do nothing;
select json_agg(json_build_object('d',descricao,'dono',dono,'v',valor_bruto,'reemb',reembolso_em)) from public.fin_lancamentos where origem_id like 'nubank%';
