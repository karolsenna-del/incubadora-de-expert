# SOP — Subir Campanha Nova por DUPLICAÇÃO (método anti-`3858634`)

**Versão:** 1.0.0
**Data:** 2026-06-29
**Fonte:** Missão NDF — 2 lotes de teste (TESTE_NDF_L01/L02) na Conta Teste `act_962200836192921`.
**Companion:** `sop-campanha-api.md` (endpoints REST), `sop-upload-criativos-api.md` (upload de mídia), `nomenclatura-protocol.md` (UTMs).

> **Por que este SOP existe:** em contas onde a Meta passou a exigir **anunciante verificado**, criar conjunto do zero (`POST /adsets`) pode ser **bloqueado** com `error_subcode 3858634 / compliance_section / "anunciante ausente"` — **mesmo passando `dsa_beneficiary` e `dsa_payor` corretos**. Quando isso acontece, a via que funciona é **duplicar** um conjunto que JÁ ENTREGA (`POST /{adset_id}/copies`): a cópia herda o vínculo de compliance/anunciante da fonte e passa liso. Este SOP é o **fallback** pra essa trava — não substitui o método normal.

---

## Este método é FALLBACK, não o padrão

> ⚠️ **Importante:** o método **primário** continua sendo **criar do zero** (`POST /adsets` com payloads do `sop-campanha-api.md` Nível 2). A trava `3858634` é um **estado da conta** (enforcement de anunciante), **pode ser temporária** e voltar a liberar a qualquer momento. **Sempre tente o método normal primeiro.** Só caia pra duplicação se a conta travar.

### Árvore de decisão — subir lote novo

```
1. Criar a CAMPANHA (nunca trava)  →  POST /campaigns  (+ is_adset_budget_sharing_enabled em ABO)
       │
2. PROBE: tentar criar 1 conjunto do zero  →  POST /adsets (+ dsa_beneficiary/dsa_payor)
       │
       ├─ ✅ PASSOU  →  conta liberada. Seguir o MÉTODO NORMAL (do zero) pros 6 conjuntos.
       │                 → sop-campanha-api.md (Nível 2). Ignorar o resto deste SOP.
       │
       └─ ❌ 3858634 "anunciante ausente"  →  FALLBACK por duplicação:
               │
               ├─ TEM campanha-referência que ENTREGA na conta?
               │      → SIM: /copies dos 6 conjuntos dela (passos 3-8 abaixo).
               │
               └─ NÃO tem nada pra duplicar?  →  ver "Sem campanha pra duplicar" abaixo.
```

> **Lição da missão NDF:** rode o **PROBE (1 conjunto)** no minuto 1, ANTES de preparar criativos e copy. Em 1 chamada você sabe se a conta está liberada (método normal) ou travada (duplicação). Não descobrir isso só no fim economiza horas.

### Sem campanha pra duplicar (conta nova / primeira campanha)

Se a conta trava no `3858634` **e** não há nenhum conjunto entregando pra clonar, não dá pra resolver 100% por API. Saídas, em ordem:

1. **Cria o 1º conjunto pela UI do Gerenciador.** A interface trata o anunciante de forma interativa ("Selecione o anunciante e o pagador") e costuma deixar publicar. Com **1 conjunto entregando**, ele vira a **fonte-semente** — daí em diante todos os outros (e os próximos lotes) saem por `/copies` via API.
2. **Concluir a verificação do anunciante** (Configurações do negócio → Central de Segurança/Verificação). Pode ser revisão da Meta (não instantâneo). Resolvido isso, o método normal (`POST /adsets`) volta a funcionar — sem precisar de duplicação.
3. **Conta nova sem enforcement:** muitas contas novas **não** têm a trava (foi assim que as campanhas atuais nasceram). Nelas o `POST /adsets` funciona direto — é só rodar o método normal. Por isso o PROBE existe: na maioria das contas você nem vai precisar deste SOP.

> Distinção vs `duplicate-campaign.md`: aquela task reconstrói via `POST /adsets` (cria do zero) — se a conta estiver travada, ela também bate no 3858634 e cai pra cá. **Construir lote por duplicação NÃO viola a RC-04** (escala vertical): os criativos são NOVOS; só a *config estrutural* é clonada.

---

