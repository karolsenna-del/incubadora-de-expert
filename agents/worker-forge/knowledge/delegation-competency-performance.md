# Delegacao, Competencia e Performance para Digital Workers

> Frameworks fundamentais para construir, calibrar e medir trabalhadores digitais (AI employees).
> Cada framework resolve uma dimensao diferente: QUANTO de autonomia dar, QUEM faz o que, QUAL o nivel de competencia, COMO medir execucao, e QUANDO considerar algo "feito".

---

## 1. Appelo — 7 Niveis de Delegacao (Management 3.0)

### O Conceito Central

Jurgen Appelo parte de uma premissa simples: delegacao nao e binaria ("faco eu" ou "faz voce"). Existe um espectro de 7 niveis. O insight matador: voce nao delega TAREFAS — voce delega AREAS DE DECISAO.

### Os 7 Niveis

| Nivel | Nome | Quem Decide | Descricao |
|-------|------|-------------|-----------|
| 1 | **Tell** | Manager | Eu decido e informo. Sem discussao. |
| 2 | **Sell** | Manager | Eu decido, mas explico o porque. |
| 3 | **Consult** | Manager | Peco input antes, mas decisao e minha. |
| 4 | **Agree** | Consenso | Decidimos juntos. |
| 5 | **Advise** | Worker | Dou opiniao, mas decisao e dele. |
| 6 | **Inquire** | Worker | Ele decide e depois me conta. |
| 7 | **Delegate** | Worker | Ele decide. Eu nem preciso saber. |

### Quando Usar Cada Nivel

- **Tell (1):** Emergencia, compliance, regras inegociaveis
- **Sell (2):** Decisoes estrategicas onde o worker precisa do PORQUE
- **Consult (3):** Worker tem info que voce nao tem, mas risco alto
- **Agree (4):** Impacta ambos igualmente
- **Advise (5):** Worker competente, voce so da toque
- **Inquire (6):** Worker competente, voce so quer saber resultado
- **Delegate (7):** Worker expert. Total autonomia

### O Delegation Board

Matriz visual: eixo vertical = areas de decisao, eixo horizontal = 7 niveis.

| Area de Decisao | Nivel | Significado |
|----------------|-------|-------------|
| Criar campanha teste | 6 (Inquire) | Worker cria, me conta depois |
| Pausar campanha com CPA alto | 7 (Delegate) | Worker decide sozinho |
| Escalar orcamento >R$1k/dia | 3 (Consult) | Worker sugere, eu decido |
| Mudar publico-alvo | 4 (Agree) | Decidimos juntos |

### Principios-Chave

- Delegacao nao e permanente — muda conforme confianca e competencia
- Comece conservador (1-3), va subindo conforme worker prova competencia
- Nunca delegue TUDO nivel 7 de uma vez. Isso nao e delegacao, e abandono
- O Board e o mapa de permissoes semanticas do worker

---

## 2. RACI Matrix

### O Conceito Central

RACI define QUEM faz o que. Enquanto Appelo responde "quanto de autonomia?", RACI responde "quem esta envolvido e em qual papel?"

| Papel | Significado | Regra |
|-------|------------|-------|
| **R** — Responsible | Quem FAZ o trabalho | Pode ter mais de 1 |
| **A** — Accountable | Quem RESPONDE pelo resultado | SEMPRE 1 so. Nunca mais. |
| **C** — Consulted | Quem e CONSULTADO antes | Bidirecional |
| **I** — Informed | Quem e INFORMADO depois | Unidirecional |

### Regra de Ouro

**Um unico A por linha.** Se tem 2 accountable, nenhum e.

### Erros Classicos

- Todo mundo e R → dilucao de responsabilidade
- Excesso de C → trava decisao
- A sem autoridade real → papel decorativo
- Um worker com 80% dos Rs → gargalo

### Aplicacao Multi-Agent

