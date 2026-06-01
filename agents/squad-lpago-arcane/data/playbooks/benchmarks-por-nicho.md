# Playbook — Benchmarks por Nicho

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: curated synthesis com aviso V1 genérico → V2+ Euriler refina
> Carregado por: estrategista-chief, analista-dados

---

## HEADER CRÍTICO — LEIA ANTES DE USAR

> **V1 = benchmarks gerais** (extraídos do método consolidado de 12 fontes primárias do Euriler).
> **V2+ = Euriler injeta benchmarks proprietários por nicho** conforme cada novo case for documentado.
>
> **REGRA INEGOCIÁVEL:**
> - **NÃO inventar nicho** que não está documentado abaixo
> - **NÃO inferir métrica** que não está explícita no método
> - **Se um nicho não tem case dedicado**, usar dimensões próximas + benchmarks gerais + sinalizar pro expert que é estimativa, não dado validado
> - **Quando o agente devolver número de benchmark**, sempre indicar a fonte (case real OU benchmark geral OU estimativa)

---

## 1. Benchmarks Gerais (Aplicáveis a Todos os Nichos)

Estes vêm de `data/metodo/09-referencia-tatica.md` (seção 1 — Benchmarks Completos). São os números base que o agente usa quando o nicho específico não tem case validado.

### 1.1 Tabela Resumo — Todos os Indicadores

| Métrica | Ruim | Aceitável | Bom | Muito Bom | Top |
|---------|------|-----------|-----|-----------|-----|
| Conversão Página | <5% | 6,5% | 7-8% | 9-10% | 16%+ |
| Conversão Checkout | <10% | 20% | 35% | — | — |
| CAC | >Ticket | =Ticket | <Ticket | R$35 | — |
| CTR (frio) | <0,5% | 0,68% | 0,90% | 1.5%+ | — |
| Hook Rate | <20% | 20-25% | >30% | — | — |
| ROAS | <1.4 | 1.4-1.8 | 2.0-3.0 | — | 10x+ |
| NPS | <70% | 80% | 81% | — | 95% |
| Connect Rate | <54% | 69-75% | 75-80% | 81%+ | — |
| Order Bump | <10% | 14% | 20%+ | 30% | — |

### 1.2 Conversão Esperada por Faixa de Ticket

```
TICKET R$ 2.000 a R$ 10.000:
  Público frio: 7-13% (PARÂMETRO REAL)
  Público quente: 40-55% (NÃO É PARÂMETRO — só referência)
  Target: 10%+

TICKET R$ 10.000+:
  Público frio: 2-5%
  Target: 5%
```

### 1.3 Correlação CPM × Preço Sugerido

```
CPM ~R$30   → Ingresso R$ 29-50
CPM ~R$50-80 → Ingresso R$ 60-120
CPM >R$100  → Ingresso R$ 197+
```

**Aviso:** correlação, não regra absoluta. CPM alto com conversão alta = sem problema.

### 1.4 Faturamento Esperado por Exposição de Caixa

```
Exposição R$ 10-25k → Faturamento R$ 150-300k
(Com proposta e execução validadas)

Primeiro lançamento típico:
  Exposição: R$ 15.000
  Ingressos: 200-300 vendidos
  Presença ao vivo: ~100 pessoas
  Vendas no evento: > R$ 100.000
```

---

## 2. Cases Reais por Nicho Documentado

Cada case abaixo vem de `data/metodo/09` ou `data/metodo/REPERTORIO.md`. Métricas reais alcançadas + condições. Use estes números antes dos benchmarks gerais quando o nicho do aluno bater.

### 2.1 Moda / Roupas

**Case primário:** Jesué Tomé (1º lançamento)

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Ingressos vendidos | 1.620 | 1º lançamento |
| Conversão de venda no evento | 7,5% | — |
| Ticket médio (produto principal) | R$ 1.540 | Faixa R$2-10k |
| CPA geral | R$ 97,47 | — |
| Faturamento ingressos + gravação | R$ 126.747 | — |
| Faturamento total | R$ 317.283 | — |
| ROAS | 2,0 | Esperado pra LP bem executado |
| Order Bump 1 | 14% | — |
| Order Bump 2 | 30% | Dois OBs rodando juntos |

**Outros cases mencionados no nicho:** Ana Tex (mesma faixa).

**Lição:** nicho difícil (disposição menor de compra online) não impede resultado. R$ 317k no primeiro ciclo.

**Quando aplicar este benchmark:** aluno em moda, fashion, roupas, beleza adjacente.

---

### 2.2 Marketing Digital / Empreendedorismo

