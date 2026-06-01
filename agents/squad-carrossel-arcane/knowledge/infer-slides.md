# Inferir Numero de Slides a Partir de Copy

## Heuristicas

### 1. Quebras explicitas

Se copy tem marcadores como:

```
=== SLIDE 1 ===
...
=== SLIDE 2 ===
...
```

ou

```
[SLIDE 1]
...
[SLIDE 2]
...
```

→ usar exatamente N slides marcados

### 2. Numeracao

Se copy tem:

```
1. Primeiro ponto...
2. Segundo ponto...
3. Terceiro ponto...
```

→ N items numerados + 1 capa + 1 CTA = N+2 slides

### 3. Linhas vazias duplas

Se copy separa blocos com linhas vazias duplas (paragrafos), cada bloco vira candidato a slide.

### 4. Densidade de palavras

Limite por slide:
- Capa: max 7-10 palavras
- Conteudo: max 25-30 palavras
- CTA: max 15 palavras

Se um bloco passa de 30 palavras, dividir em 2.

### 5. Estrutura logica

Procurar marcadores de estrutura:
- "Primeiro... Segundo... Terceiro..." → N + 2 slides
- "Antes... Depois..." → 2 slides + capa + CTA = 4
- "Problema... Solucao... Resultado..." → 3 + capa + CTA = 5

## Algoritmo Pragmatico

```python
def infer_slide_count(copy_text):
    # 1. Quebras explicitas
    if "=== SLIDE" in copy_text:
        return count_slide_markers(copy_text)

    # 2. Numeracao
    numbered_items = count_numbered_items(copy_text)
    if numbered_items >= 3:
        return numbered_items + 2  # +capa +CTA

    # 3. Paragrafos
    paragraphs = [p for p in copy_text.split("\n\n") if p.strip()]
    if len(paragraphs) >= 3:
        return len(paragraphs)  # cada paragrafo vira 1 slide

    # 4. Fallback: estimativa por palavras
    word_count = len(copy_text.split())
    estimated = max(3, min(15, word_count // 25 + 2))
    return estimated
```

## Sempre Confirmar com Aluno

Apos inferir N, confirmar:

```
Vai {N} slides:
- Slide 1 (capa): "{primeiras palavras}..."
- Slide 2: "{primeiras palavras}..."
- ...
- Slide N (CTA): "{ultimo bloco}..."

Ta certo ou ajustamos?
```

Aluno pode dizer:
- "Junta slide 3 e 4"
- "Separa slide 5 em 2"
- "Tira o CTA, ja tem"
- "Adiciona um slide entre 6 e 7 com {texto}"

Aplicar mudancas e re-confirmar.
