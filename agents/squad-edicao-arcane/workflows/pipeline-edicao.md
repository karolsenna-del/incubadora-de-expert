---
workflow: "pipeline-edicao"
responsavel: "@chief (orquestra) + specialists"
Entrada: "Video bruto talking-head"
Saida: "{video}_final.mp4 — pronto pra Reels/TikTok/WhatsApp"
execution_type: "sequential_with_quality_gates"
estimated_time: "7-20 min (video de 1-5min, depende da maquina)"
---

# Workflow: Pipeline Edicao — esteira completa com handoffs

Workflow master do squad. Orquestra os 5 specialists em sequencia com quality gates entre cada handoff.

**Default speed:** 1.2x (validado como ritmo natural pra Reels talking-head).
**Default zoom:** ATIVO (respiracao visual nas viradas).
**Default trilha:** ATIVA (`data/trilhas/default.mp3` com ducking).

Tudo isso pode ser desligado por comando explicito do expert (ver "Opcoes").

**Convenção de comando (cross-platform, v1.1.0):** os scripts que usam torch/silero/cv2/pyyaml (`video-speech-cut.py`, `video-produce-zoom.py`, `video-captions.py`) rodam com o **Python do venv** — abaixo grafado `<venv-python>`:
- Windows: `{SQUAD_DIR}\.venv\Scripts\python.exe`
- Mac/Linux: `{SQUAD_DIR}/.venv/bin/python3`

Os que só usam ffmpeg (`video-speed-up.py`, `video-transcribe.py`, `video-add-music.py`) rodam com `python` puro.

## Visao geral

```
   ┌──────────┐
   │  CHIEF   │  recebe video bruto, valida path
   └────┬─────┘
        │ video.mp4
        ▼
   ┌──────────┐
   │INSTALLER │  doctor.py → ambiente OK?
   └────┬─────┘
        │ QG-SEA-001 PASS
        ▼
   ┌──────────┐
   │  CUTTER  │  speech-cut (Silero VAD agressivo)
   └────┬─────┘
        │ video_speechcut.mp4 + QG-SEA-002
        ▼
   ┌──────────┐
   │  SCRIBE  │  transcribe + revisar pt + speed-up 1.2x
   └────┬─────┘
        │ video_speed.mp4 + transcript_revisado.txt + QG-SEA-003
        ▼
   ┌──────────┐
   │  ZOOMER  │  Claude classifica sections → produce-zoom (--speed 1.2)
   └────┬─────┘
        │ video_zoomed.mp4 + QG-SEA-006   [pula se "*tirar-zoom"]
        ▼
   ┌──────────┐
   │ FINISHER │  legenda (--speed 1.2) → add-music (trilha default)
   └────┬─────┘
        │ video_final.mp4 + QG-SEA-004 + QG-SEA-005
        ▼
   ┌──────────┐
   │  CHIEF   │  entrega ao expert + report final
   └──────────┘
```

> **Nota de ordem critica:** o speed-up roda APOS o speech-cut e ANTES do zoom. O transcript do whisper tem timestamps do video PRE-speed — entao zoom e legenda usam flag `--speed 1.2` pra reescalar timestamps internamente. Sem essa flag, drift acumulado (1.2x = ~17% atraso).

## Steps

### Step 0 — Pre-flight (@chief)

- Valida que `video_path` existe
- Valida tamanho razoavel (>30s, <30min — alerta fora dos limites)
- Inicializa pasta de trabalho: `videos-editados/{video-basename}/`
- Handoff pra @installer

### Step 1 — Validar ambiente (@installer)

- Roda `tasks/diagnosticar.md` (doctor.py)
- **QG-SEA-001:** ambiente OK?
- PASS → handoff @cutter
- FAIL → roda `tasks/instalar.md` e re-valida

### Step 2 — Cortar por fala (@cutter)

```bash
<venv-python> {SQUAD_DIR}/scripts/video-speech-cut.py \
  <video_input> \
  videos-editados/<basename>/<basename>_speechcut.mp4
```

- Defaults agressivos aplicados (threshold=0.6, min_silence=80ms, pad=30ms)
- **QG-SEA-002:** reducao entre 30-70%, pix_fmt=yuv420p
- PASS → handoff @scribe
- Alerta (nao bloqueia) se reducao fora do sweet spot

### Step 3 — Transcrever + revisar + acelerar (@scribe)

#### 3a. Transcrever (automatico)

```bash
python {SQUAD_DIR}/scripts/video-transcribe.py \
  videos-editados/<basename>/<basename>_speechcut.mp4 \
  videos-editados/<basename>/<basename>_transcript_raw.txt
```

O `--prompt` ja vem com nomes proprios do `data/nomes-proprios.yaml` do expert.

#### 3b. Revisar (main thread — Opus pensa)

Le `<basename>_transcript_raw.txt`, aplica dicionario do expert, corrige acentuacao + nomes, salva `<basename>_transcript_revisado.txt`.

**Regras criticas da revisao:**
- NAO mexer em timestamps (mesmo que sejam pre-speed — o `--speed` reescalada downstream)
- NAO reconstruir frases engolidas
- Aplicar `data/nomes-proprios.yaml` integralmente
- Corrigir acentos comuns (`Negocio` → `Negócio`, `voce` → `você`, etc)

#### 3c. Acelerar 1.2x

```bash
python {SQUAD_DIR}/scripts/video-speed-up.py \
  videos-editados/<basename>/<basename>_speechcut.mp4 \
  1.2 \
  videos-editados/<basename>/<basename>_speed.mp4
```

- **QG-SEA-003:** revisado existe + dicionario aplicado + numero de linhas preservado + `_speed.mp4` valido
- PASS → handoff @zoomer

