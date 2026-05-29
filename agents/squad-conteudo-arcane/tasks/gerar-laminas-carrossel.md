---
task: "Gerar Lâminas Carrossel"
responsavel: "@mack-produtor"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "roteiro.md aprovado (formato = carrossel)"
Saida: "laminas-carrossel.md com texto + sugestao visual + prompt GPT por slide"
Checklist:
  - "Roteiro carregado e seções carrossel identificadas"
  - "Slide 1 = capa com hook visual + textual"
  - "Slide 2 = reforço do hook"
  - "Slides intermediarios = 1 ideia/slide"
  - "Slide N = CTA + assinatura"
  - "Cada slide tem: texto pra Canva + sugestao visual + prompt GPT pronto"
  - "Orientacao de execucao incluida (GPT → Canva ou squad de design)"
  - "Salvou laminas-carrossel.md"
execution_type: "interactive"
---

# Task: Gerar Lâminas Carrossel — Passo 6 (Carrossel)

**Task ID:** squad-conteudo-arcane/gerar-laminas-carrossel
**Version:** 1.0.0
**Responsavel:** @mack-produtor
**Category:** Rotina por Post — Producao
**Execution Type:** Interactive

---

## Pipeline Visual

```
gerar-laminas-carrossel
  |
  v
STEP 1: CARREGAR ROTEIRO
  Identificar layout slide-a-slide (Rico ja dividiu)
  |
  v
STEP 2: PARA CADA SLIDE GERAR
  Texto + Sugestao visual + Prompt GPT
  |
  v
STEP 3: ORIENTACAO DE EXECUCAO
  Caminho A (GPT + Canva) ou B (Squad de design)
  |
  v
STEP 4: SALVAR laminas-carrossel.md
```

---

## Step 1: Carregar Roteiro

Mack abre `docs/producao-conteudo/{expert}/posts/{slug}/roteiro.md`.

Rico já dividiu o roteiro em slides na seção "Adaptar ao Formato". Mack vai expandir cada slide com:
- Texto pra Canva (formatação visual recomendada)
- Sugestão visual (descrição da imagem)
- Prompt pronto pro GPT (geração de imagem)

---

## Step 2: Para Cada Slide

### Slide 1 — Capa

Função: parar o scroll. Hook visual + textual.

```markdown
### SLIDE 1 — CAPA (para o scroll)

TEXTO (formato visual sugerido):
  Fonte: grande (60-80pt)
  Cor: alto contraste (texto escuro em fundo claro OU vice-versa)
  Posicionamento: centralizado vertical
  Texto: "{hook textual do roteiro}"

SUGESTAO VISUAL:
  "{descrição da imagem ou estética da capa}"

PROMPT PRO CHATGPT:
  "{prompt pronto pra colar, gerando imagem 1080x1350}"
```

### Slide 2 — Reforço do Hook

Função: Audience diz que slide 2 reaparece pra quem não pegou o 1º. Reforça hook.

```markdown
### SLIDE 2 — REFORÇO DO HOOK

TEXTO:
  "{reforço do hook — mesma ideia, palavras diferentes}"

SUGESTAO VISUAL: {complementar ao slide 1}

PROMPT PRO CHATGPT: {variação visual}
```

### Slides Intermediários (3 a N-1)

Função: 1 ideia por slide. Conteúdo notável + loopings.

Para cada um:

```markdown
### SLIDE {N} — {título da ideia}

TEXTO:
  Headline: "{título curto, fonte grande}"
  Corpo: "{2-4 linhas, fonte média}"

SUGESTAO VISUAL: "{descrição da imagem que ilustra a ideia}"

PROMPT PRO CHATGPT: "{prompt}"

ELEMENTO NOTÁVEL APLICADO: {qual dos 8}
LOOPING: {abre/fecha/avança}
```

### Slide N — CTA + Assinatura

Função: CTA contextual + posicionamento + handle do expert.

```markdown
### SLIDE N — CTA + ASSINATURA

TEXTO:
  CTA: "{CTA específico de reconhecimento do roteiro}"
  Posicionamento: "{frase de fechamento que constrói visão de mundo}"
  Assinatura: "{handle do expert + foto se houver}"

SUGESTAO VISUAL: "{fundo neutro elegante OU complementar}"

PROMPT PRO CHATGPT: "{prompt}"
```

---

## Step 3: Orientação de Execução

Mack entrega 2 caminhos:

### Caminho A — Expert produz sozinho

