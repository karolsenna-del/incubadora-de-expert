# Handoff — convite Black Expert por WhatsApp

**Status:** fila preparada; infraestrutura de envio ainda não construída  
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
