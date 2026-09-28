# Plano de trabalho — webhook Dualhook / WhatsApp Coexistence

## Decisão de arquitetura

Reutilizar o projeto Vercel já implantado `vendas-incubadora` (`vendas.incubadoradeexpert.com.br`), adicionando uma função serverless em `paginas-vendas/site/api/whatsapp-webhook.js`. Persistência no Supabase existente por REST/RPC e migration aditiva; nenhum serviço paralelo.

## Execução (TDD vertical)

1. Criar fixtures e teste do GET Meta; confirmar RED; implementar o mínimo e confirmar GREEN.
2. Testar assinatura e rejeição segura; confirmar RED/GREEN.
3. Testar, um campo por vez, `messages`, `smb_message_echoes`, `history` em chunks e `smb_app_state_sync`: normalização E.164, grupos ignorados e chamadas idempotentes ao RPC.
4. Criar migration aditiva/reversível para eventos, progresso de sync, último contato e revisão humana pendente.
5. Rodar teste específico, suíte completa e smoke local HTTP (challenge + POST duplicado).
6. Documentar configuração, janela de 24h e ação exclusiva da Karol; commit, rebase, push e validar deploy/URL quando as credenciais permitirem.

## Restrições

Sem segredos no repositório; sem conteúdo de mensagem em logs; sem envio de mensagens; sem QR, consentimento ou permissões em nome da Karol; sem grupos; nenhuma regra automática de follow-up além de marcar revisão humana pendente.

## Resultado da execução

- Teste específico: 12/12 verdes.
- Smoke HTTP local: GET challenge 200; POST repetido 200/200; 1 evento único.
- Validação híbrida: passou, 41 comandos.
- Suíte geral: 14/17; 3 falhas alheias a esta mudança (`fs-extra` ausente no worktree e colisão preexistente de `squad-edicao-arcane`).
- Variáveis de produção cadastradas e verificadas na Vercel; valores somente no vault privado.
- Deploy de produção ficou `Ready`; GET challenge público respondeu 200 e token inválido respondeu 403.
- Migration aplicada no Supabase real em 27/09/2026 pela Management API, de forma atômica e sem expor credenciais.
- Verificação pós-aplicação: 3 colunas em `crm_leads`, tabelas `crm_whatsapp_events` e `crm_whatsapp_sync_state` com RLS, 3 funções de ingestão/sync e permissões (`public` revogado; `service_role` autorizado).
- Teste controlado idempotente aprovado: duas ingestões da mesma mensagem fictícia produziram 1 evento e 1 lead; sync repetido concluiu em 100%; todos os dados fictícios foram removidos e a limpeza foi confirmada com contagem zero.
- Pronto para configurar o webhook no Dualhook. Antes da importação em massa, fazer teste controlado com uma conversa.

## Incidente pós-onboarding — 28/09/2026

- Causa raiz confirmada: o Webhook Override salvo no Dualhook/Meta estava sem `?token=...`; o GET de verificação funcionava porque usa somente o verify token, mas todo POST normal era rejeitado com 403 pelo segredo de ingresso ausente.
- Evidência: diagnóstico autenticado do Dualhook mostrou Coexistence ativo, app inscrito e override apontando para a rota base; logs Vercel não tiveram POST no teste de 00:37–00:39 e mostraram POSTs 403 posteriores; POST controlado pela URL privada percorreu Vercel → RPC → Supabase com 200.
- Correção: URL completa do vault salva no Webhook Override sem trocar segredos; leitura posterior da resposta Meta confirmou o parâmetro `token` e o mesmo hash do vault. Allowlist de WABA e phone number adicionada à produção e redeploy `dpl_5MsnJ9acUNoeeRKVovhzzn8uzRi4` ficou `Ready`.
- Verificação final: fixture sem dado pessoal retornou 200, criou 1 evento e 1 lead no Supabase; ambos foram removidos e a contagem final voltou a zero.

## Investigação do POST 200 sem persistência — 28/09/2026

- O log histórico de 02:16:12,918 (-04) confirma a rota, o deployment `dpl_5MsnJ9acUNoeeRKVovhzzn8uzRi4` e HTTP 200, mas a versão então publicada não registrava field, formato de identidade, quantidade normalizada nem resultado de RPC. Não há payload bruto disponível e ele não será gravado.
- Caminhos 200 com zero evento mapeados: field não tratado; `messages` contendo somente `statuses`; mensagem sem `id` ou sem telefone normalizável em `from`; `smb_message_echoes` sem `id`/`to` normalizável; contact sync não-contato ou sem telefone/timestamp; history sem thread válida, grupo ou telefone; envelope sem changes. Erro HTTP/RPC não é engolido: gera 500. Assinatura/ingresso/tenant inválidos geram 403.
- Hipótese principal reproduzida em RED com fixture Meta BSUID-only (`contacts[].user_id` + `messages[].from_user_id`, sem telefone): o handler responde 200 com `accepted: 0` e não chama RPC. Hipóteses seguintes: POST era status-only; shape/field alternativo; mensagem sem `from`; menos provável, RPC idempotente em evento já existente.
- Como o POST histórico não contém metadados suficientes para confirmar qual hipótese ocorreu, nenhuma correção de normalização/banco foi aplicada. Foi adicionada observabilidade temporária protegida por `WEBHOOK_SAFE_DIAGNOSTICS=1`: request ID, field, WABA, phone-number-id, contagens/tipos, presença (não valor) de `from`/`user_id`/BSUID e status/nome da RPC. Texto, telefone, token, wamid, BSUID e payload bruto não entram no log.
