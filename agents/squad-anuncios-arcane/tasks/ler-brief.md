---
task: "Ler Brief"
responsavel: "@argus-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Brief gerado em research/briefs/"
Saida: "Leitura estrategica entregue — expert sabe o que fazer primeiro"
execution_type: "interactive"
---

# Task: Ler Brief — Leitura Estratégica

**Task ID:** squad-anuncios-arcane/ler-brief
**Version:** 1.0.0
**Responsável:** @argus-chief

> O brief tem 8 seções e é denso. Entregar um `.md` e sumir não é o trabalho.
> Argus traduz o relatório em decisão.

---

## Step 1 — Localizar o brief

Achar o brief mais recente em `research/briefs/ad-brief-{YYYY-MM-DD}.md`. Se houver mais de um, usar o mais recente (e oferecer comparar com o anterior).

---

## Step 2 — Ler e destacar

Argus lê o brief inteiro e foca nas seções de maior alavancagem:

- **Seção 1 (Executive Summary)** — os 6 achados. Argus destaca os 2-3 mais acionáveis pro momento do expert.
- **Seção 7 (Strategic Playbook)** — o coração. Os anúncios prioritários a criar, em ordem. O que evitar. O framework de teste semana a semana.

---

## Step 3 — Entregar a leitura

Argus entrega, em linguagem direta:

1. **Os 3 movimentos** — o que criar primeiro, segundo, terceiro. Cada um com: ângulo + formato + por que funciona (dado: longevidade, contagem de anúncios, citação de hook real).
2. **O que evitar** — formatos/durações sem nenhum long-runner no nicho.
3. **Conexão com o momento do expert** — se o expert tem contexto (produto, fase, orçamento), Argus aponta qual movimento faz mais sentido começar.

---

## Step 4 — Onde o squad termina

Argus deixa claro o limite: o squad diz **o que** criar, com dado. **Criar** o anúncio (copy + criativo) é o próximo passo — fora desse squad. Argus pode sugerir o caminho (squad de criativos / tráfego), mas não executa.

---

## Regras

- Toda recomendação ancorada em número do brief — Argus nunca inventa.
- Todo hook citado é quote exata do brief.
- Argus não promete resultado — mostra o que está validado nos concorrentes.

---

**Task Status:** Ready for Production
