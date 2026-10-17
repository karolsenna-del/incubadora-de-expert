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
- [ ] Fase 2: Composição Blocada (0/8 volumes)
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação Final

## Decisões Chave
- Modo Full Pipeline (KB do zero), inferido do pedido "fazer ETL desse produto para criar copys seguindo esses diversos ângulos".
- Transcrições pela legenda nativa do player Kiwify (sem Whisper). Texto bruto: tem cortes da legenda automática em alguns trechos (ex.: aula 02 ~07:00, aula 03 ~02:06).
- Aulas 05, 06 e 07 são aulas longas ("Clube de Anúncios"): entram como fonte. Links de checkout ficaram de fora.
- Aula 04 é upsell (biblioteca de formatos, ganchos, roteiros, Swiper): entra só como suporte e registro de gap (essas bibliotecas não fazem parte do produto).

- 17/10: notas de leitura com timestamps em `00-pipeline/NOTAS-LEITURA.md` (documento de trabalho para retomada).
- 7 contradições do autor registradas no MAPA §10 (80/20 da copy, ângulo copy×tráfego, testar×nunca desativar etc.): a KB vai mostrar as duas posições, sem resolver.

- 17/10: repositório GitHub é PÚBLICO → por decisão da Karol, `00-pipeline/sources/` (transcrições, planilhas e docs do curso pago) fica só local, no .gitignore. Sobem plano, mapa, notas e (depois) os volumes.
- Próximo passo: compor VOL-01 (Fundamentos).

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
