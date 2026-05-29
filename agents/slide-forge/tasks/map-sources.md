---
task: "Map Sources"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "event-definition.md, lista de conceitos a cobrir"
Saida: "sources-map.md (conceito × fonte × o que falta)"
Checklist:
  - "Lista de conceitos enumerada"
  - "Fonte apontada pelo usuário pra cada conceito (ou marcado como 'despejo manual')"
  - "Gaps identificados explicitamente"
execution_type: "interactive"
---

# Task: Map Sources — Fase 2 (Mapeamento de Fontes)

## Executive Summary

Lista os conceitos que o evento precisa cobrir e PERGUNTA ao usuário onde tem material de cada um. Chief NUNCA assume paths nem infere estrutura de filesystem. Sempre pergunta.

## Steps

### Step 1: Listar conceitos a cobrir

Com base no event-definition.md, propor lista de conceitos que o evento vai cobrir. Apresentar pro usuário pra ajustar/adicionar.

### Step 2: Pergunta sobre fontes

Pra cada conceito (ou grupo de conceitos):

> "Pra esse tema X, você tem fonte? Onde está?"

Opções típicas que o usuário pode apontar:
- Caminho/arquivo no computador dele (Obsidian dele, KB pessoal, pasta de docs)
- Material externo: livro, curso, aula gravada, transcrição
- Documentos de eventos passados (slides antigos, palestras anteriores)
- Mentoria/conversa gravada
- Link de pesquisa externa
- "Não tenho fonte documentada — vou despejar manualmente conversando" → ativa task `capture-dump`
- Combinação dos acima

### Step 3: Ler fontes apontadas

Se o usuário apontou paths/links, Chief lê e estuda o material.

Se for despejo manual, ativa `capture-dump`.

### Step 4: Salvar mapa de fontes

Salvar em `sources-map.md`:

```markdown
# Sources Map — {Nome do Evento}

| Conceito | Fonte | Status | Notas |
|---|---|---|---|
| {conceito} | {path/link/despejo} | lido / a despejar / faltando | {observação} |
| ... | ... | ... | ... |
```

### Step 5: Sinalizar gaps

Se algum conceito NÃO TEM fonte alguma e nem despejo agendado, **PARAR** e sinalizar:

> "Pro conceito X não tenho fonte. Você quer despejar agora ou tem material que esqueceu?"

Não inventa. Não chuta.

### Step 6: Handoff to define-skeleton

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário não tem fonte pra nada | Aceitar — vai tudo via despejo manual (PU-005a transversal) |
| Path apontado não existe | Sinalizar pro usuário: "Path X não existe — verifica?" |
| Material divergente entre fontes | Sinalizar e levar pra debate (Fase 3 decide qual versão prevalece) |

---

## Cardinal Rules Aplicadas

- Não invento, não chuto (PU-005)
- Despejo do usuário é fonte primária (PU-005b)
- Chief NUNCA infere paths — sempre pergunta

Ver `data/cardinal-rules.md` pra regras completas.
