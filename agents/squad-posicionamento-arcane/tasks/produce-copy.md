---
task: "Produce Copy"
responsavel: "@vitrine-strategist"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Item da vitrine aprovado pelo aluno + aluno aceitou 'quer ajuda pra produzir?'"
Saida: "Copy completa do item entregue em formato copiavel"
Checklist:
  - "Tipo de item identificado (bio / destaque / pinned)"
  - "KB consultada (metodo audience + copy oferta + nucleo)"
  - "Copy carrega elementos do nucleo (rastreavel)"
  - "Vocabulario do publico-alvo aplicado"
  - "Formato copiavel entregue (linha a linha pra stories, frame a frame pra reel, slide a slide pra carrossel)"
  - "Aluno aprovou a copy produzida"
execution_type: "semantic"
---

# Task: Produce Copy — Producao de Copy Sob Demanda

**Task ID:** posicionamento-digital/produce-copy
**Version:** 1.0.0
**Category:** Vitrine / Auxiliar

---

## Executive Summary

Task auxiliar chamada quando aluno aceita "quer ajuda pra produzir?" apos cada item da vitrine. Agent produz copy completa usando KB embarcada + nucleo do aluno.

Reusada por: bio, destaques, pinned posts.

---

## Inputs

- Item da vitrine aprovado (bio / destaque-X / pinned-X)
- Estrutura/briefing definido na task anterior (build-{item}.md)
- Nucleo completo (rastreabilidade)
- Tipo de copy a produzir:
  - Bio: texto final formatado
  - Stories de destaque: sequencia de stories (geralmente 4-7)
  - Pinned: roteiro de Reel OU slides de Carrossel

**KB consultada:** 
- `data/metodo-audience-completo.md` (apresentacao magnetica, modelos, crencas)
- `data/copy-de-oferta.md` (estrutura ruminacao→solucao→produto→CTA pra Pinned 3)
- `data/vitrine-instagram-2026.md` (regras de formato por item)

---

## Outputs

- Copy completa em formato copiavel
- Rastreabilidade: cada parte da copy tem origem no nucleo (qual ponto/crenca)
- Marcacoes visuais sugeridas (frame X / slide Y)
- Nota visual (o que aparece visualmente em cada parte)

---

## Step-by-Step Execution

### Step 1: Identificar Tipo

Baseado no contexto (qual task chamou):

| Origem | Tipo de Copy |
|--------|--------------|
| build-bio.md → produce-copy | Bio formatada pra colar |
| build-destaques.md → produce-copy | Sequencia de stories pra destaque |
| build-pinned-posts.md → produce-copy | Roteiro de Reel OU slides de Carrossel |

### Step 2: Coletar Inputs

- Estrutura definida na task anterior
- Aprovacoes do aluno na task anterior
- Nucleo completo
- Vocabulario do publico

### Step 3: Aplicar Regras por Tipo

#### Tipo A — Bio

**Regras:**
- Limite 150 chars
- Quebras de linha estrategicas (Instagram trata diferente)
- 1-2 emojis estrategicos SE com funcao (ex: ↓ pra link)
- CTA final acima do link

**Output formatado:**
```
[texto da bio com quebras exatas]

— Char count: N / 150
— Notas: [emojis usados e por que]
```

#### Tipo B — Stories de Destaque

**Regras:**
- 4-7 stories por destaque (mais que isso perde retencao)
- Cada story com gancho proprio
- Sequencia narrativa: gancho → desenvolvimento → CTA
- Use vocabulario do publico
- Stories podem ter texto + foto + video — agente entrega o TEXTO + nota visual

**Output formatado:**
```
═══════════════════════════════════════
DESTAQUE: [NOME]
Total de stories: N
═══════════════════════════════════════

STORY 1
Texto: "[texto que aparece]"
Nota visual: [foto / video / boomerang / outro elemento]
Funcao: [hook / desenvolvimento / CTA]
Carrega do nucleo: [Ponto X / Crenca Y]

STORY 2
[idem]

...

STORY N
[idem]

═══════════════════════════════════════
PARA POSTAR:
═══════════════════════════════════════

Pode postar todos juntos ou um por dia (lembrar de adicionar 
ao destaque). Ordem recomendada: como ta listado acima.
```

#### Tipo C — Pinned 1 (Sobre) — Reel

**Regras:**
- Roteiro pra video curto (30-60s)
- Primeiro frame = HOOK forte
- Apresentacao magnetica usada (uma das versoes do nucleo)
- Falado natural (le em voz alta — soa natural?)
- CTA no final

**Output formatado:**
```
═══════════════════════════════════════
PINNED 1 — SOBRE [NOME] (Reel ~45s)
═══════════════════════════════════════

[FRAME 1 — HOOK (3 primeiros segundos)]
Falar: "[hook]"
Nota visual: [voce olhando pra camera, energia alta]
Tempo: 3s

[FRAME 2-3 — Apresentacao]
Falar: "[apresentacao magnetica — modelo X do nucleo]"
Nota visual: [...]
Tempo: 15s

[FRAME 4-5 — Trajetoria / Diferencial]
Falar: "[trajetoria breve + crenca central]"
Nota visual: [B-roll, mudanca de cenario, gestos]
Tempo: 15s

[FRAME FINAL — CTA]
Falar: "[CTA especifico]"
Nota visual: [aponta pra bio]
Tempo: 5s

═══════════════════════════════════════
TOTAL: ~45s
═══════════════════════════════════════

CARRADO DO NUCLEO:
- Apresentacao magnetica: Modelo X
- Crenca central usada: "[crenca]"
- Dor abordada: "[dor]"
- Beneficios mencionados: [...]
```