| Atividade | Strategist | Scale-Op | Test-Op | Human |
|-----------|-----------|----------|---------|-------|
| Definir estrategia | R, A | I | I | C |
| Criar campanha teste | C | I | R, A | I |
| Escalar campanha | C | R, A | I | I |
| Aprovar orcamento >R$5k | I | R | I | A |

---

## 3. Dreyfus — Modelo de Aquisicao de Competencia

### Os 5 Niveis

| Nivel | Decisao | KB necessaria | Appelo |
|-------|---------|---------------|--------|
| **Novice** | Nenhuma. Executa script | SOPs rigidos, checklists, zero ambiguidade | Tell/Sell (1-2) |
| **Adv. Beginner** | Limitada, cenarios conhecidos | SOPs + exemplos + cases | Sell/Consult (2-3) |
| **Competent** | Situacional, com analise | Principios + criterios + anti-padroes | Consult/Agree (3-4) |
| **Proficient** | Intuitiva na leitura, deliberada na resposta | Modelos mentais + heuristicas + repertorio | Advise/Inquire (5-6) |
| **Expert** | Intuitiva e fluida | Principios fundamentais + liberdade | Inquire/Delegate (6-7) |

### A Transicao Critica: Regras → Intuicao

| Aspecto | Novice | Expert |
|---------|--------|--------|
| Base de decisao | Regras context-free | Intuicao situacional |
| Percepcao | Componentes isolados | Padrao holistico |
| Comprometimento | Desapegado | Profundamente envolvido |
| Foco | Seguir o processo | Atingir o resultado |

### Principio Central

A PROFUNDIDADE da KB determina o NIVEL MAXIMO de delegacao. Quer dar autonomia (Appelo 6-7)? A KB precisa ser nivel Proficient/Expert. Se a KB so tem SOPs, o worker e Novice — delegue no maximo nivel 3.

A maioria dos workers digitais opera entre Competent e Proficient — essa e a zona-alvo do design.

---

## 4. 4DX — As 4 Disciplinas da Execucao (FranklinCovey)

### As 4 Disciplinas

#### Disciplina 1 — WIG (Wildly Important Goal)
- Maximo 2 WIGs por vez
- Formato: **"De X para Y ate [data]"**
- Se tudo e prioridade, nada e prioridade

#### Disciplina 2 — Lead Measures
| Tipo | O que Mede | Pode Influenciar? |
|------|-----------|-------------------|
| **Lag Measure** | Resultado final | Nao — ja era |
| **Lead Measure** | Acao preditiva | Sim — pode ajustar |

Um bom Lead Measure e **preditivo** (se mudar, o Lag muda) e **influenciavel** (o time pode agir).

#### Disciplina 3 — Scoreboard
- Simples — entendido em 5 segundos
- Mostra Lead E Lag juntos
- Mostra se esta GANHANDO ou PERDENDO
- Maximo 6 metricas por WIG

#### Disciplina 4 — Cadencia de Accountability
3 perguntas semanais:
1. O que me comprometi semana passada?
2. Como estao os numeros?
3. O que vou fazer esta semana?

### Exemplo: Worker de Trafego Pago

| Metrica | Tipo | Meta | Status |
|---------|------|------|--------|
| CPA medio | Lag | <=R$35 | Ganhando |
| Novos criativos testados/semana | Lead | >=9 | Perdendo |
| Campanhas pausadas com CPA >2x | Lead | 100% | Ganhando |
| ROAS conta escala | Lag | >=3.0 | Perdendo |

---

## 5. OKRs — Objectives and Key Results

### Estrutura

**"Eu vou [OBJETIVO] medido por [RESULTADOS-CHAVE]"**

| Componente | Natureza | Exemplo |
|-----------|----------|---------|
| **Objective** | Qualitativo, inspiracional | "Dominar o trafego pago no nicho" |
| **Key Results** | Quantitativo, mensuravel | "CPA medio abaixo de R$30" |

