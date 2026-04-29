# Task: start

## Objetivo

Ativar o Mind Forge, coletar informacoes iniciais, selecionar modo e preparar pipeline.

## Trigger

- `/mindForge` ou `*start`
- Inicio automatico quando o squad e ativado

## Pre-condicoes

- Nenhuma (task de entrada)

## Passos

### Step 1: Carregar Persona

Ler e adotar a persona definida em `agents/mind-forge/agents/forge-chief.md`.
Carregar a KB do squad: `agents/mind-forge/data/forge-kb.md`.

### Step 2: Exibir Greeting

```
=== MIND FORGE ===
Agente Auroq | Criado por Euriler Jube
Usado por ele e pela Mentoria Arcane

Documentacao parada nao serve pra nada.
Eu pego KBs, cursos, livros e transcricoes e transformo em mentes
que pensam, respondem e operam com profundidade real.

O que posso fazer:

1. Criar mente nova — sintetica (N experts fundidos) ou consultor (deep-dive)
2. Atualizar mente — ajustar KB, voz, modos ou comportamento de mente existente
3. Consertar mente — diagnosticar e corrigir desvios

Qual tipo?
```

### Step 3: Coletar Informacoes

Coletar do usuario:

1. **Nome da mente** — como vai se chamar (ex: "Consultor Financas", "Consultor OKRs")
2. **Modo** — Mente Sintetica ou Consultor
3. **Descricao** — pra que serve, qual o proposito
4. **Fontes** — paths dos documentos que alimentam a mente

**Deteccao automatica de modo:**

| Sinal do usuario | Modo |
|-------------------|------|
| Menciona N experts/frameworks | Mente Sintetica |
| "Fundir", "combinar", "juntar" | Mente Sintetica |
| "Expert em X", "consultor de Y" | Consultor |
| "Deep-dive", "especialista em" | Consultor |
| Ambiguo | Perguntar |

### Step 4: Criar Estrutura

Gerar slug a partir do nome (kebab-case).
Criar diretorios:

```
agents/mind-forge/minds/{slug}/
  01-ingestion/
  02-analysis/
  03-playback/
  04-forged/
  05-validation/
```

### Step 5: Inicializar State

Criar `.state.json`:

```json
{
  "mind_slug": "{slug}",
  "mind_name": "{nome}",
  "mode": "synthetic|consultant",
  "current_phase": 0,
  "phase_status": {
    "phase_0": "completed",
    "phase_1": "pending",
    "phase_2": "pending",
    "phase_3": "pending",
    "phase_4": "pending",
    "phase_5": "pending"
  },
  "sources": ["{path1}", "{path2}"],
  "total_kfs": 0,
  "domains_identified": 0,
  "quality_gates_passed": [],
  "started_at": "{timestamp}",
  "paused_at": "",
  "resumed_at": ""
}
```

### Step 6: Handoff

Confirmar pro usuario:

```
Setup completo.
- Nome: {nome}
- Tipo: {sintetica|consultor}
- Fontes: {N} documentos
- Pipeline: 6 fases (agora na Fase 1)

Vou comecar a ingestao das fontes.
```

Fazer handoff para @knowledge-miner com task `ingest-sources`.

## Formato de Output

Estado salvo em `.state.json` + diretorios criados + handoff para Fase 1.

## Error Handling

| Cenario | Acao |
|---------|------|
| Usuario nao fornece fontes | Pedir: "Quais documentos eu devo usar como base?" |
| Path invalido | Informar qual path nao existe, pedir correcao |
| Nome duplicado (slug ja existe) | Perguntar se quer sobrescrever ou escolher outro nome |

## Completion Criteria

- Nome, modo, fontes coletados
- Diretorios criados
- .state.json inicializado
- Handoff executado
