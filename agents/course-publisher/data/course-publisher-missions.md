# Course Publisher — Mission Log

> Historico de missoes executadas. Append-only — nunca remover entradas.
> Last Review: nunca

---

## LOG

| # | Data | Missao | Resultado | Assets Gerados | Videos Upados | Notas |
|---|------|--------|-----------|----------------|---------------|-------|
| 1 | 2026-07-13 | Publicar aulas Expert360 na Voomp (M0+M1+M2 parcial) | 13 aulas com vídeo+descrição+thumb na Voomp (M0 5/5 criadas, M1 8/8 atualizadas) | 13 thumbs subidas pra biblioteca de mídias Voomp | 16 vídeos publicados como Não listado no YouTube (canal Karol Senna) | Voomp não hospeda vídeo >80MB → YouTube não listado + Voomp Tube (decisão em log-decisoes 13/07). API Voomp mapeada: POST /media, POST lesson (create e update via POST /lesson/{id}), source = hex XOR 0x33 de {"url","theme","carryOn"}. Script: scripts/voomp-link-youtube.py. PENDENTE: M2 Aulas 1-2 (mapeamento ambíguo, ver config.yaml), demais módulos aguardam gravação. Incidente: 8 vídeos subidos por engano no canal pessoal Karoline Franzini — excluídos permanentemente, canal restaurado. |
| 2 | 2026-07-17 | Redesign das capas de módulo (legibilidade em miniatura) + diagnóstico de legenda/velocidade no player | 6 capas regeneradas (1920×1080, layout aprovado via mockup em Artifact) | 6 PNGs em assets/capas-modulos/ (M0 a M4 + Orientações) | — | Motivo: capas apareciam minúsculas (~224×126px) no dashboard da Voomp, número de fundo a 6% opacidade e label "Módulo X" ilegíveis nessa escala. Novo layout: número vira selo sólido laranja, label removido (redundante com o selo), nome do módulo maior e mais centralizado. Template atualizado em business/producao/expert360/assets/gerar-capas.py. Reupload das capas na Voomp ainda manual (sem script automatizado pra capa de módulo, só pra thumb de aula). Legenda/velocidade: Voomp Tube (player customizado sobre YouTube não listado) não expõe CC nem controle de velocidade — confirmado pela Karol testando ao vivo. Sem doc da central de ajuda da Voomp sobre o assunto. Pergunta enviada ao suporte da Voomp pela Karol (via WhatsApp +55 11 97821-3761) — aguardando resposta. |

---

**Instrucao:** Adicionar uma linha por missao concluida.
Formato de data: YYYY-MM-DD