### OKRs vs KPIs

| Dimensao | OKR | KPI |
|----------|-----|-----|
| Proposito | DIRECAO (pra onde ir) | SAUDE (como esta agora) |
| Natureza | Transformacional | Operacional |
| Ciclo | Trimestral | Continuo |
| Ambicao | Stretch (60-70% = sucesso) | Realista (100% = esperado) |

**Na pratica:** KPIs monitoram SAUDE operacional. OKRs direcionam EVOLUCAO.

---

## 6. Definition of Done (DoD) — Agile/Scrum

### DoD Multi-Nivel

| Nivel | Escopo | Exemplo Worker |
|-------|--------|----------------|
| **Task-level** | Item individual | "Anuncio com copy, criativo, CTA, UTM corretos" |
| **Mission-level** | Conjunto de tasks | "Campanha configurada: 3 conjuntos, 9 criativos, tracking ativo" |
| **Sprint-level** | Ciclo completo | "Todas campanhas rodando, relatorio gerado, otimizacoes feitas" |

### DoD vs Acceptance Criteria

- **Acceptance Criteria:** Especificos da TAREFA. Mudam a cada missao.
- **DoD:** Globais e TRANSVERSAIS. Se aplicam a TUDO.

### DoD e Quality Gates

| Conceito | Quando | Proposito |
|----------|--------|-----------|
| **Definition of Ready** | ANTES de comecar | "Tenho tudo pra executar?" |
| **Definition of Done** | DEPOIS de executar | "Completei com qualidade?" |
| **Quality Gate** | Em CHECKPOINTS | "Posso avancar?" |

---

## Mapa de Integracao

```
                    ESTRATEGIA (Pra Onde?)
                    ┌─────────────┐
                    │    OKRs     │ ← Direcao + Ambicao
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    4DX      │ ← Execucao + Foco
                    │  WIG + Lead │
                    └──────┬──────┘
                           │
              OPERACAO (Quem Faz O Que, Com Quanta Autonomia?)
         ┌─────────────────┼─────────────────┐
         │                 │                 │
   ┌─────▼─────┐   ┌──────▼──────┐   ┌──────▼──────┐
   │   RACI    │   │   Appelo    │   │  Dreyfus    │
   │  (Quem)   │   │ (Autonomia) │   │ (Capacidade)│
   └─────┬─────┘   └──────┬──────┘   └──────┬──────┘
         │                │                  │
         └────────────────┼──────────────────┘
                          │
                   ┌──────▼──────┐
                   │    DoD      │ ← Qualidade + Fechamento
                   └─────────────┘
```

| Pergunta | Framework | Resposta |
|----------|-----------|----------|
| Pra onde estamos indo? | OKRs | Objective + Key Results |
| No que vamos focar? | 4DX | WIG + Lead Measures |
| Quem faz o que? | RACI | R, A, C, I por atividade |
| Quanta autonomia? | Appelo 7 Levels | Nivel 1-7 por area |
| Qual a capacidade? | Dreyfus | Novice → Expert por skill |
| Quando esta pronto? | DoD | Checklist multi-nivel |

---

## Fontes

- [Appelo — 7 Levels of Delegation](https://medium.com/@jurgenappelo/the-7-levels-of-delegation-672ec2a48103)
- [Delegation Board — Management 3.0](https://management30.com/practice/delegation-poker/)
- [RACI Matrix Guide](https://project-management.com/understanding-responsibility-assignment-matrix-raci-matrix/)
- [Dreyfus Model — Wikipedia](https://en.wikipedia.org/wiki/Dreyfus_model_of_skill_acquisition)
- [4DX — Perdoo Guide](https://www.perdoo.com/resources/online-guides/4dx)
- [OKR Definition — WhatMatters.com](https://www.whatmatters.com/faqs/okr-meaning-definition-example)
- [Definition of Done — Scrum.org](https://www.scrum.org/resources/what-definition-done)
