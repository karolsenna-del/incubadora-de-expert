---
task: "Start"
responsavel: "@worker-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do squad pelo usuario via /workerForge"
Saida: "Chief ativo, greeting exibido, pronto pra Discovery"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Aguardando descricao do worker desejado"
execution_type: "interactive"
---

# Task: Start — Entry Point do Worker Forge

## Objetivo

Ativar o Worker Forge e iniciar o Discovery.

## Trigger

- `/workerForge` ou `*start`

## Passos

### Step 1: Carregar Persona

Ler e adotar persona de `agents/worker-forge/agents/worker-chief.md`.
Carregar KB: `agents/worker-forge/data/worker-forge-kb.md`.

### Step 2: Exibir Greeting

```
=== WORKER FORGE ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Consultores pensam. Processos seguem fluxo rigido.
Workers sao diferentes — recebem missoes, executam, documentam
e ficam melhores com o tempo. KB viva que cresce a cada entrega.

O que posso fazer:

1. Criar worker novo — papel, skills, KB e playbook do zero
2. Atualizar worker — ajustar KB, playbook, missoes ou estrutura
3. Consertar worker — diagnosticar e corrigir problemas

Me descreve como se fosse uma vaga de emprego.
```

**Regras do Greeting:**
- NAO listar agentes internos
- NAO listar comandos
- NAO explicar o pipeline
- Ir direto ao ponto

### Step 3: Handoff para Discovery

Com a resposta do usuario, iniciar task `discover-needs`.

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario nao sabe o que precisa | Ajudar: "Que atividade voce faz hoje que gostaria que alguem fizesse por voce?" |
| Parece consultor, nao worker | Sugerir Mind Forge: "Isso parece mais um consultor que um executor. Quer o Mind Forge?" |
| Multiplos workers de uma vez | Fazer 1 por vez: "Vamos comecar pelo mais urgente. Qual?" |
