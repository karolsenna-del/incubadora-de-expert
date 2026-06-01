---
task: "Add Template"
responsavel: "@identity-designer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno ja tem templates e quer adicionar novo"
Saida: "Novo template salvo em ~/.carrossel-arcane/templates/"
execution_type: "interactive"
---

# Task: Add Template — Adicionar Template Adicional

## Executive Summary

Versao reduzida de `setup-identity`. Cria 1 template novo sem refazer os existentes.

## Steps

### Step 1: Coletar Tipo e Inspiracao

```
Que tipo de template queres adicionar?

Ja tens: {lista dos tipos existentes do aluno}

Tipos comuns que podem faltar:
- Capa (1o slide do carrossel)
- Conteudo padrao (slides do meio)
- CTA/Fechamento (ultimo slide)
- Lista numerada
- Citacao/Quote
- Stats hero (numero grande)
- Antes/Depois (2 imagens)

Qual? E tens referencia visual desse tipo (Pinterest, prints)?
```

### Step 2: Montar v1

Mesmo processo de `setup-identity` Step 3:
- Cria HTML+CSS
- Renderiza preview
- Mostra pro aluno

### Step 3: Loop de Ajustes

Max 4 iteracoes. Mesma logica de `setup-identity`.

### Step 4: Salvar

Adiciona em `~/.carrossel-arcane/templates/{slug-novo}/`

### Step 5: Devolver Controle

```
Template "{nome}" salvo. Total agora: {N} templates.

Quer adicionar outro? Ou ja vamos produzir?
```

## Quality Gates

- Template salvo com meta.yaml + preview.png
- Aluno aprovou explicitamente
- Nao sobrescreveu template existente

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Slug ja existe | Sugerir nome diferente |
| Aluno nao consegue descrever o que quer | Mostrar previews dos templates existentes pra ele apontar variacoes |
