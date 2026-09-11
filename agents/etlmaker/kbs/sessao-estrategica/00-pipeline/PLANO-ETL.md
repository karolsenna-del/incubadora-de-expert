# ETL Plan — Sessão Estratégica

## Contexto
- **Fonte:** Aula "Sessão Estratégica" — plataforma Arcane (arcane.arka.education/jornada)
- **Autor(es):** Euriler Jube (a confirmar durante mapeamento)
- **Tipo:** Aula em vídeo (3h19min), sem transcrição disponível na plataforma
- **Localização:** kbs/sessao-estrategica/00-pipeline/sources/

## Status
- [x] Fase 0: Setup (ingestão + normalização — 31.405 palavras após correção, QG-ETL-000 passou)
- [x] Fase 1: Mapeamento Territorial (MAPA-TERRITORIAL.md pronto, QG-ETL-001 passou — 8 domínios, 4 volumes propostos)
- [x] QG-ETL-002: usuária aprovou o plano de 4 volumes (11/09/2026)
- [ ] Fase 2: Composição Blocada (0/4 volumes completos — VOL-1 EM ANDAMENTO, incompleto/não validado)
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação Final

## Decisões Chave
- 10/09/2026 — Modo escolhido: Full Pipeline (usuária confirmou via AskUserQuestion)
- 10/09/2026 — Vídeo sem transcrição/material de apoio na plataforma. Baixado via yt-dlp (Bunny.net/mediadelivery.net) e transcrito localmente com video-transcribe.py (whisper, ggml-medium, chunks de 5min)
- 10/09/2026 — Vídeo baixado (1.5GB). Transcrição rodando em background (task b3ci874r7) — vídeo de 3h19min, processamento em janelas de 5min
- 11/09/2026 — video-transcribe.py (modelo medium) matado 3x por falta de memória do sistema (mesmo após fechar Chrome). Baixado modelo whisper "small" (487MB) — matado de novo no chunk 1. Causa raiz: extração única do áudio inteiro + navegação por offset (-ot/-d) gera pico de memória mesmo por chunk
- 11/09/2026 — Solução: script transcribe-lowmem.py (scratchpad da sessão) extrai cada janela de 5min em um .wav FISICAMENTE separado (~10MB) via ffmpeg -ss/-t direto no vídeo, ao invés de navegar por offset num wav único. Testado em 1 chunk (~2m38s, sem falha de memória). Rodando os 41 chunks completos em background (task betldu35z), retomável se for interrompido
- 11/09/2026 — Máquina compartilhada com outra sessão ativa (incubadora-de-expert-84) causou múltiplos kills por memória. Rodado como processo desacoplado (fora do tracking do harness) via PowerShell Start-Process + bash --login. Transcrição concluída: 41/41 chunks, 30.737 palavras, sequência íntegra (sem duplicatas). Fonte normalizada com timestamps globais corrigidos em aula-sessao-estrategica-normalized.md
- 11/09/2026 — Fase 1 (Mapeamento Territorial) delegada a agente fork (lê a fonte inteira e produz MAPA-TERRITORIAL.md). Aguardando conclusão antes de apresentar plano de volumes pra aprovação (QG-ETL-002)
- 11/09/2026 — Fork identificou 2 defeitos reais herdados da corrida de processos: (1) chunk 3 (offset 600-900s, ~10-15min) ficou 100% VAZIO na transcrição — falha silenciosa, não detectada pela checagem de headers únicos; (2) chunk 32 (~02:31-02:44) tinha conteúdo duplicado/interleaved de dois processos concorrentes. Vídeo rebaixado (token novo via browser), chunks 3 e 32 re-extraídos e re-transcritos isoladamente, substituídos no raw e revalidados (todos os 41 chunks agora com exatamente 1 bloco). Fonte normalizada regenerada: 31.405 palavras (era 30.737)
- 11/09/2026 — Segundo fork disparado pra atualizar o MAPA-TERRITORIAL.md com o trecho de 10-15min (nunca lido antes) e remover a menção ao gap de duplicação (já resolvido). Fork não aplicou a correção direito (só ecoou uma frase) — corrigido manualmente por mim direto na seção 10 do mapa
- 11/09/2026 — Usuária aprovou o plano de 4 volumes (QG-ETL-002)
- 11/09/2026 — Fork disparado pra compor VOL-01-fundamentos-modelo-negocio.md. Bateu no limite de sessão (rate limit, reseta 18:30 America/Cuiaba) no meio do processo — o fork já tinha corrigido uma invenção detectada no próprio spot-check (um "[risos]" que não estava na fonte) mas foi cortado antes de confirmar a versão final e fechar o checkpoint
- 11/09/2026 — **PRÓXIMO PASSO (retomar amanhã):** ler VOL-01-fundamentos-modelo-negocio.md (293 linhas atualmente, pasta raiz da KB) e decidir: (a) se está completo/fiel o suficiente pra passar por um spot-check e ser aceito, ou (b) se precisa ser refeito/completado — a task compose-volume.md exige mínimo 300 linhas, 2 tabelas, 3 exemplos, 10 referências [Fonte:], 1 regra cardinal. NÃO assumir que está pronto sem reler e validar. Depois seguir pros VOL-02, VOL-03, VOL-04 (planos na seção 8 do MAPA-TERRITORIAL.md)

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
