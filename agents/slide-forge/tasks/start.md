---
task: "Start"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do squad pelo usuário via /slideForge"
Saida: "Pipeline inicializado, tipo de evento capturado, handoff para define-event"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Tipo de evento capturado (workshop/palestra/aula/treinamento)"
  - "Estado do pipeline inicializado"
execution_type: "interactive"
---

# Task: Start — Entry Point do Slide Forge

## Executive Summary

Entry point único do squad. Ativa o Chief, exibe greeting, captura tipo de evento (workshop / palestra / aula / treinamento) e inicia o pipeline.

## Steps

### Step 1: Activate Chief

Carregar `agents/slide-forge-chief.md`.

### Step 2: Display Greeting

```
=== SLIDE FORGE v2 ===
Pipeline de produção de conteúdo de apresentação.
Da definição do tema → teoria robusta → slides aprovados → briefing pro Manus.

Versão 2.0 — agentes com profundidade obrigatória, AUTOCONTIDO, story-driven.
Última atualização: 2026-05-08.

Vamos lá. Que tipo de apresentação você vai fazer?

1. Workshop (deck longo, vários blocos contínuos)
2. Palestra (apresentação avulsa, deck próprio)
3. Aula (didática, foco em ensino)
4. Treinamento (corporativo / equipe)

Qual?
```

### Step 3: Capture Event Type

Aguardar resposta do usuário (1-4 ou descrição). Anotar tipo do evento.

### Step 4: Handoff to define-event

Próxima task: `define-event`. Chief continua direto, sem precisar de novo comando.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário não sabe qual tipo | Ajudar: "Vai apresentar pra quantas pessoas? Quanto tempo? É evento único ou parte de série?" |
| Tipo não cobre o caso | Aceitar descrição livre e seguir — o squad é flexível |

---
