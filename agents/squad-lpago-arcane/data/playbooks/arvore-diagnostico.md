# Playbook — Árvore de Diagnóstico

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: built from scratch — decision tree (derivada de data/metodo/09 + REGRAS-CARDINAIS RC-007/008/009/010/011 + RC-005)
> Carregado por: analista-dados

---

## Para Que Serve Este Playbook

Decision tree pro agente `analista-dados` identificar **o gargalo principal** dado um conjunto de indicadores. A lógica é **eliminação em ordem de prioridade**: cada check resolve uma camada do funil, do mais externo (criativo / hook) pro mais interno (oferta / conversão). O primeiro check que dispara é o gargalo.

> "Quando o resultado tá ruim, não é a campanha — é o que você tá mostrando. Hook rate ruim = CTR ruim = CPA alto = margem morta. Tudo começa nos 3 primeiros segundos." (data/metodo/04)

---

## Quando Usar

- Toda vez que o agente `analista-dados` for executar um diagnóstico
- Antes de preencher a Seção 3 (Diagnóstico Narrativo) do template `diagnostico-lancamento.md`
- Sempre que um indicador mudar de 🟢 pra 🟡 ou 🔴

---

## Lógica Geral

A árvore segue 7 checks em ordem. **Para no primeiro que dispara.** Não pula etapas — um check pode mascarar outro mais profundo.

```
[INPUT: tabela de indicadores do template diagnostico-lancamento.md]
       ↓
   Check 1: Hook Rate
       ↓ (se OK)
   Check 2: CTR + Hook Rate combinados
       ↓ (se OK)
   Check 3: Conversão da página
       ↓ (se OK)
   Check 4: CPA vs Ticket (RC-007)
       ↓ (se OK)
   Check 5: Connect Rate (técnico)
       ↓ (se OK)
   Check 6: Comparecimento ao evento
       ↓ (se OK)
   Check 7: Conversão evento → vendas
       ↓ (se OK)
   [Análise mais granular caso a caso]
       ↓
[OUTPUT: gargalo principal + ações ordenadas pro template]
```

---

## Check 1 — Hook Rate < 20%?

> **REGRA CARDINAL — RC-011: Mata no ninho.** Hook abaixo de 20% não melhora com tempo. Não é otimização — é refazer.

| Caso | Conclusão | Ação |
|------|-----------|------|
| Hook Rate < 20% | **GARGALO ENCONTRADO — criativo morto** | Matar criativo. Refazer 3 primeiros segundos. NÃO otimizar, REFAZER. |
| Hook Rate 20-25% | Sinal positivo mas instável | Testar 2-3 variações da abertura (mesma oferta, hook diferente) |
| Hook Rate > 30% | OK — passar para Check 2 | — |

**Por que este check é o primeiro:** se o lead não passa dos 3 segundos, nenhum outro indicador faz sentido. Tudo a jusante está enviesado por amostra ruim.

**Referência rápida:** data/metodo/04 (seção Hook Rate) + data/metodo/09 (seção 1.6).

---

## Check 2 — CTR Baixo + Hook Rate OK?

> Hook segura, mas a pessoa não clica. Problema é da PROMESSA do anúncio (Interesse + Oportunidade + CTA).

| Caso | Conclusão | Ação |
|------|-----------|------|
| Hook OK + CTR < 0.5% (frio) | Promessa fraca após o hook | Revisar Interesse + Oportunidade do roteiro. Promessa específica? Mecanismo claro? CTA com verbo? |
| Hook OK + CTR 0.5-0.68% | Aceitável mas tem espaço | Testar variações de CTA + Interesse |
| Hook OK + CTR 0.68-0.98% | "Pedrada pra frio" — OK | Passar para Check 3 |
| Hook OK + CTR > 1.5% | Excelente | Passar para Check 3 |

**Causas comuns de CTR baixo com Hook OK:**
1. Promessa do anúncio é genérica (RC-003 — não vende a peça que faltava)
2. Anúncio não menciona o mecanismo tangível
3. CTA fraco ("saiba mais" em vez de "garantir minha vaga")
4. Anúncio fala de transformação geral, não de problema específico

**Referência rápida:** data/metodo/04 (CTR + Pilares 1+2) + data/metodo/02 (proposta).

---

## Check 3 — Conversão da Página < 5%?

> Anúncio funciona, lead chega na página, mas não compra. Problema é da PÁGINA. Antes de tudo: checar Connect Rate (Check 5).

| Caso | Conclusão | Ação |
|------|-----------|------|
| Conv < 1.8% | Página quebrada — RC-005 violada | Refazer primeira dobra. Mobile-first. Cortar inimigos da conversão. |
| Conv 1.8-5% | Margem ruim, mas ajustável | Revisar headline da primeira dobra (não testa AQUI — testa nos criativos por RC-006) + simplificar UX |
| Conv 5-7% | Aceitável, espaço pra subir | Testar variações de copy nas seções 5 (conteúdo) e 6 (oferta) |
| Conv 7-13% | Bom pra ticket R$2-10k | Passar para Check 4 |
| Conv > 13% | Excelente | Passar para Check 4 |

