---
task: "Setup do Ambiente"
responsavel: "@iavideos-chief"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Primeira ativação do squad ou pedido explícito de setup"
Saida: "CLI Higgsfield instalado e autenticado, ambiente pronto pra produzir"
Checklist:
  - "CLI higgsfield instalado e no PATH"
  - "higgsfield account status retorna conta autenticada"
  - "Skills higgsfield-* disponíveis no ambiente"
execution_type: "interactive"
---

# Task: Setup do Ambiente

## Executive Summary

Garante que o ambiente Higgsfield está pronto antes de qualquer produção. Roda na primeira vez que o squad é usado. É um passo único — depois de feito, não precisa repetir. Sem CLI e autenticação, nada no pipeline funciona (dependência raiz).

## Steps

### Step 1: Verificar o CLI

Checar se `higgsfield` está no PATH:

```bash
higgsfield account status
```

- Se retornar a conta e os créditos → ambiente OK, pular pro fim.
- Se "command not found" → ir pro Step 2.
- Se "Session expired" / "Not authenticated" → ir pro Step 3.

### Step 2: Instalar o CLI

Pedir ao usuário que rode:

```bash
curl -fsSL https://raw.githubusercontent.com/higgsfield-ai/cli/main/install.sh | sh
```

Não é MCP — é um CLI. Não há reload de servidor nem necessidade de reiniciar a sessão.

### Step 3: Autenticar

Pedir ao usuário que rode (comando interativo, o próprio usuário executa):

```bash
higgsfield auth login
```

### Step 4: Confirmar

Rodar `higgsfield account status` novamente e confirmar que retorna conta + créditos. Avisar o usuário quantos créditos há disponíveis — produção é paga.

## Error Handling

| Cenário | Ação |
|---------|------|
| Instalação falha | Pedir ao usuário para rodar o comando manualmente e reportar o erro |
| Autenticação não persiste | Pedir novo `higgsfield auth login`; confirmar com `account status` |
| Conta sem créditos | Avisar o usuário antes de iniciar qualquer produção |
