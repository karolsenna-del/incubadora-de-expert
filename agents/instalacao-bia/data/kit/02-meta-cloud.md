# Passo 2 — Meta WhatsApp Cloud API (BM + WABA + Número + Webhook)

> Tempo estimado: 60-90 minutos (depende da verificação do número)
> O que entrega: BM + WABA + App + System User Token + Número registrado + Webhook apontando pro seu n8n

---

## Pré-requisito

- Conta Facebook pessoal ativa (você vai criar o BM a partir dela)
- Número de telefone disponível que **NÃO esteja em uso no WhatsApp pessoal** ou em outra conta Business
- Acesso ao painel do n8n (vai precisar pegar a URL do webhook)

---

## 2.1 — Criar Business Manager (BM)

1. Acesse `business.facebook.com`
2. Clique em **Create Account**
3. Preencha:
   - Nome do BM (ex: "Sua Marca BM")
   - Seu nome
   - Email comercial
4. Confirme via email

Anote o **Business Manager ID** (aparece em Business Settings > Business Info)

---

## 2.2 — Criar WABA (WhatsApp Business Account) dentro do BM

1. **Business Settings (engrenagem no topo) > Accounts > WhatsApp Accounts**
2. Clique **Add > Create a WhatsApp Business Account**
3. Preencha:
   - Nome da WABA (ex: "{{NOME_AGENTE}} WABA")
   - Categoria do negócio
   - País/região
4. Confirme

Anote o **WABA ID** (aparece em WhatsApp Accounts > [sua WABA] > Settings)

---

## 2.3 — Criar App no Meta for Developers

1. Acesse `developers.facebook.com/apps`
2. Clique **Create App**
3. Escolha tipo **Business**
4. Preencha:
   - Nome do App (ex: "{{NOME_AGENTE}} Cloud API")
   - Email
   - Vincular ao BM criado no passo 2.1
5. Após criar, vai pro dashboard do App
6. Em **Add Product**, adicione **WhatsApp** (clique Set Up)

### Anote estas credenciais:

- **App ID** (topo do dashboard)
- **App Secret** (Settings > Basic > App Secret > Show — vai pedir senha do Facebook)

---

## 2.4 — Associar WABA ao App

No App dashboard > WhatsApp > Getting Started:

1. Selecione o BM
2. Selecione a WABA criada no passo 2.2
3. Confirme

Agora o App pode enviar/receber mensagens em nome dessa WABA.

---

## 2.5 — Criar System User + token permanente

> **Por que System User e não User Token:** User Token expira em 60 dias. System User Token nunca expira.

1. **Business Settings > Users > System Users**
2. Clique **Add**
3. Configure:
   - Nome (ex: "{{NOME_AGENTE}} Bot")
   - Role: **Admin**
4. Após criar, clique no System User > **Add Assets**
5. Adicione:
   - **Apps**: o App criado no 2.3 — role **Develop**
   - **WhatsApp Accounts**: a WABA criada no 2.2 — role **Full Control**
6. Clique no System User > **Generate New Token**
7. Selecione o App criado
8. Marque as permissões:
   - [x] `whatsapp_business_messaging`
   - [x] `whatsapp_business_management`
   - [x] `business_management`
9. Token expiration: **Never**
10. Clique **Generate Token**

### Anote agora (vai aparecer SÓ UMA VEZ):

- **System User Token** (string longa começando com `EAA...`)

> Se você fechar a tela sem copiar, terá que gerar um novo (o antigo continua válido).

---

## 2.6 — Registrar número de telefone na WABA

1. **Business Settings > WhatsApp Accounts > [sua WABA] > Phone Numbers**
2. Clique **Add Phone Number**
3. Preencha:
   - Nome de exibição (aparece pro lead — ex: "{{NOME_EMPRESA}}")
   - Categoria
   - Descrição
4. Adicione o número (DDI + DDD + número)
5. Verifique via SMS ou voice call

### Importante — Display Name:

