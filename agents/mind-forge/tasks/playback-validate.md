# Task: playback-validate

## Objetivo

Apresentar o mapa de conhecimento extraido de volta pro usuario em formato legivel, coletar confirmacao, correcoes e complementos.

## Trigger

- Handoff automatico da Fase 2 (analyze-knowledge)
- `*playback` para executar manualmente

## Pre-condicoes

- Fase 2 completa (QG-MF-002 passed)
- knowledge-facets.yaml, domain-map.yaml, voice-profile.yaml disponiveis

## Agente Executor

@forge-chief

## Passos

### Step 1: Carregar Dados da Analise

Ler:
- `02-analysis/knowledge-facets.yaml`
- `02-analysis/domain-map.yaml`
- `02-analysis/voice-profile.yaml`
- `02-analysis/analysis-metrics.yaml`

### Step 2: Apresentar Mapa de Conhecimento

Apresentar em formato narrativo legivel (NUNCA YAML bruto):

```
=== MAPA DE CONHECIMENTO: {nome} ===

Tipo: {Mente Sintetica | Consultor}
Fontes: {N} documentos ({total} palavras)
{Se sintetica: Experts: {lista com contribuicao de cada um}}
Facetas extraidas: {N} KFs
Dominios: {N}

--- DOMINIOS ---

1. {Nome do Dominio} ({coverage})
   Principios: {N} | Frameworks: {N} | Heuristicas: {N} | Exemplos: {N}

   Insights-chave:
   - {principio mais importante} {(expert)}
   - {framework principal}: {passos resumidos}
   - {heuristica mais util}: SE {cond} ENTAO {acao}
   ...

2. {Proximo Dominio}
   ...

{Se sintetica:}
--- CONVERGENCIAS (onde experts concordam) ---
- {principio/insight} — concordam: {experts}
- ...

--- TENSOES (onde divergem) ---
- {topico}: {expert A diz X} vs {expert B diz Y}
  Proposta: {manter ambos / usuario decide / sintetizar}

--- GAPS DETECTADOS ---
- {dominio X}: poucos exemplos concretos
- {dominio Y}: sem framework estruturado
- ...

--- VOZ PROPOSTA ---
Tom: {descricao}
{Se sintetica: Expert dominante: {nome} (ancora da voz)}
Frases-chave: "{frase 1}", "{frase 2}", "{frase 3}"

Isso bate com a mente que voce quer criar? O que ajustaria?
```

### Step 3: Coletar Feedback

Perguntar ao usuario:
1. "Os dominios fazem sentido? Falta algum? Algum esta errado?"
2. "As convergencias/tensoes estao corretas?"
3. "A voz proposta e o que voce quer?"
4. "Quer adicionar ou remover algo?"

### Step 4: Integrar Correcoes

Se o usuario corrigir:
- Atualizar KFs no knowledge-facets.yaml
- Atualizar domain-map.yaml
- Marcar KFs corrigidos com `user_confirmed: true`

Se correcoes forem significativas (novo dominio, remocao de expert, mudanca de voz):
- Re-apresentar o mapa atualizado
- Pedir confirmacao novamente

### Step 5: Confirmacao Final

O usuario deve confirmar explicitamente.
Sinais de confirmacao: "sim", "bate", "isso", "pode forjar", "manda ver"

### Step 6: Salvar Playback Report

Gerar `03-playback/playback-report.md` com o mapa apresentado + correcoes.

### Step 7: Quality Gate QG-MF-003

- [x] Usuario confirmou "esse e o conhecimento que quero na mente"
- [x] Todas as correcoes integradas
- [x] Tensoes resolvidas (usuario escolheu ou aceitou proposta)

**Veto:** Usuario rejeitou o mapa.

### Step 8: Atualizar State e Handoff

```json
{
  "phase_status": { "phase_3": "completed" },
  "current_phase": 4,
  "quality_gates_passed": ["QG-MF-001", "QG-MF-002", "QG-MF-003"]
}
```

Fazer handoff para @mind-smith com task `forge-mind`.

## Formato de Output

- `03-playback/playback-report.md`
- KFs atualizados com correcoes

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario rejeita tudo | Entender o que ta errado, voltar pra Fase 2 se necessario |
| Usuario quer adicionar fontes | Pausar, adicionar fontes, re-rodar Fases 1-2 |
| Correcoes contraditórias | Confirmar: "Voce disse X antes e agora Y. Qual vale?" |

## Completion Criteria

- Usuario confirmou explicitamente
- Playback report salvo
- QG-MF-003 passou
- Handoff executado
