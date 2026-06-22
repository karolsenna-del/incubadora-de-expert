# Instagram Scheduler — Vault

> Credenciais e configurações sensíveis. NUNCA commitar com valores reais.
> Carregado em TODA ativação.

---

## Meta Graph API

```
META_TOKEN=           # Long-lived Instagram User Access Token (60 dias)
META_TOKEN_EXPIRES=   # Data de expiração: YYYY-MM-DD
IG_USER_ID=           # Instagram Business Account ID (número)
META_APP_ID=          # ID do App Meta (para renovação de token)
META_APP_SECRET=      # Secret do App Meta (para renovação de token)
```

**Como obter META_TOKEN:**
1. Acesse developers.facebook.com → seu app
2. Ferramentas → Graph API Explorer
3. Gere token com permissão `instagram_content_publish`
4. Troque por long-lived (SOP-002 no Playbook)

**Como obter IG_USER_ID:**
```
GET https://graph.instagram.com/v21.0/me?fields=id,username&access_token={TOKEN}
```

---

## Google Drive API

```
DRIVE_FOLDER_ID=                  # ID da pasta "instagram-staging" no Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=     # Email da Service Account
GOOGLE_SERVICE_ACCOUNT_JSON=      # Conteúdo do JSON key da Service Account (inline)
```

**Como obter:**
1. Google Cloud Console → APIs & Services → Credentials
2. Create Service Account → baixar JSON key
3. No Drive: criar pasta `instagram-staging` → compartilhar com email da Service Account (função: Editor)
4. ID da pasta = parte final da URL do Drive quando você abre a pasta

---

## Status de Configuração

- [ ] Meta Token preenchido
- [ ] IG User ID preenchido
- [ ] Drive Folder ID preenchido
- [ ] Service Account JSON preenchido
- [ ] Configuração inicial testada (SOP-100)
