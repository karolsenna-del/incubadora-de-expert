---
task: "Architect Squad"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "02-process-map/process-map.yaml, 01-extraction/process-units.yaml"
Saida: "03-blueprint/squad-blueprint.yaml, agent-decomposition.md, task-mapping.md"
Checklist:
  - "PRD gerado em docs/prd/squad-{slug}.md (Article III Constitution)"
  - "Stories geradas em docs/stories/squad-forge/{slug}/"
  - "Tracker criado em business/campanhas/squad-{slug}/tracker.md (Project Tracker Protocol)"
  - "1-7 agentes definidos com rationale"
  - "Cada PU-STEP mapeado para exatamente 1 task"
  - "Cada PU-DECISION mapeado para decision point ou gate"
  - "Sem dependencia circular no grafo"
  - "Human touchpoints identificados"
  - "Bottleneck abordado no design"
execution_type: "semantic"
---

# Task: Architect Squad — Arquitetura do Squad

**Task ID:** squad-forge/architect-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Architecture
**Execution Type:** Semantic

---

## Executive Summary

Fase 3 do pipeline Squad Forge. O @forge-smith recebe o process map validado e transforma em arquitetura de squad Auroq: decompoe em agentes, mapeia PUs para tasks, desenha workflow e quality gates. Output: squad blueprint pronto pra montagem.

**Posicao no Workflow:** Fase 3 — Apos Playback (Fase 2), antes de Montagem (Fase 4)
**Definicao de Sucesso:** Blueprint coerente com cada PU mapeado, sem dependencia circular
**Gate:** QG-SF-003 — Architecture Coherence

---

## Purpose

Ter um processo extraido e validado nao e o mesmo que ter um squad. Alguem precisa decidir: quantos agentes? qual a responsabilidade de cada um? como os PUs viram tasks? onde ficam os quality gates? este task faz essa traducao.

---

## Pipeline Visual

```
architect-squad
  |
  v
STEP 0: GENERATE PRD (sub-task)
  docs/prd/squad-{slug}.md (FRs, NFRs, CONs, SCs)
  |
  v
STEP 1: ANALYZE PROCESS MAP
  |
  v
STEP 2: IDENTIFY CLUSTERS
  |
  v
STEP 3: DEFINE AGENTS
  |
  v
STEP 4: MAP PUs TO TASKS AND KB (dual mapping)
  |
  v
STEP 5: PLANEJAR KNOWLEDGE BASE
  |
  v
STEP 6: DESIGN WORKFLOW
  |
  v
STEP 7: GENERATE BLUEPRINT
  squad-blueprint.yaml + kb-plan.md
  |
  v
STEP 8: GENERATE STORIES (sub-task)
  docs/stories/squad-forge/{slug}/*.story.md
  |
  v
STEP 9: CREATE PROJECT TRACKER
  business/campanhas/squad-{slug}/tracker.md
  |
  v
QUALITY GATE: QG-SF-003 (inclui PRD + Stories + Tracker)
  |
  v
HANDOFF -> assemble-squad
```

---

## Step-by-Step Execution

### Step 0: Generate PRD (delegacao para sub-task)

> **Story-Driven Development — Article III da Constitution Auroq.**
>
> ANTES de decompor em agentes, gerar PRD do squad. Sem PRD, decisoes arquiteturais ficam implicitas.

Executar sub-task: `tasks/generate-prd.md`

**Inputs:** `02-process-map/process-map.yaml`, `01-extraction/process-units.yaml`
**Output:** `docs/prd/squad-{slug}.md` com FRs/NFRs/CONs/SCs rastreaveis aos PUs

**Bloqueante:** se PRD nao for gerado, QG-SF-003 falha.

### Step 1: Analyze Process Map

Ler:
- `02-process-map/process-map.yaml`
- `01-extraction/process-units.yaml`

Calcular:
- Total de PU-STEPs (define quantidade de tasks)
- Total de PU-DECISIONs (define complexidade)
- Total de PU-QUALITYGATEs (define checkpoints)
- Distribuicao de executor_hints (human vs agent vs hybrid)
- Grafo de dependencias
- Bottleneck identificado