A Meta avalia o display name. Se for genérico ("Atendimento", "Bot", "AI") pode ser rejeitado por causar confusão. Use **nome da pessoa/empresa**. Se rejeitar, você pode trocar no Business Settings.

### Anote agora:

- **Phone Number ID** (ID interno gerado pela Meta — diferente do número em si)
- **Número de telefone** registrado
- **PIN de 2 etapas** (a Meta exige você criar um — guarde no cofre)

---

## 2.7 — Configurar webhook na WABA

> **Pré-requisito:** o WF-INBOUND-CLOUD precisa estar importado e **ATIVO** no n8n antes de configurar o webhook. Se você ainda não importou (passo 4), pule pro passo 4 primeiro e depois volte aqui.
>
> Se vai importar agora: o webhook do WF-INBOUND-CLOUD provavelmente é `/webhook/wf-inbound-cloud` na URL `https://webhook.seudominio.com`. Verifique abrindo o workflow no n8n editor e olhando o node de webhook inicial.

### Passos:

1. Defina um **Verify Token** (string aleatória que você inventa — ex: `bia-cloud-{{SEU_DOMINIO}}-2026`). Vai ser o mesmo dos 2 lados (Meta e n8n).

2. No node webhook do WF-INBOUND-CLOUD (no n8n), configure essa string como Verify Token. Salve e ative o workflow.

3. Volte pro Meta App Dashboard > **WhatsApp > Configuration > Webhook**:
   - **Callback URL:** `https://webhook.SEUDOMINIO.com/webhook/wf-inbound-cloud`
   - **Verify Token:** o mesmo que você definiu acima
   - Clique **Verify and Save**

4. Se o n8n estiver respondendo certo, Meta valida e salva. Se der erro, verifique:
   - Workflow está ATIVO no n8n?
   - URL acessível via curl externo? `curl -s -o /dev/null -w "%{http_code}\n" https://webhook.SEUDOMINIO.com/webhook/wf-inbound-cloud` deve retornar 200 ou pelo menos algo diferente de 404
   - Verify token bate exatamente entre n8n e Meta?

5. Após validar webhook, em **Webhook fields**, marque:
   - [x] `messages` (obrigatório — eventos de mensagens recebidas)
   - [ ] `message_template_status_update` (opcional — útil pra saber quando template muda de status)
   - [ ] `messaging_handovers` (opcional — handover Cloud API para Business app, raramente usado)

---

## 2.7.1 — 🚨 OBRIGATÓRIO: inscrever o App na WABA (o passo que quase ninguém faz e trava tudo)

Configurar o webhook (2.7) e associar a WABA ao App (2.4) **NÃO basta**. Falta um elo: a Meta só dispara webhook de mensagem real pros Apps que estão **inscritos naquela WABA** (`subscribed_apps`). Se esse elo estiver vazio, **mensagem real nunca chega no seu n8n** — e o pior: o botão **"Test"** da Meta (em Webhook fields) **funciona mesmo assim**, porque ele POSTa direto na sua URL ignorando a inscrição. Isso te dá a falsa sensação de que está tudo certo.

> **Sintoma exato dessa pegadinha:** o botão "Test" do campo `messages` chega no n8n e roda o fluxo, mas quando você manda um "oi" de verdade pro número da Bia, **não aparece execução nenhuma** no WF-INBOUND-CLOUD.

**Conferir e corrigir** (cole no terminal, troca os 2 valores pelos seus):

```bash
TOKEN="{{SYSTEM_USER_TOKEN}}"
WABA_ID="{{WABA_ID}}"

# 1) CONFERIR — tem que listar o seu App. Se voltar {"data":[]} está QUEBRADO:
curl -s "https://graph.facebook.com/v21.0/$WABA_ID/subscribed_apps?access_token=$TOKEN"

# 2) CORRIGIR — inscreve o App na WABA (esperado: {"success":true}):
curl -s -X POST "https://graph.facebook.com/v21.0/$WABA_ID/subscribed_apps?access_token=$TOKEN"
```

