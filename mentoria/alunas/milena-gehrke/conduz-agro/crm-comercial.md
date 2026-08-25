# CRM Comercial Conduz Agro
**Ferramenta do Portfólio Estratégico — Google Sheets**
*Planilha pra acompanhar produtores rurais prospectados, o pipeline até o fechamento, o financeiro de cada cliente e a reativação anual pra atualização de documentação. Entregue como template a cada aluno — cada mentorado roda o próprio pipeline com ela, no seu próprio negócio de regularização/crédito rural. Milena também usa a mesma estrutura no negócio dela (foi a origem do adaptado — ver abaixo), mas não é exclusiva dela: é ferramenta do Portfólio, entregue no kit de boas-vindas. Corrigido 23/08/2026 — antes registrada por engano como ferramenta interna, não entregável.*

> Adaptado do **Rastreador de Leads** do próprio Expert360º da Milena (`M3.5 - Meu Rastreador de Leads`), com 2 abas em vez de 1: a lógica de pipeline vem de lá, o financeiro e a reativação anual são novos, específicos do negócio de regularização.
> **Escopo:** só a camada comercial (prospecção → fechamento → financeiro) e a reativação. **O acompanhamento operacional do caso depois de fechado (etapa atual, checkpoints, comunicação com o produtor) tem ferramenta própria — a Central de Condução do Atendimento** (`central-conducao-atendimento.md`), corrigido 24/08. Essa divisão comercial/operacional é intencional, não é a mesma ferramenta com abas a mais.

---

## Como usar

**Arquivo já criado** (24/08) na pasta do Drive, em branco: https://docs.google.com/spreadsheets/d/1fztf30doEE9zV_ZCUtOKv7YDLtubX0mIhzqrf0Msq3o/edit

1. Abre a planilha → **Extensões → Apps Script**
2. Apaga o conteúdo padrão e cola `scripts/apps-script-crm-comercial.gs`
3. Salva, seleciona a função `criarCRMComercial`, clica em **Executar** (▶), autoriza se pedir
4. Aparecem as 2 abas já formatadas ("Prospecção" e "Reativação"), com dropdowns configurados (Origem, Status, Fechou?, Status de Pagamento na Prospecção; Documento a Renovar, Status de Reativação na Reativação) e cor automática por status (atrasado/vencido = vermelho, em dia/renovado = verde, quitado = dourado)
5. Na aba Reativação, a coluna **Data Prevista de Reativação** já vem com a fórmula `=EDATE(...)` em todas as 30 linhas — calcula 12 meses à frente sozinha
6. Apague a linha de exemplo (linha 4, em itálico) antes de preencher de verdade
7. Atualize o Status sempre que um produtor avançar de etapa — é isso que transforma a planilha em pipeline, não em lista parada
8. Pode apagar a aba padrão em branco ("Página1"/"Sheet1") que sobra

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