**Classificar complexidade:**

| PUs | Complexidade | Agentes esperados | Tasks esperadas |
|-----|-------------|-------------------|-----------------|
| 5-15 | Simple | 1-2 | 2-4 |
| 16-30 | Standard | 2-4 | 4-8 |
| 31+ | Complex | 4-7 | 8-15 |

### Step 2: Identify Clusters

Agrupar PU-STEPs por area de responsabilidade usando sinais:

**Sinais de agrupamento:**
- Mesmas ferramentas usadas → mesmo agente
- Mesmo tipo de executor → mesmo agente
- Forte acoplamento sequencial → mesmo agente
- Area tematica comum (ex: todos os passos de "pesquisa") → mesmo agente

**Sinais de separacao:**
- Executor diferente (human vs agent) → agentes diferentes
- Independencia (podem rodar em paralelo) → agentes diferentes
- Expertise distinta necessaria → agentes diferentes

### Step 3: Define Agents

Para cada cluster:

```yaml
agent:
  id: "{nome-kebab-case}"
  role: "{1 frase descrevendo o papel}"
  responsible_for:
    steps: [step_numbers]
    decisions: [pu_ids]
  executor_profile: "{agent|human|hybrid}"
  pu_count: N
  rationale: "{Por que este agente existe}"
```

**Regras:**
- Minimo 1, maximo 7 agentes
- Se 1 agente: processo simples, tudo num so
- Se >7: propor decomposicao em sub-squads
- Todo squad tem 1 orchestrator (chief) + N tier_1
- Orchestrator gerencia fluxo, nao executa tasks

**Se processo tem passos human-only e agent-only:**
- Criar agente separado pros agent-only
- Human touchpoints ficam como tasks interativas no orchestrator

### Step 4: Map PUs to Tasks and KB (dual mapping)

> O titulo deste step bate com o Pipeline Visual: cada PU tem destino DUPLO — estrutura do squad (tasks/workflow) E knowledge base. Aqui voce decide a tabela de mapeamento. No Step 5 voce planeja o conteudo concreto da KB.

**Regra de mapeamento (DUAL — Tasks + KB):**

Cada PU alimenta DOIS destinos: a estrutura do squad (tasks/workflow) E a knowledge base. Tasks definem O QUE fazer; KB define COMO fazer com profundidade.

| PU Type | Vira na Estrutura (tasks/workflow) | Vira na KB |
|---------|-----------------------------------|------------|
| STEP (estrutural) | Passo dentro de uma task | — |
| STEP (operacional) | Passo dentro de uma task | Protocolo detalhado com exemplos |
| DECISION | Decision point dentro de task OU quality gate | Decision tree com branches e criterios |
| EXCEPTION | Error handling section da task | Troubleshooting com diagnostico |
| QUALITY_GATE | Checklist item da task OU quality gate do workflow | Criterios de qualidade com benchmarks |
| DEPENDENCY | Ordem das tasks no workflow | — |
| INPUT | Campo "Entrada" da task | Glossario (se termo do dominio) |
| OUTPUT | Campo "Saida" da task | Glossario (se termo do dominio) |
| TACIT | Regra no "STRICT RULES" do agente | Regra Cardinal com contexto e exemplos |

**Distinguir STEP estrutural vs operacional:**
- **Estrutural:** "Abrir o gerenciador", "Clicar em criar campanha" → so vai pra task
- **Operacional:** "Escalar 20-50% por dia", "Trading de orcamento com regras horarias" → vai pra task E pra KB com profundidade

**Regra:** Na duvida, inclui na KB. KB demais > KB de menos.

**Cada task gerada deve ter:**
- Nome claro (verbo + objeto)
- 1 agente responsavel
- Entrada e Saida definidos (dos PU-INPUT/OUTPUT)
- Checklist (dos PU-QUALITY_GATE)
- Execution type (deterministic/semantic/interactive)

