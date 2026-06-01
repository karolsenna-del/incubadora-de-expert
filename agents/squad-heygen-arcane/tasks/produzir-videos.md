---
task: "Produzir Vídeos"
responsavel: "@operador-heygen-mcp"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Áudios gravados + mapeamento áudio ↔ script ↔ look"
Saida: "Vídeos disparados no HeyGen, video_ids registrados"
Checklist:
  - "Áudios copiados pra path estável"
  - "Áudios subidos pra URL pública (catbox.moe)"
  - "create_video_from_avatar disparado por vídeo, com engine avatar_v"
  - "video_ids registrados"
quality_gate: "QG-HGN-03"
execution_type: "automated"
---

# Task: Produzir Vídeos — Disparo via MCP

## Executive Summary

O operador sobe os áudios pra URL pública e dispara `create_video_from_avatar` no MCP do HeyGen, um por vídeo, com `engine: avatar_v`. Segue a receita técnica embarcada à risca — parâmetro errado custa credit.

## Steps

### Step 1: Copiar áudios pra path estável

Os arquivos do Voice Memos ficam em diretório temporário. Copiar pra `/tmp/heygen-audio/` com nomes saneados (sem espaços, sem acentos).

### Step 2: Subir pra URL pública

Subir cada áudio via `curl` pro `catbox.moe`:
```
curl -sS -F "reqtype=fileupload" -F "fileToUpload=@/caminho/audio.m4a" https://catbox.moe/user/api.php
```
Retorna a URL pública. Ver `data/receita-mcp-heygen.md` pra fallbacks de hosting.

### Step 3: Confirmar suporte avatar_v

Para cada look usado, confirmar que `supported_api_engines` inclui `avatar_v` (vem do perfil / `list_avatar_looks`).

### Step 4: Disparar a produção

Para cada vídeo, chamar `mcp__heygen__create_video_from_avatar`:
- `avatarId` — look_id do digital twin (do mapeamento)
- `audioUrl` — URL pública do áudio
- `engine` — `{"type": "avatar_v"}` **explícito**
- `aspectRatio` — `9:16` (Reels/Shorts) ou `16:9` (long-form horizontal)
- `resolution` — `1080p`
- `title` — descritivo

Vídeos independentes: disparar em paralelo. Registrar cada `video_id` retornado.

### Step 5: Handoff

Passar os `video_id`s pra task `polling-status`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Upload pro catbox falha | Tentar fallback de hosting (ver receita); se nada, pedir link público ao usuário |
| Parâmetro rejeitado pelo MCP | Conferir contra `data/receita-mcp-heygen.md`, ajustar, redisparar |
| Look não suporta avatar_v | Avisar; usar look que suporta ou cair pra Avatar IV com aviso |
| Conta sem credits premium | Avisar antes de disparar — Avatar V falha sem credit premium |
