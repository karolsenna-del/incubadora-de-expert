# ETL Plan — Stories 10x (Leandro Ladeira)

## Contexto
- **Fonte:** Curso Stories 10x na Hotmart (Big Black Friday Infinita)
- **Autor:** Leandro Ladeira
- **Tipo:** Curso em vídeo — legendas extraídas via browser automation
- **Localização:** https://hotmart.com/pt-br/club/blackfridayinfinita/products/4594918
- **Trilha principal:** Curso | Stories 10x (track: n2OM6Yqx46)
- **Total aulas:** 19 vídeos + outros conteúdos nas trilhas auxiliares

## Status
- [x] Fase 0: Setup
- [x] Fase 1: Ingestão de fontes ✅ (19/19 aulas extraídas — 19/05/2026)
- [x] Fase 2: Composição Blocada ✅ (4/4 volumes — 19/05/2026)
  - [x] VOL-01: Filosofia e Fundamentos (~350 linhas, spot-check 10/10 PASS)
  - [x] VOL-02: Temas, Sequências e App (~500 linhas, spot-check 10/10 PASS)
  - [x] VOL-03: Os 37 Dispositivos (~900 linhas, spot-check 10/10 PASS)
  - [x] VOL-04: Execução, Crescimento e Vendas (~400 linhas, spot-check 10/10 PASS)
- [x] Fase 3: Integração ✅ (README, REGRAS-CARDINAIS, REPERTÓRIO, GLOSSÁRIO — 19/05/2026)
- [x] Fase 4: Validação Final ✅ APPROVED — Score 98.64% (19/05/2026)
  - Camada 2: PASS (6/6 frameworks, 12/12 RCs, 23/23 termos, 9/9 artefatos, 0 contradições)
  - Camada 3: PASS (Coverage 97.2%, Fidelidade 100%, Riqueza 100%, Voz 92%, Consistência 100%, Integridade 100%)
  - Zero invenções | QG-ETL-005 APROVADO

## ⚠️ Bloqueio: CDN Rate Limiting — DIAGNÓSTICO COMPLETO

**Sessão 19/05/2026 — tentativa 1 (falhou):**
- Fetch paralelo acionou rate limit. Aulas 03 e 04 ficaram parciais.

**Sessão 19/05/2026 — tentativa 2 (diagnóstico):**
- Player pré-carrega: segs 1–6 (início) e 172–214 (fim) da aula 03
- Total aula 03: 214 segmentos. Em cache: 49. Faltando: segs 7–171 (165 segs)
- JS fetch a 150ms acionou 403 no seg 7. Player parou de carregar segs 10–171 após interferência
- `force-cache` só lê o que está no cache — funciona sem rate limit, mas pega apenas o que o player já buscou
- O player NÃO busca os segmentos intermediários automaticamente (só início + fim)

**Causa raiz:** O player Hotmart pré-carrega início+fim para navegação, mas carrega o meio apenas ao REPRODUZIR o vídeo.

**Plano corrigido para próxima sessão:**
1. Navegar para a aula (player carrega 1–6 e final automaticamente)
2. **Fazer o vídeo reproduzir** via JS: `document.querySelector('video').play()`
3. Aguardar buffering completo (~duração da aula em tempo real, ou acelerar com `video.playbackRate = 16`)
4. Após todos os segmentos carregados → usar `force-cache` sem network requests
5. Repetir para cada aula

**Alternativa (mais rápida):** Fetch sequencial com delay 1000ms por segmento
- 165 segs faltando × 1000ms = ~2min 45s (aceitável)
- Implementar retry com backoff exponencial em caso de 403

## Mapa de Aulas — Trilha Principal

### Módulo 01 — Estratégia
| # | Título | Duração | Content ID | Status |
|---|--------|---------|------------|--------|
| 01 | Boas-vindas | 03:46 | a4R0DEP17n | ✅ 100% |
| 02 | O que é o S10X | 04:36 | 3eaAgzDDeg | ✅ 100% |
| 03 | Por que é tão mais eficiente | 21:30 | V4VdxZg972 | ⚠️ 54% parcial |
| 04 | A visão geral do método | 12:00 | ROxkvbzb7D | ⚠️ 35% parcial |

