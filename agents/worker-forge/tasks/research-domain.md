---
task: "Research Domain"
responsavel: "@knowledge-curator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Discovery summary (dominio, ferramentas, fontes internas)"
Saida: "KB rascunho (Foundation KB + fontes coletadas)"
Checklist:
  - "Cada ferramenta core pesquisada externamente"
  - "Integracoes entre ferramentas mapeadas"
  - "Fontes internas coletadas"
  - "KB rascunho >=300 linhas"
  - "Fontes classificadas por tier"
  - "Gaps de documentacao registrados"
execution_type: "semantic"
---

# Task: Research Domain — Pesquisa e Curadoria de Conhecimento

## Objetivo

Pesquisar externamente cada ferramenta/plataforma que o worker vai usar, coletar documentacao interna existente, e montar a KB rascunho do worker.

## Posicao no Workflow

Fase 1 do pipeline. Gate: QG-WF-002.

## Passos

### Step 1: Listar Alvos de Pesquisa

A partir do Discovery Summary, listar:
- Cada ferramenta/plataforma mencionada
- Integracoes entre ferramentas (pares)
- Conceitos do dominio que precisam de KB

### Step 2: Pesquisa Externa

Para cada ferramenta, executar pesquisa em 3 passes:

**Pass 1 — O que e e como funciona:**
```
WebSearch: "{ferramenta} overview features capabilities 2025 2026"
```
Capturar: descricao, features core, modelo de pricing, limites.

**Pass 2 — API e integracoes:**
```
WebSearch: "{ferramenta} API documentation integration"
WebSearch: "{ferramenta} {outra ferramenta} integration"
```
Capturar: endpoints, autenticacao, rate limits, webhooks, integracoes nativas.

**Pass 3 — Troubleshooting:**
```
WebSearch: "{ferramenta} common issues problems solutions"
```
Capturar: problemas frequentes, solucoes conhecidas, workarounds.

**Reportar progresso apos cada ferramenta:**
"Pesquisei {N}/{total} ferramentas. Proximo: {nome}."

### Step 3: Coleta Interna

Buscar no AIOS:

```
# KBs existentes relevantes
docs/knowledge/expert-business/
agents/*/data/*-kb.md

# Processos documentados
agents/squad-forge/minds/*/

# ETL existente
docs/knowledge/expert-business/*/
```

Coletar:
- SOPs existentes que o worker vai precisar
- KBs de squads relacionados
- Configuracoes documentadas

### Step 4: Classificar Fontes

| Tier | Peso | Criterio |
|------|------|----------|
| OURO | 0.90-1.00 | Doc oficial, API reference, curso do autor |
| PRATA | 0.60-0.89 | Tutoriais verificados, blog oficial, community docs |
| BRONZE | 0.30-0.59 | Posts genericos, respostas de forum |

Reportar: "Fontes: {X}% ouro, {Y}% prata, {Z}% bronze."

### Step 5: Compor KB Rascunho

Organizar em Foundation KB:

```markdown
# {Worker Name} — Foundation KB

## Plataformas e Ferramentas

### {Ferramenta 1}
**O que e:** {descricao}
**Features core:** {lista}
**API:** {resumo — endpoints, auth, limits}
**Integracoes nativas:** {lista}
**Limites:** {o que nao faz}
**Troubleshooting:** {problemas e solucoes}
**Doc oficial:** {link}

### {Ferramenta 2}
...

## Integracoes

### {Ferramenta A} <-> {Ferramenta B}
**Metodo:** {API direta, webhook, n8n, Zapier}
**Padrao:** {fluxo tipico}
**Cuidados:** {limites, gotchas}

## SOPs Existentes
{Importados da coleta interna}

## Troubleshooting Geral
{Problemas cross-platform}

## Glossario
{Termos do dominio}
```

### Step 6: Registrar Gaps

```yaml
gaps:
  - tool: "{ferramenta}"
    gap: "API nao documentada publicamente"
    action: "Pedir acesso ao usuario"
  - tool: "{ferramenta}"
    gap: "Integracao com {outra} nao encontrada"
    action: "Pode precisar de n8n custom"
```

## Quality Gate: QG-WF-002

| Criterio | Obrigatorio |
|----------|-------------|
| Cada ferramenta core pesquisada | Sim |
| Integracoes entre ferramentas mapeadas | Sim |
| Fontes internas coletadas (se existem) | Sim |
| KB rascunho >= 300 linhas (3+ ferramentas) ou >= 150 linhas (1-2 ferramentas) | Sim |
| Fontes classificadas por tier | Sim |
| Gaps registrados | Sim |
| >= 40% fontes tier ouro | Recomendado |

**Veto:** Ferramenta core nao pesquisada, KB < 150 linhas.

## Error Handling

| Cenario | Acao |
|---------|------|
| Ferramenta sem doc publica | Registrar gap, pedir acesso ao usuario |
| Integracao nao existe nativa | Documentar alternativas (n8n, webhook, API custom) |
| Fonte interna desatualizada | Marcar como bronze, usar com ressalva |
| WebSearch retorna pouco | Tentar termos alternativos, buscar em ingles |
