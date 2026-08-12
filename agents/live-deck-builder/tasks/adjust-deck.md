---
task: "Adjust Deck"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Feedback pontual sobre um deck já entregue"
Saida: "Deck republicado com o ajuste aplicado"
execution_type: "sequential"
---

# Task: Adjust Deck — Ajuste Pontual em Deck Já Entregue

## Objetivo

Aplicar uma mudança pontual num deck já publicado sem refazer o trabalho todo.

## Trigger

`*ajusta {N}` ou feedback pontual tipo "muda o slide X", "esse trecho ficou denso", "troca a cor desse card".

## Passos

### Step 1: Localizar

1. Abrir a cópia local `business/campanhas/lives-semanais/live-{N}-apresentacao.html`
2. Localizar o slide/trecho referido pelo feedback

### Step 2: Confirmar Escopo

Se o pedido for ambíguo sobre qual slide, perguntar antes de mexer:
"Qual slide exatamente — o da {descrição A} ou o da {descrição B}?"

Se o pedido implicar mudar conteúdo do roteiro (não só forma), aplicar Delegation Map: isso é nível 1 (Tell) — parar e perguntar antes de tocar no conteúdo.

### Step 3: Aplicar o Ajuste

Editar só o trecho pedido — não retrabalhar slides que não foram mencionados. Manter a paleta e a estrutura do restante do deck intactas.

### Step 4: Republicar

1. Atualizar o mesmo Artifact (mesmo link — não criar um novo)
2. Atualizar a cópia local no mesmo path

### Step 5: Confirmar

```
Ajustado — {o que mudou}.
Mesmo link: {url}
```

## Error Handling

| Cenário | Ação |
|---------|------|
| Deck referido não existe ainda | Informar: "Não achei deck da Live {N} ainda. Quer que eu monte do zero (`execute-mission`)?" |
| Pedido de ajuste na verdade muda o conteúdo do roteiro | Parar, sinalizar nível 1 do Delegation Map, perguntar antes de prosseguir |
| Ajuste pedido quebra a consistência de marca (ex: pedir cor fora da paleta) | Sinalizar antes de aplicar: "Isso foge da paleta (`#f85627` `#ddddde` `#090a0b` `#fcfcfc`). Aplico mesmo assim?" |
