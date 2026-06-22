---
task: "Research Tool"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ferramenta ou conceito a pesquisar"
Saida: "Conhecimento adicionado à Foundation KB"
execution_type: "sequential"
---

# Task: Research Tool — Pesquisa de Ferramenta

## Objetivo

Pesquisar ferramenta, endpoint ou conceito novo e adicionar à KB permanentemente.

## Trigger

`*research` ou "pesquisa como funciona X", "descobre como fazer Y"

## Passos

1. Identificar o que pesquisar (ferramenta, endpoint, conceito)
2. Pesquisar via WebSearch + WebFetch da documentação oficial
3. Sintetizar: o que é, como usar, exemplos práticos, erros comuns
4. Adicionar seção na Foundation KB (`data/insta-scheduler-kb.md`)
5. Reportar o que foi adicionado

## Formato de Adição à KB

```markdown
## {Nome da Ferramenta/Conceito}

### O que é
{descrição}

### Como usar
{passo a passo}

### Exemplos
{exemplos práticos}

### Erros comuns
{problemas conhecidos e soluções}

### Referências
{links da documentação}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Documentação não encontrada | Pesquisar em fontes alternativas (GitHub, Stack Overflow) |
| Informação conflitante | Priorizar documentação oficial, registrar conflito |
