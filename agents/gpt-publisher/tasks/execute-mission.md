---
task: "Execute Mission"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Slug da mente de origem a publicar/atualizar como Custom GPT"
Saida: "GPT publicado/atualizado + link entregue + missão documentada"
Checklist:
  - "Mente lida (extract-mind)"
  - "Instructions compactadas (compact-instructions)"
  - "Knowledge preparado (prepare-knowledge)"
  - "Starters gerados (generate-starters)"
  - "Pacote apresentado e aprovado pela Karol"
  - "GPT publicado/atualizado (publish-gpt)"
  - "Link entregue"
  - "Mission Log atualizado"
execution_type: "sequential"
---

# Task: Execute Mission — Publicar Mente como Custom GPT

## Objetivo

Orquestrar o ciclo completo: ler a mente → compactar → organizar Knowledge → gerar starters → aprovar → publicar → documentar.

## Trigger

`*mission`, `*publica {slug}`, ou qualquer instrução de publicação/atualização de GPT.

## Pré-condições

`agents/{slug}/` existe e segue o formato Mind Forge (agent.md + config.yaml + KB + tasks).

---

## Passos

### Step 1: Identificar a Mente e Confirmar Criação vs. Atualização

1. Identificar o slug (informado pela Karol ou perguntado)
2. Checar `agents/gpt-publisher/output/{slug}/custom-gpt/gpt-id.md`:
   - Existe → é atualização, confirmar: "Já existe um GPT publicado pra `{slug}` ({link}). Vou atualizar esse. Confirma?"
   - Não existe → é criação nova, confirmar: "Não achei GPT publicado pra `{slug}` ainda. Vou criar um novo. Confirma?"

### Step 2: Ler a Mente de Origem

Executar `extract-mind.md`.

### Step 3: Compactar Instructions

Executar `compact-instructions.md`.

### Step 4: Preparar Knowledge

Executar `prepare-knowledge.md`.

### Step 5: Gerar Conversation Starters

Executar `generate-starters.md`.

### Step 6: Apresentar Pacote pra Aprovação

```
=== PACOTE PRONTO: {Nome da Mente} → Custom GPT ===

Instructions: {N} chars (limite 8.000)
Cortes feitos: {resumo — ver relatório completo de compact-instructions}

Knowledge: {N} arquivo(s) — {lista de nomes}

Conversation starters:
  1. {starter 1}
  2. {starter 2}
  3. {starter 3}
  4. {starter 4}

{Criação nova / Atualização de {link existente}}

Aprova pra eu publicar?
```

**Nível 3 — Consult:** aguardar aprovação explícita antes do Step 7. Se a Karol pedir ajuste, voltar ao step relevante (4, 5 ou 6) e reapresentar.

### Step 7: Publicar

Executar `publish-gpt.md` — só após aprovação do Step 6.

### Step 8: Entregar Resultado

Repassar o resumo final e o link (já formatado por `publish-gpt.md`).

### Step 9: Documentar (Mission Log + PDSA)

Adicionar entrada em `data/gpt-publisher-missions.md`:

```
| {data} | {slug} | {criação/atualização} | {link} | {sucesso/falha} |
```

**PDSA:**
1. **Plan:** Publicar/atualizar `{slug}`, expectativa de tamanho de corte: {estimativa}
2. **Do:** Cortou {N} chars das Instructions, {N} arquivo(s) de Knowledge, publicado em {link}
3. **Study:** Pacote aprovado de primeira? Automação rodou sem fricção?
4. **Act:** SE processo revelou padrão novo → `document-process.md`. SE seletor do Playwright quebrou → registrar em `gpt-publisher-rules.md`.

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Mente não segue formato Mind Forge | Ver Error Handling de `extract-mind.md` |
| Karol rejeita o pacote no Step 6 | Perguntar o que ajustar, voltar ao step correspondente, reapresentar |
| Falha durante publicação (Step 7) | Ver Error Handling de `publish-gpt.md` — não marcar missão como concluída |
| Karol some no meio da aprovação | Pausar, salvar estado do pacote gerado (não perder o trabalho de compactação), retomar quando ela voltar |
