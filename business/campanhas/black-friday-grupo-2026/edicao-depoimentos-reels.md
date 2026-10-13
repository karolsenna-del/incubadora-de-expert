# Edição dos depoimentos em Reels — Squad Edição Euriliana

> Documento de trabalho. Pasta pesada (vídeos) fica FORA do repo: `C:\Users\karol\Videos\edicao-euriliana\depoimentos-black\`

## Fontes
Zip `Downloads/WhatsApp Unknown 2026-10-10 at 16.59.47.zip` → `brutos/` (4 cortes de Meet, 16:9 1920x1080):

| Arquivo | Aluno | Duração | Observação |
|---|---|---|---|
| 20.00.53 | Vagner (camisa preta) | 1:48 | origem do vídeo de 38s da página (73.5–81.9 + 48.0–70.6 + 96.9–104.8) |
| 20.00.57 | Vagner (camisa verde) | 0:43 | Karol aparece nos primeiros ~4s |
| 20.01.07 | Vagner (camisa salmão) | 2:10 | Karol aparece em alguns trechos (trocas de câmera do Meet) |
| 20.01.10 | Tasso | 0:46 | 0–17s é tela compartilhada (Tasso só no quadradinho) |

## Estado
- 11/10 — Convertidos pra vertical 1080x1920 em `vertical/` (`{vagner-1,vagner-2,vagner-3,tasso}-vertical.mp4`): enquadramento no rosto por trecho entre trocas de câmera (detector YuNet), faixa de nome do Meet fora do quadro; trecho de tela compartilhada vai inteiro sobre fundo desfocado.

- 11/10 — Cortes da Karol aplicados (pontos ajustados na pausa mais próxima), em `vertical/*-corte.mp4`:
  - **vagner-1-corte** (1:24): de 7,95s, acelerado 1,2x sem afinar a voz. Abre em "Foi ótimo, acho que realmente essa construção da persona..."
  - **vagner-2-corte** (0:33): 5,55s → 38,62s. "Muito bom! Você conseguiu..." até "...meio Jack Estripador, né? Vamos por partes."
  - **tasso-corte** (0:36): de 9,60s. "Eu achei maravilhosa, Karol, porque..." — os primeiros ~7s ainda são a tela compartilhada.
  - **vagner-3**: descartado pela Karol (vertical apagado; bruto continua em `brutos/`).

## Decisões da edição (Karol, 11/10)
- Pirotecnia 2 · legenda **13 pinta** (karaokê amarelo palavra a palavra) · **modo só animação** (sem gerador de IA; cores da Incubadora preto/branco/cinza/laranja)
- Headlines: Vagner 1 "Eu consigo fazer sozinho. Mas eu não quero fazer sozinho." · Vagner 2 "Eu queria ensinar tudo — e por isso não avançava." · Tasso "Eu não precisava de mais informação. Precisava de uma visão de fora."
- Áudio: Vagner 1 e 2 com clipagem → `tratar_audio: auto`; Tasso limpo (padrão)
- Tasso: 7s iniciais de tela compartilhada → cena TelaEAluno (tela real do encontro em cima, Tasso embaixo) — aguardando aprovação da Karol
- Trabalhos do squad: `depoimentos-black/{vagner-1,vagner-2,tasso}/` (bruto = `vertical/*-corte.mp4`); scripts em `agents/squad-edicao-euriliana/` (entregues pelo MCP)

## Estado da edição (11/10, noite)
- Feito: preparação (transcrição), roteiros de fala (`<trabalho>/roteiro.json`), corte + tratamento de voz (`cortar.py`), trilhas (V1 #16 piano Einaudi, V2 #12 Determination, Tasso #15 Epic Inspiring), cenas próprias em `_custom/` (CartaoIncubadora, DestaquesIncubadora, FraseTape, VinhetaIncubadora, PalavrasCaindo, Foco, Partes, TelaEAluno), planos em `<trabalho>/app/src/plano.json`.
- Durações: Vagner 1 52,4s (+3,2s vinheta) · Vagner 2 26,3s (+3,2s) · Tasso 32,0s (+3,2s).
- Vagner 1: rodar `python vagner-1/fix_palavras.py` depois de todo `cortar.py` (Whisper ouviu "Eu falei" no lugar de "Foi").
- Ritmo Vagner 2 conferido: OK pro nível 2 (troca média 1,05s, cobertura 81%).
- PAROU: `conferir.py quadros` foi interrompido pelo Claude Code por falta de memória na máquina. Retomar com: ritmo + quadros de tasso e vagner-1, quadros de vagner-2 → olhar folhas → render.

## Conferência (11/10, noite)
- Ritmo OK nos três (Tasso 1,14s/94% · Vagner 1 0,82s/75% · Vagner 2 1,05s/81%).
- Quadros conferidos (`<trabalho>/qa/folha_*.jpg`, escala 0,25 pra caber na memória). Ajustes feitos:
  - Cartão do nome descia no rosto (y 990) → y 1420 (peito) nos três.
  - Tasso: headline cobria o topo da tela compartilhada → tela desceu (y 640), aluno menor (600px, y 1310), legenda em 1600; headline quebrada em 4 linhas equilibradas; Whisper perdeu o "100" de "100% dentro do que eu gostaria" → `tasso/fix_palavras.py` (rodar depois de todo `cortar.py`).
  - Vagner 1: comparação estourava a lateral ("COM ALGUÉM JUNTO" grande demais) → título "JUNTO".
  - Vagner 2: cartão "Vagner" aparecia sobre a Karol (0–1,05s a câmera do Meet mostra ela) → cartão começa em 1,15s.
- Karol aparece na tela (troca de câmera do Meet, áudio é do Vagner): Vagner 2 0–1,05s (primeiro quadro do Reel) e Vagner 1 50,6–51,5s (rindo, sob "preciso de ajuda"). Mantido; perguntar se ela quer cobrir.
- Render em `<trabalho>/saida/<nome>.mp4` (concurrency 2).

## Entregue (11/10, 23h30)
- `depoimentos-black/{tasso,vagner-1,vagner-2}/saida/<nome>.mp4` — 1080x1920, H.264. Tasso 35,3s · Vagner 1 55,9s · Vagner 2 29,6s (com vinheta).
- Conferência final: volume -13,9 a -15 LUFS, legenda sincronizada (±0,05s), fala 90–97% igual ao roteiro.
- Vagner 1: o corte comia o fim de "faz sentido" (39s) → trecho "junto" estendido até 51,72 no roteiro, `cortar.py --refaz`, cenas a partir de 39s deslocadas +0,272s. (Lição: mudou roteiro → `cortar.py --refaz`, senão a mídia não é regravada.)
- Vagner 2: alerta do "por partes" no fim era falso (medido: a voz está inteira).
- Detalhe menor que ficou: na comparação do Vagner 1, "Discernimento" e "Direcionamento" quebram a linha do marcador.

## Próximo
- Karol assiste e aprova; decidir se cobre os ~1s em que ela aparece (Vagner 2 abertura, Vagner 1 ~51s).
