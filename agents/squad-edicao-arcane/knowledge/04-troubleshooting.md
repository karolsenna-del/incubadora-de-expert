# 04 — Troubleshooting

Bugs conhecidos do pipeline + soluções. Cada um aprendido na dor — não pular.

## Bug 1: Vídeo final não abre no QuickTime

**Sintoma:** `open <final>.mp4` abre o Preview mas vídeo trava ou aparece em branco.

**Causa:** Output saiu em **h264 10-bit** (`yuv420p10le`, profile `High 10`). O iPhone grava HEVC 10-bit nativamente, e se o libx264 não receber `-pix_fmt yuv420p` explícito, ele MANTÉM 10-bit. QuickTime/Safari/Reels não abrem h264 10-bit.

**Diagnóstico:**
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt,profile -of csv=p=0 <video>
# se retornar "High,yuv420p10le" ou "High 10,yuv420p10le" — BUG
# se retornar "Main,yuv420p" — OK
```

**Fix:** Os scripts deste squad **já forçam** `-pix_fmt yuv420p -profile:v main -level 4.0`. Se mesmo assim apareceu 10-bit, algum passo intermediário não foi pelo script — re-encodar:

```bash
ffmpeg -y -i <video_10bit> -c:v libx264 -crf 18 -pix_fmt yuv420p \
  -profile:v main -level 4.0 -movflags +faststart \
  -c:a aac -b:a 192k <video_8bit>.mp4
