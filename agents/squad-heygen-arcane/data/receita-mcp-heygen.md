# Receita Técnica — Produção via MCP HeyGen

> Receita validada em 21/05/2026 (2 vídeos produzidos com sucesso).
> Fonte de verdade técnica do operador-heygen-mcp.

## Visão geral do fluxo

```
áudio local → copiar pra path estável → upload catbox.moe → URL pública
→ create_video_from_avatar (engine avatar_v) → get_video (polling) → download
```

## 1. Preparar o áudio

Arquivos do Voice Memos do Mac ficam em diretório temporário (podem sumir). Copiar pra path estável com nome saneado (sem espaço, sem acento):

```bash
mkdir -p /tmp/heygen-audio
cp "/caminho/original/Audio.m4a" /tmp/heygen-audio/audio-1.m4a
```

Formatos aceitos: `.m4a`, `.wav`, `.mp3`. M4A do Voice Memos funciona direto.

## 2. Upload pra URL pública

O MCP do HeyGen **não tem ferramenta de upload de asset** exposta. `audioUrl` exige URL pública acessível — caminho local não funciona.

**Hosting principal — catbox.moe** (URL permanente, sem auth):
```bash
curl -sS -F "reqtype=fileupload" -F "fileToUpload=@/tmp/heygen-audio/audio-1.m4a" https://catbox.moe/user/api.php
# retorna: https://files.catbox.moe/xxxxxx.m4a
```

**Fallbacks** (se catbox cair):
- `0x0.st` — estava fora do ar em 05/2026, checar antes
- `file.io` — download único (HeyGen baixa 1x, funciona)
- Supabase Storage / bucket próprio — se quiser permanência controlada

## 3. Disparar a produção

Ferramenta: `mcp__heygen__create_video_from_avatar`

```
avatarId      = look_id do digital twin (de perfil-usuario.md)
audioUrl      = URL pública do áudio (bypassa TTS, usa voz real)
engine        = {"type": "avatar_v"}        ← EXPLÍCITO. Sem isso, default = Avatar IV
aspectRatio   = "9:16" (Reels/Shorts) | "16:9" (long-form horizontal)
resolution    = "1080p"
title         = descritivo, pra achar no dashboard
```

**Regras críticas:**
- `engine: {"type": "avatar_v"}` é obrigatório pra usar Avatar V. Omitir = Avatar IV.
- `audioUrl` e `script` são mutuamente exclusivos. Com `audioUrl`, não passar `voiceId` nem `script`.
- Áudio uploadado **bypassa o TTS** — usa a voz exata do arquivo.
- Avatar V é **audio-driven** — gesto vem da entonação. `motionPrompt` é Avatar IV only, rejeitado com avatar_v.
- Confirmar `supported_api_engines` do look inclui `avatar_v` antes de disparar.
- Vídeos independentes: disparar em paralelo (uma tool call por vídeo, na mesma mensagem).

Retorno: `{"video_id": "...", "status": "waiting"}`

## 4. Polling

Ferramenta: `mcp__heygen__get_video` (param: `videoId`)

Estados: `waiting` / `pending` / `processing` → ainda rodando; `completed` → pronto; `failed` → erro.

Avatar V de ~30-70s leva tipicamente **1-3 min**. Aguardar ~60-75s entre checagens — não fazer loop apertado.

Vídeo `completed` traz: `video_url`, `thumbnail_url`, `duration`, `video_page_url`.
Vídeo `failed` traz: `failure_code`, `failure_message` — **ler antes de redisparar**.

## 5. Download e entrega

```bash
cd ~/Downloads
curl -sSL "{video_url}" -o "heygen-{descricao}.mp4"
open ~/Downloads/heygen-{descricao}.mp4
```

`video_url` do HeyGen tem assinatura que **expira (~7 dias)** — baixar logo.

## Custo

- Avatar V consome **credits premium** (plano pago, Creator+).
- Produzir só o que foi aprovado. Não disparar lote no escuro.
- Conta free não roda Avatar V — a produção falha.

## Troubleshooting

| Sintoma | Causa provável | Correção |
|---------|----------------|----------|
| `failure_message: audio could not be downloaded` | URL do áudio inacessível/expirada | Re-subir o áudio, pegar URL nova, redisparar |
| Vídeo saiu como Avatar IV | `engine` omitido na chamada | Incluir `engine: {"type":"avatar_v"}` |
| Parâmetro rejeitado | Valor fora do enum | Conferir aspectRatio/resolution contra esta receita |
| Produção falha imediata | Conta sem credits premium | Confirmar plano pago via `get_current_user` |
| upload catbox falha | catbox fora do ar | Usar fallback de hosting |
