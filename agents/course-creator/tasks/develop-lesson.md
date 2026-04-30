---
task: "Develop Lesson"
responsavel: "@course-creator"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Modulo estruturado (QG-CC-005), aula a desenvolver (objetivo + essencia), PRD como referencia"
Saida: "Roteiro da aula completo, aprovado nos 8 criterios de fechou"
Checklist:
  - "Teoria da aula co-desenvolvida"
  - "Formato do roteiro definido (escolha do expert)"
  - "Primeira versao do roteiro gerada"
  - "Refinamento iterativo ate fechou"
  - "8 criterios de qualidade atendidos"
  - "5 antipadroes verificados (nenhum presente)"
  - "Consistencia com aulas anterior/proxima verificada"
  - "Expert aprovou a aula"
execution_type: "interactive"
---

# Task: Develop Lesson — Fase 5: Desenvolvimento da Aula

**Task ID:** course-creator/develop-lesson
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Development
**Execution Type:** Interactive
**Repeatable:** Sim — executa para CADA aula de cada modulo

---

## Executive Summary

Fase 5 do pipeline. Para cada aula, o Creator co-desenvolve a teoria especifica, gera o roteiro no formato escolhido pelo expert, refina iterativamente ate "fechou" (8 criterios), e valida consistencia com as aulas adjacentes. Executa CONTRA o PRD — conteudo deve alinhar com metodologia e entregaveis definidos.

**Gate:** QG-CC-006 — Aula Fechou

---

## Step-by-Step Execution

### Step 1: Contextualizar Aula

Apresentar:
- Modulo atual e posicao na sequencia
- Aula anterior (se houver) — o que ja foi coberto
- Aula atual — objetivo e essencia definidos na Fase 2
- Proxima aula (se houver) — o que vem depois
- Como essa aula encaixa no "desenho" do modulo (Quebra-Cabeca)

### Step 2: Co-Desenvolver Teoria da Aula

Mesmo protocolo fractal, agora no nivel mais granular:

1. Trazer o que ja sabe sobre o tema da aula
2. Expert despeja o que pensa
3. Perguntas pra aprofundar e extrair nuances
4. Pesquisar se necessario
5. Processar materiais e voltar pro debate
6. Ate fechar: contexto conectado, logica amarrada

### Step 3: Definir Formato do Roteiro

**PERGUNTAR AO EXPERT** antes de comecar:

"Pra essa aula, qual formato voce prefere?"
- **Texto completo** — roteirizado, pronto pra ler
- **Bullets** — por secao com contexto e frases-chave
- **Mix** — algumas secoes texto, outras bullets

Respeitar a escolha. Em formato bullet, pode marcar espacos pra "aprofundar/desenvolver mais".

### Step 4: Gerar Primeira Versao do Roteiro

Usando a teoria desenvolvida, gerar o roteiro com:

**Tipos de secao disponiveis:**
- **Abertura** — situar, contexto, gancho
- **Conceito/Definicao** — o que algo E (definicao + analogia + exemplos)
- **Framework/Modelo** — visao geral + elementos + conexoes + aplicacao
- **Lista/Categorias** — nome + definicao + caracteristicas + riscos
- **Problema/Solucao** — problema + causa + consequencia + solucao + como aplicar
- **Transicao/Fechamento** — resumo + reflexao + teaser proxima aula

**Aplicar principios:**
- Padrao Quebra-Cabeca em Camadas (mostrar desenho → aprofundar pecas → reconectar)
- Explique o porque (logica por tras, nao so o "o que")
- Clareza > Completude (melhor 3 bem do que 10 mal)
- Defina antes de desenvolver (O que e X → detalhes → aplicacao)

**Calibracao:**
- Isso e pra esse momento ou pra depois?
- O aluno precisa saber isso AGORA?
- Isso e conceito ou execucao?
- Ta dando info demais pro objetivo desta aula?

### Step 5: Protocolo de Conducao (Refinamento Iterativo)

Loop ate "fechou":

1. Apresentar versao do roteiro
2. Perguntar: "Como ficou?"
3. Expert avalia
4. Se precisa ajuste: onde e o que
5. Ajustar
6. Repetir ate aprovacao

### Step 6: Verificar 8 Criterios de "Fechou"

Antes de declarar aula completa, checar CADA um:

- [ ] **Completude** — abordou tudo que a teoria definiu
- [ ] **Fluxo** — clara e bem conectada
- [ ] **Coerencia interna** — abre e fecha todos os loopings
- [ ] **Coerencia externa** — se encaixa no todo do modulo
- [ ] **Entrega** — cumpre o objetivo da aula
- [ ] **Ritmo** — assertiva e objetiva, sem pressa nem falta de contexto
- [ ] **Tom** — linguagem simples sem perder profundidade tecnica
- [ ] **Contextualizacao** — tudo que e apresentado e bem contextualizado

### Step 7: Verificar 5 Antipadroes

Checar que NENHUM esta presente:

- [ ] **INCOMPLETO** — esqueceu algo que a teoria definiu
- [ ] **DESCONEXAO** — pontos nao conectam com clareza
- [ ] **GORDURA** — enfeite, conversinha descartavel
- [ ] **PROLIXIDADE** — falar demais pro que precisa ser dito
- [ ] **ASSUMIR CONHECIMENTO** — termo ou conceito sem explicar

### Step 8: Validar Consistencia

- Conecta com a aula anterior? (recap ou referencia natural)
- Prepara a proxima aula? (teaser ou setup)
- Se encaixa no desenho do modulo?

### Step 9: Quality Gate QG-CC-006

Protocolo de 5 passos:
1. **APRESENTAR** roteiro completo com resultado dos 8 criterios e 5 antipadroes
2. **PERGUNTAR** "Fechou? O que ajustaria?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "fechou"
5. **HANDOFF** — informar ao Chief. Proximo: desenvolver proxima aula

Se 8 criterios OK + 0 antipadroes + consistencia OK + alinhado com PRD:
- PASS — aula fechou.

Se qualquer criterio falhou:
- FAIL — informar o que nao passou. Voltar pro Step 5 (refinamento).

---

## Veto Conditions

- VETO se gerar roteiro (Step 4) sem teoria co-desenvolvida e validada
- VETO se gerar roteiro sem perguntar formato ao expert (Step 3)
- VETO se declarar "fechou" com qualquer criterio dos 8 nao atendido
- VETO se declarar "fechou" com qualquer antipadrao presente
- VETO se avancar sem verificar consistencia com aulas adjacentes

---

## Sinais de Aula Longa Demais

Se durante o desenvolvimento aparecer:
- Mais de 5-6 secoes substantivas
- Sensacao de "e muito pra uma aula"
- Subtemas que poderiam ser independentes

**Acao:** sinalizar ao expert e sugerir divisao. Decisao e do expert.

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert quer mudar a teoria depois de comecar roteiro | Normal. Voltar pro Step 2, ajustar teoria, refazer roteiro |
| Aula ficou longa | Sugerir divisao. Ajustar lista de aulas do modulo |
| Conteudo pertence a outra aula | Sinalizar. Mover se expert concordar |
| Expert trava na teoria | Pesquisar fontes, provocar, mudar angulo |
| Expert nao gostou do formato | Perguntar qual formato prefere. Refazer |
| Teoria da aula contradiz aula anterior | Sinalizar contradicao. Resolver antes de prosseguir |

---

**Task Status:** Ready for Production
