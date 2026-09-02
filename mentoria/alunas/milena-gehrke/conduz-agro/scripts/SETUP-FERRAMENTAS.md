# Setup — Ferramentas do Portfólio (Sheets)

Cada ferramenta *distinta* do Portfólio que o aluno usa vira um **arquivo Google Sheets próprio** — não abas dentro de uma planilha só. Abas-dentro-de-1-arquivo só faz sentido quando é uso interno da Milena acompanhando várias submissões (como a planilha dos diagnósticos, onde cada aba recebe as respostas de todos os alunos/leads) **ou** quando são profundidades/versões diferentes da MESMA ferramenta (ex: Mapa do Caso rápido x avançado; Mapa de Posicionamento inicial x revisado).

Existe ainda um 3º padrão, diferente dos dois acima: **biblioteca cumulativa** — 1 tabela só que cresce com o tempo, sem duplicar aba (mesma lógica do CRM). É o caso do Mapa de Valor Percebido.

Já criei os arquivos, em branco, na pasta do Drive:
- **Círculo de Controle da Condução:** https://docs.google.com/spreadsheets/d/1W16t8QQwEt_BQ4uqVy6B5vVRNxoou9Yu1TAnKIFxmEE/edit
- **Matriz de Responsabilidade e Prazos:** https://docs.google.com/spreadsheets/d/1tSXLwcAFW2Rt3h5dPb_vTaMQ6vcFp3VdrA19hW6MfAU/edit
- **Mapa do Caso** (4 abas-modelo no mesmo arquivo: Crédito Rural, Regularização, Georreferenciamento — S4 — e Avançada — S11/S12/S22): https://docs.google.com/spreadsheets/d/1KgNmThGzyStiXwgCGK1Q5yFP78FScxqbJuT5qMkL26A/edit
- **Mapa de Posicionamento** (versão inicial S7 + revisada S18, duplicar por revisão): https://docs.google.com/spreadsheets/d/1Ep5Yk4SHPpig_SGz3rupMQi8J-QEXJjFMXvjzNjLuDM/edit
- **Mapa de Valor Percebido no Agro** (biblioteca cumulativa, não duplica): https://docs.google.com/spreadsheets/d/1Fp5E1Cuudzp3MS5wLpSlia86UB4BTuIFsHNS5xiCdzA/edit
- **Checklist de Evidências da Autoridade** (tabela fixa, preenchida ao longo dos 12 meses, não duplica): https://docs.google.com/spreadsheets/d/1tSgX8p92DqerHjxpOmqWgRaXjulVgOYEdWlJUpre4-g/edit
- **Plano de Aplicação Diária** (tabela fixa, 24 semanas × 5 atividades, igual pra todo aluno, não duplica): https://docs.google.com/spreadsheets/d/17ZtPL0rcOlJfNAEn4X4tQZItvDwVX-87UvAjuSJCFbM/edit
- **Protocolo Pessoal de Condução** (documento único do aluno, S23-24, campos em branco pra ele preencher — não duplica): https://docs.google.com/spreadsheets/d/1teCrdqrK9npR--vXKS5o8pyF9_q24gD1sRza5gQltdI/edit
- **CRM Comercial Conduz Agro** (metade comercial, biblioteca cumulativa, 2 abas — Prospecção e Reativação, não duplica): https://docs.google.com/spreadsheets/d/1fztf30doEE9zV_ZCUtOKv7YDLtubX0mIhzqrf0Msq3o/edit — setup detalhado em `crm-comercial.md`
- **Central de Condução do Atendimento** (metade operacional, biblioteca cumulativa, não duplica): https://docs.google.com/spreadsheets/d/1Fb3fgBjtJywE8Fi7S904SHKFrJtmbkWpMztQHZzs-lU/edit — setup detalhado em `central-conducao-atendimento.md`
- **Plano Personalizado** *(novo, 25/08)* (S2; revisões S8/S12/S16/S20; a cópia S24 é o Plano de Continuidade): https://docs.google.com/spreadsheets/d/1YpZ8oeKTBAvJsbFPol9MZf8m1f8a4k61KchAou1rltI/edit
- **Proposta Comercial** *(novo, 25/08)* (modelo editável, duplicar por caso; S7/S19): https://docs.google.com/spreadsheets/d/1Mr35ErujvmE_0csNboMQURk8bPKVl2iC9jVM3iFYel0/edit
- **Mapa Pessoal de Padrões** *(novo, 25/08)* (biblioteca cumulativa, não duplica): https://docs.google.com/spreadsheets/d/1Y0coyGUibkCw8LblfleuI2hxzHGW_gOW3YGNuR2Djhs/edit
- **Banco de Comunicação** *(novo, 25/08)* (biblioteca cumulativa, não duplica): https://docs.google.com/spreadsheets/d/1QXecZvkYr0ZjFy6beN-C2G_qn75lgIek5OjxxXhWWdI/edit

