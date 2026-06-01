---
task: "Atualizar Config"
responsavel: "@vera-pesquisa"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Uma fase do pipeline terminou e devolveu IDs/dados"
Saida: "Secao Ad Research Config no CLAUDE.md atualizada com os IDs e tiers reais"
execution_type: "automated"
---

# Task: Atualizar Config — A "Cola" Entre as Fases

**Task ID:** squad-anuncios-arcane/atualizar-config
**Version:** 2.0.0
**Responsável:** @vera-pesquisa

> Trabalho invisível mas crítico. Sem essa cola, a fase seguinte não acha
> os dados. A Vera executa isso automaticamente depois de cada fase do pipeline.

---

## Pós-Fase 1 (competitor-research)

A skill `competitor-research` devolve:
- O **Competitors Table ID** (`tbl...`)
- A lista de concorrentes achados, cada um com uma categoria (`Micro-Niche` / `Macro-Niche` / `Ad Leader`)

A Vera atualiza a seção `Ad Research Config` do CLAUDE.md:

1. **Competitors Table** — substituir o placeholder pelo `tbl...` real.
2. **Niche Tiers** — preencher com os **nomes reais** dos concorrentes. Mapeamento padrão entre a categoria da skill e o tier do brief:

   | Categoria (skill 1) | Tier (brief / skill 3) |
   |---------------------|------------------------|
   | Micro-Niche | Direct |
   | Macro-Niche | Adjacent |
   | Ad Leader | Aspirational |

   > Nota: as skills do pipeline usam nomenclaturas diferentes (Micro/Macro/Ad Leader na Fase 1, Direct/Adjacent/Aspirational na Fase 3). Esse mapeamento resolve. Se algum concorrente não encaixar bem, a Vera ajusta com o expert.

Exemplo do resultado:
```
### Niche Tiers
Direct: Concorrente A, Concorrente B, Concorrente C
Adjacent: Concorrente D, Concorrente E
Aspirational: Concorrente F, Concorrente G
```

---

## Pós-Fase 2 (scrape-ads)

A skill `scrape-ads` devolve o **Ad Research Table ID** (`tbl...`).

A Vera atualiza no CLAUDE.md:
- **Ad Research Table** — substituir o placeholder pelo `tbl...` real.

---

## Regra

A Vera **nunca** avança pra próxima fase sem ter feito essa atualização. A Fase 2 precisa do Competitors Table ID; a Fase 3 precisa do Ad Research Table ID e dos Niche Tiers preenchidos.

Se o expert estiver usando o squad standalone, a Vera mostra a mudança que fez no CLAUDE.md pra transparência.

---

**Task Status:** Ready for Production
