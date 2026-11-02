# Controle Financeiro — documento de trabalho

> Operação Financeiro (cockpit, decidida 01/11/2026). Painel só da Karol dentro da área de membros.

## Decisões (Karol, 01/11/2026)

- Ferramenta: painel na área de membros (`site/financeiro.html`), acesso só por `karolsenna@incubadoradeexpert.com.br`.
- PF x PJ: despesa da empresa paga no cartão pessoal é marcada como PJ; no fim do mês a PJ reembolsa a Karol (relatório = comprovante).
- Empresa: MEI. Teto anual configurável no painel (R$81.000 vigente; PLP 186/2026 com R$140.000 aguardava sanção em 20/10 — conferir).
- Vendas: extrato da Voomp (fonte), mais lançamento à mão das vendas fora da Voomp (pix direto etc.).
- Montagem como operação, sem ocupar vaga de projeto. Ordem: vendas por produto + teto MEI → cartão.

## Conceitos do painel

- **Faturamento** = valor bruto da venda, na data da venda (competência).
- **Recebimento** = valor líquido, na data em que o dinheiro fica disponível (Voomp: "Disponível em"; cartão D+30, pix D+2).
- **Despesa** = data da compra (competência) e data em que o dinheiro sai (caixa; no cartão, vencimento da fatura).
- **Transferência** (saque da Voomp, reembolso PJ→PF) não é receita nem despesa.
- **Teto MEI** = pelo caixa (decisão 02/11): bruto das receitas PJ pela data em que o dinheiro entrou, menos estornos.

## Fontes conferidas (01/11/2026, painel Voomp)

Extrato Voomp 2026 (vendas da Incubadora): Diagnóstico Ferramentas 14/08 (compra de teste, reembolsada 08/09),
Sprint 20/08 (R$1.300), Sprint 14/09 (R$3.000), VIP 24/09, 27/10, 29/10 (R$1.500 cada). Taxa Voomp ~6%.
Saques: 21/09 (R$4.030,90) e 01/10 (R$1.404,16), R$4,99 de taxa cada. Fora: comissões de afiliada de maio
(centavos) e vendas de 2025 de outro negócio (Pós/MBA, Extensão MEC). Exportação da Voomp vai por e-mail;
o extrato na tela pode ser copiado e colado no painel.

## Checklist

- [x] Decisões da Karol
- [x] Ler extrato e vendas da Voomp
- [x] Banco: `sql/financeiro.sql` aplicado pela Karol em 01/11 — conferido: 3 tabelas com RLS, anônimo recusado, faturamento 2026 Voomp R$8.800 (líquido R$8.267,88, bate com o painel da Voomp), teto R$81.000
- [x] Página `financeiro.html` + `js/financeiro.js` + `css/financeiro.css` (equipe, 01/11) — 4 abas: Resumo, Vendas por produto, PF x PJ, Lançamentos
- [x] Revisão (01/11): 50 testes de cálculo/leitura ok; cópia local com os dados reais — números batem com a Voomp (a receber R$2.818,30 = saldo a liberar), celular 375px sem rolagem lateral, importação de fatura OFX ok. Gravação real no banco só testável logada.
- [x] Publicado pela Karol em 01/11 (dpl_9UExH6viiGETuXC3xvnzxAXV8kG2) — conferido no domínio: membros.incubadoradeexpert.com.br/financeiro.html
- [x] Linha "Saldo acumulado" no Resumo (pedido da Karol, 01/11): resultado do mês + saldo anterior, começando com o resultado dos anos anteriores; publicada (dpl_4UWEhgFu36Zau3rxGjBWgcf7ApRV) e conferida no domínio. Saldo 2026 até hoje: R$5.439,60
- [x] Cartão "Saldo acumulado" no topo do Resumo (pedido da Karol, 01/11) — publicado (dpl_2MNtxFxpK99JamJBQmEkbRmqyZVt) e conferido no domínio
- [x] Conta ≠ meio (Karol, 01/11): pix_direto saiu da lista de Conta; pix/cartão/boleto vão em Meio. Contas: voomp, conta_pj, conta_pf, cartao_pf
- [x] Voomp continua como conta (carteira até o saque); saque = transferência Voomp → conta PJ (Karol confirmou o destino, 02/11)
- [x] `sql/financeiro-2.sql` (conta_destino, saques → conta PJ, reembolso de teste com bruto inteiro, 12 comissões de afiliada 2026 = R$2,27) + cartão "Saldo na Voomp" — testado com dados reais: disponível R$0,00 e a liberar R$2.818,30, igual à Voomp. Aplicado e publicado pela Karol em 02/11 (dpl_DULuAAsKoPvkTTMQsbJEPEahZGv7) — conferido: faturamento R$8.802,27, 2 saques → conta PJ, reembolso R$97
- [x] Teste de gravação: Karol lançou a parcela de nov da Milena pelo painel (02/11) — gravou
- [x] Mentoria Individual da Milena: 12x R$700 pix (dia 2, 07/2026 a 06/2027), venda em 02/07/2026 — no banco (5 recebidas, 7 a receber). Parcelas usam origem_id `...-pNN`; Vendas por produto conta só a parcela 1 (publicado dpl_6WgR9b2JrEnWGpFSQkGtbDbsCZHX)
- [x] Teto MEI pelo CAIXA (Karol, 02/11): bruto das receitas PJ pela data em que entrou, menos estornos; mostra 'já entrou' e 'com o que ainda entra este ano'. 2026: R$9.302,27 (11,5%), previsto R$13.002,27 (16,1%). Cartão Faturamento segue por competência. Publicado (dpl_aTDyTYnu6PiLqY6bxrCto9g47KtM) e conferido no domínio
- [x] Receitas fora da Voomp (Karol, 02/11), 19 lançamentos na conta PJ: Dalvelyn Individual 10x R$1.000 desde 11/2025 (dia 01 assumido); Consultoria Elider R$15.799,55 (5 parcelas jan–mai); Karen VIP 2x R$500; Consultoria 80 20 R$2.000; Renata "Seu método em 1h" R$97. Conferido: teto MEI 2026 R$36.198,82 (44,7%), previsto R$39.898,82; faturamento 2026 R$36.098,82
- [x] DAS MEI 2026: 12x R$86,05 (competência = mês, pago dia 20 do mês seguinte, conta PJ), lançado 02/11. Painel não repete despesa sozinho: **lançar o DAS de 2027 em janeiro** (ou quando o valor mudar)
- [x] Faturas Bradesco jan–out/2026 (PDF, lidas pelo Companion em 02/11; 428 compras, todas as 10 fecham com o total do banco): 57 despesas PJ = R$5.309,92 (ferramentas R$3.200,44, Fórmula High Ticket R$2.000, IOF exterior R$72,49, MetaPay R$36,99) no banco, marcadas como reembolsadas (Karol: jan–out acertados; "A empresa te deve" começa em nov/2026). Pessoais não gravadas. Compra Kiwify 26/03 cancelada (estorno = parcelas) ficou fora. 184 regras (19 PJ, 165 PF) pras próximas faturas. Cópias das faturas apagadas
- [ ] Rotina mensal: fatura do cartão (csv/ofx no painel, ou PDF pro Companion), extrato Voomp colado, conferir reembolso PJ → Karol
