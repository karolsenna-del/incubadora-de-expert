---
task: "Build Display Name"
responsavel: "@vitrine-strategist"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Nucleo de influencia completo (output do nucleo-strategist)"
Saida: "Display Name final escolhido + 2-3 variacoes registradas + char_count validado"
Checklist:
  - "Padrao 'Nome Sobrenome | Credencial' aplicado"
  - "2-3 variacoes de credencial geradas baseadas no nucleo"
  - "Limite 30 caracteres respeitado em todas variacoes"
  - "Sem numeros/underscores/emojis decorativos"
  - "Aluno aprovou explicitamente uma das variacoes"
  - "Variacao escolhida diz O QUE faz em 1 olhada"
execution_type: "interactive"
---

# Task: Build Display Name — Item 1 da Vitrine

**Task ID:** posicionamento-digital/build-display-name
**Version:** 1.0.0
**Category:** Vitrine / Item 1

---

## Executive Summary

Primeiro item da vitrine. Aplica padrao FIXO `Nome Sobrenome | Credencial de Especialista` com 2-3 variacoes de credencial baseadas no nucleo. Loop ate check.

---

## Inputs

- Nucleo completo (Pontos 1, 2, 3 principais)
- Eventual nome do metodo (se aluno tem)
- Eventual alcunha (Ponto 2 do nucleo)

**KB consultada:** `data/vitrine-instagram-2026.md` (secao Display Name)

---

## Outputs

- Display Name final (≤30 chars)
- Lista de variacoes consideradas (registro)
- Char count

---

## Step-by-Step Execution

### Step 1: Iniciar Item

```
Vitrine, item 1 de 9: DISPLAY NAME.

Padrao FIXO da Mentoria Arcane: "Nome Sobrenome | Credencial de Especialista"
Limite tecnico: 30 caracteres.

Vou gerar 2-3 variacoes de credencial baseadas no seu nucleo.
```

### Step 2: Identificar Variacoes de Credencial

Pega do nucleo:
- **Nome** (Ponto 1): nome real
- **Especialidade base** (Ponto 1): "consultora de lideranca", "dentista", "personal trainer"
- **Quem ajuda** (Ponto 3): "lideres", "mulheres 50+", "empresarias"
- **Alcunha** (Ponto 2, se tiver): "Medica da Lideranca"
- **Metodo** (se mencionado): "Metodo MMI"

Gera 2-3 credenciais com angulos diferentes:

**A) Generica (especialidade base):**
- "Especialista em Lideranca"
- "Dentista"
- "Personal Trainer"

**B) Especifica (especialidade + nicho):**
- "Especialista em Lideranca Feminina"
- "Dentista Estetica"
- "Personal de Mulheres 50+"

**C) Diferenciadora (alcunha OU metodo):**
- "Medica da Lideranca"
- "A Dentista do Sorriso Hollywood"
- "Metodo MMI"

### Step 3: Validar Limites

Pra cada variacao:
- Calcular char count completo: "Nome Sobrenome | Credencial"
- Se > 30 chars, ajustar (encurtar credencial)

Exemplo:
```
"Veridiana Cavalieri | Especialista em Lideranca Feminina"  → 54 chars (FORA)
"Veridiana Cavalieri | Especialista em Lideranca"            → 47 chars (FORA)
"Veridiana | Especialista em Lideranca"                      → 38 chars (FORA)
"Veridiana | Especialista Lideranca"                         → 34 chars (FORA)
"Veridiana | Lider Cirurgica"                                → 28 chars (OK)
```

**Truque pra encurtar:**
- "Especialista em X" → "Especialista X" → so "X"
- "Nome Sobrenome" → "Nome" (so primeiro nome)

### Step 4: Apresentar Variacoes

```
3 variacoes pro seu Display Name:

A) "[variacao A]" 
   ([N] chars — generico, OK pra publico amplo)

B) "[variacao B]"
   ([N] chars — equilibrado, claro)

C) "[variacao C]"
   ([N] chars — diferenciador maximo, exige que voce compre essa identidade)

Eu recomendo [letra] porque:
- [motivo 1 — referencia best practice]
- [motivo 2 — referencia nucleo]
- [motivo 3 — SEO/clareza]

Mas [outra letra] tambem funciona se voce [contexto]. 

Qual?
```

### Step 5: Loop ate Check

Aluno escolhe ou pede outra. Se pede outra:
- Gera mais 2-3 variacoes (com angulos diferentes — talvez incluir titulo/metodo nao explorado)
- Re-apresenta

Loop ate aluno escolher uma.

### Step 6: Quality Gate

Valida escolha final:
- [ ] ≤ 30 chars
- [ ] Padrao "Nome | Credencial" respeitado
- [ ] Sem ruido (numero/underscore/emoji)
- [ ] Diz O QUE faz em 1 olhada

Se passa → segue.
Se nao passa → confronta o aluno e ajusta.

### Step 7: Oferta de Producao (sempre acontece)

```
Display Name escolhido: "[escolha final]"

Item fechado. Pra esse aqui nao tem o que "produzir" — e so o texto.

Item 1 de 9: ✓

Vamos pro item 2: BIO.
```

(Display Name nao tem capa-conceito nem copy longa — apenas o texto. Por isso "produzir" e trivial aqui.)

### Step 8: Atualizar Estado

```yaml
vitrine.display_name:
  final: "..."
  char_count: N
  variacoes_consideradas: [A, B, C]
  aluno_aprovou: true
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno tem nome muito longo (>20 chars so o nome) | Sugere usar so primeiro nome + sobrenome inicial. Ex: "Veridiana C." |
| Aluno nao tem credencial clara | Pergunta: "Em 2-3 palavras, qual a maior credencial pro seu publico?" e propoe baseado |
| Aluno quer usar emoji ("✨ Maria | Coach ✨") | Confronta: regra do squad — sem emoji decorativo. Pode usar separador estilizado ( • ) se quiser mais visual |
| Aluno questiona o padrao "Nome \| Credencial" | Defende com base tecnica: SEO + clareza + best practice 2026. Padrao e fixo |
| Aluno tem nome muito comum (Maria Silva) | Credencial DIFERENCIADORA fica obrigatoria — usar nicho especifico |

---

**Task Status:** Ready for Production
