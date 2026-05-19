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
- [ ] Fase 1: Ingestão de fontes (4/19 aulas — 2 completas, 2 parciais)
- [ ] Fase 2: Composição Blocada (0/N volumes)
- [ ] Fase 3: Integração
- [ ] Fase 4: Validação Final

## ⚠️ Bloqueio: CDN Rate Limiting
**Problema:** Requisição paralela acidental na sessão de 19/05/2026 acionou rate limit do CDN Akamai da Hotmart. Requests JS subsequentes bloqueados por período indeterminado (estimado 30-60min).

**Impacto:** Aulas com mais de ~3 minutos ficaram com transcrição parcial (apenas segmentos já cacheados pelo player, ~18 segs = ~1:48 de conteúdo).

**Solução para próxima sessão:**
1. Abrir NOVA sessão (CDN rate limit resetado)
2. Navegar para cada aula
3. Esperar player pre-fetch os VTTs (auto, com subtítulo PT-BR ativo)
4. Usar `force-cache` fetch — NÃO usar fetch paralelo
5. Máx 1 request a cada 100ms (rate limit seguro)

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
- Token hdntl: exp=1779242101 (válido por toda a sessão)
- Deduplicação por timestamp (ms) + remoção de consecutivos idênticos
- Transcrições salvas em: 00-pipeline/sources/transcricoes/

## Regras de Operação
- RELER ESTE PLANO a cada autocompact
- QUALIDADE > VELOCIDADE
- ZERO invenção — texto vem 100% das transcrições
- ZERO perda de conhecimento
- Após extrair todas as transcrições → iniciar mapeamento territorial

## Progresso de Extração
- 19/05/2026: Aulas 01 e 02 extraídas 100% (legendas PT-BR via browser automation)
- 19/05/2026: Aulas 03 e 04 parciais (54% e 35%) — rate limit CDN acionado por fetch paralelo
- 19/05/2026: 15 aulas restantes aguardam nova sessão sem rate limit
