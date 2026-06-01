---
task: "Setup Perfil"
responsavel: "@heygen-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Primeira ativação do squad, ou perfil desatualizado"
Saida: "data/perfil-usuario.md preenchido com avatar look_ids e voice_id"
Checklist:
  - "MCP HeyGen confirmado autenticado"
  - "Avatares listados via list_avatar_groups + list_avatar_looks"
  - "Vozes listadas via list_voices"
  - "data/perfil-usuario.md atualizado"
quality_gate: "QG-HGN-01"
execution_type: "interactive"
---

# Task: Setup Perfil — Registro de Avatar e Voz

## Executive Summary

Registra os IDs do usuário no HeyGen — avatar look_ids e voice_id — em `data/perfil-usuario.md`. Sem isso, o operador não tem o que passar pro MCP. Roda na primeira vez ou quando o usuário treina um avatar novo.

## Steps

### Step 1: Confirmar MCP autenticado

Rodar `mcp__heygen__get_current_user`. Confirmar que retorna a conta certa e que o plano suporta Avatar V (precisa de credits premium — plano pago). Se for free, avisar o usuário: Avatar V não roda no free.

### Step 2: Listar avatares

Rodar `mcp__heygen__list_avatar_groups` (ownership: private) e `mcp__heygen__list_avatar_looks` (ownership: private). Identificar os looks do tipo `digital_twin` — esses são os avatares treinados (Avatar V). Os `photo_avatar` são looks secundários. Confirmar `supported_api_engines` inclui `avatar_v`.

### Step 3: Listar vozes

Rodar `mcp__heygen__list_voices` (type: private). Identificar a voz clonada do usuário. Se houver várias, perguntar ao usuário qual é a dele de verdade.

### Step 4: Registrar em data/perfil-usuario.md

Escrever os IDs no arquivo: nome do avatar, look_id, tipo, orientação; voice_id da voz clonada. Esse arquivo vira a fonte de verdade pro diretor-look e o operador.

### Step 5: Confirmar com o usuário

Mostrar o que foi registrado e confirmar. A partir daqui, as próximas execuções pulam o setup.

## Error Handling

| Cenário | Ação |
|---------|------|
| MCP HeyGen não autenticado | Pedir que o usuário rode `/mcp` e autentique o HeyGen |
| Conta free / sem credits premium | Avisar: Avatar V exige plano pago; produção vai falhar no free |
| Nenhum avatar treinado na conta | Apontar `data/guia-treino-avatar-v.md`; parar — sem avatar não há produção |
| Múltiplas vozes "private" | Perguntar ao usuário qual é a voz clonada dele |
