---
task: "Compact Instructions"
responsavel: "@gpt-publisher"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Persona + regras da mente de origem (de extract-mind)"
Saida: "Instructions.txt dentro do limite de 8.000 caracteres"
Checklist:
  - "Identidade e tom de voz preservados"
  - "Strict Rules essenciais preservadas"
  - "Boundaries preservadas"
  - "Modos de operação resumidos (1-2 linhas cada)"
  - "Referências a paths/comandos do Auroq traduzidas pra linguagem natural"
  - "Tamanho final <= 8.000 caracteres, com folga pra ~7.000"
  - "Lista do que foi cortado documentada"
execution_type: "sequential"
---

# Task: Compact Instructions — Compactar Persona pro GPT Builder

## Objetivo

Transformar a persona completa do Auroq (que geralmente estoura o limite de 8.000 caracteres do campo Instructions) numa versão compacta que preserva o comportamento core do agente.

## Trigger

Segundo passo de `execute-mission.md`, após `extract-mind.md`.

## Decision Tree — O que fica, o que sai

```
A informação é necessária em TODA interação pra manter persona/voz/regras core?
├── SIM → fica nas Instructions
│         (identidade, tom de voz, strict rules, boundaries, resumo de 1-2 linhas
│          por modo de operação)
└── NÃO → vai pro Knowledge file (prepare-knowledge.md cuida disso depois)
          (procedimento detalhado de cada task, exemplos extensos, glossário,
           troubleshooting)
```

## Passos

### Step 1: Montar o Esqueleto das Instructions

Ordem recomendada (do mais crítico pro menos crítico, pra cortar de trás pra frente se precisar):

1. **Identidade** (quem é, propósito) — 1 parágrafo curto
2. **Tom de voz / Personalidade** — os traços que mais definem como o agente fala
3. **O que faz / não faz** (scope + boundaries, resumido)
4. **Modos de operação** — 1-2 linhas por modo (trigger + o que acontece), não o protocolo inteiro
5. **Strict Rules essenciais** — as NUNCAs/SEMPREs que mudam comportamento perceptível pro usuário final (não as operacionais internas do Auroq, tipo "atualizar tracker")
6. **Instrução de uso do Knowledge** — 1 frase avisando o GPT que ele tem arquivos de Knowledge anexados e deve consultá-los quando o pedido exigir profundidade (procedimentos, exemplos, glossário)

### Step 2: Traduzir Referências do Auroq

Persona do Auroq foi escrita assumindo um agente rodando no Claude Code. Traduzir:
- Comandos `*comando` → remover ou traduzir pra linguagem natural (Custom GPT não tem sintaxe de comando)
- Paths de arquivo (`agents/{slug}/data/...`) → remover, não fazem sentido fora do Auroq
- Referências a "tasks" nomeadas → virar "modos" ou "tipos de pedido" em linguagem natural
- Referências a outros agentes do Auroq (Companion, Ops etc.) → remover, não existem no contexto do GPT

### Step 3: Medir e Cortar Até Caber

1. Contar caracteres do rascunho
2. SE > 7.000 (meta prática, deixa folga até o limite real de 8.000): cortar por prioridade reversa (primeiro o que for menos crítico pra manter a voz/comportamento)
3. Repetir até ficar dentro da meta

**O que cortar primeiro (do menos crítico pro mais crítico — parar assim que couber):**
1. Exemplos extensos (mover pro Knowledge)
2. Explicações longas de "por que" uma regra existe (manter só a regra)
3. Detalhamento de modos secundários (manter 1 linha, detalhe completo vai pro Knowledge)
4. Frases redundantes ou floreios que não mudam comportamento

**Nunca cortar:**
- A regra em si (pode cortar a explicação, não a regra)
- Boundaries (o que o agente NUNCA faz)
- O núcleo do tom de voz

### Step 4: Documentar os Cortes

Registrar (pra rastreabilidade e pro Playback de aprovação):

```
=== CORTES REALIZADOS ===
Tamanho original da persona: {N} chars
Tamanho final das Instructions: {N} chars

Cortado:
  - {trecho/seção} → motivo: {não muda comportamento perceptível / movido pro Knowledge}
  - {trecho/seção} → motivo: {...}
```

## Output

`Instructions.txt` pronto + relatório de cortes, ambos usados no Step de Apresentação (dentro de `execute-mission.md`).

## Error Handling

| Cenário | Ação |
|---------|------|
| Mesmo cortando tudo "não crítico" ainda passa de 8.000 chars | Escalar pra Karol: "A persona é densa demais pra caber com segurança. Preciso cortar algo estrutural — qual modo posso resumir mais?" |
| Persona já cabe sem cortes | Seguir normal, sem necessidade de aprovação extra de cortes (mas ainda passa pelo Playback geral) |
| Persona tem comandos `*` centrais ao funcionamento (o agente só faz sentido com comandos) | Sinalizar: "Essa mente depende de comandos `*` — não é candidata natural a Custom GPT. Confirma antes de eu prosseguir?" |
