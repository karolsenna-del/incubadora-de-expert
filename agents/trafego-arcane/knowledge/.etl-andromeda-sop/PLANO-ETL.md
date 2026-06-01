# ETL Plan — SOP Subir Campanha Andromeda (UI + API) — FINAL

## Contexto
- **Solicitante:** Euriler Jube
- **Briefing:** pré-aprovado, escopo restrito
- **Fonte primária:** transcrições do Método Andromeda (Bárbara Bruna)
- **Output:** 3 arquivos em `squads/trafego-arcane/knowledge/`
- **Padrão de qualidade:** fidelidade > completude. Zero invenções.

## Status Pipeline ✅ FINALIZADO

- [x] Fase 0: Setup
- [x] Fase 1: Mapeamento Territorial — 4 fontes lidas integralmente
  - [x] `03-arquitetura-campanhas-escala.md` (6.311w) — backbone primário
  - [x] `04-arquitetura-campanhas-teste.md` (8.176w) — divergências
  - [x] `09-perguntas-respostas-estrutura.md` (19.626w) — Q&A, lida em 6 chunks
  - [x] `05-arquitetura-dos-publicos.md` (4.108w) — profundidade públicos
  - Aulas 06/07/08 (anatomia interna C1/C2/C3) — fora do escopo
  - Aula 02-iniciantes/02 — fora do escopo (overlap com 03)
  - Aula 06-otim/02 — fora do escopo (otimização avançada — outro SOP)
- [x] Fase 2: Composição Blocada
  - [x] `sop-campanha-ui.md` (~580 linhas)
  - [x] `sop-campanha-api.md` (~700 linhas)
  - [x] `sop-campanha-mapping.md` (~250 linhas)
- [x] Fase 3: Integração — cross-links entre os 3 docs OK
- [x] Fase 4: Validação Final — auditoria interna OK

## Resultado Final

### Output entregue

| Arquivo | Linhas | Propósito |
|---------|--------|-----------|
| `knowledge/sop-campanha-ui.md` | ~580 | Trilha A — humano no Gerenciador |
| `knowledge/sop-campanha-api.md` | ~700 | Trilha B — Graph Marketing API REST |
| `knowledge/sop-campanha-mapping.md` | ~250 | Tabela cruzada UI ↔ API |

### Cobertura por seção

**Coberto integralmente:**
- 3 níveis (Campanha → Conjunto → Anúncio)
- 6 conjuntos da escala (1 puro + 4 sugestões + 1 quente)
- ABO vs CBO + Partilha 20% + bug com CPA/ROAS
- Otimização (Maximizar nº vs valor)
- CPA Máximo / ROAS Mínimo
- Pixel + evento
- Audiência quente (4 públicos com janelas exatas)
- Posicionamentos (Advantage+ default)
- Recursos automáticos do anúncio (geração imagem, 5 textos, etc.)
- CTA obrigatória
- Anti-patterns
- Checklists de subida
- Sequência de troubleshoot pós-subida
- Diagnóstico "gastou zero"
- Aumento de orçamento (20-50%/dia)
- Cronograma de baixa verba
- Hipersegmentação
- Limitação a nível de conta (negócios locais)
- Lookalike (caminhando pra aposentado)
- Públicos de exclusão
- Regras automáticas
- Teste A/B nativo (recurso "Teste de conteúdos de criativos")

**Marcado como `[NÃO COBERTO PELO MÉTODO]`:**
- Categoria especial de anúncio (config legal Meta — fora do escopo educacional)
- Configuração detalhada da CAPI / Conversions API
- Padrões UTM exatos (tema separado)
- Detalhes da janela de atribuição (1d-click, 7d-click) — Bárbara diz "padrão"
- Anatomia interna C1/C2/C3 (delegado às aulas 06/07/08)
- Configurações de Advantage+ Shopping Campaigns

### Distinção entre Fonte Andromeda e Fonte Meta API

Os SOPs distinguem:
- **Decisões estratégicas (do método)**: SEMPRE com citação literal da Bárbara + path da aula
- **Endpoints/campos da API (Meta REST)**: tratados como fato técnico independente — não inventados pela Bárbara, vêm do Graph Marketing API. Marcados como referência neutra.

## Pegadinhas Críticas Documentadas

1. **Partilha de Orçamento bloqueia CPA Máximo / ROAS Mínimo** — desativar partilha pra liberar campos
2. **Advantage+ Audience ativo desativa quando você impõe filtro rígido** (sugestão NÃO desativa, filtro rígido SIM)
3. **Conjunto rodando bem ≠ subir anúncio novo** — caça confusão
4. **Conta nova trava por padrão (~70% causa "gastou zero")** — abrir ticket Meta
5. **Aumento orçamento: 20-50%/dia, NÃO esperar 3 dias** (mito que Bárbara explicitamente desmente)
6. **Pixel mal instalado: testar com campanha de Interação (que não usa pixel) com R$10-20**

## Observações para Euriler

1. **MCP Meta oficial não está instalado no Auroq** — SOP API usa endpoints REST diretos como contrato base. Avisado no topo do `sop-campanha-api.md`.
2. **Aulas 06/07/08 (anatomia interna anúncios C1/C2/C3) ficaram fora** — foco do briefing era SUBIR campanha, não compor o conteúdo do anúncio. Se quiser SOP de anúncio, é outra rodada do ETLmaker.
3. **Live Black descartada** (briefing já indicava que era live de vendas, sem orientação técnica).
4. **Conta Teste vs Conta Escala** num único fluxo, com tags `[ESCALA]` e `[TESTE]` apenas onde diverge — conforme briefing.

## Regras de Operação Cumpridas

- ✅ Zero invenção
- ✅ Toda recomendação carrega citação literal + path da aula
- ✅ Distinção clara "ela diz pra fazer X" vs "ela menciona X mas avisa contra"
- ✅ `[NÃO COBERTO]` marcado onde aplicável
- ✅ Conta Teste vs Escala separadas onde divergem
