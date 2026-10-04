# AGENTS.md — Auroq OS

Sistema operacional de IA. Runtimes oficiais desta versão: Claude Code e Codex. Grok carrega este arquivo, mas o conteúdo ao vivo do MCP `arcane` não está garantido no Grok.

## Ativar

- Claude: `/companion`, `/ops`, `/consultor`, `/squad-forge`, …
- Codex: `$companion`, `$ops`, `$consultor`, `$squad-forge`, … (skills em `.agents/skills/`)
- Apps: `/squad-apps-auroq` no Claude ou `$squad-apps-auroq` no Codex — para criar ou continuar um aplicativo com orientacao passo a passo.

Todo conteúdo Arcane vem pelo MCP `arcane` (catálogos `auroq-core` e `arcane-pack`). Nunca procurar esse conteúdo em `agents/`. Se a tool falhar, mostre a mensagem e pare (exceção: pedido de atualizar o sistema ou consertar a conexão — o `$ops` roda a manutenção local).

**Execucao preparada pelo MCP:** Apps, Edicao, Edicao Euriliana, Carrossel, Trafego, Low Ticket e Bia recebem seus arquivos por `squad_passo` com o recurso_id do squad e passo `preparar-execucao`. O agente executa o script retornado na pasta do negocio e continua o trabalho. Anuncios funciona sem arquivos locais. Nao instalar nem atualizar Pack; nao pedir ZIP. Os arquivos locais servem apenas para executar o passo, nunca como fonte do metodo.

## O que fica no disco

Motor (CLI, hooks, scripts), pastas, git, casca (estes ponteiros), a parte executável dos squads híbridos do Pack (preparada pelo MCP) e o que VOCÊ criar (memória, docs, cockpit).

## O que vem ao vivo

Companion interno, Consultor, forjas, Pack. Exige conta ativa e internet.
