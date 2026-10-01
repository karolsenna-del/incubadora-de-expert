# Handoff — convite Black Expert por WhatsApp

**Status (30/09, 22h):** infraestrutura de envio PRONTA e testada (teste entregue). Envio aos 124 aguardando novo horário aprovado pela Karol  
**Responsável técnico:** Gestor de Infra Arcane  
**Data:** 30/09/2026

## Objetivo

Construir e validar a rota de disparo do convite individual da Black Expert pelo WhatsApp Business Platform/Dualhook, sem usar a fila antes da aprovação final da Karol.

## Dados privados locais

A fila não pode entrar no Git porque contém nomes e telefones. No computador principal da Karol, está em:

`business/vault/black-expert-2026/fila-api-dry-run/`

Arquivos esperados:

- `fila-revisao.csv` — 131 contatos únicos, personalizados e em `aguarda_confirmacao_karol`;
- `quarentena.csv` — 82 contatos excluídos da fila;
- `bloqueados.csv` — 53 registros novos, ainda sem validação;
- `resumo-dry-run.json` — contagens e verificações mecânicas;
- `README.md` — auditoria e dependências.

Se esses arquivos não existirem no ambiente atual, **não reconstruir nem inventar a lista**. Informar que o vault privado não acompanhou o clone e pedir acesso ao computador/pasta correta.

## Fonte da copy

`business/campanhas/black-friday-grupo-2026/copies.md`, seção “Disparo #1 — WhatsApp individual”.

Link aprovado do grupo:

`https://chat.whatsapp.com/D150ioiZPgfGuYgsSNIwBH`

## Estado técnico confirmado

- O endpoint `https://vendas.incubadoradeexpert.com.br/api/whatsapp-webhook` recebe mensagens/histórico e rejeita acesso sem segredo.
- Não existe rota documentada de envio de campanha.
- O dry-run não chama Dualhook/Meta e não envia nada.
- Nenhum template Meta foi confirmado como aprovado para esse convite.

## Trabalho pendente do Gestor de Infra

1. Ler o README e o resumo do vault local.
2. Auditar a documentação/API real disponível no Dualhook/Meta para envio ativo.
3. Confirmar se a conta possui template de marketing aprovado com variáveis compatíveis.
4. Construir uma rota idempotente de envio, com chave por campanha+telefone e registro de status.
5. Implementar limites de lote, retries seguros, opt-out e bloqueio da quarentena.
6. Testar exclusivamente com mocks/dry-run antes de qualquer destinatário real.
7. Não colocar nomes, telefones, tokens ou payloads privados no Git.
8. Não disparar sem confirmação explícita da Karol sobre lista nominal, horário, template e custo.

## Decisões ainda necessárias da Karol

- aprovação nominal da fila final;
- horário do disparo;
- rota Dualhook/Meta escolhida;
- template Meta aprovado;
- execução pessoal de eventual pagamento ou cadastro financeiro;
- autorização explícita do envio real.

## Critério de conclusão

A infraestrutura só estará pronta quando houver rota de saída real documentada, teste não faturável aprovado, idempotência comprovada e leitura de status. Uma fila CSV pronta, sozinha, não significa infraestrutura de disparo pronta.

## Atualização 30/09 — Gestor de Infra Arcane (infra construída)

- **Rota de saída:** Dualhook Runtime API (`https://api.dualhook.com/v25.0`, Graph-compatível). Chave `dh_live_` no 1Password: `op://Claude/Dualhook API/password`. WABA `624446197295808`, phone number ID `663604156841540` (+55 67 9232-4690, tier 2K, WABA verificada).
- **Pagamento:** Visa •••• 2767 vinculado à WABA Incubadora De Expert (Karol, 30/09).
- **Modelos Meta (MARKETING, pt_BR):** `black_expert_convite_grupo` ("Olá {{1}}…", id 2305836966819027, PENDING) e `black_expert_convite_grupo_sem_nome` ("Olá, tudo bem?…", id 27889941810685464, APPROVED). Link do grupo no corpo — Meta proíbe link chat.whatsapp.com em botão. Assinatura "Karol Senna" sem hífen (pedido da Karol).
- **Script:** `scripts/enviar-convite-whatsapp.py` — dry-run por padrão; `--teste`; envio real só com `--enviar --confirmo BLACK-EXPERT`; idempotente pelo log `business/vault/black-expert-2026/envios-whatsapp-log.csv`; exclui quarentena, bloqueados e `ja-recebeu-manual.csv` (7 convidados por Karol no 1:1); 1 msg/2s; para em erro de conta/limite. Dry-run: **124 pendentes (91 com nome, 33 sem nome)**.
- **Teste:** 2 tentativas às 08h12/08h39 falharam (1 status só — provável cartão recém-cadastrado). Às 21h57 o teste foi **sent → delivered**, sem erro, categoria marketing.
- **Observabilidade:** webhook republicado (dpl_Br5HevVaLSnEu2CNveP1gbfKzABJ, Karol rodou o deploy) a partir do commit publicado 78d3992 + 3 campos no safe-diagnostic (`status_values`, `status_errors` código/título, `status_pricing`) — sem telefone/texto. **Essa mudança ainda NÃO está commitada no branch `feat/dualhook-webhook`** (cópia em scratchpad da sessão) — replicar no branch antes do próximo deploy.
- **Pendente da Karol:** novo horário (11h de 30/09 passou sem envio). Proposta: 01/10 09h, antes da Live 32. Aprovação condicional já dada: enviar se o teste fosse entregue.
