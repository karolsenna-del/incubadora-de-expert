---
task: "Definir Avatar"
responsavel: "@diretor-persona"
responsavel_type: "interactive"
atomic_layer: "task"
Entrada: "Conceito validado que inclui formato UGC"
Saida: "Avatar definido — selecionado da biblioteca ou encaminhado pra criação"
Checklist:
  - "Usuário consultado: reutilizar biblioteca vs criar novo"
  - "Se reutilizar: avatares selecionados alinhados ao roteiro e público"
  - "Se criar: encaminhado pra task criar-persona"
execution_type: "interactive"
---

# Task: Definir Avatar

## Executive Summary

Task condicional — só roda quando o conceito inclui formato UGC. O diretor-persona decide, junto com o usuário, se a produção usa avatares de uma biblioteca existente ou personas novas.

## Steps

### Step 1: Perguntar ao usuário

Decision point (PU-has-018). Apresentar as duas opções:

- **Reutilizar biblioteca** — mais rápido, zero crédito de geração de imagem
- **Criar novos** — persona sob medida pro público da campanha

### Step 2a: Se reutilizar

Listar os avatares custom disponíveis (`higgsfield marketing-studio avatars list`). Selecionar os que combinam com o roteiro e o público-alvo. Seguir pra `produzir-pecas`.

### Step 2b: Se criar novos

Coletar a descrição do público-alvo (faixa etária, gênero, perfil) e encaminhar pra task `criar-persona`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Biblioteca vazia | Explicar que será criação do zero e ir direto pra criar-persona |
| Usuário não sabe descrever o público | Oferecer perguntas de apoio (idade, gênero, formação) |
| Avatar da biblioteca destoa do público | Apontar o desalinhamento e sugerir criar novo |