**Agrupar PU-STEPs em tasks:**
- STEPs fortemente acoplados → mesma task
- STEPs independentes → tasks separadas
- 1 task nao deve ter mais que 5-7 STEPs

### Step 5: Planejar Knowledge Base

**ANTES de desenhar o workflow, planejar a KB do squad.**

**5a: Checar fontes externas (build-time inputs)**

> **REGRA AUTOCONTIDO ativa.** Fontes externas detectadas aqui sao **build-time inputs** — Smith vai LER em build-time e ESCREVER conteudo novo dentro de `squads/{name}/data/`. Squad runtime NAO referencia esses paths. Ver REGRA AUTOCONTIDO no `agents/forge-smith.md`.

```bash
# Checar fontes externas relevantes
ls docs/knowledge/euriler-business/*{slug}*/ 2>/dev/null
ls docs/knowledge/euriler-mind/*{slug}*/ 2>/dev/null
ls squads/etlmaker/kbs/*{slug}*/ 2>/dev/null
# Outras: business/, ~/euriler-brain/, etc
```

Se fonte existir, planejar **incorporacao** (NAO referencia):

- Mapear quais volumes/secoes/arquivos sao relevantes pro escopo do squad
- Marcar como "internalizar em build-time" no blueprint (`kb_plan.internalize_from`)
- Definir como conteudo sera **sintetizado e adaptado** ao contexto dos agentes
- Output: arquivos novos em `squads/{name}/data/{nome-tematico}.md`, NAO links

Se fonte nao existir:
- KB sera composta a partir dos PUs (Step 6c do assemble-squad)

**5b: Identificar PUs que alimentam a KB**

Percorrer todos os PUs e marcar os que precisam de tratamento na KB:

```yaml
kb_plan:
  cardinal_rules:
    - pu_id: "PU-TACIT-xxx"
      content: "{regra}"
  protocols:
    - pu_id: "PU-STEP-xxx"
      type: "operational"
      content: "{protocolo}"
  decision_trees:
    - pu_id: "PU-DECISION-xxx"
      branches: N
      content: "{arvore}"
  troubleshooting:
    - pu_id: "PU-EXCEPTION-xxx"
      content: "{diagnostico}"
  internalize_from:
    # Build-time inputs — fontes externas que serao LIDAS, ADAPTADAS e ESCRITAS dentro de squads/{name}/data/
    # Squad runtime NAO referencia esses paths. REGRA AUTOCONTIDO.
    - source_path: "{caminho da fonte externa em build-time}"
      sections: ["{secoes relevantes}"]
      target_file: "squads/{name}/data/{nome-tematico}.md"
      adaptation: "{Como esse conteudo sera sintetizado pra os agentes do squad}"
```

Incluir `kb_plan` no blueprint (Step 7).

### Step 6: Design Workflow

**Estrutura do workflow:**

```yaml
workflow:
  phases:
    - phase: 0
      name: "{Nome descritivo}"
      tasks: [task_names]
      agent: "{agent-id}"
      blocking: true/false
      quality_gate: "QG-xxx"  # Se existir
```

**Regras de design:**

1. Workflow e UNIDIRECIONAL (nada volta — principio Pedro Valerio)
2. Quality gates entre fases criticas (dos PU-QUALITY_GATE)
3. Human touchpoints explicitados como tasks interativas
4. Bottleneck do processo deve ser abordado (simplificado, paralelizado, ou gate)
5. Tasks paralelas identificadas

### Step 7: Generate Blueprint

Salvar em `03-blueprint/squad-blueprint.yaml` usando `templates/squad-blueprint-tmpl.yaml`.

Tambem gerar:
- `03-blueprint/agent-decomposition.md` — rationale de cada agente em formato legivel
- `03-blueprint/task-mapping.md` — tabela PU → task (estrutura)
- `03-blueprint/kb-plan.md` — plano de KB: PUs que alimentam a KB + volumes ETL a incorporar

### Step 8: Generate Stories (delegacao para sub-task)

> **Story-Driven Development continuacao do Step 0.**
>
> Apos Blueprint, gerar stories de implementacao que servirao como tracker durante a Fase 4 (Assembly).

