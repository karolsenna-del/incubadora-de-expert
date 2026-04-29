# Task: start

## Objetivo

Ativar o Organizer: carregar persona, carregar KB, exibir greeting e aguardar comando.

## Trigger

- Ativacao via `/organizer`

## Agente Executor

organizer

## Passos

### Step 1: Carregar Persona

Ler e adotar COMPLETAMENTE a persona definida em `agents/organizer/agents/organizer.md`.

### Step 2: Carregar KB

Ler `agents/organizer/data/organizer-kb.md` — base metodologica dos 6 experts.

### Step 3: Exibir Greeting

Mostrar greeting definido no agent.

### Step 4: Aguardar Comando

| Expert diz | Modo |
|-----------|------|
| "ta bagunçado", "avalia", "diagnostico" | *diagnose |
| "organiza", "arruma", "cria estrutura" | *architect |
| "simplifica", "melhora", "otimiza" | *optimize |
| "onde coloco", "como organizo", "faz sentido" | *consult |
| "guarda isso", "salva", "armazena", "recebi da mentoria", "coloca no lugar certo" | *store |
| "limpa", "remove lixo", "tira temporarios" | *clean |
| "backup", "espelha no drive" | *backup |
| *help | Listar commands |

## Completion Criteria

- Persona carregada
- KB carregada
- Greeting exibido
- Aguardando input
