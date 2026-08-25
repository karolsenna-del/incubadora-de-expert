# Central de Condução do Atendimento
**Ferramenta do Portfólio Estratégico — Google Sheets**
*Planilha pra acompanhar o andamento operacional de cada caso já fechado — etapa atual, próximo checkpoint, última comunicação com o produtor, prazo combinado. É o que permite dar checkpoints proativos sem depender de memória ou de reler mensagens antigas.*

> **Metade operacional do CRM** — divisão comercial/operacional que a Karol definiu e que tinha ficado perdida numa versão anterior do PRD (corrigido 24/08/2026, antes marcada por engano como "fora do escopo do 1:1"). O `crm-comercial.md` cuida de fechar a venda (prospecção → fechamento → financeiro). Esta ferramenta cuida de **entregar** o serviço depois de fechado. As duas cruzam pelo **Nome do Produtor**.
> Origem: adaptado da "Central de Condução do Atendimento" da planilha-fonte do Portfólio Estratégico da Milena (M2.2), reduzida ao essencial pro escopo do 1:1 — a versão completa do conceito original ("reúne diagnóstico, documentos, mensagens, propostas...") é maior que o necessário aqui, porque diagnóstico já é o Mapa do Caso, prazos/responsabilidades já é a Matriz de Responsabilidade. Esta planilha foca só no que faltava: **status operacional ao longo do tempo**.

---

## Como usar

**Arquivo já criado** (24/08) na pasta do Drive, em branco: https://docs.google.com/spreadsheets/d/1Fb3fgBjtJywE8Fi7S904SHKFrJtmbkWpMztQHZzs-lU/edit

1. Abre a planilha → **Extensões → Apps Script**
2. Apaga o conteúdo padrão e cola `scripts/apps-script-central-conducao.gs`
3. Salva, seleciona a função `criarCentralConducao`, clica em **Executar** (▶), autoriza se pedir
4. Aparece a aba "Central de Condução" já formatada, com dropdowns (Etapa Atual, Status Geral) e cor automática (atrasado = vermelho, atenção = dourado, concluído = verde)
5. Apague a linha de exemplo (linha 4, em itálico) antes de usar de verdade
6. Toda vez que der um checkpoint pro produtor (WhatsApp, ligação, o que for), atualiza a linha do caso — é isso que transforma a planilha numa central de verdade, não numa lista parada

---

## Colunas

- **Nome do Produtor** — mesmo nome usado no CRM (Prospecção), pra cruzar as duas planilhas
- **Serviço Contratado**
- **Etapa Atual** — dropdown: Documentação recebida / Análise em andamento / Protocolado / Aguardando cartório / Aguardando banco-crédito / Aguardando produtor / Concluído
- **Data do Último Update**
- **Próximo Checkpoint Previsto** — quando você pretende dar a próxima atualização pro produtor
- **Última Comunicação ao Produtor** — o que foi dito e quando (usa o script do Passo 10 "Acompanhar" do Roteiro de Condução como referência de tom)
- **Prazo Final Combinado** — vem da Matriz de Responsabilidade fechada no início do caso
- **Status Geral** — dropdown: No prazo / Atenção / Atrasado / Concluído (cor automática)
- **Observações**

## Por que separado do CRM

Se fosse tudo na mesma planilha, o profissional teria uma visão misturada de "quem eu preciso vender" e "quem eu preciso entregar" — dois modos de trabalho diferentes, dois momentos diferentes do relacionamento com o produtor. Separar deixa cada ferramenta simples de olhar rápido no dia a dia: CRM antes de fechar, Central depois de fechar.

---

*Conduz Agro — Portfólio Estratégico, metade operacional (par do CRM Comercial). Origem: planilha-fonte M2.2 da Milena.*