## 1. Colar o script em cada arquivo

Cada planilha recebe **só o script dela** (são independentes):

1. Abre a planilha **Círculo de Controle da Condução** → **Extensões → Apps Script**
2. Apaga o conteúdo padrão e cola o conteúdo de `apps-script-circulo-controle.gs` (mesma pasta deste guia)
3. Salva (Ctrl+S)
4. Repete o mesmo processo na planilha **Matriz de Responsabilidade e Prazos**, colando `apps-script-matriz-responsabilidade.gs`
5. Repete de novo na planilha **Mapa do Caso**, colando `apps-script-mapa-do-caso.gs` (gera 4 abas-modelo no mesmo arquivo: 3 específicas por serviço + avançada)
6. Repete na planilha **Mapa de Posicionamento**, colando `apps-script-mapa-posicionamento.gs`
7. Repete na planilha **Mapa de Valor Percebido no Agro**, colando `apps-script-mapa-valor-percebido.gs`
8. Repete na planilha **Checklist de Evidências da Autoridade**, colando `apps-script-checklist-evidencias.gs`
9. Repete na planilha **Plano de Aplicação Diária**, colando `apps-script-plano-aplicacao-diaria.gs`
10. Repete na planilha **Protocolo Pessoal de Condução**, colando `apps-script-protocolo-pessoal.gs`
11. Repete na planilha **Plano Personalizado**, colando `apps-script-plano-personalizado.gs`
12. Repete na planilha **Proposta Comercial**, colando `apps-script-proposta-comercial.gs`
13. Repete na planilha **Mapa Pessoal de Padrões**, colando `apps-script-mapa-padroes.gs`
14. Repete na planilha **Banco de Comunicação**, colando `apps-script-banco-comunicacao.gs`

## 2. Gerar a(s) aba(s)-modelo em cada uma

**Círculo de Controle**, **Matriz de Responsabilidade**, **Mapa de Posicionamento**, **Plano Personalizado** e **Proposta Comercial** (1 aba MODELO cada):
1. Confirma que a função selecionada é `criarTemplateCirculoControle`, `criarTemplateMatrizResponsabilidade`, `criarTemplateMapaPosicionamento`, `criarTemplatePlanoPersonalizado` ou `criarTemplatePropostaComercial` (conforme a planilha)
2. Clica em **Executar** (▶) — autoriza na primeira vez (Revisar permissões → sua conta → Avançado → Acessar → Permitir)
3. Aparece a aba **"MODELO"**, já formatada

**Mapa do Caso** (4 abas):
1. Confirma que a função selecionada é `criarTodosMapasDoCaso` (cria as 4 de uma vez) — ou rode `criarTemplateMapaCreditoRural`, `criarTemplateMapaRegularizacao`, `criarTemplateMapaGeorreferenciamento` e `criarTemplateMapaAvancado` separadamente
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparecem **"MODELO — Crédito Rural (S4)"**, **"MODELO — Regularização (S4)"**, **"MODELO — Georreferenciamento (S4)"** e **"MODELO — Avançada (S12)"**

