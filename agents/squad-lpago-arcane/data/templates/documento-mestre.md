# Template — Documento Mestre do Lançamento

> **KB do Squad LPago Arcane — Templates/Playbooks**
> Tratamento: built from scratch (baseado em data/metodo/01-fundamentos.md + 02-proposta-municao.md + 09-referencia-tatica.md + REGRAS-CARDINAIS.md)
> Carregado por: estrategista-chief

---

## Para Que Serve Este Template

Este é o **documento mestre** que o agente `estrategista-chief` produz na fase de planejamento — antes de qualquer execução técnica entrar em jogo. É a fonte única de verdade do lançamento: cabeçalho, proposta, público, orçamento (vindo da Calculadora Arcane), cronograma, metas, validação contra Regras Cardinais.

Quando o aluno volta pra ajustar (re-segmentar público, mudar oferta, recalcular orçamento), é aqui que se mexe. As outras peças (página, anúncios, mensagens, diagnóstico) **derivam deste documento**.

> "80% do esforço nos fundamentos. Sem documento mestre fechado, não toca em página, anúncio ou tráfego." (RC-001)

---

## Quando Preencher

- **Antes de:** abrir Calculadora Arcane (campos 0-2 alimentam o cálculo).
- **Durante:** recebe o resultado da calculadora no campo 3.
- **Depois de:** definir todas as 7 seções, antes de delegar pro `copy-pagina`, `anuncios` e `copywriter-mensagens`.

---

## Estrutura Completa

### 0. Cabeçalho

```
- Cliente: {nome do expert | Euriler / aluno}
- Nicho / Subnicho: {ex: dentistas / ortodontistas mobile-first}
- Data início vendas: {DD/MM/AAAA}
- Data evento: {DD/MM/AAAA — sábado e domingo, formato 2 dias preferencial (RC-018)}
- Data fim do ciclo (encerramento Meteorico/carrinho): {DD/MM/AAAA}
- Versão deste documento: v{N} — {DD/MM/AAAA}
```

**Validação automática:**
- Janela início → evento entre 15-45 dias? Se não, anotar justificativa.
- Formato 2 dias? Se 1 dia, justificar (RC-018).

---

### 1. Tese e Proposta

> "A proposta é a peça que faltava. Tudo nasce dela." (data/metodo/02-proposta-municao.md)

#### 1.1 Mecanismo Único (o COMO da proposta)

{Descrever em 1-2 frases o sistema/método/framework que faz a transformação acontecer. Específico, técnico, tangível. Não genérico.}

**Exemplo de referência:**
- Genérico (fraco): "Método pra emagrecer"
- Específico (forte): "Sistema de 3 ciclos hormonais que regula o cortisol em 21 dias"

#### 1.2 Mecanismo Tangível (a PROVA visual/concreta)

{Como o lead "vê" o mecanismo funcionando — imagem mental concreta. Diagrama, sigla, framework com nome.}

#### 1.3 Recorte 3D (Crown Jewel)

A proposta total NÃO é específica o suficiente. **Recorte um pedaço e aprofunde.**

| Eixo | Pergunta-Guia | Sua Resposta |
|------|---------------|--------------|
| **Problema** | Qual problema específico você vai resolver (não a vida toda)? | {...} |
| **Dor Latente** | Qual dor pulsa nele toda semana por causa desse problema? | {...} |
| **Ruminação** | O que ele fala pra si mesmo quando essa dor aparece? | {...} |

#### 1.4 Proposta Final (formato sniper)

```
{Nome do produto/evento} — {Promessa técnica específica}
para {público específico}, em {tempo}, sem {medo/objeção mais forte}.
```

**Validação:**
- [ ] É produto, não aula (RC-002)?
- [ ] É a peça que faltava, não transformação genérica (RC-003)?
- [ ] Cabe na regra "se funciona pro frio, funciona pro quente" (RC-004)?

---

### 2. Público

#### 2.1 Recorte Específico

{Não pode ser "todo mundo". Quanto mais aberto, mais específica precisa ser a proposta pra compensar.}

```
Público primário: {ex: ginecologistas com mais de 5 anos de carreira que querem captar mais pacientes particulares}
Público secundário (se houver): {...}
```

