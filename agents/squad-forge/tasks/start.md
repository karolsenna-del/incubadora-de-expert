---
task: "Start"
responsavel: "@forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario via /squadForge"
Saida: "Pipeline inicializado, estrutura de diretorios criada, handoff para extracao"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Nome e escopo do processo coletados"
  - "Diretorio minds/{slug}/ criado com 5 subdiretorios"
  - ".state.json inicializado"
execution_type: "interactive"
---

# Task: Start — Entry Point do Squad Forge

**Task ID:** squad-forge/start
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Entry Point
**Execution Type:** Interactive

---

## Executive Summary

Entry point unico do Squad Forge. Ativa o Chief, exibe greeting com 3 modos (criar, atualizar, diagnosticar), roteia pro fluxo correto. Criar = pipeline de extracao. Atualizar = modificar squad existente. Diagnosticar = analisar e sugerir melhorias.

## Purpose

O usuario chega querendo criar um squad novo, atualizar um existente ou diagnosticar problemas. Este task e o ponto de entrada — identifica o modo e roteia pro fluxo correto.

---

## Pipeline Visual

```
/squadForge
  |
  v
STEP 1: ACTIVATE CHIEF
  Carrega forge-chief agent
  |
  v
STEP 2: DISPLAY GREETING
  Greeting breve + convite
  |
  v
STEP 3: COLLECT SCOPE
  Qual processo? Nome, descricao breve
  |
  v
STEP 4: CREATE STRUCTURE
  Diretorio minds/{slug}/
  |
  v
STEP 5: HANDOFF TO EXTRACTION
  -> extract-process task
```

---

## Step-by-Step Execution

### Step 0: Continuous Validation (Pre-flight check)

> Antes de gerar squad novo, garantir que squad-forge ele mesmo esta saudavel.

Executar check rapido:

```bash
# Sanity check — arquivos chave existem
test -f squads/squad-forge/agents/forge-chief.md \
  && test -f squads/squad-forge/agents/process-archaeologist.md \
  && test -f squads/squad-forge/agents/forge-smith.md \
  && test -f squads/squad-forge/data/quality-thresholds.yaml \
  || { echo "Squad-forge inconsistente. Rode *self-test antes."; exit 1; }
```

**Se inconsistencia detectada:** avisar usuario:

```
Squad-forge esta com arquivos faltando. Antes de gerar squad novo,
recomendo rodar *self-test pra diagnosticar e corrigir.

Continuar mesmo assim? Pode gerar squad com qualidade abaixo do esperado.
```

(Se usuario optar por continuar, prosseguir mas registrar warning no `.state.json`.)

### Step 1: Activate Chief

Carregar o agente `forge-chief`.

### Step 2: Display Greeting

```
=== SQUAD FORGE ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Cada processo que vive so na sua cabeca e um risco.
Eu tiro ele de la e transformo num squad que roda sozinho.
Extracao profunda com 8 lentes — nao meia duzia de perguntas.

O que posso fazer:

1. Criar squad novo — extrair processo e montar do zero
2. Atualizar squad — mexer em agents, tasks, KB, workflow ou estrutura
3. Consertar squad — diagnosticar problemas e corrigir
4. Refazer squad — reconstruir do zero mantendo o que funciona

Qual vai ser?
```

**Regras do Greeting:**
- NAO listar todos os agentes
- NAO listar todos os comandos
- NAO explicar o pipeline
- Ir direto ao ponto

### Step 3: Collect Scope

```yaml
elicit: true
prompt: |
  Escolha:
  1. Criar squad novo
  2. Atualizar squad
  3. Consertar squad
  4. Refazer squad
type: "numbered_choice"
default: 1
```

**Roteamento real (cada opcao tem task dedicada):**

**Opcao 1 — Criar squad novo:**
- Coletar nome e descricao do processo, gerar slug
- **Perguntar `target_audience`** (CRITICO pra REGRA AUTOCONTIDO):

  ```yaml
  elicit: true
  prompt: |
    Esse squad vai ser usado SO por voce (Euriler), ou tambem distribuido pra alunos/clientes?

    1. Interno — so eu (pode usar refs a business/cockpit.md, business/campanhas/, etc)
    2. Distribuido — pra alunos/clientes (REGRA AUTOCONTIDO ativa: zero refs a paths privados)

    Default: 2 (mais seguro)
  type: numbered_choice
  default: 2
  ```

- Salvar em `.state.json` como `target_audience: "internal" | "distributed"`
- Seguir pipeline normal (Steps 4-5 desta task → handoff `extract-process`)

**Opcao 2 — Atualizar squad:**
- Listar squads instalados (`ls -1 squads/ | grep -v '^_'`)
- Perguntar qual squad
- Executar `tasks/update-squad.md` (modificacao cirurgica preservando profundidade)
- Comando equivalente: `*update {squad-name}`

**Opcao 3 — Consertar squad:**
- Listar squads instalados
- Perguntar qual squad
- Executar `tasks/fix-squad.md` (audit + auto-fix + lista manual)
- Comando equivalente: `*fix {squad-name}`

**Opcao 4 — Refazer squad:**
- Listar squads instalados
- Perguntar qual squad
- Executar `tasks/rebuild-squad.md` (reverse-extract + reconstruir com profundidade nova)
- Comando equivalente: `*rebuild {squad-name}`

> Cada modo tem task dedicada com checklist proprio. Nao improvisar — sempre delegar pra task.

### Step 4: Create Structure

Criar diretorios:

```
squads/squad-forge/minds/{slug}/
  01-extraction/
  02-process-map/
  03-blueprint/
  04-squad/
  05-validation/
```

Inicializar `.state.json` do pipeline:

```json
{
  "process_slug": "{slug}",
  "process_name": "{nome}",
  "current_phase": 0,
  "phase_status": {
    "phase_0": "completed",
    "phase_1": "pending",
    "phase_2": "pending",
    "phase_3": "pending",
    "phase_4": "pending",
    "phase_5": "pending"
  },
  "extraction_rounds": 0,
  "total_pus": 0,
  "quality_gates_passed": [],
  "started_at": "{timestamp}"
}
```

### Step 5: Handoff to Extraction

```
Beleza! Estrutura criada pra "{process_name}".

Vou passar pro Archaeologist agora — ele vai te entrevistar em rounds
pra extrair seu processo com profundidade.

Primeiro round: visao geral e sequencia de passos.
Segundo round: decisoes, excecoes, inputs/outputs.
Terceiro round: criterios de qualidade, dependencias, conhecimento tacito.

Vamos comecar.
```

Executar handoff para @process-archaeologist via extract-process task.

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Usuario nao sabe qual processo | Ajudar: "Qual atividade voce faz que gostaria que um time de IA fizesse por voce?" |
| Processo parece muito simples (2-3 passos) | Avisar: "Processos simples podem nao precisar de squad. Vamos extrair e avaliar." |
| Processo ja tem documentacao | Oferecer UC3: "Ja tem doc? Posso pular extracao e ir direto pra construcao." |
| Usuario quer extrair multiplos processos | Fazer 1 por vez: "Vamos comecar com o mais importante. Qual?" |
| Usuario quer atualizar squad que nao existe | Listar squads disponiveis: "Esses sao os squads instalados: {lista}. Qual?" |
| Usuario quer atualizar algo que nao e squad (ex: agente Auroq) | Redirecionar: "Isso e um agente core, nao squad. Posso ajudar de outra forma." |

---

**Task Status:** Ready for Production
