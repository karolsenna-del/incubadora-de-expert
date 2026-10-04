# MCP Usage — Auroq OS

> Carve-out Arcane: conteúdo licenciado (Companion interno, Consultor, forjas, Pack) vem pelo MCP `arcane` **enquanto o servidor responder**. Esta regra vence a preferência genérica por ferramentas nativas **só nesse conteúdo**. Única exceção: o servidor recusou (acesso vencido, cancelado, suspenso, encerrado) ou falhou **e** a pasta do agente existe em `agents/` — aí o conteúdo local vale, com aviso de uma linha ao aluno. O que já estava no computador dele antes da migração continua dele.

## Prioridade de Ferramentas

SEMPRE preferir ferramentas nativas do Claude Code sobre MCP, **exceto** conteúdo Arcane:

| Task | USAR | NAO USAR |
|------|------|----------|
| Conteúdo Arcane (persona, KB, forja, Pack) | MCP `arcane` (servidor negou/falhou e `agents/<x>/` existe → disco, avisando) | Read/Grep em `agents/` enquanto o MCP responde |
| Ler arquivos do ALUNO (memória, docs, cockpit) | `Read` tool | MCP servers |
| Escrever arquivos | `Write` / `Edit` tools | MCP servers |
| Rodar comandos | `Bash` tool | MCP servers |
| Buscar arquivos do projeto do aluno | `Glob` / `Grep` | MCP servers |

## MCP Governance

Gestao de MCP servers (add/remove/configure) e **EXCLUSIVA do Ops**.

Outros agentes sao **consumidores** de MCP, nao administradores. Se precisar de gestao MCP, delegar pro Ops.

## Quando usar MCP

1. Conteúdo licenciado Arcane — MCP `arcane` (obrigatório)
2. Servico com integracao estruturada — WhatsApp, Notion e equivalentes
3. Playwright nos cenarios tecnicos
4. Ferramentas externas sem equivalente nativo

Se a tool `arcane` recusar ou falhar: a pasta do agente existe em `agents/`? Sim → avisar em uma linha e seguir pelo disco. Não → mostrar a mensagem e parar. Nunca improvisar de memoria. Exceção: pedido de atualizar o sistema ou consertar a conexão — o Ops roda a manutenção local (ver o atalho do Ops).
