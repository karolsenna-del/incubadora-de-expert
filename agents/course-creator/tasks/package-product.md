---
task: "Package Product"
responsavel: "@product-packager"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Curso completo + branding aprovado (QG-CC-007)"
Saida: "Produto estruturado: cartao de identidade completo"
Checklist:
  - "Classificacao definida (Farmacia/Clinica/Hospital)"
  - "3 camadas preenchidas (O que e / O que faz / Como faz)"
  - "Proposta de valor construida (3 perguntas)"
  - "Matriz de beneficios completa"
  - "Pricing definido com 5 fatores"
  - "Definicoes comerciais fechadas"
  - "Cartao de identidade do produto gerado"
  - "Expert aprovou"
execution_type: "interactive"
---

# Task: Package Product — Fase 7

**Task ID:** course-creator/package-product
**Version:** 2.0.0
**Status:** Production Ready
**Created:** 2026-04-08
**Category:** Post-Production
**Execution Type:** Interactive

---

## Executive Summary

O Product Packager consolida tudo que foi desenhado nas fases anteriores num "produto estruturado" — pronto pra vender e comunicar. Segue protocolo de 10 passos da KB e gera o Cartao de Identidade do Produto como output final.

**Gate:** QG-CC-008 — Empacotamento Aprovado

---

## Step-by-Step Execution

### Step 1: Carregar KB + Contexto

- Carregar `data/product-packaging-kb.md`
- Ler PRD completo (v2 com metodologia)
- Revisar estrutura do curso (modulos, aulas, entregaveis)
- Ler branding aprovado (naming, posicionamento, identidade verbal)

### Step 2: Protocolo de 10 Passos

Executar sequencialmente, apresentando e debatendo com o expert em cada passo:

**Passo 1 — Classificar:** Farmacia, Clinica ou Hospital? Justificar.

**Passo 2 — Posicionar na esteira:** Ordem, Orbita ou Proximidade? Se o expert ja tem outros produtos, como este se encaixa?

**Passo 3 — Temperatura e proximidade:** Quao "quente" (comunidade, significado, pertencimento) e quao "proximo" (expert perto do aluno)?

**Passo 4 — Maturacao do expert:** Avaliar se o tipo de produto faz sentido pra maturacao atual do expert. Alertar se mismatch.

**Passo 5 — As 3 Camadas:**
- Camada 1 (O que e): formato, nome, proposta em 1 frase
- Camada 2 (O que faz): promessa, resultado, importancia na jornada, recorte da persona
- Camada 3 (Como faz): estrutura, logica de entrega, experiencia, entregaveis COM logica de cada um

**Passo 6 — Proposta de valor:** Responder as 3 perguntas (vale a pena? funciona? por que esse?) usando template.

**Passo 7 — Matriz de beneficios:** Exercicio "e dai?" pra CADA entregavel e CADA caracteristica relevante.

**Passo 8 — Pricing:** Usar os 5 fatores (tipo, mercado, resultado, capacidade de pagamento, posicionamento) + benchmark do PRD (Fase 1).

**Passo 9 — Definicoes comerciais:** Fechar todos os parametros (modelo de entrega, formato, individual/grupo, duracao, temperatura, proximidade, preco, condicoes, agenda).

**Passo 10 — Cartao de Identidade:** Consolidar TUDO no template final (ver KB secao 8).

### Step 3: Quality Gate QG-CC-008

Protocolo de 5 passos:

1. **APRESENTAR** o Cartao de Identidade completo
2. **PERGUNTAR** "Isso bate? Esse produto e vendavel como esta?"
3. **LOOP DE DEBATE** — ajustar ate satisfeito
4. **APROVACAO EXPLICITA** — expert diz "fechou"
5. **HANDOFF** — passar pra Fase 8 (review-finalize)

---

## Veto Conditions

- VETO se pular qualquer um dos 10 passos
- VETO se proposta de valor nao responde as 3 perguntas
- VETO se entregaveis listados sem logica ("por que isso existe no produto?")
- VETO se pricing definido sem os 5 fatores
- VETO se cartao de identidade incompleto
- VETO se expert nao aprovou explicitamente

---

## Error Handling

| Cenario | Acao |
|---------|------|
| Expert nao sabe precificar | Guiar pelos 5 fatores + benchmark. Nunca dar preco — ajudar a CHEGAR no preco |
| Mismatch maturacao/tipo | Alertar: "Voce ta em fase X. Esse tipo pode ser cedo. Quer ajustar?" |
| Faltam dados de benchmark | Informar gap. Sugerir pesquisa complementar |
| Expert quer pular passos | Explicar que cada passo alimenta o proximo. Propor versao rapida, nao pular |
| Cartao de identidade incompleto | Listar gaps. Nao entregar incompleto |

---

**Task Status:** Ready for Production
