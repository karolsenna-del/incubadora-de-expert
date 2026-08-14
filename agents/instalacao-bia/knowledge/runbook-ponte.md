# Runbook — Diagnóstico da Ponte Meta ↔ n8n

> KB do `conector` e do `doutor`. A conexão entre a Meta e o n8n é onde a instalação mais trava. Aqui estão os pontos conhecidos e como isolar cada um. **Diagnostique, não chute.**

---

## A árvore de diagnóstico (sempre comece por aqui)

Quando a Bia "não responde", a primeira pergunta é **onde** quebrou. Abra o n8n → **Executions** do workflow INBOUND e veja:

```
Mandei mensagem no WhatsApp. Apareceu execução no n8n?
│
├─ NÃO apareceu execução
│    → a mensagem não chegou ao n8n. Problema na PONTE DE ENTRADA (Meta → n8n).
│      Vá para a seção "Entrada" abaixo (causas 1-5).
│
├─ Apareceu mas FALHOU (vermelho)
│    → entrou, mas quebrou no meio. Veja o node que falhou:
│      • credential (Anthropic/Supabase) não atribuída → fase Preparar
│      • {{var}} não substituído no prompt → fase Construir
│
└─ Apareceu, passou (verde), mas nada chegou no WhatsApp
     → processou mas não enviou. Problema na SAÍDA (n8n → Meta).
       Vá para a seção "Saída" abaixo.
```

---

## Entrada (Meta → n8n) — os 5 pontos clássicos

A ordem aqui é por frequência. 90% das vezes é o 1 ou o 2.

### 1. Verify token não bate
A Meta valida o webhook mandando um token que tem que ser **idêntico** ao configurado no n8n. Um espaço, uma letra trocada → não verifica.
- **Checar:** comparar o verify token nos dois lados (painel Meta × node de webhook do n8n), caractere por caractere.

### 2. Workflow INBOUND inativo
Se o workflow não está ativo, o n8n não responde o desafio da Meta — o webhook nunca confirma.
- **Checar:** o WF-INBOUND está ON no n8n? Ativar antes de tentar verificar na Meta.

### 3. SSL inválido
A Meta **exige HTTPS com certificado válido**. Certificado self-signed é recusado.
- **Checar:** o domínio do webhook tem cert real (Let's Encrypt)? Abrir `https://webhook.{dominio}/...` no navegador não deve dar aviso de segurança.

### 4. Campo `messages` não inscrito
O webhook pode estar verificado, mas se o campo `messages` não foi marcado nos Webhook Fields, **nenhuma mensagem é entregue** (só eventos de status).
- **Checar:** no painel Meta → Webhook → Fields, `messages` está marcado?

### 4.1. 🚨 App não inscrito na WABA (`subscribed_apps`) — A CAUSA MAIS TRAIÇOEIRA
O webhook está verificado, `messages` marcado, e **mesmo assim mensagem real não chega**. Motivo: a Meta só dispara webhook de mensagem real pros Apps **inscritos naquela WABA** — e isso é um elo separado, que os passos de UI nem sempre criam. **Pegadinha cruel:** o botão **"Test"** da Meta (em Webhook Fields) **funciona mesmo assim** (POSTa direto na URL), então parece que tá tudo certo.
- **Sinal claro:** botão "Test" do `messages` chega no n8n, mas "oi" real não gera execução nenhuma.
- **Checar (terminal):** `curl -s "https://graph.facebook.com/v21.0/{WABA_ID}/subscribed_apps?access_token={SYSTEM_USER_TOKEN}"` — se voltar `{"data":[]}`, está QUEBRADO.
- **Corrigir:** `curl -s -X POST "https://graph.facebook.com/v21.0/{WABA_ID}/subscribed_apps?access_token={SYSTEM_USER_TOKEN}"` (esperado `{"success":true}`). Ver passo 2.7.1 do `02-meta-cloud.md`.

### 5. Número em modo de desenvolvimento
Antes de o negócio ser verificado, a WABA fica em modo dev e **só envia/recebe de números no allowlist**.
- **Checar:** seu número de teste está no allowlist (Development) da WABA?

---

## Saída (n8n → Meta) — quando processa mas não chega

A execução passou verde, mas o lead não recebeu. Causas:

- **Token Meta errado/expirado:** o token usado no envio (Sender) não tem permissão `whatsapp_business_messaging` ou expirou.
- **Phone Number ID errado:** o ID do número no node de envio não bate com o número real.
- **Fora da janela de 24h:** a Cloud API só permite mensagem livre dentro de 24h da última mensagem do lead. Fora disso, só template aprovado. (No smoke test isso não costuma ser o problema, porque você acabou de mandar mensagem.)

---

## Erros intermitentes ("às vezes funciona")

- **Contato duplicado (8/9 dígitos):** celular BR aparece com 12 ou 13 dígitos (com/sem o nono dígito). Se houver dois contatos pro mesmo número, o `active_agent_id` pode estar no errado.
  - **Checar:** na tabela de contatos, procurar o número nos dois formatos. Consolidar.
- **Race no buffer:** raríssimo; se a resposta vier picada ou duplicada, verificar o buffer.

---

## Princípios de diagnóstico (pro Doutor)

1. **Isole antes de consertar:** entrou? processou? saiu? Cada resposta corta o espaço de busca pela metade.
2. **Um teste, uma mudança:** não muda 3 coisas e testa — não vai saber qual resolveu.
3. **Não repita o mesmo teste sem mudar nada:** se nada mudou, o resultado não muda.
4. **Causa raiz, não sintoma:** "a Bia respondeu `{{var}}`" não se conserta no envio — conserta no prompt (fase Construir).
5. **Re-rode após o conserto:** só marca como resolvido o cenário que passou de novo.
