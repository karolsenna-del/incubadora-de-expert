---
task: "Generate PRD"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "02-process-map/process-map.yaml, 01-extraction/process-units.yaml"
Saida: "docs/prd/squad-{slug}.md"
Checklist:
  - "Visao do squad clara (1 paragrafo)"
  - "Escopo definido (in-scope + out-of-scope)"
  - "Personas extraidas do processo"
  - "FRs derivadas de PU-STEPs (rastreaveis)"
  - "NFRs derivadas de PU-QUALITY_GATEs"
  - "Constraints derivadas de PU-DEPENDENCYs externas"
  - "Success criteria mensuraveis"
  - "Cada secao referencia PU-IDs de origem"
execution_type: "semantic"
---

# Task: Generate PRD — Product Requirements Document do Squad

**Task ID:** squad-forge/generate-prd
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Documentation
**Execution Type:** Semantic

---

## Executive Summary

Apos Playback validado (Fase 2), antes de Arquitetura (Fase 3), gerar PRD do squad em `docs/prd/squad-{slug}.md`. Cumpre Article III da Constitution (Story-Driven Development) — squad e desenvolvido a partir de PRD, nao de improviso.

**Posicao no Workflow:** Sub-task da Fase 3 (Step 0 do architect-squad)
**Definicao de Sucesso:** PRD com FRs/NFRs/Constraints rastreaveis aos PUs
**Gate:** Parte de QG-SF-003

---

## Purpose

Story-driven development e Article III da Constitution Auroq — NON-NEGOTIABLE. Hoje o squad-forge gera squad sem PRD, sem stories, sem rastreabilidade. Esta task corrige.

PRD e ponte entre processo extraido (PUs) e arquitetura do squad. Sem PRD, decisoes arquiteturais ficam implicitas. Com PRD, sao defendidas.

---

## Pipeline Visual

```
generate-prd
  |
  v
STEP 1: LOAD PROCESS MAP + PUs
  |
  v
STEP 2: EXTRACT VISION
  Visao + escopo (in/out)
  |
  v
STEP 3: EXTRACT PERSONAS
  Quem usa o squad
  |
  v
STEP 4: DERIVE FRs (Functional Requirements)
  Cada PU-STEP → FR rastreavel
  |
  v
STEP 5: DERIVE NFRs (Non-Functional Requirements)
  Cada PU-QUALITY_GATE → NFR
  |
  v
STEP 6: DERIVE CONSTRAINTS
  PU-DEPENDENCYs externas → CONs
  |
  v
STEP 7: DEFINE SUCCESS CRITERIA
  Mensuraveis, derivados de PUs
  |
  v
STEP 8: WRITE PRD
  docs/prd/squad-{slug}.md
```

---

## Step-by-Step Execution

### Step 1: Load Process Map + PUs

Ler:
- `02-process-map/process-map.yaml`
- `01-extraction/process-units.yaml`

### Step 2: Extract Vision

Da descricao do processo no process-map + PU-STEPs iniciais:

**Visao (1 paragrafo):** O que esse squad existe pra fazer. Quem se beneficia. Como difere de fazer manualmente.

**Escopo:**
- **In-scope:** o que o squad cobre (lista de capacidades derivadas dos PU-STEPs)
- **Out-of-scope:** o que NAO cobre (derivado de external_dependencies do state.json + PUs marcadas como "humano so")

### Step 3: Extract Personas

Da metadata do process-map + PUs:

**Persona Primaria:**
- Nome do papel (ex: "Estrategista de lancamento", "Tecnico de trafego")
- Contexto (vem de scope do state.json)
- Objetivo principal ao usar o squad
- Frequencia de uso

**Personas Secundarias** (se aplicavel): outras pessoas que interagem com output do squad.

### Step 4: Derive Functional Requirements (FRs)

Para cada PU-STEP, gerar FR:

