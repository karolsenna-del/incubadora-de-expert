---
workflow: "wf-production"
descricao: "Workflow padrao do squad — start -> setup ou produce"
---

# Workflow: Production

## Visao Geral

```
/squad-carrossel-arcane
    ↓
[carrossel-chief.start]
    ↓
{tem templates?}
    ├─ NAO ─→ [identity-designer.setup-identity] (loop)
    │              ↓
    │         {>= 1 template salvo}
    │              ↓
    │         [carrossel-chief.start] (re-entry)
    │              ↓
    └─ SIM ─→ Menu:
                ├─ Carrossel ─→ [producer.produce-carousel] ─→ PNGs em ~/Downloads/
                ├─ Estatico  ─→ [producer.produce-static-post] ─→ PNG em ~/Downloads/
                ├─ Add tmpl  ─→ [identity-designer.add-template]
                └─ Listar    ─→ [carrossel-chief.list-templates]
```

## Phases

### Phase 1: Setup (so primeiro uso)

| Step | Owner | Task |
|------|-------|------|
| 1.1 | @carrossel-chief | start (detecta first_use) |
| 1.2 | @identity-designer | setup-identity (loop ate aluno ter 1+ template) |
| 1.3 | @carrossel-chief | re-entry no start (agora em estado "ready") |

### Phase 2: Producao (uso normal)

| Step | Owner | Task |
|------|-------|------|
| 2.1 | @carrossel-chief | start (mostra menu) |
| 2.2 | @producer | produce-carousel OU produce-static-post |
| 2.3 | @producer | entrega PNGs em ~/Downloads/ |

### Phase 3: Manutencao (eventual)

| Step | Owner | Task |
|------|-------|------|
| 3.1 | @carrossel-chief | start (menu) |
| 3.2 | @identity-designer | add-template (criar novo template) |
| 3.3 | @carrossel-chief | list-templates (ver o que tem) |

## State Persistence

Templates salvos em `~/.carrossel-arcane/templates/` persistem entre sessoes. Squad e stateless — leva tudo do disco a cada execucao.

Config de API (se conectada) em `~/.carrossel-arcane/config/api.yaml`.
