# Manus Slides — Boas Praticas e Dicas

> Como produzir apresentacoes de qualidade no Manus usando Nano Banana Pro.
> Fonte: documentacao oficial Manus + blog posts + testes praticos.
> Atualizado: 25/03/2026

---

## Nano Banana Pro — O Modelo de Slides

Nano Banana Pro e o modelo de geracao de imagens do Manus (baseado no Gemini 3 Pro do Google). Cada slide e gerado como **imagem de alta resolucao** — texto, diagramas, icones sao renderizados DENTRO da imagem.

### Caracteristicas

| Aspecto | Detalhe |
|---------|---------|
| **Output** | Imagem por slide (nao e PPTX editavel com caixas de texto) |
| **Forte** | Text rendering nitido, diagramas conceituais, consistencia visual |
| **Fraco** | Nao editavel pos-geracao (precisa regerar), portugues menos preciso que ingles |
| **Volume** | Aguenta deck inteiro numa task so — sem limite pratico |
| **Sem memoria** | Cada geracao e independente — estilo precisa repetir |
| **Tempo** | 2-5 min por batch |

### Quando usar Nano Banana Pro vs HTML Slides

| Cenario | Usar |
|---------|------|
| Keynote, pitch, workshop — impacto visual | **Nano Banana Pro** |
| Dados que mudam frequentemente, tabelas editaveis | HTML slides |
| Apresentacao que precisa de edicao rapida pos-geracao | HTML slides |

---

## Estrutura do Prompt — Nano Banana Pro

### Style Prefix (obrigatorio, repetir em CADA batch)

O style prefix garante consistencia visual entre batches. Incluir SEMPRE:

```
Cinematic dark presentation, 16:9 aspect ratio, 1920x1080. Background [hex].
Primary text [hex]. Accents: [hex por funcao]. Typography: clean sans-serif
(Inter/SF Pro style), bold titles 48-60pt, body 20-24pt. Maximum 6 lines per slide.

Art direction: [referencia visual — ex: "Apple keynote meets sci-fi interface"].
[Elementos visuais desejados — ex: "Glowing neon lines, holographic elements,
dark glass surfaces, volumetric lighting"]. [Estetica geral — ex: "Tech-premium,
futuristic but grounded, not cartoonish"].

No clipart, no stock photos, no flat icons, no watermarks, no decorative borders,
no cheesy gradients.
```

**Regra:** instrucoes negativas ("no X, no Y") sao essenciais. Sem elas o modelo adiciona elementos decorativos genericos.

### Briefing por Slide (o equilibrio certo)

NAO microgerenciar cada pixel. NAO deixar 100% livre. O sweet spot:

1. **Titulo bold** — texto exato que aparece no slide (ex: "GUTENBERG" em caps)
2. **Conceito visual** — descricao artistica do que o slide comunica (ex: "holographic brain floating in void")
3. **Texto-chave** — frases que DEVEM aparecer, entre aspas + "exact text, do not paraphrase"
4. **Cor de destaque** — qual accent color usar nesse slide especifico
5. **Energia/atmosfera** — o que o viewer deve SENTIR (ex: "suspense", "revelation", "empathy")

### Exemplo de Briefing por Slide (modelo testado)

```markdown
## Slide 9 — O Custo das Pessoas

Top-left: bold title "O CUSTO" in caps, red #f87171, 48pt. Five vertical
pillars/columns rising from the bottom, each labeled and glowing dimly in
red #f87171: "Financeiro" | "Tempo" | "Risco" | "Emocional" | "Incentivos
desalinhados". The pillars look like weight or burden — dense, heavy, pressing
down. Headline: "Mas pessoas vêm com custos inerentes." Below in smaller text:
"Não porque são ruins. Porque são humanas." — exact text, do not paraphrase.
Empathetic, not aggressive. The red is muted, not alarming — more melancholic
than angry.
```

**Por que funciona:** titulo claro + conceito visual rico + texto travado + cor definida + atmosfera descrita. O Nano Banana tem liberdade criativa MAS dentro de guardrails claros.

---

## Regras de Texto no Nano Banana Pro

| Regra | Detalhe |
|-------|---------|
| **Aspas duplas** | Texto que DEVE aparecer no slide vai entre aspas duplas no prompt |
| **"exact text, do not paraphrase"** | Adicionar apos frases que nao podem ser alteradas (slogans, formulas, promessas) |
| **Portugues** | Funciona mas com precisao menor que ingles — revisar output |
| **Max 6 linhas** | Especificar no style prefix — senao o modelo lota o slide |
| **Monospace/code** | Pedir explicitamente pra termos tecnicos que devem parecer codigo |

---

## Decks Longos

Manus + Nano Banana Pro aguenta deck inteiro numa task so — pode mandar os 75+ slides de uma vez, ele entrega tudo. Nao existe limite pratico tipo "8-12 por batch".

### Quando dividir em tasks separadas (opcional)