```markdown
**FR-001:** {Descricao funcional baseada no PU-STEP}
- Origem: PU-STEP-xxx (trace)
- Agente responsavel: {agent-id} (do blueprint)
- Acceptance criteria:
  - [ ] {Criterio derivado de PU-QUALITY_GATE associada}
  - [ ] {Criterio derivado de PU-OUTPUT associado}
```

Cada FR DEVE ter `Origem:` rastreavel. Sem rastreabilidade, FR e ficcao.

### Step 5: Derive Non-Functional Requirements (NFRs)

PU-QUALITY_GATEs viram NFRs sobre como o squad opera (qualidade, performance, usabilidade):

```markdown
**NFR-001:** {Criterio de qualidade}
- Origem: PU-QUALITY_GATE-xxx
- Tipo: {Quality|Performance|Usability|Security}
- Threshold: {valor mensuravel}
```

PU-TACITs sobre velocidade ou padrao tambem viram NFRs.

### Step 6: Derive Constraints (CONs)

PU-DEPENDENCYs externas + restricoes mencionadas pelo dono viram constraints:

```markdown
**CON-001:** {Restricao que limita design do squad}
- Origem: PU-DEPENDENCY-xxx ou external_dependencies do state
- Tipo: {Technical|Business|Resource|Time}
- Impacto: {O que essa constraint impede ou exige}
```

### Step 7: Define Success Criteria

Criterios mensuraveis pra dizer "esse squad funciona":

- Derivados dos PU-QUALITY_GATEs principais
- Devem ser binarios ou quantificaveis
- Cada criterio liga a 1+ FRs

```markdown
**SC-001:** {Criterio de sucesso}
- Mensuravel via: {como medir}
- FRs cobertos: [FR-001, FR-003]
```

### Step 8: Write PRD

Salvar em `docs/prd/squad-{slug}.md` com formato:

```markdown
# PRD: Squad {Title}

**Slug:** {slug}
**Version:** 1.0.0
**Created:** {ISO date}
**Source process:** {process_name} ({total_pus} PUs extraidos)
**Status:** Draft → Approved (via QG-SF-003)

---

## Visao

{Paragrafo gerado no Step 2}

## Escopo

### In-scope
{Lista derivada dos PU-STEPs}

### Out-of-scope
{Lista derivada de external_dependencies + PUs humano-only}

## Personas

### Persona Primaria
{Conteudo do Step 3}

### Personas Secundarias
{Se aplicavel}

## Functional Requirements

{Lista de FR-001 ate FR-N do Step 4}

## Non-Functional Requirements

{Lista de NFR-001 ate NFR-N do Step 5}

## Constraints

{Lista de CON-001 ate CON-N do Step 6}

## Success Criteria

{Lista de SC-001 ate SC-N do Step 7}

## Trace Matrix

| PU-ID | Tipo | Vira em |
|-------|------|---------|
| PU-{slug}-001 | STEP | FR-001 |
| PU-{slug}-002 | DECISION | FR-001 (decision point) |
| PU-{slug}-003 | QUALITY_GATE | NFR-001 |
| ... | ... | ... |

> Trace matrix prova rastreabilidade — cada elemento do PRD veio de PU especifico.

---

## Quality Check (antes de fechar)

- [ ] Todos os PU-STEPs viraram pelo menos 1 FR
- [ ] Todos os PU-QUALITY_GATEs viraram NFR
- [ ] Todos os PU-DEPENDENCYs externos viraram CON
- [ ] Cada FR/NFR/CON tem Origem rastreavel
- [ ] Trace matrix completa
- [ ] Vocabulario do usuario (nao termos inventados)
```

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `docs/prd/squad-{slug}.md` | PRD completo |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| PU-STEP sem PU-OUTPUT associado | Inferir output do contexto, marcar `[INFERRED]` no FR |
| PU-DECISION orfao (sem branches) | Marcar como FR com TODO de extracao adicional |
| Processo sem PU-QUALITY_GATEs | NFRs ficam genericas ("sem criterios explicitos") + warning ao Chief |

---

**Task Status:** Ready for Production
