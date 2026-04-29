# Arquiteturas de Agentes Autonomos para Digital Workers

> Sistemas e papers mais relevantes para construir "digital workers" — agentes de IA que executam tarefas, documentam seu trabalho e melhoram com o tempo.

---

## 1. Voyager (NVIDIA, 2023)

**O que e:** Primeiro agente "lifelong learning" baseado em LLM, no Minecraft. Wang, Xie et al.

### Arquitetura — 3 Componentes

1. **Automatic Curriculum** — Gera objetivos de exploracao em ordem crescente de dificuldade. O agente PROPOE o que aprender.
2. **Skill Library** — Biblioteca de skills executaveis que cresce com uso. Indexada por embeddings. Query top-5 por relevancia.
3. **Iterative Prompting** — Gera codigo → executa → feedback → refina. Self-verification antes de salvar.

### Inovacao-Chave

**Composicao de skills.** Skills complexas reusam skills simples. Efeito composto: capacidades crescem exponencialmente. Voyager obteve 3.3x mais itens, 2.3x mais distancia, 15.3x mais rapido que SOTA.

### Mapeamento pro Worker

| Voyager | Worker |
|---------|--------|
| Skill Library | Playbook (SOPs que crescem) |
| Automatic Curriculum | Mode 2 (Research) — identifica gaps |
| Composicao de skills | SOPs que referenciam outras SOPs |
| Self-verification | Quality gate pos-execucao |

---

## 2. MetaAgent (2025)

**O que e:** Agente auto-evolutivo via "Tool Meta-Learning". Comeca com minimo, evolui por tarefas. Qi et al.

### Arquitetura

Inicializado com 2 capacidades: **Autonomous Reasoning** + **Adaptive Help-Seeking** (gera help requests em linguagem natural).

```
Tarefa → Raciocinio → Gap detectado → Help request →
→ Ferramenta responde → Meta-reflexao → Atualiza KB → Proxima tarefa
```

### Inovacao-Chave

**Meta Tool Learning** — nao so USA ferramentas, REFLETE sobre como usou. Constroi tools internas e KB persistente sem fine-tuning.

### Mapeamento pro Worker

| MetaAgent | Worker |
|-----------|--------|
| Comeca pelado | Worker comeca com Foundation + 0 SOPs |
| Gap detection | Identifica lacuna, entra em Research |
| Help-seeking | Mode 2 — busca info quando nao sabe |
| Meta-reflexao | PDSA Study → gera nova SOP |

---

## 3. Strands SOPs (AWS, 2025)

**O que e:** Formato padronizado de markdown pra workflows de agentes. Strands Agents SDK.

### 6 Componentes

1. **Goal** — Resultado unico que MUST ser alcancado
2. **Inputs/Parameters** — O que MAY ler ou MUST aceitar
3. **Constraints** — Regras MUST/SHOULD/MAY
4. **Procedure** — Passos ordenados com pontos de decisao
5. **Validation** — Checks pre-output
6. **Output Spec** — Formato exato

### Inovacao-Chave

**RFC 2119 como linguagem de controle.** MUST (obrigatorio), SHOULD (recomendado), MAY (opcional). Meio-termo: mais flexivel que codigo, mais confiavel que prompt puro.

### Mapeamento pro Worker

Valida diretamente o approach AIOS de tasks em markdown. A industria convergiu pro mesmo padrao.

---

## 4. Letta / MemGPT (2024-2025)

**O que e:** Framework pra agentes com estado persistente e memoria auto-gerenciada. Packer et al.

### 3 Tiers de Memoria

| Tier | Analogia | Caracteristica |
|------|----------|----------------|
| **Core Memory** | RAM | No contexto. Agente le e ESCREVE. Info essencial, limitada. |
| **Archival Memory** | Disco | Vector DB externo. Capacidade infinita. Search/insert via tools. |
| **Recall Memory** | Logs | Historico de conversas. Pesquisavel. |

### Inovacao-Chave

**Self-editing memory.** O agente DECIDE o que lembrar, esquecer, mover entre tiers. Nao e RAG passivo — e gerenciamento ativo.

### Mapeamento pro Worker

| MemGPT | Worker |
|--------|--------|
| Core Memory | Foundation KB — identidade, regras. Sempre no contexto. |
| Archival Memory | Playbook — SOPs acumuladas, searchable. |
| Recall Memory | Mission Log — historico de execucoes. |
| Self-editing | Worker que atualiza proprio Playbook. |

---

## 5. A-Mem (NeurIPS 2025)

**O que e:** Memoria agente usando Zettelkasten. Xu, Liang et al.

### Principios

- Cada memoria e nota atomica (descricao + keywords + tags)
- Links bidirecionais com notas relacionadas
- Quando nota nova entra, pode ALTERAR notas antigas
- Estrutura emerge, nao e imposta

### Inovacao-Chave

**Memoria agente (nao passiva).** Memorias se auto-organizam, criam conexoes, evoluem. Performance superior vs SOTA em 6 modelos.

### Mapeamento pro Worker

SOPs como notas atomicas interconectadas. Cada nova execucao pode atualizar SOPs existentes. Estrutura do Playbook emerge organicamente.

---

## 6. Claude Cowork (Anthropic, 2026)

**O que e:** Plataforma que transforma Claude em "colega digital persistente". CUA (Computer-Using Agent).

### Modos de Execucao

