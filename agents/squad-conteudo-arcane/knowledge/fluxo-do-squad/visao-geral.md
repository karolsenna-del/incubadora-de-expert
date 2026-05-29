# Visão Geral do Fluxo do Squad

**Aplicação:** Vox usa pra orientar expert. Agents usam pra entender onde estão no fluxo.

---

## Os 5 Passos + Análise

```
═══════════════════════════════════════════════════════════════
SETUP INICIAL (base pontual — roda 1x, revisita quando necessário)
═══════════════════════════════════════════════════════════════

PASSO 1: DEFINIR FORMATOS
  → Quem: Iris
  → O que: cardápio visual + 1-3 formatos cravados
  → Output: seção FORMATOS de base-inicial.md
  
PASSO 2: POOL DE TEMAS
  → Quem: Iris
  → O que: pesquisa profunda + 15-30 temas categorizados
  → Output: seção POOL DE TEMAS de base-inicial.md

═══════════════════════════════════════════════════════════════
ROTINA POR POST (executa pra cada novo conteúdo)
═══════════════════════════════════════════════════════════════

PASSO 3: TEMA DO POST
  → Quem: Iris + Expert decide
  → O que: candidatos do pool + filtros + expert crava 1
  → Output: contexto.yaml + slug do post

PASSO 4: CRIAR TEORIA  ★ coração do squad
  → Quem: Sage
  → Como: 3 sub-passos (interna → externa → amarração)
  → Output: teoria.md (tese + linha raciocínio + leque hooks)

PASSO 5: ROTEIRIZAR
  → Quem: Rico
  → Como: capturar tom + roteirizar + loop refinamento
  → Output: roteiro.md (Hook→Intro→Conteúdo→CTA+Posicionamento)

PASSO 6: PRODUZIR (orientação)
  → Quem: Mack
  → Como: lâminas carrossel OU direção reels
  → Output: laminas-carrossel.md OU direcao-reels.md
  → EXPERT EXECUTA produção física

═══════════════════════════════════════════════════════════════
PÓS-PUBLICAÇÃO (sob demanda)
═══════════════════════════════════════════════════════════════

ANÁLISE
  → Quem: Aria
  → O que: diagnóstico cirurgico + comentários + recomendações
  → Output: relatorio.md com insights pra Iris e Rico
```

---

## Decisões No Fluxo

### Decisão 1 — Single Post vs Batelada

**Single (workflow `produzir-post`):**
- 1 post por vez
- Mais lento
- Bom pra começar OU produzir post urgente

**Batelada (workflow `produzir-batch`):**
- 3-7 posts em sequência
- Mais eficiente (otimizações de tempo)
- Cadência ideal: 1/dia → batelada semanal

### Decisão 2 — Formato

Expert decide:
- **Carrossel** (escreve, monta no Canva)
- **Reels** (grava, edita)
- **Ambos** (mesma teoria → 2 formatos)

### Decisão 3 — Quando Revisitar Base

Setup inicial roda 1x. Revisita quando:
- Formatos atuais estagnaram (3+ posts seguidos baixos)
- Pool de temas esvaziou
- Mudança de nicho/posicionamento

Ver `quando-revisita-base.md` pra detalhes.

---

## Fluxo Visual

```
┌─────────────────────────────────────────────────────────────────┐
│                       SETUP INICIAL                              │
│                                                                  │
│  Expert chega zerado                                             │
│         ↓                                                        │
│  PASSO 1: Definir Formatos (Iris)                                │
│         ↓                                                        │
│  PASSO 2: Pool de Temas (Iris)                                   │
│         ↓                                                        │
│  ✓ base-inicial.md pronto                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       ROTINA POR POST                            │
│                                                                  │
│  PASSO 3: Tema do Post (Iris + Expert)                           │
│         ↓                                                        │
│  PASSO 4: Criar Teoria (Sage) ★ CORAÇÃO                          │
│      4.1 Pesquisa Interna → 4.2 Externa → 4.3 Amarração          │
│         ↓                                                        │
│  PASSO 5: Roteirizar (Rico)                                      │
│      Capturar tom (1x) → Roteirizar → Loop refinamento           │
│         ↓                                                        │
│  PASSO 6: Produzir orientação (Mack)                             │
│      Lâminas carrossel OU Direção reels                          │
│         ↓                                                        │
│  ✓ Roteiro pronto + orientação produção                          │
│         ↓                                                        │
│  EXPERT EXECUTA: grava/diagrama/posta                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       PÓS-PUBLICAÇÃO                             │
│                                                                  │
│  Aria analisa (sob demanda)                                      │
│      Métricas + identificação + comentários                      │
│         ↓                                                        │
│  ✓ Relatório com insights estratégicos                           │
│         ↓                                                        │
│  EXPERT decide: escalar / refazer / reaproveitar / ignorar       │
│         ↓                                                        │
│  Insights retroalimentam Iris (pool) e Rico (próximo roteiro)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cadência Ideal

**Setup Inicial:** 1x (30-50 min total)

**Por Post:**
- Tempo Vox→Mack: 45-90 min (single)
- Tempo total expert (incluindo produção): 2-4h carrossel / 1-3h reels

**Batelada (5 posts/semana):**
- Tempo squad: 3-6h
- Produção (expert): 5-10h
- Postagem: 1/dia × 7 dias

**Análise:**
- Individual: 15-25 min
- Batch: 30-45 min
- Frequência sugerida: a cada 5-10 posts

---

## Inputs Externos

Esse squad NÃO cria, apenas USA:

1. **Núcleo de Influência do Expert**
   - Vem de squad de posicionamento (futuro/separado)
   - Sage capta no Passo 4 (pesquisa interna)
   - Crenças, identidade, inimigo, apresentação magnética

2. **Tom de Voz**
   - Capturado por Rico no 1º roteiro (perfil-tom-de-voz.md)
   - Reusa em todos seguintes

3. **Fontes do Expert (opcionais)**
   - Livros, transcrições, podcasts que expert tenha
   - Sage absorve quando expert oferece

---

## Saídas do Squad

Em `docs/producao-conteudo/{expert}/`:

```
├── base-inicial.md                    (Setup Inicial)
├── perfil-tom-de-voz.md               (1x — captado por Rico)
├── posts/
│   └── {slug-post}/
│       ├── context.yaml               (Iris — Passo 3)
│       ├── teoria.md                  (Sage — Passo 4)
│       ├── roteiro.md                 (Rico — Passo 5)
│       ├── laminas-carrossel.md       (Mack — Passo 6 se carrossel)
│       └── direcao-reels.md           (Mack — Passo 6 se reels)
└── analises/
    └── {data}/
        └── relatorio.md               (Aria)
```

---

## Princípios Master Do Squad

1. **Expert decide.** Squad sugere. Squad não decide tema/formato/aprovação por expert.

2. **Cada agente fica no seu domínio.** Iris não escreve roteiro. Rico não pesquisa virais. Mack não diagnostica métricas.

3. **Pesquisa interna do expert vem antes da externa.** Sage sempre extrai primeiro.

4. **Validação humana > validação automática.** Expert revisa em todos os pontos críticos.

5. **Autocontido.** Squad funciona sem dependências externas (KB embarcada).

6. **Princípios não-negociáveis.** Os 8 princípios do roteiro são lei.
