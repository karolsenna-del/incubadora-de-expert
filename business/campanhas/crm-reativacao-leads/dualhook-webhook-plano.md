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