**Antes de mudar copy: checar se Connect Rate < 75% (Check 5). Página lenta finge que o problema é copy.**

**Causas comuns de conversão baixa:**
1. Primeira dobra não tem headline + CTA + escassez (90% do resultado vem dela)
2. Vídeo de vendas na página (regra LP: nunca tem vídeo)
3. Texto centralizado / blocos > 4 linhas (4 inimigos)
4. Página parece lançamento gratuito (RC-002)
5. Promessa diferente da do anúncio (mata conversão)
6. Campo de cupom no checkout (faz lead abandonar pra procurar cupom)

**Referência rápida:** data/metodo/03 (toda) + data/metodo/09 (seção 1.1).

---

## Check 4 — CPA > Ticket?

> **REGRA CARDINAL — RC-007: CPA é Rei.** Se CPA passa do ticket, o lançamento é deficitário antes mesmo do evento. Identificar o gargalo principal entre os checks anteriores.

| Caso | Conclusão | Ação |
|------|-----------|------|
| CPA > 2x ticket | CRÍTICO — não escalar | Pausar campanhas. Reabrir todos os checks anteriores. Provável: público errado ou proposta fraca. |
| CPA > ticket (até 2x) | Margem negativa | Não escalar. Otimizar primeiro: voltar pra Check 1, 2, 3. |
| CPA = ticket | Limite — só vende margem do principal | Aceitável só se ROAS no produto principal compensar. Cuidado. |
| CPA < ticket | OK — passar para Check 5 | — |
| CPA ~R$35 | Ideal — escalar com força | Aplicar RC-009: NÃO mexa no que funciona. Cria cópia pra testar variação. |

**Pegadinha:** CPA "OK" no início pode esconder problema de qualidade do lead (não comparece, não compra no evento). Reavaliar CPA junto com conversão evento → produto (Check 7).

**Referência rápida:** data/metodo/04 (CPA é Rei) + data/metodo/09 (seção 1.3).

---

## Check 5 — Connect Rate < 75%?

> Esse check entra **mesmo se** todos os anteriores estão OK aparentemente — porque problema técnico de carregamento mascara TUDO.

| Caso | Conclusão | Ação |
|------|-----------|------|
| Connect Rate < 54% | CRÍTICO TÉCNICO | **Nenhuma otimização de marketing resolve.** Hospedagem, peso de imagens, mobile lento. Resolver primeiro. |
| Connect Rate 55-68% | Muito ruim | Igual ao crítico — prioridade técnica antes de mexer em qualquer copy/oferta |
| Connect Rate 69-75% | Ficando ruim | Otimizar imagens + scripts, monitorar |
| Connect Rate 75-80% | Ótimo | Passar para Check 6 |
| Connect Rate > 81% | Excelente | Passar para Check 6 |

**Sintoma claro de problema técnico:** alta taxa de "iniciado mas não completou pageview" + bounce rate >70% + tempo na página <5s.

**Onde olhar:** Microsoft Clarity, Google PageSpeed, Hotjar.

**Referência rápida:** data/metodo/09 (seção 1.11).

---

## Check 6 — Comparecimento ao Evento Baixo?

> Aplicável a partir da fase "dia do evento". Se ingressos venderam mas pouca gente apareceu, problema é ANTECIPAÇÃO.

| Caso | Conclusão | Ação |
|------|-----------|------|
| Comparecimento < 10% | Antecipação falhou completamente | Revisar sequência de mensagens (T-7d até T-1h). Lembretes funcionando? Link sendo enviado? Onboarding pós-compra ativo? |
| Comparecimento 10-15% | Ruim mas dentro da realidade do método | Tunar antecipação pro próximo ciclo |
| Comparecimento ~15% | Esperado pelo método | Passar para Check 7 |
| Comparecimento > 20% | Excelente | Passar para Check 7 |

**Causas comuns:**
1. Mensagem de antecipação não saiu (problema técnico — n8n / dispatcher)
2. Link do evento não foi enviado em T-1h e T-30min
3. Lembrete de credenciamento ausente
4. Grupo WA não estava quente — leads não acompanharam
5. Email de boas-vindas pós-compra não confirmou data/hora

**Referência rápida:** data/metodo/06-antecipacao.md + data/metodo/09 (seção 1.10).

---

## Check 7 — Conversão Evento → Vendas Abaixo do Esperado?

> Lead veio, ficou, mas não comprou. Problema é PITCH / oferta / ancoragem.

