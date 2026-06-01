---
task: "Criar Persona"
responsavel: "@diretor-persona"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Descrição do público-alvo (da task definir-avatar)"
Saida: "Persona aprovada e registrada como avatar custom no Marketing Studio"
Checklist:
  - "Lote de opções de persona gerado e apresentado"
  - "Loop de regeneração rodado até a aprovação do usuário"
  - "Persona alinhada ao público-alvo"
  - "Avatar custom registrado no Marketing Studio"
execution_type: "interactive"
---

# Task: Criar Persona

## Executive Summary

Sub-loop de criação de persona. O diretor-persona gera opções de avatar, apresenta, ouve o feedback, regenera com ajuste e repete até o usuário aprovar — então registra como avatar custom reusável.

## Steps

### Step 1: Gerar lote de opções

Gerar um lote de personas via Higgsfield (Soul V2), variando tom de pele, cabelo, idade e vibe — todas miradas no público-alvo. Referência: `data/guia-producao.md`.

### Step 2: Apresentar e coletar feedback

Mostrar as opções ao usuário. Coletar o que funcionou e o que não funcionou.

### Step 3: Regenerar (loop)

Ajustar uma variável por vez conforme o feedback e regerar. Travar gola fechada quando o brief pede modéstia — o Soul sensualiza roupa sozinho (`data/troubleshooting.md`). Repetir Steps 2-3 até a aprovação.

### Step 4: Registrar avatar custom

Com a persona aprovada, fazer upload e registrar como avatar custom no Marketing Studio (`higgsfield marketing-studio avatars create`). A persona vira biblioteca reusável.

## Error Handling

| Cenário | Ação |
|---------|------|
| Soul sensualiza a roupa | Regerar travando gola alta/fechada |
| Persona sai com idade fora do pedido | Reforçar sinais de maturidade no prompt e regerar |
| Várias rodadas sem aprovação | Pedir feedback detalhado (rosto? roupa? vibe?) pra dirigir a próxima |
| Falha de rede na geração | Recuperar jobs pelo ID antes de regerar do zero |