**Case primário:** Rafael Mariano (2 dias)

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Conversão (1º e 2º lançamento, 1 dia) | 11% | — |
| Conversão (3º lançamento, 2 dias) | 12% | RC-018 (2 dias > 1 dia) |
| Ingressos | 450+ | — |
| Faturamento ingressos + order bump | R$ 28k | Front |
| Conversão checkout low ticket | 52%+ | — |
| ROAS Front | 1,7 a 2,0 | — |
| CPM | R$ 17,25 | Baixo — público amplo |

**Lição:** pitch dividido em 2 dias converte mais — Pitch 1 ancora, Pitch 2 abre.

**Quando aplicar:** alunos em marketing, vendas, empreendedorismo, mentoria de negócios.

---

### 2.3 Médicos — Subnicho (Ginecologistas)

**Case primário:** Sávio Brandão

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Conversão geral | 8,37% | — |
| CTR | 0,90% | "Pedrada pra frio" |
| CPA máximo | R$ 61,76 | — |

**Lição:** subnichar funciona. "Médicos" é amplo demais. "Ginecologistas" é preciso, permite copy específica e anúncio direto.

**Regras específicas pra médicos** (de `data/metodo/09` seção 6.1):
- Preço muito barato pode NÃO qualificar
- Eventos curtos (máx 1 dia, 5h) funcionam melhor que 2 dias
- Conversão pode ser baixa mesmo com CTR alto (público mais analítico)
- Recorte: subnichar (ginecologistas, não "médicos")

**Quando aplicar:** alunos em saúde com público profissional liberal — médicos, dentistas, fisioterapeutas. Subnichar antes de usar benchmark.

---

### 2.4 Lotes Progressivos

**Case primário:** Leandro Demoner

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Ingresso inicial | R$ 19 | — |
| Ingresso final | R$ 42 | — |
| Conversão gravação inicial | 6-9% | Lote inicial |
| Conversão gravação final | 18%+ | Lote final |
| Preço gravação | R$ 147 | Order bump |

**Lição:** quem paga mais caro pelo ingresso é mais comprometido e mais propenso a comprar o resto. Conversão de gravação triplicou do início ao final.

**Quando aplicar:** estratégia de precificação por lotes (válida pra qualquer nicho com tráfego escalável).

---

### 2.5 Otimização de Página

**Case primário:** Douglas R

| Fase | Conversão |
|------|-----------|
| Inicial | 1,8% |
| Após ajustes na página | 10%+ |
| Com criativos otimizados | 16%+ |

**Lição:** de 1,8% para 16% (~9x). A página é o ponto de maior alavancagem. **Antes de mexer em tráfego, conserta a página.**

**Quando aplicar:** sempre. É benchmark transversal de quanto a página pode mover o resultado.

---

### 2.6 Bonus Físicos / Tsunami

**Case primário:** Deborah Relier

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Bônus | Kit físico (caneca, cafezinho, caderno) + bootcamp | — |
| Velocidade de venda | 15 primeiros em **3 minutos** | Escassez visceral |
| NPS Dia 1 | 81% | — |
| NPS Dia 2 | 95% | — |

**Lição:** bônus tangível + escassez visceral = urgência. Social media adora brindes físicos.

**Quando aplicar:** alunos com produto que comporta bônus físico + nicho com forte exposição em redes sociais.

---

### 2.7 Eventos Curtos (3 horas)

**Case primário:** Gisele Ferreira (Psicólogos)

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Duração total | 3 horas | — |
| Estrutura | 3h conteúdo + 30min pitch | — |
| Reclamações | Zero | — |

**Lição:** o formato precisa servir ao público, não ao método. Psicólogos / terapeutas valorizam fim de semana com família.

**Regras específicas pra psicólogos / terapeutas** (de `data/metodo/09` seção 6.2):
- Eventos de 3 horas funcionam bem
- Valorizam fim de semana com família
- Suporte humanizado e paciente

**Quando aplicar:** alunos em saúde mental, terapia, coach, mentor de bem-estar.

---

### 2.8 Base Antiga / Lote Zero

**Case primário:** Ronald Zancan

| Métrica | Valor | Contexto |
|---------|-------|----------|
| Vendas lote zero | 100+ | Em base antiga |
| Conversão no evento | 2% | Baixa pra ticket |

**Lição:** lote zero pode encher de gente, mas atrai público com **menor poder de compra**. Funciona bem pra público quente via API/automação — **não como estratégia principal**.

**Quando aplicar:** estratégia secundária. Nunca primária.

---

## 3. Mapa Comparativo dos 8 Cases

