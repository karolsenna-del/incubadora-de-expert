# Enxutar Rules — Densidade Ideal e Princípios de Corte

> Regras pra produzir slides enxutos desde a primeira passada. Aplicado na Fase 5 (transposição) e Fase 6 (revisão).

---

## Limite duro

- **Máximo 5-6 linhas por slide**
- **Cortar 40% na primeira passada** — não esperar feedback do usuário pra cortar

Quando detectar slide com mais de 6 linhas, parágrafo único de 3+ linhas, lista com 6+ bullets, ou múltiplas frases conectadas com "e" — **slide tá denso demais**. Cortar imediatamente.

---

## O que cortar

### Conectivos
"E", "mas", "então", "porque", "quando" — geralmente podem virar nova linha ou frase nova.

### Redundâncias
Se a tabela já mostra o contraste, não precisa explicar em prosa. Se o título já diz, não repete no corpo.

### Frases óbvias
"Como você pode ver" / "Conforme mencionado" / "Vamos discutir agora" — nada disso entra no slide.

### Exemplos verbosos
Exemplo de uma linha funciona melhor que parágrafo. Se precisa explicar muito, vira slide próprio.

### Palavras explicativas redundantes
- "Os 4 pilares são" → "**4 pilares:**"
- "É importante destacar que" → cortar
- "Isso significa que" → cortar

---

## O que NÃO cortar

### Essência da teoria aprovada
**Fidelidade vence brevidade.** Se um conceito da teoria ficou de fora do slide, é problema. Limite de linhas é restrição, não desculpa.

### Termos exatos do usuário
Não substituir "ciborgue" por "humano-IA aumentado" só porque é mais técnico. Termos do usuário ficam.

### Anchors emocionais
Frase italic ao final que ancora o ponto emocionalmente — geralmente vale manter.

### Palavras-chave conceituais
Os 4-5 substantivos centrais do conceito não saem.

---

## Quando dividir 1 conceito em 2-3 slides

- Conceito tem 3+ pontos importantes que não cabem em 6 linhas
- Sub-conceito merece slide próprio (ex: cada princípio de um framework de 4 princípios)
- Contraste binário forte vira tabela ou 2 slides lado a lado
- Sequência evolutiva (3-5 estágios) precisa de 1 slide por estágio

**Regra:** dividir é melhor que comprimir. Slide denso é pior que dois slides leves.

---

## Tabelas pra comparações

Comparações binárias ou ternárias **viram tabelas Markdown**. Mais legível que prosa.

```markdown
| Antes (X) | Agora (Y) |
|---|---|
| pequena descrição | pequena descrição |
| pequena descrição | pequena descrição |
| pequena descrição | pequena descrição |
```

**Não escrever em prosa o que cabe em tabela.**

Exemplos onde tabela funciona:
- Antes vs Depois
- Tradicional vs Novo
- Errado vs Certo
- Estado A vs Estado B vs Estado C
- Listagem comparativa de N opções

---

## Anchors italic ao final

Frase em italic ao final do slide ancora emocionalmente. Curta (5-12 palavras). **Opcional** — não precisa em todo slide.

```markdown
### SLIDE N
**TÍTULO**

Corpo enxuto.
Linhas curtas.

*Frase italic ao final (anchor emocional).*
```

Funciona pra:
- Insights ("Mudou a categoria.")
- Provocações ("Faturamento alto sem base própria não é sucesso — é bomba-relógio.")
- Bridge ("Agora deixa eu te mostrar como construir.")
- Síntese poética ("Pequena agora. Mas com o código de algo grande dentro.")

**Não funciona pra:** descrição literal, conclusão óbvia, fala-de-palco genérica.

---

## Formato consistente

Cada slide segue padrão visual idêntico:

```markdown
### SLIDE N
**TÍTULO EM CAPS** (ou frase forte)

Corpo enxuto.
Sem firulas.

*Frase italic ao final (opcional).*
```

**Variações que funcionam:**

**Tabela como corpo:**
```markdown
### SLIDE N
**TÍTULO**

| col 1 | col 2 |
|---|---|
| ... | ... |

*Anchor italic.*
```

**Slide de transição/breathing:**
```markdown
### SLIDE N
**FRASE FORTE CENTRAL**

*Anchor curtíssimo.*
```

**Slide com bullet list:**
```markdown
### SLIDE N
**TÍTULO**

- Bullet 1 — descrição curta
- Bullet 2 — descrição curta
- Bullet 3 — descrição curta

*Anchor italic.*
```

---

## Detecção de slide denso

**Sinais que o slide tá denso:**
- Mais de 6 linhas
- Parágrafo único de 3+ linhas
- Múltiplas frases conectadas com "e"
- Lista com 6+ bullets
- Reação tipo "parece um livro, é um slide amigo"

→ Quando detectar, **cortar 40% imediatamente**.

---

## Benchmark de referência

Consultar `slides-content-reference.md` (167 slides do workshop NDF original) pra ver concretamente o que é "aula/apresentação inteligente":

- Densidade textual ideal
- Formato dos slides
- Padrão de tabelas
- Anchors italic
- Organização por blocos
- Numeração contínua

**Aviso:** essa referência é técnica (densidade/formato/estrutura), não estética. Estética é definida na Ponte 6→7 com o usuário do evento.
