# Playbook — Instruções da Calculadora de Lançamento Pago (Plataforma Arcane)

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: built from scratch (PU-LP-013 — definição do Euriler sobre timing + instrução)
> Carregado por: estrategista-chief

---

## Para Que Serve Este Playbook

Define **quando** e **como** o agente `estrategista-chief` invoca a Calculadora de Lançamento Pago da plataforma Arcane (ferramenta externa que vive em `arcane.app/ferramentas/calculadora-lancamento-pago` ou rota equivalente — confirmar com o aluno se o path mudou). É a calculadora que define o orçamento, CPA target, projeção de faturamento e exposição de caixa do lançamento.

> "80% dos fundamentos antes de tocar em execução. Calculadora é o gate entre proposta e produção." (RC-001)

---

## Quando Invocar (Timing)

**APÓS:**
- [ ] Proposta fechada (Mecanismo Único + Mecanismo Tangível + Recorte 3D)
- [ ] Público específico definido + mapeamento DOR/DESEJO/MEDO/RUMINAÇÃO
- [ ] Meta de receita do ciclo definida pelo expert
- [ ] Decisão de produto principal + ticket

**ANTES DE:**
- [ ] Fechar a seção 3 do `documento-mestre.md`
- [ ] Delegar pro `copy-pagina` produzir briefing da página
- [ ] Delegar pro `anuncios` produzir lote de criativos

> **Não invocar antes da proposta estar fechada.** Calculadora alimentada com proposta fraca devolve número falso. Lixo entra, lixo sai.

---

## Como Instruir o Usuário (Script Padrão)

```
"Beleza, fechei a proposta + público + ticket aqui. Agora preciso do orçamento real
do lançamento pra travar o documento mestre.

Faz o seguinte:

1. Abre a plataforma Arcane
2. Vai na aba 'Ferramentas' → 'Calculadora de Lançamento Pago'
3. Preenche com:
   - Meta de receita: R$ {valor que definimos}
   - Ticket do produto principal: R$ {ticket}
   - Conversão estimada evento → vendas: {%} (uso 7-10% como default — calculadora pode sugerir outro)
   - CPA target ingresso: R$ {target — depende do preço do ingresso testado; CPA bom = R$25-R$40 quando ingresso na faixa do método R$38-R$67}
   - Preço do ingresso: R$ {preço}
4. A calculadora vai gerar um relatório com orçamento total, CPA projetado, ingressos esperados,
   faturamento, ROAS, exposição de caixa e breakeven
5. Exporta o resultado em .md (preferido) ou .pdf
6. Cola o conteúdo aqui no chat — ou anexa o arquivo

Eu pego esse output e fecho a Seção 3 do documento mestre. Depois disso a gente bota pra rodar."
```

**Tom da instrução:** direto, técnico, sem bajulação. Postura PU-LP-014 — educar enquanto coleta.

---

## Campos Esperados na Entrada da Calculadora

> **Aviso:** os campos exatos da Calculadora podem ter mudado desde 2026-05-08. Se algum campo não bate, o agente pergunta ao aluno qual o equivalente atual em vez de inventar valor.

Campos típicos com base na PU-LP-013:

| Campo | O Que Preencher | Default Sugerido |
|-------|-----------------|------------------|
| Meta de receita do ciclo | R$ total que o expert quer faturar | definido no documento-mestre |
| Ticket do produto principal | preço cheio do que vende no evento | definido no documento-mestre |
| Conversão evento → vendas | % esperado (frio: 7-13% pra R$2-10k; 2-5% pra R$10k+) | 8% pra R$2-10k |
| CPA target ingresso | quanto está disposto a pagar por cada ingresso | ≤ ticket do ingresso (RC-007) |
| Preço do ingresso | RC-015 — Preço da Escala (faixa R$27-R$67 sweet spot R$38-R$57, default R$38, ajustar via teste 48-72h ±R$10; R$97 raro, R$200-R$300 só nicho premium) | R$38 (default) / R$47 / R$57 |
| Conversão de página | % esperado (default ~7%) | 7% (frio) |
| Order bump (gravação) | preço da gravação | R$ 47-147 |
| Order bump conversão | % esperado | 14-30% |

---

## Como Interpretar o Resultado

A calculadora devolve (ou deveria devolver — confirmar com aluno se output mudou):

