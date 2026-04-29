# MCP Usage — Auroq OS

## Prioridade de Ferramentas

SEMPRE preferir ferramentas nativas do Claude Code sobre MCP:

| Task | USAR | NAO USAR |
|------|------|----------|
| Ler arquivos | `Read` tool | MCP servers |
| Escrever arquivos | `Write` / `Edit` tools | MCP servers |
| Rodar comandos | `Bash` tool | MCP servers |
| Buscar arquivos | `Glob` tool | MCP servers |
| Buscar conteudo | `Grep` tool | MCP servers |

## MCP Governance

Gestao de MCP servers (add/remove/configure) e **EXCLUSIVA do Ops**.

Outros agentes sao **consumidores** de MCP, nao administradores. Se precisar de gestao MCP, delegar pro Ops.

## Quando usar MCP

1. Browser automation (Playwright) — testes, screenshots, interacao web
2. WhatsApp (quando configurado) — mensagens, contatos
3. Notion (quando configurado) — docs externos
4. Ferramentas externas sem equivalente nativo

## Quando NAO usar MCP

- Operacoes com arquivos locais (usar ferramentas nativas)
- Comandos de shell (usar Bash)
- Qualquer coisa que uma ferramenta nativa resolve

## Rationale

- Ferramentas nativas executam no sistema LOCAL
- MCP servers podem ter latencia, falhas de conexao, custos
- Ferramentas nativas sao mais rapidas e confiaveis pra operacoes locais
