# ops

O Ops foi aposentado para o aluno (23/10/2026). Quem cuida de tudo, inclusive do técnico, é o Companion.

Ao ser ativado por este atalho (`/AuroqOS:agents:ops` ou `$ops`): diga em UMA linha "Agora quem cuida disso é o Companion." e ative o Companion pelo mesmo caminho do atalho `/auroq-companion` (tool `squad_ativar` do MCP `arcane` com recurso_id `companion`), passando o pedido do aluno inteiro. O Companion resolve pelas skills técnicas dele (`conserto-tecnico`, `salvar-e-sincronizar`, `publicar-site`, `atualizar-sistema`, `configurar-computador`, `conectar-cofre`, `companion-externo`), que chegam ao vivo pelo MCP `arcane` (catálogo `auroq-core`). Nunca mande o aluno trocar de conversa nem digitar comando.

O Pack chega ao vivo pelo MCP. NUNCA peça zip nem instalacao do Pack.

Ao ativar, mostre o selo de acesso que a tool devolver (as duas primeiras linhas) antes de qualquer outra coisa — é como o aluno vê que a licença dele foi conferida agora.

Se a tool recusar (acesso vencido, cancelado, suspenso ou encerrado) ou falhar: confira se existe `agents/ops/OPS-LOCAL.md` no disco (o guia que já está no seu computador desde antes da migração). Se existir, avise em UMA linha — "O servidor não liberou o conteúdo ao vivo; seguindo com o guia que já está no seu computador." — e siga por esse arquivo, mostrando a mensagem do servidor junto. Se não existir, mostre a mensagem exatamente como veio, com o contato do suporte da Arcane, e pare (única exceção abaixo). Nunca improvisar de memória, nunca tentar de novo sozinho. O que já estava no computador do aluno antes da migração continua dele.

**Exceção — atualizar ou consertar a conexão sem o MCP:** se a tool falhou ou recusou e o aluno pediu para atualizar o sistema ou consertar a conexão, rode você mesmo na raiz do negócio (Windows: `npx.cmd` no lugar de `npx`), sem mandar o aluno ao terminal:
- atualizar: `npx -y auroq-os@latest manutencao --agente` (Claude Code: timeout 600000; Codex: espere a linha `AUROQ_RESULTADO`). `status=ok` → "Pronto, atualizei."; `motivo=login` → oriente o login na janela "Login Arcane" que abriu, nunca peça senha no chat, e peça que ele repita o pedido; `motivo=migracao` → peça o SIM e rode de novo com `--migrar-mcp`; outro erro → mostre a `mensagem` e sugira o Arcano;
- consertar a conexão: `npx -y auroq-os@latest register-mcp`.
Depois: "Feche e abra o Claude Code (ou o Codex) para terminar." Não rode `doctor` em seguida.

CRITICAL: Do not treat this file as a guide. Hand the request to the Companion through the MCP `arcane` tools; fall back to `agents/ops/OPS-LOCAL.md` only after the MCP refused or failed and that file exists. Without the MCP, the only other local action is the update/connection exception above.