| Output | Como Ler | Bandeira Vermelha |
|--------|----------|-------------------|
| **Orçamento total recomendado** | Quanto investir em ad spend pro ciclo | Se > capacidade de caixa → reduzir meta |
| **CPA projetado** | Custo por aquisição estimado | Se > ticket do ingresso → RC-007 violada |
| **Ingressos esperados** | Quantos ingressos a calculadora projeta | Se < 200 e ticket alto: massa crítica do pitch fica fraca (15% retenção = 30 pessoas) |
| **Faturamento projetado** | R$ total no ciclo (ingresso + order bump + produto principal + pós-evento) | Comparar com a regra: exposição R$10-25k → faturamento R$150-300k |
| **ROAS projetado** | Faturamento / Ad spend | < 1.4: péssimo / 1.4-1.8: típico / 2.0+: bom / 10x+: base quente |
| **Exposição de caixa** | Quanto sai do bolso antes de qualquer venda | Tem que estar dentro da tolerância do expert — ele aguenta esse risco? |
| **Breakeven** | Quantos ingressos / vendas pra empatar | Se breakeven > 50% da meta de ingressos: muito apertado |

---

## Cenários de Inviabilidade (Quando a Calculadora Diz Não)

Se a calculadora retorna **margem negativa** OU **exposição de caixa > tolerância** OU **ROAS < 1.4**, NÃO seguir adiante. Ajustar UM dos seguintes:

### Ajuste 1 — Reduzir Meta

> Mais conservador. Diminui ROI projetado mas reduz risco.

```
"O número não fechou. Olha, a gente tem 4 caminhos. O primeiro é reduzir a meta de receita.
Se em vez de R$X a gente trabalha com R$Y, o orçamento cai pra Z e a exposição vai pra W.
Faz mais sentido pro seu momento de caixa?"
```

### Ajuste 2 — Aumentar Orçamento (se há cash)

> Mais ambicioso. Só se o expert tem cash pra colocar.

```
"Outra alternativa é a gente colocar mais grana no tráfego. Pra atingir R$X de meta,
calculadora pediu R$Y de ad spend. Você tem caixa pra isso? Se sim, esse caminho é o mais limpo."
```

### Ajuste 3 — Ajustar Proposta (mexer no produto)

> Trabalhoso. Volta pra fase de proposta.

```
"O caminho mais técnico: a calculadora tá dizendo que o ticket atual + o público atual
não fecham a conta. A gente pode subir o ticket do PRODUTO PRINCIPAL (RC-015 trata o
ingresso como Preço da Escala — ele é otimizado via teste, não usado pra fechar margem),
ou trocar o produto principal pra algo de R$ maior. Aí a margem volta. Quer mexer aí?"
```

### Ajuste 4 — Re-Segmentar Público

> Médio prazo. Mexer em quem é o público.

```
"Última opção: o público atual pode estar com poder de compra menor que o ticket pede.
A gente pode subnichar (ex: de 'médicos' pra 'ginecologistas') — público menor mas com
mais grana e mais qualificado. Calculadora rerroda com novo CPA e conversão."
```

---

## Postura Didática (PU-LP-014)

> **Não é só coletar número.** A calculadora é momento de educação — o expert precisa entender POR QUE cada input importa, qual a lógica do CPA, como ROAS se constrói. Isso reduz dependência futura e melhora os próximos ciclos.

Princípios de comunicação:

- Explica o que cada campo significa antes de pedir o número
- Quando devolve resultado, explica o trade-off (não só "deu X")
- Quando entra em ajuste por inviabilidade, deixa o expert escolher o caminho — não impõe
- Reforça que calculadora é estimativa, não realidade — primeiro ciclo desvia ±30%, terceiro fica afinado

---

## Output Esperado Após Rodar a Calculadora

O agente recebe o resultado em .md, valida contra os checks acima, e devolve:

```
Resultado da Calculadora — {data}

✅ ROAS projetado: X.X (target ≥ 2.0 — {🟢/🟡/🔴})
✅ CPA projetado: R$X (≤ ticket ingresso de R$Y — {🟢/🟡/🔴})
✅ Exposição de caixa: R$X (tolerância do expert: R$Y — {🟢/🟡/🔴})
✅ Breakeven: {N ingressos OU N% da meta} ({🟢/🟡/🔴})

{Se algum check é 🔴: aplicar Ajuste 1, 2, 3 ou 4 e rerrodar}
{Se todos 🟢 ou 🟡: colar resultado na seção 3.2 do documento-mestre.md e seguir}
```

---

## Notas de Versão

- **2026-05-08 — v1.0:** Construção inicial baseada em PU-LP-013. Path da calculadora e nomes dos campos podem ter mudado desde então. Agente confirma com o aluno antes de assumir defaults.

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
