# squad-forge

Cria squads multi-agente a partir dos seus processos.

Todo conteúdo desta forja vem pelo MCP `arcane` (catálogo `auroq-core`). Chame a tool `forja_bundle` com forge_id `squad-forge` e a fase atual. Enquanto o servidor responder, nunca procurar arquivo local desta forja.

Ao ativar, mostre o selo de acesso que a tool devolver (as duas primeiras linhas) antes de qualquer outra coisa — é como o aluno vê que a licença dele foi conferida agora.

Se a tool recusar (acesso vencido, cancelado, suspenso ou encerrado) ou falhar: confira se a pasta `agents/squad-forge/` existe no disco com arquivos. Se existir, avise em UMA linha — "O servidor não liberou o conteúdo ao vivo; seguindo com a versão que já está no seu computador." — e siga com o conteúdo dessa pasta como fonte da verdade, mostrando a mensagem do servidor junto. Se não existir, mostre a mensagem exatamente como veio, com o contato do suporte da Arcane, e pare. Nunca improvisar de memória, nunca tentar de novo sozinho. O que já estava no computador do aluno antes da migração continua dele.

CRITICAL: While the MCP `arcane` answers, do not read `agents/squad-forge/**`. Read that folder only after the MCP refused or failed and it exists on disk.
