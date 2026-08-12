# Live Deck Builder — Foundation KB (rascunho da Fase 1)

> Pesquisado por @knowledge-curator (Worker Forge). Alimenta a KB final do worker `live-deck-builder`.

---

## 1. Contexto do Negócio

A Karol grava lives semanais pro Expert360º/Incubadora de Expert, ~28-40min, sempre em Zoom, seguindo um roteiro falado com estrutura fixa em 4 partes (Narrativa → Execução → Prática → Prova Racional + Pitch). Até agora ela mandava o roteiro completo pro Gamma (ferramenta paga, mensalidade ~R$40, apresentações ilimitadas) gerar os slides visuais. Ela quer parar de pagar Gamma sem perder a qualidade visual do resultado.

Testou 2 alternativas antes de decidir pelo caminho deste worker:
- **Manus + Nano Banana Pro** (padrão do squad Slide Forge) — descartado, ela não tem conta
- **Geração de imagem via API OpenAI** (pay-per-use, ~US$0,50-2/live) — descartado: não compensa vs. Gamma ilimitado por R$40/mês, e ela nunca gerou uma API key antes (fricção alta)

Decisão final: worker monta o deck **sem fotografia nenhuma** — só layout gráfico nativo (cor, tipografia, ícones, cards, gráficos, timelines). Zero custo, zero dependência externa, 100% autônomo.

---

## 2. Ferramentas Core

### 2.1 Renderização nativa (HTML/CSS/SVG via Claude Code)

**O que é:** não é uma plataforma externa — é a própria capacidade de geração de código do Claude Code. O worker escreve o deck como um arquivo HTML autocontido (CSS inline, sem dependência de CDN), com paginação por slide (16:9), navegável por teclado/clique, abrível em qualquer navegador, tela cheia (F11) pra compartilhar no Zoom.

**Skills internas que o worker deve carregar antes de desenhar:**
- `artifact-design` — fundamentos de design pra páginas HTML (antes de escrever a primeira linha de CSS)
- `dataviz` — sempre que o slide tiver gráfico, stat, comparação numérica ou timeline (regra de cor, forma dos marks, contraste light/dark)

**Limites conhecidos:**
- Sem geração de imagem fotográfica real — só formas geométricas, ícones (emoji ou SVG inline), tipografia e cor fazem o trabalho visual
- Não tem acesso a bancos de imagem (Unsplash, etc.) sem chave de API — decisão já tomada de não usar
- Precisa funcionar offline/local — sem depender de fetch externo em runtime

**Troubleshooting:**
- Se o deck ficar "pobre" visualmente sem foto: compensar com mais variação de layout (nem todo slide é texto+fundo — alternar full-bleed de cor, cards, split de colunas, número gigante, quote isolada) — ver catálogo de tipos de slide na seção 5
- Overflow de texto em slide 16:9 = sinal de que o conteúdo não foi condensado o suficiente (ver regra de densidade, seção 5)

### 2.2 Formato de entrega

**Decisão fechada:** combo — publica como Artifact (link privado, acesso rápido de qualquer navegador) E salva cópia standalone em `business/campanhas/lives-semanais/live-N-apresentacao.html` (backup offline, caso a internet falhe no dia da live).

---

## 3. Fontes Internas Coletadas

### 3.1 Fonte primária de conteúdo — roteiro da live
`business/campanhas/lives-semanais/live-{N}-roteiro.md`
Estrutura fixa: cabeçalho (Tema, Duração, Modelo) + 4 partes (Narrativa/Execução/Prática/Prova Racional+Pitch) + Checklist Pré-Live + DoD. O worker lê esse arquivo como fonte única — nunca deve inventar conteúdo que não esteja lá.

### 3.2 Persona — dossiê completo
`docs/knowledge/expert-business/dossie-personas.md` — persona **Laura**, com 10 dores, 10 desejos, 10 objeções, 10 urgências ocultas mapeadas.
`docs/knowledge/expert-business/posicionamento.md` — versão narrativa da Laura (dia típico, diálogo interno, pontos A/B/C), frase-tese: *"Diploma é o que você estudou. Método é o que você viveu."*

**Regra de uso:** o worker NÃO precisa perguntar perfil de audiência a cada live — só precisa identificar, dentro do dossiê, qual dor/objeção específica aquela live ataca (normalmente já fica claro no gancho de abertura do roteiro).

### 3.3 Metodologia (pra conexão com o método, quando o roteiro citar)
`docs/knowledge/expert-business/metodologia/expert360-framework-completo.md` — nomes canônicos dos 5Ps (P1 Persona Compradora, P2 Promessa Transformadora, P3 Processo Autoral, P4 Proposta Validada, P5 Posicionamento de Autoridade), 3 mecanismos proprietários (Narrativa do Método, Vendas Secretas, Autoridade Tríplice), 5 fases da jornada.

**Gap registrado:** o roteiro da Live 24 chama "Portfólio Estratégico" de P4 — mas pelo framework canônico, Portfólio Estratégico é o agente de transição P3→P4, e o P4 real é "Proposta Validada". Meramente registrado aqui; não é escopo deste worker corrigir roteiros antigos, só não repetir o erro em conteúdo novo caso o roteiro fonte não deixe claro.

