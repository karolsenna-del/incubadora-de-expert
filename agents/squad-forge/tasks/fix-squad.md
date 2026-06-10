---
task: "Fix Squad"
responsavel: "@forge-smith"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Nome do squad existente"
Saida: "audit-report.md, lista de fixes aplicados, lista de fixes manuais necessarios"
Checklist:
  - "squad-validator.js executado"
  - "squad-analyzer.js executado (se disponivel)"
  - "Self-audit quantitativo executado"
  - "Audit report categorizado: criticos / serios / menores"
  - "Auto-fixes aplicados onde possivel"
  - "Lista de fixes manuais apresentada"
execution_type: "interactive"
---

# Task: Fix Squad — Diagnostico e Cura de Squad Existente

**Task ID:** squad-forge/fix-squad
**Version:** 1.0.0
**Status:** Production Ready
**Created:** 2026-05-05
**Category:** Maintenance
**Execution Type:** Interactive

---

## Executive Summary

Modo `*fix {squad-name}` do forge-chief. Diagnostica problemas em squad existente (estrutura, profundidade, consistencia) e tenta corrigir automaticamente o que da pra automatizar. O que nao da, lista pro usuario com fix sugerido.

E exatamente o que foi feito no diagnostico do proprio squad-forge em 05/05/2026 — agora virou capacidade operacional.

---

## Pipeline Visual

```
fix-squad
  |
  v
STEP 1: IDENTIFY SQUAD
  |
  v
STEP 2: AUDIT — STRUCTURAL
  squad-validator.js + squad-analyzer.js
  |
  v
STEP 3: AUDIT — DEPTH
  Self-audit quantitativo (>=250 linhas/agente, etc)
  |
  v
STEP 4: AUDIT — CONSISTENCY
  Promessas vs implementacao (greeting, comandos, paths, etc)
  |
  v
STEP 5: GENERATE AUDIT REPORT
  Categorias: criticos / serios / menores
  |
  v
STEP 6: AUTO-FIX (optional)
  Aplicar fixes automatizaveis
  |
  v
STEP 7: PRESENT MANUAL FIXES
  Lista do que precisa intervencao humana
```

---

## Step-by-Step Execution

### Step 1: Identify Squad

Listar squads instalados, validar nome.

### Step 2: Structural Audit

```bash
# squad-validator.js
node .auroq-core/development/scripts/squad/squad-validator.js squads/{squad-name}/ > /tmp/validator-output.txt

# squad-analyzer.js (se disponivel)
node .auroq-core/development/scripts/squad/squad-analyzer.js squads/{squad-name}/ > /tmp/analyzer-output.txt 2>/dev/null
```

Capturar:
- Errors estruturais (squad.yaml invalido, task sem 8 campos, etc)
- Warnings nao-bloqueantes
- Coverage metrics

### Step 3: Depth Audit

Rodar checks quantitativos de profundidade (mesmo Step 8 do assemble-squad):

```bash
# Por agente
for agent in squads/{squad-name}/agents/*.md; do
  lines=$(wc -l < "$agent")
  examples=$(grep -c "^### Exemplo" "$agent")
  triggers=$(grep -A100 "IMMUNE SYSTEM" "$agent" 2>/dev/null | grep -c "^|" )
  frases=$(grep -A20 "Frases-Chave" "$agent" 2>/dev/null | grep -c '^- "')

  echo "$agent: linhas=$lines examples=$examples triggers=$triggers frases=$frases"
done

# KB
kb_total=$(wc -l squads/{squad-name}/data/*.md 2>/dev/null | tail -1 | awk '{print $1}')
echo "KB total lines: $kb_total"
```

### Step 4: Consistency Audit

Checks de consistencia interna:

| Check | Como verificar | Severidade se falha |
|-------|----------------|--------------------|
| **REGRA AUTOCONTIDO** — sem refs externas runtime | grep por paths proibidos (`docs/knowledge/`, `squads/etlmaker/kbs/`, `business/`, `/Users/`, `~/euriler-brain/`) em arquivos runtime | **CRITICO** (bloqueia distribuicao pra aluno) |
| Comandos do chief batem com greeting | Comparar `start.md` Step 3 com `agents/{chief}.md` COMMANDS | Serio |
| Paths internos existem | Cada `{path}` interno mencionado em config existe no FS | Serio |
| Schema path correto | `.auroq-core/schemas/squad-schema.json` (nao `development/schemas/`) | Serio |
| `data/` vs `knowledge/` | Squad usa `data/` (padrao Auroq) | Menor |
| Squad faz o que README promete | Comparar README features com tasks reais | Serio |
| Stories existem (Article III) | `docs/stories/squad-forge/{slug}/` ou `docs/stories/{name}/` | Serio |
| PRD existe (Article III) | `docs/prd/squad-{name}.md` | Serio |
| Tracker existe (Project Tracker Protocol) | `business/campanhas/{name}/tracker.md` | Menor |

**Verificacao AUTOCONTIDO em detalhe (script):**