#### 2.2 Mapeamento DOR/DESEJO/MEDO/RUMINAÇÃO

| Dimensão | O que mapeei |
|----------|--------------|
| **DOR** (o que mais dói) | {...} |
| **DESEJO** (o que ele mais quer) | {...} |
| **MEDO** (o que ele mais teme) | {...} |
| **RUMINAÇÃO** (o que ele fala pra si mesmo) | {...} |

#### 2.3 Critérios de Qualificação

```
Compra ingresso quem:
- {critério 1 — ex: já fatura 20-50k/mês}
- {critério 2 — ex: já tem clínica/consultório}
- {critério 3}

NÃO compra (filtrar fora):
- {anti-perfil 1}
- {anti-perfil 2}
```

#### 2.4 Tamanho Estimado da Fatia

```
- Fonte de estimativa: {ex: dados do CFM, dados de mercado, base própria}
- Tamanho aproximado do TAM: {N pessoas}
- % alcançável com tráfego pago em 30-45 dias: {N%}
```

---

### 3. Orçamento (Resultado da Calculadora Arcane)

> Esta seção é **preenchida com o output da Calculadora de Lançamento Pago da plataforma Arcane**. Ver `data/playbooks/instrucoes-calculadora-arcane.md` pra fluxo exato.

#### 3.1 Inputs Usados na Calculadora

```
- Meta de receita: R$ {...}
- Ticket do produto principal: R$ {...}
- Conversão estimada evento → vendas: {%}
- CPA target ingresso: R$ {...}
- Preço ingresso: R$ {... — RC-015 Preço da Escala: faixa R$27-R$67 sweet spot R$38-R$57, default R$38 com plano de teste 48-72h; fora da faixa exige justificativa de nicho premium (ex: médico)}
```

#### 3.2 Output da Calculadora (colar .md exportado)

```
{COLE AQUI O RESULTADO EXPORTADO DA CALCULADORA — orçamento total recomendado, CPA projetado,
ingressos esperados, faturamento projetado, ROAS projetado, exposição de caixa, breakeven}
```

#### 3.3 Validação do Orçamento

| Check | Status | Comentário |
|-------|--------|------------|
| ROAS projetado ≥ 2.0 (RC-007) | 🟢/🟡/🔴 | {...} |
| Exposição de caixa dentro da tolerância | 🟢/🟡/🔴 | {...} |
| CPA ≤ ticket do ingresso (RC-007) | 🟢/🟡/🔴 | {...} |
| Breakeven antes do evento | 🟢/🟡/🔴 | {...} |
| Faturamento R$ 150-300k esperado pra exposição R$ 10-25k? | 🟢/🟡/🔴 | {...} |

**Se algum check é 🔴:** voltar pra Calculadora, ajustar inputs (proposta, público, ticket, ou meta) antes de seguir.

---

### 4. Cronograma

#### 4.1 Datas-Chave

| Marco | Data | Responsável |
|-------|------|-------------|
| Início de vendas | {DD/MM} | estrategista-chief |
| Página no ar | {DD/MM} | copy-pagina |
| Primeiros anúncios ativos | {DD/MM} | anuncios |
| Início antecipação (T-7d antes do evento) | {DD/MM} | copywriter-mensagens |
| Dia 1 do evento | {DD/MM, sábado} | — |
| Dia 2 do evento | {DD/MM, domingo} | — |
| Início Meteorico (downsell) | {DD/MM, segunda pós-evento} | copywriter-mensagens |
| Encerramento ciclo (sexta pós-Meteorico 23h59) | {DD/MM} | — |

#### 4.2 Sequência de Mensagens (Visão Geral)

> Detalhamento por canal/disparo vai pro `copywriter-mensagens` produzir nos templates de comunicação. Aqui só o esqueleto temporal.

| Fase | Quando | Canais Ativos | Quem Produz |
|------|--------|---------------|-------------|
| Antecipação pré-evento | T-7d → T-1d | grupo WA + API individual + email | copywriter-mensagens |
| Dia 1 do evento | T0 sábado | grupo WA + API individual (recovery) | copywriter-mensagens |
| Dia 2 do evento | T+1 domingo | grupo WA + API individual + email | copywriter-mensagens |
| Pós-evento / Meteorico | T+2 → T+9 | grupo Meteorico + API individual + email | copywriter-mensagens |

