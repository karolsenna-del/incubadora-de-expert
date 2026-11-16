# Correção do pipeline de Stories — 15/11/2026

- [x] Base remota conferida: b3cd60595f3f03e2c0f8a78f5daa9071cb80a5ab; trabalho em worktree isolada.
- [x] Inspecionados `.github/scripts/publicar_story.py`, workflow e fila real em `business/instagram/stories/{fila,agendados}`.
- [x] Mantidos input opcional `slug` → `STORY_SLUG`, validação de filho direto sem links, seleção exclusiva pelo sufixo `-YYYY-MM-DD` em America/Cuiaba, vazio sem publicação e ambiguidade ordenada com erro.
- [x] Mantidos concurrency global estável, cancel-in-progress false, checkout master com fetch-depth 0.
- [x] Reserva persistida: pasta sai da fila para `em-processamento` antes de qualquer efeito externo. Falha na reserva impede chamadas externas. Falha posterior exige reconciliação manual; não existe retorno automático à fila nem retry de publicação.
- [x] Persistência Git tenta fetch/rebase/push no máximo três vezes. Conflito aborta explicitamente. Erro não é ocultado.
- [x] Cada ID retornado pela publicação é registrado imediatamente em stdout e recibo JSON atômico; artifact sempre executado, inclusive em falhas. Não contém credenciais. Se a API aceitar mas não devolver resposta, ID fica desconhecido; reserva impede republicação automática mesmo nesse caso.
- [x] RED: `python -m unittest discover -s tests -p 'test_*.py'`: 13 testes, cinco erros esperados por ausência das novas funções/constantes (sync_master, record_receipt, reserve_story/PROCESSING_DIR). Executado antes da implementação.
- [x] GREEN: mesmo comando: 16 testes aprovados. Focada: `python -m unittest discover -s tests -p 'test_publicar_story.py'` (7 inicialmente; 10 após ampliação).
- [x] `node --test tests/expert-stories-*.test.mjs`: dois arquivos aprovados.
- [x] Suíte Node geral: `node --test tests/*.test.mjs tests/*.test.cjs`, executada fora da restrição de spawn: 17 aprovados, dois falharam, um pulado. Falhas alheias à mudança: installer sem fs-extra instalado; sync-codex espera nove skills, catálogo atual tem 44. Nenhum desses arquivos foi alterado.
- [x] Lint disponível: `python -m py_compile .github/scripts/*.py tests/test_*.py`, `git diff --check`, `yaml.safe_load` do workflow. Sem yamllint instalado; YAML analisado com PyYAML.
- [x] Histórico recuperado sem execução: API `GET /repos/karolsenna-del/incubadora-de-expert/actions/workflows/instagram-stories-scheduler.yml/runs?per_page=100`; logs autenticados via GitHub CLI já instalado no Windows (gh não existe no PATH Linux). API pública de logs devolveu 403; CLI com login existente leu normalmente.

## Evidência histórica

Run do slug: https://github.com/karolsenna-del/incubadora-de-expert/actions/runs/40925465617 — 29/10/2026 17:52:31 UTC. Logs contêm `expert360-quinta-2026-10-29`, `18133064761748400` e `fd0b801`. Commit de consumo: fd0b801dfcf8e10a8662218b7a6c880f45630b10.

O commit b3cd605 é posterior: publicou `individual-domingo-2026-11-15`, e já inclui o estado consumido de outubro. Run correspondente: https://github.com/karolsenna-del/incubadora-de-expert/actions/runs/43752326019.

Estado histórico preservado: slug ausente de fila e presente em agendados; linha do registro de 29/10 associa media ID 18133064761748400. Não houve chamada à Meta, dispatch, rerun ou publicação nesta correção.
