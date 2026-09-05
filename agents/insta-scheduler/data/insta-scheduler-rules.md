# Instagram Scheduler — Regras Operacionais

> Regras nascidas de incidentes reais. Diferentes das Strict Rules (comportamentais/permanentes no agent.md).
> Este arquivo começa vazio e cresce conforme o worker opera.
> Carregado em TODA ativação.

---

## Formato de Entrada

```
### RULE-{N}: {Título}
**Incidente:** {o que aconteceu}
**Regra:** {o que fazer / não fazer}
**Adicionada em:** {data}
```

---

## Regras Ativas

### RULE-1: Contrato de Entrega da Fila (pipeline automático)
**Incidente:** Legendas e slides não chegavam num lugar padronizado — slides saíam pro
`~/Downloads/`, legenda ficava enterrada no `laminas-carrossel.md` ou só no chat. A Karol
tinha que enviar a legenda na mão a cada agendamento (Desafio 10 Dias, Dias 5-7).
**Regra:** Existe UM contrato de entrega. Nenhum agendamento depende de envio manual da Karol.

```
business/instagram/fila/{slug}/
   ├── slide-01.png        ← squad-carrossel-arcane (produce-carousel, Step 6)
   ├── slide-02.png
   ├── ...
   └── legenda.txt         ← squad-conteudo-arcane (gerar-laminas-carrossel, Step 6)
```

- **Slug canônico:** o nome da pasta do post em `docs/producao-conteudo/{expert}/posts/{slug}/`.
  É a fonte única da verdade — os dois squads usam esse mesmo slug ao entregar.
- **squad-carrossel** deposita os `slide-NN.png` (1080x1350, numeração sequencial).
- **squad-conteudo** deposita o `legenda.txt` (só o texto do post + hashtags, sem specs).
- **insta-scheduler** consome: quando os DOIS estão presentes na pasta, valida → sobe no
  Cloudinary → cria o workflow `post-{slug}.yml` (cron 12h BRT no próximo dia livre) → move
  a pasta pra `agendados/`.
- SE só um dos dois chegou → a fila mostra o slug como "incompleto" (falta slides OU legenda),
  não agenda, e aponta qual squad deve completar.

**Adicionada em:** 2026-07-11

---

### RULE-2: Sempre esperar container FINISHED antes de media_publish
**Incidente:** `matheus-carmo-valida-antes-de-vender` (batelada de 5, 21/07) falhou ao rodar
em 24/07 — erro 9007 "Media ID is not available" da Meta Graph API. O workflow criava os
containers dos slides, criava o container do carrossel, e chamava `media_publish` na sequência,
sem esperar a Meta terminar de processar (ela busca as imagens do Cloudinary de forma
assíncrona). É corrida: 3 dos 5 posts da mesma batelada passaram sem problema, esse não.
O script mais antigo `.github/scripts/publicar.py` já tinha essa espera implementada
(loop de até 100s checando `status_code=FINISHED`) — mas o fluxo novo de workflows
individuais por post (`execute-mission.md`) não incluía o passo.
**Regra:** TODO workflow `post-{slug}.yml` que cria carrossel via Meta Graph API DEVE
esperar `status_code=FINISHED` no container do carrossel antes de chamar `media_publish`.
Nunca publicar logo após criar o container pai. Ver `execute-mission.md` Passo 4b.1.
**Adicionada em:** 2026-07-25

---

### RULE-3: SOP-001 (renovar META_TOKEN) usava endpoint da família errada de token
**Incidente:** SOP-001 documentado (KB seção 2.3 e `execute-mission.md`) usava
`graph.instagram.com/refresh_access_token` com `grant_type=ig_refresh_token` — esse fluxo é só
pra token da família Instagram Login. O `META_TOKEN` real em produção é da família Facebook
Login (prefixo `EAA`, usado via `graph.facebook.com` em todos os workflows de publicação).
Rodar o SOP como documentado deu erro 190 "Cannot parse access token" (24/08/2026, renovação de
emergência antes da expiração de 29/08).
**Regra:** Renovar `META_TOKEN` sempre via `graph.facebook.com/v21.0/oauth/access_token` com
`grant_type=fb_exchange_token` + `client_id` (META_APP_ID) + `client_secret` (META_APP_SECRET) +
`fb_exchange_token` (token atual). O fluxo `ig_refresh_token` só serve pro `IG_INSIGHTS_TOKEN`
(família Instagram Login), nunca pro `META_TOKEN`.
**Adicionada em:** 2026-08-24

---

