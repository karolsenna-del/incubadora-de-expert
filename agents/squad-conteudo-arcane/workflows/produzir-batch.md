---
workflow: "Produzir Batch"
versao: "1.0.0"
fases: 4
duracao_estimada: "3-6h pra batelada de 5-7 posts"
quando_usar: "Expert quer produzir N posts da semana de uma vez (batelada)"
output_principal: "N pastas posts/{slug}/ com teoria + roteiro + producao"
---

# Workflow: Produzir Batch — Batelada de N Posts

**Workflow ID:** produzir-batch
**Versão:** 1.0.0

---

## Quando Usar

Use este workflow quando:
- Expert quer produzir múltiplos posts (3-7) em batelada
- Cadência ideal de 3-7 posts/semana
- Otimizar tempo: gravar/diagramar várias vezes de uma vez, postar 1/dia

**Princípio:** batelada é o jeito profissional. Hannah, Elias, Euriler — todos defendem.

---

## Pipeline

```
═══════════════════════════════════════════════════════════════
PRODUZIR BATCH — Batelada de N Posts
═══════════════════════════════════════════════════════════════

FASE 3 (BATCH): TEMAS DA SEMANA (Iris)
  ↓ Expert escolhe N temas do pool de uma vez
  ↓ Output: lista de N temas cravados
  ↓ Duracao: 10-20 min
  ↓
LOOP PARA CADA TEMA (N iteracoes):
  ↓
  FASE 4: CRIAR TEORIA (Sage)
    ↓ Cada tema → teoria.md propria
    ↓ Duracao: 15-30 min por tema (pesquisa interna mais rapida em batelada)
    ↓
  FASE 5: ROTEIRIZAR (Rico)
    ↓ Cada tema → roteiro.md proprio
    ↓ Loop de feedback com expert
    ↓ Duracao: 15-30 min por roteiro (+ iteracoes)
    ↓
  FASE 6: ORIENTAR PRODUÇÃO (Mack)
    ↓ Lâminas/Direcão por post
    ↓ Duracao: 5-10 min por post
  ↓
ENTREGA: N pastas posts/{slug}/ completas
  ↓
  ↓ Expert executa producao em batelada também:
  ↓ - Carrossel: gera todas imagens GPT seguidas, monta todos Canva
  ↓ - Reels: grava todos no mesmo dia, edita todos seguidos
```

---

## FASE 3 (BATCH): Temas da Semana

**Responsável:** @iris-pesquisador

### Diferença pra Workflow Single

Em vez de escolher 1 tema, expert escolhe N.

**Steps:**

1. Iris lê pool atualizado
2. Aplica filtros nos candidatos do pool
3. Apresenta 8-15 candidatos pra expert escolher N
4. Expert escolhe 3-7 temas que quer produzir na batelada
5. Iris gera contexto.yaml pra cada (slug, categoria, moral, virais)

**Critério de balanceamento (recomendação):**
- 2-3 temas FORTES do pool (alta dor/interesse, alto alcance esperado)
- 1-2 temas MÉDIOS (variar)
- 0-1 tema QUENTE/EMERGENTE (testar)

```
Beleza, batelada. Quantos posts voce quer produzir nessa rodada?
(3-7 e ideal)

Vou apresentar 12-15 candidatos pra voce escolher {N}.

Recomendo balanceamento:
- 60-70% temas FORTES (alta probabilidade)
- 20-30% MEDIOS (variar)
- 0-10% QUENTES (testar)

Bora?
```

### Output

Lista de N posts cravados:
```yaml
batelada_data: "{YYYY-MM-DD}"
total_posts: {N}
posts:
  - slug: "{slug1}"
    tema: "..."
    categoria: "..."
    formato_alvo: "..."
  - slug: "{slug2}"
    ...
```

---

## FASES 4, 5, 6: Loop por Tema

Pra cada tema da lista, executar pipeline da workflow `produzir-post`:

```
Pra cada tema da batelada:
  - Sage cria teoria.md (task: criar-teoria.md → pesquisa-interna → pesquisa-externa → amarracao-lentes)
  - Rico captura tom (so 1x — reusa em todos) + roteiriza + loop refinamento
    (tasks: capturar-tom.md → roteirizar.md → refinar-roteiro.md)
  - Mack gera laminas/direcao
    (tasks: gerar-laminas-carrossel.md OU orientar-reels.md)
```

**Tasks executadas no loop (por post):**

| Task | Responsável | Output |
|------|-------------|--------|
| `criar-teoria.md` (master) | Sage | teoria.md |
| `pesquisa-interna.md` | Sage | seção pesquisa interna |
| `pesquisa-externa.md` | Sage | seção pesquisa externa |
| `amarracao-lentes.md` | Sage | seções tese + raciocínio + leque hooks |
| `capturar-tom.md` | Rico | perfil-tom-de-voz.md (1x, depois reusa) |
| `roteirizar.md` | Rico | roteiro.md |
| `refinar-roteiro.md` | Rico | iterações até aprovação |
| `gerar-laminas-carrossel.md` | Mack | laminas-carrossel.md (se carrossel) |
| `orientar-reels.md` | Mack | direcao-reels.md (se reels) |

### Otimizações da Batelada

**Pesquisa interna mais rápida:**
- Sage pode fazer pesquisa interna em sessão única no início (não 1 por tema)
- Expert despeja conhecimento sobre TODOS os temas em sequência
- Sage organiza por tema depois
- Economiza 20-30% do tempo

**Pesquisa externa em paralelo:**
- Sage pode fazer pesquisa externa por tema em paralelo (independentes)
- Engenharia reversa pode ser feita em batch (varios temas, varios virais)

**Tom de voz (1x só):**
- Rico captura tom UMA VEZ no início (perfil-tom-de-voz.md)
- Reusa em todos os N roteiros

**Iteração:**
- Rico pode mostrar v1 dos N roteiros pro expert revisar TUDO de uma vez
- Loops de feedback ficam mais eficientes (expert ve padroes)

---

## ENTREGA

Após batelada completa:

```
Batelada pronta. {N} posts:

1. {slug1} — {tema1} — {formato}
   teoria.md ✓ / roteiro.md ✓ / laminas|direcao ✓
2. {slug2} — ...
[...]

Pronto pra producao. Recomendo:

CARROSSEIS:
- Bloco unico de 2-3h gerando todas as imagens no GPT
- Depois 2-3h montando todos no Canva
- Total: 4-6h pra 5-7 carrosseis

REELS:
- Marca um dia de gravacao (3-4h)
- Grava todos no mesmo cenario e tom (eficiente)
- Edita em CapCut depois (1h por reels)

POSTAGEM:
- 1 post por dia (ou conforme tua estratégia)
- Marca lembrete pra Aria analisar depois (~7 dias após cada post)

Bora pro proximo workflow ou pausa por aqui?
```

---

## Tempo Total Estimado

Pra batelada de 5 posts:

- Fase 3: 15-20 min
- Fase 4 (5 temas × 20-30 min): 1h40-2h30
- Fase 5 (5 roteiros × 15-30 min + iteracoes): 1h15-3h
- Fase 6 (5 produções × 5-10 min): 25-50 min

**Total: 3h30-6h30 pra 5 posts prontos.** Compensa MUITO vs fazer 1 por dia (5x 1h = 5h SEM economia das otimizações).

---

## Quality Gates

Cada post da batelada passa pelos mesmos quality gates do workflow single:

- QG-SCA-002: tema cravado
- QG-SCA-003: teoria pronta
- QG-SCA-004: roteiro aprovado

---

**Workflow Status:** Ready for Production
