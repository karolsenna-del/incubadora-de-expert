---
task: "Validate Squad"
responsavel: "@forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "04-squad/ (squad completo), 02-process-map/process-map.yaml"
Saida: "05-validation/validation-report.yaml"
Checklist:
  - "Validacao estrutural PASS (config + agents + tasks + workflow)"
  - "2/3 smoke tests OK"
  - "Usuario aprova squad"
  - "Squad copiado para squads/{name}/ (backup do anterior se existia)"
  - "Skill registrada em .claude/commands/{slashPrefix}.md"
  - "MEMORY.md atualizado com nova linha em Squads Instalados"
  - "Tracker do squad atualizado com LOG de instalacao"
  - "Validacao pos-instalacao PASS"
execution_type: "interactive"
---

# Task: Validate Squad — Validacao Final

**Task ID:** squad-forge/validate-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Validation
**Execution Type:** Interactive

---

## Executive Summary

Fase 5 do pipeline Squad Forge. Validacao final antes de marcar o squad como pronto. Combina validacao estrutural (Auroq compliance), smoke tests (cenarios reais), e aprovacao do usuario.

**Posicao no Workflow:** Fase 5 — Apos Montagem (Fase 4). Ultima fase.
**Definicao de Sucesso:** Squad validado + usuario aprova
**Gate:** QG-SF-005 — Squad Operational

---

## Purpose

Um squad pode estar estruturalmente correto (config valido, tasks com 8 campos) mas operacionalmente quebrado (passo critico faltando, agente errado pra task). Os smoke tests validam que o squad FUNCIONA, nao so que EXISTE.

---

## Step-by-Step Execution

### Step 1: Structural Validation (squad-validator.js)

**Agente:** @forge-smith

Rodar squad-validator.js para confirmar que QG-SF-004 esta valido (ou re-validar):

```bash
node .auroq-core/development/scripts/squad/squad-validator.js minds/{slug}/04-squad/
```

**Se validator disponivel**, apresentar resultado:

```
=== VALIDACAO ESTRUTURAL (squad-validator.js) ===

Resultado: {VALID/INVALID}
Errors: {N} ({lista ou "nenhum"})
Warnings: {N} ({lista ou "nenhum"})
```

**Se validator retornar ERRORS:** Aplicar self-healing loop (corrigir → re-validar, max 3 tentativas).

**Se validator nao disponivel no path**, usar checklist manual:

```
=== VALIDACAO ESTRUTURAL (checklist manual) ===

squad.yaml: {PASS/FAIL}
Agents: {N} encontrados, {N} validos
Tasks: {N} encontradas, {N} validas (8 campos)
Workflows: {N} encontrados, {N} validos
Erros: {lista ou "nenhum"}
Warnings: {lista ou "nenhum"}
```

**OPCIONAL — squad-analyzer.js para metricas de cobertura:**

```bash
node .auroq-core/development/scripts/squad/squad-analyzer.js minds/{slug}/04-squad/
```

### Step 2: Smoke Tests

**Agente:** @forge-chief

Apresentar 2-3 cenarios reais ao usuario e simular como o squad responderia.

**Como construir cada cenario:** Usar os PUs extraidos pra montar cenarios REAIS do processo do usuario, nao cenarios genericos. Cada smoke test deve referenciar passos, decisoes e excecoes especificas do processo extraido.

**Cenario 1: Caminho Feliz**

Simular o fluxo principal do processo — trigger ate entregavel final, sem desvios.

```yaml
elicit: true
prompt: |
  === SMOKE TEST 1: Caminho Feliz ===

  Imagina que alguem ativa esse squad e diz:
  "{trigger normal do processo — do PU que descreve o inicio}"

  O squad faria isso:
  1. {Agente X} executa {task Y}: {resultado especifico do PU-STEP}
  2. {Agente Z} executa {task W}: {resultado especifico do PU-STEP}
  3. Quality gate: {criterio real do PU-QUALITY_GATE}
  4. Output final: {entregavel real do PU-OUTPUT}

  Isso e o que deveria acontecer? Ta correto?
type: "confirmation"
```

> **Como construir este exemplo concreto:** pegar o trigger do PU-STEP que inicia o processo, listar 3-5 passos do happy path com agentes/tasks reais do blueprint, citar PU-QUALITY_GATE como criterio de checkpoint, e o entregavel do PU-OUTPUT final. NAO inventar cenarios externos ao processo extraido.

