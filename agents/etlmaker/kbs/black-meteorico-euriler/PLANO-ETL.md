# Plano do ETL — Lançamento Black Friday Meteórico (Euriler)

## Contexto
- **Fonte:** aula gravada "Euriler - Lançamento Black Friday Meteórico" (1h16), área de membros Arcane > Conteúdo Gravado > Aulas Extraordinárias > Vendas
- **Link:** https://arcane.arka.education/replays?categoria=aulas-extraordinarias&sub=ae-vendas (vídeo 02)
- **Autor:** Euriler Jube
- **Tipo:** aula gravada (vídeo com mapa mental na tela)
- **Objetivo da Karol:** entender e seguir o roteiro do vídeo/live de vendas (uso na campanha Black Expert)
- **Modo:** Full Pipeline enxuto (1 fonte → 1 volume prático de roteiro + docs de apoio)

## Status
- [x] Fase 0: Setup (10/10)
- [ ] Fase 1: Ingestão — áudio baixado e transcrito com Whisper local (modelo small)
- [ ] Fase 1b: Mapa Territorial
- [ ] Fase 2: Composição (0/1 volume)
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação

## Decisões
- 10/10 — A Karol escolheu a aula do Euriler (Black Meteórico) entre as 7 da categoria Vendas.
- 10/10 — A aula não tem transcrição nem legenda na plataforma. Áudio puxado do player (Bunny) e transcrito localmente.

## Estado atual (10/10, ~16h)
- Áudio completo (76 min) baixado em scratchpad/euriler-black/audio.wav.
- 55 de 76 fotos da tela (1 por minuto) salvas em scratchpad/euriler-black/frames/.
- A transcrição com o Whisper e a captura das fotos foram interrompidas pelo Claude Code porque a memória do PC ficou crítica. Transcrição: 0%. Esperando a Karol decidir como retomar.
- Para retomar o download do vídeo: o Bunny exige o header Referer/Origin https://arcane.arka.education/ e o ffmpeg precisa de -extension_picky 0.

## Regras de operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção: o que o Euriler não disse não entra
- Arquivos temporários (áudio) ficam no scratchpad da sessão, fora do repo
