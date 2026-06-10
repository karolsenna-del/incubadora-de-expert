---
task: "Self Test"
responsavel: "@forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nada (auto-introspeccao)"
Saida: "minds/_self-test/{ISO}-self-test-report.md"
Checklist:
  - "Audit estrutural do squad-forge (mesmos checks de fix-squad)"
  - "Self-consistency (greeting vs comandos vs tasks)"
  - "Continuous validation thresholds"
  - "Relatorio salvo + apresentado"
execution_type: "interactive"
---

# Task: Self Test — Auto-Diagnostico do Squad Forge

**Task ID:** squad-forge/self-test
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Maintenance / Self-validation
**Execution Type:** Interactive

---

## Executive Summary

Comando `*self-test` do forge-chief. Roda `*fix` no proprio squad-forge + checks adicionais de consistencia interna. Garante que squad-forge nunca regride pro estado superficial que motivou o plano de correcao de 05/05/2026.

---

## Pipeline Visual

```
self-test
  |
  v
STEP 1: AUDIT THE FORGE
  Equivalente a fix-squad.md aplicado em squads/squad-forge/
  |
  v
STEP 2: CONSISTENCY CHECKS
  Greeting vs comandos, paths, schema
  |
  v
STEP 3: CONTINUOUS VALIDATION
  Thresholds de quality-thresholds.yaml
  |
  v
STEP 4: GENERATE SELF-TEST REPORT
  minds/_self-test/{ISO}-report.md
  |
  v
STEP 5: PRESENT TO USER
  Categorias + recomendacoes
```

---

## Step-by-Step Execution

### Step 1: Audit the Forge

Executar `tasks/fix-squad.md` com target=`squads/squad-forge/`.

Captura:
- squad-validator.js output
- squad-analyzer.js output
- Depth metrics dos 3 agentes (forge-chief, process-archaeologist, forge-smith)
- Depth metrics da KB (data/forge-kb.md, executor-mapping-guide.yaml, etc.)

### Step 2: Consistency Checks (especificos do forge)

Checks que so fazem sentido pro squad-forge:

| Check | Verificacao |
|-------|-------------|
| **REGRA AUTOCONTIDO enforcement** | assemble-squad Step 8 grep + QG-SF-004 veto + fix-squad Step 4 critico — todos com mesmo set de patterns proibidos |
| Greeting promete N modos, chief tem N comandos | `start.md` Step 3 vs `forge-chief.md` COMMANDS |
| Tasks listadas em squad.yaml existem | Para cada item de `tasks:`, `tasks/{nome}.md` existe |
| Pipeline visual de cada task bate com Steps | Numeros coerentes (sem Step 9 duplicado, etc) |
| QGs do squad.yaml batem com QGs nas tasks | `QG-SF-001..005` consistente |
| Thresholds em quality-thresholds.yaml leitos pelas tasks | Tasks referenciam o arquivo |
| Schema path correto em forge-smith | `.auroq-core/schemas/squad-schema.json` |
| `data/` (nao `knowledge/`) em todos os outputs | Consistencia interna |

### Step 3: Continuous Validation (forge respeita seus proprios thresholds?)

Ler `data/quality-thresholds.yaml`. Aplicar nos artefatos do proprio squad-forge:

```bash
THRESHOLDS=squads/squad-forge/data/quality-thresholds.yaml

# Agentes do forge
for agent in squads/squad-forge/agents/*.md; do
  lines=$(wc -l < "$agent")
  examples=$(grep -c "^### Exemplo\|^## OUTPUT EXAMPLES\|## Exemplo" "$agent")
  triggers=$(grep -A100 "IMMUNE SYSTEM" "$agent" 2>/dev/null | grep -c "^|")
  frases=$(grep -A20 "Frases-Chave" "$agent" 2>/dev/null | grep -c '^- "')

  # Check vs thresholds
  if [ "$lines" -lt 250 ]; then echo "FORGE FAIL: $agent linhas=$lines (min 250)"; fi
done

# Tasks do forge — checagem 8 campos
for task in squads/squad-forge/tasks/*.md; do
  for field in task responsavel responsavel_type atomic_layer Entrada Saida Checklist execution_type; do
    grep -q "^$field:" "$task" || echo "FORGE FAIL: $task sem campo $field"
  done
done
```

