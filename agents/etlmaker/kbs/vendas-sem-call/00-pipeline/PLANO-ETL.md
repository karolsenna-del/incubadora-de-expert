# ETL Plan — Vendas Sem Call (Priscila Espinoza)

## Contexto
- **Fonte:** Kit "Venda Sem Call — Kit de 30+ Scripts para vender sem sessão estratégica" (página pública do Notion)
- **URL:** https://priscilaespinoza.notion.site/Venda-Sem-Call-Kit-de-30-Scripts-para-vender-sem-sess-o-estrat-gica-3a5435f0c11181199128c22d9f99e5e5
- **Autor(es):** Priscila Espinoza (@priscilaespinozza · Escola de Negócios Anti-Burnout)
- **Tipo:** compilado (página principal + 4 módulos de scripts + 2 bônus)
- **Localização:** `00-pipeline/sources/` (7 arquivos, extraídos via Playwright em 03/10/2026)

## Objetivo final
KB fiel ao método → base para um **agente de IA de uso próprio da Karol** (criado depois via /worker-forge), que aplica o método **adaptado à Incubadora de Expert** (persona Laura, ofertas da Karol, tom dela).

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Mapeamento Territorial
- [x] Fase 2: Composição Blocada (2/2 volumes)
- [x] Fase 3: Integração
- [x] Fase 4: Validação Final — **APPROVED**

## Log
- 03/10 — @etl-chief: setup; 8 páginas extraídas do Notion via Playwright (toggles expandidos). 7 entram como fonte.
- 03/10 — @analyst: MAPA-TERRITORIAL.md gerado (8 domínios, backbone do autor = 5 etapas).
- 03/10 — Karol aprovou plano de 2 volumes (QG-ETL-002).
- 03/10 — @composer: VOL-01 (454 linhas, 53 [Fonte:]). Spot-check automatizado: 57/67 trechos citados batem literalmente; os 10 restantes eram ruído do verificador (células de tabela, aspas trocadas) + 2 paráfrases em cruzamentos → corrigidas para texto literal. 41/41 scripts e 5/5 prompts literais. PASS.
- 03/10 — @composer: VOL-02 (402 linhas, 53 [Fonte:]). Spot-check: 62/68 literais; os 6 restantes são notas de extração do próprio composer (sinalizadas). 12/12 scripts dos 5 tipos + 8/8 prompts literais. PASS.
- 03/10 — @architect: README, REGRAS-CARDINAIS (4 princípios + 20 regras), REPERTORIO (roteador situação→script, 13 prompts, campos de contexto), GLOSSARIO (20 termos). Cross-refs §-a-§ conferidas contra os headers dos volumes. Contagem de scripts do VOL-02 corrigida (13→12). QG-ETL-004 PASS.
- 03/10 — @auditor: Camada 2 — 0 invenções; 2 inferências sinalizadas no próprio texto (etiquetas do checklist semanal cujos ícones não vieram no Notion; "sumache?" lido como "sumiu?"); 1 nota de coerência adicionada (Script 28 vs. proibição "vi que não respondeu"). Cobertura: todo script, prompt, checklist e tabela das 7 fontes está composto. **Verdict: APPROVED.** QG-ETL-005 PASS.

## KB Concluída
2 volumes + 3 transversais em `agents/etlmaker/kbs/vendas-sem-call/`. Próximo passo: /worker-forge cria o agente "venda sem call" de uso próprio, adaptado à Incubadora (persona Laura, masculino genérico, ofertas e preços vigentes da Karol), usando REPERTORIO §4 como lista de campos de contexto.

## Decisões Chave
- **03/10 — Uso próprio, adaptado à Incubadora** (decisão da Karol). Material é de terceiro (produto pago da Priscila, que vende o próprio "Agente de IA treinado do método Vendas Sem Call"). Agente NÃO deve ser distribuído a alunos com os scripts dela.
- **03/10 — Página "Fluxo de Ascensão" EXCLUÍDA das fontes.** É documento operacional interno da empresa da Priscila (produtos Liberté/Sprint/PNA, nomes da equipe, metas do time). Não é método reaproveitável. Bruto fica só em `.playwright-mcp/vsc/07-fluxo-ascensao.md` (não versionado).
- **03/10 — KB fica fiel à fonte (zero invenção).** A adaptação à Incubadora acontece na camada do agente (Worker Forge), não na KB.
- **03/10 — Escopo compacto:** fonte total ~1.000 linhas → 2 volumes (precedente: KB Dani Martins, 1 volume).
- CTAs de venda da Priscila (voucher ALUNA, Aceleração Escala Anti-Burnout, link do agente dela) ficam fora da KB composta.

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção
- ZERO perda de conhecimento
