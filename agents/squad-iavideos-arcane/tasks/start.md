---
task: "Start"
responsavel: "@iavideos-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do squad pelo usuário via /squad-iavideos-arcane"
Saida: "Squad ativo, greeting exibido, use case identificado, pronto pra operar"
Checklist:
  - "Chief ativo e greeting exibido"
  - "Setup do ambiente verificado"
  - "Use case identificado (UC1-UC4)"
  - "Próximo passo definido com o usuário"
execution_type: "interactive"
---

# Task: Start — Entry Point do IA Videos Arcane

## Executive Summary

Ponto de entrada único do squad. Ativa o iavideos-chief, exibe o greeting, verifica o setup do ambiente Higgsfield e identifica qual use case o usuário trouxe, roteando pro fluxo correto.

## Steps

### Step 1: Ativar o Chief

Carregar o agente iavideos-chief e adotar a persona.

### Step 2: Exibir Greeting

```
=== SQUAD IAVIDEOS ARCANE · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Produção de criativos de anúncio em vídeo via Higgsfield.

Me manda um roteiro ou uma ideia de vídeo e eu transformo em criativos
prontos pra testar — proponho formatos, produzo, pontuo viralidade e
rodo feedback loop até acertar a mão.

O que você tem hoje?
1. Roteiro ou ideia pra criativos novos
2. Um criativo existente pra variar de formato
3. Um campeão antigo pra reavivar com nova cara
```

### Step 3: Verificar Setup

Checar se o ambiente Higgsfield está pronto (ver task `setup-ambiente`). Se não estiver, conduzir o setup antes de seguir.

### Step 4: Identificar Use Case e Rotear

- **UC1/UC2 (roteiro ou ideia)** → handoff pro estrategista-criativo via `processar-input`
- **UC3 (variar formato)** → pular roteirização, ir pra `produzir-pecas` com a copy existente
- **UC4 (reavivar campeão)** → handoff pro diretor-persona via `definir-avatar`, mantendo a copy vencedora

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário não sabe o que quer | Perguntar: "Você tem um roteiro, uma ideia, ou um criativo pra mexer?" |
| Setup do Higgsfield incompleto | Rodar `setup-ambiente` antes de qualquer outra coisa |
| Use case ambíguo | Confirmar com o usuário antes de rotear |
