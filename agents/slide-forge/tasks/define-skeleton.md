---
task: "Define Skeleton"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "sources-map.md, despejos brutos, event-definition.md"
Saida: "skeleton.md (lista de blocos do evento com posição/tempo/função de cada)"
Checklist:
  - "Lista de blocos definida"
  - "Cada bloco tem posição cronológica + tempo + função"
  - "Usuário aprovou explicitamente o esqueleto"
execution_type: "interactive"
---

# Task: Define Skeleton — Fase 2.5 (Esqueleto Macro)

## Executive Summary

Chief propõe o esqueleto macro do evento — a lista de blocos que vão entregar a teoria. Usuário aprova ou ajusta. Esse esqueleto é o input pra Fase 3 (loop por bloco).

**Quality Gate: QG-SF-01 (Esqueleto Macro Aprovado)**

## Steps

### Step 1: Compor proposta de esqueleto

Com base em event-definition + sources-map + despejos, propor lista de blocos:

```
=== ESQUELETO PROPOSTO — {Nome do Evento} ===

BLOCO 1 — {Nome}
  Posição: {Dia X / parte Y}
  Tempo: {N min}
  Função: {emocional/didática}

BLOCO 2 — {Nome}
  Posição: ...
  Tempo: ...
  Função: ...

BLOCO 3 — ...
...

TOTAL: N blocos · {tempo total}

Bate? O que ajusta?
```

### Step 2: Apresentar ao usuário

Mostrar esqueleto inline. Esperar resposta:
- **Aprova** → segue
- **Pede ajuste** → ajusta lista, re-apresenta
- **Pede revisão profunda** → volta pra map-sources / capture-dump

### Step 3: Salvar skeleton.md

Quando aprovado, salvar em `skeleton.md`:

```markdown
# Esqueleto — {Nome do Evento}

> Aprovado em DD/MM/AAAA com o usuário.

| # | Bloco | Posição | Tempo | Função |
|---|---|---|---|---|
| 1 | {nome} | {posição} | {min} | {função} |
| 2 | {nome} | {posição} | {min} | {função} |
| ... | ... | ... | ... | ... |

**Total:** {N} blocos · {tempo total}
```

### Step 4: Quality Gate QG-SF-01

Checar:
- [ ] Lista completa
- [ ] Cada bloco com posição + tempo + função
- [ ] Usuário aprovou explicitamente

Se passou: handoff to develop-block-theory.

## Error Handling

| Cenário | Ação |
|---------|------|
| Usuário não consegue decidir esqueleto | Propor estrutura padrão pra tipo de evento (workshop tem manhã/tarde, palestra é único) |
| Esqueleto muito grande (15+ blocos) | Sinalizar — vai ser pesado. Sugerir agrupar ou cortar |
| Esqueleto muito raso (1-2 blocos) | Pode ser aceitável pra palestra curta. Confirmar com usuário |

---

## Cardinal Rules Aplicadas

- Não invento, não chuto (PU-005)
- Aprovação explícita necessária (QG-SF-01)