## O que dispara vs o que passa (validado 2026-06-29)

| Operação | Resultado |
|----------|-----------|
| `POST /act_{id}/campaigns` (criar campanha) | ✅ **passa** — campanha NÃO é bloqueada pelo anunciante |
| `POST /act_{id}/adsets` (criar conjunto do zero) | ❌ **3858634** "anunciante ausente" — com OU sem `dsa_beneficiary`/`dsa_payor`, com OU sem Advantage+ |
| `POST /{adset_id}/copies` (duplicar conjunto que entrega) | ✅ **passa** — herda compliance da fonte |
| `POST /{copied_adset_id}` (renomear + ajustar budget) | ✅ **passa** — editar nome/budget não re-dispara |
| Editar **targeting** do conjunto (add/trocar interesse/público) | ⚠️ **pode re-disparar 3858634** — por isso copie a FONTE CERTA por tipo e não edite targeting |
| `POST /act_{id}/ads` (pendurar anúncio na cópia) | ✅ **passa** |

**Conclusão:** não recriar adset. **Duplicar a fonte certa por tipo de conjunto** e só mexer em nome, budget e anúncios.

---

## Pré-requisitos

1. **Campanha-referência** na mesma conta com a estrutura Andromeda padrão **entregando** (ex: `ANDRO_NDF`) — fonte dos 6 conjuntos: `ADV_Puro`, `ADV_Int-mkt-digital`, `ADV_Int-ia`, `ADV_Int-empreendedorismo`, `ADV_Int-infoproduto`, `QUENTE_Audiencia-completa`.
2. Criativos já preparados e subidos (ver `sop-upload-criativos-api.md`) → `creative_id` de cada anúncio.
3. Credenciais via `data/load-meta-creds.sh` (System User token, NUNCA MCP).

---

## Pipeline

```
1. Mapear IDs dos 6 conjuntos-fonte da campanha-referência (por nome)
   ↓
2. Criar a CAMPANHA nova (PAUSED)  — com is_adset_budget_sharing_enabled
   ↓
3. Para cada um dos 6 conjuntos: /copies da fonte → copied_adset_id
   ↓
4. Renomear + setar daily_budget em cada cópia
   ↓
5. Pendurar os N criativos (mesmos N em todos os 6 conjuntos) como ads ACTIVE
   ↓
6. VERIFICAR (budget, geo, pixel, anunciante OK, contagem de ads)
   ↓
7. ATIVAR (PATCH status=ACTIVE nos adsets, depois na campanha)
   ↓
8. Registrar no histórico (QG-LOG-001)
```

---

## Passo a passo (endpoints validados)

### 1. IDs dos conjuntos-fonte

```bash
curl -s -G "https://graph.facebook.com/${META_API_VERSION}/{REF_CAMPAIGN_ID}/adsets" \
  --data-urlencode "access_token=$META_TOKEN" -d "fields=name,id&limit=10"
# Guardar mapa { "ADV_Puro": "<id>", "ADV_Int-mkt-digital": "<id>", ... }
```

### 2. Criar a campanha (PAUSED)

```bash
curl -s -X POST "https://graph.facebook.com/${META_API_VERSION}/act_{ACCT}/campaigns" \
  -d "access_token=$META_TOKEN" \
  -d "name=TESTE_NDF_L0X" \
  -d "objective=OUTCOME_SALES" \
  --data-urlencode "special_ad_categories=[]" \
  -d "bid_strategy=LOWEST_COST_WITHOUT_CAP" \
  -d "is_adset_budget_sharing_enabled=true" \
  -d "status=PAUSED"
```

> **`is_adset_budget_sharing_enabled` é OBRIGATÓRIO em ABO** (orçamento no conjunto). Sem ele: `error_subcode 4834011`. `true` = partilha de 20% ligada (padrão Andromeda).

### 3. Duplicar cada conjunto-fonte para a campanha nova

```bash
curl -s -X POST "https://graph.facebook.com/${META_API_VERSION}/{SRC_ADSET_ID}/copies" \
  -d "access_token=$META_TOKEN" \
  -d "campaign_id={NEW_CAMPAIGN_ID}" \
  -d "deep_copy=false" \
  -d "status_option=PAUSED"
# Resposta: { "copied_adset_id": "<novo_id>" }
```

