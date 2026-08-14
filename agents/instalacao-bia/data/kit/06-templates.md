# Passo 6 — Templates WhatsApp Cloud API (1 template de teste pra validar pipeline)

> Tempo estimado: 15 minutos + 1-24h aguardando aprovação Meta
> O que entrega: 1 template aprovado pra você validar que a Bia recebe + responde ponta a ponta.

---

## Onde a Bia usa templates?

**A Bia NÃO dispara templates por iniciativa própria.** Ela só RESPONDE mensagens.

Templates Cloud API são necessários pra **INICIAR conversa fora da janela 24h** — ou seja, quando o lead nunca te mandou mensagem (ou já passaram 24h da última msg dele). Pra mensagens livres (texto, imagem) dentro da janela 24h, templates não são necessários.

### Quando você vai precisar de templates?

| Cenário | Precisa de template? |
|---------|---------------------|
| Lead manda msg pro seu número WhatsApp (ele inicia) | ❌ Não. Janela 24h aberta. Bia responde livre. |
| Lead clica em link wa.me/SEUNUMERO e manda primeira msg | ❌ Não. Idem. |
| Você quer iniciar contato com lead que nunca te escreveu | ✅ Sim. Template proativo. |
| Você comprou produto na sua loja e quer enviar boas-vindas via Hotmart | ✅ Sim. Template "boas_vindas". **Mas isso é do kit-compras-hotmart, não deste.** |
| Recovery automático pra carrinho abandonado | ✅ Sim. Templates T1-T6. **kit-recovery, não deste.** |
| Disparo em massa pra base de leads | ✅ Sim. Template "convite". **kit-dispatcher, não deste.** |

**Neste kit (Bia minima), você só precisa de 1 template — pra testar pipeline.** Quando instalar os kits de negócio depois, vai submeter os templates específicos de cada (boas-vindas, recovery T1-T6, convite, etc).

---

## 6.1 — Submeter 1 template de teste

Vou te dar um template genérico simples. Adapte se quiser, mas o objetivo aqui é só TESTAR o pipeline.

### Template `teste_pipeline_bia`

- **Categoria:** UTILITY (sem prova social, sem promessa — pra Meta aprovar rápido)
- **Header:** sem (texto puro)
- **Body:** "Oi! Tudo bem? Sou a {{NOME_AGENTE}} do {{NOME_EXPERT}}. Te enviei essa mensagem pra confirmar que o canal tá funcionando. Pode me responder qualquer coisa que eu te respondo aqui mesmo."
- **Variáveis:** nenhuma (texto fixo simples)
- **Botões:** sem

### Submeter via Graph API

```bash
WABA_ID="seu_waba_id"
TOKEN="seu_system_user_token"
NOME_AGENTE="Bia"  # ou Sofia, Lia, etc
NOME_EXPERT="Tati Mota"  # você

# IMPORTANTE: variáveis Meta proíbem na primeira/última posição. Por isso o template
# acima não tem {{1}} ou {{2}} — é texto fixo. Mais fácil de aprovar.

curl -s -X POST "https://graph.facebook.com/v21.0/$WABA_ID/message_templates" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(cat <<JSON
{
  "name": "teste_pipeline_bia",
  "language": "pt_BR",
  "category": "UTILITY",
  "components": [
    {
      "type": "BODY",
      "text": "Oi! Tudo bem? Sou a $NOME_AGENTE do $NOME_EXPERT. Te enviei essa mensagem pra confirmar que o canal tá funcionando. Pode me responder qualquer coisa que eu te respondo aqui mesmo."
    }
  ]
}
JSON
)"
```

Retorna `{"id": "...", "status": "PENDING"}`. UTILITY costuma aprovar em <5 minutos.

### Verificar status

```bash
curl -s "https://graph.facebook.com/v21.0/$WABA_ID/message_templates?name=teste_pipeline_bia&fields=name,status" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 6.2 — Alternativa: usar o `hello_world` que já vem aprovado

Toda WABA nova vem com o template `hello_world` pré-aprovado da Meta. Se você só quer testar pipeline rápido, pode pular o 6.1 e usar esse direto.

```bash
# No smoke test, vamos enviar:
curl -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/messages" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"messaging_product\": \"whatsapp\",
    \"to\": \"$SEU_NUMERO\",
    \"type\": \"template\",
    \"template\": {\"name\": \"hello_world\", \"language\": {\"code\": \"en_US\"}}
  }"
