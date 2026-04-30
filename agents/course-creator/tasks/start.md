---
task: "Start"
responsavel: "@course-chief"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario"
Saida: "Curso definido (nome, objetivo, publico, transformacao), pronto pra Fase 1 (Benchmarking)"
Checklist:
  - "Nome do curso definido"
  - "Objetivo do curso claro"
  - "Publico-alvo identificado"
  - "Transformacao definida (ponto A -> ponto B)"
execution_type: "interactive"
---

# Task: Start — Entry Point do Squad

**Task ID:** course-creator/start
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-03-03
**Category:** Setup
**Execution Type:** Interactive

---

## Executive Summary

Entry point do squad Course Creator. O Chief ativa, exibe greeting, coleta informacoes essenciais do curso e valida QG-CC-001 antes de iniciar a Fase 1 (Benchmarking + PRD).

**Gate:** QG-CC-001 — Setup Completo

---

## Step-by-Step Execution

### Step 1: Ativar Persona

Ler e adotar a persona de `agents/course-chief.md`.

### Step 2: Carregar Contexto

Verificar se existe `.state.json` com sessao anterior:
- Se SIM: executar `*resume` — resumir onde parou e retomar
- Se NAO: sessao nova — seguir pro Step 3

### Step 3: Greeting

Exibir:

```
=== COURSE CREATOR ===
Squad Arcane | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

10 fases. Da ideia ao curso pronto pra vender. Benchmarking, metodologia,
estrutura, branding, packaging e checklist de producao. 4 agentes dedicados:
Chief, Creator, Brand Architect e Product Packager.

Pra comecar, preciso de 4 coisas:

1. Nome do curso (pode ser provisorio)
2. Objetivo — qual transformacao esse curso gera?
3. Publico-alvo — pra quem e?
4. Ponto A → Ponto B — de onde o aluno sai e onde chega?

Pode despejar tudo ou a gente constroi junto.
```

### Step 4: Coletar Informacoes

Registrar as 4 informacoes essenciais:
- **Nome:** pode ser provisorio, ajusta depois
- **Objetivo:** qual transformacao o curso gera
- **Publico:** pra quem e esse curso
- **Transformacao:** ponto A (onde o aluno esta) → ponto B (onde vai chegar)

Se o expert despejar tudo junto, organizar e confirmar.
Se faltar algo, perguntar especificamente.

### Step 5: Validar QG-CC-001

Checar:
- [ ] Nome definido (mesmo provisorio)
- [ ] Objetivo claro
- [ ] Publico identificado
- [ ] Transformacao definida

Se PASS: informar que setup ta completo e passar pro Creator (Fase 1 — Benchmarking).
Se FAIL: informar o que falta.

### Step 6: Handoff pro Creator (Fase 1)

Passar pro `@course-creator` com contexto:
- Todas as informacoes coletadas
- Instrucao: "Executar task `benchmark-market` — pesquisar mercado e gerar PRD"
- Carregar KBs: `data/course-creation-kb.md`

---

## Veto Conditions

- VETO se avancar pra Fase 1 sem os 4 campos coletados (QG-CC-001)
- VETO se `.state.json` existe e nao foi lido antes de comecar sessao nova

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert ja tem tudo na cabeca e despeja | Organizar, confirmar, seguir |
| Expert nao sabe o nome ainda | "Nome provisorio ta valido. A gente ajusta depois." |
| Expert quer pular direto pro conteudo | Coletar os 4 campos obrigatorios (QG-CC-001) antes de avancar — nome provisorio vale |

---

**Task Status:** Ready for Production
