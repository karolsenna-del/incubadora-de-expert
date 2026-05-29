---
task: "Define Event"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Tipo de evento capturado em start"
Saida: "event-definition.md (tema, posição cronológica, tempo, função emocional/didática, audiência)"
Checklist:
  - "Tema do evento definido"
  - "Audiência identificada"
  - "Tempo total estimado capturado"
  - "Função emocional/didática do evento clara"
execution_type: "interactive"
---

# Task: Define Event — Fase 1 (Definição)

## Executive Summary

Captura a definição básica do evento: tema, audiência, contexto, tempo, função. Sem isso, o resto do pipeline opera no escuro.

## Steps

### Step 1: Capturar tema

> "Qual o tema central da apresentação?"

Capturar literal o que o usuário trouxer. Se vier vago, puxar concreto: "Pode me dar 1-2 frases descrevendo?"

### Step 2: Capturar audiência

> "Quem vai estar na frente? Perfil, nível, contexto."

Capturar perfil sócio-profissional, nível de conhecimento prévio, contexto que trazem.

### Step 3: Capturar tempo

> "Quanto tempo total a apresentação tem?"

Anotar duração. Se workshop, perguntar quantos dias.

### Step 4: Capturar função emocional/didática

> "O que você quer que o público SAIBA, SINTA e FAÇA depois disso?"

Função vai além de conteúdo — captura o efeito desejado. Insumo crítico pra arcos emocionais e bridges depois.

### Step 5: Salvar definição

Salvar em `event-definition.md` (path apontado pelo usuário, perguntar se ainda não definiu):

```markdown
# Event Definition — {Nome do Evento}

**Tipo:** {workshop/palestra/aula/treinamento}
**Tema:** {tema central}
**Audiência:** {perfil + nível + contexto}
**Tempo total:** {duração}
**Data:** {se houver}

## Função

**Saber:** {o que o público deve saber depois}
**Sentir:** {o que o público deve sentir}
**Fazer:** {ação que o público deve tomar}

## Contexto adicional
{anotações livres do usuário}
```

### Step 6: Handoff to map-sources

## Error Handling

| Cenário | Ação |
|---------|------|
| Tema vago demais ("falar de IA") | Puxar concreto: "Que ângulo? Pra quem? O que muda na cabeça deles?" |
| Audiência heterogênea | Capturar a heterogeneidade — vai impactar decisões de profundidade depois |
| Tempo não definido | Capturar como "a definir" mas seguir — pode resolver na Fase 2 |

---
