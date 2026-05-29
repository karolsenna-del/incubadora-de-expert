---
task: "Build Style Prefix"
responsavel: "@visual-briefer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "direcao-visual-{evento}.md"
Saida: "style-prefix.md (bloco que vai no header de todo briefing)"
Checklist:
  - "Style prefix construído A PARTIR da direção visual (não template fixo)"
  - "Paleta, tipografia, atmosfera, negativos derivados da direção"
  - "Estrutura genérica preenchida com escolhas do usuário"
execution_type: "semantic"
---

# Task: Build Style Prefix — Fase 7 início

## Executive Summary

Visual-briefer monta o style prefix do briefing usando o `direcao-visual-{evento}.md`. **NÃO usa template fixo** — constrói do zero a partir da direção do usuário. Style prefix é IDÊNTICO entre todas as partes do mesmo evento (consistência visual).

## Steps

### Step 1: Ler direção visual

Ler `direcao-visual-{evento}.md` na íntegra. Identificar:
- Vibe / sentimento principal
- Referências visuais
- Design system (se houver)
- Negativos

### Step 2: Estrutura genérica

Preencher essa estrutura com a direção visual do usuário:

```
[Tipo de apresentação] presentation, 16:9, 1920x1080.
Background [hex]. Primary text [hex]. Accent palette: [cores com função].

Typography: [fontes específicas + tamanhos + estilo].
Maximum [N] lines per slide. [Espaçamento e densidade].

AESTHETIC: [vibe principal + referências do usuário em palavras].
[Elementos visuais característicos derivados das refs].

EMOTIONAL DIRECTIVE: [como o público deve sentir — derivado da vibe].

[Língua dos slides com regras específicas — ex: português com diacríticos completos].

NEGATIVES: [lista do que evitar baseada na sessão].
```

### Step 3: Construir cada elemento

**Tipo de presentation:** workshop / palestra / aula / treinamento → adaptar tom da abertura.

**Background + text:** se design system tem hex, usar. Se não, derivar da vibe (cinematográfico = dark, clean apple = light, etc).

**Accent palette:** cada cor com função explicitada. Ex:
```
gold #f59e0b (revelation, transformation, hope)
cyan #22d3ee (technology, knowledge)
red #ef4444 (warning, decay, problem)
```

**Typography:** fontes específicas se design system tem. Senão, derivar do estilo:
- Cinematográfico premium: Inter / SF Pro / Space Grotesk
- Editorial: serifa elegante (Playfair, Cormorant)
- Tech: monospace pra labels (JetBrains Mono)

**AESTHETIC:** descrição cinemática da vibe + refs literais do usuário. Ex:
- "Apple keynote meets Blade Runner 2049 meets Dune Part Two"
- "Vogue editorial meets Wes Anderson"
- "Clean Stripe documentation meets Notion clarity"

**EMOTIONAL DIRECTIVE:** o que o público deve sentir.

**Língua:** sempre marcar regras específicas (português com diacríticos, etc).

**NEGATIVES:** lista direta do que o usuário marcou + clipart, stock photos, watermarks (defaults).

### Step 4: Salvar style-prefix.md

Salvar como bloco reutilizável que vai no header de todo briefing:

```markdown
# Style Prefix — {Nome do Evento}

> Construído a partir de `direcao-visual-{evento}.md` em DD/MM/AAAA.
> Aplicar IDÊNTICO em todos os briefings (Parte 1, 2, 3, ...).

```
[STYLE PREFIX FORMATADO PRO MANUS — bloco de texto]
```
```

### Step 5: Handoff

Próximo task: `write-manus-briefing` (loop por bloco).

## Error Handling

| Cenário | Ação |
|---------|------|
| Direção visual sem hex (apenas verbal) | Derivar hex da vibe, propor pro usuário antes de salvar |
| Tipografia não definida | Propor fontes alinhadas à vibe, pedir confirmação |
| Vibe contraditória interna | Voltar pra define-visual-direction pra resolver |

---

## Cardinal Rules Aplicadas

- Style prefix construído da direção visual, NÃO template fixo (PU-024)
- Style prefix IDÊNTICO entre partes (PU-031 — consistência visual)
