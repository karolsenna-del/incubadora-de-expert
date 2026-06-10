---
task: "Rebuild Squad"
responsavel: "@forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nome do squad existente"
Saida: "Squad reconstruido em squads/{name}/, backup do anterior em squads/_archive/"
Checklist:
  - "Backup do squad atual em _archive/"
  - "PUs extraidos via reverse engineering dos arquivos existentes"
  - "Playback do extraido + perguntar ao usuario o que mudou"
  - "Pipeline normal Fase 3-5 com profundidade nova (Fase 2 do plano)"
  - "Squad novo passa em todos os QGs"
  - "Backup preservado por 30 dias"
execution_type: "interactive"
---

# Task: Rebuild Squad — Reconstrucao com Reverse Engineering

**Task ID:** squad-forge/rebuild-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Maintenance
**Execution Type:** Interactive

---

## Executive Summary

Modo `*rebuild {squad-name}` do forge-chief. Refaz squad existente com profundidade nova, mas preserva o que foi extraido. Extrai PUs do squad atual via reverse engineering (agents.md → PUs), valida com usuario, reconstroi.

**Quando usar:**
- Squad foi gerado antes da Fase 2 do plano de correcao (sem profundidade obrigatoria)
- Arquitetura precisa repensar
- Squad acumulou inconsistencias demais pra `*fix` resolver
- Voce quer atualizar pra padroes novos do squad-forge

**Diferenca de `*update`:** rebuild refaz do zero. Update edita cirurgicamente.

---

## Pipeline Visual

```
rebuild-squad
  |
  v
STEP 1: IDENTIFY + BACKUP
  Squad → squads/_archive/{name}-{timestamp}/
  |
  v
STEP 2: REVERSE-EXTRACT
  Ler agents.md, tasks.md, KB → recriar PUs
  |
  v
STEP 3: PLAYBACK + UPDATE
  Apresentar pro usuario, perguntar o que mudou desde a versao anterior
  |
  v
STEP 4: ARCHITECTURE (Fase 3 normal)
  PRD + Stories + Tracker + Blueprint
  |
  v
STEP 5: ASSEMBLY (Fase 4 com profundidade nova)
  Gera com hard gates da Fase 2 do plano
  |
  v
STEP 6: VALIDATION (Fase 5 normal)
  Smoke tests + aprovacao + instalacao auto
  |
  v
STEP 7: PRESERVE BACKUP
  Manter _archive/ por 30 dias
```

---

## Step-by-Step Execution

### Step 1: Identify + Backup

```bash
# Validar squad existe
ls squads/{name}/squad.yaml

# Backup
cp -r squads/{name}/ squads/_archive/{name}-{ISO_timestamp}/
```

Avisar usuario:
```
Squad {name} backup em squads/_archive/{name}-{timestamp}/

Vou ler o squad atual e tentar recuperar o que foi extraido.
Depois te apresento e voce confirma + me conta o que mudou.

Isso vai levar uns 30-60 min total.
```

### Step 2: Reverse-Extract (PUs do squad existente)

Ler:
- `squads/{name}/squad.yaml` — agentes, tasks, workflow, quality gates
- `squads/{name}/agents/*.md` — responsabilidades, output examples, immune system
- `squads/{name}/tasks/*.md` — steps, checklists, error handling
- `squads/{name}/data/*.md` — KB, regras, protocolos
- `squads/{name}/workflows/*.yaml` — fases, dependencias

**Mapeamento reverso:**

| Artefato existente | Vira em |
|-------------------|---------|
| Task step com verbo+objeto | PU-STEP |
| Task checklist item | PU-QUALITY_GATE |
| Task error handling row | PU-EXCEPTION |
| Agent IMMUNE SYSTEM trigger | PU-EXCEPTION ou PU-TACIT |
| Agent OUTPUT EXAMPLES | PU-STEP + PU-OUTPUT (rastrear scenario) |
| KB Regra Cardinal | PU-TACIT |
| KB decision tree | PU-DECISION com branches |
| KB protocolo | PU-STEP operacional + detalhes |
| squad.yaml quality_gates | PU-QUALITY_GATE com transition |
| workflow phase order | PU-DEPENDENCY |

