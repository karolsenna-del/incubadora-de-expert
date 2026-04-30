---
task: "Ingest Methodology"
responsavel: "@mentoring-creator"
execution_type: "interactive"
gate: "QG-MC-003"
---

# Task: Ingestao da Metodologia

## Purpose

Ler docs locais do expert com sua metodologia existente, mapear, entender a espinha dorsal e validar com o usuario.

## Steps

### Step 1: Coletar Fontes

Perguntar:
- "Onde esta sua metodologia documentada? Me aponta os arquivos."
- "Tem algum doc principal ou sao varios?"
- "Algum conteudo que nao esta escrito mas e importante eu saber?"

### Step 2: Ler e Mapear

Ler TODOS os docs indicados. Mapear:
- Fases/steps do metodo
- Conceitos-chave
- Frameworks proprietarios
- Sequencia logica
- Ferramentas/assessments mencionados
- Linguagem e termos do expert

### Step 3: Playback

Apresentar de volta pro usuario em formato narrativo:

```
=== SUA METODOLOGIA ===

Entendi que seu metodo tem {N} fases:

1. {Fase 1}: {o que faz, por que existe}
2. {Fase 2}: {o que faz, por que existe}
...

Conceitos-chave: {lista}
Frameworks: {lista}
Sequencia: {explicacao da logica}

Isso bate? O que ta errado? O que falta?
```

### Step 4: Debate e Ajuste

Loop ate usuario validar:
- Corrigir o que entendeu errado
- Adicionar o que falta
- Re-apresentar se correcoes forem significativas

### Step 5: Enriquecer PRD

Adicionar secao 5 (Metodologia) no PRD com:
- Nome da metodologia
- Fases/steps do metodo
- Como se aplica ao programa
- Docs fonte

## Quality Gate QG-MC-003

- Todos os docs lidos
- Metodologia mapeada (fases, conceitos, frameworks)
- PRD enriquecido com secao de metodologia
- **Usuario validou: "e isso mesmo"**
