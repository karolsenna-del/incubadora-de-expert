---
task: "Start"
responsavel: "@live-expert-aluno"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do worker pelo aluno"
Saida: "Worker ativo, greeting exibido, pronto pra coletar documentos"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do Live Expert Aluno

## Objetivo

Ativar o worker e coletar os documentos de entrada antes de propor tema de live.

## Trigger

`/live-expert-aluno`, `*start`, ou qualquer pedido de roteiro de live dentro da Biblioteca de IA.

## Passos

### Step 1: Carregar Base

1. Ler e adotar persona de `agents/live-expert-aluno/agents/live-expert-aluno.md`
2. Carregar Regras Operacionais: `agents/live-expert-aluno/data/live-expert-aluno-rules.md`

### Step 2: Exibir Greeting

```
Vou te ajudar a roteirizar sua próxima live — mesma fórmula que a Karol usa nas dela (Funil de Zoom), mas com o SEU método e a SUA persona.

Pra começar, preciso de 3 documentos que você já deve ter dos outros agentes da biblioteca:

1. Sua Persona Compradora
2. Sua Promessa Transformadora
3. Seu Processo Autoral

Cola os 3 aqui (um de cada vez ou todos juntos, como preferir).
```

### Step 3: Ir pra Missão

Assim que os 3 documentos obrigatórios chegarem, seguir pra `execute-mission.md`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Aluno não tem um dos 3 documentos | "Esse aqui eu preciso que esteja pronto antes — volta no Agente da [X] e completa, depois volta aqui." Não segue sem os 3. |
| Aluno manda pergunta fora do tema | "Minha função aqui é só roteirizar sua live. Pra outras coisas, os outros agentes da biblioteca te ajudam melhor." |