```

Pra validar pipeline serve igual. Único contra: ta em inglês.

---

## 6.3 — Regras Meta pra aprovação (quando você submeter os reais depois)

Vai precisar saber isso quando instalar kits de negócio. Memorize:

1. **Variáveis NÃO podem ser primeira ou última palavra** do body. Sempre tem texto antes e depois.
   - ❌ `"{{1}}, bem-vindo"` (variável na primeira posição)
   - ✅ `"Oii {{1}}, bem-vindo"`

2. **Exemplos obrigatórios** pra cada variável. Em `example.body_text`, forneça valor exemplo pra cada `{{N}}`.

3. **Video/Image header**: usa `header_handle` obtido via Resumable Upload, NÃO URL pública direta.

4. **Nome de template**: lowercase + underscore. Não pode usar nome de template deletado por 4 semanas (quarentena Meta).

5. **Categoria**: `MARKETING` pra disparo proativo, `UTILITY` pra notificações operacionais. Meta categoriza automaticamente — você sugere mas pode mudar depois.

6. **Conteúdo proibido**: linguagem ameaçadora, promessas exageradas ("ganhe milhões em 30 dias"), conteúdo enganoso (clickbait), spam (apenas link sem contexto).

7. **Display name**: a Meta também avalia o display name da WABA. Se for genérico ("Bot", "Atendimento"), pode rejeitar.

---

## 6.4 — Upload de mídia (Resumable Upload) — pra quando precisar

Quando você instalar kit-compras ou kit-recovery, vai precisar de templates com header VIDEO/IMAGE. O upload é em 2 passos:

```bash
APP_ID="seu_app_id"
TOKEN="seu_system_user_token"
VIDEO_PATH="/caminho/seu-video.mp4"

# 1. Criar sessão de upload
FILE_LENGTH=$(stat -f%z "$VIDEO_PATH")  # macOS / Linux: stat -c%s

SESSION_ID=$(curl -s -X POST "https://graph.facebook.com/v21.0/$APP_ID/uploads" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file_length=$FILE_LENGTH" \
  -F "file_type=video/mp4" \
  -F "file_name=$(basename $VIDEO_PATH)" | jq -r '.id')

# 2. Upload do binário → retorna header_handle
HANDLE=$(curl -s -X POST "https://graph.facebook.com/v21.0/$SESSION_ID" \
  -H "Authorization: OAuth $TOKEN" \
  -H "file_offset: 0" \
  --data-binary "@$VIDEO_PATH" | jq -r '.h')
```

O `$HANDLE` vai em `components[].example.header_handle` no submit do template.

---

## 6.5 — Media ID pra ENVIO (diferente do header_handle)

Após template APROVADO com header VIDEO/IMAGE, quando você ENVIA via `/messages`, precisa passar um `media_id` no parâmetro do header — **NÃO é o mesmo `header_handle` do submit**. Esse `media_id` tem validade de ~30 dias.

```bash
PHONE_NUMBER_ID="seu_phone_number_id"

MEDIA_ID=$(curl -s -X POST "https://graph.facebook.com/v21.0/$PHONE_NUMBER_ID/media" \
  -H "Authorization: Bearer $TOKEN" \
  -F "messaging_product=whatsapp" \
  -F "type=video/mp4" \
  -F "file=@$VIDEO_PATH;type=video/mp4" | jq -r '.id')
```

> Esse media_id é o que vai hardcoded no workflow que dispara o template. Quando expirar (~30 dias), você re-upload e atualiza o workflow.

---

## 6.6 — Roadmap de templates futuros (por kit)

Quando instalar os kits de negócio depois, você vai submeter:

### kit-compras-hotmart
- `boas_vindas_VENDA_variavel` — pós-compra. Header VIDEO. Vars: nome + data evento.

### kit-recovery
- `recovery_workshop_ndf` — T1 (sempre, 15min após captura sem compra). Header VIDEO.
- `recovery_workshop_ndf_t2` — T2 (4h depois). Sem header ou header IMAGE.
- `recovery_workshop_ndf_t3` — T3 (D-15 a D-6).
- `recovery_workshop_ndf_t4` — T4 (D-5/D-4). Header IMAGE.
- `recovery_workshop_ndf_t5` — T5 (D-3/D-2). Header VIDEO.
- `recovery_workshop_ndf_t6` — T6 (D-1). Texto puro com URL.

### kit-dispatcher
- `convite_VENDA_variavel` — pra base fria/morna. Header VIDEO. Var: data.

> Cada um desses kits vai ter seu próprio doc com copies, regras Meta, header recomendado, etc. Quando você precisar, instala o kit e segue.

---

## 6.7 — Checklist final

- [ ] Pelo menos 1 template APROVADO (`teste_pipeline_bia` OU `hello_world`)
- [ ] Display name da WABA aprovado pela Meta
- [ ] Você sabe como verificar status de template via Graph API
- [ ] Você guardou o procedimento de Resumable Upload pra usar depois

---

**Próximo passo:** [`07-smoke.md`](./07-smoke.md) — smoke test end-to-end pra validar que tudo funciona.
