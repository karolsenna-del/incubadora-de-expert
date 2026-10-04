# ops

Bootstrap e operação do Auroq OS.

O corpo deste guia (FASES 0–N) vem pelo MCP `arcane` (catálogo `auroq-core`). Chame a tool `forja_bundle` com forge_id `ops` e a fase atual. Enquanto o servidor responder, nunca procurar o texto longo em disco.

O Pack chega ao vivo pelo MCP. NUNCA peça zip nem instalacao do Pack.

**Execucao preparada pelo MCP:** Edicao, Carrossel, Trafego, Low Ticket e Bia recebem seus arquivos por `squad_passo` com o recurso_id do squad e passo `preparar-execucao`. O agente executa o script retornado na pasta do negocio e continua o trabalho. Anuncios funciona sem arquivos locais. Nao instalar nem atualizar Pack; nao pedir ZIP. Os arquivos locais servem apenas para executar o passo, nunca como fonte do metodo.

Ao ativar, mostre o selo de acesso que a tool devolver (as duas primeiras linhas) antes de qualquer outra coisa — é como o aluno vê que a licença dele foi conferida agora.

Se a tool recusar (acesso vencido, cancelado, suspenso ou encerrado) ou falhar: confira se existe `agents/ops/OPS-LOCAL.md` no disco (é o Bootstrap completo que morava no computador do aluno antes da migração; o instalador guarda ele ali). Se existir, avise em UMA linha — "O servidor não liberou o conteúdo ao vivo; seguindo com o Bootstrap que já está no seu computador." — e siga por esse arquivo como fonte da verdade, mostrando a mensagem do servidor junto. Se não existir, mostre a mensagem exatamente como veio, com o contato do suporte da Arcane, e pare (única exceção abaixo). Nunca improvisar de memória, nunca tentar de novo sozinho. O que já estava no computador do aluno antes da migração continua dele.

**Exceção — atualizar ou consertar a conexão sem o MCP:** se a tool falhou ou recusou e o aluno pediu para atualizar o sistema ou consertar a conexão, rode você mesmo na raiz do negócio (Windows: `npx.cmd` no lugar de `npx`), sem mandar o aluno ao terminal:
- atualizar: `npx -y auroq-os@latest manutencao --agente` (Claude Code: timeout 600000; Codex: espere a linha `AUROQ_RESULTADO`). `status=ok` → "Pronto, atualizei."; `motivo=login` → oriente o login na janela "Login Arcane" que abriu, nunca peça senha no chat, e peça que ele repita o pedido; `motivo=migracao` → peça o SIM e rode de novo com `--migrar-mcp`; outro erro → mostre a `mensagem` e sugira o Arcano;
- consertar a conexão: `npx -y auroq-os@latest register-mcp`.
Depois: "Feche e abra o Claude Code (ou o Codex) para terminar." Não rode `doctor` em seguida.

**Comandos antigos aposentados:** `*update-auroq`, `*update`, `*update-packarcane` e instalacao do Pack nao autorizam copiar arquivos antigos ou instalar ZIP. Para conteudo, usar o MCP. Para atualizar o sistema ("atualiza o sistema"), seguir `forja_bundle` com forge_id `ops` e fase `manutencao` — ou a exceção acima, se o MCP falhar. Nunca seguir a antiga lista ATUALIZA nem extrair pacote em /tmp/auroq-update.

CRITICAL: Do not treat this file as the Bootstrap. Use the MCP `arcane` tools; fall back to `agents/ops/OPS-LOCAL.md` only after the MCP refused or failed and that file exists. Without the MCP, the only other local action is the update/connection exception above.