```

## Bug 2: Legenda em fonte errada / não renderiza (é OS-específico)

A partir da v1.1.0 o `video-captions.py` resolve a fonte **por OS** (`_common.drawtext_font_opt`):

- **Mac** → `font='Bebas Neue'` (fontconfig). Falha = cai pra Verdana (fonte não instalada).
- **Windows/Linux** → `fontfile='<.ttf embarcado>'` (freetype abre o arquivo direto, dispensa fontconfig). Falha = `Fontconfig error: Cannot load default config file` (o ffmpeg não abriu o `.ttf` e tentou o fallback).

**Mac — cai pra Verdana:**
```bash
fc-match "Bebas Neue"   # esperado: BebasNeue-Regular.ttf. Se der Verdana, a fonte não está instalada.
fc-cache -fv ~/Library/Fonts/    # e rode o install de novo
```

**Windows — "Fontconfig error / Cannot open font":** o path do `.ttf` tem **acento ou espaço** e o short-path 8.3 do volume está desabilitado (raro). O `_common` já converte pra short-path 8.3 automaticamente; se mesmo assim falhar, **mova o squad pra um path só-ASCII** (ex: `C:\arka\squad-edicao-arcane\`) e rode o install de novo. Empiricamente validado: com short-path, a legenda renderiza com acento correto (É, Ç, Ã) no Windows.

## Bug 3: Script Python não acha biblioteca (cv2, silero, torch)

**Sintoma:** `ModuleNotFoundError: No module named 'silero_vad'` (ou cv2/torch/scipy).

**Causa:** Você rodou com `python`/`python3` puro em vez do venv do squad.

**Fix:** Pros scripts que usam torch/silero/cv2 (`video-speech-cut.py`, `video-produce-zoom.py`) e pyyaml (`video-captions.py`), SEMPRE usar o Python do venv:

```bash
# Mac/Linux:
{SQUAD_DIR}/.venv/bin/python3 {SQUAD_DIR}/scripts/video-speech-cut.py video.mp4
# Windows:
{SQUAD_DIR}\.venv\Scripts\python.exe {SQUAD_DIR}\scripts\video-speech-cut.py video.mp4
```

Os scripts que só usam ffmpeg (`video-speed-up.py`, `video-transcribe.py`, `video-add-music.py`) rodam com `python` puro.

## Bug 4: `printf: invalid number` no speed-up (EXTINTO na v1.1.0)

**Sintoma (v1.0.0, só no `.sh`):** `printf: 125.500000: invalid number` no log.

**Causa:** Locale pt-BR usava vírgula decimal, quebrando o `printf %.1f` do bash.

**Status:** **Não acontece mais.** O `video-speed-up.py` (Python) formata float com ponto independente de locale. O bug morreu junto com a conversão `.sh → .py`.

## Bug 5: Whisper transcreve nome próprio errado

**Sintoma:** "Euriler" virou "Reeler", "Bia" virou "Biá".

**Causa:** Whisper genérico não conhece nomes próprios incomuns.

**Fix:** **2 camadas** — ver `knowledge/03-dicionario-correcoes.md`:

1. `--prompt` com os nomes (whisper acerta melhor com contexto)
2. Dicionário de correções automáticas pós-transcrição
3. Revisão humana na main thread (@scribe) pega o que escapou das 2 anteriores

## Bug 6: Legenda corta palavra no meio

**Sintoma:** Vê "RESPONDE ESSA **MENS**" como legenda — `MENSAGEM` cortou.

**Causa:** Whisper foi chamado sem `--split-on-word` (`-sow`). Sem ele, o `-ml 32` (max-len 32 chars) corta no caractere 32 mesmo se for no meio da palavra.

**Fix:** Os scripts **já incluem `-sow`**. Se aparecer corte, verificar comando do whisper-cli.

## Bug 7: Linha de legenda sai da tela

**Sintoma:** "EM 2026, A" como legenda — sumiu o "Í DEU UM SALTO" que devia seguir.

**Causa:** A linha agrupada teve mais que 26 chars (com fontsize 100, ~1080px de largura cabem ~26 chars de Bebas Neue). `drawtext` não quebra linha sozinho — corta nas bordas da tela.

**Fix:** O script `video-captions.py` **já limita** `MAX_CHARS=26`. Se aparecer corte, verificar:
- O parâmetro `--max-chars` foi modificado pra valor maior?
- A fontsize foi modificada (`--fontsize` maior precisa de `--max-chars` menor)?

## Bug 8: Modelo whisper "ggml-medium.bin" ausente

**Sintoma:** `video-transcribe.py` reporta "modelo whisper nao encontrado".

**Path por OS** (resolvido por `_common.model_path()`): env `WHISPER_MODEL` → `/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin` (Mac) → `<squad>/models/ggml-medium.bin` (Windows/Linux).

**Fix:** rodar o `install.py` do squad — ele baixa no lugar certo automaticamente. Ou apontar `WHISPER_MODEL` pra um `ggml-medium.bin` que você já tenha. Download manual: https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin

**Download incompleto (v1.1.0):** o modelo tem **1533763059 bytes** exatos. Se a conexão cair no meio, o `install.py` **retoma de onde parou** (HTTP Range) em vez de recomeçar 1.5GB, e só dá OK quando bate o tamanho exato. O `doctor.py` também checa o **tamanho**, não só a existência — arquivo truncado (ex: 778MB) não passa mais como `[OK]` falso. Se o doctor marcar o modelo como `[FAIL]` com o arquivo presente, é tamanho errado: rode o install de novo (retoma) ou apague `<squad>/models/ggml-medium.bin` e rode de novo.

## Bug 9: Vídeo abre mas áudio sai com pitch errado

**Sintoma:** Após speed-up, voz fica "esquilo" (aguda).

**Causa:** Script usou `asetrate` em vez de `atempo`. `asetrate` muda a taxa de amostragem (= muda pitch). `atempo` time-stretch mantendo pitch.

**Fix:** Os scripts **usam `atempo`** corretamente. Se acontecer, verificar `video-speed-up.py`.

## Bug 10: ffmpeg "Unable to open font" ou cai pra Verdana mesmo com font correto

**Sintoma:** Renderiza com Verdana mesmo após `fc-cache`.

**Causa:** `fontconfig` cache desatualizado OU `ffmpeg` sem `libfontconfig`.

**Fix:**
1. `fc-cache -fv ~/Library/Fonts/`
2. Verificar suporte: `ffmpeg -version | grep libfontconfig` — deve aparecer
3. Se não tiver: `brew reinstall ffmpeg`

## Bug 11: Legenda não renderiza — "precisa compilar o ffmpeg" / "tem custo"

**Sintoma:** Todo o resto do pipeline roda (corte, speed, zoom, trilha), mas a **legenda queimada não vai**. Um assistente de IA sugere "compilar o ffmpeg" e fala em "custo".

**Causa raiz:** A legenda é a ÚNICA etapa que usa o filtro `drawtext` do ffmpeg (`video-captions.py`). `drawtext` depende de `libfreetype`/`libfontconfig` compilados no binário. Se o aluno tem **outro ffmpeg na frente do PATH sem drawtext** — tipicamente o ffmpeg do **conda/Anaconda/miniconda** (não traz drawtext) ou um build estático antigo — os scripts pegavam esse ffmpeg cego e o `drawtext` falhava. As outras etapas funcionavam porque usam filtros presentes em qualquer ffmpeg.

**Premissa ERRADA que circula:** "o Homebrew não entrega mais ffmpeg com drawtext". **Falso.** O bottle oficial do Homebrew JÁ inclui drawtext (`enable-libfreetype`, `enable-libfontconfig`, `enable-libharfbuzz`); `fontconfig` e `freetype` são dependências *Required* da fórmula. **Não precisa compilar nada.**

**O "custo":** o assistente do aluno sugeriu *compilar o ffmpeg do source* (`brew install --build-from-source` ou compilação manual) — isso leva ~30 min de CPU e esquenta o Mac. Esse é o "custo" (tempo/processamento), **não dinheiro**. E é totalmente desnecessário.

**Diagnóstico:**
```bash
which ffmpeg                                   # se apontar pra ~/miniconda3/... ou /opt/anaconda → é o culpado
ffmpeg -filters 2>/dev/null | grep drawtext    # vazio = ffmpeg do PATH não tem drawtext
/opt/homebrew/bin/ffmpeg -filters | grep drawtext   # o do Homebrew TEM (em Intel: /usr/local/bin/ffmpeg)
```

**Fix (v1.1.0):** o `_common.find_bin` resolve o ffmpeg pelo **PATH primeiro** (`shutil.which`) e cai pros diretórios do brew só como fallback no Mac. Ou seja: garanta que o ffmpeg **certo** (com drawtext) esteja na frente do PATH, ou que o do brew esteja instalado no Mac. Se um conda ffmpeg sem drawtext estiver na frente do PATH, o jeito limpo é instalar o ffmpeg bom:
```bash
brew install ffmpeg               # Mac (ou: brew reinstall ffmpeg). NÃO use --build-from-source.
winget install --id Gyan.FFmpeg   # Windows (build full, já com drawtext)
python scripts/doctor.py          # confirma "ffmpeg drawtext (legenda) [ OK ]"
```

**Resposta pronta pro aluno que perguntou do "custo":** "Não precisa compilar nada nem tem custo nenhum. O ffmpeg do Homebrew já vem com legenda pronta. Roda `brew install ffmpeg` e depois o `doctor.py` do squad — resolve." No Windows, o equivalente é `winget install --id Gyan.FFmpeg -e` (build full, já com drawtext).

---

## Bugs específicos de Windows (v1.1.0)

### W1: `pip install` falha no torch

**Sintoma:** o venv cria, mas `pip install torch` falha (`No matching distribution`).

**Causa:** Python **3.14** (ou mais novo) ainda não tem wheel de torch.

**Fix (v1.1.0):** o `install.py` **resolve sozinho** — quando só acha Python ≥ 3.14, ele instala o **Python 3.13 via winget** (`Python.Python.3.13`) e cria o venv com o exe recém-instalado (por caminho absoluto, não depende do launcher recarregar). Sem winget na máquina: instale Python 3.13 (python.org) e rode o install de novo. Se o instalador avisar que instalou mas não localizou o exe na sessão, **abra um novo terminal** e rode de novo (idempotente).

### W2: `whisper-cli` não instala

**Sintoma:** `doctor.py` mostra `whisper-cli [FAIL]` no Windows.

**Causa:** o download do release do whisper.cpp falhou. Bug histórico: a URL apontava pro `v1.7.4`, que **não tem** o asset `whisper-bin-x64.zip` (dava HTTP 404).

**Fix (v1.1.0):** a URL agora aponta pro release **`v1.9.1`** (que tem o asset) — o `install.py` baixa e extrai `whisper-cli.exe` + `ggml*.dll` pra `<squad>/bin/` sozinho. Se ainda falhar (rede): baixar `whisper-bin-x64.zip` de https://github.com/ggml-org/whisper.cpp/releases manualmente e extrair `whisper-cli.exe` (+ `ggml*.dll`) pra `<squad>/bin/`. O `_common.find_bin` acha ele lá. Alternativa: pôr o `whisper-cli.exe` em qualquer pasta do PATH.

### W3: legenda "Fontconfig error" com acento/espaço no caminho

Ver **Bug 2** (seção Windows): o `_common` usa short-path 8.3 automaticamente; se o volume tiver 8.3 desabilitado, mova o squad pra um path só-ASCII sem espaço.

### W4: ffmpeg não aparece após `winget install`

**Sintoma:** instalou via winget mas `ffmpeg` continua "ausente".

**Causa:** o PATH da sessão atual não recarregou.

**Fix:** **abrir um novo terminal** e rodar o `install.py`/`doctor.py` de novo.

### W5: nada de bash

O squad **não usa mais bash** — todos os scripts são `.py`. Não precisa de Git Bash nem WSL no Windows. Se algum agent antigo mandar `bash ...sh`, está desatualizado: o comando certo é `python ...py`.
