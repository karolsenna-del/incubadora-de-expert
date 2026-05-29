---
task: "Diagnose State"
responsavel: "@posicionamento-chief"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno confirmou inicio do squad (apos start.md)"
Saida: "Estado do aluno mapeado + rota definida + handoff pro specialist correto"
Checklist:
  - "3 perguntas-chave feitas e respondidas"
  - "Materiais Fase 1 coletados (ou aluno aceitou seguir sem)"
  - "Nucleo existente coletado (se houver) ou identificada necessidade de construir"
  - "Vitrine parcial coletada (se houver)"
  - "Rota definida e comunicada ao aluno"
execution_type: "interactive"
---

# Task: Diagnose State — Diagnostico do Estado do Aluno

**Task ID:** posicionamento-digital/diagnose-state
**Version:** 1.0.0
**Category:** Routing

---

## Executive Summary

Faz 3 perguntas-chave pra mapear em que ponto o aluno esta e rotear pro caminho correto. Sem diagnostico, squad pode entrar em redundancia (refazer o que ja existe) ou pular etapa critica.

---

## Inputs

- Aluno confirmou inicio do squad
- Sessao limpa OU sessao retomada (`*resume`)

---

## Outputs

- Estado do aluno mapeado em variaveis:
  - `tem_materiais_fase1: boolean`
  - `tem_nucleo: boolean`
  - `tem_vitrine_parcial: list[items]`
- Rota definida: ver tabela de cenarios abaixo
- Handoff executado pro specialist correto

---

## Step-by-Step Execution

### Step 1: Pergunta 1 — Fase 1 da Mentoria

```
Pra te direcionar, 3 perguntas:

1. Voce ja passou pela Fase 1 da Mentoria Arcane? 
   (proposito + posicionamento + metodologia + primeiro produto)
```

**Respostas possiveis:**
- SIM com materiais → "Anexa ou cola os materiais (PDF/MD/doc) aqui"
- SIM sem materiais → "Recomendo recuperar os materiais — eles sao a base. 
  Onde voce salvou? Drive? Notion? Vou esperar voce buscar."
- NAO → Pular pra Step 1b (confronto didatico)

### Step 1b: Confronto (se NAO fez Fase 1)

```
Confronto, mas com clareza: sem Fase 1 fechada, sua vitrine vai sair POBRE.

Aqui o motivo:
- O nucleo de influencia (primeiro bloco) PRECISA do seu posicionamento
- Sem posicionamento, o nucleo vira chute generico
- Vitrine baseada em nucleo generico = mais um perfil 
  no meio de 10 milhoes parecidos

2 opcoes:

A) Voltar pra Fase 1 primeiro. Fazer direito. Voltar aqui.
   → Recomendado. Vitrine sai forte.

B) Seguir aqui, improvisando com o que voce tem na cabeca.
   → Squad funciona, mas saida fica fraca. Vai precisar refazer depois.

Voce decide.
```

**Se A:** Encerra squad com instrucao pra voltar. Salva estado.
**Se B:** Continua, registra flag `improviso=true`.

### Step 2: Pergunta 2 — Nucleo de Influencia

```
2. Voce ja tem um Nucleo de Influencia construido segundo 
   metodo audience? (resumo do seu posicionamento focado em rede social)
```

**Respostas possiveis:**
- SIM com doc → "Compartilha. Vou validar antes de partir pra vitrine"
- SIM sem doc claro → "Me conta o que voce lembra. Vou validar e refinar se precisar"
- NAO → "Vamos construir. Primeiro item da nossa jornada"

### Step 3: Pergunta 3 — Vitrine Parcial

```
3. Voce ja tem alguma parte da vitrine montada? 
   (display name atual, bio, destaques, posts fixados)

Manda do jeito que sair. Eu nao vou refazer o que ja ta bom — 
vou refinar e completar o que falta.
```

**Aluno descreve estado atual da vitrine.** Agente anota o que existe.

### Step 4: Definir Rota

Baseado nas respostas, rota e definida:

| `tem_materiais_fase1` | `tem_nucleo` | `tem_vitrine_parcial` | Rota |
|----------------------|--------------|------------------------|------|
| True | False | Qualquer | @nucleo-strategist → @vitrine-strategist |
| False (B) | False | Qualquer | @nucleo-strategist (improviso) → @vitrine-strategist |
| True/False | True | Qualquer | @posicionamento-chief valida nucleo → se OK, direto @vitrine-strategist |
| True | True | Vitrine completa | Loop de revisao (aluno escolhe item) |

### Step 5: Comunicar Rota

```
Sua jornada aqui:
1. [Etapa 1 baseada na rota]
2. [Etapa 2]
3. [Etapa 3]

Estimativa: [X sessoes pro nucleo, Y sessoes pra vitrine]

Passo pro [@specialist] agora.
```

### Step 6: Handoff

Executar handoff pro specialist correto com contexto:

```yaml
handoff:
  to: "{specialist}"
  context:
    materiais_fase1: {anexos ou texto}
    nucleo_existente: {se houver}
    vitrine_existente: {se houver}
    improviso_flag: {true/false}
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno traz materiais conflitantes (PDF X, MD Y) | Confrontar e decidir junto qual prevalece ANTES de handoff |
| Aluno tem nucleo "rascunho" sem estrutura | Tratar como "sem nucleo" — passar pro nucleo-strategist construir do zero |
| Aluno ja tem vitrine pronta e quer "so olhar" | Oferecer revisao por item — aluno aponta o que quer revisar |
| Aluno nao quer responder as 3 perguntas ("so faz") | Insistir: "Sem diagnostico, vou retrabalhar o que ja ta bom. 2 minutos pra eu nao te fazer perder tempo" |

---

**Task Status:** Ready for Production
