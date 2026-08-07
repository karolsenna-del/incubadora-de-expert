# Contratos — Incubadora de Expert

> Criado: 06/08/2026 (Companion, a pedido da Karol). Fonte dos serviços/preços: `business/campanhas/crm-reativacao-leads/arsenal-vendas-closer.md` e `docs/knowledge/expert-business/produto/ecossistema-ofertas-jul2026.md`.

## ⚠️ Aviso importante

Estes documentos foram redigidos por IA como **ponto de partida estruturado**, não como peça jurídica validada. Antes de usar qualquer um deles com um cliente real:

1. **Faça revisar por um advogado** — principalmente as cláusulas de cancelamento/reembolso (item 9.2 dos Termos Gerais) e multa por inadimplência (item 10.1), já preenchidas com valores-padrão de mercado (reembolso proporcional menos 20% de custo administrativo; multa de 2% — limite do CDC para relação de consumo; suspensão após 5 dias úteis de atraso). São sugestões razoáveis, não confirmadas por advogado.
2. **Todos os colchetes fixos e as 3 decisões de negócio já estão fechados** (endereço da sede, foro, parcelamento da Individual, prazo do cashback do Diagnóstico, prazo de acesso do Expert360 — todos preenchidos 07/08, decisões da Karol). Os dados do CLIENTE (nome, CPF, endereço, e-mail, telefone) continuam como linhas em branco preenchidas na hora, direto no ZapSign, por quem monta o envio (ver seção "Versão branded" abaixo) — isso é intencional, não pendência.
3. **1 pendência menor ainda em aberto**, não bloqueia o resto: prazo de liberação de acesso do Expert360º após o pagamento (`07-expert360-termos-de-compra.md`, cláusula 3.1 — hoje com exemplo "24 horas úteis" entre colchetes). Baixo risco, dá pra confirmar quando quiser.

## Estrutura

- **`00-termos-gerais-prestacao-servicos.md`** — Anexo I, cláusulas comuns a todos os contratos de mentoria abaixo (obrigações, propriedade intelectual, LGPD, cancelamento, foro). Todo contrato específico referencia este documento em vez de repetir as cláusulas.
- **`01` a `06`** — um contrato por serviço de mentoria/consultoria (Método Express, Método VIP, Sprint do Método, Grupo, Individual, Diagnóstico Ferramentas). Cada um traz só o que muda: objeto, entregáveis, prazo e valor.
- **`07-expert360-termos-de-compra.md`** — formato diferente dos demais: como o Expert360º é vendido por checkout automatizado (sem contato pessoal antes da compra), é um Termo de Compra e Licença de Uso, pensado pra ir na própria página de vendas/checkout com aceite por checkbox, não um contrato assinado nos dois lados.
- **`08-aditivo-continuacao-pos-sprint.md`** — aditivo pra quem já fez o Sprint do Método e quer continuar pro Grupo ou Individual, com o desconto acordado.

## Por que esse formato (1 base + 1 por serviço)

Evita repetir as mesmas 13 cláusulas em 7 documentos — se uma cláusula geral mudar (ex: política de cancelamento), edita só o Termos Gerais, não os 7 contratos. Se o preço de um serviço mudar, edita só o contrato daquele serviço.

## Dado fixo em todos os contratos

**CONTRATADA:** Gestão pra Tudo - Karoline Franzini de Carvalho Senna — CNPJ 38.431.977/0001-36, com sede em Rio Negro, nº 375, Casa 12, CEP 79023-041, Campo Grande/MS (mesma chave PIX usada hoje pra fechar Express/VIP/Sprint/Diagnóstico Ferramentas, conforme arsenal de vendas). Foro eleito: Campo Grande/MS.

## Versão branded (PDF) — `pdf/`

Cada um dos 9 documentos `.md` acima tem uma versão formatada na identidade visual da Incubadora de Expert (mesma paleta e fonte das páginas de venda reais: preto `#0B0B0C`, laranja `#FF6B1A`, fonte Sora) em `pdf/*.pdf` — capa com o nome do serviço, cláusulas com destaque em laranja, tabelas com cabeçalho escuro, Anexo I anexado automaticamente com divisória própria antes do bloco de assinatura, rodapé com numeração de página.

**Gerado por:** `scripts/gerar-pdf-contratos.py` (Python, reaproveita `python-docx`/regras de markdown já usadas no `converter-md-para-docx.py` do `business/processos/scripts/`) + Playwright pra exportar o PDF final. Os `.pdf` em `pdf/` são o que efetivamente sobe no ZapSign (ver `business/processos/assinatura-contratos-zapsign.md`) — os `.html` na mesma pasta são intermediários do processo, podem ser ignorados/apagados a qualquer momento.

**Se o conteúdo de qualquer contrato mudar** (preço, cláusula, endereço preenchido): editar o `.md` de origem e rodar `python scripts/gerar-pdf-contratos.py` de novo pra atualizar os HTMLs — o PDF final precisa ser regerado via Playwright (abrir cada HTML e exportar), não é um passo único automatizado ainda.

## Próximos passos sugeridos

1. Advogado revisa a peça jurídica (cláusulas, percentuais, enquadramento) — único bloqueio real que resta antes de usar com cliente de verdade.
2. Confirmar o prazo de liberação de acesso do Expert360º (única pendência menor em aberto).
3. Fluxo de assinatura já documentado e testado na prática: `business/processos/assinatura-contratos-zapsign.md` (ZapSign, preenchimento manual por quem monta o envio — não pelo cliente, testado 07/08).
