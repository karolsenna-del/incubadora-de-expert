---
task: "Generate Stories"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "docs/prd/squad-{slug}.md, 03-blueprint/squad-blueprint.yaml"
Saida: "docs/stories/squad-forge/{slug}/*.story.md"
Checklist:
  - "1 story por fase do workflow do squad gerado"
  - "Cada story tem AC com [ ] checkboxes"
  - "Cada story referencia PRD (FR-xxx, NFR-xxx)"
  - "Story principal tem AC = 5 QGs do squad-forge (QG-SF-001..005)"
  - "File List inicializada (vazia, sera preenchida no assemble)"
  - "Dev Notes com referencia aos PUs"
execution_type: "semantic"
---

# Task: Generate Stories — Stories de Desenvolvimento do Squad

**Task ID:** squad-forge/generate-stories
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Documentation
**Execution Type:** Semantic

---

## Executive Summary

Apos PRD gerado, antes de Assembly (Fase 4), criar stories de implementacao em `docs/stories/squad-forge/{slug}/`. Cada story corresponde a uma fase do workflow do squad gerado, com Acceptance Criteria rastreaveis ao PRD e PUs.

**Posicao no Workflow:** Sub-task da Fase 3 (apos generate-prd)
**Definicao de Sucesso:** Stories prontas pro assemble-squad usar como tracker
**Gate:** Parte de QG-SF-003

---

## Purpose

Article III da Constitution: "All development starts with a story". Hoje o squad-forge ignora. Esta task corrige.

Stories funcionam como tracker de progresso durante a Fase 4 (Assembly). Cada artefato gerado marca AC como `[x]`. File List e atualizada conforme arquivos sao criados.

---

## Pipeline Visual

```
generate-stories
  |
  v
STEP 1: LOAD PRD + BLUEPRINT
  |
  v
STEP 2: CREATE EPIC STORY
  Story principal: criacao do squad
  AC = 5 QGs do squad-forge
  |
  v
STEP 3: CREATE PHASE STORIES
  1 story por fase do workflow
  AC = quality gates do squad gerado
  |
  v
STEP 4: WRITE STORIES
  docs/stories/squad-forge/{slug}/*.story.md
```

---

## Step-by-Step Execution

### Step 1: Load PRD + Blueprint

Ler:
- `docs/prd/squad-{slug}.md`
- `03-blueprint/squad-blueprint.yaml`

### Step 2: Create Epic Story (story principal)

`docs/stories/squad-forge/{slug}/0.0.epic.story.md`:

```markdown
# Story 0.0: Squad {Title} — Epic

**Status:** Draft
**Epic:** Criacao do Squad {title}
**PRD:** docs/prd/squad-{slug}.md

## User Story

As {persona primaria},
I want {squad capability principal extraido do PRD vision},
So that {beneficio principal}.

## Acceptance Criteria (mapeadas aos QGs do squad-forge)

- [ ] **AC-1 (QG-SF-001):** Extracao completa — >=15 PUs, 6/8 lentes cobertas, confianca media >=0.7
- [ ] **AC-2 (QG-SF-002):** Playback validado — usuario confirmou "esse e meu processo"
- [ ] **AC-3 (QG-SF-003):** Arquitetura coerente — 1-7 agentes, cada PU mapeado, sem dep circular, PRD + stories gerados
- [ ] **AC-4 (QG-SF-004):** Estrutura nuclear + profundidade — squad-validator PASS + self-audit PASS (agentes >=250 linhas, 3+ Output Examples, 3+ Immune triggers, KB rica)
- [ ] **AC-5 (QG-SF-005):** Operacional — 2/3 smoke tests PASS, usuario aprova, instalacao automatica em squads/

## Tasks (alta granularidade — 1 task = 1 fase do pipeline squad-forge)

- [ ] Setup (Fase 0)
- [ ] Extracao de Processo (Fase 1)
- [ ] Playback Validation (Fase 2)
- [ ] Arquitetura + PRD + Stories (Fase 3)
- [ ] Montagem (Fase 4) — ver stories N.N de cada fase do squad gerado
- [ ] Validacao Final (Fase 5)

## File List

(Sera preenchida durante Fase 4 com cada arquivo gerado)

## Dev Notes

- **Source process:** {process_name} ({total_pus} PUs extraidos)
- **Process map:** minds/{slug}/02-process-map/process-map.yaml
- **Blueprint:** minds/{slug}/03-blueprint/squad-blueprint.yaml
- **Agentes do squad:** {N agentes}, {N tasks}, {N workflows}

## QA Notes

(Preenchida pelo @forge-chief na Fase 5 com resultado de smoke tests)
```

### Step 3: Create Phase Stories

Para cada fase do workflow do squad gerado, criar 1 story em `docs/stories/squad-forge/{slug}/{N}.story.md`:

```markdown
# Story {N}.0: {Nome da fase do workflow do squad gerado}

**Status:** Draft
**Epic:** Squad {title}
**Parent:** docs/stories/squad-forge/{slug}/0.0.epic.story.md
**Phase:** Phase {N} do workflow `wf-{squad-name}`

## Context

{Descricao da fase do blueprint — o que essa fase do squad gerado faz}

## Acceptance Criteria

- [ ] **AC-1:** {Quality gate dessa fase do squad gerado, do blueprint}
- [ ] **AC-2:** Tasks implementadas: {lista das tasks dessa fase}
- [ ] **AC-3:** Agente responsavel definido: @{agent-id}

## FRs cobertos

- FR-001 (PU-STEP-xxx)
- FR-002 (PU-STEP-yyy)

## NFRs aplicaveis

- NFR-001 (criterio de qualidade)

## Tasks (granularidade = 1 task = 1 artefato gerado)

- [ ] Gerar agente {agent-id}.md (>=250 linhas, 3+ Output Examples, 3+ Immune triggers)
- [ ] Gerar task {task-name}.md (8 campos TASK-FORMAT-SPEC-V1)
- [ ] {outras tasks especificas dessa fase}

## File List

- (preenchida durante geracao)

## Dev Notes

- PUs cobertas: PU-{slug}-001, PU-{slug}-002
- Bottleneck identificado: {se aplicavel}
- Human touchpoint: {se aplicavel}
```

### Step 4: Write Stories

Salvar todas em `docs/stories/squad-forge/{slug}/`. Estrutura final:

```
docs/stories/squad-forge/{slug}/
  0.0.epic.story.md         # Story principal (5 ACs = 5 QGs)
  1.story.md                # Phase 1 do squad gerado
  2.story.md                # Phase 2 do squad gerado
  ...
  N.story.md                # Phase N
```

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `docs/stories/squad-forge/{slug}/0.0.epic.story.md` | Story principal |
| `docs/stories/squad-forge/{slug}/{N}.story.md` | 1 story por fase do squad gerado |

---

## Integration with Assembly Phase

Durante Fase 4 (`assemble-squad.md`), cada step que gera artefato:
1. Marca AC correspondente na story como `[x]`
2. Adiciona arquivo gerado a File List
3. Atualiza Status (Draft → InProgress → Done)

Stories sao tracker de progresso. Sem stories, Fase 4 voa as cegas.

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Blueprint sem fases definidas | Fall back: 1 story unica = epic |
| PRD sem FRs (processo simples) | Stories so com ACs estruturais |
| Multiple agents na mesma fase | 1 story por agente, parent = story da fase |

---

**Task Status:** Ready for Production
