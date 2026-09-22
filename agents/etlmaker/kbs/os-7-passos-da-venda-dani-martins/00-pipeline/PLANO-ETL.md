# ETL Plan — Os 7 Passos da Venda — Dani Martins

## Contexto
- **Fonte:** Aula ao vivo "Os 7 Passos da Venda", transmitida em 04/02/2026 no Prosperus Club
- **Autor(es):** Dani Martins
- **Tipo:** transcricao de aula (video ao vivo, sem transcricao nativa — extraida via gravacao de audio + Whisper)
- **Localizacao:** `00-pipeline/sources/aula-7-passos-venda-normalized.md`

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Mapeamento Territorial
- [x] Fase 2: Composicao Blocada (1/1 volume)
- [x] Fase 3: Integracao
- [x] Fase 4: Validacao Final — **APPROVED**

## Log
- 22/09 — @composer: VOL-01-framework-completo.md composto (312 linhas, 8 tabelas, 49 referencias [Fonte:], 11 regras cardinais, 6 exemplos preservados). Spot-check: 10/10 claims corretos, 0 inventados. PASS.
- 22/09 — @architect: README.md, REGRAS-CARDINAIS.md, REPERTORIO.md (11 secoes), GLOSSARIO.md (16 termos) e completeness-report.yaml gerados. Cross-references verificadas, 0 quebradas. QG-ETL-004 PASS.
- 22/09 — @auditor: Camada 2 (auditoria exaustiva) encontrou 1 regra cardinal com fonte mal atribuida (citada como Passo 3, na verdade so existia no bloco de Q&A descartado) — corrigida (removida de REGRAS-CARDINAIS.md, marcada fora de escopo no MAPA). Tambem corrigido rotulo "N" nao sustentado pela fonte na tabela SPIN do VOL-01. Camada 2: PASS apos correcoes. Camada 3 (6-passes): score agregado 99.2%, fidelidade 100% (15/15), 0 invencoes. **Verdict: APPROVED**. QG-ETL-005 PASS.

## KB Concluida
Pipeline completo. 1 volume, 4 docs transversais, validacao APPROVED (99.2%). KB pronta para uso em `agents/etlmaker/kbs/os-7-passos-da-venda-dani-martins/`.

## Decisoes Chave
- Modo: Full Pipeline
- Fonte unica (1 aula), sem material de suporte adicional
- Aquisicao do audio exigiu contorno tecnico: pagina do curso nao expunha transcricao nem URL de video acessivel (token assinado); expert gravou a sessao com OBS Studio e o Chief rodou Whisper (modelo small, pt-BR) localmente para gerar a transcricao
- Plano de volumes aprovado em 22/09/2026: **1 volume apenas** (VOL-01 — Framework completo dos 7 Passos). O bloco de Q&A da turma (proposto como VOL-02) foi descartado a pedido do expert — nao entra na KB composta, fica so na fonte normalizada

## Regras de Operacao
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invencao
- ZERO perda de conhecimento
