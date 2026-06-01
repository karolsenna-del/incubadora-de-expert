# Troubleshooting — Falhas Conhecidas e Recuperação

KB de exceções, observadas em produção real (mai/2026). Cada falha vem com diagnóstico, recuperação e prevenção.

---

## E1 — Instabilidade de rede do Higgsfield

### Sintoma

```
Error: Cannot reach https://fnf.higgsfield.ai/agents/jobs/...
```

Acontece durante o `--wait` de comandos como `generate create`. O CLI perde a conexão de polling.

### Diagnóstico

O job FOI criado no servidor — só o acompanhamento caiu. Confirmar listando:

```bash
higgsfield generate list --json | jq '.[0]'
```

Se o job aparece na lista (mesmo como `running` ou `completed`), trabalho preservado.

### Recuperação

```bash
higgsfield generate get <job_id>
```

- `completed` → URL do resultado disponível. Usar.
- `running` → esperar e re-consultar.
- `failed` → aí sim regerar.

### Prevenção

- **Nunca regerar do zero ao ver "Cannot reach".** Custa crédito à toa.
- Sempre capturar o job ID antes de qualquer fala de erro.
- Em rodadas longas, considerar `--wait-timeout 30m`.

### Origem

PU-has-034. Observado 3+ vezes durante a sessão de criação de personas em 19/05/2026.

---

## E2 — Soul V2 sensualiza a roupa

### Sintoma

Apesar do prompt pedir explicitamente `modest`, `no cleavage`, `fully buttoned` — o Soul gera persona com camisa aberta no busto, decote recortado, regata, top cropped.

### Diagnóstico

Viés do modelo. O Soul "embeleza" automaticamente, e nessa embelezada abre roupa. Camisa de botão é o pior caso — o modelo abre os botões de cima sozinho. Não adianta reforçar "fully buttoned" no prompt; o viés é mais forte que a instrução textual.

### Recuperação / Prevenção

**Travar peça que fisicamente não tem como abrir:**

| Peça | Viés do Soul | Recomendação |
|------|--------------|--------------|
| Camisa de botão | Abre os botões de cima | ❌ Evitar |
| Blusa de seda | Decote | ❌ Evitar |
| Cropped / regata | Mostra barriga/ombro | ❌ Evitar |
| **Gola alta** | Não tem como abrir | ✅ **USAR** |
| **Turtleneck** | Não tem como abrir | ✅ **USAR** |
| Blusa de gola fechada | Permanece fechada | ✅ Usar |
| Blazer fechado sobre top | Cobre o decote | ✅ Usar com cautela |

**Prompt template pra persona modesta:**

> "Wearing a tasteful modest [turtleneck/high-neck top], fully covered, no cleavage, elegant casual."

### Origem

PU-has-035. Observado 7+ vezes durante a sessão de personas em 19/05/2026 — em 3 lotes seguidos, só personas com gola fechada saíram realmente modestas.

---

## E3 — Erro de parsing de JSON

### Sintoma

```
jq: error (at <stdin>:9): Cannot index array with string "id"
```

Acontece ao tentar extrair campos do output JSON de comandos do Marketing Studio (avatars create, produtos, etc).

### Diagnóstico

O formato do JSON varia entre comandos — uns retornam um objeto `{"id": ...}`, outros um array `[{"id": ...}]`. O `jq -r .id` falha quando o formato real é array.

### Recuperação

A operação subjacente **geralmente funcionou** mesmo com o jq quebrando. Validar pela listagem:

```bash
# Após create de avatar
higgsfield marketing-studio avatars list --json | jq '.[] | select(.type=="custom")'

# Após create de produto
higgsfield marketing-studio products list --json
```

Se o item aparece na lista, o create teve sucesso.

### Prevenção

Usar parsing robusto que aceita ambos os formatos:

```bash
ID=$(higgsfield upload create file.png --json | jq -r '.id // .[0].id')
```

Ou simplesmente capturar o output cru e validar pela listagem depois.

### Origem

Observado em 19/05/2026 ao criar avatar custom — o avatar foi criado com sucesso mas o jq falhou na exibição do ID.

---

## E4 — Parâmetro fora do enum do modelo

### Sintoma

```
Invalid values: aspect_ratio=99:99 (allowed: 16:9, 9:16, 1:1, ...)
```
ou
```
Invalid values: duration=20 (allowed: 4, 6, 8)
```

