---
task: "Loop Feedback Nucleo"
responsavel: "@nucleo-strategist"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Proposta v1 do nucleo apresentada pro aluno"
Saida: "Nucleo final validado com 'check, perfeito' do aluno + handoff pro chief (QG-PD-002 PASS)"
Checklist:
  - "Cada feedback do aluno foi integrado OU defendido com argumento tecnico"
  - "Aluno disse 'check, perfeito' (ou equivalente claro)"
  - "Checklist tecnico do metodo audience validado novamente"
  - "Vocabulario do aluno preservado no nucleo final"
  - "Quality Gate QG-PD-002 marcado como PASS"
execution_type: "interactive"
---

# Task: Loop Feedback Nucleo — Loop de Refinamento

**Task ID:** posicionamento-digital/loop-feedback-nucleo
**Version:** 1.0.0
**Category:** Nucleo / Loop

---

## Executive Summary

Terceira task do nucleo-strategist. Apos v1 apresentada, loop ate aluno confirmar "check, perfeito". E o GARGALO do pipeline — sem nucleo bom, vitrine sai medio.

Loop NAO e capitulacao. Agent defende quando tem razao tecnica (regra do metodo audience).

---

## Inputs

- Proposta v1 do nucleo apresentada (output de build-nucleo-influencia.md)
- Vocabulario do aluno catalogado

---

## Outputs

- Nucleo final aprovado pelo aluno
- QG-PD-002 marcado como PASS
- Handoff pro chief com nucleo completo

---

## Step-by-Step Execution

### Step 1: Apresentacao + Convite

```
[V1 apresentada em formato narrativo — output do build-nucleo-influencia.md]

═══════════════════════════════════════

Manda do jeito que sair:
- Bate ate aqui?
- O que voce ajustaria?
- Tem ponto que ficou estranho?
- Tem palavra que voce nunca usaria?

Nao precisa ter pena. Eu refaço quantas vezes for necessario.
```

### Step 2: Categorizar Feedback do Aluno

Aluno volta com feedback. Agente categoriza:

**Tipo A — Feedback com base tecnica:**
- "Essa dor nao bate, minha cliente usa outra palavra"
- "O inimigo X esta confuso, troca por Y"
- "O beneficio 2 e fraco, tira"

→ Agente INTEGRA imediatamente.

**Tipo B — Feedback com base de preferencia pessoal:**
- "Nao gosto dessa palavra" (sem motivo)
- "Pareceu duro" (motivo emocional sem base tecnica)

→ Agente DEBATE — pergunta "qual o motivo concreto?"
   - Se motivo for valido depois do debate, integra
   - Se motivo for so estetico/preguica, defende a versao atual

**Tipo C — Aprovacao preguicosa:**
- "Ta bom"
- "Pode ser"
- "Tanto faz"

→ Agente CONFRONTA: "Esse nucleo vai ser fundacao da sua vitrine inteira. 'Ta bom' nao serve. 3 perguntas:"
1. A dor captura o que sua cliente sente?
2. Voce vai falar esse inimigo com conviccao ou parece roteiro?
3. Os 3 beneficios sao tudo? Falta algum importante?

### Step 3: Refazer Parte Questionada

Se feedback foi integrado, agente refaz o ponto especifico:

```
Anotado. Vou refazer [PONTO X] com base no que voce disse.

Em vez de:
"[versao anterior]"

Fica:
"[versao nova]"

Bate?
```

### Step 4: Loop ate Check

Repete Steps 2-3 ate aluno dar check explicito.

**Sinais de check:**
- "check, perfeito"
- "agora sim"
- "isso mesmo"
- "pode seguir"

**Sinais que NAO sao check:**
- "ta bom" (provavelmente preguicoso — confrontar)
- "deve dar certo" (incerteza — perguntar o que ta sobrando)
- "se voce diz" (delegacao — confrontar: "voce que aprova, nao eu")

### Step 5: Validar Checklist Tecnico Final

Apos check, agente roda uma ultima validacao silenciosa:

- [ ] Dor em UMA palavra na voz do publico
- [ ] Inimigo externo, nao o cliente
- [ ] Inimigo com nome sexy
- [ ] Solucao = engenharia reversa
- [ ] Exatos 3 beneficios
- [ ] Pelo menos 1 crenca central forte
- [ ] Apresentacao magnetica em 3-4 versoes
- [ ] Vocabulario familiar ao publico-alvo

Se algo falha, agente sinaliza:

```
Antes de fechar, detectei um ponto:
[ponto que falha].

Vamos ajustar? Senao, fechamos com flag de qualidade reduzida.
```

### Step 6: Marcar QG-PD-002 PASS

Atualiza estado:
```yaml
quality_gates_passed: [..., "QG-PD-002"]
nucleo_finalizado: true
```

Despede:

```
Fechado. Seu Nucleo de Influencia esta pronto.

Vou passar pro chief, que vai te direcionar pra montagem da 
vitrine com o @vitrine-strategist. La voce constroi:
- Display Name
- Bio
- Link da bio
- 3 destaques (Sobre / Produto / Depoimentos)
- 3 posts fixados (Sobre / Tese / Oferta)

Bora.
```

### Step 7: Handoff Pra Chief

Passa nucleo completo via handoff (formato em `agents/nucleo-strategist.md` → Integracao).

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Loop excede 5 iteracoes sem chegar a check | Sinalizar: "5 versoes ja. O que ta te impedindo de aprovar?" — geralmente revela bloqueio nao mencionado |
| Aluno aprova rapido demais sem ler v1 | Confrontar com 3 perguntas validativas (Step 2 Tipo C) |
| Aluno quer mudar regra tecnica do metodo (mais de 3 beneficios, inimigo = cliente) | Defender com base na regra. Nao ceder. |
| Aluno questiona o tom do nucleo ("muito duro/agressivo") | Distinguir: tom da APRESENTACAO MAGNETICA pode ser ajustado (gerar versao mais soft). Mas estrutura dos 11 pontos nao. |

---

**Task Status:** Ready for Production
