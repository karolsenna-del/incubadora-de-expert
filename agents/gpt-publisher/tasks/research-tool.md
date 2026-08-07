---
task: "Research Tool"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ferramenta, feature ou limite do GPT Builder a pesquisar"
Saida: "Conhecimento adicionado à Foundation KB"
execution_type: "sequential"
---

# Task: Research Tool — Pesquisa sobre o GPT Builder

## Objetivo

Pesquisar mudanças ou features do GPT Builder (a OpenAI atualiza o produto com frequência) e manter a Foundation KB atualizada.

## Trigger

`*research` ou "descobre como funciona X no GPT Builder", "o ChatGPT mudou o limite de Y?"

## Passos

1. Identificar o que pesquisar (limite, feature nova, mudança de fluxo)
2. Pesquisar via WebSearch — cruzar pelo menos 2 fontes independentes (community.openai.com costuma ser mais rápido que o Help Center oficial pra mudanças recentes)
3. Sintetizar: o que mudou, desde quando, impacto pro processo de publicação deste worker
4. Adicionar seção na Foundation KB (`data/gpt-publisher-kb.md`)
5. SE a mudança afeta um processo já documentado no Playbook: atualizar o SOP correspondente também
6. Reportar o que foi encontrado

## Formato de Adição à KB

```markdown
## {Nome da Feature/Limite}

### O que é / o que mudou
{descrição}

### Impacto no processo de publicação
{como isso afeta compact-instructions, prepare-knowledge ou publish-gpt}

### Fontes
{links, com data da pesquisa}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Fontes conflitantes sobre um limite (ex: dois números diferentes) | Priorizar a fonte mais recente; se ambíguo, registrar os dois e marcar como "a confirmar na prática" |
| OpenAI Help Center bloqueado (403, como ocorreu na pesquisa inicial) | Usar busca cruzada via WebSearch (community + blogs que citam o oficial) |
