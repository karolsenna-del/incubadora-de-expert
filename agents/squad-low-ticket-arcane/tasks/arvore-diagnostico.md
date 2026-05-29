---
task: "Arvore de Diagnostico — Walk Estruturado"
responsavel: "@lt-diagnostician"
atomic_layer: "task"
Entrada: "Metricas reais coletadas (Funil 3X + Connect Rate)"
Saida: "Caminho percorrido + diagnostico com problema catalogado"
execution_type: "interactive"
---

# Task: Árvore de Diagnóstico

**Task ID:** squad-low-ticket-arcane/arvore-diagnostico
**Owner:** lt-diagnostician

---

## Conceito

Walk estruturado pelos thresholds, na ordem certa. Variante mais granular do `*sos`.

> "Não analisa página enquanto criativo não encaixar. Sequência rígida."

---

## Árvore Completa

```
PASSO 0 — DADOS COLETADOS?
├── NÃO → "Me traga as métricas"
└── SIM → continua

PASSO 1 — Connect Rate < 75%?
├── SIM → P7 (PÁGINA TÉCNICA)
│        Trocar hospedagem (Rochost)
│        Otimizar imagens (TinyPNG, WebP Express)
│        WP Rocket cache
│        STOP — não analisa mais nada antes de resolver
└── NÃO → continua

PASSO 2 — CVP > 4% do produto?
├── SIM → CRIATIVO
│        ├── 15-20+ criativos testados? → P3 (assertividade baixa) — choque criativo
│        ├── CVP barato mas zero compra? → P2 (clickbait)
│        ├── 1-2 criativos só? → P26 (alegria pendurada)
│        ├── Headline confusa? → P5 (Copy Dilma) → @copywriter
│        ├── IA/animação/sem rosto? → P6 (formato errado)
│        └── default: P1 — criar mais criativos variando formato (F1)
│        STOP — não mexe em página antes de resolver criativo
└── NÃO → CVP OK, continua

PASSO 3 — Custo Finalização > 23% do produto?
├── SIM → PÁGINA
│        ├── Headline genérica/Copy Dilma? → P5 + AP1 → @copywriter
│        ├── Oferta aberta sem mecanismo? → P9 → @strategist
│        ├── Mockups falsos/Imagem ilustrativa? → @page-master fix
│        ├── Pixel não marca? → P19 → @traffic-ops checklist técnico
│        └── default: P8 — teste AB headline
└── NÃO → Final OK, continua

PASSO 4 — CPA > 45% do produto?
├── SIM → CHECKOUT / PREÇO / OFERTA
│        ├── Métricas encaixam em ticket diferente? → P17 (testar preço)
│        ├── Sem esteira (OB/Upsell)? → P18 (após validação)
│        ├── Plataforma ruim? → P21 (Hotmart > Ticto > Kiwify)
│        └── default: testar preço, verificar checkout
└── NÃO → CPA OK, continua

PASSO 5 — Tudo OK mas ROI < 2?
├── PREÇO baixo → P17 (testar maior)
├── ESTEIRA incompleta → P18 (OB1 → OB2 → Upsell na Fase Verde)

PASSO 6 — Tudo OK mas SEM vendas?
├── Volume baixo (pixel virgem, ~100 eventos pra começar)
├── Verba insuficiente (45% do produto/dia mínimo)
└── Aguardar mais 2-3 dias

PASSO 7 — Antes de qualquer kill, JANELA COMPLETA:
├── Período MÁXIMO (ROI geral)
├── Últimos 7 dias
├── Últimos 3 dias
└── ROI > 2 no máximo = SEGURA mesmo com 3d ruins

PASSO 8 — Comportamento (P22-P26)
├── Esperar bênção → "William nunca pergunta"
├── Medo de escalar → "Falta de decisão custa dinheiro"
├── Overanalyze → "Página pronta, roda"
├── Apaixonar oferta → "Tchau, deleta, faz outra"
└── 1 criativo só → "Alegria pendurada"

PASSO 9 — Cluster debug (situações especiais)
├── Métricas boas + Insta poucos seguidores → P15 Falso Funil 3X
├── ROI alto inicial cai pra frio → P16 Demanda Reprimida
├── Vendas iniciais não escalam → P3 Falsa Validação
└── 3-5 dias queda sem causa → P14 Turbulência (ESPERAR, não desligar)
```

---

## Output

```yaml
arvore_walk:
  passo_atual: 3 (exemplo)
  passos_concluidos: [1, 2]
  diagnostico_acumulado: ["Connect Rate OK", "CVP OK"]
  problema_identificado: "P8 — Página não converte"
  fix_pattern: "F3"
  encaminhamento: "@lt-page-master"
  acao_proxima: "Teste AB de headline"
```

---

## Handoff

Conforme passo onde parou, encaminha pro agente correspondente:

| Passo | Agente |
|-------|--------|
| 1 (Connect Rate) | `@lt-page-master` |
| 2 (Criativo) | `@lt-creative-director` (ou `@lt-copywriter` se Copy Dilma) |
| 3 (Página) | `@lt-page-master` (ou `@lt-copywriter`) |
| 4 (CPA) | `@lt-strategist` (preço) ou `@lt-traffic-ops` (plataforma) |
| 7 (Janela) | Você mesmo (varredura) |
| 8 (Comportamento) | Você confronta direto |
| 9 (Cluster) | `@lt-traffic-ops` |

---

**Task Status:** Production Ready
