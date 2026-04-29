---
task: "Start"
responsavel: "@etl-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario via /etlmaker"
Saida: "Pipeline inicializado, modo selecionado, estrutura criada, PLANO-ETL.md criado, handoff para ingestao"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Modo de operacao selecionado"
  - "Nome e escopo da KB coletados"
  - "Diretorio kbs/{slug}/ criado com subdiretorios"
  - "PLANO-ETL.md criado com template"
  - ".state.json inicializado"
execution_type: "interactive"
---

# Task: Start — Entry Point do ETLmaker v3.0

**Task ID:** etlmaker/start
**Version:** 3.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Updated:** 2026-03-08
**Category:** Entry Point
**Execution Type:** Interactive

---

## Executive Summary

Entry point unico do ETLmaker. Ativa o Chief, exibe greeting breve, coleta o escopo da KB a criar, seleciona o modo de operacao, cria estrutura de diretorios, cria PLANO-ETL.md como artefato persistente, e inicia a ingestao.

---

## Pipeline Visual

```
/etlmaker
  |
  v
STEP 1: ACTIVATE CHIEF
  Carrega etl-chief agent
  |
  v
STEP 2: DISPLAY GREETING
  Greeting breve + convite
  |
  v
STEP 3: SELECT MODE
  Full Pipeline | Quick Extract | Merge
  |
  v
STEP 4: COLLECT SCOPE
  Nome da KB, dominio, fontes disponiveis
  |
  v
STEP 5: CREATE STRUCTURE
  Diretorio kbs/{slug}/ + PLANO-ETL.md + .state.json
  |
  v
STEP 6: HANDOFF TO INGESTION
  -> ingest-sources task
```

---

## Step-by-Step Execution

### Step 1: Activate Chief

Carregar o agente `etl-chief`.

### Step 2: Display Greeting

```
=== ETLmaker ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Conhecimento disperso e conhecimento perdido.
Eu pego cursos, livros, transcricoes, conversas — qualquer fonte —
e transformo em documentacao mais rica e organizada que o original.

Modos de operacao:

1. Full Pipeline — KB do zero (mapeamento territorial + volumes ricos + validacao)
2. Quick Extract — mapeamento territorial rapido
3. Merge — adicionar fonte nova a KB existente

O que voce quer organizar?
```

**Regras do Greeting:**
- NAO listar todos os agentes
- NAO listar todos os comandos
- NAO explicar o pipeline tecnico
- Ir direto ao ponto

### Step 3: Select Mode

```yaml
elicit: true
prompt: |
  Qual modo de operacao?
  1. Full Pipeline — Criar KB do zero a partir de fontes (mapeamento territorial + volumes ricos + validacao em camadas)
  2. Quick Extract — So mapear territorialmente (sem compor volumes)
  3. Merge — Adicionar nova fonte a KB existente
type: "numbered_choice"
default: 1
```

**Se usuario descrever o que quer sem escolher modo:**
- "Quero organizar uns cursos de trafego" → Full Pipeline
- "Pega esse PDF e me diz o que tem" → Quick Extract
- "Adiciona essa transcricao na KB de copy" → Merge
- PODE inferir do contexto, mas SEMPRE confirmar antes de prosseguir

### Step 4: Collect Scope

```yaml
elicit: true
prompt: |
  Me diz:
  1. Nome da KB (ex: "Minha Metodologia", "Copy Avancada", "Trafego Pago")
  2. Quais fontes voce tem? (caminhos de arquivos, ou cola o conteudo)
type: "free_text"
```

Com a resposta, gerar:
- `kb_name`: nome informado pelo usuario
- `kb_slug`: versao kebab-case do nome
- `kb_domain`: dominio do conhecimento
- `sources`: lista de fontes a processar

### Step 5: Create Structure

Criar diretorios:

```
agents/etlmaker/kbs/{slug}/
  00-pipeline/
    sources/
```

Criar `PLANO-ETL.md` com template:

```markdown
# ETL Plan — {Nome da KB}

## Contexto
- **Fonte:** {descricao}
- **Autor(es):** {quem}
- **Tipo:** {curso | livro | transcricoes | compilado | misto}
- **Localizacao:** {path}

## Status
- [x] Fase 0: Setup
- [ ] Fase 1: Mapeamento Territorial
- [ ] Fase 2: Composicao Blocada (0/N volumes)
- [ ] Fase 3: Integracao
- [ ] Fase 4: Validacao Final

## Decisoes Chave
{preenchido durante o processo}

## Regras de Operacao
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invencao
- ZERO perda de conhecimento
```

Inicializar `.state.json` do pipeline:

```json
{
  "kb_slug": "{slug}",
  "kb_name": "{nome}",
  "mode": "{modo}",
  "version": "3.0.0",
  "current_phase": 0,
  "phase_status": {
    "phase_0": "completed",
    "phase_1": "pending",
    "phase_2": "pending",
    "phase_3": "pending",
    "phase_4": "pending"
  },
  "sources": [],
  "volumes_composed": 0,
  "validation_score": 0,
  "quality_gates_passed": [],
  "started_at": "{timestamp}"
}
```

### Step 6: Handoff to Ingestion

```
Estrutura criada pra "{kb_name}".

{Se modo Full Pipeline ou Quick Extract:}
Vou comecar pela ingestao das fontes. Me passa os arquivos ou cola o conteudo.

{Se modo Merge:}
Qual fonte nova voce quer adicionar? Me passa o arquivo ou cola o conteudo.
```

Executar handoff para @extractor via ingest-sources task.

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Usuario nao sabe qual conhecimento organizar | Ajudar: "Qual assunto voce quer dominar profundamente?" |
| Fonte muito pequena (< 500 palavras) | Avisar: "Fonte curta — pode gerar pouco conteudo. Tem mais material?" |
| Muitas fontes (>20) | Processar em batches: "Vou processar 10 por vez." |
| Modo Merge sem KB existente | Redirecionar pra Full Pipeline |

---

**Task Status:** Ready for Production
