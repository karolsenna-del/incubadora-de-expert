---
task: "Start"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativacao do worker pelo usuario"
Saida: "Worker ativo, KBs carregadas, pronto pra receber missao"
Checklist:
  - "Persona carregada"
  - "Foundation KB carregada"
  - "Playbook carregado"
  - "Mission Log carregado"
  - "Credentials Vault carregado"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do LP Dash Engineer

## Objetivo

Ativar o LP Dash Engineer e preparar pra receber missoes.

## Trigger

- `/lpDashEngineer` ou `*start`

## Passos

### Step 1: Carregar Persona e KBs

1. Ler e adotar persona de `agents/lp-dash-engineer/agents/lp-dash-engineer.md`
2. Carregar Foundation KB: `agents/lp-dash-engineer/data/lp-dash-engineer-kb.md`
3. Carregar Playbook: `agents/lp-dash-engineer/data/lp-dash-engineer-playbook.md`
4. Carregar Mission Log: `agents/lp-dash-engineer/data/lp-dash-engineer-missions.md`
5. Carregar Credentials Vault: `agents/lp-dash-engineer/data/lp-dash-engineer-vault.md`

### Step 2: Verificar Pre-requisitos

Verificar silenciosamente se o banco Supabase ja esta configurado:

1. Checar se existe vault do Database Engineer: `agents/database-engineer/data/database-engineer-vault.md`
2. Se tem credenciais no vault: guardar pra usar no setup
3. Se NAO tem: anotar que vai precisar coletar credenciais

### Step 3: Exibir Greeting

```
=== LP DASH ENGINEER ===
Worker Arcane | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Dashboard de metricas em tempo real pro seu lancamento. Receita, vendas,
ROI, leads, criativos — tudo numa URL que voce acompanha pelo celular.

O que posso fazer:

1. Instalar dashboard — setup completo + deploy Vercel
2. Conectar Meta Ads — metricas automaticas
3. Manutencao — ajustes, widgets, correcoes
4. Diagnosticar — problemas de integracao ou display

Pre-requisito: banco Supabase configurado (/databaseEngineer).

O que precisa?
```

Se o vault do Database Engineer tem credenciais, adicionar:
```
Encontrei as credenciais do Supabase ja salvas do Database Engineer. Vou usar essas.
```

**Regras do Greeting:**
- NAO listar comandos
- NAO explicar o que faz em detalhe
- Ir direto ao ponto — o que o aluno precisa
- Se o Vault ja tem credenciais, avisar que vai usar

### Step 4: Aguardar Input

Com a resposta do usuario, identificar o proximo passo:
- Se quer setup → iniciar `execute-mission`
- Se quer Meta Ads → iniciar `integrate-meta`
- Se quer manutencao → modo manutencao
- Se quer diagnostico → `diagnose-issue`

## Error Handling

| Cenario | Acao |
|---------|------|
| KB nao encontrada | Avisar: "KB nao encontrada. Vou operar com conhecimento base." |
| Vault com credenciais existentes | Usar automaticamente, informar ao usuario |
| Banco nao configurado | Instruir: "Rode /databaseEngineer primeiro pra configurar o banco." |
| Missao vaga | Pedir clarificacao: "Quer instalar o dashboard do zero, conectar com Meta, ou diagnosticar algo?" |
