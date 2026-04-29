---
task: "Propose Worker"
responsavel: "@worker-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Discovery summary + KB rascunho do Knowledge Curator"
Saida: "Proposta completa do worker (Role Card + Context + Delegation + Scoreboard + KB summary + Tasks + Modos)"
Checklist:
  - "Role Card completa"
  - "Context Pack montado"
  - "Delegation Map com >=5 decisoes"
  - "Scoreboard definido"
  - "KB summary apresentado"
  - "4 modos padrao + modos especificos listados"
  - "Tasks previstas listadas"
execution_type: "semantic"
---

# Task: Propose Worker — Montar Proposta Completa

## Objetivo

Sintetizar o Discovery + Research numa proposta completa e coerente do worker. Essa proposta e o que vai pro Playback — o usuario precisa ver o worker inteiro antes de aprovar.

## Posicao no Workflow

Fase 2 do pipeline. Output alimenta o Playback (Fase 3).

## Passos

### Step 1: Acionar Role Designer

Handoff para @role-designer com:
- Discovery summary
- KB rascunho (pra calibrar nivel Dreyfus e competencias)

Role Designer produz:
- Role Card
- Context Pack
- Delegation Map
- Scoreboard

### Step 2: Definir Modos de Operacao

**4 modos padrao (todo worker):**
1. Missao — recebe e executa
2. Pesquisa — estuda ferramenta nova
3. Documentacao — cria/atualiza SOPs
4. Diagnostico — investiga problemas

**Modos especificos do dominio:**
Analisar duties do Role Card e identificar modos adicionais.
Ex: Gestor de Infra poderia ter "Integracao" como modo extra.

### Step 3: Definir Tasks Previstas

**5 tasks padrao:**
- start, execute-mission, research-tool, document-process, diagnose-issue

**Tasks especificas:**
1 task por duty/atividade que justifique protocolo proprio.

### Step 4: Consolidar Proposta

Montar documento unico:

```markdown
# PROPOSTA: {Worker Name}

## Role Card
{Completa}

## Context Pack
{Completo}

## Delegation Map
{Completo — tabela de decisoes}

## Scoreboard
{KPIs, DoD, Lead Measures}

## Modos de Operacao
{4 padrao + especificos, cada um com trigger e descricao}

## Tasks Previstas
{Lista com nome e descricao breve}

## KB Inicial
Dominios cobertos: {lista}
Ferramentas pesquisadas: {lista}
Tamanho: {N} linhas
Gaps: {lista}
SOPs existentes importados: {N}

## Strict Rules (draft)
NUNCA: {5+}
SEMPRE: {5+}
```

Salvar em `agents/worker-forge/output/{slug}/proposal.md`.

### Step 5: Handoff para Playback

Entregar proposta ao Chief para apresentacao ao usuario.

## Error Handling

| Cenario | Acao |
|---------|------|
| Discovery incompleto | Voltar pra Fase 0, perguntar o que falta |
| KB rascunho rasa demais | Pedir mais pesquisa ao Knowledge Curator |
| Duties se sobrepoem | Consolidar ou separar, confirmar com usuario no Playback |