#### 4.3 Marcos Críticos

- [ ] Onboarding pós-compra do ingresso ativo (Calendar + lembrete + pesquisa)
- [ ] Grupo WA do evento criado e quente antes da antecipação
- [ ] Pitch 1 ancora tempo pela METADE (RC-020)
- [ ] Pitch 2 SEMPRE antes do almoço (RC-012)
- [ ] Conteúdo mais forte nas primeiras 2-3h do dia 1 (RC-019)
- [ ] Order bump (gravação) configurado no checkout (RC-016)
- [ ] Carrinho permanece aberto pós-evento por 7 dias (RC-014)

---

### 5. Metas

> Metas precisam ser COERENTES com o output da calculadora (seção 3). Se diferem, recalcular.

| Indicador | Meta | Fonte da Meta |
|-----------|------|---------------|
| Ingressos vendidos (pré-evento) | {N} | calculadora |
| Comparecimento ao vivo | {%, ~15% retenção até pitch} | RC / VOL-09 |
| Conversão evento → produto principal | {7-13% pra ticket R$2-10k, 2-5% pra R$10k+} | data/metodo/09 |
| ROAS projetado | {≥2.0} | calculadora + RC-007 |
| Faturamento total meta | R$ {...} | calculadora |
| % do faturamento vindo do pós-evento | 40-60% (RC-014) | regra cardinal |

---

### 6. Validação Contra Regras Cardinais

> 20 RCs em `data/metodo/REGRAS-CARDINAIS.md`. Marcar status de cada uma aplicável ao contexto.

| RC | Aplicável? | Status (🟢/🟡/🔴) | Comentário |
|----|-----------|-------------------|------------|
| RC-001 — 80% fundamentos | sempre | {...} | {...} |
| RC-002 — Produto, não aula | sempre | {...} | {...} |
| RC-003 — Peça que faltava | sempre | {...} | {...} |
| RC-004 — Funciona pro frio | sempre | {...} | {...} |
| RC-007 — CPA é Rei | sempre | {...} | {...} |
| RC-012 — Pitch antes de intervalo | sempre | {...} | {...} |
| RC-014 — 40-60% pós-evento | sempre | {...} | {...} |
| RC-015 — Ingresso = Preço da Escala (faixa R$27-R$67, default R$38, teste 48-72h; fora da faixa = justificar nicho) | sempre | {...} | {...} |
| RC-016 — Order bump obrigatório | sempre | {...} | {...} |
| RC-017 — Uma oferta no evento | sempre | {...} | {...} |
| RC-018 — 2 dias > 1 dia | sempre | {...} | {...} |
| RC-019 — Conteúdo forte nas primeiras horas | sempre | {...} | {...} |
| RC-020 — Ancoragem de tempo (metade no Pitch 1) | sempre | {...} | {...} |
| {outras se aplicável} | {...} | {...} | {...} |

**Bloqueio:** se qualquer RC aplicável estiver 🔴, NÃO avançar pra execução. Resolver primeiro.

---

### 7. Versionamento

| Versão | Data | Mudou o quê | Por quê |
|--------|------|-------------|---------|
| v1 | {DD/MM} | Versão inicial | Planejamento inicial |
| v2 | {DD/MM} | {ex: ajustou ticket de R$2k pra R$3k} | {ex: calculadora mostrou margem apertada} |
| ... | | | |

---

## Checklist de Saída

Antes de delegar pro `copy-pagina`, `anuncios`, `copywriter-mensagens`:

- [ ] Seções 0-7 todas preenchidas
- [ ] Calculadora rodada e output colado em 3.2
- [ ] Todas as RCs aplicáveis com status 🟢
- [ ] Pelo menos um humano (Euriler ou aluno) revisou e aprovou
- [ ] Versão atual registrada na seção 7

---

**Última atualização:** 2026-05-08
**Versão:** 1.0.0
