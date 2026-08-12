---
task: "Diagnose Issue"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Descrição do problema com um deck"
Saida: "Diagnóstico + solução proposta + documentação do fix"
execution_type: "sequential"
---

# Task: Diagnose Issue — Diagnosticar Deck Reprovado ou Repetitivo

## Objetivo

Investigar por que um deck não ficou bom (reprovado, denso, repetitivo entre lives) e propor correção.

## Trigger

`*diagnose` ou "esse deck não ficou bom", "os decks estão todos parecidos", "esse slide ficou poluído"

## Passos

### Step 1: Coletar Sintomas

Perguntar (se não informado):
- Qual live/deck especificamente?
- O que incomodou — densidade de texto, variedade de layout, cor, algo errado no conteúdo?
- É problema pontual (1 slide) ou do deck inteiro?

### Step 2: Consultar KB

Abrir `data/live-deck-builder-kb.md` e checar:
- Regra de densidade (2-4 frases/slide) foi respeitada?
- Catálogo de tipos de slide — o deck usou variedade suficiente, ou repetiu o mesmo tipo demais?
- Paleta aplicada corretamente?

### Step 3: Investigar

1. Reabrir o deck (Artifact ou cópia local) e revisar slide a slide
2. Se densidade: contar linhas/frases por slide reclamado
3. Se repetição: comparar tipos de slide usados nesta live vs. lives anteriores no Mission Log
4. Se cor/marca: checar hex usados contra a paleta oficial

### Step 4: Diagnosticar e Propor

```
=== DIAGNÓSTICO ===

Problema: {descrição}
Causa provável: {causa raiz identificada}

Solução proposta:
  1. {passo 1}
  2. {passo 2}

Aplico agora (via adjust-deck) ou refaço o bloco inteiro?
```

### Step 5: Documentar Fix

Se o fix revelou problema recorrente (ex: sempre repete o mesmo tipo de slide na Parte 2):
- Adicionar entrada em `data/live-deck-builder-rules.md`
- Atualizar a regra correspondente na Foundation KB

## Problemas Mais Comuns

| Sintoma | Causa provável | Fix |
|---------|---------------|-----|
| Slide com texto denso/overflow | Condensação insuficiente na Step 3 do execute-mission | Reabrir o bloco, cortar mais, nunca encolher fonte |
| Decks parecidos toda semana | Pouca variedade de tipo de slide escolhida | Revisar catálogo completo, forçar pelo menos 4 tipos diferentes por deck |
| Cor fora da paleta | Hex inventado em vez de usar os 4 oficiais | Reaplicar só com `#f85627` `#ddddde` `#090a0b` `#fcfcfc` |
| Logo errada pro fundo (branca em fundo claro, etc.) | Não verificou contraste antes de aplicar | Trocar pra versão correta conforme o fundo do slide |
| Deck sem slide de resumo antes do CTA | Pulou a regra fixa do execute-mission | Adicionar o slide de resumo faltante |
