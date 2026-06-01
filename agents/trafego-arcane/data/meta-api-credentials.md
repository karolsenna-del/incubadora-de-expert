# Meta API — Credenciais e Configuração

**Última validação:** 2026-05-05 (Graph API v21.0)

Este documento descreve **o que** o squad precisa de credencial Meta e **como armazenar com segurança**. O squad não impõe um gerenciador específico — escolha o que tiver instalado.

---

## 1. Pré-requisitos no Meta

Antes de configurar credenciais, garanta que você tem:

| Item | Onde criar | Observação |
|------|------------|------------|
| **Conta Meta Business Manager** | https://business.facebook.com | A casa do seu negócio |
| **App Meta** com Marketing API habilitada | https://developers.facebook.com/apps | Tipo "Business". Anote o `app_id` |
| **System User** no Business Manager | BM → Configurações → Usuários do sistema | Cria usuário "Admin" do sistema |
| **System User Token** (long-lived, não expira) | BM → System User → Gerar token | **Permissões mínimas a marcar:** `ads_management`, `ads_read`, `business_management`, `pages_manage_ads`, `pages_read_engagement` |
| **Conta de Anúncio** atribuída ao System User | BM → Contas de Anúncio → Atribuir pessoas → seu System User com função "Admin" | Sem isso o token não enxerga a conta |
| **Página Facebook** atribuída ao System User | BM → Páginas → Atribuir pessoas → seu System User com função "Anunciante" | Pra publicar anúncios |
| **Pixel** instalado no site + atribuído ao BM | Events Manager → Configurar pixel | Anote o `pixel_id` |
| **Conta Instagram Business** vinculada à Página Facebook | Página → Configurações → Instagram | Pra anúncios em IG |

---

## 2. Lista de credenciais que o squad usa

Independente de onde você guarde, são estes os 9 valores que o squad precisa:

| Campo | Tipo | Exemplo | Como obter |
|-------|------|---------|------------|
| `META_TOKEN` | secreto | `EAA...DZD` | System User Token (não expira) |
| `META_API_VERSION` | texto | `v21.0` | Versão Graph API a usar |
| `META_APP_ID` | texto | `1234567890123456` | ID do app Meta |
| `META_BM_ID` | texto | `123456789012345` | Business Manager ID |
| `META_ACCT_MAIN` | texto | `act_999888777666555` | Conta de anúncios principal (formato `act_NNNN`) |
| `META_ACCT_ESCALA` | texto opcional | `act_NNNN` | Conta dedicada Escala (se separada) |
| `META_ACCT_TESTE` | texto opcional | `act_NNNN` | Conta dedicada Teste (se separada) |
| `META_PIXEL` | texto | `111122223333444` | ID do Pixel |
| `META_PAGE` | texto | `555444333222111` | ID da Página Facebook |
| `META_IG` | texto | `17841400000000000` | Instagram Business Account ID. Descobre com: `curl "https://graph.facebook.com/v21.0/{PAGE}?fields=instagram_business_account&access_token={TOKEN}"` |

---

## 3. Onde guardar — 3 opções suportadas

O squad procura credenciais nesta ordem (primeira que existir, ganha):

### Opção A — Variáveis de ambiente já populadas (mais simples)

Você seta as `META_*` no shell antes de chamar o squad. Útil pra testes rápidos:

```bash
export META_TOKEN="EAA..."
export META_API_VERSION="v21.0"
export META_BM_ID="123456789012345"
export META_ACCT_MAIN="act_999888777666555"
export META_PIXEL="111122223333444"
export META_PAGE="555444333222111"
export META_IG="17841400000000000"
```

**Quando usar:** prototipação ou um sistema que injeta env vars (Docker, CI).

---

### Opção B — Arquivo `.env` no squad (recomendado pra uso pessoal)

Crie `data/.env` (gitignored) na raiz do squad com:

```bash
# data/.env — NÃO COMMITAR
META_TOKEN=EAA...
META_API_VERSION=v21.0
META_APP_ID=1234567890123456
META_BM_ID=123456789012345
META_ACCT_MAIN=act_999888777666555
META_ACCT_ESCALA=
META_ACCT_TESTE=
META_PIXEL=111122223333444
META_PAGE=555444333222111
META_IG=17841400000000000
```

