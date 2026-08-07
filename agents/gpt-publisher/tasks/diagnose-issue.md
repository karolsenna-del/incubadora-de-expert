---
task: "Diagnose Issue"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descrição do problema com um GPT publicado ou com o processo de publicação"
Saida: "Diagnóstico + solução proposta + documentação do fix"
execution_type: "sequential"
---

# Task: Diagnose Issue — Diagnosticar Problema

## Objetivo

Investigar falha na publicação ou comportamento inesperado de um GPT já publicado, identificar causa raiz e propor solução.

## Trigger

`*diagnose` ou "o GPT tal não tá respondendo direito", "por que a publicação falhou", "não funcionou"

## Passos

### Step 1: Coletar Sintomas

Perguntar (se não informado):
- Qual mente/GPT está com problema?
- O problema é na publicação (Playwright travou, erro no GPT Builder) ou no comportamento do GPT já publicado (respondendo errado, "esquecendo" regra)?
- Mensagem de erro exata, se houver
- Já tentou antes? Mesmo resultado?

### Step 2: Consultar KB

Abrir `data/gpt-publisher-kb.md`, seção Troubleshooting, buscar:
- Sintoma equivalente já mapeado
- Limite do GPT Builder que pode ter sido violado (Instructions > 8.000 chars, >20 arquivos de Knowledge)

### Step 3: Investigar

Conforme o tipo de problema:

**Se é falha de publicação:**
1. Sessão ChatGPT ainda estava logada?
2. Instructions realmente couberam no limite?
3. Algum arquivo de Knowledge excedeu tamanho/formato?
4. O layout do GPT Builder mudou desde a última publicação?

**Se é comportamento do GPT já publicado:**
1. A regra que "sumiu" estava nas Instructions ou só no Knowledge? (retrieval não é garantido a cada turno — regra comportamental crítica deveria estar nas Instructions)
2. O GPT está desatualizado em relação à mente de origem? (rodar `audit-published.md`)
3. As Instructions foram cortadas demais na compactação, perdendo nuance importante?

### Step 4: Diagnosticar e Propor

```
=== DIAGNÓSTICO ===

Problema: {descrição}
Causa provável: {causa raiz identificada}

Solução proposta:
  1. {passo 1}
  2. {passo 2}

Risco: {baixo/médio/alto}
Reversível: {sim/não}

Posso executar agora?
```

### Step 5: Documentar Fix

SE o fix revelou problema não documentado:
- Adicionar entrada em `data/gpt-publisher-rules.md`
- Adicionar troubleshooting em `data/gpt-publisher-kb.md`

## Erros Mais Comuns

| Sintoma | Causa provável | Fix |
|---------|---------------|-----|
| Instructions rejeitadas ao salvar | Passou de 8.000 caracteres | Voltar pra `compact-instructions.md`, cortar mais |
| GPT "esquece" regra comportamental | Regra só estava no Knowledge, não nas Instructions | Mover a regra pras Instructions (retrieval não é garantido a cada turno) |
| Upload de Knowledge falha | Arquivo > 512MB/2M tokens ou já tem 20 arquivos | Particionar ou remover arquivo redundante |
| Playwright não encontra campo esperado | OpenAI mudou o layout do GPT Builder | Parar, tirar screenshot, escalar — não adivinhar seletor |
| Link não abre pra aluna | Compartilhamento configurado como "só eu" | Corrigir pra "qualquer pessoa com o link" |
| GPT respondendo desatualizado | Mente de origem evoluiu, GPT não foi republicado | Rodar `audit-published.md`, oferecer atualização |