Depois do POST, mensagem real passa a chegar na hora. (Reversível com `DELETE` no mesmo endpoint, se algum dia precisar desinscrever.)

> O seu System User Token (gerado no 2.5, com a permissão `whatsapp_business_management`) já consegue fazer esses dois comandos.

---

## 2.8 — Teste final — enviar template hello_world pra si mesmo

```bash
TOKEN="{{SEU_SYSTEM_USER_TOKEN}}"
PHONE_NUMBER_ID="{{SEU_PHONE_NUMBER_ID}}"
SEU_TELEFONE="55DDDNUMERO"  # seu próprio número, só dígitos, com 55

# Antes de mandar template livre, o número de destino precisa estar no allowlist
# (na primeira fase a WABA é "Development", limitada a números pré-autorizados)
# Vai em: WhatsApp > API Setup > "To" — adicione o número de teste

curl -s -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"messaging_product\": \"whatsapp\",
    \"to\": \"$SEU_TELEFONE\",
    \"type\": \"template\",
    \"template\": {\"name\": \"hello_world\", \"language\": {\"code\": \"en_US\"}}
  }"
```

Você deve receber no WhatsApp pessoal:
> Hello World
> Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the WhatsApp Business Platform...

Se receber: **Meta API funcionando, webhook validado, número ativo.** ✓

Se NÃO receber, verifique:
- `accepted` no retorno do curl? Se sim, mas não chegou: provavelmente número não está no allowlist Development. Vai em **API Setup > To**.
- `error` no retorno do curl? Leia a mensagem. Se for `131056 phone number not registered` → registrou no passo 2.6 errado.
- Token expirado? Improvável (System User não expira) mas verifica.

---

## 2.9 — Sair do modo "Development" e ir pra "Production"

Inicialmente sua WABA está em modo Development:
- Só pode enviar pra números pré-autorizados (max 5)
- Templates funcionam, mas com rate limit baixo

Pra sair pra Production:

1. **App Dashboard > Settings > Basic** — preencha:
   - Privacy Policy URL
   - Category
2. **App Dashboard > App Review > Permissions and Features** — solicite review pra:
   - `whatsapp_business_messaging` (Live mode)
   - `whatsapp_business_management` (Live mode)
3. Verificação da empresa (Business Verification): **Business Settings > Security Center > Business Verification** — envie documentos
4. Após Business Verification aprovada + App em Live: você sai do Development

> Para os primeiros testes da Bia, **Development mode basta**. Só precise virar Live quando for disparar pra base real (>5 números).

---

## 2.10 — Checklist final do passo

- [ ] BM criado e anotado o BM ID
- [ ] WABA criada e anotado o WABA ID
- [ ] App criado no Meta for Developers + WhatsApp product adicionado
- [ ] WABA associada ao App
- [ ] System User criado com role Admin
- [ ] System User Token gerado com 3 permissões + Never expire
- [ ] Token anotado no cofre (SE PERDER, gera outro — antigo continua válido)
- [ ] Número de telefone registrado e verificado na WABA
- [ ] Phone Number ID anotado
- [ ] PIN de 2 etapas anotado no cofre
- [ ] Webhook configurado: Callback URL aponta pro seu n8n + Verify Token validado pela Meta
- [ ] Campo `messages` subscrito no webhook
- [ ] **App inscrito na WABA** (`GET /subscribed_apps` lista o App — passo 2.7.1) ⚠️ sem isso msg real não chega
- [ ] Teste hello_world recebido no seu WhatsApp pessoal

---

## Resumo de credenciais que você vai usar daqui pra frente

