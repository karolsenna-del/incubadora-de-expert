---
task: "Retrospectiva Pos-Evento"
responsavel: "@analista-dados"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Todos os diagnosticos do ciclo + dados finais do lancamento (faturamento, ingressos vendidos, vendas produto principal, vendas downsell, comparecimento, ROAS final)"
Saida: "retrospectiva-final.md (diagnostico completo do ciclo + aprendizados pra proximo lancamento)"
Checklist:
  - "Faturamento total (ingressos + order bumps + produto principal + downsell meteorico)"
  - "Conversao do evento (ingressos -> compradores produto principal)"
  - "ROAS final (front + total combinado)"
  - "Comparacao com plano original (metas batidas? subdimensionado? superdimensionado?)"
  - "Identificacao do que funcionou (intocavel pro proximo — RC-009)"
  - "Identificacao do que falhou (gargalo principal + secundario)"
  - "Lista priorizada de aprendizados pro proximo ciclo"
  - "Validacao do RC-014 (40-60% das vendas sao pos-evento) — verificar se o pos foi bem trabalhado"
  - "Pre-condicao: aguarda minimo D+7 pos-evento (capturar recuperacao + downsell)"
execution_type: "semantic"
---

# Task: Retrospectiva Pos-Evento

## Executive Summary

Fechamento do ciclo. Apos D+7 do evento (minimo, pra capturar recuperacao + downsell), produz documento final com numeros, comparacao com plano, aprendizados priorizados pro proximo lancamento.

## Pipeline

```
Fim do ciclo (D+7+ pos-evento)
   |
   v
[Coletar dados finais]
   |
   v
[Calcular faturamento + ROAS + conversao]
   |
   v
[Comparar com plano original]
   |
   v
[Validar RC-014]
   |
   v
[Identificar o que funcionou (RC-009)]
   |
   v
[Identificar o que falhou]
   |
   v
[Listar aprendizados priorizados]
   |
   v
[Recomendacao pro proximo ciclo]
```

## Steps

### Step 1: Pre-Condicao — Aguardar D+7

```
Retrospectiva precisa aguardar minimo 7 dias pos-evento pra
capturar:
- Recuperacao de venda completa (Meteorico + 7 angulos)
- Downsell finalizado
- Refinamento dos numeros

Voce ta no D+? Se < D+7, te recomendo aguardar.

Se voce ta em situacao especifica (precisa fechar agora pra
relatorio), eu faco com o que tem mas marco "dados parciais".
```

### Step 2: Coletar Dados Finais

Indicadores necessarios:

**Vendas:**
- Ingressos vendidos (numero + receita)
- Order bumps (vendas + receita por item)
- Produto principal (vendas + receita)
- Downsell Meteorico (vendas + receita)
- TOTAL faturamento

**Custos:**
- Spend total Meta Ads
- Custos de plataforma (page builder, dispatcher, email tool)
- (V2+ pode incluir custos operacionais)

**Conversao:**
- Conversao pagina final (visitantes -> ingressos)
- Conversao do evento (ingressos -> produto principal)
- Conversao pos-evento (produto principal nao comprado -> downsell)

**Comparecimento:**
- Dia 1: %
- Dia 2 (se multi-dia): %

### Step 3: Calcular ROAS

- ROAS FRONT = receita ingressos / spend
- ROAS TOTAL = (receita total) / spend
- LIQUIDO = receita total - spend - custos plataforma

### Step 4: Comparar com Plano Original

Tabela:

```
| Metrica          | Plano    | Real     | Variacao |
|------------------|----------|----------|----------|
| Ingressos        | X        | Y        | +/- %    |
| Produto principal| X        | Y        | +/- %    |
| Receita total    | R$X      | R$Y      | +/- %    |
| ROAS total       | X.X      | Y.Y      | +/- %    |
```

Veredicto:
- **SUBDIMENSIONADO:** real > 25% acima do plano (proximo ciclo, plano mais ambicioso)
- **NA META:** real entre -15% e +25% do plano (boa execucao)
- **SUPERDIMENSIONADO:** real < -15% do plano (proximo ciclo, plano mais conservador OU diagnostico de execucao)

### Step 5: Validar RC-014

RC-014: 40-60% das vendas vem pos-evento.

Calcular:
- Vendas durante o evento (estimativa pelo timing)
- Vendas pos-evento (recuperacao + downsell)
- % pos-evento sobre total

Se < 40%: pos-evento mal trabalhado — gargalo importante pro proximo ciclo.
Se 40-60%: respeitada.
Se > 60%: pos-evento muito forte (ou evento subutilizado — investigar).

### Step 6: Identificar O Que Funcionou (Intocavel — RC-009)

Listar:
- Pecas de anuncio com Hook Rate alto (intocaveis)
- Headline da pagina que converteu (manter)
- Mensagens com engajamento alto no grupo
- Estruturas que funcionaram (mecanismo, oferta, ancora)

### Step 7: Identificar O Que Falhou

**Gargalo principal:** o que mais custou (em vendas perdidas ou orcamento queimado)?
**Gargalo secundario:** segundo maior problema.

Estimar custo de cada gargalo (vendas perdidas estimadas).

### Step 8: Listar Aprendizados Priorizados

Pro proximo ciclo:

```
P1 (CRITICO):
{aprendizado mais importante}

P2 (ALTO):
{}

P3 (MEDIO):
{}

P4 (MEDIO):
{}

P5 (BAIXO):
{}
```

Cada aprendizado vinculado a uma acao concreta pro proximo ciclo (nao "ser melhor", mas "aprovar templates Meta 7+ dias antes").

### Step 9: Recomendacao Pro Proximo Ciclo

```
Status do lancamento atual: {SUCESSO / PARCIAL / PROBLEMATICO}
Faturamento liquido: R$X
ROAS total: Yx

Recomendacao:
- Rodar proximo ciclo em [60-90 / 30-60] dias
- Aplicar P1, P2, P3 (prioridades altas)
- Plano sugerido: meta {X-Y}% acima OU abaixo do atual
```

## Veto Conditions

- Retrospectiva antes de D+7 sem aviso de "dados parciais" → adiciona aviso
- Faturamento sem custos (calcular liquido) → completa
- Aprendizado generico ("ser melhor", "investir mais") → refazendo, exige especifico
- RC-014 nao calculada → adiciona
- "Tudo funcionou" sem identificar nada que falhou → confronta (sempre tem algo pra melhorar)

## Output Esperado

Arquivo `retrospectiva-final.md` com:
- Header (data, periodo, status do lancamento)
- 1. Numeros finais (vendas + custos + ROAS + liquido)
- 2. Comparacao com plano original
- 3. RC-014 check
- 4. O que funcionou (intocavel)
- 5. O que falhou (gargalos)
- 6. Aprendizados priorizados (P1-P5)
- 7. Recomendacao proximo ciclo

## Regras

- Aguarda D+7 minimo (ou marca dados parciais)
- Calcula ROAS front + total
- Valida RC-014 explicitamente
- Aprendizado precisa ser especifico (acao concreta)
- Identifica intocavel (RC-009) E gargalo
- Termina com proximo passo concreto pro proximo ciclo

## QG-LP-05 PASS

Apos retrospectiva aprovada + downsell-pos-evento entregue (placeholder ou final), QG-LP-05 PASS — ciclo encerrado.
