---
task: "Build Bio"
responsavel: "@vitrine-strategist"
responsavel_type: "hybrid"
atomic_layer: "task"
Entrada: "Display Name fechado + nucleo completo"
Saida: "Bio final aprovada + tipo (GROWTH/SALES/DM/LOCAL) registrado + CTA + char_count validado"
Checklist:
  - "Tipo de bio identificado por pergunta ao aluno (objetivo do momento)"
  - "Formula adaptativa aplicada"
  - "Bio carrega elementos do nucleo (dor, solucao, beneficio ou crenca)"
  - "Bio e criativa, clara e bem posicionada (nao cliche)"
  - "CTA final acima do link (especifico)"
  - "Limite 150 chars respeitado"
  - "Aluno aprovou + recebeu oferta de producao da versao final"
execution_type: "interactive"
---

# Task: Build Bio — Item 2 da Vitrine

**Task ID:** posicionamento-digital/build-bio
**Version:** 1.0.0
**Category:** Vitrine / Item 2

---

## Executive Summary

Segundo item. Bio adaptativa por objetivo do momento. Criativa + clara + posicionada + CTA final especifico acima do link. Loop ate check + oferta de producao.

---

## Inputs

- Nucleo completo
- Display Name fechado
- Eventual bio atual (pra refinar em vez de refazer do zero)

**KB consultada:** `data/vitrine-instagram-2026.md` (secao Bio)

---

## Outputs

- Bio final (≤150 chars)
- Tipo (GROWTH/SALES/DM/LOCAL)
- CTA final
- Char count

---

## Step-by-Step Execution

### Step 1: Iniciar Item

```
Vitrine, item 2 de 9: BIO.

Primeira pergunta: qual o objetivo PRINCIPAL do seu Instagram HOJE?

A) GROWTH — construir audiencia (foco em crescer base qualificada)
B) SALES — vender produto (tem oferta pronta, quer converter)
C) DM — qualificar lead 1-a-1 (vendas consultivas, pegada pessoal)
D) LOCAL — atendimento fisico/regional

Voce decide. Bio muda muito conforme o objetivo.
```

### Step 2: Recomendar Baseado no Nucleo (se aluno hesitar)

Se aluno nao sabe, agente recomenda:
- Tem produto pronto + comecando a empurrar → SALES
- Sem produto OU produto pronto mas audiencia muito pequena → GROWTH
- Atendimento consultivo + ticket alto → DM
- Negocio fisico/regional → LOCAL

### Step 3: Aplicar Formula Adaptativa

Baseado no tipo escolhido, agente gera bio v1:

#### GROWTH-type
```
Linha 1: "Ajudo [quem ajuda] a [transformacao baseada em ponto 11 + crenca]"
Linha 2 (opcional): "[POV/crenca central]"
CTA: "[anuncia o lead magnet/conteudo]"
↓
[link]
```

#### SALES-type
```
Linha 1: "Ajudo [quem ajuda] a [resultado especifico do produto]"
Linha 2 (opcional): "[prova rapida — numero, marco]"
CTA: "[anuncia o produto]"
↓
[link]
```

#### DM-type
```
Linha 1: "[Pergunta sobre a dor] (Ponto 5 do nucleo)"
Linha 2: "[Filtro: quem voce NAO atende]"
CTA: "Manda '[PALAVRA]' no DM pra [acao]"
```

#### LOCAL-type
```
Linha 1: "[Servico] em [cidade] — [diferencial]"
Linha 2: "[Trust markers: anos, certificacao, especialidade]"
CTA: "[Agende / Ligue / Direcoes]"
↓
[link]
```

### Step 4: Validar Critérios

ANTES de apresentar:
- [ ] Criativa (nao cliche)
- [ ] Clara (entende em 5s)
- [ ] Posicionada (carrega nucleo)
- [ ] CTA final especifico (nao "link na bio ↓")
- [ ] ≤ 150 chars
- [ ] Zero emoji decorativo
- [ ] 1 acao primaria (nao buffet)

Se falhar algum, refaz internamente antes de mostrar.

### Step 5: Apresentar V1

```
═══════════════════════════════════════
BIO v1 — Tipo [GROWTH/SALES/DM/LOCAL]
═══════════════════════════════════════

[texto completo da bio com quebras de linha]

[N] caracteres.

Anti-padroes que evitei:
- "[anti-padrao 1]" (cliche)
- "[anti-padrao 2]" (sem posicionamento)
- "[anti-padrao 3]" (vago)

Carregamentos do nucleo:
- "[trecho]" → [ponto X do nucleo]
- "[trecho]" → [crenca/visao]

CTA escolhido: "[CTA final]"
Justificativa: [por que esse CTA — especificidade + alinhamento com objetivo]

Bate? Algo pra ajustar?
```

### Step 6: Loop ate Check

Mesma logica do nucleo:
- Feedback tecnico → integra
- Feedback estetico → debate
- Aprovacao preguicosa → confronta

**Confronto especifico de bio:**
```
Cuidado: voce ta aprovando uma bio que sera lida por MILHARES.
- Ela posiciona? (qualquer um do nicho podia ter escrito o mesmo?)
- Ela e CLARA? (entende em 5s ou demora?)
- O CTA e ESPECIFICO? (anuncia o que vem em seguida?)

Se a resposta pra alguma e "nao", ainda nao ta pronta.
```

### Step 7: Oferta de Producao

```
Bio aprovada: "[versao final]"

Quer que eu produza a VERSAO FINAL FORMATADA pra colar direto no Instagram?
(Com quebras de linha exatas, eventual emoji estrategico, char count final)

A) SIM, produz pronto pra colar
B) NAO, ja ta bom como esta
```

Se A:
- Formata pra colar (Instagram trata quebras de linha diferente)
- Inclui emoji estrategico SE fizer sentido (1-2 max, com funcao)
- Entrega bloco copy-pasteavel

Item 2 de 9: ✓

### Step 8: Atualizar Estado

```yaml
vitrine.bio:
  type: "growth|sales|dm|local"
  texto_final: "..."
  cta_final: "..."
  char_count: N
  produzida: true|false
  aluno_aprovou: true
```

---

## Veto Conditions

| Condicao | Acao |
|----------|------|
| Aluno quer usar bio cliche ("apaixonado por X") | Confronta com base tecnica: "Cliche. Qualquer um do seu nicho podia ter escrito. Vou propor 3 versoes com angulo proprio" |
| Aluno quer mais de 1 CTA na bio | Confronta: "1 CTA primario. Multiplas opcoes = decision fatigue = -28-35% CTR" |
| Aluno excede 150 chars | Pede pra cortar OU agente corta sugerindo o que tirar |
| Aluno quer emoji decorativo | Permite 1-2 emojis SE com funcao (ex: ↓ pra apontar pro link). Decorativo puro → confronta |
| Aluno quer CTA generico ("link na bio") | Confronta: "Generico perde 30%+ de CTR. Anuncia o que tem la" |
| Aluno nao tem nada pra anunciar no CTA (sem produto, sem lead magnet) | CTA fica "Conheca meu trabalho ↓" + adiciona pendencia ("criar lead magnet OU produto") |

---

**Task Status:** Ready for Production