**Cenario 2: Decisao**

Simular uma bifurcacao real do processo — usar um PU-DECISION especifico.

```yaml
elicit: true
prompt: |
  === SMOKE TEST 2: Decisao ===

  E se durante o processo, {condicao real de um PU-DECISION}?

  O squad faria:
  → {branch A do PU-DECISION}: {acao especifica}
  → Se fosse o contrario ({condicao oposta}): {branch B}

  Esse e o caminho certo?
type: "confirmation"
```

> **Como construir:** escolher 1 PU-DECISION especifico do processo. Citar a condicao real (vocabulario do usuario), os 2 branches do PU-DECISION, e perguntar se o squad faria isso conforme o usuario descreveu.

**Cenario 3: Excecao**

Simular uma falha real do processo — usar um PU-EXCEPTION especifico.

```yaml
elicit: true
prompt: |
  === SMOKE TEST 3: Excecao ===

  E se {trigger real de um PU-EXCEPTION}?

  O squad faria:
  → {response real do PU-EXCEPTION}
  → Severity: {severity do PU-EXCEPTION}

  E isso que deveria acontecer?
type: "confirmation"
```

> **Como construir:** escolher 1 PU-EXCEPTION com severity declarada no processo extraido. Citar o trigger real do usuario, a response que ele descreveu, e a severity classificada (blocker/degraded/cosmetic).

**Criterio:** 2 de 3 cenarios PASS

### Step 3: User Walkthrough

```yaml
elicit: true
prompt: |
  === SQUAD FINAL ===

  Seu processo "{process_name}" virou o squad "{squad_name}".

  Resumo:
  - {N} agentes: {nomes}
  - {N} tasks
  - {N} quality gates
  - Workflow de {N} fases

  Pra usar: /{slashPrefix}

  O squad ta no diretorio: minds/{slug}/04-squad/
  Pra ativar, copie pra squads/{squad-name}/

  Voce aprova esse squad? Algo que gostaria de ajustar?
type: "free_text"
```

### Step 4: Quality Gate — QG-SF-005

**Criterios:**

| Criterio | Obrigatorio |
|----------|-------------|
| Validacao estrutural PASS | Sim |
| 2/3 smoke tests OK | Sim |
| Usuario aprova | Sim |

**Veto conditions:**
- Usuario rejeita ("nao funciona", "ta errado")
- 0/3 smoke tests passam
- Validacao estrutural falhou

**Se QG-SF-005 nao passou:**
- Se smoke test falhou: identificar gap, voltar pra extracao cirurgica ou ajustar blueprint
- Se usuario rejeitou: coletar feedback, ajustar

### Step 5: Finalize

Gerar `05-validation/`:

```yaml
# 05-validation/validation-report.yaml
structural:
  config: PASS
  agents: PASS
  tasks: PASS
  workflows: PASS
  warnings: []

smoke_tests:
  test_1_happy_path: PASS
  test_2_decision: PASS
  test_3_exception: PASS
  score: "3/3"

user_approval:
  approved: true
  feedback: "{comentarios}"
  approved_at: "{timestamp}"

overall: PASS
```

Atualizar `.state.json`:

```json
{
  "current_phase": 5,
  "phase_status": {
    "phase_5": "completed"
  },
  "quality_gates_passed": ["QG-SF-001", "QG-SF-002", "QG-SF-003", "QG-SF-004", "QG-SF-005"],
  "completed_at": "{timestamp}"
}
```

### Step 6: Auto-Install (OBRIGATORIO apos QG-SF-005 PASS)

> Antes de Fase 5 do plano de correcao (05/05/2026), o squad ficava em `minds/{slug}/04-squad/` e o usuario tinha que copiar manualmente. Hoje, instalacao e automatica.

**Sub-step 6.1 — Backup se squad ja existe:**

```bash
if [ -d "squads/{squad-name}/" ]; then
  mkdir -p squads/_archive
  cp -r squads/{squad-name}/ squads/_archive/{squad-name}-{ISO_timestamp}/
  echo "Backup do squad existente em squads/_archive/{squad-name}-{ISO_timestamp}/"
fi
```

