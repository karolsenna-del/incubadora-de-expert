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
- [x] Fase 1: Ingestão — transcrição completa (10/10, 22h10) em 00-pipeline/sources/
- [x] Fase 1b: Mapa Territorial (00-pipeline/MAPA-TERRITORIAL.md) — aguardando aprovação do plano de volumes (QG-002)
- [ ] Fase 2: Composição (1/4 volumes) — VOL-04 pronto (10/10), spot-check 10/10 trechos conferidos com a fonte, 0 inventados. Faltam VOL-01, VOL-02, VOL-03
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação

## Decisões
- 10/10 — A Karol escolheu a aula do Euriler (Black Meteórico) entre as 7 da categoria Vendas.
- 10/10 — A aula não tem transcrição nem legenda na plataforma. Áudio puxado do player (Bunny) e transcrito localmente.

- 10/10 — Plano de 3 volumes aprovado pela Karol (QG-002).
- 10/10 — A aula do Euriler não traz o roteiro da fala da live. A live de oferta da Karol = história (herói relutante) + oferta, sem conteúdo. Karol aprovou incluir na base as aulas de história e oferta do Ícaro de Carvalho (Máquina Automática de Vendas, já transcritas em kbs/maquina-automatica-de-vendas/00-pipeline/sources/transcricoes/) e criar o VOL-04: estrutura da live de oferta. Prioridade: VOL-04 primeiro (o roteiro da live de fechamento da Black Expert vence em 11/10).
- Fontes Ícaro (SRC-002): mod04-aula04, mod04-aula06, mod05-aula05, mod05-aula06, mod06-aula02, mod06-aula03, mod06-aula05, mod06-aula07, mod06-aula08, mod07-aula08, mod07-aula09.

- 10/10 noite — Karol: live 15h, carrinho abre no fim da live até 23h59 (nada às 8h). VOL-04 §7.4 atualizado. Herói relutante: só menção na Q&A do Lourival (FHT); o ETL do FHT não traz a estrutura. Molde usado: Etapa 3 da sessão de Vendas Secretas da Karol (kbs/sessao-estrategica/VOL-07).
- 10/10 noite — Briefing da live de fechamento criado em business/campanhas/black-friday-grupo-2026/briefing-live-fechamento.md (pesquisa nos registros: oferta v2, página, disparos, historias-trajetoria, sessão ECROI). Texto falado = Expert em Lives.

## Estado atual (10/10, ~16h)
- Áudio completo (76 min) baixado em scratchpad/euriler-black/audio.wav.
- 55 de 76 fotos da tela (1 por minuto) salvas em scratchpad/euriler-black/frames/.
- A transcrição com o Whisper e a captura das fotos foram interrompidas pelo Claude Code porque a memória do PC ficou crítica. Transcrição: 0%. Esperando a Karol decidir como retomar.
- 10/10 noite — Transcrição refeita em pedaços de 10 min (script scratchpad/transcreve_pedacos.py, que pula os pedaços já prontos). 3/8 prontos (00:00–30:00) em scratchpad/euriler-black/pedacos/. O Claude Code interrompeu de novo por falta de memória. Caminho para não ser interrompido: rodar o script numa janela de PowerShell separada.
- Para retomar o download do vídeo: o Bunny exige o header Referer/Origin https://arcane.arka.education/ e o ffmpeg precisa de -extension_picky 0.

## Regras de operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção: o que o Euriler não disse não entra
- Arquivos temporários (áudio) ficam no scratchpad da sessão, fora do repo
