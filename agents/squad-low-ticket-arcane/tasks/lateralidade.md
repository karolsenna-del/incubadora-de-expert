---
task: "Lateralidade — Proxima Oferta Paralela"
responsavel: "@lt-strategist"
atomic_layer: "task"
Entrada: "Oferta atual atingiu Verba do ROI, validada e rodando"
Saida: "Brief da proxima oferta + atualizacao da Planilha do Norte"
execution_type: "interactive"
---

# Task: Lateralidade — Próxima Oferta Paralela

**Task ID:** squad-low-ticket-arcane/lateralidade
**Owner:** lt-strategist

---

## Conceito

> "Lateralidade é não esteira. Lateralidade é uma do lado da outra. Esteira é uma atrás da outra."

Cada produto LT tem teto (Verba do ROI). Pra crescer, **empilhar 3-5 ofertas em paralelo** — não forçar verba numa só.

> "Você vai ficar viciado em criar produtinhos low-ticket."

---

## Quando Acionar

- Atingiu Verba do ROI da oferta atual
- Oferta validada e rodando há mais de 30-60 dias
- Quer ESCALAR mas atingiu teto vertical

---

## Lateralidade DE OFERTA vs DE PRODUTO

### Lateralidade de Oferta (escala horizontal real)

Cada produto **independente** dos outros:
- Próprio tráfego
- Próprio funil
- Próprias métricas
- Próprio pixel + conta de anúncio + domínio

**Exemplo:** ChatGPT R$67 + Canva R$67 + Instabil R$67 + -1kg R$67 — cada um seu funil.

### Lateralidade de Produto (variação)

**Mesmo produto** com **múltiplas ofertas**:
- Diferentes ângulos/headlines
- Mesma área de membro, mesmo webhook
- Mesmo entregável

**Exemplo (Lencinho Umedecido):**
- Oferta 1: "Pacote para o bebê"
- Oferta 2: "Pacote para o pai trocar fralda"
- Mesmo lencinho, embalagens diferentes.

---

## Workflow

### Step 1 — Olhar pro MECANISMO ÚNICO (não nicho)

> "Eu não crio produto olhando pro nicho. Olho pro mecanismo único."

Sua habilidade core já está validada na oferta atual. Que OUTRO produto LT pode usar essa habilidade?

**Exemplo Maxxima:**
- Mecanismo: Canva
- Produtos LT: cardápio restaurante, atividade autismo, página de venda, packs prontos, bordado pra máquina

### Step 2 — Aplicar Pirâmide de Maslow

Ofertas que vendem mais (ordem):
1. Dinheiro
2. Saúde
3. Relacionamento
4. Outras

### Step 3 — EDI da Nova Persona

Mesmo workflow do `tasks/edi-completo.md`:
- 3 perguntas
- Ruminacões Score 4-5
- Mas pra DOR diferente

### Step 4 — Aplicar `tasks/new-offer.md` Completo

Repetir Fase 0 (16 dias):
- Pneu furado
- Tipo de perpétuo
- Mecanismo único
- EDI
- Máquina de Nomes
- Headline 3 partes
- Página 14 blocos
- 10 criativos PRSA

> "Cara, em 16 dias essa oferta tem que nascer, o processo tem que ser rápido."

### Step 5 — Atualizar Planilha do Norte

Adicionar nova oferta na Planilha:

| Produto | Tráfego/dia | ROI | Faturamento | Lucro/dia | Lucro/mês |
|---------|-------------|-----|-------------|-----------|-----------|
| Oferta 1 (atual) | R$3.000 | 2.0 | R$6.000 | R$3.000 | R$90.000 |
| **Oferta 2 (nova)** | R$1.000 | 2.0 | R$2.000 | R$1.000 | R$30.000 |
| **TOTAL** | **R$4.000** | — | **R$8.000** | **R$4.000** | **R$120.000** |

→ `tasks/planilha-norte.md` pra simulação completa.

---

## Quantidade Ideal

| Empilhamento | Lucro/mês |
|--------------|-----------|
| 3 ofertas | R$50-85k |
| 4-5 ofertas | R$85-144k |

---

## Anti-Padrões

| AP | Antídoto |
|----|----------|
| Tentar escalar verba acima do teto | Respeitar — crescer via lateralidade |
| Criar oferta sem mecanismo único distinto | Mesma habilidade, dor diferente |
| Mesma BM/conta/pixel pras 2 ofertas | TUDO isolado: 1 conta + 1 pixel + 1 domínio por oferta |
| Tentar fazer 2 ofertas ao mesmo tempo | 1 por vez (16 dias cada) |
| Apaixonar pela oferta atual | Tchau, próxima |

---

## Estratégia de Crescimento

```
Mês 1-2: Validar oferta 1 (Fase Azul → Verde)
Mês 3: Atingir Verba do ROI oferta 1 → criar oferta 2 (16 dias)
Mês 4-5: Validar oferta 2
Mês 6: Atingir teto oferta 2 → criar oferta 3
Mês 7-12: 3-5 ofertas rodando paralelo
Meta: R$85-144k lucro/mês
```

---

## Cases Reais

| Case | Lição |
|------|-------|
| **4 produtos R$144k/mês** (Etapa 6 ILT) | Planilha do Norte real |
| **3 produtos R$85k/mês** (Etapa 6) | Demo ao vivo |
| **Aluna 8 ideias** | "3 dando certo = R$50k/mês" |
| **Lencinho Umedecido** | 1 produto, 2 ofertas (bebê + pai) |
| **Familia Checa** | 7 LTs própria empresa + 5 em outra = R$100k/mês |

---

## Mindset (Etapa 6)

> "Você vai ficar viciado em criar produtinhos low-ticket que cada um coloca 20-45 mil de lucro/mês no seu bolso."

> "É leve esse processo. Fica leve."

> "Não é 'preciso fazer um produto foda'. É 'empilhar várias ofertas modestas'."

---

## Output

```yaml
nova_oferta_lateral:
  numero: 2 (segunda oferta do empilhamento)
  oferta_atual_teto: R$3.000/dia
  mecanismo_unico: "{mesmo da oferta 1 ou nova habilidade?}"
  nova_dor_lucrativa: "{}"
  nova_persona: "{}"
  pirâmide_maslow_categoria: "Dinheiro|Saúde|Relacionamento|Outras"
  cronograma:
    edi: 1 dia
    headline: 1 dia
    pagina: 5 dias
    produto: 5 dias
    criativos: 4 dias
    total: 16 dias
  planilha_norte_atualizada: ✓
```

---

## Handoff

→ `tasks/new-offer.md` — Fase 0 da nova oferta
→ `tasks/planilha-norte.md` — atualizar simulação

---

**Task Status:** Production Ready
