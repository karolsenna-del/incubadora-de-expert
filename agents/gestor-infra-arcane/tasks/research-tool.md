---
task: "Research Tool"
responsavel: "@gestor-infra"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ferramenta ou plataforma a pesquisar"
Saida: "Conhecimento adicionado a Foundation KB"
Checklist:
  - "Ferramenta pesquisada via WebSearch"
  - "Features core documentadas"
  - "API e integracoes mapeadas"
  - "Troubleshooting levantado"
  - "KB atualizada"
execution_type: "semantic"
---

# Task: Research Tool — Pesquisar Ferramenta Nova

## Objetivo

Pesquisar ferramenta, plataforma ou tecnologia que o worker precisa conhecer. Adicionar a Foundation KB de forma permanente.

## Trigger

`*research` ou quando missao requer ferramenta nao coberta pela KB.

## Passos

### Step 1: Identificar Alvo

1. Qual ferramenta pesquisar?
2. Pra que o worker vai usar?
3. Com quais outras ferramentas precisa integrar?

### Step 2: Pesquisa em 3 Passes

**Pass 1 — O que e e como funciona:**
```
WebSearch: "{ferramenta} overview features capabilities 2025 2026"
```
Capturar: descricao, features core, modelo de pricing, limites.

**Pass 2 — API e integracoes:**
```
WebSearch: "{ferramenta} API documentation integration"
WebSearch: "{ferramenta} {outra ferramenta} integration how to"
```
Capturar: endpoints, autenticacao, rate limits, webhooks, integracoes nativas.

**Pass 3 — Troubleshooting:**
```
WebSearch: "{ferramenta} common issues problems solutions"
```
Capturar: problemas frequentes, solucoes conhecidas, workarounds.

### Step 3: Sintetizar

Organizar no formato da KB:

```markdown
### {Nome da Ferramenta}
**O que e:** {descricao em 2-3 frases}
**Features core:** {lista das features relevantes pro worker}
**API:** {tem? REST/GraphQL? auth? rate limits?}
**Integracoes nativas:** {lista}
**Limites conhecidos:** {o que NAO faz ou faz mal}
**Troubleshooting:** {problemas frequentes e solucoes}
**Doc oficial:** {link}
```

### Step 4: Atualizar KB

1. Abrir `data/gestor-infra-kb.md`
2. Adicionar no dominio correto
3. Se integra com ferramentas existentes: atualizar secao de integracoes

### Step 5: Reportar

```
Pesquisei {ferramenta}. Adicionei a KB.
Resumo: {2-3 linhas do que encontrou}
Gaps: {o que nao encontrou, se houver}
```

## Error Handling

| Cenario | Acao |
|---------|------|
| Ferramenta sem doc publica | Registrar gap, pedir acesso/info ao usuario |
| Informacao conflitante | Cruzar fontes, documentar incerteza |
| API nao disponivel | Documentar alternativas (webhook, N8N, scraping) |
