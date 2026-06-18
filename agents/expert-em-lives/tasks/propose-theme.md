---
task: "propose-theme"
responsavel: "@expert-em-lives"
atomic_layer: "task"
entrada: "Pedido de sugestão de tema"
saida: "3 opções de tema com justificativa, aguardando escolha da Karol"
---

# Task: Propor Tema de Live

## Objetivo

Sugerir tema para a próxima live com base no histórico, método e momento atual.

## Passos

### Step 1: Checar histórico

1. Ler índice de `business/campanhas/lives-semanais/lives-expert360-roteiros.md`
   — quais temas já foram cobertos nas Lives 1-18?
2. Ler `business/campanhas/lives-semanais/live-19-outline.md`
   — qual foi o tema da Live 19?
3. Ler `agents/companion/data/contexto-dinamico.md`
   — qual é o foco atual? o que está acontecendo no negócio?

### Step 2: Mapear gaps e oportunidades

Perguntas para avaliar cada tema candidato:
- Já foi coberto? (verificar Lives 1-18)
- Conecta com a dor atual da Laura?
- Tem exercício concreto possível?
- Conecta com o método Expert360?
- Existe história da Karol disponível pra ancorar?

### Step 3: Apresentar 3 opções

Formato:
```
**Opção 1: [Título]**
Por que agora: [justificativa — dor da Laura, momento, progressão]
Exercício possível: [descrição rápida]
Âncora no método: [qual módulo/P do Expert360]

**Opção 2: [Título]**
...

**Opção 3: [Título]**
...

Qual você quer? Ou tem um tema em mente que eu monto?
```

### Step 4: Aguardar aprovação → executar `create-script.md`
