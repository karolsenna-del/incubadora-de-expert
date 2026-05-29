---
task: "Kit de Escala — Testar 8 Estruturas"
responsavel: "@lt-traffic-ops"
atomic_layer: "task"
Entrada: "Top 15 criativos validados (ROI >= 2.5) + Fase Azul OK"
Saida: "Kit de escala personalizado pra oferta (1+ estruturas que funcionam)"
execution_type: "interactive (15-30 dias)"
---

# Task: Kit de Escala — Testar 8 Estruturas

**Task ID:** squad-low-ticket-arcane/kit-escala
**Owner:** lt-traffic-ops

---

## Conceito

Cada oferta tem **afinidade com estruturas diferentes**. Testar uma a uma, descobrir o "kit personalizado" — pode ser 1 só, pode ser combinação.

> "Eu só preciso de UM formato de campanha pra fazer R$50k/mês."
> Caso William: SÓ ABO Raiz funciona pra ele.

---

## Pré-Requisito Rígido

**Mínimo 4 criativos validados (ROI >= 2.5, 5-10 vendas).** Sem isso, NÃO escala.

> "Enquanto eu não tiver 4 criativos na minha mão, eu não faço nada."

---

## As 8 Estruturas — Cardápio

### 1. ABO Raiz (MELHOR)

```
1 campanha → 1 conjunto → 1 criativo CAMPEÃO
Orçamento: 45% do produto/dia
Escala: DUPLICAR da FONTE (não cópia), 00:03
Cada duplicata = novo cluster
Vida útil: 50-60 dias
```

**Kill Rule:**
- Duplicada não vendeu em 1 dia → desativa
- ROI período máximo > 2 = SEGURA mesmo com 7 dias sem venda

> "Eu olho pra cada ABOzinha como se ela fosse uma kitnet na minha vida."
> "Nunca mudar nada. Deixa ela ser feliz."

### 2. ABO Campeões (MELHOR)

```
1 campanha → 1 conjunto → 3 criativos campeões
Orçamento: 45% do produto/dia
Escala: duplicar conjunto INTEIRO (não mexe nos criativos dentro)
```

**Resultado real:** Oferta R$500/dia → R$1.700/dia lucro.
> "Quase impossível uma estrutura dessa passar 1 dia sem vender."

### 3. ABO Campeões Advantage

```
Mesma estrutura 1-1-3
Tipo: 100% Advantage
Orçamento: 100% do produto (não 45%)
```

> "Muita grana = comporta como CBO ruim. Pouca grana = ABO rainha maravilhosa."

### 4. Gramado (Advantage Shopping)

```
Campanha Advantage + 4+ criativos campeões
Orçamento: 1x produto → 2x (após 3 dias OK) → R$500 (após 5 dias OK)
Subir em pares/trios. Mín 5 ativos.
```

**Kill Rule:**
- 5 dias mínimo
- **NUNCA desligar criativos individuais** — Meta distribui
- Análise por fora (campanha) E por dentro (conjunto)
- Pode usar Criativo Dark

### 5. CBO 500 (1-5-1)

```
1 campanha → 5 conjuntos iguais → 1 criativo
Orçamento: R$500/dia na CAMPANHA (CBO)
```

**Kill Rule (binária):**
- 2 dias mínimo
- ROI positivo → duplicar campanha INTEIRA
- ROI negativo → DESLIGA INTEIRA

> "Eu nunca faço manutenção em CBO. Nunca, nunca, nunca."
> "CBO é binária: funciona ou não."
> "CBO não deu bom? Tchum. Mal. Tchau. Acabou."

### 6. CBO 1K (1-10-5)

```
1 campanha → 10 conjuntos → 5 criativos campeões em cada
Orçamento: R$1.000/dia na CAMPANHA
```

**Pré-requisito RÍGIDO:** 5 criativos campeões com ROI 2.5+. Sem isso, NÃO sobe.

### 7. CBO Natalina (R$1.000+)

```
3 conjuntos × 3 criativos DARK exclusivos
Público aberto (idade + gênero)
```

**10 Regras Operacionais:**
1. Orçamento na CAMPANHA
2. Mín 3 conjuntos
3. Mín 3 criativos por conjunto
4. Público ABERTO (sem interesses)
5. Otimizar COMPRA
6. NÃO mexer em campanha que vende
7. NÃO editar/pausar conjunto ativo
8. Escalar VERTICAL (subir verba 20-30%)
9. Testar 3-5 dias antes de matar
10. Novos criativos: duplicar campanha INTEIRA

**ÚNICA estrutura que escala VERTICAL.** Requer criativos exclusivos NUNCA usados antes.

**Resultado:** Produto biografia Insta — ROI 1.3 dia 1 → ROI 5 em 7 dias. R$1.000/dia lucro.

### 8. ABO Garimpo (1-N-1, R$10)

```
1 campanha → 10-50 conjuntos → 1 criativo campeão
Orçamento: R$10/conjunto (NÃO 45%)
```

