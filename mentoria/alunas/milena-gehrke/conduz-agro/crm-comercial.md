# CRM Comercial Conduz Agro
**Ferramenta do Portfólio Estratégico — Google Sheets**
*Milena usa esta planilha pra acompanhar produtores rurais prospectados, o pipeline até o fechamento, o financeiro de cada cliente e a reativação anual pra atualização de documentação.*

> Adaptado do **Rastreador de Leads** do próprio Expert360º da Milena (`M3.5 - Meu Rastreador de Leads`), com 2 abas em vez de 1: a lógica de pipeline vem de lá, o financeiro e a reativação anual são novos, específicos do negócio de regularização.
> **Escopo:** só a camada comercial (prospecção → fechamento → financeiro) e a reativação. A execução do serviço em si (documentação, andamento técnico do caso) fica com as ferramentas de condução de caso do método (Mapa do Caso, Destrava Condução) — não duplicado aqui.

---

## Como usar

1. Crie 1 arquivo novo no Google Sheets com 2 abas
2. Importe `crm-comercial-prospeccao.csv` numa aba (renomeie pra "Prospecção") e `crm-comercial-reativacao.csv` na outra (renomeie pra "Reativação")
3. Configure dropdowns (Dados → Validação de dados) nas colunas Origem, Status, Fechou?, Status de Pagamento (aba Prospecção) e Documento a Renovar, Status de Reativação (aba Reativação) com as opções listadas abaixo
4. Na aba Reativação, a coluna **Data Prevista de Reativação** usa fórmula `=EDATE(data_última_atualização; 12)` — calcula 12 meses à frente automaticamente, sem contar manual
5. Apague a linha de exemplo antes de preencher de verdade
6. Atualize o Status sempre que um produtor avançar de etapa — é isso que transforma a planilha em pipeline, não em lista parada

---

## Aba 1 — Prospecção

### Identificação
- **Nome do Produtor** / **Propriedade** (nome ou localização) / **Contato**

### Origem
Dropdown:
1. Indicação de produtor
2. Indicação de colega técnico
3. Prospecção ativa (Milena buscou)
4. Redes sociais / conteúdo
5. Fui procurada — produtor chegou até a Milena sem prospecção ativa

### Pipeline
- **Status** — dropdown: Não abordado → Abordado → Respondeu → Diagnóstico feito → Proposta enviada → Cliente / Não fechou
- **Data Última Interação**
- **Próxima Ação** + **Data Próxima Ação** — motor do follow-up: antes de cada dia de trabalho, filtra por Data Próxima Ação e já sabe quem contatar

### Fechamento e Financeiro
- **Fechou?** — Sim / Não / Em aberto
- **Valor do Serviço**
- **Forma de Pagamento** — À vista / Parcelado / Outro
- **Status de Pagamento** — dropdown: A pagar / Em dia / Atrasado / Quitado
- **Data de Vencimento** — próxima parcela ou pagamento único
- **Valor Pago Até Agora**
- **Data Fechamento**

### Observações
Campo livre.

---

## Aba 2 — Reativação Anual

Documentos de regularização (CAR, CCIR, ITR e afins) vencem e precisam ser atualizados periodicamente — essa aba garante que nenhum cliente fica esquecido depois que o serviço foi entregue.

- **Nome do Produtor** (mesmo nome usado na aba Prospecção, pra cruzar as duas)
- **Documento a Renovar** — dropdown: CAR / CCIR / ITR / Outro
- **Data da Última Atualização**
- **Data Prevista de Reativação** — fórmula `=EDATE([Data da Última Atualização]; 12)`, calcula automático
- **Status de Reativação** — dropdown: A vencer (90+ dias) / Vence em breve (até 90 dias) / Vencido / Contatado / Renovado
- **Observações**

---

## Por que virou planilha (não documento)

Sheets permite filtrar por Status, ordenar por Data Próxima Ação ou Data Prevista de Reativação, e montar um gráfico simples (taxa de fechamento por origem, quantos clientes vencendo no mês, por exemplo). Mesmo racional do Rastreador de Leads do Expert360º — só funciona em planilha.

---

*Conduz Agro — Portfólio Estratégico, ferramenta comercial. Adaptado de Expert360º M3.5.*
