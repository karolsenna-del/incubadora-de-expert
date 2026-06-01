---
task: "Rodar Pipeline"
responsavel: "@vera-pesquisa"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Expert no estagio CONFIGURADO — quer rodar o pipeline (handoff do Argus)"
Saida: "As 3 fases executadas em sequencia, brief gerado em research/briefs/, controle devolvido ao Argus"
execution_type: "interactive"
---

# Task: Rodar Pipeline — As 3 Fases de Inteligência

**Task ID:** squad-anuncios-arcane/rodar-pipeline
**Version:** 2.0.0
**Responsável:** @vera-pesquisa

> O pipeline é linear. A Vera conduz fase a fase, confirma o pré-requisito
> antes de cada uma, e executa a "cola" (`atualizar-config`) depois de cada fase.

---

## Pré-checagem (QG-SAA-001)

Antes de começar, a Vera confirma que o setup está pronto:
- MCPs `airtable` e `apify` conectados
- 3 skills do pipeline instaladas em `.claude/skills/`
- Seção `Ad Research Config` no CLAUDE.md com o base ID

Se faltar algo → a Vera devolve pro Argus, que encaminha pra `@nina-setup`. Não rodar o pipeline sem setup.

---

## Fase 1 — Achar Concorrentes

**Pré-requisito:** setup pronto.

1. A Vera pergunta ao expert: **qual o nicho** e **2-3 concorrentes** que ele já conhece (lista-semente).
2. A Vera invoca a skill **`competitor-research`** (ferramenta Skill). A skill assume, conversa com o expert, cria a tabela `Competitors` no Airtable e a popula.
3. Quando a skill termina, ela informa o **Competitors Table ID**.

**Gate QG-SAA-002:** a tabela `Competitors` precisa existir com 1+ concorrente com `Facebook Page ID`.

→ A Vera executa a task `atualizar-config` (anota o Competitors Table ID + preenche os Niche Tiers com os nomes reais dos concorrentes achados).

---

## Fase 2 — Scrapear os Anúncios

**Pré-requisito:** Fase 1 concluída, Competitors Table ID no CLAUDE.md.

1. A Vera invoca a skill **`scrape-ads`**. A skill lê a tabela `Competitors`, scrapeia os anúncios ativos de cada concorrente no Meta Ad Library, baixa/transcreve vídeos (se Whisper configurado), classifica ângulo e formato, e cria a tabela `Ad Research`.
2. Quando termina, informa o **Ad Research Table ID**.

**Gate QG-SAA-003:** a tabela `Ad Research` precisa existir com anúncios.

→ A Vera executa `atualizar-config` (anota o Ad Research Table ID).

> Fase 2 é a mais demorada (~10-15 min). A Vera avisa o expert antes de começar.

---

## Fase 3 — Gerar o Playbook

**Pré-requisito:** Fase 2 concluída, Ad Research Table ID no CLAUDE.md.

1. A Vera invoca a skill **`ad-brief`**. A skill lê todo o banco de anúncios e gera o relatório de 8 seções.
2. O brief é salvo em `research/briefs/ad-brief-{YYYY-MM-DD}.md`.

**Gate QG-SAA-004:** brief gerado com toda afirmação ancorada em número.

→ A Vera **devolve o controle pro Argus**, que faz a leitura estratégica do brief (task `ler-brief`).

---

## Modo Refresh

Quando o pipeline já rodou antes e o expert quer atualizar:
- Pular a Fase 1 (concorrentes já estão no banco — só re-rodar a Fase 1 se quiser ADICIONAR concorrentes novos)
- Rodar Fase 2 (`scrape-ads` deduplica sozinho — pega anúncios novos, marca os mortos como inativos)
- Rodar Fase 3 (`ad-brief` — relatório fresco, datado, salvo separado)
- A Vera oferece comparar com o brief anterior

---

## Resumo final + devolução

Ao fim das 3 fases, a Vera imprime:
```
✅ Pipeline completo.
   Fase 1 — {N} concorrentes no banco
   Fase 2 — {N} anúncios scrapeados
   Fase 3 — brief salvo em research/briefs/ad-brief-{data}.md

🤝 Te devolvo pro Argus — ele lê o relatório com você.
```

E devolve o controle pro `@argus-chief`.

---

**Task Status:** Ready for Production
