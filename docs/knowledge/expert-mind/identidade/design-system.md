# Design System — Incubadora de Expert

> Consolidado a partir do padrao visual ja em producao (nao inventado do zero).
> Fonte: `business/campanhas/area-de-membros/site/css/styles.css`, replicado identico
> (mesmas variaveis, mesmos valores) em `lp-diagnostico-expert/index.html` e
> `lp-minitreinamento/index.html`. 3 pecas em producao usando o mesmo token exato
> confirma que isso ja E o padrao real — este documento so da nome a ele.
>
> Uso: qualquer agente que crie LP, pagina, carrossel ou peca visual pra Incubadora
> deve consultar este arquivo antes de inventar cor ou fonte nova.

---

## Regra de Marca

**Preto, branco, cinza e laranja. Sem vermelho — laranja e a UNICA cor de destaque.**

Vermelho nunca aparece na paleta, nem pra erro/alerta (usar laranja ou o texto).

---

## Cores

### Base (neutros)

| Token | Hex | Uso |
|-------|-----|-----|
| `--preto` | `#0B0B0C` | Texto principal, fundo de secao escura, botao escuro |
| `--preto-2` | `#151517` | Fundo secundario sobre preto (cards, inputs dentro de secao escura) |
| `--preto-3` | `#232327` | Borda/contorno sutil sobre fundo escuro |
| `--branco` | `#FFFFFF` | Fundo padrao, texto sobre escuro |

### Escala de cinza

| Token | Hex | Uso |
|-------|-----|-----|
| `--cinza-100` | `#F4F4F5` | Fundo de secao clara alternativa (nao-branca) |
| `--cinza-300` | `#D4D4D8` | Bordas, divisores |
| `--cinza-500` | `#71717A` | Texto secundario, placeholder, legenda |
| `--cinza-700` | `#3F3F46` | Texto secundario sobre fundo claro (mais forte que cinza-500) |

### Destaque

| Token | Hex | Uso |
|-------|-----|-----|
| `--laranja` | `#FF6B1A` | CTA, links, destaque de texto (`.destaque`), acentos, hover de link |
| `--laranja-escuro` | `#E85A0D` | Hover/active de botao laranja |

### Semantica

| Token | Hex | Uso |
|-------|-----|-----|
| `--verde` | `#2FBF71` | Confirmacao, sucesso (uso pontual — nao e cor de marca) |

---

## Tipografia

- **Display (titulos, h1/h2/h3, CTAs, badges):** `'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
  - Carregar do Google Fonts: `family=Sora:wght@400;600;700;800`
  - Pesos usados: 700 (titulos padrao), 800 (hero/destaque maximo), 600 (botoes/labels)
- **Texto (corpo, paragrafos, UI):** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` (fonte de sistema, sem webfont)

### Convencoes de espacamento de letra (tracking)

| Contexto | `letter-spacing` |
|----------|-------------------|
| Titulos grandes (h1 hero) | `-0.03em` (mais fechado) |
| Titulos padrao (h2) | `-0.02em` |
| Badge/label uppercase pequeno | `0.14em` (bem aberto) |
| Input de codigo (ex: OTP) | `0.2em` |

### Line-height

- Titulos (`h1, h2, h3`): `1.2`
- Corpo de texto: `1.5` a `1.6`

---

## Componentes — Padroes Observados

### Botao primario (CTA)

```css
background: var(--laranja);
color: var(--branco);
font-family: var(--display);
font-weight: 700;
border: none;
border-radius: 10px a 12px;
padding: 14px (vertical similar em todos os exemplos);
transition: background .15s ease;
/* hover/active */
background: var(--laranja-escuro);
```

### Cards / blocos

- `border-radius`: 12px–16px (quanto maior o bloco, maior o raio)
- Fundo alternando entre `--branco` e `--cinza-100` pra separar secoes sem usar linha

### Badge / pill (label pequeno, ex: "NAO LISTADO", tag de categoria)

- `border-radius: 100px` (pill completo)
- Texto uppercase, `font-weight: 600`, `letter-spacing: 0.14em`

### Secao escura (contraste, geralmente CTA final ou destaque de prova)

```css
.secao-escura { background: var(--preto); color: var(--branco); }
```
Blocos internos usam `--preto-2` como "card" dentro da secao escura, borda esquerda de 3px em `--laranja` pra citacao/destaque.

---

## Layout

- Container padrao (texto/leitura): `max-width: 720px`
- Container largo (grids, blocos maiores): `max-width: 960px`
- Padding lateral do container: `24px`
- Padding vertical de secao: `72px`
- `scroll-behavior: smooth` no `html`
- Reset universal: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- `-webkit-font-smoothing: antialiased` no body

---

## Onde isso ja esta aplicado

- `business/campanhas/area-de-membros/site/css/styles.css` (Área de Membros — origem/fonte principal)
- `business/campanhas/lp-diagnostico-expert/index.html`
- `business/campanhas/lp-minitreinamento/index.html`
- (nao conferido: `lp-minitreinamento-b` — e clone da GreatPages, pode divergir por ser teste A/B de pagina de terceiro)

## Como usar em peca nova

1. Copiar o bloco `:root { ... }` deste documento (secao Cores + Tipografia) pro CSS/HTML novo
2. Nao inventar tom de laranja, cinza ou fonte alternativa — reusar os tokens acima
3. Se precisar de uma cor que nao existe aqui (ex: erro, aviso), perguntar antes de adicionar — a regra de marca e cor minima (preto/branco/cinza/laranja)