| Modo | Descricao |
|------|-----------|
| **On-demand** | Voce pede, ele faz |
| **Scheduled** | Recorrente (diario, semanal) |
| **Trigger-based** | Quando condicao e atendida |

### Calibracao de Autonomia

- Mostra plano antes de executar
- Escala pro humano quando incerto
- Dashboard de controle granular

### Inovacao-Chave

**O modelo mental "employee", nao "tool".** Recebe missoes outcome-oriented, executa autonomamente dentro de limites, reporta com transparencia, pede ajuda quando nao sabe.

### Limitacao Critica

**Sem memoria persistente entre sessoes** — exatamente o gap que Workers com KB resolvem.

---

## 7. ReAct (Yao et al., 2023)

**O que e:** Padrao fundamental que combina Reasoning + Acting intercalado. Base de todo agente moderno. ICLR 2023.

### O Loop

```
Thought: "Preciso descobrir X..."
Action: search("X")
Observation: "Resultado: ..."
Thought: "Agora preciso Y..."
Action: lookup("Y")
...
```

### Inovacao-Chave

**Sinergia bidirecional:**
- **Reason to Act** — raciocinio cria planos de acao
- **Act to Reason** — acoes trazem info nova pro raciocinio

### Mapeamento pro Worker

Todo Worker opera em ReAct: pensa → executa → observa → ajusta → proximo passo. O "Thought" persistido no Mission Log.

---

## 8. Reflexion (Shinn et al., 2023)

**O que e:** "Verbal reinforcement learning" — agente reflete em linguagem natural sobre falhas e melhora. NeurIPS 2023.

### 3 Componentes

1. **Actor** — Executa a tarefa
2. **Evaluator** — Avalia resultado (passou/falhou)
3. **Self-Reflection** — Gera reflexao verbal sobre o que deu errado

### O Loop

```
Tentativa 1: Executa → Falhou
→ Reflexao: "Tentei X mas falhou porque Y. Proximo: Z."
→ Salva na Episodic Memory

Tentativa 2: Executa (com reflexao no contexto) → Passou
```

### Inovacao-Chave

**"Gradiente semantico"** — aprendizado via TEXTO, nao numeros. Sem fine-tuning. Resultado: 91% pass@1 no HumanEval (vs 80% do GPT-4).

### Mapeamento pro Worker

PDSA e Reflexion sao a mesma coisa:
- Plan → Do → Study → Act = Plan → Execute → Reflect → Improve
- Reflexoes persistidas no Mission Log
- Evaluator = quality gate separado do executor

---

## Sintese: 7 Principios de Design

Da sintese das 8 arquiteturas:

1. **Think Before Act (ReAct)** — Nunca executar sem raciocinar. Documentar raciocinio.
2. **Grow by Doing (Voyager + MetaAgent)** — Comecar minimo, construir capacidade organicamente.
3. **Remember in Tiers (MemGPT)** — Memoria em 3 camadas: core, archival, recall.
4. **Connect Knowledge (A-Mem)** — SOPs nao sao ilhas — sao notas interconectadas.
5. **Define with Precision (Strands)** — Workflows em linguagem natural com niveis de obrigatoriedade.
6. **Reflect to Improve (Reflexion)** — Pos-execucao: avaliar, refletir, documentar, melhorar.
7. **Calibrate Autonomy (Cowork)** — Niveis de autonomia por tarefa. Escalar quando incerto.

### Mapa de Influencia

```
┌─────────────────────────────────────────────────┐
│           DIGITAL WORKER COMPLETO               │
├─────────────────────────────────────────────────┤
│  EXECUTION LOOP                                 │
│  ├── ReAct: Think → Act → Observe               │
│  ├── Reflexion: Reflect → Improve                │
│  └── MetaAgent: Gap → Seek → Learn              │
│                                                 │
│  KNOWLEDGE                                      │
│  ├── MemGPT: 3 tiers (Core/Archival/Recall)     │
│  ├── A-Mem: Notas interconectadas               │
│  └── Voyager: Skill library composicional        │
│                                                 │
│  WORKFLOW                                       │
│  ├── Strands: Markdown + RFC 2119               │
│  └── Voyager: Automatic curriculum              │
│                                                 │
│  AUTONOMY                                       │
│  ├── Cowork: Employee mental model               │
│  └── Cowork: Calibracao + escalacao              │
└─────────────────────────────────────────────────┘
```

---

## Fontes

### Papers
- [Voyager](https://arxiv.org/abs/2305.16291) — Wang et al., 2023
- [MetaAgent](https://arxiv.org/abs/2508.00271) — Qi et al., 2025
- [MemGPT](https://arxiv.org/abs/2310.08560) — Packer et al., 2023
- [A-MEM](https://arxiv.org/abs/2502.12110) — Xu, Liang et al., NeurIPS 2025
- [ReAct](https://arxiv.org/abs/2210.03629) — Yao et al., ICLR 2023
- [Reflexion](https://arxiv.org/abs/2303.11366) — Shinn et al., NeurIPS 2023

### Codigo e Docs
- [Voyager GitHub](https://github.com/MineDojo/Voyager)
- [Strands SOPs](https://github.com/strands-agents/agent-sop)
- [Letta GitHub](https://github.com/letta-ai/letta)
- [A-Mem GitHub](https://github.com/agiresearch/A-mem)
- [Reflexion GitHub](https://github.com/noahshinn/reflexion)
- [Claude Cowork](https://support.claude.com/en/articles/13345190)