### Step 4 — Zoom dinamico (@zoomer)

#### 4a. Classificar sections (main thread — Opus)

Claude le `<basename>_transcript_revisado.txt` e classifica cada trecho em `normal` / `emphasis` / `critical` baseado em conteudo retorico. Salva `<basename>_sections.json`.

**Regras:** ver `agents/zoomer.md` (heuristicas de classificacao retorica).

#### 4b. Aplicar zoom

```bash
<venv-python> {SQUAD_DIR}/scripts/video-produce-zoom.py \
  videos-editados/<basename>/<basename>_speed.mp4 \
  videos-editados/<basename>/<basename>_sections.json \
  videos-editados/<basename>/<basename>_zoomed.mp4 \
  --speed 1.2
```

> Flag `--speed 1.2` reescalada os timestamps das sections pra bater com o video acelerado.

- **QG-SEA-006:** rosto detectado em ≥5/10 frames + distribuicao plausivel + pix_fmt=yuv420p + profile=Main
- PASS → handoff @finisher

**Se expert disse `*tirar-zoom`:** pula esse step. @finisher recebe `_speed.mp4` direto (renomeia logicamente como `_zoomed.mp4` no fluxo).

### Step 5 — Legenda + trilha (@finisher)

#### 5a. Queimar legenda

```bash
<venv-python> {SQUAD_DIR}/scripts/video-captions.py \
  videos-editados/<basename>/<basename>_zoomed.mp4 \
  videos-editados/<basename>/<basename>_transcript_revisado.txt \
  videos-editados/<basename>/<basename>_captioned.mp4 \
  --speed 1.2
```

> Flag `--speed 1.2` reescalada timestamps do transcript (pre-speed) pra bater com video pos-speed. SEM essa flag, legenda dessincroniza ~17%.

- **QG-SEA-004:** output abre (pix_fmt=yuv420p, profile=Main, faststart, decode OK)
- **QG-SEA-005:** legenda renderiza (fonte Bebas Neue resolveu, acentos OK, palavras inteiras)

#### 5b. Adicionar trilha de fundo

```bash
python {SQUAD_DIR}/scripts/video-add-music.py \
  videos-editados/<basename>/<basename>_captioned.mp4 \
  "" \
  videos-editados/<basename>/<basename>_final.mp4
```

> 2º arg vazio → usa `data/trilhas/default.mp3`. Pra custom: passa path da trilha.
> Volume default 0.18 com ducking balanceado (threshold=0.1, ratio=4, release=150ms) — voz manda, trilha respira nas pausas. Validado em talking-head 32s.

**Se expert disse `*sem-trilha`:** pula 5b. Renomeia `_captioned.mp4` → `_final.mp4`.

Validacao:
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt,profile -of csv=p=0 <final>
# esperado: yuv420p,Main
ffmpeg -v error -i <final> -f null - 2>&1
# esperado: vazio
```

Extrair 3-5 frames de amostra (`ffmpeg -ss <t> -i <final> -frames:v 1`) e revisar visualmente.

- PASS → handoff @chief (entrega final)

### Step 6 — Entrega (@chief)

Report final pro expert:

```
✅ Video pronto: videos-editados/<basename>/<basename>_final.mp4

- Original: <X>s
- Cortado: <Y>s (<P>% removido por fala, <N> jumpcuts)
- Acelerado 1.2x: <Z>s final
- Zoom: <N> sections (<a> normal / <b> emphasis / <c> critical)
- Legendas: <K> queimadas (estilo <nome>)
- Trilha: <nome.mp3> com ducking
- Encoding: 1080x1920 h264 Main yuv420p, AAC 192k, faststart
- Abre em: QuickTime/Windows Media Player, Safari/Chrome/Edge, Reels
```

Abrir o resultado pro expert conferir — `open <final>` (Mac) / `start "" <final>` (Windows) / `Invoke-Item <final>` (PowerShell).

## Opcoes do expert (overrides do default)

| Comando | Efeito |
|---|---|
| `*tirar-zoom` | Pula Step 4 (sem zoom) |
| `*sem-trilha` | Pula Step 5b (sem musica) |
| `*outra-trilha <path.mp3>` | Step 5b usa essa trilha em vez da default |
| `*speed <fator>` | Step 3c usa `<fator>` em vez de 1.2 (ex: `*speed 1.0` mantem velocidade original) |
| `*niveis <n,e,c>` | Step 4 usa esses zoom levels (ex: `1.0,1.15,1.35`) |

## Cleanup (opcional)

Apos expert aprovar:
- Mantem: video original (raw) + `<basename>_final.mp4` + `<basename>_transcript_revisado.txt` + `<basename>_sections.json`
- Remove: `_speechcut.mp4`, `_speed.mp4`, `_zoomed.mp4`, `_captioned.mp4`, `_transcript_raw.txt` (os temporários de `.wav`/filtergraph já são limpos pelos scripts no tempdir do OS)

## Error recovery

| Onde falhou | Acao |
|---|---|
| QG-SEA-001 | @installer corrige ambiente, retoma do Step 1 |
| QG-SEA-002 | @cutter ajusta params (--threshold, --pad-ms) e re-roda |
| QG-SEA-003 | @scribe re-revisa transcript / re-acelera |
| QG-SEA-006 | @zoomer ajusta classificacao ou pula (fallback centro do frame) |
| QG-SEA-004 | @finisher re-encoda forcando defaults (yuv420p + Main + faststart) |
| QG-SEA-005 | @finisher checa fonte (Mac: `fc-match`; Windows: `.ttf` embarcado via fontfile), refaz com `--speed` correto |

Cada agent tem visibilidade do que precisa pra desbloquear seu QG — sem ping-pong pro chief.
