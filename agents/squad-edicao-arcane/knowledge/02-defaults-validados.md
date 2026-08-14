# 02 — Defaults validados

Parâmetros usados nos 4 scripts. Cada um tem um motivo — não mexer sem entender.

## speech-cut (Silero VAD)

| Param | Default | Por quê |
|---|---|---|
| `--threshold` | `0.6` | Probabilidade mínima pra Silero considerar um trecho como fala humana. 0.5 = tolerante (deixa respiração passar). 0.6 = agressivo (pega respiração). 0.7 = só fala muito clara |
| `--min-silence-ms` | `80` | Gaps de fala >= 80ms viram corte (jumpcut). Abaixo disso = pausa natural entre palavras, mantém. Conservador era 100ms — agressivo é 80 |
| `--min-speech-ms` | `120` | Blocos de fala menores que 120ms são descartados como ruído (bip, click) |
| `--pad-ms` | `30` | Padding antes/depois de cada bloco de fala — protege a sílaba inicial/final. 30ms é mínimo. Menos que isso corta consoante |

**Resultado típico** (talking-head):
- Redução: 40-50% da duração
- Jumpcuts: 30-60 por minuto de fala
- Respiração: 90%+ removida

## speed-up

| Param | Default | Por quê |
|---|---|---|
| `speed` | `1.2` | Sweet spot pra Reels — energia sem distorcer voz. Validado pelo Euriler vs 1.0/1.1/1.25/1.5 |
| Filtro vídeo | `setpts=PTS/1.2` | Acelera reprodução |
| Filtro áudio | `atempo=1.2` | Acelera mantendo pitch (NÃO usa asetrate) |
| `-c:a copy` | NUNCA | atempo precisa re-encodar áudio (AAC 192k) |

## transcribe (whisper)

| Param | Default | Por quê |
|---|---|---|
| `-l pt` | sempre | Português brasileiro |
| `-ml 32` | sempre | Max 32 chars por chunk — frases mais longas, menos fragmento |
| `-sow` | sempre | Split-on-word — não corta palavra no meio (`MENS` virando legenda solta) |
| `--prompt` | nomes do expert | Whisper acerta melhor nomes próprios quando vê eles no prompt |
| Modelo | `medium` | Equilíbrio qualidade/velocidade. Roda na GPU Metal do Mac (M1/M2/M3) em ~12s/minuto |

## queimar-legenda (estilo B)

| Param | Default | Por quê |
|---|---|---|
| `--font` | `Bebas Neue` | Fonte condensed bold, estilo pop viral |
| `--fontsize` | `100` (portrait) | Lê bem em 1080x1920 |
| `--y-pos` | `0.60` | Topo da linha 1 em 60% da altura. Abaixo da metade, fora da UI inferior do WhatsApp/Reels |
| `--max-chars` | `26` | Acima disso a linha sai da tela (drawtext não quebra sozinho) |
| `--max-words` | `5` | Sweet spot pra leitura rápida |
| `--max-dur` | `2.4s` | Legenda não fica > 2.4s na tela |
| Borda | `borderw=5 bordercolor=black` | Stroke grosso pra ler em qualquer fundo |
| Cor linha 1 | `white` | Texto principal |
| Cor linha 2 | `yellow` | Destaque (palavra-chave do final do chunk) |
| Resolução da fonte | OS-aware (v1.1.0) | Mac: `font='<nome>'` via fontconfig (validado). Windows/Linux: `fontfile='<.ttf embarcado>'` via freetype (com short-path no Windows pra fugir de acento/espaço). O `video-captions.py` decide sozinho — ver `_common.drawtext_font_opt` |

## Encoding (TODOS os scripts)

| Param | Default | Por quê |
|---|---|---|
| `-pix_fmt yuv420p` | OBRIGATÓRIO | Força 8-bit. iPhone grava HEVC 10-bit (yuv420p10le) — sem isso o libx264 mantém 10-bit e o QuickTime não abre |
| `-profile:v main` | OBRIGATÓRIO | Main, NÃO High. High 4:4:4 não abre nativo em players Apple |
| `-level 4.0` | sempre | Compatível com Reels/TikTok |
| `-movflags +faststart` | sempre | moov atom no início → player começa antes do download terminar |
| `-c:v libx264 -crf 18` | sempre | Qualidade alta, tamanho razoável |
| `-c:a aac -b:a 192k` | sempre, NÃO copy | `-c:a copy` pode propagar áudio do iPhone com problema |
