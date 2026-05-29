---
workflow: "Produzir Post"
versao: "1.0.0"
fases: 4
duracao_estimada: "45-90 min (depende de iteracoes)"
quando_usar: "Expert ja tem base-inicial.md e quer produzir 1 post"
output_principal: "docs/producao-conteudo/{expert}/posts/{slug}/{teoria.md + roteiro.md + laminas/direcao}"
---

# Workflow: Produzir Post — Pipeline Completo de 1 Post

**Workflow ID:** produzir-post
**Versão:** 1.0.0

---

## Quando Usar

Use este workflow quando:
- Expert tem `base-inicial.md` (formatos + pool de temas)
- Quer produzir 1 post completo (não batelada)

**Cadência:** roda toda vez que quer produzir um post novo.

---

## Pipeline (4 Fases)

```
═══════════════════════════════════════════════════════════════
PRODUZIR POST — Pipeline de Rotina
═══════════════════════════════════════════════════════════════

FASE 3: TEMA DO POST (Iris)
  ↓ Task: escolher-tema-post
  ↓ Output: 1 tema cravado (slug + categoria + moral)
  ↓ Duracao: 5-15 min
  ↓ Quality Gate: QG-SCA-002 (expert bateu martelo)
  ↓
FASE 4: CRIAR TEORIA (Sage)
  ↓ Task: criar-teoria (master) → pesquisa-interna → pesquisa-externa → amarracao-lentes
  ↓ Output: teoria.md completo + leque de 5-7 hooks
  ↓ Duracao: 20-40 min
  ↓ Quality Gate: QG-SCA-003 (teoria pronta)
  ↓
FASE 5: ROTEIRIZAR (Rico)
  ↓ Tasks: capturar-tom (1x) → roteirizar → refinar-roteiro (loop)
  ↓ Output: roteiro.md aprovado pelo expert
  ↓ Duracao: 15-30 min (+ iteracoes)
  ↓ Quality Gate: QG-SCA-004 (expert aprovou)
  ↓
FASE 6: ORIENTAR PRODUÇÃO (Mack)
  ↓ Task: gerar-laminas-carrossel OU orientar-reels
  ↓ Output: laminas-carrossel.md OU direcao-reels.md
  ↓ Duracao: 5-10 min
  ↓
ENTREGA FINAL:
  ↓ Roteiro pronto + orientacao de producao
  ↓ Expert executa producao (gera imagens/grava/edita)
  ↓ Pos-postagem: Aria analisa (workflow analisar-performance)
```

---

## FASE 3: TEMA DO POST

**Responsável:** @iris-pesquisador
**Task:** `escolher-tema-post.md`

### Steps Resumidos

1. Iris lê pool atualizado de `base-inicial.md`
2. Aplica 3 filtros (DNA + Interseção A∩B + Moral clara)
3. Apresenta 3-5 candidatos + (opcional) tema do momento
4. Descreve todos com ângulo + Iris pode trazer visão própria
5. Expert bate o martelo em 1 tema (Iris não decide)
6. Gera slug + contexto.yaml

### Quality Gate: QG-SCA-002

- [ ] Expert disse explicitamente "vamos com este"
- [ ] Slug do post gerado
- [ ] Pasta `posts/{slug}/` criada

### Handoff: → Sage

---

## FASE 4: CRIAR TEORIA

**Responsável:** @sage-teorico
**Task master:** `criar-teoria.md`

### Sub-passos

**4.1 — Pesquisa Interna** (`pesquisa-interna.md`)
- Sage entrevista expert com 6 perguntas-chave
- Captura big ideas, casos, conceitos, crença, argumentos, fontes
- Devolve estruturado pra validar

**4.2 — Pesquisa Externa** (`pesquisa-externa.md`)
- Pergunta fontes do expert
- Pesquisa pública densa (posts, artigos, livros, papers, vídeos, gringo)
- Engenharia reversa de 5-15 virais relevantes (transcreve se necessário)
- Extrai padrões

