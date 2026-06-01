# Pipeline de Inteligência de Anúncios — Visão Geral

KB do Argus. O pipeline inteiro, de ponta a ponta.

---

## O que o squad entrega

Um **playbook estratégico** de o que anunciar — quais ângulos funcionam no nicho, quais hooks roubar, quais formatos dão resultado, o que evitar. Tudo baseado em dado real dos anúncios que os concorrentes já estão rodando no Meta.

Não é achismo. É engenharia reversa do que já está validado no mercado.

---

## As 3 fases

### Fase 1 — Achar Concorrentes (`competitor-research`)
- **Entra:** o nicho do expert + 2-3 concorrentes-semente
- **Faz:** pesquisa 10+ concorrentes via web search, pega os IDs corretos das páginas do Facebook via Apify, monta o banco
- **Sai:** tabela `Competitors` no Airtable — nome, logo, descrição, link do Ad Library funcionando, redes sociais, categoria
- **Tempo:** ~5 min

### Fase 2 — Scrapear os Anúncios (`scrape-ads`)
- **Entra:** a tabela `Competitors`
- **Faz:** scrapeia todos os anúncios ativos de cada concorrente no Meta Ad Library, baixa e transcreve os vídeos, classifica cada anúncio por ângulo e formato
- **Sai:** tabela `Ad Research` no Airtable — copy exata, hook, data de início, formato, classificação, thumbnail
- **Tempo:** ~10-15 min (30-90s por concorrente)

### Fase 3 — Gerar o Playbook (`ad-brief`)
- **Entra:** a tabela `Ad Research`
- **Faz:** lê todo o banco, calcula longevidade de cada anúncio, gera o relatório
- **Sai:** `research/briefs/ad-brief-{data}.md` — relatório de 8 seções
- **Tempo:** ~2-3 min

---

## A cola entre as fases

Cada fase gera um ID de tabela que a fase seguinte precisa. O Argus anota esses IDs na seção `Ad Research Config` do CLAUDE.md:
- Pós-Fase 1: `Competitors Table` + os `Niche Tiers` (nomes dos concorrentes)
- Pós-Fase 2: `Ad Research Table`

Sem essa cola, a fase seguinte não acha os dados. Isso é o trabalho de orquestração que justifica o squad.

---

## As 8 seções do brief

1. **Executive Summary** — 6 achados ancorados em dado
2. **Full Competitive Landscape** — quem gasta mais, ângulo × longevidade, formato × longevidade
3. **Direct Competitors** — concorrentes diretos: blue ocean ou red ocean?
4. **Adjacent Competitors** — mercados adjacentes + deep dives
5. **Aspirational Competitors** — playbook dos grandes anunciantes
6. **Per-Competitor Micro Briefs** — ângulo, formato e melhor anúncio de cada um
7. **Strategic Playbook** — o que criar primeiro, o que evitar, framework de teste
8. **Methodology** — definições

A Seção 7 é o coração — um time de criação consegue começar a produzir anúncio a partir dela.

---

## Refresh mensal

Rodar de novo uma vez por mês: `scrape-ads` (pega anúncios novos, marca os mortos) + `ad-brief` (relatório fresco). Cada brief é datado e salvo separado — com o tempo, vira um histórico de como o cenário competitivo muda.

---

## Onde o squad termina

O squad entrega o **playbook** — o que criar. Criar o anúncio em si (copy + criativo) é o passo seguinte, fora desse squad.
