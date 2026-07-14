# Course Publisher — Mission Log

> Historico de missoes executadas. Append-only — nunca remover entradas.
> Last Review: nunca

---

## LOG

| # | Data | Missao | Resultado | Assets Gerados | Videos Upados | Notas |
|---|------|--------|-----------|----------------|---------------|-------|
| 1 | 2026-07-13 | Publicar aulas Expert360 na Voomp (M0+M1+M2 parcial) | 13 aulas com vídeo+descrição+thumb na Voomp (M0 5/5 criadas, M1 8/8 atualizadas) | 13 thumbs subidas pra biblioteca de mídias Voomp | 16 vídeos publicados como Não listado no YouTube (canal Karol Senna) | Voomp não hospeda vídeo >80MB → YouTube não listado + Voomp Tube (decisão em log-decisoes 13/07). API Voomp mapeada: POST /media, POST lesson (create e update via POST /lesson/{id}), source = hex XOR 0x33 de {"url","theme","carryOn"}. Script: scripts/voomp-link-youtube.py. PENDENTE: M2 Aulas 1-2 (mapeamento ambíguo, ver config.yaml), demais módulos aguardam gravação. Incidente: 8 vídeos subidos por engano no canal pessoal Karoline Franzini — excluídos permanentemente, canal restaurado. |

---

**Instrucao:** Adicionar uma linha por missao concluida.
Formato de data: YYYY-MM-DD