### 3.4 Identidade visual
Logos Expert360: `C:\Users\karol\OneDrive\Documentos\Incubadora de Expert\Logo Expert360 - branco.png` (fundo escuro) e `...\Logo Expert360 - preto.png` (fundo claro) — usar no rodapé/cabeçalho de cada slide, versão conforme o fundo.
Paleta de marca (confirmada pela Karol, fonte: `Paleta Incubadora.jpeg`, ferramenta de marca):
| Cor | Hex | Uso |
|-----|-----|-----|
| Laranja | `#f85627` | Destaque, CTA, números, ícones — nunca vermelho |
| Cinza | `#ddddde` | Fundo neutro secundário, texto de apoio |
| Preto | `#090a0b` | Fundo escuro, texto sobre claro |
| Branco | `#fcfcfc` | Fundo claro, texto sobre escuro |

**Gap fechado.** Não existia arquivo com hex em `docs/knowledge/` — só a paleta visual da Karol. Vale considerar salvar esses 4 hex em `docs/knowledge/expert-mind/identidade/` como referência permanente pra outros agentes de conteúdo (fora do escopo deste worker, sinalizar à Karol).

### 3.5 Fotos pessoais (se algum slide precisar de foto da Karol, não de banco de imagem)
`docs/knowledge/expert-mind/identidade/ativos-visuais.md` → `C:\Users\karol\OneDrive\Pictures\Minhas Fotos`

---

## 4. Referência de Calibração — Deck Gamma Real (Live 24)

Karol forneceu um PDF de uma live anterior já produzida no Gamma, só pra calibrar densidade/estilo (conteúdo descartado, só a forma importa). Análise comparando roteiro falado x slides entregues:

**Proporção:** 22 slides pra ~36-40min de fala → 1 slide a cada 1,5-2min.

**Catálogo de tipos de slide identificados (12 fotográficos / 10 gráficos):**
| Tipo | Uso | Equivalente sem foto |
|------|-----|----------------------|
| Título | Abertura, nome da live + subtítulo + tag do tema | cor de fundo sólida + tipografia grande, sem foto |
| Quote isolada | Frase-âncora, frase de fechamento | fundo de cor + aspas grandes + fonte serifada, já é o padrão sem-foto |
| História Real | 1 bloco narrativo por história do roteiro | card com título + 2-3 parágrafos curtos, sem foto |
| Cards triplos | Lista de 2-3 princípios/eixos | grid de cards com ícone (emoji/SVG) + label + 1 frase — já é o padrão sem-foto |
| Bloco de estatística | Números/dados concretos (Prova Racional) | número gigante + label curto, já é o padrão sem-foto |
| Gráfico de barra/pricing | Comparação de valores (ex: ofertas x preço) | gráfico nativo (seguir regras da skill `dataviz`) |
| Timeline | Sequência de eventos (ex: como o ecossistema se formou) | linha do tempo com marcadores, já é o padrão sem-foto |
| Diagrama/mapa conceitual | Relação entre conceitos (ex: 5Ps) | diagrama SVG simples |
| Resumo final | Recap com 2-3 pontos-chave | grid de cards numerados, já é o padrão sem-foto |
| CTA final | Call to action + instrução de comentário | fundo de cor forte + texto grande + destaque na palavra-chave do CTA |

**Regra de densidade (crítica):** nenhum slide repete o texto do roteiro verbatim. Cada slide corta pra título curto + 2-4 frases no máximo. Se o bloco do roteiro for maior que isso, quebra em mais de 1 slide em vez de encolher a fonte.

**Padrão observado, não presente no roteiro falado:** o Gamma adiciona slides de síntese que não têm fala correspondente (ex: "Resumo da Live", "O Que Você Ganha") — reforço visual extra. O worker deve fazer o mesmo: pelo menos 1 slide de resumo antes do CTA final, mesmo que o roteiro não tenha essa seção explícita.

---

## 5. Glossário

**Roteiro:** o texto falado da live, já pronto e aprovado, fonte única de conteúdo — o worker nunca debate ou reescreve o roteiro, só condensa e desenha.
**Deck:** o conjunto de slides (aqui, arquivo HTML).
**Condensar:** cortar o texto do roteiro pra título + 2-4 frases por slide, sem perder o sentido, sem inventar informação nova.
**Fio condutor visual:** metáfora ou elemento recorrente que se repete visualmente ao longo do deck pra dar unidade (ex: na Live 25, a metáfora "pezinho na água" — temperatura/profundidade/correnteza/bichos — vira 1 slide de diagrama dedicado).

---

## Gaps Registrados

```yaml
gaps:
  - tool: "Fio condutor visual por live"
    gap: "Cada live pode ter (ou não) uma metáfora central digna de slide dedicado — não dá pra saber sem ler o roteiro específico"
    action: "Worker verifica isso a cada execução, não é algo fixo na KB"
```

**Ambos os gaps de marca e formato de entrega foram fechados nesta sessão** (paleta confirmada em `Paleta Incubadora.jpeg`; formato = combo Artifact + HTML local).

**Fontes:** 100% coleta interna (dossiê, posicionamento, metodologia, roteiro, calibração do exemplo real fornecido pela Karol). Nenhuma pesquisa externa (WebSearch) foi necessária — não há plataforma de terceiros envolvida no worker.
