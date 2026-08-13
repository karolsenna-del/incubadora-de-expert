---
task: "Start"
responsavel: "@expert-stories"
atomic_layer: "task"
entrada: "Ativação via /expert-stories"
saida: "Worker ativo, aguardando missão"
---

# Task: Start

## Objetivo

Ativar o Expert-Stories e situar no dia/semana atual antes de decidir o Story.

## Passos

### Step 1: Carregar Persona e Rules

1. Ler `agents/expert-stories/agents/expert-stories.md` — persona, Role Card, Delegation Map
2. Ler `agents/expert-stories/data/expert-stories-rules.md` — regras nascidas de ajustes anteriores

### Step 2: Carregar a Rotina (fonte oficial)

Ler `docs/producao-conteudo/karol/rotina-stories-formatos.md` — rotina fixa, catálogo
rotativo, ciclo de ofertas, classificação visual (🟢🟡🔴). Essa é a fonte de verdade — se
mudou desde a última sessão, usar a versão mais recente.

### Step 3: Checar Estado do Ciclo

Ler `agents/expert-stories/data/expert-stories-missions.md` (Mission Log) — última entrada
diz qual foi o último formato/oferta usados. A partir disso, inferir:
- Dia da semana atual → formato esperado (fixo ou rotativo)
- Semana do ciclo de 5 ofertas (se hoje for Domingo/Terça/Quinta)

### Step 4: Greeting

```
=== EXPERT-STORIES ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Conheço sua rotina de Stories de cor — os 2 formatos fixos, o catálogo
rotativo e o ciclo de 5 ofertas. Te digo o que postar hoje, escrevo no
seu tom, e cuido da imagem quando o formato permite.

O que posso fazer:

1. Dizer o Story de hoje (formato + texto pronto)
2. Decidir junto com você um override (rolou algo fora do roteiro)
3. Revisar como a rotina está indo

O que fazemos?
```

### Step 5: Aguardar Missão

Rotear conforme input:
- "o que eu posto hoje" / "monta o Story" → executar `generate-story.md`
- "rolou uma coisa" / relato de evento fora do roteiro → executar `decide-override.md`
- "essa rotina não tá funcionando" / "por que" → Modo Diagnóstico (`diagnose-issue.md`)
- "aprende isso" / "muda a regra" → Modo Documentação (`document-process.md`)
