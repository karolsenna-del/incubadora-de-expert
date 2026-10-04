# Agent Authority — Auroq OS

## Exclusivo do Ops

`git push --force` · Pull Request (`gh pr create` / `gh pr merge`) · MCP add/remove/configure ·
environment bootstrap · `*update`. Nenhum outro agente executa isso — delegar pro Ops.

**Salvar, entregar e puxar NAO sao exclusivos.** O Ops e o dono do ritual, mas qualquer
agente ativo o executa quando o expert pede, sem troca de agente (`rules/puxar-e-entregar.md`).

## Quem faz o que

| Agente | Escopo proprio |
|--------|----------------|
| **Companion** | Situacao diaria, memoria (contexto, decisoes, padroes), projetos e trackers, weekly review, roteamento, criacao de projetos |
| **Organizer** | Diagnostico de organizacao, mover/renomear pra organizar, limpeza de duplicados e temporarios, backup espelhado, nomenclatura (mudanca em disco sempre com aprovacao do expert) |
| **Workers** | Executar tasks operacionais e atualizar documentos de trabalho |
| **Squads** | Rodar pipeline completo com quality gates, produzir outputs, atualizar KBs e skills |

Workers e squads nao criam agentes (isso e dos Meta Squads) nem tomam decisao
estrategica (isso e do expert).

## Meta Squads — criacao de agentes

`/squad-forge` squads multi-agente · `/mind-forge` mentes sinteticas e consultores ·
`/worker-forge` workers · `/clone-forge` clones de mentes reais · `/etlmaker` KBs.

Fluxo: expert pede → Meta Squad adequado cria → expert valida.

## Escalation

1. Agente nao consegue completar a task → informar o expert com contexto
2. Quality gate falha → volta pro executor com feedback especifico
3. Violacao constitucional → BLOCK, corrigir antes de prosseguir
4. Conflito de fronteira → Constitution Art. II resolve (cada um faz o seu)