### Módulo 02 — Táticas
| # | Título | Duração | Content ID | Status |
|---|--------|---------|------------|--------|
| 05 | Cadastrando produtos e serviços | 10:00 | Z72Bv3Wy7N | ⏳ |
| 06 | Cadastrando parceiros | 04:47 | R4jzpB3w4a | ⏳ |
| 07 | Ideias fortes e infinitas | 19:05 | y4PPvqAL4x | ⏳ |
| 08 | Super sequências | 25:39 | k45DaNvoOl | ⏳ |

### Módulo 03 — Técnica (Dispositivos de Engenharia Social)
| # | Título | Duração | Content ID | Status |
|---|--------|---------|------------|--------|
| 09 | A lógica das sequências | 29:11 | LO02q1nBeG | ⏳ |
| 10 | Como utilizar os dispositivos no App S10x | 32:17 | BOnkvaJ54R | ⏳ |
| 11 | Dispositivos de Engenharia Social - Parte 1 (1 ao 10) | 48:44 | RO9x8yQ37P | ⏳ |
| 12 | Dispositivos de Engenharia Social - Parte 2 (11 ao 20) | 01:12:40 | m7YZljJzO6 | ⏳ |
| 13 | Dispositivos de Engenharia Social - Parte 3 (21 ao 30) | 48:13 | 14oYRQJZ7p | ⏳ |
| 14 | Dispositivos de Engenharia Social - Parte 4 (31 ao 37) | 33:33 | YOmzB3JQ4d | ⏳ |
| 15 | Criando as sequências | 21:50 | V73vRZw3e3 | ⏳ |

### Módulo 04 — Onde a mágica acontece
| # | Título | Duração | Content ID | Status |
|---|--------|---------|------------|--------|
| 16 | Debriefing (Análise de Resultados) | 05:46 | V4VdxZJ972 | ⏳ |
| 17 | Crescimento de seguidores (Impulsionamento) | 15:17 | r48VxPaD7R | ⏳ |
| 18 | Inbox lucrativo (Direct) | 19:17 | M7qWaxmj4x | ⏳ |
| 19 | Considerações finais | 11:29 | 2OMP1V3976 | ⏳ |

## Decisões Chave
- Extração via browser automation (Playwright) — legendas PT-BR do player Hotmart
- Token hdntl gerado por sessão (expira ~24h). Novo token a cada nova sessão logada
- Deduplicação por texto consecutivo idêntico (não por timestamp)
- Transcrições salvas em: 00-pipeline/sources/transcricoes/
- Aula 03 tem 214 segmentos VTT (confirmado). URL padrão: `QZPb3n9xqw-1748522396000-textstream_pt_br=1000-{N}.webvtt`
- Video ID por Content ID: V4VdxZg972 → QZPb3n9xqw | ROxkvbzb7D → DZmw8Vjyqz

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção — texto vem 100% das transcrições
- ZERO perda de conhecimento
- Após extrair todas as transcrições → iniciar mapeamento territorial

## Progresso de Extração
- 19/05/2026 (sessão 1): Aulas 01 e 02 extraídas 100%
- 19/05/2026 (sessão 1): Aulas 03 e 04 parciais — rate limit CDN
- 19/05/2026 (sessão 2): Diagnóstico do rate limit. Plano corrigido.
- 19/05/2026 (sessão 3): **COMPLETO** — 19/19 aulas extraídas via playerFrame 16x + dedup VTT
  - Método final: Playwright iframe frame.evaluate() + play 16x + force-cache + dedup por overlap
  - Aula 03: extraída ~98% (segs 2-14 ausentes = ~84s de intro)
  - Aulas 01, 02, 04-19: 100% extraídas