#### Tipo C2 — Pinned 1 (Sobre) — Carrossel

**Regras:**
- 6-10 slides
- Slide 1 = capa com nome + foto + 1 frase de identidade
- Texto pra LEITURA (Instagram, nao apresentacao)
- CTA no ultimo slide

**Output:** [Estrutura similar a Reel mas slide a slide, com nota visual de cada slide]

#### Tipo D — Pinned 2 (Tese/Crenca)

**Regras:**
- Formato CARROSSEL (mais profundo, salvavel)
- 6-10 slides
- Slide 1 = capa com a frase-bandeira
- Desenvolvimento da crenca em slides 2-N
- CTA + chamada de tribo no final

**Output formatado:**
```
═══════════════════════════════════════
PINNED 2 — TESE: "[CRENCA]"
Formato: Carrossel, N slides
═══════════════════════════════════════

[SLIDE 1 — CAPA]
Texto principal: "[FRASE-BANDEIRA]"
Subtitulo: "[contexto curto]"
Nota visual: texto grande em fundo contrastante

[SLIDE 2 — Quebra de expectativa / Mentira do publico]
Texto: "[A maioria acredita que X]"
Nota visual: [...]

[SLIDE 3 — Sua tese]
Texto: "[Mas a verdade e Y]"

[SLIDE 4-5 — Desenvolvimento]
Texto: "[Por que / como / implicacao]"

[SLIDE 6 — Exemplo / case]
Texto: "[caso pratico]"

[SLIDE 7 — Implicacao pessoal]
Texto: "[o que isso significa pra quem ouve]"

[SLIDE FINAL — CTA + tribo]
Texto: "[CTA] / [chamada de tribo]"

═══════════════════════════════════════
CARREGADO DO NUCLEO:
- Crenca: "[crenca escolhida]"
- Mentira do publico (Ponto 8): "[mentira]"
- "Nao faz sentido" (Ponto 9): "[indignacao]"
```

#### Tipo E — Pinned 3 (Oferta)

**ESTRUTURA OBRIGATORIA:** ruminacao → solucao → produto → CTA

Aplicar `data/copy-de-oferta.md` integralmente.

**Output formatado:**
```
═══════════════════════════════════════
PINNED 3 — [NOME DO PRODUTO]
Formato: Carrossel, 8 slides
Estrutura: Ruminacao → Solucao → Produto → CTA
═══════════════════════════════════════

[SLIDE 1 — CAPA]
Texto: "[NOME PRODUTO] — [BENEFICIO CHAVE]"
Nota visual: hierarquia clara, fundo contrastante

═════ RUMINACAO ═════

[SLIDE 2 — Pintura da dor]
Texto: [...]
Carrega: Ponto 5 (dor) + Ponto 6 (inimigo)

[SLIDE 3 — Tentativas frustradas]
Texto: [...]
Carrega: Ponto 7 (solucoes alternativas)

═════ SOLUCAO ═════

[SLIDE 4 — Angulo unico]
Texto: "A unica forma de sair de [X] e..."
Carrega: Ponto 10

[SLIDE 5 — Negacao de alternativas]
Texto: "Nao e [Y]. Nao e [Z]. E [W]."

═════ PRODUTO ═════

[SLIDE 6 — Apresentacao do produto]
Texto: "[NOME]: formato + breve descricao + 3 beneficios"
Carrega: Ponto 11

[SLIDE 7 — Prova]
Texto: "[case OU numero OU nome forte]"

═════ CTA ═════

[SLIDE 8 — Chamada]
Texto: "[CTA especifico] / [Urgencia ou restricao]"

═══════════════════════════════════════
```

### Step 4: Apresentar Copy

```
Copy produzida. Tudo abaixo pronto pra copiar/colar:

[copy completa formatada]

═══════════════════════════════════════
RASTREABILIDADE — Conexao com Nucleo
═══════════════════════════════════════

- [Parte X] vem do Ponto Y do seu nucleo
- [Crenca usada]: [crenca Z]
- [Vocabulario aplicado]: [palavra A do seu publico]

═══════════════════════════════════════

Bate? Ajustar algo?
```

### Step 5: Loop ate Aprovacao

Aluno aprova ou pede ajuste. Loop ate check.

### Step 6: Marcar Como Produzido

```yaml
vitrine.{item}:
  copy_produzida: true
  copy_completa: "[texto completo]"
  rastreabilidade: {ponto_X: trecho, ponto_Y: trecho, ...}
  formato: "reel|carrossel|sequencia_stories"
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Item nao foi aprovado na task anterior | Recusa: "preciso do check do item primeiro antes de produzir copy" |
| Aluno quer copy mas o item e bio (texto curto) | Faz versao formatada (com emoji se faz sentido, char count, quebras) |
| Aluno quer ajustes que VIOLAM estrutura (ex: pular ruminacao no Pinned 3) | CONFRONTA com base tecnica |
| Copy fica longa demais (Reel > 90s, Carrossel > 12 slides) | Sugere cortar — mostra o que tirar |
| Aluno aprova rapido demais sem ler | Confronta: "Le com calma. Vai postar pra MILHARES." |

---

**Task Status:** Ready for Production