```
═══════════════════════════════════════════════════════════════
COMO EXECUTAR — CAMINHO A (você produz)
═══════════════════════════════════════════════════════════════

PASSO 1: GERAR IMAGENS (15-20 min)
  - Abre ChatGPT (versão com geração de imagem)
  - Pra cada slide: copia o PROMPT, cola, gera
  - Se não gostar: pede variação ("mais editorial", "mais
    minimalista", "mais dramático")
  - Salva imagem aprovada no celular/computador

PASSO 2: MONTAR NO CANVA (20-30 min)
  - Cria carrossel Instagram (1080x1350)
  - N páginas, uma por slide
  - Importa imagens geradas
  - Adiciona textos com tipografia da tua marca
  - Ajusta tamanho de texto pra mobile (testa no celular antes)
  - Exporta cada slide em PNG/JPG

PASSO 3: PUBLICAR (manual)
  - Instagram Carrossel — sobe os N slides na ordem
  - Caption: usa hook do roteiro + 2-3 linhas + CTA
```

### Caminho B — Squad de design dedicado

```
═══════════════════════════════════════════════════════════════
COMO EXECUTAR — CAMINHO B (squad de design)
═══════════════════════════════════════════════════════════════

Se voce tem (ou cria) um squad de design dedicado:
- Manda as laminas pra ele
- Ele produz carrossel finalizado na identidade visual da
  tua marca (cores, tipografia, layout)
- Voce so revisa e publica

Vantagem: identidade visual consistente, mais profissional.
Custo: precisa ter squad de design ou outsourcing.
```

---

## Step 4: Princípios de Design Pro Carrossel

Mack lembra ao expert dos princípios:

```
═══════════════════════════════════════════════════════════════
PRINCIPIOS DE DESIGN (importante!)
═══════════════════════════════════════════════════════════════

✓ MOBILE-FIRST: texto legível mesmo em tela pequena
✓ HIERARQUIA: título grande, corpo médio, detalhes pequenos
✓ ALTO CONTRASTE: texto escuro em fundo claro OU texto claro
  em fundo escuro
✓ 1 IDEIA POR SLIDE: não polui
✓ IMAGEM COM PROPÓSITO: ilustra a ideia, não decora
✓ ÚLTIMA LÂMINA: sempre tem CTA + posicionamento
```

---

## Step 5: Salvar laminas-carrossel.md

Salva em `docs/producao-conteudo/{expert}/posts/{slug}/laminas-carrossel.md`:

```markdown
# Lâminas Carrossel — {slug}

**Tema:** {tema}
**Formato:** Carrossel ({N} slides)
**Roteiro fonte:** {link relativo pro roteiro.md}

---

## Slide 1 — Capa
[completo conforme Step 2.A]

## Slide 2 — Reforço do Hook
[completo]

## Slide 3 — {título da ideia}
[completo]

[... slides 4 até N-1 ...]

## Slide N — CTA + Assinatura
[completo]

---

## Como Executar

[Caminho A — GPT + Canva — completo]

[Caminho B — Squad de Design — completo]

---

## Princípios de Design

[lista completa]

---

## Caption pro Instagram (sugestão)

{caption sugerida usando hook + 2-3 linhas + CTA}

Hashtags (opcionais): {3-5 hashtags do nicho}
```

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| Expert quer + de 20 slides | "Carrossel acima de 15 perde retenção. Vamos consolidar?" |
| Expert quer pular slide CTA | "CTA é onde puxa pra teu produto. Sem ele, post não vende." |
| Expert quer slide com 5+ ideias | "1 ideia por slide. Vamos dividir em mais slides." |
| Expert não usa Canva nem GPT | Sugere alternativas (Adobe Express grátis, Figma free) + ou caminho B. |

---

## Quality Gate

**Lâminas prontas pra produção**

Checklist:
- [ ] Slide 1 com hook em destaque
- [ ] Slide 2 com reforço do hook
- [ ] N-2 slides intermediários (1 ideia/slide)
- [ ] Slide N com CTA + assinatura
- [ ] Cada slide tem: texto + sugestão visual + prompt GPT
- [ ] Orientação de execução incluída
- [ ] Princípios de design listados
- [ ] Caption sugerida pronta
- [ ] Salvo em laminas-carrossel.md

---

## Próximo Passo

Após lâminas entregues:

```
Laminas prontas. Salvei em
`docs/producao-conteudo/{expert}/posts/{slug}/laminas-carrossel.md`.

Pode produzir agora ou pausar pra depois. Tempo estimado de
producao: 35-50 min (15-20 gerando imagem + 20-30 montando Canva).

Quando postar, manda os numeros pra Aria diagnosticar:
- Views, retencao, interacao, comentarios
- Ou print do Instagram Insights

Bora pro proximo post ou ta bom por aqui?
```

→ Volta pro Vox.

---

**Task Status:** Ready for Production
