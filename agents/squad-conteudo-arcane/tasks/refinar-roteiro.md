---
task: "Refinar Roteiro"
responsavel: "@rico-roteirista"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Roteiro v(N) + feedback do expert"
Saida: "Roteiro v(N+1) ajustado"
Checklist:
  - "Feedback do expert identificado com precisao"
  - "Ajuste cirurgico (não reescreve tudo)"
  - "Preserva o que ja estava bom"
  - "Marca o que mudou (diff entre versoes)"
execution_type: "interactive"
---

# Task: Refinar Roteiro — Loop de Feedback

**Task ID:** squad-conteudo-arcane/refinar-roteiro
**Version:** 1.0.0
**Responsavel:** @rico-roteirista
**Category:** Iteração do Roteiro
**Execution Type:** Interactive

---

## Propósito

Critério de roteiro pronto = expert aprova. Sem limite de iterações.

Esta task é o loop entre v1 → v2 → vN até aprovação.

---

## Pipeline

```
refinar-roteiro
  |
  v
STEP 1: ENTENDER FEEDBACK COM PRECISAO
  |
  +→ feedback vago → pedir especificacao
  |
  +→ feedback especifico → aplicar
  |
  v
STEP 2: IDENTIFICAR ONDE MEXER
  Hook? Intro? Corpo? CTA? Tudo?
  |
  v
STEP 3: AJUSTE CIRURGICO
  Preserva o que estava bom
  |
  v
STEP 4: APRESENTAR NOVA VERSAO + MARCAR DIFF
  |
  v
STEP 5: EXPERT REVISA → APROVA OU NOVO LOOP
```

---

## Step 1: Entender Feedback com Precisão

Tipos de feedback comuns:

**Feedback ESPECÍFICO (bom):**
- "Hook tá brando, quero mais punch"
- "Não gostei do CTA — usa outro"
- "Corpo perdeu ritmo no minuto 0:25"
- "Trocar a palavra X por Y"

→ Aplica diretamente.

**Feedback VAGO (precisa especificar):**
- "Não tá bom"
- "Falta algo"
- "Não vibrou"

→ Pergunta direto:

```
Pra eu ajustar certo, me ajuda a especificar:

- E o HOOK que ta fraco? Ou o corpo?
- E o TOM que não bate? Ou o conteudo?
- Tem alguma palavra/frase especifica que te incomoda?
- Tem alguma parte que ESTA boa? (assim eu nao mexo nela)

Quanto mais especifico, melhor o ajuste.
```

---

## Step 2: Identificar Onde Mexer

Mapear o feedback aos componentes:

| Feedback | Componente |
|----------|------------|
| Hook/abertura/3 segundos | HOOK |
| Início, contexto, primeira parte | INTRO FORTE |
| Meio, conteúdo, argumentos | CONTEÚDO (corpo) |
| Fim, CTA, conclusão | CTA + FECHAMENTO |
| Tom, palavras, ritmo | aplicar perfil-tom-de-voz mais forte |
| Estrutura geral | revisar arquitetura |

---

## Step 3: Ajuste Cirurgico

**Princípio:** NÃO reescrever do zero. Preserva o que estava bom.

Mexe só no que o feedback aponta.

Se feedback é "hook brando":
- Mantém intro, conteúdo, CTA, fechamento
- Refaz só o hook (oferece 3 versões pra expert escolher)

Se feedback é "todo o roteiro não bate":
- Aí sim, refaz do zero (mas é raro — se acontece, provavelmente teoria ou tom precisa ser revisitado)

---

## Step 4: Apresentar Nova Versão + Marcar Diff

```
Roteiro v{N+1}. O que mudou em relação a v{N}:

═══════════════════════════════════════════════════════════════
DIFF (mudancas)
═══════════════════════════════════════════════════════════════

✓ HOOK: refeito (3 versoes pra voce escolher)
  Versao A (Disrupção + Polemica): "{frase}"
  Versao B (Mistério + Recompensa): "{frase}"
  Versao C (Reconhecimento + Disrupcao): "{frase}"

✓ Resto: preservado

═══════════════════════════════════════════════════════════════

Escolhe versao A, B ou C — ou pede outras 3.
```

Quando expert escolhe / aprova, Rico salva como nova versão.

---

## Step 5: Loop ou Aprovação

Expert revisa.

Se aprova: salva versão final em `roteiro.md`, marca aprovado, fim.

Se não: volta ao Step 1.

---

## Veto Conditions

| Condição | Ação |
|----------|------|
| 5+ iterações sem aprovação | Pausa: "5 voltas e ainda nao bate. Provavelmente a teoria precisa ser revisitada (Sage) OU o tom (perfil). Quer pausar e voltar amanha com cabeça fresca?" |
| Expert pede reescrita do zero a cada iteração | Confronta: "Reescrever do zero perde o que ja funcionou. Vamos cirurgico — me diz EXATAMENTE o que muda." |
| Feedback contradiz iteração anterior | Pergunta: "Na v2 voce pediu mais punch, agora ta pedindo mais leveza. Qual te vibra de fato? Vou pra essa direcao definitiva." |

---

## Quality Gate

**Iteração aceita:**

- [ ] Feedback do expert identificado com precisão
- [ ] Ajuste cirúrgico (não reescreveu desnecessariamente)
- [ ] Diff entre versões claro
- [ ] Expert validou OU pediu novo refino

---

**Task Status:** Ready for Production
