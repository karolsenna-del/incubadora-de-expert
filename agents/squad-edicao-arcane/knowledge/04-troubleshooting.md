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

## Bug 2: Legenda renderiza em fonte errada (Verdana)

**Sintoma:** Legenda aparece em Verdana (serif larga) em vez de Bebas Neue.

**Causa:** O script usou `fontfile='/path/to/font.ttf'` em vez de `font='Bebas Neue'`. Quando o ffmpeg tem `libfontconfig` compilado, ele **silenciosamente ignora `fontfile=`** e tenta resolver pelo nome — se a fonte não estiver instalada, cai pra Verdana.

**Diagnóstico:**
```bash
fc-match "Bebas Neue"
# esperado: BebasNeue-Regular.ttf: "Bebas Neue" "Regular"
# bug: Verdana.ttf: "Verdana" "Regular"
```

**Fix:**
1. Verificar que `~/Library/Fonts/BebasNeue-Regular.ttf` existe
2. Rodar `fc-cache -fv ~/Library/Fonts/`
3. Re-rodar `fc-match`
4. Se ainda Verdana — o squad foi mal instalado, rodar `install.sh` de novo

## Bug 3: Script Python não acha biblioteca (cv2, silero, torch)

**Sintoma:** `ModuleNotFoundError: No module named 'silero_vad'` (ou cv2/torch/scipy).

**Causa:** Você rodou com `python3` (do Homebrew) em vez do venv do squad.

**Fix:** SEMPRE usar `{SQUAD_DIR}/.venv/bin/python3`, nunca `python3` puro.

```bash
# ERRADO
python3 scripts/video-speech-cut.py video.mp4

# CERTO
~/arka1/squads/squad-edicao-arcane/.venv/bin/python3 \
  ~/arka1/squads/squad-edicao-arcane/scripts/video-speech-cut.py video.mp4
```

## Bug 4: `printf: invalid number` em `video-speed-up.sh`

**Sintoma:** Log do `speed-up.sh` mostra:
```
printf: 125.500000: invalid number
original: 0,0s -> acelerado: 0,0s
```

**Causa:** Locale pt-BR usa vírgula como separador decimal (`125,5`), mas o `printf %.1f` em C espera ponto (`125.5`). O vídeo **é gerado corretamente** — só o log final fica estranho.

**Fix:** Script já corrige com `LC_NUMERIC=C printf ...`. Se mesmo assim aparecer, atualizar o script.

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

**Sintoma:** `whisper-cli ... -m /opt/homebrew/share/whisper-cpp/models/ggml-medium.bin` reporta arquivo não encontrado.

**Fix:**
```bash
mkdir -p /opt/homebrew/share/whisper-cpp/models
curl -L -o /opt/homebrew/share/whisper-cpp/models/ggml-medium.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin
```

Ou rodar `install.sh` do squad — ele baixa automaticamente.

## Bug 9: Vídeo abre mas áudio sai com pitch errado

**Sintoma:** Após speed-up, voz fica "esquilo" (aguda).

**Causa:** Script usou `asetrate` em vez de `atempo`. `asetrate` muda a taxa de amostragem (= muda pitch). `atempo` time-stretch mantendo pitch.

**Fix:** Os scripts **usam `atempo`** corretamente. Se acontecer, verificar `video-speed-up.sh`.

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

**Fix (a partir desta versão do squad):** os scripts já usam o ffmpeg do Homebrew direto (`/opt/homebrew/bin/ffmpeg`, ou `/usr/local/bin` no Intel), ignorando o PATH. Basta garantir que o ffmpeg do Homebrew esteja instalado:
```bash
brew install ffmpeg     # (ou: brew reinstall ffmpeg). NÃO use --build-from-source.
bash scripts/doctor.sh  # confirma "ffmpeg drawtext (legenda) ✓"
```

**Resposta pronta pro aluno que perguntou do "custo":** "Não precisa compilar nada nem tem custo nenhum. O ffmpeg do Homebrew já vem com legenda pronta. Roda `brew install ffmpeg` e depois o `doctor.sh` do squad — resolve."