| Variável | Onde usa |
|----------|----------|
| `WABA_ID` | Submeter templates, listar templates |
| `APP_ID` | Upload de mídia (Resumable Upload) |
| `APP_SECRET` | Validar assinatura X-Hub-Signature-256 do webhook |
| `PHONE_NUMBER_ID` | Enviar mensagens via Graph API |
| `SYSTEM_USER_TOKEN` | Authorization de todas chamadas Graph API |
| `VERIFY_TOKEN` | Validar webhook handshake |
| `PIN` | Re-registrar número se cair |

Guarde todas no seu cofre.

---

## 2.12 — Vários números (convite + atendimento, ou backup pra failover)

Você provavelmente vai querer mais de um número da Bia com o tempo (ex: um pra **convite/prospecção** e outro pra **atendimento**, ou um **backup** caso o principal tome bloqueio). Como fazer isso direito:

### Caminho recomendado: todos os números na MESMA BM
A forma mais simples e sem dor de cabeça. Um System User Token cobre **todos os números da mesma BM** — então você reusa o mesmo `SYSTEM_USER_TOKEN`.

Pra cada número novo:
1. Registre e verifique o número na sua WABA (passo 2.6) — ou crie outra WABA na mesma BM.
2. **Inscreva o App na WABA daquele número** (passo 2.7.1 — `POST /subscribed_apps`). É **por WABA**: cada WABA precisa do seu.
3. No workflow **WF-INBOUND-CLOUD**, node `Resolve Contact`, adicione uma linha no `PHONE_AGENT_MAP` mapeando o `phone_number_id` novo pro agente dele:
   ```js
   const PHONE_AGENT_MAP = {
     '{{PHONE_NUMBER_ID}}': 'bia',            // seu 1º número
     '<phone_number_id_2>': 'bia-atendimento', // 2º número
   };
   ```
4. No **WF-OUTBOUND-CLOUD**, node `Config Cloud API`, adicione o mesmo mapeamento agente→número no `PHONE_NUMBER_MAP`.
5. Customize o prompt L3 do novo agente (passo de prompts).

> Como é a mesma BM, o **token é o mesmo** — não precisa mexer em mais nada de credencial.

### Caminho avançado: números em BMs DIFERENTES (failover real / isolamento de ban)
Se você criar os números em **BMs separadas** (pra que um ban não derrube tudo — o modelo que a Arka usa), cada BM tem um **token próprio**, e um token de uma BM **não envia** por número de outra (dá erro 400 "missing permissions").

O kit **já vem preparado** pra isso: tem um mapa `TOKEN_BY_PHONE` (número → token) nos nodes de envio. Pra cada número de **outra BM**, além dos passos acima:

6. **WF-OUTBOUND-CLOUD** → node `Config Cloud API` → adicione a linha no `TOKEN_BY_PHONE`:
   ```js
   const TOKEN_BY_PHONE = {
     '{{PHONE_NUMBER_ID}}': '{{SYSTEM_USER_TOKEN}}',  // número da BM 1
     '<phone_number_id_2>': '<system_user_token_2>',  // número da BM 2
   };
   ```
7. **WF-CHATWOOT-HUMAN** → node `Envia via Cloud API` → adicione a **mesma** linha no `TOKEN_BY_PHONE` (pra resposta humana também sair pela BM certa).

> ⚠️ **Limitação honesta (igual na produção da Arka):** o **download de mídia recebida** e a **confirmação de opt-out** (no WF-INBOUND-CLOUD) usam o **token primário**. Pra números da **mesma BM** funciona 100%. Pra um número de **outra BM**, essas 2 funções específicas usariam o token primário — então áudio/imagem recebidos nesse número e a confirmação de "Sair" podem falhar. O caminho de **resposta** (bot e humano) funciona certo. Se isso for crítico pro teu caso, fale com o **@bia-chief**.

---

**Próximo passo:** [`04-credentials.md`](./04-credentials.md) — configurar credentials no n8n (Anthropic + OpenAI + Supabase + Meta Cloud API).

> Nota sobre ordem: vamos no 04 antes do 03 (importar workflows) porque os workflows precisam das credentials pra rodar. Se importar primeiro, eles entram com credentials quebrados.