**Mapa de Valor Percebido** (tabela única, sem MODELO):
1. Confirma que a função selecionada é `criarMapaValorPercebido`
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparece a aba **"Mapa de Valor Percebido"** já com cabeçalho formatado e 4 linhas de exemplo — esses exemplos são um rascunho meu (regularização de área, CAR, CCIR/ITR, usucapião), ajusta ou apaga conforme a experiência real da Milena

**Checklist de Evidências** (tabela única, sem MODELO):
1. Confirma que a função selecionada é `criarChecklistEvidencias`
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparece a aba **"Checklist de Evidências"** com os 14 indicadores (já aprovados no PRD, não são rascunho) e as 5 colunas de checkpoint (S8-S24), com dropdown de pontuação 0-3 e uma linha de TOTAL que soma sozinha

**Plano de Aplicação Diária** (tabela única, sem MODELO):
1. Confirma que a função selecionada é `criarPlanoAplicacaoDiaria`
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparece a aba **"Plano de Aplicação Diária"** com as 24 semanas (1 por sessão) × 5 atividades — Etapa 1 (semanas 1-8) com fundo claro, Etapa 2 (semanas 9-24) com fundo esverdeado. Cada atividade tem um ícone de tipo (🎧 áudio de mentalidade · ✍️ escrita · 🪞 treino no espelho · 🎯 desafio rápido · 🧪 teste/autoavaliação · 👥 avaliação com terceiros · 🎭 simulação · 💭 reflexão) — legenda fica na linha 3 da própria aba. **Todo o conteúdo das atividades é rascunho meu** — precisa de revisão da Milena antes de ir pro aluno (mesma ressalva de todo conteúdo de fala/script deste squad)

**Mapa Pessoal de Padrões** (tabela única, sem MODELO):
1. Confirma que a função selecionada é `criarMapaPadroes`
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparece a aba **"Mapa Pessoal de Padrões"** com cabeçalho formatado e 1 linha de exemplo (rascunho, apaga antes de usar)

**Banco de Comunicação** (tabela única, sem MODELO):
1. Confirma que a função selecionada é `criarBancoComunicacao`
2. Clica em **Executar** (▶), autoriza se pedir
3. Aparece a aba **"Banco de Comunicação"** com cabeçalho formatado, dropdown de Tipo (Pergunta/Argumento) e 2 linhas de exemplo (rascunho, apaga antes de usar)

Em todas: pode apagar a aba padrão em branco ("Página1" ou "Sheet1") que sobrou — não é usada.

## 3. Como usar no dia a dia

**Nunca edite a aba "MODELO" diretamente** — ela é o molde. Pra cada caso novo:

1. Clica com o botão direito na aba MODELO → **Duplicar**
2. Renomeia a cópia com o nome do caso/cliente (ex: "Fazenda Santa Rita — 24/08")
3. Preenche a cópia à vontade — a formatação já vem pronta, só digitar
4. A aba duplicada fica salva nesse mesmo arquivo pra sempre — histórico de todos os casos daquela ferramenta, sem perder nada

**Círculo de Controle:** situação de pressão no topo, os 3 anéis no meio (fora do controle / posso influenciar / eu controlo), próxima ação embaixo.

**Matriz de Responsabilidade:** dados do caso no topo, tabela de etapas com dropdown na coluna "Responsável" (Você / Produtor / Terceiro) — a cor da célula muda sozinha. Pra entregar ao produtor: **Arquivo → Baixar → PDF (.pdf)**, ou imprimir a aba direto.

**Mapa do Caso:** na S4, escolhe e duplica o modelo específico do serviço — **Crédito Rural**, **Regularização** ou **Georreferenciamento**. Na S11/S12 e no registro final da S22, usa a versão **Avançada** (7 campos: pessoas → documentos → interesses → riscos → conflitos → prioridades → próximos passos) quando o caso tiver múltiplos envolvidos/interesses. O "Plano de Condução de Caso Complexo" e o "Relatório de Aplicação" são resultados desse preenchimento, não ferramentas separadas.

