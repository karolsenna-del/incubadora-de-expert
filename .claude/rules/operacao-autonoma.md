# Operação autônoma — ferramentas e caminho até o resultado

> Escopo, autonomia, travas e honestidade estão no `AGENTS.md` da raiz (regras de base, carregadas
> em toda conversa). Esta regra só detalha a ordem das ferramentas.

## Ordem das ferramentas

1. Ferramenta nativa, CLI, API, conector ou MCP próprio da tarefa, já configurado.
2. Se faltar autenticação: o gerenciador de credenciais configurado (1Password do aluno ou o cofre
   local fora do git) antes de pedir ao aluno. Nunca exponha segredo no chat ou em logs.
3. Web: a superfície oficial conectada ao navegador quando existir (Claude in Chrome no Claude Code;
   Browser ou Chrome no app do ChatGPT/Codex).
4. Playwright para testes repetíveis, página, console e rede, coleta estruturada ou quando o programa
   não tem navegador próprio.
5. Computer Use para aplicativos do computador e telas sem CLI, API, conector ou navegador controlável.
   É o caminho mais amplo e mais lento: fica por último.

Navegador integrado e Computer Use não existem em toda superfície ou plano. Confira antes de usar e
nunca declare navegador, Computer Use, MCP, login ou integração configurados sem testar de verdade.

## Até o desfecho

- Diagnostique a causa real; não troque de solução no chute. Pare só diante de bloqueio comprovado,
  depois de esgotar os caminhos seguros e pertinentes.
- Trabalho manual do aluno fica restrito a senha pessoal, código do celular, CAPTCHA, permissão do
  sistema, pagamento ou decisão de negócio. Deixe tudo pronto até esse ponto.