```bash
SQUAD_PATH="squads/{squad-name}/"

# Patterns proibidos (de quality-thresholds.yaml > autocontido.forbidden_runtime_paths)
forbidden=(
  "docs/knowledge/euriler-business"
  "docs/knowledge/euriler-mind"
  "squads/etlmaker/kbs"
  "business/campanhas"
  "business/financeiro"
  "~/euriler-brain"
  "/Users/euriler/"
)

violations=0
for pattern in "${forbidden[@]}"; do
  hits=$(grep -rn "$pattern" "$SQUAD_PATH" --include="*.md" --include="*.yaml" \
    | grep -v "<!--.*-->" | grep -v "build-time")
  if [ -n "$hits" ]; then
    echo "CRITICO: ref externa '$pattern' em runtime:"
    echo "$hits"
    ((violations++))
  fi
done

if [ "$violations" -gt 0 ]; then
  echo "Squad NAO e autocontido. Bloqueante."
fi
```

**Frases proibidas (verificar tambem):**
- "ver KB completa em ..."
- "consultar arquivo em docs/..."
- "ver volume em squads/etlmaker..."
- "fonte original em business/..."

### Step 5: Generate Audit Report

Salvar em `squads/{name}/_audit/{ISO}-audit-report.md`:

```markdown
# Audit Report — Squad {Name}

**Auditado:** {ISO}
**Auditor:** @forge-smith via *fix
**Squad version:** {version}

---

## Summary

- Criticos: {N} (bloqueiam funcionamento)
- Serios: {N} (degradam qualidade)
- Menores: {N} (cosmeticos)
- Auto-fix aplicaveis: {N}
- Manual fix necessarios: {N}

---

## Criticos

### CRIT-1: {nome do problema}

**Detectado em:** {arquivo:linha}
**O que e:** {descricao}
**Impacto:** {por que e critico}
**Origem:** {validator|analyzer|depth|consistency}
**Auto-fixable:** {Yes|No}
**Fix sugerido:** {como corrigir}

### CRIT-2: ...

---

## Serios

(mesmo formato)

---

## Menores

(mesmo formato)

---

## Metricas Quantitativas

### Por Agente

| Agente | Linhas | Output Examples | Immune Triggers | Frases-Chave | Verdict |
|--------|--------|----------------|------------------|--------------|---------|
| {agent-1} | 287 | 3 | 4 | 6 | PASS |
| {agent-2} | 142 | 0 | 0 | 0 | FAIL (3 issues) |

### KB

- Total linhas: {N}
- Tabelas referencia: {N}
- Decision trees: {N}
- Regras Cardinais: {N}
- Verdict: {PASS|FAIL}

---

## Recommended Action

{Resumo do que fazer: pode rodar auto-fix? quais manuais sao prioridade? sugerir *rebuild se inviavel?}
```

### Step 6: Auto-Fix (com confirmacao)

Apresentar fixes automatizaveis pro usuario:

```yaml
elicit: true
prompt: |
  Encontrei {N} fixes automatizaveis:

  1. {Fix 1: descricao curta}
  2. {Fix 2}
  3. {Fix N}

  Aplico todos? Ou um por um?
type: "choice"
options: ["Todos", "Um por um", "Nenhum (so manual)"]
```

**Tipos de auto-fix:**
- Path errado em referencia (typo)
- Comando ausente em chief que existe em greeting
- Frontmatter de task com campo faltando
- README desatualizado vs realidade
- Stories ausentes (gerar a partir do squad existente — reverse engineering)
- Tracker ausente (criar a partir do squad)

**NAO sao auto-fix:**
- **Refs externas (REGRA AUTOCONTIDO violada)** — precisa LER fonte externa, processar, sintetizar e internalizar como conteudo novo. Trabalho de criatividade, nao mecanico. Sugerir `*rebuild` ou edicao guiada.
- Profundidade insuficiente de agente (precisa criatividade — humano + smith juntos)
- KB incompleta (precisa decisoes de design)
- Mudanca de arquitetura

**Caso especial REGRA AUTOCONTIDO:** se squad tem refs externas, fix-squad deve apresentar:

```
CRITICO: Squad tem {N} refs externas. NAO PODE ser distribuido pra alunos como esta.

Refs detectadas:
- {arquivo}:{linha} → {path externo}
- ...

Opcoes:
1. *rebuild — reconstruir squad com hard gate AUTOCONTIDO ativo (recomendado se sao muitas refs)
2. Edicao guiada — eu te mostro arquivo por arquivo, voce decide se internaliza ou remove
3. Exportar refs externas pra arquivos de KB internos (build-time process — preciso ler as fontes externas e processar)

Qual?
```

### Step 7: Present Manual Fixes

Lista pro usuario decidir:

```
Fixes que precisam intervencao humana:

CRIT-X: {problema}
  → Sugestao: rodar `*update {squad-name}` e expandir agente {name}
  → Tempo estimado: {N min}

CRIT-Y: {problema}
  → Sugestao: rodar `*rebuild {squad-name}` (mudanca grande)
  → Tempo estimado: {N min}

SERIO-Z: {problema}
  → Sugestao: editar manualmente {arquivo}
  → Tempo estimado: {N min}

Total: ~{soma} min de trabalho manual.
```

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `squads/{name}/_audit/{ISO}-audit-report.md` | Relatorio completo |
| `squads/{name}/{arquivos auto-fixed}` | Edicoes automaticas |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Squad nao existe | Listar disponiveis |
| validator/analyzer ausentes | Usar checklist nuclear como fallback |
| Auto-fix falha | Reverter, marcar como manual fix |
| Tantos issues que reformar e melhor | Sugerir `*rebuild` |

---

**Task Status:** Ready for Production
