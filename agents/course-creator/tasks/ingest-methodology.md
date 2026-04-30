---
task: "Ingest Methodology"
responsavel: "@course-creator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "PRD v1 aprovado (QG-CC-002)"
Saida: "PRD v2 com secao de metodologia preenchida"
Checklist:
  - "Docs locais do expert lidos e processados"
  - "Espinha dorsal da metodologia mapeada"
  - "Debate realizado com expert"
  - "PRD secao 5 (Metodologia) preenchida"
  - "Expert validou: 'e isso mesmo'"
execution_type: "interactive"
---

# Task: Ingest Methodology — Fase 2

**Task ID:** course-creator/ingest-methodology
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-04-08
**Category:** Pre-Production
**Execution Type:** Interactive

---

## Executive Summary

O expert aponta documentos locais que contem sua metodologia existente. O Creator le, processa, mapeia a espinha dorsal e valida com o expert. O PRD e enriquecido com a secao de metodologia — que sera a base pra toda a estruturacao do curso nas fases seguintes.

**Gate:** QG-CC-003 — Metodologia Mapeada + PRD Enriquecido

---

## Step-by-Step Execution

### Step 1: Solicitar Documentos

Perguntar:

```
Voce tem documentos com sua metodologia ja escrita?
Pode ser qualquer formato: textos, transcricoes, aulas anteriores,
posts, notas, PDFs, docs internos.

Me passa os paths dos arquivos (ou cola o conteudo) que eu processo tudo.

Se nao tem nada escrito, a gente extrai da sua cabeca aqui — sem problema.
```

### Step 2: Ler e Processar

Para cada documento apontado:
1. Ler o conteudo completo
2. Extrair: conceitos-chave, frameworks, passos, principios, terminologia propria
3. Mapear conexoes entre conceitos
4. Identificar o que e ESPINHA DORSAL (core da metodologia) vs SATELITE (complementar)

**CRITICO:** processar e VOLTAR PRO DEBATE. Nunca copiar direto.

### Step 3: Mapear Espinha Dorsal

Apresentar pro expert:

```
=== METODOLOGIA MAPEADA — {nome} ===

ESPINHA DORSAL:
1. {Conceito/fase 1} — {descricao curta}
2. {Conceito/fase 2} — {descricao curta}
3. ...

PRINCIPIOS ENCONTRADOS:
- {principio 1}
- {principio 2}

TERMINOLOGIA PROPRIA:
- {termo 1}: {definicao}
- {termo 2}: {definicao}

CONEXOES:
- {conceito A} → {conceito B} (por que)

SATELITES (complementares):
- {item 1}
- {item 2}

Isso bate? Falta algo? Alguma coisa ta no lugar errado?
```

### Step 4: Debate e Refinamento

- Expert corrige, complementa, reorganiza
- Creator ajusta o mapa
- Repete ate expert confirmar: "e isso mesmo"

Se expert nao tem docs e quer extrair da cabeca:
- Usar protocolo de co-desenvolvimento de teoria (KB, secao PROTOCOLOS)
- IA faz perguntas pra extrair a metodologia
- Organiza, apresenta, valida

### Step 5: Enriquecer PRD

Preencher secao 5 do PRD:

```markdown
## 5. Metodologia
- Nome da metodologia: {nome ou "ainda sem nome — sera definido na Fase 6"}
- Fases/steps do metodo:
  1. {fase 1} — {objetivo}
  2. {fase 2} — {objetivo}
  3. ...
- Principios-chave:
  - {principio 1}
  - {principio 2}
- Como se aplica ao curso: {mapeamento metodologia → modulos}
- Docs fonte: {lista de arquivos lidos}
```

### Step 6: Quality Gate QG-CC-003

Protocolo de 5 passos:

1. **APRESENTAR** o mapa da metodologia + PRD secao 5
2. **PERGUNTAR** "Isso bate com sua metodologia real? O que ta errado?"
3. **LOOP DE DEBATE** — ajustar ate expert estar satisfeito
4. **APROVACAO EXPLICITA** — expert confirma "e isso mesmo"
5. **HANDOFF** — passar pra Fase 3 (structure-course) com PRD v2

---

## Veto Conditions

- VETO se pular a apresentacao do mapa pro expert (nao pode mapear sem validar)
- VETO se copiar conteudo dos docs sem processar e debater
- VETO se expert nao confirmou explicitamente que o mapa bate com a realidade

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert nao tem docs | Normal. Extrair da cabeca usando protocolo de co-desenvolvimento. Mais rounds necessarios |
| Docs sao muito extensos | Ler tudo. Nao amostrar. Processar por partes se necessario, mas ler completo |
| Metodologia do expert e confusa/fragmentada | Normal. O trabalho e justamente organizar. Apresentar o que entendeu, debater |
| Expert tem multiplas metodologias | Identificar qual e relevante pro curso. Focar nessa. Mencionar as outras como satelites |
| Expert muda a metodologia durante o debate | Normal — faz parte. Ajustar o mapa e seguir |

---

**Task Status:** Ready for Production
