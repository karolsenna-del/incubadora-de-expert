# Setup — Ferramentas do Portfólio (Círculo de Controle, Matriz de Responsabilidade, Mapa do Caso)

Cada ferramenta *distinta* do Portfólio que o aluno usa vira um **arquivo Google Sheets próprio** — não abas dentro de uma planilha só. Abas-dentro-de-1-arquivo só faz sentido quando é uso interno da Milena acompanhando várias submissões (como a planilha dos diagnósticos, onde cada aba recebe as respostas de todos os alunos/leads) **ou** quando são profundidades diferentes da MESMA ferramenta (ex: Mapa do Caso rápido x avançado — mesmo propósito, mesmo aluno, só a complexidade muda).

Já criei os arquivos, em branco, na pasta do Drive:
- **Círculo de Controle da Condução:** https://docs.google.com/spreadsheets/d/1W16t8QQwEt_BQ4uqVy6B5vVRNxoou9Yu1TAnKIFxmEE/edit
- **Matriz de Responsabilidade e Prazos:** https://docs.google.com/spreadsheets/d/1tSXLwcAFW2Rt3h5dPb_vTaMQ6vcFp3VdrA19hW6MfAU/edit
- **Mapa do Caso** (rápida + avançada, 2 abas-modelo no mesmo arquivo): https://docs.google.com/spreadsheets/d/1KgNmThGzyStiXwgCGK1Q5yFP78FScxqbJuT5qMkL26A/edit

## 1. Colar o script em cada arquivo

Cada planilha recebe **só o script dela** (são independentes):

1. Abre a planilha **Círculo de Controle da Condução** → **Extensões → Apps Script**
2. Apaga o conteúdo padrão e cola o conteúdo de `apps-script-circulo-controle.gs` (mesma pasta deste guia)
3. Salva (Ctrl+S)
4. Repete o mesmo processo na planilha **Matriz de Responsabilidade e Prazos**, colando `apps-script-matriz-responsabilidade.gs`
5. Repete de novo na planilha **Mapa do Caso**, colando `apps-script-mapa-do-caso.gs` (esse tem 2 funções, porque gera 2 abas-modelo — rápida e avançada — no mesmo arquivo)

## 2. Gerar a(s) aba(s)-modelo em cada uma

**Círculo de Controle** e **Matriz de Responsabilidade** (1 aba cada):
1. Confirma que a função selecionada é `criarTemplateCirculoControle` (1ª planilha) ou `criarTemplateMatrizResponsabilidade` (2ª)
2. Clica em **Executar** (▶) — autoriza na primeira vez (Revisar permissões → sua conta → Avançado → Acessar → Permitir)
3. Aparece a aba **"MODELO"**, já formatada

**Mapa do Caso** (2 abas):
1. Confirma que a função selecionada é `criarTodosMapasDoCaso` (cria as 2 de uma vez) — ou rode `criarTemplateMapaRapido` e `criarTemplateMapaAvancado` separadamente se preferir
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparecem **"MODELO — Rápida (S4)"** e **"MODELO — Avançada (S12)"**

Em todas: pode apagar a aba padrão em branco ("Página1" ou "Sheet1") que sobrou — não é usada.

## 3. Como usar no dia a dia

**Nunca edite a aba "MODELO" diretamente** — ela é o molde. Pra cada caso novo:

1. Clica com o botão direito na aba MODELO → **Duplicar**
2. Renomeia a cópia com o nome do caso/cliente (ex: "Fazenda Santa Rita — 24/08")
3. Preenche a cópia à vontade — a formatação já vem pronta, só digitar
4. A aba duplicada fica salva nesse mesmo arquivo pra sempre — histórico de todos os casos daquela ferramenta, sem perder nada

**Círculo de Controle:** situação de pressão no topo, os 3 anéis no meio (fora do controle / posso influenciar / eu controlo), próxima ação embaixo.

**Matriz de Responsabilidade:** dados do caso no topo, tabela de etapas com dropdown na coluna "Responsável" (Você / Produtor / Terceiro) — a cor da célula muda sozinha. Pra entregar ao produtor: **Arquivo → Baixar → PDF (.pdf)**, ou imprimir a aba direto.

**Mapa do Caso:** escolhe qual duplicar conforme a complexidade — "Rápida" (S4, 4 campos: demanda → problema real → riscos → próximo passo) pra um atendimento direto, ou "Avançada" (S12, 7 campos: pessoas → documentos → interesses → riscos → conflitos → prioridades → próximos passos) pra casos com múltiplos envolvidos e interesses divergentes.

## Quando atualizar o script

Se mudar algo no layout, atualiza o `.gs` correspondente aqui no repo, cola a versão nova no Apps Script daquele arquivo específico, salva, e roda a função de novo — isso recria só a aba MODELO do zero (apaga e recria, não mexe nas cópias já duplicadas de casos anteriores).
