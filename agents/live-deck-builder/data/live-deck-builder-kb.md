# Live Deck Builder — Knowledge Base

## 1. Contexto do Negócio

A Karol grava lives semanais pro Expert360º/Incubadora de Expert, ~28-40min, sempre em Zoom, seguindo um roteiro falado com estrutura fixa em 4 partes (Narrativa → Execução → Prática → Prova Racional + Pitch), salvo em `business/campanhas/lives-semanais/live-{N}-roteiro.md`.

Até este worker existir, a Karol mandava o roteiro completo pro Gamma (ferramenta paga, ~R$40/mês, apresentações ilimitadas) gerar os slides visuais. Decidiu parar de pagar. Testou e descartou 2 alternativas antes de fechar neste worker:
- **Manus + Nano Banana Pro** (padrão do squad Slide Forge) — não tem conta
- **Geração de imagem via API OpenAI** (pay-per-use, ~US$0,50-2/live) — não compensa vs. Gamma ilimitado por R$40/mês, e nunca gerou API key antes (fricção alta)

Decisão final: deck **sem fotografia nenhuma** — só layout gráfico nativo (cor, tipografia, ícones, cards, gráficos, timelines), gerado por este worker em HTML autocontido. Zero custo, zero dependência externa.

---

## 2. Ferramentas

### 2.1 Renderização nativa (HTML/CSS/SVG)

Não é plataforma externa — é a própria capacidade de geração de código do Claude Code. O deck é um HTML autocontido (CSS inline, sem CDN), paginado por slide (16:9), navegável por teclado/clique, aberto em qualquer navegador, tela cheia (F11) pra compartilhar no Zoom.

**Skills a carregar antes de desenhar:**
- `artifact-design` — fundamentos de design pra páginas HTML, carregar antes da primeira linha de CSS
- `dataviz` — sempre que o slide tiver gráfico, stat, comparação numérica ou timeline

**Limites conhecidos:**
- Sem foto real — só forma geométrica, ícone (emoji/SVG inline), tipografia e cor fazem o trabalho visual
- Sem acesso a banco de imagem — decisão já tomada de não usar
- Precisa funcionar offline/local — sem fetch externo em runtime

### 2.2 Formato de entrega

Combo fechado com a Karol: publica como **Artifact** (link privado, acesso rápido de qualquer navegador) **e** salva cópia standalone em `business/campanhas/lives-semanais/live-{N}-apresentacao.html` (backup offline, caso a internet falhe no dia da live).

---

## 3. Fontes Internas

### 3.1 Fonte primária de conteúdo
`business/campanhas/lives-semanais/live-{N}-roteiro.md` — cabeçalho (Tema, Duração, Modelo) + 4 partes + Checklist Pré-Live + DoD. Fonte única — nunca inventar conteúdo que não esteja lá.

### 3.2 Persona
`docs/knowledge/expert-business/dossie-personas.md` — persona **Laura**, 10 dores/10 desejos/10 objeções/10 urgências ocultas.
`docs/knowledge/expert-business/posicionamento.md` — versão narrativa (dia típico, diálogo interno, pontos A/B/C), frase-tese: *"Diploma é o que você estudou. Método é o que você viveu."*

**Regra de uso:** não perguntar perfil de audiência a cada live — só identificar, no dossiê, qual dor/objeção específica aquela live ataca (geralmente clara no gancho de abertura do roteiro).

### 3.3 Metodologia (referência, quando o roteiro citar)
`docs/knowledge/expert-business/metodologia/expert360-framework-completo.md` — 5Ps canônicos: P1 Persona Compradora, P2 Promessa Transformadora, P3 Processo Autoral, P4 Proposta Validada, P5 Posicionamento de Autoridade. 3 mecanismos proprietários: Narrativa do Método, Vendas Secretas, Autoridade Tríplice.

**Nota:** roteiros antigos (ex: Live 24) chamam "Portfólio Estratégico" de P4 — pelo framework canônico, Portfólio Estratégico é o agente de transição P3→P4, o P4 real é "Proposta Validada". Não é escopo deste worker corrigir roteiros antigos — só não repetir o erro se o roteiro fonte citar os Ps de forma explícita e checável.