Acontece quando se submete um valor que o modelo não aceita (Veo 3.1 só aceita duração 4, 6, ou 8; aspect ratio tem enum fechado por modelo).

### Diagnóstico

Cada modelo tem schema próprio com enums fechados. Submeter fora do enum não custa crédito (validação acontece antes), mas custa tempo e atrapalha o fluxo.

### Recuperação / Prevenção

Antes de submeter parâmetro incerto, consultar o schema:

```bash
higgsfield model get <modelo> --json
```

Procurar os enums declarados (`aspect_ratio`, `duration`, `resolution`, `mode`). Ajustar pro valor aceito mais próximo do desejado.

**Casos comuns:**

| Modelo | Restrição | Solução |
|--------|-----------|---------|
| Veo 3.1 | Duração só 4, 6 ou 8s | Arredondar pra valor mais próximo |
| Kling 3.0 | Aspect só 16:9, 9:16, 1:1 | Não tentar 4:3 ou 21:9 |
| Marketing Studio | Resolução só 480p ou 720p | Default 720p |
| Soul V2 | Quality só 1.5k ou 2k | Não confundir com resolução de vídeo |

---

## E7 — Marketing Studio video cap real de 15s (schema mente)

### Sintoma

Job submetido com `--duration 25` (ou qualquer valor > 15) entra no servidor e termina com `status: failed`, **sem mensagem de erro** no `error`, `fail_reason` ou `status_message`. Falha silenciosa.

```
higgsfield generate get <job_id>
# status: "failed", error: null, status_message: null, fail_reason: null
```

### Diagnóstico

`higgsfield model get marketing_studio_video` declara `duration: integer, default: 15, enum: free` — sugere que aceita qualquer valor ≥ 4. **MENTIRA.** O backend trava silenciosamente em 15s; pedidos acima falham na geração interna sem reportar.

O `enhanced_prompt` do job falho às vezes inclui `~15s with quick jump cuts` mesmo eu tendo pedido 25 — sinal de que o backend está convertendo internamente e a conversão quebra.

### Recuperação / Prevenção

**Não usar `--duration` acima de 15 no `marketing_studio_video`.** Cap real prático = 15s.

Se precisar de > 15s de criativo final:
- **Encadear 2 peças no edit:** gere peça-hook (15s) + peça-corpo (15s), junte no CapCut/edit. ~30s totais. Custa 2x crédito.
- **Não trocar de modelo só por isso:** Seedance e Kling têm o mesmo cap; Veo é pior (4/6/8s).

### Side effect: `generate_audio` é forçado true

O schema diz `generate_audio: default false`. Também mentira no Marketing Studio com avatar — o backend força `true` automaticamente. Não dá pra desligar via CLI. Ver `params.generate_audio` na resposta do `get`.

### Origem

Observado em 20/05/2026 no primeiro lote de produção do squad: 3 jobs com `--duration 25 --generate_audio true` falharam todos silenciosamente. Teste minimal com defaults (`duration: 15`) passou de primeira. Comparação A vs B isolou a variável.

---

## E5 — Conta sem créditos

### Sintoma

```
Insufficient credits to run this generation
```

### Recuperação

- Avisar o usuário antes de tentar produzir lote
- Sugerir lote menor que caiba nos créditos disponíveis
- Adiar peças não-essenciais

### Prevenção

```bash
higgsfield account status
```

Checar créditos no setup e antes de lotes grandes. Sinalizar quando estiver perto do limite.

---

## E6 — Persona sai com idade fora do pedido

### Sintoma

Brief pede mulher 30+, mas o Soul devolve persona aparentando 22-26.

### Diagnóstico

O Soul tende a puxar a idade pra baixo. Pedidos simples como "32 years old" não bastam — o viés é forte pra "modelo jovem".

### Recuperação / Prevenção

Reforçar com sinais de maturidade no prompt:

> "33 years old, **the look of a mature accomplished woman**, **subtle expression lines**, **graceful poise**, not a young model."

Repetir variações de "mature", "accomplished", "well-resolved" funciona melhor que pedir idade só com número.

### Origem

Observado na sessão de personas em 19/05/2026 — 3 das 4 personas do primeiro lote saíram aparentando 26-28 apesar do brief 30-35.

---

## E8 — Seedance 2.0 NSFW filter hipersensível

### Sintoma