| Case | Nicho | Destaque | Lição |
|------|-------|----------|-------|
| Jesué Tomé | Roupas | 1.620 ingressos, R$ 317k, ROAS 2.0 | Nicho difícil não impede resultado |
| Rafael Mariano | Marketing | 12% conv., 2 dias | Pitch dividido converte mais |
| Sávio Brandão | Ginecologistas | 8,37% conv., CTR 0,90% | Subnichar é a chave |
| Leandro Demoner | Lotes | 6-9% → 18% gravação | Ingresso caro = comprador qualificado |
| Douglas R | Otimização | 1,8% → 16% | Página é o maior ponto de alavancagem |
| Deborah Relier | Bônus físicos | 15 vendas em 3 min, NPS 95% | Tangível + escassez = urgência |
| Gisele Ferreira | Psicólogos | 3h, zero reclamações | Formato serve ao público |
| Ronald Zancan | Base antiga | 100+ vendas, 2% conv. | Lote zero atrai sem grana |

---

## 4. Regras Específicas por Tipo de Público

> Reproduzido de `data/metodo/09` seção 6 — Públicos Específicos.

### 4.1 Médicos / Dentistas

| Aspecto | Regra |
|---------|-------|
| Preço | Muito barato pode NÃO qualificar |
| Formato | Eventos curtos (máx 1 dia, 5h) |
| Conversão | Pode ser baixa mesmo com CTR alto |
| Recorte | Subnichar (ex: ginecologistas, não "médicos") |

### 4.2 Psicólogos / Terapeutas

| Aspecto | Regra |
|---------|-------|
| Formato | Eventos de 3 horas funcionam bem |
| Comportamento | Valorizam fim de semana com família |
| Suporte | Humanizado e paciente |

### 4.3 Público Evangélico

| Aspecto | Regra |
|---------|-------|
| Rotina fixa | Cultos à tarde no sábado |
| Janela de evento | Antes ou depois dos cultos (ex: 14h-20h sáb) |

### 4.4 Nicho de Roupas / Fashion

| Aspecto | Regra |
|---------|-------|
| Dificuldade | Desafiador para escalar |
| Comportamento | Disposição menor de compra online |

### 4.5 Geração Z

| Aspecto | Regra |
|---------|-------|
| Comportamento | Diferente de tudo |
| Emocional | "Tudo é um drama" |
| Dificuldade | Difícil acertar a vontade |

---

## 5. Nichos SEM Benchmark Dedicado — Como Operar

Quando o aluno trabalha em nicho que não está documentado acima:

### 5.1 Procedimento

1. Identificar **dimensões próximas**:
   - Tipo de público: profissional liberal? CEO? mãe? jovem?
   - Faixa de ticket: low / mid / high
   - Frequência de compra: única? recorrente?
   - Maturidade do nicho: novo / saturado
2. Aplicar **benchmark geral** (seção 1) como linha base
3. Ajustar com **regras específicas por tipo de público** (seção 4) se aplicável
4. Sinalizar EXPLÍCITAMENTE pro expert: "esse número é benchmark geral / estimativa, não case validado nesse nicho específico"
5. **Coletar dados próprios desde o ciclo 1** pra começar a construir o benchmark do nicho

### 5.2 Template de Sinalização

```
"O benchmark que vou usar pro seu caso é {X}, mas é importante deixar claro:
não tenho case documentado de {nicho específico do aluno} no método consolidado.
Esse número vem de {benchmark geral / nicho próximo}. No primeiro ciclo, a gente coleta
dados reais e refina o benchmark pro seu nicho específico."
```

---

## 6. Lista de Nichos Pendentes (V2+ — Euriler Injeta)

Estes nichos foram mencionados em conversas mas ainda não têm case dedicado documentado. **Não inventar números pra eles.** Aguardar Euriler injetar quando case rodar.

- [ ] IA / Marketing com IA
- [ ] Mentoria / Mentoria Arcane
- [ ] Cristão / Influência cristã
- [ ] Empresarial / B2B
- [ ] Imobiliário (corretores)
- [ ] Advocacia (advogados trabalhistas, etc)
- [ ] Engenharia / Arquitetura
- [ ] Educação infantil
- [ ] Concursos / Educação alta-stakes
- [ ] {V2+ — Euriler adiciona conforme casos rodarem}

> **Quando um nicho desta lista virar case real**, esta lista move o item pra seção 2 com métricas + lições. Atualizar versão do documento.

---

## Sobre a Evolução deste Documento

| Versão | Data | Mudou o quê |
|--------|------|-------------|
| 1.0.0 | 2026-05-08 | V1 inicial — benchmarks gerais + 8 cases do método consolidado |
| 2.x | TBD | Euriler injeta benchmarks proprietários conforme cada novo case for documentado |

**Premissa:** este documento envelhece pra melhor — quanto mais ciclos rodam, mais nichos têm case próprio, mais o benchmark fica afinado. **V1 é genérico por design**, não por preguiça.

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