| Caso | Conclusão | Ação |
|------|-----------|------|
| Conv < 5% (ticket R$2-10k) | Pitch quebrado | Refazer Pitch 1 (apresentação + ancoragem RC-020) + Pitch 2 (revelação + abre vendas). Verificar RC-012 (pitch antes de intervalo). |
| Conv 5-7% | Margem | Drives e SEED não foram instalados durante conteúdo. Refazer pra próximo. |
| Conv 7-13% | Esperado pra ticket R$2-10k | Análise mais granular |
| Conv 2-5% (ticket R$10k+) | Esperado pra high ticket | Análise mais granular |

**Causas comuns:**
1. Pitch DEPOIS do almoço (RC-012 violada) — perdeu janela de compra
2. Conteúdo fraco nas primeiras 2-3h (RC-019) — audiência saiu
3. Sem ancoragem de tempo (RC-020) — Repitch sem força
4. Oferta confusa — múltiplos produtos (RC-017 violada)
5. Ingresso muito barato (R$ <19) — público sem grana
6. Bonus fracos / sem escassez visceral

**Referência rápida:** data/metodo/07-evento-pitch.md + data/metodo/09 (seção 7).

---

## Cenários Compostos (Multi-Fator)

Quando 2+ indicadores estão fora do esperado, o diagnóstico é composto:

| Sintomas Combinados | Hipótese Composta | Ação |
|---------------------|-------------------|------|
| **CPA alto + Conversão página alta** | Problema é PÚBLICO — anúncio atrai errado, mas quem chega na página é qualificado | Refazer segmentação Meta (interesse / lookalike). Manter página intocada (RC-009). |
| **CPA alto + Conversão página baixa** | Problema é PÁGINA — mata gente que clica | Voltar pra Check 3. Página primeiro, anúncio depois. |
| **CPA alto + CTR alto + Conv página baixa** | Promessa do anúncio NÃO bate com a da página | Alinhar promessa anúncio ↔ página. Verificar headline H1 = headline do anúncio. |
| **Hook OK + CTR baixo + Conv página alta** | Anúncio prende mas não vende — quem clica converte | Otimizar CTA + escassez no anúncio. Página tá OK. |
| **Hook baixo + Conv página alta** | Tem público qualificado vindo, mas o anúncio só atrai 20% — perdendo escala | Refazer hook (RC-011). Não mexa na página. |
| **Connect Rate baixo + Conv baixa** | Problema TÉCNICO (carregamento), não marketing | Resolver hospedagem ANTES de qualquer outra coisa |
| **Comparecimento baixo + ingressos OK** | Falha na ANTECIPAÇÃO (sequência de mensagens) | Auditar disparos T-7d até T-1h |
| **Conv evento OK + vendas pós-evento baixas** | Falha no Meteórico / pressão comercial pós | Voltar pra `downsell-pos-evento.md` — checar se Meteorico foi ativado, se 7 ângulos rodaram, se carrinho fechou de verdade |
| **Conv página alta + ingressos vendidos baixos** | Lead abandona checkout sem recovery | Verificar se `recuperacao-ingresso` está ativa — disparo 15min + follow-ups (`templates/recuperacao-ingresso.md` + `metodo/10-recuperacao-ingresso.md`) |
| **CPA OK + ROAS Front baixo** | Ticket muito baixo OU order bump não configurado (RC-016) | Adicionar order bump (gravação) + revisar lotes |

---

## Bloqueios Cardinais (Sempre Verificar)

Mesmo se a árvore não pegou, estes bloqueios sempre disparam ação imediata:

- [ ] **RC-007** — CPA > ticket → não escalar
- [ ] **RC-009** — Algo está vendendo bem? **Não mexer.** Cria cópia pra testar.
- [ ] **RC-010** — Mudou algo nas últimas 48h? Esperar 2 dias antes de mexer de novo.
- [ ] **RC-011** — Hook < 20%? Matar antes de qualquer outra otimização.
- [ ] **RC-012** — Pitch agendado DEPOIS de intervalo? Reagendar antes.

---

## Output Esperado Após Rodar a Árvore

Pro template `diagnostico-lancamento.md` (Seção 3 — Diagnóstico Narrativo + Seção 4 — Ação Prioritária):

```
Gargalo Principal: {1 frase clara}
Etapa do Funil: {anúncio / página / checkout / antecipação / evento / pós-evento}
Check que disparou: {Check 1-7}
Regra Cardinal violada (se houver): {RC-XXX}
Cenário composto (se aplicável): {referência da tabela}

Ações ordenadas:
1. {ação mais crítica derivada do check disparado}
2. {ação secundária}
3. {ação que pode esperar}

O Que NÃO Fazer:
- {RC-009 — não mexer no que funciona}
- {RC-010 — não otimizar com <2 dias de dados}
- {específicos do contexto}
```

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