**Mapa de Posicionamento:** 5 campos (Eu sou → Eu resolvo → Para quem → Como faço → Qual valor entrego). Duplica a aba MODELO na Sessão 7 (versão inicial) e de novo na Sessão 18 (revisão) — **não apaga a versão anterior**, o valor está em comparar a evolução.

**Mapa de Valor Percebido:** aqui é diferente — **não duplica**. É 1 tabela só que vai crescendo: toda vez que encontrar uma tarefa técnica nova, adiciona uma linha (tarefa → risco evitado → ganho → quando usar esse argumento). Consulta antes de montar qualquer proposta (Passo 6 "Propor" do Roteiro de Condução).

**Checklist de Evidências:** também não duplica — é uma tabela fixa de 14 indicadores (7 sinais concretos + 7 sinais internos, exatamente os do PRD) que o aluno vai pontuando de 0 a 3 em 5 momentos do programa (S8, S12, S16, S20, S24), sempre comparando com quem ele era na S1. A linha de TOTAL no fim soma cada checkpoint automaticamente — dá pra ver a evolução numérica ao longo dos 12 meses.

**Plano de Aplicação Diária:** também não duplica — é a mesma trilha de 24 semanas pra todo aluno. Cada semana (sincronizada com a sessão em curso) tem 5 atividades de 15 min — tom tático nas semanas 1-8 (Etapa 1), reflexivo nas semanas 9-24 (Etapa 2). Entrega manual por enquanto (Milena copia e manda por WhatsApp) — decisão de 24/08, sem automação nessa fase.

**Protocolo Pessoal de Condução:** documento único do aluno, campos em branco — só a pergunta-guia de cada um dos 10 passos (Abrir → Ouvir → Investigar → Diagnosticar → Orientar → Propor → Negociar → Decidir → Conduzir → Acompanhar). O aluno preenche com as próprias palavras nas Sessões 23-24, a partir do caso real da S22. Não tem exemplo de resposta pronto de propósito — é o sistema *dele*, não um roteiro da Milena.

**Plano Personalizado** *(novo, 25/08)*: criado na S2 com ponto de partida, transformação/evidência dos 12 meses, meta do checkpoint, 3 prioridades, ações com prazo/evidência/apoio, barreira/resposta e compromisso. Revisado em S8/S12/S16/S20 — **duplica por revisão**, guarda o histórico e não apaga versão anterior. Na S24, duplica de novo e preenche Continuidade (resultado a sustentar, hábitos, frequência de revisão, indicadores, riscos, apoio, primeira ação e próxima revisão). O "Plano de Continuidade" é essa última versão, não outro arquivo.

**Proposta Comercial** *(novo, 25/08)*: é o **modelo editável** criado na S7 (estrutura essencial) e ajustado na S19 (casos maiores) — **duplica por caso**, uma cópia por produtor. A "Proposta Comercial Reformulada" é a cópia preenchida; não é outra ferramenta. Usa o Mapa de Valor Percebido como munição no campo Investimento.

**Mapa Pessoal de Padrões** *(novo, 25/08)*: usado a partir da S9 — **não duplica**, biblioteca cumulativa (trava → situação → efeito comercial). Toda vez que uma trava se repetir, adiciona uma linha — ver o padrão escrito por escrito é o que diferencia "tive um dia ruim" de "isso sempre acontece quando X".

**Banco de Comunicação** *(novo, 25/08)*: usado nas S13-S14 — **não duplica**, biblioteca cumulativa que junta perguntas de escuta boas + argumentos de valor que funcionaram, cada linha marcada por Tipo (dropdown Pergunta/Argumento). Junta o que antes seriam 2 ferramentas separadas — mesma função, evita duplicar.

## Quando atualizar o script

Se mudar algo no layout, atualiza o `.gs` correspondente aqui no repo, cola a versão nova no Apps Script daquele arquivo específico, salva, e roda a função de novo — isso recria só a aba MODELO do zero (apaga e recria, não mexe nas cópias já duplicadas de casos anteriores).
