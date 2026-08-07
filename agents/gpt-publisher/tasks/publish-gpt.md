---
task: "Publish GPT"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pacote aprovado (Instructions + Knowledge + starters) + decisão criar/atualizar"
Saida: "GPT publicado/atualizado no ChatGPT + link + registro gpt-id.md"
Checklist:
  - "Sessão ChatGPT confirmada como logada"
  - "Decisão criar vs. atualizar confirmada com a Karol"
  - "Instructions coladas no campo correto"
  - "Todos os arquivos de Knowledge enviados"
  - "Conversation starters preenchidos"
  - "Compartilhamento configurado como link público"
  - "Link capturado"
  - "gpt-id.md atualizado"
execution_type: "sequential"
---

# Task: Publish GPT — Publicar ou Atualizar via Playwright

## Objetivo

Levar o pacote já aprovado pela Karol e publicá-lo ou atualizá-lo de fato no GPT Builder, via automação de navegador.

## Trigger

Último passo de `execute-mission.md`, **só depois de aprovação explícita do pacote compactado** (nível 3 — Consult, ver Delegation Map).

## Pré-condições

- Pacote (Instructions.txt + arquivos de Knowledge + starters) já aprovado pela Karol
- Confirmado se é criação nova ou atualização de GPT existente (checar `agents/gpt-publisher/output/{slug}/custom-gpt/gpt-id.md`)

## Passos

### Step 1: Confirmar Sessão

Verificar (via Playwright) se há sessão ChatGPT ativa ao navegar até `chatgpt.com`.

SE não estiver logado: **PARAR** — "Preciso que você esteja logada no ChatGPT no navegador antes de eu continuar. Avisa quando estiver."

### Step 2: Criação Nova vs. Atualização

**SE criação nova:**
1. Navegar até a área de GPTs → "Create"
2. Ir direto pra visão de configuração (não usar o builder conversacional — mais previsível pra automação)

**SE atualização:**
1. Abrir o GPT já existente (link salvo em `gpt-id.md`)
2. Ir em "Configure" / editar

### Step 3: Preencher Campos

1. Nome do GPT (igual ao nome da mente, ex: "ExpertViral")
2. Descrição curta (1-2 linhas, do config.yaml da mente original)
3. Colar o conteúdo de `Instructions.txt` no campo Instructions
4. Upload de cada arquivo de Knowledge (`knowledge/*.md`)
5. Preencher os conversation starters (até 4)

### Step 4: Configurar Compartilhamento

No botão "Share": selecionar "Anyone with the link" (qualquer pessoa com o link) — modo usado pelos 6 GPTs atuais das alunas.

SE estiver como "Only me": corrigir antes de considerar a missão concluída.

### Step 5: Publicar e Capturar Link

1. Confirmar publicação/salvamento
2. Capturar a URL final do GPT (formato `https://chatgpt.com/g/g-{id}-{slug}`)

### Step 6: Registrar

Criar ou atualizar `agents/gpt-publisher/output/{slug}/custom-gpt/gpt-id.md`:

```markdown
# GPT Publicado: {Nome da Mente}

**Link:** {url}
**Slug de origem:** agents/{slug}/
**Criado em:** {data}
**Última atualização:** {data}
**Versão da mente publicada:** {hash ou data de modificação do agent.md/KB no momento da publicação}
```

### Step 7: Entregar Link

```
=== GPT PUBLICADO ✓ ===

Mente: {nome}
Link: {url}
Compartilhamento: qualquer pessoa com o link

O que faço com o link agora é com você — distribuição pras alunas fica por sua conta.
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Sessão não logada | Parar e avisar, não tentar contornar |
| Seletor esperado não encontrado (layout mudou) | Parar, tirar screenshot do estado atual, descrever o que via e o que esperava, escalar pra Karol — não tentar clicar "no que parece certo" |
| Instructions rejeitadas (passou de 8.000 chars mesmo após compactação) | Voltar pra `compact-instructions.md`, cortar mais |
| Upload de Knowledge file falha | Verificar tamanho/formato do arquivo, tentar novamente 1x, escalar se persistir |
| Publicação trava/erro genérico do ChatGPT | Tentar novamente 1x, se persistir descrever exatamente o que aconteceu e parar |
