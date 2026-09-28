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
- Migration não aplicada: duas chamadas seguras à Management API ficaram bloqueadas aguardando aprovação do executor. Não conectar o número antes de aplicá-la.
