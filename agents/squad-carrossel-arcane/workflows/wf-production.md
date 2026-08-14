---
workflow: "wf-production"
descricao: "Workflow padrao do squad — start -> setup, imagens de IA ou producao"
---

# Workflow: Production

## As duas camadas (contexto pro workflow inteiro)

| Camada | O que produz | Onde roda | Custo | Agente |
|--------|--------------|-----------|-------|--------|
| **1 — Arte em CSS** | A moldura do post (HTML+CSS → PNG) | Local, no Claude Code | Nenhum | @identity-designer / @producer |
| **2 — Imagem de IA** | `card{N}-FINAL.png` (GPT Image 2 / Nano Banana Pro) | API externa | Gasta credito | @image-director |

Camada 1 e obrigatoria (sem template de arte nao ha post). Camada 2 e opcional
(carrossel so-texto dispensa).

## Visao Geral

```
/squad-carrossel-arcane
    ↓
[carrossel-chief.start]  → apresenta squad (faz / nao faz / duas camadas / quem faz o que)
    ↓
{tem template de arte?}
    ├─ NAO ─→ [identity-designer.setup-identity] (loop)
    │              ↓
    │         {>= 1 template salvo}
    │              ↓
    │         [carrossel-chief.start] (re-entry)
    │              ↓
    └─ SIM ─→ Menu:
                ├─ 1 Imagens IA ─→ [image-director.calibrate-image-style]
                │                      ↓
                │                  [image-director.produce-card-images]
                │                      ↓  card{N}-FINAL.png em ~/Downloads/{nome}/
                │                  [image-director.save-image-style]  (cristaliza estilo)
                │                      ↓  handoff
                ├─ 2 Carrossel  ─→ [producer.produce-carousel] ─→ slide-NN.png em ~/Downloads/
                ├─ 3 Estatico   ─→ [producer.produce-static-post] ─→ PNG em ~/Downloads/
                ├─ 4 Add arte   ─→ [identity-designer.add-template]
                ├─ 5 Estilo img ─→ [image-director.calibrate-image-style → save-image-style]
                └─ 6 Listar     ─→ [carrossel-chief.list-templates]
```

> Fluxo completo de carrossel com imagem: **1 → 2**. O Producer le as
> `card{N}-FINAL.png` da pasta que o Image Director entregou e encaixa dentro da
> moldura CSS.

## Phases

### Phase 1: Setup de arte (so primeiro uso) — camada 1

| Step | Owner | Task |
|------|-------|------|
| 1.1 | @carrossel-chief | start (apresenta squad, detecta first_use) |
| 1.2 | @identity-designer | setup-identity (loop ate aluno ter 1+ template de arte) |
| 1.3 | @carrossel-chief | re-entry no start (agora em estado "ready") |

### Phase 2: Imagens de IA (opcional, antes da montagem) — camada 2

| Step | Owner | Task |
|------|-------|------|
| 2.1 | @image-director | calibrate-image-style (carrega estilo salvo ou calibra 3 primeiras) |
| 2.2 | @image-director | produce-card-images (batch ou incremental) → `card{N}-FINAL.png` |
| 2.3 | @image-director | save-image-style (cristaliza aprendizados no estilo) |
| 2.4 | @image-director | handoff pro @producer apontando `~/Downloads/{nome}/` |

### Phase 3: Producao / montagem — junta as duas camadas

| Step | Owner | Task |
|------|-------|------|
| 3.1 | @carrossel-chief | start (mostra menu) |
| 3.2 | @producer | produce-carousel OU produce-static-post |
| 3.3 | @producer | entrega PNGs em ~/Downloads/ |

### Phase 4: Manutencao dos padroes (eventual)

| Step | Owner | Task |
|------|-------|------|
| 4.1 | @carrossel-chief | start (menu) |
| 4.2 | @identity-designer | add-template (novo template de arte — camada 1) |
| 4.3 | @image-director | calibrate/save-image-style (novo estilo de imagem — camada 2) |
| 4.4 | @carrossel-chief | list-templates (ve os dois padroes salvos) |

## State Persistence

Squad e stateless — le tudo do disco a cada execucao. Os dois padroes persistem
entre sessoes:

- `~/.carrossel-arcane/templates/` — templates de arte CSS (camada 1)
- `~/.carrossel-arcane/image-styles/` — estilos de imagem de IA (camada 2)
- `knowledge/image-styles/` — estilos embarcados no squad (ex.: `euriler`)
- `~/.carrossel-arcane/config/api.yaml` — config de API de imagem (se conectada)