**Garanta que está no `.gitignore`:**

```
# squads/trafego-arcane/.gitignore
data/.env
```

**Quando usar:** uso pessoal num único Mac / Linux.

---

### Opção C — 1Password CLI (recomendado pra times / múltiplas máquinas)

Crie um item no 1Password (qualquer vault que você tenha acesso) com **título** `Meta API` e os fields:

| Field name | Tipo |
|------------|------|
| `access_token` | Concealed (Password) |
| `api_version` | Text |
| `app_id` | Text |
| `bm_id` | Text |
| `account_main` | Text |
| `account_escala` | Text (vazio se não tem) |
| `account_teste` | Text (vazio se não tem) |
| `pixel_id` | Text |
| `page_id` | Text |
| `ig_user_id` | Text |

Depois exporte a variável que aponta pro vault que você usou:

```bash
export META_OP_VAULT="seu-vault-aqui"   # ex: "Private", "claude", "Marketing"
```

**Pré-requisitos da Opção C:**
- 1Password CLI instalado: https://developer.1password.com/docs/cli/get-started
- Service Account token configurado: `OP_SERVICE_ACCOUNT_TOKEN` em env (preferível) ou login interativo

**Quando usar:** múltiplas pessoas usando o squad, ou múltiplas máquinas, ou compliance.

---

## 4. Carregar credenciais — script helper

Use o script `data/load-meta-creds.sh` (já incluído no squad). Ele detecta automaticamente qual opção (A/B/C) você está usando:

```bash
# Da raiz do squad:
source ./data/load-meta-creds.sh

# Ou de qualquer lugar (script descobre seu próprio path):
source $(dirname $(realpath path/to/squad))/data/load-meta-creds.sh
```

Ao final imprime o resumo (sem expor o token):

```
✓ Meta API creds carregadas (origem: env|.env|1Password)
  - API: v21.0
  - BM: 123456789012345
  - Main account: act_999888777666555
  - Pixel: 111122223333444
  - Page: 555444333222111
```

---

## 5. Smoke test (depois de configurar)

```bash
source ./data/load-meta-creds.sh
curl -s "https://graph.facebook.com/${META_API_VERSION}/me?access_token=${META_TOKEN}"
```

Deve retornar `{"name":"NomeDoApp","id":"NNN..."}`. Se retornar erro, token está errado, expirado ou sem permissão.

---

## 6. Rotação de token

System User token **não expira**, mas você pode ser obrigado a gerar novo se:
- Token vazou (rotacionar imediatamente)
- App perdeu acesso ao BM
- Permissões mudaram

**Como rotacionar:**
1. BM → Configurações → Usuários do sistema → seu System User → Gerar novo token
2. Atualizar nova credencial onde quer que esteja (env / .env / 1Password)
3. Smoke test
4. Token antigo continua válido até você revogá-lo manualmente — revogar após confirmar que o novo funciona

---

## 7. Operação no squad

| Agente | Responsabilidade |
|--------|------------------|
| `agents/setup-operator.md` | Orienta o usuário em criar app Meta + System User + popular credenciais (uma das 3 opções) |
| `agents/scale-operator.md` | Lê credenciais via `load-meta-creds.sh`, monta payloads, sobe campanhas Escala |
| `agents/test-operator.md` | Idem, mas pra Conta Teste |

---

## 8. Segurança — regras inegociáveis

- ❌ **NUNCA commitar** `data/.env` ou qualquer arquivo com token em texto claro no git
- ❌ **NUNCA logar/imprimir** o token completo (squad usa `${META_TOKEN:0:10}...` em logs se precisar)
- ❌ **NUNCA passar** token por argumento de comando (fica em histórico shell). Use env var ou stdin
- ✅ **SEMPRE usar HTTPS** nas chamadas (graph.facebook.com já é https)
- ✅ **REVOGAR** tokens vazados imediatamente
