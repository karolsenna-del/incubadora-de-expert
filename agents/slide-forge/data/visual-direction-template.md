# Visual Direction Template — Ponte 6→7

> Como capturar a direção visual do evento com o usuário ANTES de escrever o briefing pro Manus.

---

## Quando essa task acontece

Imediatamente ANTES da Fase 7 (Briefing Manus). O conteúdo dos slides já está aprovado em todos os blocos. Agora visual-briefer captura a direção visual com o usuário.

**É O ÚNICO MOMENTO onde se decide a estética visual.** Se essa fase é apressada, o briefing fica genérico e o Manus produz coisa fora do tom.

---

## Sessão de captura — 4 perguntas

### 1. Vibe / Sentimento

> *"Como você quer que o público SINTA olhando os slides?"*

Capturar (literal, sem filtrar):
- Adjetivos que o usuário usa
- Comparações ("tipo Apple", "estilo cinemático", "como TEDx mas com mais peso")
- Sentimentos primários (revelação, peso, esperança, awe, suspense, intimidade, urgência)
- Energia do evento (palestra solene? aula didática? workshop intenso? treinamento corporativo?)

**Exemplos do que pode aparecer:**
- "Cinematográfico premium, dark, com peso"
- "Clean apple keynote, branco, espaço"
- "Vibrante e jovem, cores fortes, energia"
- "Sóbrio corporativo, azul, conservador"
- "Orgânico natural, terroso, humano"
- "Sci-fi futurista, holographic, tech"
- "Minimalista zen, muito espaço, poucas palavras"

### 2. Referências visuais

> *"Tem referências visuais? Filmes, decks de outras apresentações, sites, marcas, obras de arte?"*

- Capturar links, imagens, descrições verbais
- Aceitar refs verbais ("estilo Blade Runner", "tipo Vogue")
- **Não filtrar** — captura tudo
- Se o usuário enviar imagem, descrever o que vê na imagem (Manus precisa de palavras, não da imagem direta)

### 3. Design system (se tiver)

> *"Tem design system pronto? Paleta, fontes, logos, padrões?"*

**Se sim:**
- Pedir paleta hex
- Pedir fontes (nomes específicos ou amostras)
- Pedir logos / símbolos da marca
- Pedir doc do design system se existir
- Capturar padrões visuais já estabelecidos

**Se não:**
- Vai construir a partir da vibe + refs (não tem problema, só sinaliza)

### 4. O que EVITAR

> *"Tem alguma estética que você definitivamente NÃO quer? Tipo 'genérico TEDx' ou 'corporativo chato'?"*

Capturar negativos pra entrar no `NEGATIVES:` do style prefix.

**Exemplos comuns de negativos:**
- "Genérico TEDx (3 palavras gigantes na tela)"
- "Corporativo chato (azul navy, fontes serifadas pesadas)"
- "Clipart"
- "Stock photos"
- "Cartoon"
- "Gradients cafonas"
- "Templates PowerPoint"

---

## Output — `direcao-visual-{evento}.md`

Salvar exatamente assim (preencher cada seção com a captura literal):

```markdown
# Direção Visual — {Nome do Evento}

> Capturado em {DD/MM/AAAA} com o usuário.

---

## Vibe / Sentimento

{captura literal das palavras do usuário, mantida fielmente}

**Energia do evento:** {palestra/aula/workshop/treinamento}
**Sentimento primário:** {ex: cinematográfico premium com peso emocional}
**Sentimento secundário:** {ex: hope, revelation}

---

## Referências

{links, imagens descritas, decks, marcas, filmes — tudo o que o usuário trouxe}

- Ref 1: {descrição}
- Ref 2: {descrição}
- ...

---

## Design System

{Se o usuário tiver:}

**Paleta:**
- Background: {hex}
- Primary text: {hex}
- Accent 1 ({função}): {hex}
- Accent 2 ({função}): {hex}
- ...

**Tipografia:**
- Títulos: {fonte}
- Corpo: {fonte}
- Labels/badges: {fonte}

**Logos / símbolos:**
- {paths ou descrições}

**Padrões visuais:**
- {ex: glass-morphism, neon glow, dark cards, etc}

{Se NÃO tiver:}
> Sem design system pronto. Construído a partir de vibe + refs.

---

## Negativos (o que EVITAR)

- {item 1}
- {item 2}
- {item 3}
```

---

## Esse documento alimenta diretamente o Style Prefix

A próxima task (`build-style-prefix`) usa esse documento como input ÚNICO pra montar o style prefix do briefing. Sem template fixo. **Cada evento tem style prefix próprio derivado da direção visual definida.**
