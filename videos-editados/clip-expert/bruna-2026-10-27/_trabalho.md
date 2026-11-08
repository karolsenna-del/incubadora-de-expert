# Cortes — Sessão Bruna (27/10/2026)

Pedido da Karol (06/11): cortar o encontro dando ênfase aos momentos em que ela explica e apresenta
conhecimento pra Bruna. Foco na Karol; a Bruna pode aparecer às vezes.

Fonte: Drive "Bruna - 2026/10/27 14:53 GMT-04:00 - Recording" (id 1zpyh3XvUkG31HVE6ucncVOQw-imJpszQ), 56min39s, 1920x1080.

## Layout da gravação (mapa minuto a minuto)
- 0-12min: quase só a Bruna em tela cheia (ela contando).
- 13-37min: majoritariamente a Karol em tela cheia explicando (melhor zona).
- 38-51min: Karol apresentando slides da oferta (Incubadora Express, preço) — câmera pequena no canto.
- 52-56min: Bruna em tela cheia, fechamento.

## Formato
- Vertical 1080x1920 com reenquadramento que acompanha o rosto (speaker view troca sozinho).
- Headline no topo, dentro da margem 4:5, caixa preta, letra branca, palavra-chave em laranja, ~4s, sem legenda nesse intervalo.
- Legenda estilo `custom-karol-laranja` (Bebas Neue, destaque #F05A28).

## Checklist
- [x] Baixar vídeo
- [x] Mapear layout
- [x] Gemini: só tem resumo (sem fala com tempo) — usado como mapa dos temas
- [ ] Transcrever 12:30-38:10 com whisper small (rápido) → `agents/clip-expert/data/transcripts/bruna-2026-10-27-1230-3810-small.txt` (offset 750s)
- [x] Small concluído (1003 linhas) — erra nomes e frases soltas, serve só pra garimpar
- [ ] Retranscrever só os trechos escolhidos com whisper medium (legenda precisa) → scratchpad/win/cXX.txt (offset = início - 2s)
- [x] Pontuação (score_clip.py, nota mín 7.0): 8/10 aprovados → `candidatos.json`
  - c03 24:23-25:13 (8.6) tudo leva à promessa · c01 18:52-20:02 (8.4) especialista no paciente
  - c04 26:05-27:04 (8.0) 1º lançamento catástrofe · c08 31:46-32:51 (8.0) maior erro: persona
  - c10 35:00-35:56 (8.0) aluna servidora e os 6 nãos · c06 28:38-29:22 (7.65) 13 anos servidora/Receita
  - c02 20:13-21:24 (7.35) menino de 18 x mulher de 35 · c09 32:52-33:29 (7.1) método vem da sua vida
  - fora: c05 ninguém tá nem aí (6.65), c07 ikigai/gestão (6.25)
  - c04 termina antes de "yap content" (termo do desafio do Afonso, fora do público)
- Montagem: `agents/clip-expert/scripts/montar-corte-rosto.py` (testado 06/11: enquadramento próprio a cada 0.5s, headline topo caixa preta + laranja, legenda custom-karol-laranja)
- [ ] Pontuar trechos (rubrica Expert Viral, nota mínima 7.0, foco em explicação da Karol)
- [ ] Cortar, reenquadrar, legendar, headline
- [ ] Conferir frames de cada corte
- [ ] Entregar pra revisão da Karol

## Estado em 06/11 ~17h10
- [x] 8 cortes montados (headline no meio, legenda custom-karol-laranja, 1080x1920 yuv420p Main) + legenda de post
- [x] Enquadramento melhorado (leitura sequencial, amostra 0.25s, rosto mais confiável, ignora porta-retrato) — aplicado só no corte-06
- [ ] Reprocessar 01-05, 07, 08 com o enquadramento novo (lote interrompido pelo sistema por falta de RAM)
- [x] Revisão da Karol (06/11): 01-05, 07, 08 aprovados → business/instagram/fila-reels/sessao-bruna-2026-10-27-corte-NN/; 06 reprovado (cita a antiga empresa)
- Ordem de nota: 01 promessa 8.6 · 02 paciente 8.4 · 03 lançamento 8.0 · 04 erro persona 8.0 · 05 6 nãos 8.0 · 06 servidora 7.65 · 07 18x35 7.35 · 08 método vem da vida 7.1

## 07/11 — headline no topo (pedido da Karol)
- Regra nova: corte com tela compartilhada → headline no centro; rosto em tela cheia → headline no topo (margem 4:5). `montar-corte-rosto.py` agora usa o topo por padrão (--hl-y 0.17).
- [x] corte-01 refeito em `topo/`, subido por cima no Cloudinary (com invalidate) — o link do agendamento de hoje 10h já entrega o vídeo novo (conferido baixando o link)
- [x] 02, 03, 04, 05, 07, 08 refeitos em `topo/`, subidos por cima e conferidos (link agendado entrega o arquivo novo, mesmo tamanho). Agendamentos 07-13/11 10h intactos, sem push. Versões antigas (headline no meio) ficam na pasta de cima.
