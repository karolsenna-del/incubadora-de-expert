---
task: "Diagnose Issue"
responsavel: "@insta-scheduler"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descrição do problema"
Saida: "Diagnóstico + solução proposta + documentação do fix"
execution_type: "sequential"
---

# Task: Diagnose Issue — Diagnosticar e Resolver Problema

## Objetivo

Investigar falha de agendamento, identificar causa raiz e propor solução.

## Trigger

`*diagnose` ou "o que deu errado", "não funcionou", "erro no agendamento"

## Passos

### Step 1: Coletar Sintomas

Perguntar (se não informado):
- Qual carrossel tentou agendar?
- Qual erro apareceu (mensagem exata)?
- Em qual step falhou (upload Drive, chamada Meta API, outro)?
- Já tentou antes? Com o mesmo resultado?

### Step 2: Consultar KB

Abrir `data/insta-scheduler-kb.md` e buscar:
- Código de erro da Meta API
- Problema conhecido com URL do Drive
- Problema de token

### Step 3: Investigar

Com base nos sintomas e KB:
1. Verificar token (válido? próximo do vencimento?)
2. Verificar URL do Drive (acessível publicamente?)
3. Verificar formato dos slides (PNG? dimensões corretas?)
4. Verificar legenda.txt (encoding? caracteres especiais?)
5. Verificar rate limit (muitas chamadas recentes?)

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
- Adicionar entrada em `data/insta-scheduler-rules.md`
- Adicionar troubleshooting em `data/insta-scheduler-kb.md`

## Erros Mais Comuns

| Sintoma | Causa provável | Fix |
|---------|---------------|-----|
| Erro 190 Meta API | Token expirado | SOP-001: renovar token |
| Erro 100 Meta API "invalid image" | URL Drive inacessível | Verificar permissão pública + tentar URL alternativa |
| Erro 32 Meta API | Rate limit | Aguardar 60s, tentar novamente |
| Upload Drive falha com 401 | Token Drive expirado | Renovar via Service Account |
| Post aparece como "failed" no Meta | Imagem rejeitada (tamanho/formato) | Verificar dimensões dos slides |
| legenda.txt com caracteres estranhos | Encoding incorreto | Verificar se está em UTF-8 |
