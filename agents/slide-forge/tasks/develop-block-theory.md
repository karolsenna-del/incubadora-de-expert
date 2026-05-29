---
task: "Develop Block Theory"
responsavel: "@slide-forge-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "skeleton (bloco N), fontes mapeadas do bloco, despejos brutos relevantes"
Saida: "Bloco N FECHADO no doc de construção (despejo + síntese + decisões + conteúdo desenvolvido)"
Checklist:
  - "Imersão feita (Chief leu fontes do bloco)"
  - "Debate profundo conduzido"
  - "A/B/C usado apenas onde apareceu ambiguidade real"
  - "Síntese organizada apresentada"
  - "Usuário aprovou (ou voltou pro debate)"
  - "Bloco salvo no doc de construção marcado FECHADO"
execution_type: "interactive"
---

# Task: Develop Block Theory — Fase 3 (loop por bloco)

## Executive Summary

O **coração do squad**. Para cada bloco do esqueleto, conduz debate profundo com o usuário até chegar numa síntese organizada que ele aprove. Quando aprovado, salva como FECHADO no doc de construção.

**Não é entrevista com perguntas A/B/C precoces. É DEBATE.** A/B/C entra só quando aparece bifurcação real.

## Steps

### Step 1: IMERSÃO

Antes de iniciar o debate do bloco, Chief lê:
- Todas as fontes mapeadas pra esse bloco
- Despejos brutos já capturados sobre o tema
- Material relacionado nos blocos vizinhos

**Sem imersão, debate fica raso.**

### Step 2: DEBATE PROFUNDO

Pergunta aberta de entrada:

> "Me conta sobre esse bloco — o que você quer entregar aqui?"

Conduz diálogo iterativo profundo:
- Escuta sem interromper
- Aceita despejo bruto extra trazido pelo usuário (ativa `capture-dump` se precisar)
- Faz perguntas profundas quando algo passa rápido
- Traz contraponto quando necessário (raro)
- Vai entendendo até ter clareza de como o usuário pensa esse bloco específico

Ver `data/debate-protocol.md` pra protocolo completo.

### Step 3: A/B/C QUANDO APARECE (PU-007a)

Se aparece bifurcação real (2-3 caminhos viáveis com tradeoff claro), apresenta opções numeradas:

```
**N. Pergunta direta:**
A. Opção A (descrição curta)
B. Opção B (descrição curta)
C. Opção C (descrição curta) — recomendação minha se houver
```

Decisões típicas:
- Profundidade: Express vs Médio vs Robusto
- Cases reais com nome ou anônimo ou nenhum?
- Tom: técnico, didático, emocional, filosófico, ou híbrido?
- Sub-conceito X entra ou não entra?
- Atividades interativas durante a apresentação?
- Sequência narrativa: princípios primeiro ou exemplos primeiro?
- Conceito divergente entre fontes — qual versão prevalece?

**Decisão rápida** — usuário responde 1 letra, Chief executa sem pedir confirmação extra.

### Step 4: DETECTAR FIM DO DEBATE

Sinais que terminou:
- Estrutura do bloco emergiu naturalmente
- Decisões finas resolvidas
- Chief consegue articular como apresentaria a síntese
- Usuário sente que "tá indo bem"

→ Vai pra apresentação da síntese.

### Step 5: APRESENTAR SÍNTESE ORGANIZADA

Apresenta pro usuário (formato em `data/synthesis-template.md`):

```
=== SÍNTESE — BLOCO {N}: {nome} ===

POSIÇÃO: {Dia X / contexto}
TEMPO: {N min}
FUNÇÃO: {emocional/didática}

ÂNGULO CENTRAL:
{1-2 frases}

CONCEITOS QUE ENTRAM (na ordem):
1. {conceito} — {justificativa}
2. ...

CONCEITOS QUE NÃO ENTRAM:
- {conceito} → {justificativa}

ARCO EMOCIONAL:
{descrição}

BRIDGE PRO PRÓXIMO BLOCO:
{frase de transição}

DECISÕES TOMADAS NO DEBATE:
- {decisão 1}
- ...

Isso bate? O que ajusta?
```

### Step 6: APROVAÇÃO OU LOOP

| Resposta usuário | Ação |
|---|---|
| Aprova | Próximo step (salva) |
| Pede ajuste pontual | Ajusta e re-apresenta |
| Pede revisão profunda | Volta pro Step 2 (debate) |

### Step 7: SALVAR NO DOC DE CONSTRUÇÃO

Quando aprovado, escreve a versão final no doc construção (path apontado pelo usuário):

```markdown
## BLOCO {N} — {Tema}

### Palavras do Usuário (cruas — DD/MM/AAAA)
> [Despejo bruto preservado]

### Material existente sobre o tema
- [referências apontadas pelo usuário]

### Síntese organizada (FECHADA DD/MM/AAAA)
[síntese aprovada na íntegra]

### Decisões tomadas (DD/MM/AAAA com Usuário)
- [lista]

### Conceitos REMOVIDOS / não entram
- [lista com justificativas]

### Conteúdo Desenvolvido (FECHADO DD/MM/AAAA)
[Corpo robusto da teoria — cada conceito com slide numerado preliminar dentro do doc]
```

### Step 8: PRÓXIMO BLOCO OU FASE 4

Se ainda tem bloco do esqueleto pendente: volta pro Step 1 com próximo bloco.
Se todos os blocos fechados: handoff para `validate-full-theory`.

## Error Handling

| Cenário | Ação |
|---------|------|
| Debate ficou circular sem convergir | Sinalizar pro usuário: "Tô sentindo que ainda não tá claro. O que você acha que tá faltando?" |
| Usuário discorda da síntese (todas as vezes) | Voltar pro debate. Captura DESPEJO BRUTO do que ele acha que tá errado. Re-imergir. |
| Bloco depende de bloco anterior ainda não fechado | Sinalizar e priorizar fechamento do anterior |
| Debate revelou conceito que não tava no esqueleto | Sinalizar pro usuário: "Apareceu X. Quer adicionar ao esqueleto ou descartar?" |

---

## Cardinal Rules Aplicadas

- Despejo é fonte primária (PU-005b)
- Decisões A/B/C como ferramenta, não esqueleto (PU-007a)
- Decisão rápida quando aparece (PU-008)
- Não invento, não chuto (PU-005)
- Reconhecer mancada e corrigir rápido (PU-034)

Ver `data/cardinal-rules.md`, `data/debate-protocol.md`, `data/synthesis-template.md`.