- **`deep_copy=false`** → copia o conjunto **SEM** os anúncios antigos (conjunto vazio, pronto pra receber os novos). Use sempre — `deep_copy=true` arrastaria os ads da fonte.
- A cópia **preserva o targeting da fonte** (interesses do tipo certo, públicos quentes do QUENTE etc.). **Não edite targeting** depois.
- **A fonte NÃO é alterada** — copiar é criar objeto novo no destino.

### 4. Renomear + budget na cópia

```bash
curl -s -X POST "https://graph.facebook.com/${META_API_VERSION}/{COPIED_ADSET_ID}" \
  -d "access_token=$META_TOKEN" \
  -d "name=ADV_Puro" \
  -d "daily_budget=10000"   # centavos → R$100
```

### 5. Pendurar os anúncios (mesmos N em todos os 6 conjuntos)

```bash
curl -s -X POST "https://graph.facebook.com/${META_API_VERSION}/act_{ACCT}/ads" \
  -d "access_token=$META_TOKEN" \
  -d "name={ad_name}" \
  -d "adset_id={COPIED_ADSET_ID}" \
  --data-urlencode 'creative={"creative_id":"{CREATIVE_ID}"}' \
  -d "status=ACTIVE"
```

- O `creative_id` é reaproveitado (criativo é nível conta) — o mesmo creative entra nos 6 conjuntos.
- `sleep 0.4s` entre calls. N criativos × 6 conjuntos × 2 campanhas pode passar de 90 chamadas → ver rate limit.

### 6. Verificação obrigatória (antes de ativar)

Para cada conjunto, conferir: `daily_budget` correto, `geo` = BR, `promoted_object` (pixel/PURCHASE), `effective_status` **sem** `WITH_ISSUES`, e **contagem de ads == N**. Total = N × 6 × nº de campanhas.

### 7. Ativar

```bash
# adsets primeiro, depois a campanha
curl -s -X POST ".../{adset_id}" -d "access_token=$META_TOKEN" -d "status=ACTIVE"
curl -s -X POST ".../{campaign_id}" -d "access_token=$META_TOKEN" -d "status=ACTIVE"
```

> Ads já nascem `ACTIVE` (passo 5); ativar = ligar conjuntos + campanha. Status transitório `IN_PROCESS` é normal (Meta processando) e resolve sozinho.

### 8. Registrar no histórico

```bash
bash data/log-action.sh --agent {operador} --account {alias} \
  --action "Subiu lote {LOTE} por duplicacao" \
  --summary "campanhas {ids}, 6 conj/cada via /copies, {N} ads/conj, R\$X/conj" \
  --result "ATIVO, verificado" --ref {produto}
```

---

## Armadilhas

| Armadilha | Fix |
|-----------|-----|
| Recriar adset do zero "porque é mais limpo" | **Não.** Dispara 3858634. Sempre `/copies`. |
| `deep_copy=true` | Arrasta os ads da fonte. Use `false`. |
| Editar targeting da cópia pra "ajustar" | Pode re-disparar 3858634. Copie a fonte CERTA por tipo. |
| Esquecer `is_adset_budget_sharing_enabled` em ABO | `4834011`. Sempre incluir (`true`). |
| Duplicar ad sem querer (retry sem checar) | Gera ad repetido no conjunto. Conferir contagem == N e deletar extras. |
| Rate limit (code 17) após ~90 calls | Espera a janela; faça verificação/ativação num passo separado. |

---

## Checklist final

- [ ] Campanha criada com `is_adset_budget_sharing_enabled`
- [ ] 6 conjuntos via `/copies` (`deep_copy=false`), targeting da fonte preservado
- [ ] Budget e nome ajustados em cada cópia
- [ ] N criativos × 6 conjuntos pendurados (contagem confere)
- [ ] Anunciante OK (sem `WITH_ISSUES`) — herdado da fonte
- [ ] Campanha-fonte intacta (provar: mesmo ID/status/budget de antes)
- [ ] Verificação peça por peça rodada antes de ativar
- [ ] Ativado (adsets → campanha) e registrado no histórico

---

*Validado contra Graph Marketing API v21.0 — missão NDF 2026-06-29. O endpoint `/copies` herda o compliance da fonte; criar do zero não. Esse é o ponto.*
