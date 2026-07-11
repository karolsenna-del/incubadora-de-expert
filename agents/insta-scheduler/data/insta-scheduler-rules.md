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

## Histórico de Incidentes

- 2026-07-11 — Desafio 10 Dias (Dias 5, 6 e 7): legendas chegavam soltas no chat e os slides
  no `~/Downloads/`. Fechado o pipeline com o contrato da RULE-1: passo de entrega na fila
  adicionado no `produce-carousel.md` (carrossel, Step 6) e no `gerar-laminas-carrossel.md`
  (conteúdo, Step 6). A partir daqui, a Karol não precisa mais enviar legenda na mão.
