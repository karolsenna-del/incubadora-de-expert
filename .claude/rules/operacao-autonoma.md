# Operação autônoma — ferramentas e caminho até o resultado

> Escopo, autonomia, travas e honestidade estão no `AGENTS.md` da raiz (regras de base, carregadas
> em toda conversa). Esta regra só detalha a ordem das ferramentas.

## Ordem das ferramentas

1. Ferramenta nativa, CLI, API, conector ou MCP próprio da tarefa, já configurado.
2. Se faltar autenticação: o cofre do aluno (1Password, cofre `Claude`; ou Infisical, se ele escolheu o grátis)
   antes de pedir ao aluno. Leia com `npx -y auroq-os@latest segredo ler <referência>` (Windows: `npx.cmd`, pois no Codex/PowerShell o `npx` sem `.cmd`
   é bloqueado; serve para os dois cofres; com 1Password, `op read "op://Claude/<Item>/<campo>"` direto também vale)
   e guarde com `segredo gravar` (valor por stdin, nunca em argumento). Nunca rode `segredo ler` sozinho (nem `op read`): leia
   dentro do comando que usa o valor, numa variável (`X="$(npx -y auroq-os@latest segredo ler Item/campo)" && comando "$X"`),
   para o valor não voltar na conversa; para guardar, ligue por pipe a saída de quem gerou o valor. Nunca exponha segredo no chat ou em logs; `business/vault/` guarda só
   status e referência `op://...`, nunca o valor. Cofre ainda não conectado, ou `op`/`segredo` com erro de
   autenticação: conecte você mesmo pela skill `conectar-cofre` (`agents/companion/tasks/conectar-cofre.md`; MCP `arcane`, `squad_passo`
   com recurso_id `companion` e passo `conectar-cofre`, cuja entrada diz qual das peças carregar) e
   retome a tarefa. Leia cada credencial uma vez por conversa e reaproveite o valor (a chave tem teto de leituras
   por hora, por minuto ou por dia, conforme o cofre); nunca rode `env`/`printenv` nem abra o arquivo de ambiente
   onde a chave fica.
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
