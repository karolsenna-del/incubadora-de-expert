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
testada e válida (200 OK).
**3º caso, 06/09:** `dom-serie-completa-7-partes` (última da leva Semana 05, agendado 30/08 pra
06/09 20h BRT) rodou às 21h36 BRT e falhou de novo (erro 9004, agora no slide-05). URL testada
e válida (200 OK). Resolvido de novo com `workflow_dispatch` (publicado 07/09 00h27 BRT).
**3 casos seguidos, todos nos posts das 20h da leva Rota100k Semana 05 (todos com slides subidos
ao Cloudinary no mesmo dia, 30/08), todos resolvidos de primeira com `workflow_dispatch`.**
Hipótese não confirmada: pode haver contenção/rate-limit no fetch da Meta especificamente no
horário de pico (~21h30-22h BRT) em que os crons atrasados disparam em lote — não é causa raiz
comprovada, só um padrão observado, agora com 3 ocorrências. A leva Semana 05 terminou (06/09 foi
o último); a leva Semana 06 (07/09-13/09, também 20h fixo) é o próximo teste real do padrão —
**checar `gh run list --workflow=post-{slug}.yml` na manhã seguinte de cada post** em vez de
assumir que rodou certo, durante toda a Semana 06.
**4º caso, 09/09 (Semana 06):** `rota100k-semana06-qua-antes-depois-aplicou` rodou 09/09 20h52 BRT
(quase sem atraso do cron desta vez — enfraquece um pouco a hipótese de contenção só no horário de
pico) e falhou de novo com erro 9004 (slide-02). Diferente dos 3 casos anteriores, a checagem
matinal automatizada não conseguiu confirmar a URL via `curl -sI` porque a política de rede da
sessão de checagem bloqueou a conexão com `res.cloudinary.com` (erro de proxy/ambiente, não
resposta do Cloudinary) — mesmo assim o retry foi disparado direto por precedente (assinatura de
erro idêntica aos 3 casos anteriores) e publicou de primeira (`workflow_dispatch`, 10/09 08h14 BRT,
media ID 18204693133367619). Os 2 primeiros posts da Semana 06 (seg e ter) rodaram limpos, sem
erro 9004 — o padrão não é 100% dos posts das 20h, mas continua recorrente o suficiente pra manter
a checagem manhã seguinte.
**5º caso, 10/09 (Semana 06):** `rota100k-semana06-qui-erros-mais-contam` rodou 10/09 20h38 BRT
(quase sem atraso do cron de novo) e falhou com erro 9004 (slide-05, 5º container da chamada).
Igual ao 4º caso, a checagem matinal automatizada não conseguiu confirmar a URL via `curl -sI`
porque a política de rede da sessão de checagem bloqueou de novo a conexão com
`res.cloudinary.com` (mesmo erro de proxy/ambiente, não resposta do Cloudinary) — mesmo assim o
retry foi disparado direto por precedente (assinatura de erro idêntica aos 4 casos anteriores) e
publicou de primeira (`workflow_dispatch`, 11/09 08h12 BRT, media ID 17879985357622763). Com 5
ocorrências em posts consecutivos das 20h (03/09, 04/09, 06/09, 09/09, 10/09 — só o 07/09 e 08/09
rodaram limpos), o padrão já é a regra e não a exceção nesse horário; o bloqueio de rede da própria
sessão de checagem também já é recorrente (2 casos seguidos) — não impede mais a decisão de retry
por precedente, mas seria bom a Karol avaliar se dá pra liberar `res.cloudinary.com` na política de
rede da sessão de checagem automatizada, pra voltar a confirmar a URL de verdade em vez de confiar
só no precedente.
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
- 2026-09-06 — `dom-serie-completa-7-partes` (último post da leva Rota100k Semana 05) falhou às
  21h36 BRT com erro 9004 (3º caso seguido do mesmo padrão, ver RULE-4). URL do Cloudinary
  testada e válida. Retry via `workflow_dispatch` publicou de primeira (07/09 00h27 BRT,
  media ID 17925612792181143). Log atualizado, RULE-4 revisada com o 3º caso confirmado.
- 2026-09-10 — Checagem automatizada matinal (rotina agendada) achou `rota100k-semana06-qua-
  antes-depois-aplicou` (agendado pra 09/09 20h) falhado com erro 9004 (4º caso, slide-02, ver
  RULE-4). Verificação da URL via `curl` bloqueada pela política de rede da própria sessão de
  checagem (proxy negou `res.cloudinary.com`) — não foi possível confirmar 200 OK manualmente,
  mas a assinatura do erro era idêntica aos 3 casos anteriores, então o retry foi disparado
  direto por precedente. Publicou de primeira via `workflow_dispatch` (10/09 08h14 BRT, media ID
  18204693133367619). Log e RULE-4 atualizados com o 4º caso.
- 2026-09-11 — Checagem automatizada matinal (rotina agendada) achou `rota100k-semana06-qui-
  erros-mais-contam` (agendado pra 10/09 20h) falhado com erro 9004 (5º caso, slide-05, ver
  RULE-4). Verificação da URL via `curl` bloqueada de novo pela mesma política de rede da sessão
  de checagem — retry disparado direto por precedente (assinatura idêntica aos 4 casos
  anteriores). Publicou de primeira via `workflow_dispatch` (11/09 08h12 BRT, media ID
  17879985357622763). Log e RULE-4 atualizados com o 5º caso; padrão agora predominante nos
  posts das 20h e bloqueio de rede da checagem já recorrente — sugestão registrada pra Karol
  avaliar liberar `res.cloudinary.com` na política de rede da sessão de checagem.