> **Observacao importante:** o squad-forge NAO precisa cumprir os thresholds que ele aplica em squads gerados — ele e meta-squad e tem natureza diferente. Mas DEVE ser consistente internamente.

### Step 4: Generate Self-Test Report

Salvar em `squads/squad-forge/minds/_self-test/{ISO}-self-test-report.md`:

```markdown
# Self-Test Report — Squad Forge

**Executado:** {ISO}
**Squad-Forge version:** 1.0.0 + Plano de Correcao v2.0

---

## Summary

- Critical issues: {N}
- Serious issues: {N}
- Minor issues: {N}
- Self-consistency: {PASS|FAIL}
- Continuous validation: {PASS|FAIL}

---

## Audit Result (Step 1)

{Output do fix-squad.md aplicado em squads/squad-forge/}

---

## Consistency Checks (Step 2)

| Check | Status |
|-------|--------|
| Greeting modes vs chief commands | {PASS|FAIL: detalhe} |
| Tasks listed in squad.yaml exist | {PASS|FAIL: detalhe} |
| Pipeline visuals match steps | {PASS|FAIL: detalhe} |
| QG-SF-* consistency | {PASS|FAIL: detalhe} |
| Thresholds referenced by tasks | {PASS|FAIL: detalhe} |
| Schema path correct | {PASS|FAIL: detalhe} |
| `data/` consistency | {PASS|FAIL: detalhe} |

---

## Continuous Validation (Step 3)

### Agents
| Agent | Lines | Examples | Triggers | Frases | Verdict |
|-------|-------|----------|----------|--------|---------|
| forge-chief | {N} | {N} | {N} | {N} | {PASS|FAIL} |
| process-archaeologist | ... | ... | ... | ... | ... |
| forge-smith | ... | ... | ... | ... | ... |

### Tasks (8 campos)
| Task | Missing Fields | Verdict |
|------|---------------|---------|
| start | (nenhum) | PASS |
| extract-process | (nenhum) | PASS |
| ... | ... | ... |

---

## Recommendations

{Lista de acoes prioritarias se houver issues}

---

## Verdict

{PASS|NEEDS_WORK|FAIL}

{Se PASS: "Squad-forge esta saudavel. Nada precisa de fix."}
{Se NEEDS_WORK: "Issues nao-bloqueantes encontrados. Recomendado fix em {N} dias."}
{Se FAIL: "Issues bloqueantes. Squad-forge nao deve gerar squads novos ate fix."}
```

### Step 5: Present to User

```
=== SELF-TEST REPORT — Squad Forge ===

{Resumo do report}

Verdict: {PASS|NEEDS_WORK|FAIL}

{Se issues:}
Quer que eu rode `*fix squad-forge` agora pra corrigir o que da?

{Se PASS:}
Tudo certo. Squad-forge ta saudavel.
```

---

## When to Run

Recomendado:
- **Apos qualquer mudanca** em arquivos do squad-forge (tasks, agents, KB)
- **Antes de gerar squad novo** se faz tempo que nao roda
- **Mensalmente** como saude check de rotina
- **Apos atualizacao do Auroq core** que pode afetar paths/schemas

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `squads/squad-forge/minds/_self-test/{ISO}-self-test-report.md` | Relatorio |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Squad-forge tem issue critico bloqueante | Avisar usuario, recomendar nao gerar squads novos ate fix |
| validator nao disponivel | Cair pro checklist nuclear |
| Self-test demora demais (>5min) | Salvar progresso parcial, retomar depois |

---

**Task Status:** Ready for Production