**Mecânica:**
- 24h
- Os que venderam = cluster bom → sobe pra R$30 (escala vertical pra valor correto)
- Nenhuma vendeu = desliga tudo

> "ABO Garimpo nada mais é do que: 1 campanha, 10 conjuntos, 1 criativo."

---

## Tabela Resumo

| # | Estrutura | Tipo | Orçamento | Criativos | Kill Time |
|---|-----------|------|-----------|-----------|-----------|
| 1 | **ABO Raiz** | ABO | 45% | 1 campeão | 1 dia (duplicada) |
| 2 | **ABO Campeões** | ABO | 45% | 3 campeões | Período máximo |
| 3 | **ABO Campeões Adv** | Advantage+ | 100% | 3 campeões | — |
| 4 | **Gramado** | Adv Shopping | 1x→2x→500 | 4+ validados | 5 dias |
| 5 | **CBO 500** | CBO | R$500 | Validados | 2 dias |
| 6 | **CBO 1K** | CBO | R$1.000 | 5 com 2.5+ | 2 dias |
| 7 | **CBO Natalina** | CBO | R$1.000+ | 3×3 dark | 3-5 dias |
| 8 | **ABO Garimpo** | ABO | R$10 | 1 campeão | 24h |

---

## Workflow de Teste

```
Semana 1-2: Testar ABO Raiz
  → funcionou? Adiciona ao kit
  → não? Próxima
Semana 3-4: Testar ABO Campeões
  → funcionou? Adiciona
Semana 5-6: Testar Gramado
  → ...
Semana 7-8: Testar CBO 500
  → ...
```

**Regra:** Testar UMA por vez. Nunca subir todas ao mesmo tempo (anti-padrão).

> "Cada oferta tem afinidade com estruturas diferentes."

---

## Escala Horizontal vs Vertical

**Padrão:** HORIZONTAL (duplicar). Exceções:
1. CBO Natalina (vertical)
2. Gramado Escala Máxima (vertical via orçamento programado)

> "Nunca editar orçamento direto na campanha — perde clusterização."

**Forma correta:**
- Duplicar com novo valor
- OU usar Orçamento Programado (Escala Máxima)

---

## Regra dos 20%

**Significado 1:** Kill rule — custo 20%+ acima do alvo Funil 3X = considerar desligar.

**Significado 2:** Proteção na escala — incrementos 20% por dia, subir 23h-23h30:
- Calcular investimento total
- 20% = orçamento pra DUPLICAR (não aumentar)
- Recalcular dia seguinte

**Variante agressiva:** "Quanto tenho de lucro? R$500/dia? Subo R$500 e testo."

---

## Escala Máxima — Intradiária

| ROI | Aumento |
|-----|---------|
| > 2.5 | +20% via orçamento programado |
| > 3.0 | até +50% via orçamento programado |

> "90,5% das vezes esse processo dá certo."

NUNCA editar orçamento direto. SEMPRE programado.

---

## Ritmo 3 Luta + 4 Glória

- 3 dias luta: testar coisas novas (criativos, audiências, gramados)
- 4 dias glória: SÓ vencedores, mata ruins, recupera ROI

> "Nos dias de luta você CRESCE."

Dias de luta sempre ACIMA do nível de glória anterior. Gráfico só sobe.

---

## Turbulência

3-5 dias queda sem causa = NORMAL.

Regras:
- Só acontece com o que JÁ vendia
- ESPERAR 3-5 dias
- NÃO desligar, NÃO testar, NÃO escalar
- > 5 dias = clusters morreram → duplicar conjuntos

> "Nenhum avião cai por turbulência; o piloto que desliga é que causa a queda."

---

## Janela Completa — Análise Tripla

SEMPRE 3 janelas antes de qualquer kill:

1. **Período MÁXIMO** (todo histórico)
2. **Últimos 7 dias**
3. **Últimos 3 dias**

**Regra:** ROI > 2 no MÁXIMO → SEGURA mesmo com 3 dias ruins.

---

## Output

```yaml
kit_escala_oferta_X:
  estruturas_testadas: 8
  estruturas_que_funcionam:
    - abo_raiz: ROI 2.4
    - abo_campeoes: ROI 2.8
    - gramado: NAO funciona
  kit_personalizado:
    - abo_raiz (principal)
    - abo_campeoes (suporte)
  total_lucro_dia: R$X
  verba_total_dia: R$Y
```

---

## Handoff

→ `lt-strategist *verba-do-roi` — descobrir teto empírico
→ Quando atingir teto: `lt-strategist *lateralidade` — próxima oferta paralela

---

## Anti-Padrões (Vol 6)

1. Subir todas escalas ao mesmo tempo
2. Editar orçamento direto na campanha
3. Mexer em ABO que vende
4. Manutenção em CBO
5. Escalar verticalmente (exceto Natalina/Gramado)
6. Olhar Limite de Aprendizagem
7. CBO 1K sem 5 campeões 2.5+
8. Decidir em <48h
9. Síndrome do Reset

---

**Task Status:** Production Ready
