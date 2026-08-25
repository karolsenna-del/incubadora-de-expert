# Checklist de Produção — Conduz Agro

> Status: Gerado 23/08/2026 (Fase 9, QG-MC-010)
> Produto estruturado ≠ produto finalizado. Tudo abaixo já pode ser VENDIDO — o que falta é produzir/finalizar pra entregar.
> Prioridade: **P1** bloqueia lançamento (venda) | **P2** importante (bloqueia entrega, não venda) | **P3** nice to have
> Status: `[ ]` Pendente | `[~]` Em progresso | `[x]` Feito

---

## 1. Assessments e Ferramentas

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 1.1 | Diagnóstico da Autoridade Aplicada — interativo | `diagnostico-interativo.html` (publicado) | P1 | [x] Feito |
| 1.2 | Pré-Diagnóstico de Vendas — interativo | `pre-diagnostico-vendas.html` (publicado) | P1 | [x] Feito |
| 1.3 | Testar envio ponta a ponta dos 2 formulários acima (responder → conferir linha na planilha) | Confirmado 24/08 — planilha "Diagnóstico Conduz Agro" já tem registros de teste nas 2 abas | P1 | [x] Feito |
| 1.4 | Mapa do Caso — template preenchível (versão rápida S4 + avançada S12) | **Arquivo próprio**: [Mapa do Caso](https://docs.google.com/spreadsheets/d/1KgNmThGzyStiXwgCGK1Q5yFP78FScxqbJuT5qMkL26A/edit) (em branco) — mesma ferramenta em 2 profundidades, 2 abas-modelo no mesmo arquivo. `scripts/apps-script-mapa-do-caso.gs` | P2 | [~] Em progresso — falta Milena colar o script e rodar `criarTodosMapasDoCaso` |
| 1.5 | Simulador de Conversas que Conduzem — template/ferramenta | **Artifact de treino publicado** — 7 cenários reais (desconto, comparação de preço, atraso, resistência, desconfiança, pressão, indecisão), cada um com armadilha comum × resposta que conduz × por que funciona, revelado ao clicar (pratica primeiro, depois compara). Filtro por categoria. `simulador-conversas.html` — https://claude.ai/code/artifact/4422f39f-e275-4171-a1b2-4f614f10f0ea. Usado S6, S16. Mesma ressalva de rascunho de fala (validar com Milena) | P2 | [x] Feito |
| 1.5b | Leitura do Produtor *(item novo, 24/08 — gap identificado pela Karol)* | **Artifact publicado** — os 6 perfis de produtor (tradicional, desconfiado, apressado, investidor, analítico, emocional), cada um com sinais, erro comum, como abordar, frase de abertura. `leitura-do-produtor.html` — https://claude.ai/code/artifact/c9d8f592-249e-4c33-92bf-b7ec644ef1cd. Usado S4, consulta contínua. Registrado em `design-entregaveis.md` e `prd.md` Seção 4 | P2 | [x] Feito |
| 1.6 | Mapa de Posicionamento — template preenchível | **Arquivo próprio**: [Mapa de Posicionamento](https://docs.google.com/spreadsheets/d/1Ep5Yk4SHPpig_SGz3rupMQi8J-QEXJjFMXvjzNjLuDM/edit) (em branco). 5 campos (Eu sou/Eu resolvo/Para quem/Como faço/Qual valor entrego), duplica por revisão (S7 inicial, S18 revisado — guarda histórico, não apaga versão anterior). `scripts/apps-script-mapa-posicionamento.gs` | P2 | [~] Em progresso — falta Milena colar o script e rodar `criarTemplateMapaPosicionamento` |
| 1.7 | Mapa de Valor Percebido no Agro — template preenchível | **Arquivo próprio**: [Mapa de Valor Percebido no Agro](https://docs.google.com/spreadsheets/d/1Fp5E1Cuudzp3MS5wLpSlia86UB4BTuIFsHNS5xiCdzA/edit) (em branco). Diferente das outras — biblioteca cumulativa (1 tabela só que cresce, não duplica por caso, mesma lógica do CRM), com 4 linhas de exemplo (rascunho, ajustar com a Milena). `scripts/apps-script-mapa-valor-percebido.gs`. Usado S7 | P2 | [~] Em progresso — falta Milena colar o script e rodar `criarMapaValorPercebido` |
| 1.8 | Círculo de Controle da Condução — versão interna (template) | **Arquivo próprio** (não compartilha planilha com outras ferramentas — cada uma usada em momento diferente pelo aluno): [Círculo de Controle da Condução](https://docs.google.com/spreadsheets/d/1W16t8QQwEt_BQ4uqVy6B5vVRNxoou9Yu1TAnKIFxmEE/edit) (em branco). `scripts/apps-script-circulo-controle.gs` + `scripts/SETUP-FERRAMENTAS.md`. Formatado na IV da Milena. Usado S3 | P2 | [~] Em progresso — falta Milena colar o script nessa planilha e rodar `criarTemplateCirculoControle` |
| 1.9 | Círculo de Controle da Condução — versão pro produtor (matriz de responsabilidade/cronograma) | **Arquivo próprio**: [Matriz de Responsabilidade e Prazos](https://docs.google.com/spreadsheets/d/1tSXLwcAFW2Rt3h5dPb_vTaMQ6vcFp3VdrA19hW6MfAU/edit) (em branco). `scripts/apps-script-matriz-responsabilidade.gs`. Tabela com dropdown de Responsável (Você/Produtor/Terceiro, cor muda sozinha), sem marca Conduz Agro. Entrega ao produtor via Baixar → PDF | P2 | [~] Em progresso — falta Milena colar o script nessa planilha e rodar `criarTemplateMatrizResponsabilidade` |
| 1.10 | Roteiro de Condução da Conversa — fluxograma completo (prospecção → entrega) | **Diagrama de referência + script por etapa** (Artifact publicado, não Sheets — é consulta fixa durante o atendimento, não ficha por caso). Fluxograma dos 10 passos do Protocolo Pessoal de Condução + 2 pontos de decisão (aceita o valor? / objeção resolvida?), e abaixo do mapa um card por etapa com "o que fazer / o que dizer / comportamento" (inclui adaptação por perfil de produtor na etapa Orientar). `roteiro-conducao-conversa.html` — https://claude.ai/code/artifact/11df615c-8a22-4ccd-9489-7b859399ceca. **Rascunho de fala — precisa validação da Milena** (mesma pendência de T.1) | P2 | [x] Feito |
| 1.11 | Raio-X da Conversa com o Produtor — ferramenta de análise (in-program) | **Construído como formulário + planilha central** (precisa de análise humana/agente, não é autosserviço) — `raio-x-conversa.html` publicado: https://claude.ai/code/artifact/fcc36059-da75-4a52-b919-f0a7f5ecebc6. **Aceita print(s)** da conversa (até 5, drag-and-drop ou clique, salvos automaticamente numa pasta do Drive) além de texto colado — copiar/colar de WhatsApp/Direct raramente sai formatado direito. Envia pra 4ª aba da planilha "Diagnóstico Conduz Agro" ("Raio-X de Conversas"), com coluna "Status da Análise" (Pendente/Feito) — vira fila de trabalho da Milena. `apps-script-diagnosticos.gs` atualizado | P2 | [~] Em progresso — falta Milena colar o `.gs` atualizado e reimplantar (mesma pendência do item 1.12) |
| 1.12 | Ficha de Inscrição — formulário de intake do Destrava Condução | `ficha-inscricao.html` construído (mesmo padrão visual dos diagnósticos), Apps Script atualizado (`apps-script-diagnosticos.gs`, 3ª aba) | P1 *(precisa existir antes do primeiro uso do Destrava Condução, que pode acontecer cedo — S8 é mês 4)* | [~] Em progresso — falta Milena colar o `.gs` atualizado no Apps Script existente e reimplantar (ver `scripts/SETUP-PLANILHAS.md`), depois publicar o HTML como Artifact |
| 1.13 | Protocolo Pessoal de Condução — template do sistema pessoal | Usado S23-S24 | P3 *(só usado no fim do programa)* | [ ] Pendente |
| 1.14 | Checklist de Evidências da Autoridade — template com pontuação | **Arquivo próprio**: [Checklist de Evidências da Autoridade](https://docs.google.com/spreadsheets/d/1tSgX8p92DqerHjxpOmqWgRaXjulVgOYEdWlJUpre4-g/edit) (em branco). Tabela fixa (não duplica) — 14 indicadores já aprovados no PRD Seção 6 (7 sinais concretos + 7 internos) × 5 checkpoints (S8/S12/S16/S20/S24), pontuação 0-3 com dropdown, linha de TOTAL automática. `scripts/apps-script-checklist-evidencias.gs`. Usado S8, S12, S16, S20, S24 | P2 *(precisa existir até S8, mês 4)* | [~] Em progresso — falta Milena colar o script e rodar `criarChecklistEvidencias` |
| 1.15 | Plano de Aplicação Diária — formato de entrega definido e montado | **Arquivo próprio**: [Plano de Aplicação Diária](https://docs.google.com/spreadsheets/d/17ZtPL0rcOlJfNAEn4X4tQZItvDwVX-87UvAjuSJCFbM/edit) (em branco). Formato definido (Sheets, tabela fixa) — 24 semanas × 5 atividades, sincronizadas com cada sessão, tom tático (Etapa 1) x reflexivo (Etapa 2). **8 tipos de dinâmica** (áudio de mentalidade, escrita, treino no espelho, desafio rápido, teste, avaliação com terceiros/família, simulação, reflexão) alternados pra dar textura e gamificação — não é só "escreva sobre X". `scripts/apps-script-plano-aplicacao-diaria.gs`. **Conteúdo é rascunho meu completo — precisa validação da Milena antes de distribuir** | P2 | [~] Em progresso — falta Milena colar o script, rodar `criarPlanoAplicacaoDiaria` e revisar o conteúdo |
| 1.16 | CRM Comercial — Milena cria a planilha real a partir do template | `crm-comercial.md` + 2 CSVs prontos, falta só ela executar "Como usar" | P2 *(entregável ao aluno também — corrigido 23/08)* | [ ] Pendente |
| 1.17 | Gravar os áudios de mentalidade da trilha *(novo, 24/08)* | 5 atividades "🎧" no Plano de Aplicação Diária (semanas 2, 8, 12, 20, 24) hoje são placeholder — Milena grava áudios curtos reais, hospeda onde for mais simples (Drive, WhatsApp, área de membros) e o Plano recebe o link de cada um | P2 | [ ] Pendente |
| 1.18 | Envio da trilha diária ao aluno *(novo, 24/08)* | **Decisão 24/08: manual por enquanto** — Milena copia a atividade do dia da planilha e manda por WhatsApp. Automação por e-mail (viável via Apps Script, sem custo) fica pra depois que passar da fase de validação; WhatsApp automatizado precisa de API paga (Meta Business API / Twilio / Zenvia) — não é prioridade agora | P3 *(decisão consciente de não automatizar ainda)* | [x] Resolvido (decisão tomada, sem ação de build) |

## 2. Agentes de IA (Suporte Entre Sessões)

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 2.1 | Agente do Método Conduz Agro (self-service, ilimitado) | `estrutura-programa.md` Seção 4 | P2 | [ ] Pendente |
| 2.2 | Preparador de Conversas Difíceis (self-service, ilimitado) | `estrutura-programa.md` Seção 4 | P2 | [ ] Pendente |
| 2.3 | Agente de IA Técnico em Regularização | `prd.md` Seção 4 | P2 | [ ] Pendente |

## 3. Sessões e Currículo

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 3.1 | Roteiro-guia detalhado por sessão (24 sessões) — script prático pra Milena conduzir | `design-sessoes.md` tem o desenho, falta o roteiro executável | P2 *(pelo menos S1-S8 antes do 1º aluno chegar na Etapa 2)* | [ ] Pendente |
| 3.2 | Definir agenda real de sessões (calendário, horários, plataforma de call = Meet) | `design-entregaveis.md` Seção 5 | P2 | [ ] Pendente |

## 4. Onboarding e Offboarding

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 4.1 | Welcome sequence (WhatsApp + e-mail pós-pagamento) | `design-entregaveis.md` Seção 1 — proposto, não escrito | P2 | [ ] Pendente |
| 4.2 | Kit de boas-vindas completo (calendário, acessos aos 3 agentes, instruções da trilha diária, contato WhatsApp) | `design-entregaveis.md` Seção 1 | P2 | [ ] Pendente |
| 4.3 | Roteiro de pedido de depoimento em vídeo (S24) | `design-entregaveis.md` Seção 2 — proposto | P3 | [ ] Pendente |

## 5. Plataforma e Tecnologia

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 5.1 | Configurar plataforma de gravação/área de membros (Hotmart ou similar) | `design-entregaveis.md` Seção 5 | P2 | [ ] Pendente |
| 5.2 | Configurar checkout Voomp com os 2 preços (R$2.797 validação / R$3.997 cheio) + parcelamento 12x | `empacotamento.md` Passo 4 | P1 | [ ] Pendente |

## 6. Comercial e Vendas

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| 6.1 | Página de vendas | `empacotamento.md` (Cartão de Identidade como base de copy) | P1 | [ ] Pendente |
| 6.2 | Comunicação de venda (copy, criativos, sequências) | Usa a Matriz de Benefícios já aprovada (`empacotamento.md` Passo 2) | P1 | [ ] Pendente |
| 6.3 | Testar fluxo completo: Pré-Diagnóstico → sessão estratégica de vendas → aceite → checkout → onboarding → S1 | Ponta a ponta, nenhuma etapa testada ainda | P1 | [ ] Pendente |

## Transversal

| # | Item | Referência | Prioridade | Status |
|---|---|---|---|---|
| T.1 | Validar identidade verbal com a Milena (preencher M4.3/M4.6 do Expert360º) | `branding.md` Seção 4 — segue provisória | P2 | [ ] Pendente |
| T.2 | Revisar produto estruturado (Cartão de Identidade) | `empacotamento.md` | P1 | [x] Feito — aprovado 23/08 |
| T.3 | Definir data de lançamento/abertura | Não definida ainda | P1 | [ ] Pendente |
| T.4 | Confirmar taxa de juros do parcelamento na Voomp | `empacotamento.md` Passo 4 | P1 | [ ] Pendente |
| T.5 | Confirmar quando a fase de validação termina no controle da Milena (contador de vendas: 3 → sobe pra R$3.997) | `empacotamento.md` Passo 3 | P2 | [ ] Pendente |

---

## Resumo

*(Atualizado 24/08 — reflete o progresso da construção das ferramentas do Portfólio)*

- **P1 (bloqueia lançamento):** 11 itens — 4 feitos (formulários testados, Cartão de Identidade aprovado), 1 em progresso (Ficha de Inscrição — falta Milena reimplantar o script), 6 pendentes: checkout Voomp, página de vendas, comunicação de venda, testar fluxo completo, data de lançamento, taxa de juros
- **P2 (importante, não bloqueia venda mas bloqueia entrega):** 23 itens — 3 feitos (Simulador de Conversas, Leitura do Produtor, Roteiro de Condução), 8 em progresso (Mapa do Caso, Círculo de Controle, Matriz de Responsabilidade, Mapa de Posicionamento, Mapa de Valor Percebido, Checklist de Evidências, Raio-X, Plano de Aplicação Diária — todos com arquivo/formulário já criado, falta só Milena rodar/reimplantar o script), 12 pendentes (inclui gravar os áudios de mentalidade)
- **P3 (nice to have):** 3 itens — Protocolo Pessoal de Condução (só usado no mês 12), roteiro de depoimento, e o envio da trilha (decisão já tomada: manual por enquanto, sem automação)

**Leitura prática:** o produto já pode ser vendido — falta fechar os 6 itens P1 ainda pendentes (principalmente página de vendas, checkout e comunicação de venda) pra abrir a primeira turma de validação. As ferramentas do Portfólio (Seção 1) estão avançando bem: metade já feita ou com arquivo pronto esperando só a Milena rodar o script no Apps Script.