Job termina com `status: nsfw` (falha silenciosa, sem render). Comum quando o prompt menciona:
- "extreme close-up of hands"
- "person standing/looking..."
- Closeups de pele exposta (mesmo descritivos)
- Conceitos abstratos que o moderador "alucina" como sensíveis (gráficos de "rising performance"?)

Observado em 21/05/2026: 2 shots Kinetic falharam com `nsfw` em prompts inteiramente safe (mãos digitando teclado, gráfico subindo).

### Diagnóstico

O moderador NSFW do Seedance 2.0 é mais rigoroso que o do Marketing Studio. Falsos positivos são comuns em closeups e em referências a pessoas em planos médios.

### Recuperação / Prevenção

**Pra B-roll cinematográfico no Seedance, evite:**
- "extreme close-up of hands/skin"
- "person standing" + qualquer expressão facial
- "intimate/personal" como descritor

**Substitua por:**
- Planos mais abertos sem pessoas: "wide shot of...", "establishing shot..."
- Closeups em objetos: "close-up of a glowing laptop", "close-up of a screen"
- Conceitos abstratos: "abstract motion graphics", "geometric patterns"

Se 2 retries falharem com `nsfw`, abandonar o shot e ajustar o conceito em vez de continuar batendo a cabeça.

### Origem

Sessão de produção 21/05/2026 — 2 dos 3 shots Kinetic falharam `nsfw` apesar de prompts safe. Diagnóstico: filtro do Seedance 2.0 é o mais rigoroso entre os modelos de vídeo do Higgsfield.

---

## E9 — Rate limit reached (concurrent jobs)

### Sintoma

Disparo de `higgsfield generate create` retorna:

```
Error: {"error_type":"rate_limit_reached","concurrent_jobs_limit":N,"actions":[{"type":"upgrade_plan"}]}
```

`N` é o limite do plano:
- **Plus:** 2 concurrent
- **Ultra:** 8 concurrent
- **Business:** 16 concurrent

Ou no output do CLI: `jq: parse error: Invalid numeric literal at line 1, column 6` (porque o erro vem em JSON mas o CLI tenta tratar como array).

### Diagnóstico

A conta tem N slots de geração concurrent. Disparos além disso são rejeitados na hora.

### Recuperação / Prevenção

- Antes de disparar lote grande, conferir: quantos jobs já estão `in_progress`?
- `higgsfield generate list --json | jq '[.[] | select(.status=="in_progress")] | length'`
- Disparar até `(limite - em_progresso)` e aguardar slot abrir antes do próximo.
- Em pipeline com waits em background, escutar notificações de conclusão e disparar próximos shots conforme libera.

### Origem

Observado em 21/05/2026 durante o lote 2 do squad. Plano Ultra (8 concurrent) batido com 3 do Lote 1 + 5 do Lote 2. Os 4 restantes ficaram em fila local até slots abrirem.

---

## Decision Tree — falha durante produção

```
Erro durante higgsfield generate create
│
├── "Cannot reach..."
│   └── Recuperar com generate get <job_id>
│       ├── completed → usar URL
│       ├── running → esperar
│       └── failed → regerar
│
├── "Invalid values"
│   └── Rodar model get <modelo>, ajustar enum, re-submeter
│
├── "Insufficient credits"
│   └── Avisar usuário, reduzir lote ou pausar
│
├── "Session expired" / "Not authenticated"
│   └── higgsfield auth login
│
├── Output JSON quebra no jq
│   └── Validar pela listagem (avatars list / generate list)
│
├── Output gerado mas roupa/idade fora do brief
│   ├── Roupa aberta → travar gola fechada e regerar
│   └── Idade jovem → reforçar maturidade no prompt
│
├── "status: nsfw" (Seedance falso positivo)
│   └── Simplificar prompt sem "close-up de pele/pessoa", abandonar após 2 retries
│
└── "rate_limit_reached"
    └── Aguardar slot abrir; respeitar limite do plano (Plus 2 / Ultra 8 / Business 16)
```

---

## Quando escalar para o usuário

| Situação | Ação |
|----------|------|
| 3 tentativas de recuperação falharam | Reportar ao Chief, deixar usuário decidir |
| Conta sem créditos | Avisar imediatamente |
| Resultado destoa do brief em 3+ rodadas | Pedir feedback detalhado do usuário pra calibrar |
| Erro novo, não documentado nesta KB | Capturar log, reportar ao Chief, deixar usuário ver o erro original |
