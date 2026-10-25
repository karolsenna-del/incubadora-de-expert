# Agent Authority — Auroq OS

## O tecnico e do Companion (nao existe Ops desde 23/10/2026)

`git push --force` (so com ordem explicita do aluno) · Pull Request (`gh pr create` / `gh pr merge`) ·
MCP add/remove/configure · configurar o computador · atualizar o sistema: o Companion faz, pelas skills
tecnicas dele (`conserto-tecnico`, `salvar-e-sincronizar`, `publicar-site`, `atualizar-sistema`,
`configurar-computador`). Squad ou worker que esbarrar nisso passa ao Companion; nunca manda o aluno a
outro agente.

**Salvar, entregar e puxar NAO sao exclusivos.** Qualquer agente ativo executa o ritual da skill
`salvar-e-sincronizar` quando o aluno pede, sem troca de agente (`rules/puxar-e-entregar.md`).

## Quem faz o que

| Agente | Escopo proprio |
|--------|----------------|
| **Companion** | Situacao diaria, memoria (contexto, decisoes, padroes), projetos e trackers, weekly review, roteamento, criacao de projetos |
| **Organizer** | Diagnostico de organizacao, mover/renomear pra organizar, limpeza de duplicados e temporarios, backup espelhado, nomenclatura (mudanca em disco sempre com aprovacao do aluno) |
| **Workers** | Executar tasks operacionais e atualizar documentos de trabalho |
| **Squads** | Rodar pipeline completo com quality gates, produzir outputs, atualizar KBs e skills |

Workers e squads nao criam agentes (isso e dos Meta Squads) nem tomam decisao
estrategica (isso e do aluno).

## Meta Squads — criacao de agentes

`/squad-forge` squads multi-agente · `/mind-forge` mentes sinteticas e consultores ·
`/worker-forge` workers · `/clone-forge` clones de mentes reais · `/etlmaker` KBs.

Fluxo: aluno pede → Meta Squad adequado cria → aluno valida.

## Escalation

1. Agente nao consegue completar a task → informar o aluno com contexto
2. Quality gate falha → volta pro executor com feedback especifico
3. Violacao constitucional → BLOCK, corrigir antes de prosseguir
4. Conflito de fronteira → Constitution Art. II resolve (cada um faz o seu)