### 3.4 Identidade visual

**Logo do deck (default — usar sempre, salvo instrução contrária da Karol):**
- `C:\Users\karol\OneDrive\Documentos\Incubadora de Expert\LiveExpert360 - fundo transparente.png` — logo própria da **live semanal** (wordmark "LIVE EXPERT360" com foguete, cores próprias: preto+laranja+azul+vermelho, fundo transparente, 500×500)
- Usar como **arquivo único, estático**, sem trocar por versão branca/preta conforme o fundo do slide — é assim que foi aprovado nas Lives 25 e 26. Em fundos escuros o "LIVE" (preto) some visualmente, mas "EXPERT360"+foguete permanecem legíveis; em fundos claros/laranja é o inverso. Comportamento aceito, não é bug.
- Tamanho de referência: ~4vw / min 40px de altura (calibrado na Live 25, seção `.foot .badge-chip img`)

**Logos do curso (Expert360º) — NÃO usar no deck de live, só se a Karol pedir explicitamente pra outro contexto:**
- `C:\Users\karol\OneDrive\Documentos\Incubadora de Expert\Logo Expert360 - branco.png` / `Logo Expert360 - preto.png` — identidade do curso gravado, não da live semanal. Ver Regra 3 (`live-deck-builder-rules.md`) — essa troca já causou retrabalho 2x (Live 25 e Live 27), incidente fechado aqui na KB pra não repetir uma 3ª vez.

**Paleta de marca (confirmada, fonte: `Paleta Incubadora.jpeg`):**
| Cor | Hex | Uso |
|-----|-----|-----|
| Laranja | `#f85627` | Destaque, CTA, números, ícones — nunca vermelho |
| Cinza | `#ddddde` | Fundo neutro secundário, texto de apoio |
| Preto | `#090a0b` | Fundo escuro, texto sobre claro |
| Branco | `#fcfcfc` | Fundo claro, texto sobre escuro |

### 3.5 Fotos pessoais (só se algum slide precisar de foto real da Karol — não banco de imagem)
`docs/knowledge/expert-mind/identidade/ativos-visuais.md` → `C:\Users\karol\OneDrive\Pictures\Minhas Fotos`

---

## 4. Catálogo de Tipos de Slide

Calibrado comparando um roteiro falado real (Live 24) com o deck que o Gamma gerou a partir dele — proporção observada: **22 slides pra ~36-40min de fala → 1 slide a cada 1,5-2min.**

| Tipo | Uso | Como fazer sem foto |
|------|-----|----------------------|
| Título | Abertura — nome da live + subtítulo + tag do tema | Cor de fundo sólida + tipografia grande |
| Quote isolada | Frase-âncora, frase de fechamento | Fundo de cor + aspas grandes + fonte serifada |
| História Real | 1 bloco narrativo por história do roteiro | Card com título + 2-3 parágrafos curtos |
| Cards triplos | Lista de 2-3 princípios/eixos | Grid de cards com ícone (emoji/SVG) + label + 1 frase |
| Bloco de estatística | Números/dados concretos (Prova Racional) | Número gigante + label curto |
| Gráfico de barra/comparação | Comparação de valores (ex: ofertas x preço) | Gráfico nativo (seguir `dataviz`) |
| Timeline | Sequência de eventos | Linha do tempo com marcadores |
| Diagrama/mapa conceitual | Relação entre conceitos, ou fio condutor visual (ex: metáfora central da live) | Diagrama SVG simples |
| Resumo final | Recap com 2-3 pontos-chave | Grid de cards numerados — **sempre incluir 1 antes do CTA**, mesmo sem seção equivalente no roteiro |
| CTA final | Call to action + instrução de comentário | Fundo de cor forte + texto grande + destaque na palavra-chave |

**Regra de densidade (crítica):** nenhum slide repete o texto do roteiro verbatim. Título curto + 2-4 frases no máximo por slide. Se o bloco do roteiro for maior, quebrar em mais slides — nunca encolher fonte.

