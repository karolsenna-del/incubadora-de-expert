# ETL Plan — Ângulos de Copy para Anúncios (Renan Matheus, @renanmsap)

## Contexto
- **Fonte:** produto "Biblioteca de Ângulos de Copy para Anúncios" (Kiwify, área de membros) — 7 aulas em vídeo + planilha de 78 ângulos + bônus (bibliotecas de Provas e Objeções, docs de Mecanismo, Método FORJA, Processo de 6 etapas, Briefing Estratégico)
- **Autor:** Renan Matheus (@renanmsap)
- **Tipo:** curso em vídeo (transcrições) + planilhas + documentos
- **Localização:** `00-pipeline/sources/` (manifesto em `ingestion-manifest.yaml`)
- **Objetivo da expert:** usar os diversos ângulos como base para criar copys (anúncios) das ofertas da Karol.

## Status
- [x] Fase 0: Setup
- [x] Ingestão (QG-ETL-000 PASS — 14 fontes, ~74,8 mil palavras)
- [x] Fase 1: Mapeamento Territorial — MAPA pronto (QG-ETL-001 PASS). Plano de 8 volumes APROVADO pela Karol em 17/10 (QG-ETL-002)
- [x] Fase 2: Composição Blocada (8/8 volumes) — QG-ETL-003 PASS
  - [x] VOL-01 Fundamentos — 541 linhas, 82 [Fonte:], 15 tabelas. Spot-check PASS (10 claims: 8 corretos, 2 citações ajustadas à letra da fonte, 0 inventados)
  - [x] VOL-02 Catálogo I (Problema+Solução) — 791 linhas, 118 [Fonte:], 38 ângulos com texto literal da planilha (gerado por script) + notas das aulas. Spot-check PASS
  - [x] VOL-03 Catálogo II (Produto+Oferta+Genéricos) — 771 linhas, 107 [Fonte:], 40 ângulos. Spot-check PASS
  - [x] VOL-04 Anatomia do anúncio — 439 linhas, 76 [Fonte:], 18 tabelas. Spot-check PASS (1 citação ajustada; nota de leitura sobre "quanto mais inconsciente, menor o anúncio")
  - [x] VOL-05 Provas e objeções — 355 linhas, 17 tabelas; 34 provas + 24 objeções literais das planilhas (script) + orientação das aulas + mapa objeção→prova→onde. Spot-check PASS
  - [x] VOL-06 Mecanismo único — 435 linhas, 46 [Fonte:]; 10 tipos e FORJA com texto integral dos documentos (script) + aula de mecanismo. Spot-check PASS
  - [x] VOL-07 Formatos e ganchos — 401 linhas, 68 [Fonte:], 13 tabelas; alertas sobre "notícia falsa" e foto de pessoa pública. Spot-check PASS
  - [x] VOL-08 Máquina de produção, campanha e métricas — 562 linhas, 66 [Fonte:], 13 tabelas; briefing de 11 seções integral (script); contradição testar × nunca desativar registrada. Spot-check PASS
- [x] Fase 3: Integração — README, REGRAS-CARDINAIS (15), REPERTORIO (11 seções), GLOSSARIO (47 termos), completeness-report. 0 links quebrados. QG-ETL-004 PASS
- [x] Fase 4: Validação Final — Camada 2 PASS (100% frameworks, regras, termos, artefatos após 3 ajustes); Camada 3: 950 citações conferidas contra as fontes, 12 ajustadas à letra, 0 invenções; score agregado 98,0%

**KB CONCLUÍDA — Verdict: APPROVED**

## Decisões Chave
- Modo Full Pipeline (KB do zero), inferido do pedido "fazer ETL desse produto para criar copys seguindo esses diversos ângulos".
- Transcrições pela legenda nativa do player Kiwify (sem Whisper). Texto bruto: tem cortes da legenda automática em alguns trechos (ex.: aula 02 ~07:00, aula 03 ~02:06).
- Aulas 05, 06 e 07 são aulas longas ("Clube de Anúncios"): entram como fonte. Links de checkout ficaram de fora.
- Aula 04 é upsell (biblioteca de formatos, ganchos, roteiros, Swiper): entra só como suporte e registro de gap (essas bibliotecas não fazem parte do produto).

- 17/10: notas de leitura com timestamps em `00-pipeline/NOTAS-LEITURA.md` (documento de trabalho para retomada).
- 7 contradições do autor registradas no MAPA §10 (80/20 da copy, ângulo copy×tráfego, testar×nunca desativar etc.): a KB vai mostrar as duas posições, sem resolver.

- 17/10: repositório GitHub é PÚBLICO → por decisão da Karol, `00-pipeline/sources/` (transcrições, planilhas e docs do curso pago) fica só local, no .gitignore. Sobem plano, mapa, notas e (depois) os volumes.
- KB concluída em 17/10. Próximo passo possível (fora do ETL): usar a KB para escrever copy das ofertas da Incubadora, ou criar um agente a partir dela.

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