Dividir so faz sentido se:
- Voce quer iterar visualmente bloco por bloco (ver Bloco 1 antes de mandar Bloco 2)
- Quer testar style prefix antes de comprometer o deck inteiro
- Cada bloco tem direcao artistica diferente (raro)

Se for dividir, dividir por **bloco tematico** (nao por numero arbitrario), e **manter o style prefix identico** entre tasks pra consistencia.

Pra a maioria dos casos: **uma task com o briefing inteiro funciona bem.**

---

## Direcao Artistica — O Que Funciona

### Art direction que gera resultado premium

- **Referencia cinematica:** "like a frame from a high-budget tech documentary"
- **Iluminacao especifica:** "Rembrandt lighting", "volumetric light cutting through smoke"
- **Materiais:** "dark glass surfaces", "holographic elements", "glowing neon lines"
- **Atmosfera:** "cinematic", "futuristic but grounded", "premium UI feel"

### O que NAO funciona (evitar)

- Descricoes vagas: "make it look good", "professional style"
- Tag soup: "4k, realistic, beautiful, amazing"
- Pedir ilustracoes realistas de pessoas (fica uncanny)
- Deixar o modelo decidir paleta sozinho (perde consistencia entre slides)
- Pedir muitos elementos no mesmo slide (fica poluido)

### Linguagem de Creative Director

O Nano Banana entende **intencao criativa em linguagem natural**. Escreva como se estivesse briefando um designer senior:

- "The brain is beautiful but incomplete — powerful but trapped"
- "Empathetic, not aggressive. The red is muted, not alarming — more melancholic than angry"
- "Feels like the opening frame of a Netflix tech documentary"
- "Suspense. The viewer needs to see the next slide"

Isso e MUITO mais eficaz do que instrucoes tecnicas secas.

---

## Alimentar com Material de Referencia

O Manus fica muito melhor quando recebe fontes reais:

- **Upload de PDFs, CSVs, Excel** — ele extrai dados e cria graficos
- **Forward de email** — manda pro endereco pessoal do Manus, ele monta o deck
- **Google Drive / Notion / arquivos locais** — conecta e sintetiza multiplos docs
- **PPT existente no Knowledge** — ele replica design, cores, fontes e layout

---

## Speaker Notes

O Manus gera talking points automaticamente pra cada slide. Pedir no prompt:

> "Inclui speaker notes em cada slide com talking points pro apresentador"

**Nota:** em modo Nano Banana Pro, speaker notes podem nao ser suportadas (cada slide e imagem). Pedir explicitamente e verificar output.

---

## Refinamento Pos-Geracao

### Nano Banana Pro
- NAO e editavel — precisa **regerar** o slide inteiro
- Use edits conversacionais: "Change the title color to cyan" (o modelo entende bem)
- Se 80% esta bom, peca a mudanca especifica em vez de regerar do zero

### HTML Slides
- Editavel normalmente via conversa:
  - "Expande o bloco 3"
  - "Simplifica o slide 12"
  - "Troca a ordem dos slides 3 e 5"

---

## Exportacao

- **.pptx** — pra trabalho offline (Nano Banana: slides como imagens embutidas)
- **Google Slides** — pra colaboracao
- **PDF** — pra compartilhar

---

## Gestao de Creditos

- Decks consomem creditos proporcionais a complexidade
- Nano Banana Pro consome mais creditos que HTML slides
- O Manus NAO avisa o custo antes de rodar
- **Reserve Nano Banana Pro pra apresentacoes de alto impacto** (pitch, workshop, keynote)

---

## Checklist do Briefing Ideal (Nano Banana Pro)

Antes de mandar pro Manus, verificar:

- [ ] Style prefix completo (hex colors, ratio, tipografia, art direction, negativas)
- [ ] Deck dividido em batches de 8-12 slides
- [ ] Cada slide tem: titulo + conceito visual + texto-chave + cor + atmosfera
- [ ] Frases inegociaveis marcadas com "exact text, do not paraphrase"
- [ ] Formato 16:9 explicito (default e quadrado)
- [ ] Instrucoes negativas incluidas (no clipart, no borders, etc.)
- [ ] Referencia artistica clara (nao vaga)
- [ ] Docs de referencia anexados (se aplicavel)

---

## Workflow Completo (passo a passo)

1. **Escrever briefing completo** com todo o conteudo (pode ser longo, detalhado)
2. **Montar style prefix** com paleta, tipografia, art direction, negativas
3. **Dividir em batches** por bloco tematico (~8-12 slides cada)
4. **Escrever prompt por batch** = style prefix + briefing slide a slide
5. **Disparar 1 task por batch** no Manus (mode: quality)
6. **Revisar output** — checar texto em portugues, consistencia visual, frases travadas
7. **Regerar slides problematicos** via edit conversacional (nao do zero)
8. **Exportar** no formato desejado

---

*Documento atualizado em 25/03/2026*
*Fonte: documentacao oficial Manus + blog posts + testes praticos com Nano Banana Pro*
*Substitui versao anterior de 24/03/2026*