Executar sub-task: `tasks/generate-stories.md`

**Inputs:** `docs/prd/squad-{slug}.md`, `03-blueprint/squad-blueprint.yaml`
**Output:** `docs/stories/squad-forge/{slug}/0.0.epic.story.md` + 1 story por fase do squad gerado

**Bloqueante:** se stories nao forem geradas, QG-SF-003 falha. Fase 4 vai usar essas stories como tracker.

### Step 9: Create Project Tracker (Project Tracker Protocol)

> **Cumprir `.claude/rules/project-tracker-protocol.md`.**

Criar tracker em `business/campanhas/squad-{slug}/tracker.md`:

```markdown
# Tracker: Squad {Title}

**Projeto:** Criacao do squad {title}
**Iniciado:** {ISO}
**Status:** Em andamento
**PRD:** docs/prd/squad-{slug}.md
**Stories:** docs/stories/squad-forge/{slug}/
**Squad em construcao:** minds/{slug}/04-squad/ (Fase 4 ainda nao executada)

## Fases

- [x] Fase 0: Setup
- [x] Fase 1: Extracao ({total_pus} PUs)
- [x] Fase 2: Playback validado
- [x] Fase 3: Arquitetura + PRD + Stories
- [ ] Fase 4: Assembly
- [ ] Fase 5: Validacao + Instalacao

## BLOCKERS

(nenhum no momento)

## LOG

- {data} — @forge-smith: PRD gerado, blueprint salvo, stories criadas
```

**Avisar Euriler** que squad-{slug} foi adicionado como projeto — manualmente entrar no cockpit ou aguardar review.

### Step 10: Quality Gate — QG-SF-003

**Criterios:**

| Criterio | Obrigatorio |
|----------|-------------|
| PRD gerado em docs/prd/squad-{slug}.md | Sim (Story-Driven) |
| Stories geradas em docs/stories/squad-forge/{slug}/ | Sim (Story-Driven) |
| Tracker criado em business/campanhas/squad-{slug}/tracker.md | Sim (Project Tracker Protocol) |
| 1-7 agentes definidos | Sim |
| Cada PU-STEP mapeado para exatamente 1 task | Sim |
| Cada PU-DECISION mapeado para decision point ou gate | Sim |
| Sem dependencia circular no grafo | Sim |
| Cada task tem agente atribuido | Sim |
| Human touchpoints identificados | Sim |
| Bottleneck abordado | Sim |
| KB plan documentado (kb-plan.md) | Sim |
| PU-TACITs mapeados pra KB (nao so STRICT RULES) | Sim |
| ETL existente identificado e marcado pra incorporacao | Sim (se existir) |

**Veto conditions:**
- PRD ausente (`docs/prd/squad-{slug}.md` nao existe)
- Stories ausentes (`docs/stories/squad-forge/{slug}/` vazio)
- Tracker ausente (`business/campanhas/squad-{slug}/tracker.md` nao existe)
- 0 tasks geradas
- Dependencia circular detectada
- >50% das tasks sao Hybrid (sugere decomposicao confusa)
- PU-STEP orfao (nao mapeado pra nenhuma task)
- Squad operacional sem kb-plan.md

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `docs/prd/squad-{slug}.md` | PRD do squad (FRs/NFRs/CONs/SCs) |
| `docs/stories/squad-forge/{slug}/0.0.epic.story.md` | Story principal (5 ACs = 5 QGs) |
| `docs/stories/squad-forge/{slug}/{N}.story.md` | 1 story por fase do squad gerado |
| `business/campanhas/squad-{slug}/tracker.md` | Tracker do projeto |
| `03-blueprint/squad-blueprint.yaml` | Arquitetura completa |
| `03-blueprint/agent-decomposition.md` | Rationale dos agentes |
| `03-blueprint/task-mapping.md` | Mapeamento PU → task |
| `03-blueprint/kb-plan.md` | Plano da knowledge base |

---

**Task Status:** Ready for Production
