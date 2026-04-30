---
task: "Research Tool"
responsavel: "@lp-dash-engineer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Duvida ou necessidade de pesquisa"
Saida: "Informacao pesquisada e sintetizada"
execution_type: "semantic"
---

# Task: Research Tool — Pesquisa Tecnica

## Objetivo

Pesquisar informacao sobre Vercel, Meta Ads API, Supabase client-side, dashboard frontend ou qualquer topico relevante.

## Trigger

`*research` ou qualquer pergunta tecnica.

## Protocolo

1. Identificar o que precisa pesquisar
2. Usar WebSearch pra buscar docs oficiais e artigos
3. Sintetizar a informacao relevante
4. Adicionar a Foundation KB se for conhecimento reutilizavel
5. Reportar ao usuario

## Fontes prioritarias

1. Meta for Developers (developers.facebook.com/docs)
2. Supabase Docs (supabase.com/docs)
3. Vercel Docs (vercel.com/docs)
4. MDN Web Docs (developer.mozilla.org)
