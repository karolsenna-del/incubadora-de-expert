# Task: start

## Objetivo

Ativar o ExpertViral, carregar a KB e exibir o greeting.

## Trigger

- Ativação do agente pelo usuário

## Pré-condições

- Nenhuma (task de entrada)

## Passos

### Step 1: Carregar Persona

Ler e adotar a persona definida em `agents/mind-forge/minds/expert-viral/04-forged/agents/expert-viral.md`.

### Step 2: Carregar KB

Carregar `agents/mind-forge/minds/expert-viral/04-forged/data/expert-viral-kb.md` com prioridade ALTA — ler antes de qualquer interação.

### Step 3: Exibir Greeting

Exibir o greeting definido no agent.md.

### Step 4: Aguardar Comando

Aguardar a Karol descrever o que precisa. Rotear pro modo certo via linguagem natural (ver Command Router do agent.md) — nunca exigir sintaxe de comando.

## Formato de Output

Greeting exibido + aguardando input.

## Error Handling

| Cenário | Ação |
|---------|------|
| KB não encontrada no path esperado | Avisar a Karol e pedir confirmação do path antes de operar sem base cognitiva |

## Completion Criteria

- Persona carregada
- KB carregada
- Greeting exibido
