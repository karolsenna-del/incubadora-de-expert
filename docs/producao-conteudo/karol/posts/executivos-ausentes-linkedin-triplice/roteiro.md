# Roteiro — executivos-ausentes-linkedin-triplice (Carrossel de Dor)

> Squad: Conteúdo Arcane (Rico — roteirista) | Data: 01/08/2026
> Formato: Carrossel de Dor — 7 slides, 1080x1350px | CTA: pergunta direta (teste hipótese Aria)
> Base: `teoria.md` (Sage) + `perfil-tom-de-voz.md`
> Hook escolhido: Hook 1 do leque (Fato curioso + Contra-intuitivo)
> Capa: template **TWEET** (card-tweet padrão, igual ao resto do post) — imagem é o print real da matéria da FGV (cropado, sem banner de cookie/scrollbar), comentário curto por cima. Era foto da Karol → virou capa dark com print+headline → virou isso (3 iterações, 02/08).

---

## Estrutura Macro

**Hook (Slide 1):** dado contra-intuitivo (metade dos executivos ausente). Gatilhos: Fato curioso + Reconhecimento.
**Conteúdo (Slides 2-6):** reframe do medo, framework da Tríplice, aplicação.
**CTA (Slide 7):** pergunta direta de autodiagnóstico — teste da hipótese da Aria.

---

## Roteiro Slide a Slide

### Slide 1 — CAPA (Hook 1) — template TWEET (card-tweet, com imagem)
**Texto:**
> "E não é preguiça. É medo de aparecer errado."
**Imagem:** print da matéria da FGV (cropado — só logo/menu/manchete/subtítulo, sem banner de cookie nem scrollbar), `assets/fgv-manchete-cropped.png`

**Ajuste 02/08 (feedback da Karol, 3 iterações):** 1ª — capa trocada de foto da Karol pra print da FGV, mas em layout dark customizado (print em cima + headline em bloco preto). 2ª — Karol achou estranho o preto destoando do resto branco, trocado pro mesmo layout só com fundo branco. 3ª — Karol pediu pra simplesmente seguir o template TWEET padrão (igual slides 2-7): print vira a imagem do card, texto reduzido só à frase de destaque ("E não é preguiça..."), sem a 1ª linha ("Metade dos executivos..."). Versão final renderizada pelo motor padrão (`build-carousel.mjs`), não mais manual — mesmo pipeline do resto do post.

**Gatilhos:** Fato curioso + Reconhecimento
**Elemento notável:** Fato curioso
**Looping:** Abre L1 — "medo de aparecer errado ou outro problema?"

---

### Slide 2 — O Contexto
**Texto:**
> "Não é falta de plateia."
**Destaque:**
> "65 milhões de tomadores de decisão usam o LinkedIn no Brasil. A audiência já tá lá."

**Elemento notável:** Prova/argumentação poderosa
**Looping:** Reforça L1

---

### Slide 3 — O Reframe
**Texto:**
> "Aparecer errado não é o problema."
**Destaque:**
> "O problema é aparecer sem saber quem você serve, quem você é, e como você entrega — ao mesmo tempo."

**Elemento notável:** Contra-intuitivo
**Looping:** Fecha L1. Abre L2 — "isso tem nome?"

---

### Slide 4 — A Tríplice
**Texto:**
> "Tem nome: a tríplice do posicionamento de autoridade."
**Destaque:**
> "Persona (pra quem você fala) + História (quem você é) + Método (como você entrega)."

**Elemento notável:** Valor prático + Informação nova
**Looping:** Reforça L2

---

### Slide 5 — A Identificação
**Texto:**
> "Se você é reconhecida no offline e invisível no digital —"
**Destaque:**
> "você não tem um problema de exposição. Tem um problema de alinhamento."

**Elemento notável:** Identificação
**Looping:** Fecha L2. Abre L3 — "o que muda quando alinha?"

---

### Slide 6 — A Virada
**Texto:**
> "Quando os 3 elementos se alinham, você para de ser 'mais uma'."
**Destaque:**
> "E vira 'a única' — narrativa clara, consistente, confiável."

**Elemento notável:** Punchline + Alívio
**Looping:** Fecha L3

---

### Slide 7 — CTA + Assinatura
**Texto:**
> "Das 3 peças —"

**CTA (pergunta direta — teste):**
> "persona, história ou método — qual você já tem clara? Comenta o número (1, 2 ou 3) 👇"

**Assinatura:** @karolsenna._
**Looping:** Fecha o post com autodiagnóstico

---

## Anotações pro Mack

- **Formato:** Carrossel de Dor, 7 slides.
- **Slide 1 (capa):** template **FOTO** — usar foto real da Karol (postura firme, ambiente neutro/profissional). Reforço temático: o post fala de "aparecer com clareza", a capa já demonstra na prática.
- **Slide 4:** pode usar elemento visual de 3 ícones/blocos (persona + história + método) pra reforçar a estrutura de forma visual, não só textual.
- **Slide 7:** CTA pede escolha numérica (1, 2 ou 3) — fácil de responder rápido, mede padrão de resposta (qual das 3 peças mais falta pro público).

---

## Análise Técnica

### Mapa de Loopings
```yaml
loopings:
  - id: L1
    abre: "Slide 1 — metade dos executivos ausente"
    reforça: "Slide 2 — 65 milhões de decisores já estão lá"
    fecha: "Slide 3 — aparecer errado não é o problema"
  - id: L2
    abre: "Slide 3 — isso tem nome?"
    reforça: "Slide 4 — a tríplice + Slide 5 — identificação"
    fecha: "Slide 6 — a virada de 'mais uma' pra 'a única'"
```

### Elementos Notáveis Usados
Fato curioso (S1), Prova (S2), Contra-intuitivo (S3), Valor prático + Informação nova (S4), Identificação (S5), Punchline + Alívio (S6)

### Variação Emocional
Choque contra-intuitivo (S1) → contexto/segurança (S2) → confronto suave (S3) → clareza estrutural (S4) → identificação/vulnerabilidade (S5) → alívio/convicção (S6) → autodiagnóstico ativo (S7)

---

## Versão / Iterações

**V1** — 01/08/2026 — roteiro inicial, teste de batelada CTA-pergunta.
