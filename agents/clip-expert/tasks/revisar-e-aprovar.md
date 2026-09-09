---
task: "Revisar e Aprovar"
responsavel: "@clip-chief"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Cortes prontos na pasta de entrega (de entregar-e-notificar)"
Saida: "Cortes aprovados registrados na fila do Postador (business/instagram/fila-reels/)"
Checklist:
  - "Cortes listados com nota e trecho de origem pra Karol revisar"
  - "Decisao de aprovacao e explicitamente da Karol, nunca automatica"
  - "Somente cortes aprovados entram na fila do Postador (QG-CE-02)"
execution_type: "interactive"
---

# Task: Revisar e Aprovar

## Executive Summary

O único passo hybrid do processo. O clip-chief lista os cortes prontos, a Karol decide quais aprovar, e só esses entram na fila do Postador (`insta-scheduler`).

## Steps

### Step 1: Listar Cortes

Mostrar cada corte da pasta com: nota, timestamp de origem na live, e um resumo curto do trecho.

### Step 2: Perguntar Aprovação

```yaml
elicit: true
prompt: |
  {N} cortes prontos pra Live {X}. Quais aprova?
  (pode ser "todos", uma lista, ou "nenhum" pra deixar pra depois)
type: "free_text"
```

### Step 3: Registrar na Fila do Postador

Para cada corte aprovado: copiar vídeo + legenda sugerida pra `business/instagram/fila-reels/{live}-{corte}/`, seguindo a mesma convenção de pasta que o `insta-scheduler` já usa pra `business/instagram/fila/`.

**Importante:** o Postador hoje só publica CAROUSEL e STORIES via Meta Graph API — REELS ainda não está implementado nele (ver `agents/insta-scheduler/data/insta-scheduler-kb.md`). Avisar isso explicitamente à Karol: o corte fica pronto e na fila, mas a publicação automática real depende de uma extensão futura do Postador ou de ela publicar manualmente enquanto isso não existe.

### Step 4: Preservar Não Aprovados

Cortes não aprovados permanecem na pasta original — nunca são apagados, podem ser reaproveitados depois.

## Error Handling

| Cenário | Ação |
|---------|------|
| Karol não responde / adia a revisão | Não empilha silenciosamente — na próxima ativação do squad, lembra que há revisão pendente antes de anunciar corte novo |
| Karol pede pra aprovar corte abaixo da nota mínima que ela viu manualmente na pasta | Permitido — QG-CE-01 é sobre o que o squad gera automaticamente, QG-CE-02 (aprovação humana) pode incluir julgamento pessoal da Karol |
| Pasta `business/instagram/fila-reels/` não existe | Criar automaticamente |
