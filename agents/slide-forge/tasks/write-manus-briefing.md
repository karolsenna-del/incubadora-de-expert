---
task: "Write Manus Briefing"
responsavel: "@visual-briefer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Doc de slides aprovados do bloco N + style-prefix.md"
Saida: "briefing-manus-pt{N}.md (slides do bloco N com 4 elementos por slide)"
Checklist:
  - "Cada slide do bloco com conceito visual + texto travado + cor + atmosfera"
  - "Visual rhymes marcados (callbacks entre slides)"
  - "Sequências evolutivas marcadas"
  - "Tabelas como dark-glass dashboards"
  - "Transition slides como breathing space"
  - "Style prefix idêntico em todas as partes"
execution_type: "semantic"
---

# Task: Write Manus Briefing — Fase 7 (loop por bloco)

## Executive Summary

Para cada bloco aprovado, escreve briefing visual cinemático slide a slide pro Manus produzir. Cada slide do briefing tem 4 elementos. Marca visual rhymes, sequências evolutivas, tabelas como dark-glass, transition slides como breathing space.

## Steps

### Step 1: Ler material de referência

Antes de escrever, ler:
- `style-prefix.md` (criado em build-style-prefix)
- `slides-conteudo.md` ou doc de slides do evento (bloco N)
- `data/manus-rules.md` (processo de briefing)
- `data/briefing-examples/` (referência de estrutura, NÃO de estética)

### Step 2: Estrutura do arquivo de briefing

```markdown
# SLIDE BRIEFING — {Nome do Evento} (PARTE {N}: {tema do bloco N})

### For: Manus (Nano Banana Pro)
### Presenter: {nome do apresentador}
### Total: {N slides} (Bloco N) — slides {X} to {Y}
### Format: {proporção}, {resolução}, {estética}
### Continues from: {referência partes anteriores se houver}

---

## INSTRUCTIONS

[6-7 instruções derivadas da direção visual]

---

## STYLE PREFIX

[Cole IDÊNTICO o style-prefix.md aqui]

---

## BLOCO {N} — {Tema} (Slides {X}–{Y})
**Energy arc: {arco emocional do bloco}**

---

### Slide {X} — {nome curto}

[Descrição cinemática rica do conceito visual.]

Title: **"{título exato}"**

"{texto travado da linha 1}"
"{texto travado da linha 2}"

Below in {cor}: **"{texto destacado}"** — exact text, do not paraphrase.

Below in warm white, italic: *"{anchor italic}"* — exact text, do not paraphrase.

(NOTE: {se for parte de sequência evolutiva ou visual rhyme, marcar aqui})

---

### Slide {X+1} — ...
```

### Step 3: Para cada slide, aplicar 4 elementos

**1. Conceito visual** — descrição cinemática rica (não micro-gerenciada). Não dizer onde colocar título. Descrever a CENA, o FRAME. Deixar Nano Banana compor.

**2. Texto travado** — frases que devem aparecer EXATAS no slide ficam entre aspas e marcadas:
```
"{texto exato}" — exact text, do not paraphrase.
```

**3. Cor de destaque** — qual accent color usar nesse slide específico. Derivado da paleta do style prefix. Cada cor com função (gold = revelation, cyan = tech, etc).

**4. Atmosfera** — o que o viewer deve SENTIR. Embutido na descrição visual.

### Step 4: Marcar visual rhymes

Slides que se referem a outros (callbacks visuais). Documentar em FINAL NOTES no fim do arquivo:

```markdown
## FINAL NOTES

- **Visual rhymes:**
  - Slide {X} ↔ Slide {Y} — mesma metáfora retorna
  - Slide {X} (visual central) ↔ Slide {Z} (callback do mesmo símbolo)
```

### Step 5: Marcar sequências evolutivas

Sequências tipo 5 eras / 4 fases / 4 níveis precisam escalar dramaticamente. Marcar:

```markdown
- **Sequências evolutivas:**
  - Slides {X}→{X+4}: 5 eras — cada slide mais dramático que o anterior
  - Slides {Y}→{Y+3}: 4 fases — semente → broto → arbusto → árvore plena
```

E nos slides individuais:

```
(NOTE: Setup for evolutionary sequence X→X+4. Each subsequent slide must look DRAMATICALLY more advanced.)
```

### Step 6: Tabelas como dark-glass dashboards

Toda tabela vira interface holográfica futurista (ou equivalente da estética do evento). Marcar explicitamente:

```
Premium dark-glass holographic dashboard floating in vacuum. Two columns rendered as sci-fi UI panels. Left muted ({label}), right glowing {color} ({label}).

Title: **"{título}"**

| Coluna 1 | Coluna 2 |
|---|---|
| ... | ... |
```

### Step 7: Transition slides = breathing space

Slides de transição (entre blocos, abertura, fechamento) são minimalistas:

```
Pure breathing space. Dark void. Single beam of light cutting through. Just words.

Title (centered, monumental, gold): **"{frase forte}"**
```

### Step 8: Salvar e verificar

Salvar em `briefing-manus-pt{N}.md` (path apontado pelo usuário). Próximo task: `save-and-deliver` quando todos os blocos tiverem briefing.

## Error Handling

| Cenário | Ação |
|---------|------|
| Slide tem visual central (árvore, iceberg, escada) | Descrever DETALHADAMENTE — sem placeholder vago tipo "[diagrama: ...]" (PU-038). Definir composição, cores, elementos rotulados, estilo |
| Style prefix mudou entre partes | BLOQUEAR — refazer com style prefix consistente |
| Visual rhyme aponta pra slide que não existe | Sinalizar e remover marcação |

---

## Cardinal Rules Aplicadas

- Tabelas como dark-glass dashboards (PU-028)
- Transition slides são breathing space (PU-029)
- Style prefix idêntico entre partes (PU-031)
- Visual central importante = descrição detalhada (PU-038)

Ver `data/manus-rules.md` (processo) e `data/briefing-examples/` (estrutura de referência).