**Regra de variação:** um deck deve usar pelo menos 4 tipos de slide diferentes do catálogo — repetir o mesmo tipo demais é sinal de deck "pobre" (ver `diagnose-issue.md`).

**Fio condutor visual:** quando o roteiro sugerir uma metáfora central recorrente (ex: Live 25 — "pezinho na água": temperatura/profundidade/correnteza/bichos), vira 1 slide de diagrama dedicado — decisão nível 5 (Advise) no Delegation Map, sempre sinalizada no resumo de entrega.

---

## 5. Estrutura Técnica do Deck HTML

Esqueleto de referência — 1 arquivo autocontido, sem dependência externa:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
  :root {
    --laranja: #f85627;
    --cinza: #ddddde;
    --preto: #090a0b;
    --branco: #fcfcfc;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { overflow: hidden; font-family: system-ui, sans-serif; }
  .slide {
    width: 100vw; height: 100vh;
    display: none; flex-direction: column; justify-content: center;
    padding: 6vw; position: relative;
  }
  .slide.active { display: flex; }
  .logo { position: absolute; bottom: 2vw; right: 2vw; height: 3vh; opacity: .85; }
</style>
</head>
<body>
  <div class="slide active" data-bg="preto">...</div>
  <div class="slide" data-bg="branco">...</div>
  <!-- 1 <div class="slide"> por slide -->
<script>
  let i = 0;
  const slides = document.querySelectorAll('.slide');
  function show(n) { slides[i].classList.remove('active'); i = (n + slides.length) % slides.length; slides[i].classList.add('active'); }
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') show(i + 1);
    if (e.key === 'ArrowLeft') show(i - 1);
  });
  document.addEventListener('click', () => show(i + 1));
</script>
</body>
</html>
```

**Regras de implementação:**
- 1 `<div class="slide">` por slide, nunca scroll interno — o conteúdo tem que caber na viewport (reforça a regra de densidade)
- Fundo escuro (`--preto`) e fundo claro (`--branco`/`--cinza`) alternam ao longo do deck pra dar ritmo visual — não usar sempre o mesmo
- Logo aplicada via `<img class="logo">`, trocando o arquivo (branco/preto) conforme `data-bg` do slide
- Navegação por seta/clique — sem exigir mouse específico, funciona em apresentação de tela cheia (F11) no Zoom

---

## 6. Troubleshooting

| Problema | Causa provável | Fix |
|----------|----------------|-----|
| Texto não cabe no slide (overflow) | Condensação insuficiente — bloco do roteiro grande demais pra 1 slide | Quebrar em 2 slides, nunca reduzir a fonte pra forçar caber |
| Logo some no fundo | Versão errada da logo pro fundo (branca em fundo claro, ou vice-versa) | Trocar pra versão com contraste — branca em `--preto`, preta em `--branco`/`--cinza` |
| Deck parece "morto"/sem ritmo | Fundo e layout repetidos slide após slide | Alternar fundo claro/escuro e variar tipo de slide (catálogo seção 4) a cada 2-3 slides |
| Cor fora da paleta aparecendo | Hex inventado em vez dos 4 oficiais | Usar só `#f85627` `#ddddde` `#090a0b` `#fcfcfc` — nunca aproximar visualmente um hex novo |
| Deck não abre corretamente offline | Dependência externa (CDN, fonte web, fetch) esquecida no HTML | Garantir que todo CSS/JS está inline no próprio arquivo, sem `<link>` ou `<script src>` externo |

---

## 7. Glossário

**Roteiro:** texto falado da live, já pronto e aprovado, fonte única de conteúdo — nunca reescrito, só condensado.
**Deck:** o conjunto de slides (arquivo HTML).
**Condensar:** cortar o texto do roteiro pra título + 2-4 frases por slide, sem perder o sentido, sem inventar informação nova.
**Fio condutor visual:** metáfora ou elemento recorrente que se repete visualmente ao longo do deck pra dar unidade.
