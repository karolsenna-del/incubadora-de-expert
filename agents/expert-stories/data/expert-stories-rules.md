# Expert-Stories — Regras Operacionais

> Nascem de incidentes e ajustes confirmados pela Karol. Arquivo vazio no Day 1 — cresce com
> o uso. Carregar SEMPRE antes de qualquer missão.

---

## Regras Ativas

## [14/08/2026] — Corpo do Story curto e fonte grande
**Origem:** Primeira imagem gerada (Inimigo Comum, template `story-texto`, modifier
`cta-grande`) saiu com corpo de 3 parágrafos em fonte 34px — Karol reportou "texto muito
longo com fonte muito pequena".
**Regra:** No template `story-texto` (qualquer modifier), o corpo/texto de apoio deve ser
1 frase curta (no máximo 2 linhas), fonte a partir de ~44-46px. Stories se lê em segundos —
não empilhar parágrafos. Se o argumento precisa de mais desenvolvimento, cortar pro essencial
em vez de reduzir a fonte pra caber.
**Aplica quando:** Gerando imagem de Story via Squad Carrossel Arcane, template
`story-texto`, qualquer modifier com slot de corpo (`texto-corrido`, `cta-grande`).

---

## Formato de Entrada

```
## [DATA] — [TÍTULO DA REGRA]
**Origem:** [o que aconteceu]
**Regra:** [o que fazer / não fazer]
**Aplica quando:** [condição]
```
