# Task: save-memory

## Objetivo

Salvar informacao importante no lugar certo do sistema de memoria.

## Trigger

- `*memoria` no Companion
- "guarda isso", "salva isso", "registra"
- Trigger automatico dos 6 triggers de memoria

## Agente Executor

companion (ou qualquer agente ativo via rule memoria-inteligente)

## Passos

### Step 1: Identificar o que salvar

Entender o que o expert quer guardar. Pode ser:
- Uma decisao tomada
- Uma ideia ou pendencia
- Conhecimento criado
- Estado atual
- Qualquer outra informacao

### Step 2: Classificar e decidir destino

| Tipo | Destino | Formato |
|------|---------|---------|
| **Decisao** | `agents/companion/data/log-decisoes.md` | `## [DATA] — [TITULO]` + Contexto/Decisao/Racional/Impacto |
| **Ideia ou pendencia** | `agents/companion/data/demandas-backlog.md` | Adicionar na secao adequada (Urgente/Importante/Backlog) |
| **Estado atual** | `agents/companion/data/contexto-dinamico.md` | Atualizar secoes relevantes |
| **Padrao observado** | `agents/companion/data/padroes-observados.md` | `## [PADRAO]` + Observado/Frequencia/Descricao/Recomendacao |
| **Conhecimento permanente** | `docs/knowledge/{subpasta}/` | Documento .md estruturado |
| **Processo** | `business/processos/` | SOP documentado |
| **Progresso de projeto** | `business/campanhas/{projeto}/tracker.md` | Log entry + status update |

### Step 3: Confirmar com expert se ambiguo

SE nao esta claro onde salvar:
→ "Isso parece ser {tipo}. Salvo em {destino}? Ou prefere outro lugar?"

SE esta claro:
→ Salvar diretamente e confirmar: "Salvo em {destino}."

### Step 4: Salvar

- Abrir arquivo destino
- Adicionar no formato correto (append pra logs, update pra estado)
- NUNCA apagar conteudo existente em logs (append-only)
- Confirmar salvamento

## Formato de Output

```
Salvo: {tipo} em {destino}
{resumo do que foi salvo}
```

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Informacao duplicada (ja existe) | Avisar: "Isso ja ta registrado em {local}" |
| Destino nao existe | Criar arquivo/pasta se fizer sentido, ou perguntar |

## Completion Criteria

- Informacao salva no destino correto
- Formato respeitado
- Expert confirmado (se ambiguo)
