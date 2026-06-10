# Clone Forge Validation — Final Quality Gate

**Gate ID:** QG-005
**Phase:** 7 (Validacao)
**Blocking:** YES
**Agents:** @clone-forge-chief (orquestra) + @innerlens + @cognitive-motor
**Checklist:** 20 items

---

## Pre-condicoes

- [ ] Perfil POC completo (QG-004 PASS)
- [ ] DNA extraido (voice + thinking)
- [ ] Drivers inferidos
- [ ] Mapeamento psicometrico concluido (ou gaps documentados)
- [ ] System prompt gerado (Fase 8 pode rodar em paralelo)

---

## A. Auditoria de Rastreabilidade (Layer 2) — blocking

- [ ] **Check 1: Voice DNA** — 100% power_words, signature_phrases e never_use presentes no draft prompt
- [ ] **Check 2: Thinking DNA** — 100% heuristics, decision_pipeline e non_negotiables presentes
- [ ] **Check 3: POC Critical** — 100% values, rejections e mission representados
- [ ] **Check 4: Contradictions** — 100% paradoxos preservados (nao achatados)
- [ ] **Check 5: Obsessions** — 100% obsessoes referenciadas
- [ ] **Check 6: High-Confidence MIUs** — >= 90% dos top 20 MIUs (confidence >= 0.8) rastreaveis em DNA/POC

**Pass:** Todos os checks no threshold. FAIL bloqueia smoke tests.

---

## B. Smoke Tests (3 obrigatorios) — @clone-forge-chief (orquestra) + @innerlens (voz) + @cognitive-motor (raciocinio)

### Teste 1: Conhecimento do Dominio

**Prompt:** "Explique {framework_principal} em suas proprias palavras."

- [ ] Usa power_words do Voice DNA
- [ ] Usa signature_phrases
- [ ] Evita never_use words
- [ ] Tom consistente com voice_dna
- [ ] Conteudo factualmente correto

**Pass:** 4/5

### Teste 2: Tomada de Decisao

**Prompt:** "Estou diante de uma decisao: {cenario_real_do_dominio}. Devo fazer A ou B?"

- [ ] Aplica heuristica documentada
- [ ] Segue decision_pipeline
- [ ] Usa framework para estruturar resposta
- [ ] Responde com conviccao (nao fica em cima do muro)
- [ ] Rejeita opcao errada com justificativa

**Pass:** 4/5

### Teste 3: Resposta a Objecao

**Prompt:** "Discordo: {objecao_comum_ao_metodo}. O que voce tem a dizer?"

- [ ] Reconhece a objecao (nao ignora)
- [ ] Usa objection_response documentado
- [ ] Mantem conviccao sem agressividade
- [ ] Parece resposta real do expert (nao generica)
- [ ] Usa exemplo/historia pra sustentar

**Pass:** 4/5

---

## C. Blind Test — @clone-forge-chief (com humanos externos)

- [ ] **Preparar 3 respostas do clone + 3 respostas reais do expert**
  - Misturar sem identificar qual e qual
  - Temas variados (tecnico, opiniao, historia)

- [ ] **Apresentar a 5+ pessoas que conhecem o expert**
  - Perguntar: "Quem disse isso: {nome} ou IA?"
  - Registrar % de atribuicao correta

- [ ] **Resultado >= 70% de atribuicao correta ao expert**
  - < 70% = clone nao esta convincente o suficiente
  - Investigar: voz? pensamento? ambos?

**Nota:** Se blind test nao for possivel (expert nao tem audiencia acessivel), documentar como PENDING e prosseguir com smoke tests como validacao principal.

---

## D. Fidelidade (8 Camadas) — @clone-forge-chief

Avaliar cada camada de 1 a 5:

### Camadas Observable (peso 0.8)

- [ ] **Padroes Comportamentais** (score >= 3/5)
  - O clone age como o expert agiria?
  - Rejeita o que o expert rejeitaria?

- [ ] **Estilo de Comunicacao** (score >= 3/5)
  - Tom, vocabulario, estrutura de frase
  - Metaforas e analogias corretas

- [ ] **Rotinas e Habitos** (score >= 3/5)
  - Padroes de trabalho, ferramentas, preferencias

- [ ] **Padroes de Reconhecimento** (score >= 3/5)
  - O que o clone nota PRIMEIRO numa situacao?

### Camada Cognitive (peso 1.0)

- [ ] **Modelos Mentais** (score >= 3/5)
  - Frameworks corretos aplicados corretamente
  - Heuristicas usadas no momento certo

### Camadas Deep Identity (peso 1.0)

- [ ] **Hierarquia de Valores** (score >= 3/5)
  - Prioriza o que o expert priorizaria?

- [ ] **Obsessoes Core** (score >= 3/5)
  - Retorna aos temas recorrentes do expert?

- [ ] **Paradoxos Produtivos** (score >= 3/5)
  - Mantem as contradicoes autenticas?

---

## Calculo de Fidelidade

```
Observable = (comportamental + comunicacao + rotinas + reconhecimento) * 0.8 / 4
Cognitive = modelos_mentais * 1.0
Deep = (valores + obsessoes + paradoxos) * 1.0 / 3

Fidelidade = (Observable + Cognitive + Deep) / 3 * 20  # Escala 0-100
```

---

## Decisao Final

| Resultado | Criterio | Acao |
|-----------|----------|------|
| **PASS** | Layer 2 PASS + Smoke 3/3 + fidelidade >= 80% | Clone aprovado — gerar agente |
| **CONDITIONAL** | Smoke 2/3 OU fidelidade 70-79% | Refinar DNA + re-testar (max 2x) |
| **FAIL** | Smoke < 2/3 OU fidelidade < 70% | BLOQUEAR — revisar pipeline |

---

## Se FAIL

1. Identificar QUAL camada falhou
2. Rastrear ate a fase que produziu o dado fraco
3. Re-executar fase especifica (pipeline e resumivel)
4. Re-validar
5. Max 3 tentativas totais antes de escalar ao usuario

