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
