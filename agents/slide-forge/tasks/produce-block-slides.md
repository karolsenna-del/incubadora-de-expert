---
task: "Produce Block Slides"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Bloco N FECHADO e VALIDADO no doc de construção"
Saida: "slides-conteudo.md (faixa N até X de slides do bloco N, aprovados pelo usuário)"
Checklist:
  - "Slides do bloco transpostos com fidelidade à teoria"
  - "Densidade respeitada (~5-6 linhas por slide)"
  - "Estilo aula/apresentação (não TEDx, não palestra-livro)"
  - "Português completo com diacríticos"
  - "Apresentado inline ao usuário"
  - "Iterado com feedback até aprovar"
  - "Salvo no doc de slides"
execution_type: "interactive"
---

# Task: Produce Block Slides — Fase 5-6 (loop por bloco)

## Executive Summary

Para cada bloco da teoria validada, transpõe slides enxutos a partir do Conteúdo Desenvolvido no doc de construção. Mostra inline pro usuário. Itera com feedback até aprovar. Salva no doc de slides.

**Quality Gates: QG-SF-03 (por bloco) + QG-SF-04 (consolidador final)**

## Steps

### Step 1: TRANSPOR SLIDES

Para cada conceito/seção do bloco no doc de construção:
1. Criar 1 slide (ou 2-3 se conceito não cabe em 1)
2. Aplicar formato consistente:

```markdown
### SLIDE N
**TÍTULO EM CAPS** (ou frase forte)

Corpo enxuto.
Linhas curtas.

*Frase italic ao final (anchor emocional, opcional).*
```

3. Aplicar regras de densidade desde a primeira passada (ver Step 2)

**Consultar `data/slides-content-reference.md`** pra calibrar tom (167 slides do workshop NDF como benchmark de densidade/formato).

### Step 2: APLICAR REGRAS DE ENXUTAR

- Máximo **5-6 linhas por slide**
- Cortar **40% na primeira passada** — não esperar feedback
- Cortar conectivos, redundâncias, óbvio
- **NÃO cortar essência da teoria aprovada**
- Tabelas pra comparações binárias/ternárias
- Anchors italic ao final (opcional, quando faz sentido emocional)

Detecção de slide denso: mais de 6 linhas, parágrafo único de 3+ linhas, lista com 6+ bullets, "parece um livro" → cortar 40% imediatamente.

Ver `data/enxutar-rules.md` pra regras completas.

### Step 3: APLICAR FIDELIDADE À TEORIA

Slides TRADUZEM a teoria aprovada com fidelidade:
- Mantém ângulo aprovado no debate
- Mantém termos exatos do usuário (sem traduzir pra "mais técnico")
- Mantém profundidade decidida na Fase 3
- Não inventa ângulo novo
- Não pula conceito que tava na teoria aprovada

**Se conceito não cabe em 1 slide → vira 2-3 slides. Não corta essência.**

### Step 4: APLICAR REGRAS DE LÍNGUA

- Português completo com diacríticos (ã, ç, é, í, ó, ú, â, ê, ô)
- Nunca substituir por ASCII
- Termos do usuário preservados

### Step 5: NUMERAÇÃO

- **Workshop com deck contínuo:** numeração CONTÍNUA a partir de onde parou (slide N+1, N+2, ...)
- **Apresentação avulsa:** numeração começa do 1 nesse deck
- Cronologia DE APRESENTAÇÃO importa, não ordem de produção (PU-022)

### Step 6: MOSTRAR INLINE PRO USUÁRIO

NÃO pedir pra abrir arquivo. Colar os slides do bloco direto no chat:

```
=== SLIDES DO BLOCO {N}: {nome} ===

### SLIDE {X}
[conteúdo]

### SLIDE {X+1}
[conteúdo]

...

Total: {N} slides nesse bloco.
Aprova ou ajusta?
```

### Step 7: ITERAR COM FEEDBACK

| Resposta usuário | Ação |
|---|---|
| **Aprova** ("ok salva", "tá bom", "fechou") | Próximo step (salvar) |
| **Aponta excesso em UM slide** | É sinal que TODOS podem ter excesso parecido. Revisar bloco inteiro, cortar 40% onde precisar |
| **Pede correção pontual** ("muda X", "tira Y") | Ajustar e re-mostrar |
| **Pede revisão estrutural** | Pode indicar problema na teoria — sinalizar e pedir se quer revisar teoria do bloco (`*revise-theory`) |

### Step 8: SALVAR NO DOC DE SLIDES

Quando o bloco é APROVADO, escrever no doc de slides (path apontado pelo usuário):

```markdown
## BLOCO {N} — {nome do bloco} ({total slides do bloco})

---

### SLIDE {X}
**TÍTULO**
[corpo]
*anchor*

---

### SLIDE {X+1}
...

---
```

Marca QG-SF-03 PASSED pra esse bloco.

### Step 9: PRÓXIMO BLOCO OU FASE 7

- Se ainda tem bloco da teoria validada pendente → volta Step 1 com próximo bloco
- Se TODOS os blocos têm slides aprovados → QG-SF-04 PASSED → handoff `define-visual-direction` (visual-briefer assume)

## Error Handling

| Cenário | Ação |
|---------|------|
| Slide ficou denso (mais de 6 linhas) | Cortar 40% imediatamente, sem esperar feedback (PU-037) |
| Usuário aponta UM slide denso | Revisar TODOS os slides do bloco — provavelmente tem padrão |
| Conceito complexo não cabe em 1 slide | Dividir em 2-3 slides — não comprimir |
| Usuário pede mudança que muda a teoria | Sinalizar: "Isso muda a teoria — quer revisar via `*revise-theory`?" |
| Numeração ficou errada (cronologia trocada) | Reconhecer mancada (PU-034), renumerar imediatamente |

---

## Cardinal Rules Aplicadas

- Fidelidade à teoria aprovada (PU-014a)
- Estilo aula/apresentação inteligente (PU-014b)
- Texto enxuto desde a primeira passada (PU-015)
- Português completo com diacríticos (PU-016)
- Caso/exemplo só entra se aprovado (PU-021)
- Cronologia importa, não ordem de produção (PU-022)
- Reconhecer mancada e corrigir rápido (PU-034)

Ver `data/cardinal-rules.md`, `data/enxutar-rules.md`, `data/slides-content-reference.md`.