Salvar PUs reconstruidos em `minds/{slug}/01-extraction/process-units.yaml` (overwrite ou novo dir `minds/{slug}-rebuild/`).

**Marcar todos os PUs como `inferred_from_squad: true`** + confidence inicial 0.6 (reconstruidos, nao confirmados).

### Step 3: Playback + Update

Apresentar processo reconstruido pro usuario (mesmo formato do `playback-validate.md`):

```yaml
elicit: true
prompt: |
  Reconstrui o processo do squad {name} a partir dos arquivos atuais.
  Capturei {N} PUs.

  {narrativa do processo}

  Agora me conta:
  1. Isso bate com o processo real hoje?
  2. O que mudou desde que esse squad foi feito?
  3. Tem capacidade nova que voce quer adicionar?
  4. Tem coisa que ja nao usa mais?
type: "free_text"
```

**Integrar correcoes** (mesmo loop do playback-validate Step 4).

**Diferenca:** confidence dos PUs sobe pra 1.0 conforme usuario confirma. PUs nao-confirmados ficam com `inferred_from_squad: true` + warning no blueprint.

### Step 4: Architecture (Fase 3 normal)

Executar `architect-squad.md` completo (Step 0 ate Step 10):
- Generate PRD
- Analyze process map (do que foi reextraido)
- Identify clusters
- Define agents
- Map PUs to tasks + KB
- Plan KB
- Design workflow
- Generate blueprint
- Generate stories
- Create tracker
- QG-SF-003

### Step 5: Assembly (Fase 4 com profundidade nova)

Executar `assemble-squad.md` completo. Hard gates da Fase 2 do plano de correcao garantem profundidade nova:
- >=250 linhas/agente
- >=3 OUTPUT EXAMPLES por agente
- >=3 IMMUNE SYSTEM triggers
- >=5 Frases-Chave
- KB com profundidade pelo tipo
- Self-audit + squad-validator PASS

**Importante:** mesmo squad reconstruido nao "passa de graça" pelos gates. Profundidade obrigatoria vale igual.

### Step 6: Validation (Fase 5 normal)

Executar `validate-squad.md`:
- Smoke tests (cenarios reconstruidos dos PUs)
- Walkthrough do squad novo
- Aprovacao do usuario
- Instalacao automatica em `squads/{name}/` (sobrescreve)

**Antes de sobrescrever:** confirmar com usuario:

```
Squad {name} novo passou em todos os gates.

Vou substituir squads/{name}/ pelo novo.
Backup do anterior continua em squads/_archive/{name}-{timestamp}/ por 30 dias.

Confirma?
```

### Step 7: Preserve Backup

Adicionar em `squads/_archive/_retention.md`:

```markdown
- {name}-{timestamp}: rebuild executado em {ISO}, manter ate {ISO + 30d}
```

Apos 30 dias, backup pode ser deletado (manual — squad-forge nao deleta automaticamente).

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `squads/_archive/{name}-{timestamp}/` | Backup do squad anterior |
| `minds/{slug}-rebuild/` (ou overwrite minds/{slug}/) | Pipeline data |
| `docs/prd/squad-{name}.md` | PRD novo (ou atualizado) |
| `docs/stories/squad-forge/{name}/` | Stories novas |
| `business/campanhas/squad-{name}/tracker.md` | Tracker (LOG mantido se existia) |
| `squads/{name}/` | Squad reconstruido |
| `squads/_archive/_retention.md` | Registro de retencao |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Reverse-extract gera PUs muito incompletos | Sugerir extracao normal (`*start`) ao inves |
| Usuario rejeita o processo reconstruido | Voltar ao Step 2, fazer extracao adicional via Archaeologist |
| Profundidade nova falha no assembly | Self-healing 3 tentativas, depois HALT (manter squad antigo intacto) |
| Squad antigo era squad-forge dependency | Bloquear: avisar que reconstruir o forge precisa cuidado especial |

---

**Task Status:** Ready for Production