**4.3 — Amarração com 6 Lentes** (`amarracao-lentes.md`)
- Aplica 6 lentes (chama-atenção, raciocínio, tensão, narrativa, lógica, conteúdo notável)
- Consolida tese central em 1 frase
- Gera leque de 5-7 hooks com diversidade de gatilhos
- Define moral da história

### Quality Gate: QG-SCA-003

- [ ] Tese central definida em 1 frase
- [ ] Linha de raciocínio com 5 etapas
- [ ] Pesquisa interna + externa completas
- [ ] Mínimo 5 virais analisados (engenharia reversa)
- [ ] 6 lentes aplicadas
- [ ] Leque com 5-7 hooks
- [ ] Moral da história clara
- [ ] teoria.md salvo

### Handoff: → Rico

---

## FASE 5: ROTEIRIZAR

**Responsável:** @rico-roteirista
**Task master:** `roteirizar.md`

### Steps Resumidos

1. **Pré-passo:** Carregar `perfil-tom-de-voz.md` OU executar `capturar-tom.md` (1ª vez)
2. Coleta pré-roteiro (frases, padrões, evitações, crença, posicionamento)
3. Consulta KB embarcada (templates + swipe files)
4. Aplica estrutura macro: Hook → Intro Forte → Conteúdo → CTA + Posicionamento
5. Adapta ao formato (carrossel slide-a-slide OU reels fala+cena)
6. Anota direção pro Mack
7. Análise técnica
8. Apresenta v1
9. **Loop iterativo** (`refinar-roteiro.md`) até expert aprovar

### Quality Gate: QG-SCA-004

- [ ] Perfil de tom usado
- [ ] Coleta pré-roteiro feita
- [ ] Estrutura macro completa
- [ ] Hook com 3 camadas (verbal + visual + textual)
- [ ] 3+ elementos notáveis aplicados
- [ ] 2+ loopings em cadeia
- [ ] CTA específico de reconhecimento
- [ ] Expert disse explicitamente "pode produzir"
- [ ] roteiro.md salvo

### Handoff: → Mack

---

## FASE 6: ORIENTAR PRODUÇÃO

**Responsável:** @mack-produtor
**Task:** `gerar-laminas-carrossel.md` OU `orientar-reels.md`

### Steps Resumidos

Mack pergunta: carrossel, reels ou os 2?

**Se Carrossel:**
- Gera lâminas mastigadas (texto + sugestão visual + prompt GPT por slide)
- Orienta caminho A (GPT + Canva) ou B (squad de design)

**Se Reels:**
- Apresenta setup ideal (iPhone Pro 13+, modo cinema, contra luz, zoom 2x, mic)
- Apresenta fallback (começa com o que tem)
- Direção de gravação (cenário, postura, tom, cortes)
- Variação emocional ao longo
- Orientação de edição (CapCut passo a passo)
- Sugere reaproveitamento

**Se os 2:**
- Faz um, depois o outro
- Prioridade conforme expert decide

### Output

- `laminas-carrossel.md` (se carrossel)
- `direcao-reels.md` (se reels)
- Ambos (se os 2)

---

## ENTREGA FINAL

Output completo do workflow:

```
docs/producao-conteudo/{expert}/posts/{slug}/
├── teoria.md             (Sage)
├── roteiro.md            (Rico)
├── laminas-carrossel.md  (Mack — se carrossel)
└── direcao-reels.md      (Mack — se reels)
```

**Próximo passo:**

```
Pipeline completo. Roteiro pronto + orientacao de producao.

Voce executa producao (gera imagens GPT + monta Canva, OU
grava + edita CapCut).

Quando postar, manda os numeros pra Aria diagnosticar
(workflow analisar-performance).

Bora pro proximo post (workflow produzir-post) ou tá bom?
```

---

## Tempo Total Estimado

- Fase 3: 5-15 min
- Fase 4: 20-40 min
- Fase 5: 15-30 min (+ iterações)
- Fase 6: 5-10 min

**Total: 45-95 min do tema cravado ao roteiro+direção pronto.**

Produção (gravar/diagramar) por conta do expert.

---

**Workflow Status:** Ready for Production
