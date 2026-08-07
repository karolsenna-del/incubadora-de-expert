---
task: "Start"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Ativação do worker pelo usuário"
Saida: "Worker ativo, base carregada, pronto pra publicar"
Checklist:
  - "Persona carregada"
  - "Rules carregadas"
  - "GPTs já publicados listados (se houver registro)"
  - "Greeting exibido"
execution_type: "interactive"
---

# Task: Start — Entry Point do Publicador de GPT

## Objetivo

Ativar o gpt-publisher e situar a Karol sobre o que já foi publicado antes de receber a próxima missão.

## Trigger

- `/gpt-publisher` ou `*start`

## Passos

### Step 1: Carregar Base (SEMPRE)

Estes arquivos são carregados em TODA ativação:

1. Ler e adotar persona de `agents/gpt-publisher/agents/gpt-publisher.md`
2. Carregar Regras Operacionais: `agents/gpt-publisher/data/gpt-publisher-rules.md`

### Step 2: Verificar GPTs Já Publicados

Buscar registros existentes em `agents/gpt-publisher/output/*/custom-gpt/gpt-id.md`:
- SE existem registros → listar no greeting (mente, link, data da última publicação/atualização)
- SE não existe nenhum → informar que ainda não há GPT publicado por este worker

### Step 3: Exibir Greeting

```
=== PUBLICADOR DE GPT · v1.0.0 ===
Agente Auroq | Criado por Euriler Jubé
Usado por ele e pela Mentoria Arcane

Pego uma mente forjada no Auroq e devolvo pronta
pra virar Custom GPT no ChatGPT — Instructions
compactadas, Knowledge organizado, starters gerados.

{SE HÁ GPTs PUBLICADOS}
Já publicados:
  • {mente-1} → {link} (atualizado em {data})
  • {mente-2} → {link} (atualizado em {data})

{SE NÃO HÁ NENHUM}
Ainda não publiquei nenhum GPT. O piloto sugerido é o ExpertViral (agents/expert-viral/).

Qual mente publico ou atualizo?
```

### Step 4: Aguardar Instrução

Com a resposta da Karol, identificar o modo:

| Intent | Task |
|--------|------|
| Publicar mente nova ou atualizar GPT existente | `execute-mission` |
| Conferir se os GPTs publicados ainda batem com as mentes de origem | `audit-published` |
| Problema com um GPT já publicado | `diagnose-issue` |
| Pesquisar mudança no GPT Builder | `research-tool` |
| Não sabe qual mente publicar | Listar mentes disponíveis em `agents/*/agents/*.md` que ainda não têm registro em `custom-gpt/gpt-id.md` |

## Error Handling

| Cenário | Ação |
|---------|------|
| Mente indicada não existe em `agents/{slug}/` | Avisar: "Não encontrei `agents/{slug}/`. Confere o nome?" |
| Mente não segue o formato Mind Forge (falta agent.md, config.yaml, KB ou tasks) | Avisar o que falta em vez de tentar adivinhar a estrutura |
| Karol não sabe o que quer | Perguntar: "Quer publicar uma mente nova como GPT, atualizar um já existente, ou conferir se algum ficou desatualizado?" |
