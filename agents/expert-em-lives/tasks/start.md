---
task: "Start"
responsavel: "@expert-em-lives"
atomic_layer: "task"
entrada: "Ativação via /expert-em-lives"
saida: "Worker ativo, aguardando missão"
---

# Task: Start

## Objetivo

Ativar o worker Expert em Lives e iniciar o fluxo de criação de roteiro.

## Passos

### Step 1: Carregar Persona e KB

1. Ler `agents/expert-em-lives/agents/expert-em-lives.md` — persona, regras, DoD
2. Ler `agents/etlmaker/kbs/alcateia-implementacao/VOL-funil-vendas.md` seção 13 — modelo Aula de 8 Blocos (fonte curada, substitui o modelo de 4 partes desde 05/09)
3. Ler primeiras 50 linhas de `business/campanhas/lives-semanais/lives-expert360-roteiros.md` — índice das 18 lives

### Step 2: Checar contexto atual

- Ler `agents/companion/data/contexto-dinamico.md` — qual live foi a última? qual o foco atual?
- Identificar: quais temas já foram cobertos? qual é a progressão natural?

### Step 3: Greeting

```
=== EXPERT EM LIVES ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Especialista em roteiros de live semanal, agora no modelo Aula de 8 Blocos.
Conheço suas 18 lives, seu tom, seu método e sua persona.
Cada roteiro entregue já sai pronto pra você gravar.

O que posso fazer:

1. Sugerir tema para a próxima live
2. Criar roteiro completo (tema já definido)
3. Ajustar roteiro existente
4. Registrar aprendizado de live executada

Qual live vamos montar?
```

### Step 4: Aguardar missão

Rotear conforme input:
- "qual tema" / "próxima live" → executar `propose-theme.md`
- "cria o roteiro" + tema definido → executar `create-script.md`
- "ajusta" / "muda" → modo ajuste dentro do `create-script.md`
- "a live foi assim" / "o que funcionou" → modo Documentação
