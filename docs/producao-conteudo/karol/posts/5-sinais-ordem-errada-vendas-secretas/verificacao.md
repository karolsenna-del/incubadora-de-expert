# Verificação de entrega

## Resultado

- **Contagem:** 6/6 PNGs, numeração sequencial de `slide-01.png` a `slide-06.png`.
- **Dimensão:** todas as lâminas têm **1080 × 1350 px**.
- **Integridade:** 6 hashes distintos; nenhum arquivo vazio ou duplicado.
- **Prancha:** `prancha-revisao.png`, **1800 × 1520 px**.
- **Fonte:** Sora local incorporada ao editável (pesos 400, 500, 600, 700 e 800).
- **Identidade:** fundo `#090A0B`, texto branco, destaque `#FF6B1A`, assinatura `@karolsenna._`, sem fotografia.
- **Revisão visual:** capa, lâmina de maior densidade e fechamento inspecionados em resolução final; texto legível, sem clipping, sobreposição ou overflow visível.
- **Cópia:** redação aprovada preservada; inspiração estrutural creditada a `@matheuscarmopqv` na legenda.

## Manifesto dos PNGs

| Arquivo | Dimensão | Bytes | SHA-256 (12) |
|---|---:|---:|---|
| `slide-01.png` | 1080 × 1350 | 166915 | `bf086552da00` |
| `slide-02.png` | 1080 × 1350 | 87312 | `f4fec4cf7636` |
| `slide-03.png` | 1080 × 1350 | 98779 | `d88c37d6b7e7` |
| `slide-04.png` | 1080 × 1350 | 99814 | `fe470981751a` |
| `slide-05.png` | 1080 × 1350 | 93239 | `d157de3abfba` |
| `slide-06.png` | 1080 × 1350 | 100709 | `234b017fd7ff` |

## Arquivos editáveis

- `carrossel-editavel.html` — composição visual completa.
- `slides.json` — conteúdo e tokens de identidade em formato estruturado.
- `roteiro.md` — roteiro por lâmina e direção criativa.
- `render.mjs` — renderização reproduzível dos seis PNGs e da prancha.
- `assets/Sora-*.ttf` — fontes locais para renderização consistente.