### RULE-4: Erro 9004 (falha ao baixar mídia) virou padrão recorrente nos posts das 20h — retry via workflow_dispatch resolve
**Incidente:** `qui-1-hora-por-semana-metodo` (agendado 30/08 pra 03/09 20h BRT) rodou às 21h30 BRT
(atraso normal do cron, ver nota abaixo) e falhou no 4º slide com erro 9004 da Meta API:
`"Only photo or video can be accepted as media type"` / `"Falha ao baixar mídia"`. A URL do
Cloudinary (`slide-04.png`) foi testada manualmente depois (`curl -I`) e respondeu 200 OK com a
imagem correta — não era problema do arquivo nem da conta Cloudinary, foi falha pontual da Meta
ao buscar aquela URL especificamente naquele instante.
**Repetiu no dia seguinte:** `sex-5-frases-parar-de-dizer` (mesma leva, agendado 30/08 pra 04/09
20h BRT) rodou às 21h48 BRT e falhou da MESMA forma (erro 9004, agora no slide-02). URL também
testada e válida (200 OK). **2 casos seguidos, ambos nos posts das 20h da leva Rota100k Semana 05
(todos com slides subidos ao Cloudinary no mesmo dia, 30/08), ambos resolvidos de primeira com
`workflow_dispatch`.** Hipótese não confirmada: pode haver contenção/rate-limit no fetch da Meta
especificamente no horário de pico (~21h30-22h BRT) em que os crons atrasados disparam em lote —
não é causa raiz comprovada, só um padrão observado. Enquanto a leva Semana 05 não terminar
(faltam 05/09 e 06/09 às 20h), **checar `gh run list --workflow=post-{slug}.yml` na manhã seguinte
de cada post** em vez de assumir que rodou certo.
**Regra:** Erro 9004 (diferente do 9007 da RULE-2, que é corrida de processamento) é transiente
de rede/infra da Meta, não de conteúdo, MESMO quando se repete em dias seguidos — a URL segue
íntegra nos dois casos confirmados. Antes de qualquer alteração de slides/legenda/cron:
1. Testar a URL do Cloudinary do slide que falhou (`curl -I {url}`) — SE 200 OK, o arquivo está
   intacto.
2. Disparar o mesmo workflow de novo via `gh workflow run post-{slug}.yml` (usa o
   `workflow_dispatch:` que todo workflow já tem) — não precisa editar cron nem esperar o
   próximo dia. Roda em minutos e reusa exatamente as mesmas URLs/legenda já validadas.
3. Só investigar Cloudinary/conteúdo se o retry falhar de novo com o MESMO erro.
**Nota sobre atraso de cron:** workflows agendados por `on: schedule` neste repo consistentemente
disparam 1h50-2h30 depois do horário marcado no cron (observado em pelo menos 4 posts de
agosto/setembro/2026) — é comportamento documentado do GitHub Actions em horários de pico, não é
bug do workflow. Não estranhar nem tentar "consertar" o cron por causa disso; se precisar do
horário exato, disparar manualmente via `workflow_dispatch` em vez de confiar no `schedule`.
**Adicionada em:** 2026-09-04

---

## Histórico de Incidentes

- 2026-07-11 — Desafio 10 Dias (Dias 5, 6 e 7): legendas chegavam soltas no chat e os slides
  no `~/Downloads/`. Fechado o pipeline com o contrato da RULE-1: passo de entrega na fila
  adicionado no `produce-carousel.md` (carrossel, Step 6) e no `gerar-laminas-carrossel.md`
  (conteúdo, Step 6). A partir daqui, a Karol não precisa mais enviar legenda na mão.
- 2026-07-24 — `matheus-carmo-valida-antes-de-vender` falhou (erro 9007, corrida de
  processamento assíncrono da Meta). Reagendado pra 27/07 12h (primeiro dia livre).
  Fix aplicado: espera de FINISHED adicionada nesse workflow, no `essencia-diferencial-autoridade`
  (ainda não rodado) e na task `execute-mission.md` pra todo workflow futuro. Ver RULE-2.
- 2026-07-28 — Achados 2 casos MAIS ANTIGOS do mesmo bug (erro 9007), que passaram
  despercebidos porque a falha é silenciosa e ninguém tinha auditado a leva de workflows
  criados antes do fix da RULE-2 (25/07): `bottura-metodo-incopiavel` (falhou 20/07) e
  `nao-quero-ser-amadora` (falhou 19/07). A Karol notou que os posts "sumiram" e perguntou.
  Confirmado via `gh run list` + `gh run view --log` (não assumido — checado). Fix aplicado
  nos 2 workflows, reagendados pra 02/08 e 03/08. `nikolas-autoridade-digital` (mesma leva,
  mesmo bug potencial, não corrigido) rodou OK em 18/07 — corrida é intermitente, não afeta
  sempre. **Aprendizado:** falha de workflow agendado não gera alerta nenhum — vale, de tempos
  em tempos, rodar `gh run list --workflow=post-{slug}.yml` em toda a leva de workflows
  criados antes de 25/07 pra confirmar que nenhum outro ficou pra trás sem publicar.
- 2026-08-24 — Postador achou (23/08) que `META_TOKEN` expirava 29/08, em cima dos posts de
  sábado/domingo da Semana 04 do Rota100k. Renovação de emergência rodada: SOP-001 documentado
  (`ig_refresh_token`) falhou com erro 190. Trocado pra `fb_exchange_token` (família correta do
  token) — funcionou de primeira. Novo token válido até 22/10/2026. Ver RULE-3.
