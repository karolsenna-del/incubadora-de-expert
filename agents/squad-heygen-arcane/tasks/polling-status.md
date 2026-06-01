---
task: "Polling Status"
responsavel: "@operador-heygen-mcp"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "video_ids de vídeos disparados"
Saida: "Todos os vídeos com status completed (ou failed diagnosticado)"
Checklist:
  - "get_video chamado por video_id até completed/failed"
  - "Vídeos failed têm failure_message lido"
  - "video_url de cada vídeo completed capturado"
execution_type: "automated"
---

# Task: Polling Status — Acompanhamento da Produção

## Executive Summary

O operador acompanha cada vídeo via `get_video` até `status: completed`. Avatar V de ~30-70s leva tipicamente 1-3 min. Vídeo `failed` tem o `failure_message` lido antes de qualquer redisparo.

## Steps

### Step 1: Polling

Para cada `video_id`, chamar `mcp__heygen__get_video`. Estados possíveis:
- `waiting` / `pending` / `processing` — ainda rodando, checar de novo
- `completed` — pronto, capturar `video_url`, `duration`, `video_page_url`
- `failed` — ler `failure_code` e `failure_message`

Entre checagens, aguardar ~60-75s (Avatar V não é instantâneo). Não checar em loop apertado.

### Step 2: Tratar falhas

Para cada vídeo `failed`:
- Ler `failure_message`
- Diagnosticar a causa (URL de áudio inacessível, parâmetro inválido, etc)
- Corrigir a causa real antes de redisparar — não redisparar no escuro (credit é dinheiro)

### Step 3: Consolidar

Quando todos os vídeos estão `completed` (ou as falhas foram diagnosticadas), passar os `video_url`s pra task `entregar`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Vídeo travado em processing por muito tempo | Continuar polling; se passar muito do esperado, checar status no dashboard HeyGen |
| status failed | Ler failure_message, diagnosticar, corrigir causa, redisparar só o que falhou |
| video_url expira (links HeyGen têm validade) | Capturar e baixar logo; não deixar o link expirar antes do download |
