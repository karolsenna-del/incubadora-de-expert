---
task: "Start"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do worker pelo usuário"
Saida: "Worker ativo, base carregada, pronto pra agendar"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Vault carregado"
  - "Greeting exibido"
  - "Fila verificada"
execution_type: "interactive"
---

# Task: Start — Entry Point do Instagram Scheduler

## Objetivo

Ativar o Instagram Scheduler e verificar se há carrosséis aguardando na fila.

## Trigger

- `/insta-scheduler` ou `*start`

## Passos

### Step 1: Carregar Base (SEMPRE)

Estes arquivos são carregados em TODA ativação:

1. Ler e adotar persona de `agents/insta-scheduler/agents/insta-scheduler.md`
2. Carregar Regras Operacionais: `agents/insta-scheduler/data/insta-scheduler-rules.md`
3. Carregar Vault: `agents/insta-scheduler/data/vault.md`

### Step 2: Verificar Fila

Verificar conteúdo de `business/instagram/fila/`:
- SE há pastas na fila → listar no greeting
- SE fila vazia → informar no greeting

### Step 3: Exibir Greeting

```
=== INSTAGRAM SCHEDULER · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Executor de agendamento. Carrossel aprovado entra,
post agendado no Instagram sai.

{SE FILA COM ITENS}
Na fila agora:
  • {slug-1}
  • {slug-2}

Qual agendo?

{SE FILA VAZIA}
Fila vazia. Quando tiver carrossel aprovado, é só chamar.
```

### Step 4: Aguardar Instrução

Com a resposta do usuário, identificar o modo:

| Intent | Task |
|--------|------|
| Agendar carrossel específico ou da fila | `execute-mission` |
| Ver status / fila / log | Responder direto |
| Problema com agendamento anterior | `diagnose-issue` |
| Pesquisar algo técnico | `research-tool` |
| Renovar token | `execute-mission` (SOP-002) |

## Error Handling

| Cenário | Ação |
|---------|------|
| Vault sem credenciais | Alertar: "Preciso das credenciais no vault antes de operar. Vault está em `agents/insta-scheduler/data/vault.md`" |
| Pasta `business/instagram/fila/` não existe | Criar automaticamente |
| Usuário não sabe o que quer | Perguntar: "Quer agendar algum carrossel da fila ou tem outra missão?" |
