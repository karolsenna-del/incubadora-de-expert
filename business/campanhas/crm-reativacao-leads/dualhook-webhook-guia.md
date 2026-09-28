# Webhook Dualhook / WhatsApp Coexistence — guia operacional

## Endpoint

- Base pública: `https://vendas.incubadoradeexpert.com.br/api/whatsapp-webhook`
- A URL completa com o segredo de ingresso e o verify token ficam somente em `business/vault/dualhook.md` (arquivo privado/ignorado pelo Git).
- Campos aceitos: `messages`, `smb_message_echoes`, `history` e `smb_app_state_sync`.

## Variáveis de ambiente (sem valores)

Obrigatórias na Vercel:

- `META_WEBHOOK_VERIFY_TOKEN`
- `META_WEBHOOK_INGRESS_TOKEN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Definir após o onboarding, assim que os identificadores aparecerem na conexão Dualhook:

- `META_EXPECTED_WABA_ID`
- `META_EXPECTED_PHONE_NUMBER_ID`

Opcional somente para uma integração com app Meta próprio:

- `META_APP_SECRET`

No Embedded Signup padrão do Dualhook, a Meta assina o POST com o segredo do app Meta do Dualhook, que não é fornecido aos clientes. Portanto, não configurar `META_APP_SECRET` nesse fluxo: a proteção aplicável é URL com segredo de alta entropia, validação do envelope e, depois do onboarding, allowlist de WABA ID e phone number ID. O verify token serve apenas ao GET challenge e não valida POST.

## Antes de conectar

1. Aplicar `migrations/003_dualhook_whatsapp.sql` no Supabase e confirmar as tabelas `crm_whatsapp_events`, `crm_whatsapp_sync_state` e as funções RPC.
2. Confirmar GET challenge com a URL completa e o verify token privados.
3. No Dualhook, cadastrar a URL completa e o verify token de `business/vault/dualhook.md`.
4. Só então iniciar o Embedded Signup.

## Passos exclusivos da Karol no Embedded Signup

1. Usar o número comercial que já está ativo no WhatsApp Business. Se ele não aparecer como `Registered`, escolher **Enter a new phone number** e digitar esse mesmo número — “new” significa novo para a plataforma Meta, não um número novo para Karol.
2. Confirmar se aparece o perfil atual do WhatsApp Business. Se a Meta pedir código por SMS/voz, voltar e parar: isso é o caminho API-only, não Coexistence.
3. Escolher o portfólio empresarial correto.
4. No celular principal, escanear o QR e tocar em **Connect to the Business Platform**.
5. Aprovar pessoalmente o compartilhamento de contatos e, quando perguntado, o histórico. A escolha de compartilhar histórico é única para essa conexão.
6. Conferir o portfólio/WABA, aprovar as permissões e clicar em **Finish**. Não é necessário cadastrar pagamento.
7. Manter o WhatsApp Business aberto enquanto a Meta prepara a sincronização.

Nenhum agente deve escanear o QR, aceitar consentimento ou permissões em nome da Karol.

## Janela crítica e conferência

- Dualhook solicita primeiro contact sync e depois history sync; ambos são one-shot e precisam ser iniciados em até **24 horas após o onboarding**.
- Histórico: até 180 dias, fases 0/1/2, possivelmente vários chunks; somente `progress=100` conclui.
- Grupos são ignorados.
- Dualhook não armazena nem reexecuta esses payloads. Se o endpoint perder um chunk, não existe replay pelo Dualhook.
- Conferir no Supabase: progresso 100 em `crm_whatsapp_sync_state`, eventos sem duplicação por `event_key` e contatos em `crm_leads`.

## Comportamento no CRM

- Telefone é normalizado em E.164 no evento e comparado por dígitos com `crm_leads.telefone` para compatibilidade.
- Contato ausente é criado com origem `dualhook_whatsapp`; contact sync `add` atualiza o nome.
- `wamid` ou chave estável de contact sync impede duplicação.
- Corpo textual e metadados comerciais mínimos são persistidos; payload bruto e mensagens não vão para logs.
- Último contato e direção são atualizados somente por evento novo.
- Mensagem nova de entrada marca `whatsapp_followup_state='revisao_pendente'`. Isso não agenda, não envia e não cria follow-up automaticamente; exige revisão humana.
