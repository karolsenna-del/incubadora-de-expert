# Memoria Inteligente — Rule Global

> Todo agente no Auroq OS segue este protocolo de memoria. Nao e opcional.

## 6 Triggers — Quando Salvar

### 1. Decisao Tomada
SE o expert decidiu algo significativo (estrategia, preco, foco, prioridade, cancelamento):
→ Perguntar: "Registro essa decisao no log?"
→ SE sim: salvar em `agents/companion/data/log-decisoes.md` no formato:
```
## [DATA] — [TITULO]
**Contexto:** [situacao]
**Decisao:** [o que decidiu]
**Racional:** [por que]
**Impacto:** [o que muda]
```

### 2. Projeto Progrediu
SE completou tarefa de projeto ou avancou fase:
→ Atualizar tracker do projeto (conforme project-tracker protocol)
→ Adicionar entrada no LOG do tracker

### 3. Conhecimento Criado
SE produziu documento, framework, analise, ou processo novo que tem valor permanente:
→ Perguntar: "Salvo na biblioteca? Onde faz mais sentido?"
→ Salvar em `docs/knowledge/` (subpasta adequada) ou `business/processos/`

### 4. Padrao Detectado
SE o Companion percebe comportamento recorrente (so Companion faz isso):
→ Registrar silenciosamente em `agents/companion/data/padroes-observados.md`

### 5. Sessao Encerrando
SE expert indica que vai fechar ou pede commit final:
→ Ops verifica no ritual de commit: contexto e trackers atualizados?
→ Atualizar `agents/companion/data/contexto-dinamico.md` com onde paramos

### 6. Autocompact Iminente
SE sessao longa e contexto pode ser compactado:
→ SALVAR ESTADO IMEDIATAMENTE no documento de trabalho
→ Atualizar contexto-dinamico se nao fez ainda

## Onde Cada Coisa Vai

| Tipo de informacao | Destino |
|-------------------|---------|
| Decisao estrategica | `agents/companion/data/log-decisoes.md` |
| Progresso de projeto | `business/campanhas/{projeto}/tracker.md` |
| Onde estamos agora | `agents/companion/data/contexto-dinamico.md` |
| Ideia ou pendencia | `agents/companion/data/demandas-backlog.md` |
| Padrao recorrente | `agents/companion/data/padroes-observados.md` |
| Conhecimento permanente | `docs/knowledge/{subpasta}/` |
| Processo documentado | `business/processos/` |
| Estado de trabalho (pre-autocompact) | Documento de trabalho do projeto |

## Regra de Ouro

**Na duvida, salva.** E mais barato salvar informacao que nao vai usar do que perder informacao que precisava.

## O que NAO salvar

- Conversa trivial sem decisao ou aprendizado
- Informacao que ja existe em outro lugar (nao duplicar)
- Dados temporarios que perdem valor em 24h
- Output intermediario que vai ser refinado (salvar so o final)