**Sub-step 6.2 — Cópia:**

```bash
cp -r minds/{slug}/04-squad/ squads/{squad-name}/
```

**Sub-step 6.3 — Registrar skill em `.claude/commands/{slashPrefix}.md`:**

Criar arquivo com formato padrao do Auroq:

```markdown
# {slashPrefix}

{Descricao do squad em 1 linha}

CRITICAL: First, read and adopt the persona defined in `squads/{squad-name}/agents/{chief-agent}.md`.
Then, read and execute the task defined in `squads/{squad-name}/tasks/start.md`.
Follow ALL instructions exactly as written. Those files are your single source of truth.
```

> Mesmo formato dos squads existentes (ver `.claude/commands/squadForge.md`, `clone-forge.md`, etc.)

**Sub-step 6.4 — Atualizar MEMORY.md do projeto:**

Adicionar linha em `MEMORY.md` (na raiz do projeto Auroq) na secao "Squads Instalados". Se o arquivo ou secao nao existir, criar:

```markdown
## Squads Instalados

| **{Squad Title}** | `squads/{squad-name}/` | {N} ({chief + tier_1 list}) | `/{slashPrefix}` |
```

**Sub-step 6.5 — Atualizar tracker do squad:**

Em `business/campanhas/squad-{slug}/tracker.md`:

```markdown
- [x] Fase 5: Validacao + Instalacao

## LOG
- {ISO} — @forge-chief: Squad instalado em squads/{squad-name}/, skill registrada em .claude/commands/{slashPrefix}.md, MEMORY.md atualizado
```

**Sub-step 6.6 — Validar instalacao:**

```bash
# Verificar arquivos
test -f squads/{squad-name}/squad.yaml || { echo "FAIL: squad.yaml ausente"; exit 1; }
test -f .claude/commands/{slashPrefix}.md || { echo "FAIL: skill nao registrada"; exit 1; }

# Tentar carregar squad.yaml (sintaxe valida)
node -e "require('js-yaml').load(require('fs').readFileSync('squads/{squad-name}/squad.yaml', 'utf8'))" \
  || { echo "FAIL: squad.yaml invalido"; exit 1; }
```

**Se qualquer sub-step falha:** rollback completo
- Apagar `squads/{squad-name}/` recem-criado
- Apagar `.claude/commands/{slashPrefix}.md` recem-criado
- Reverter linha do MEMORY.md
- Restaurar backup se existia
- Reportar erro ao usuario

**Sub-step 6.7 — Atualizar `.state.json`:**

```json
{
  "installed_to": "squads/{squad-name}/",
  "skill_registered": ".claude/commands/{slashPrefix}.md",
  "completed_at": "{ISO}"
}
```

### Step 7: Mensagem Final

```
=== SQUAD FORGE — COMPLETO ===

Processo "{process_name}" → Squad "{squad_name}"

Pipeline:
✅ Fase 0: Setup
✅ Fase 1: Extracao ({N} PUs, {N} rounds)
✅ Fase 2: Playback (validado pelo usuario)
✅ Fase 3: Arquitetura + PRD + Stories ({N} agentes, {N} tasks)
✅ Fase 4: Montagem (Auroq compliant + profundidade)
✅ Fase 5: Validacao + Instalacao Automatica

Squad instalado em: squads/{squad-name}/
Skill registrada em: .claude/commands/{slashPrefix}.md
PRD: docs/prd/squad-{slug}.md
Stories: docs/stories/squad-forge/{slug}/
Tracker: business/campanhas/squad-{slug}/tracker.md

Ja ta ativo. Usa: /{slashPrefix}

Seu processo agora e um squad. Nao esta mais so na sua cabeca.
```

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `05-validation/validation-report.yaml` | Relatorio completo |
| `.state.json` | Estado final (completed + installed_to + skill_registered) |
| `squads/{squad-name}/` | Squad instalado |
| `.claude/commands/{slashPrefix}.md` | Skill registrada |
| `MEMORY.md` (raiz do projeto) | Atualizado em "Squads Instalados" |
| `business/campanhas/squad-{slug}/tracker.md` | LOG de instalacao adicionado |
| `squads/_archive/{squad-name}-{timestamp}/` | Backup (se squad ja existia antes) |

---

**Task Status:** Ready for Production
