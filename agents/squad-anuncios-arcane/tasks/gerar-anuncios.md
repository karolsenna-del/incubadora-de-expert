---
task: "Gerar Anúncios"
responsavel: "@teo-criativo"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Brief de inteligência (Fase 3) pronto em research/briefs/ + contexto do produto/oferta do expert"
Saida: "Lote de 20+ anúncios sugeridos (ângulo + formato + hook + roteiro) salvo em research/anuncios/"
Checklist:
  - "Brief lido e vetores extraídos (ângulos, formatos, hooks, gaps, C1/C2/C3)"
  - "Contexto do expert captado (produto, promessa, persona, mecanismo tangível, tom)"
  - "Modo de operação escolhido pelo expert (Freestyle ou Seguro)"
  - "20+ anúncios gerados, cada um ancorado em dado"
  - "Diversidade tripartite garantida (mecânica, visual, temática)"
  - "Cobertura C1/C2/C3"
  - "Lote salvo em research/anuncios/ e apresentado"
execution_type: "interactive"
---

# Task: Gerar Anúncios — Lote de 20+ Criativos Sugeridos

**Task ID:** squad-anuncios-arcane/gerar-anuncios
**Version:** 1.0.0
**Responsável:** @teo-criativo

> O Téo SEMPRE consulta `knowledge/criativos/` (6 docs) antes e durante a geração.
> Cada anúncio é ancorado em dado (brief) ou princípio (KB) — nada inventado.

---

## Step 1: Ler os insumos

1. **Brief** — localizar o mais recente em `research/briefs/ad-brief-{YYYY-MM-DD}.md`. Ler inteiro, com foco em:
   - Seção 1 (Executive Summary) — os 6 achados
   - Seção 2 (Landscape) — tabelas Ângulo × Longevidade e Formato × Longevidade
   - Seção 7 (Strategic Playbook) — os anúncios prioritários e o que evitar
   - Per-Competitor Micro Briefs — hooks exatos citados
2. **Banco de anúncios** (opcional) — se precisar de mais exemplos de hook, consultar a tabela `Ad Research` no Airtable (campos `Hook (Video)`, `Body Text`, `Angle Category`, `Ad Format Type`, `Start Date`).

Se não houver brief: avisar o expert que vai gerar pela KB + contexto, sem o filtro competitivo do nicho dele. Recomendar rodar o pipeline antes.

---

## Step 2: Extrair os vetores do brief

Montar, a partir do brief:

| Vetor | O que extrair |
|-------|---------------|
| **Ângulos vencedores** | Os ângulos com mais Long-Runners / maior mediana de longevidade |
| **Ângulos saturados** | Os que todos os concorrentes usam — usar com twist ou evitar o óbvio |
| **Gaps de ângulo** | Ângulos de baixa adoção no nicho que funcionam em adjacentes |
| **Formatos validados** | Os formatos com mais Long-Runners |
| **Hooks de longevidade** | Os hooks exatos dos anúncios que mais sobreviveram (modelar, não copiar) |
| **Distribuição C1/C2/C3** | Como o nicho se distribui — calibrar o lote |
| **O que evitar** | Formatos/durações com zero Long-Runner |

---

## Step 3: Captar o contexto do expert

Perguntar (pular o que já veio no handoff do Argus):

1. **Produto/oferta** — o que exatamente esses anúncios vão vender?
2. **Promessa central** — o resultado tangível que o cliente leva
3. **Persona** — quem é, e qual a ruminação principal dela (a frase que ela pensa pra si)
4. **Mecanismo tangível** — tem algo que dá pra mostrar na tela? (planilha, print, ferramenta, framework)
5. **Tom / contexto** — é low ticket (oferta direta a frio) ou high ticket / evento? (muda a copy — ver palavras proibidas em `04-estruturas-e-copy.md`)
6. **Quantidade** — default 20+; aceitar mais se o expert pedir

---

## Step 3B: Escolher o modo de operação

Antes de gerar, o Téo apresenta os 2 modos e o expert escolhe. **O Téo NUNCA assume o modo.**

```
Antes de eu escrever, escolhe como você quer que eu trabalhe:

🔥 FREESTYLE (Clonagem) — eu pego os anúncios que mais
   sobreviveram dos teus concorrentes, faço engenharia reversa
   do padrão e adapto pra tua realidade. Ousado, variado — se
   o mercado validou, eu replico, mesmo que fuja do "manual".

🛡️ SEGURO (Método) — eu construo pelos frameworks consagrados
   e valido cada anúncio nos checklists e anti-padrões. Mais
   previsível, à prova de erro. Os dados entram como validação.

Qual? (se estiver em dúvida: primeira vez com anúncio → Seguro;
já roda tráfego e quer ousar → Freestyle)
```

Registrar o modo escolhido — ele governa o Step 4.

---

## Step 4: Gerar o lote (20+ anúncios)

### Ramificação por modo

**Modo 🔥 Freestyle (Clonagem):**
- Ponto de partida: a lista de anúncios **Long-Runner** do brief / banco de anúncios.
- Para cada anúncio-fonte relevante: extrair o padrão (estrutura, tipo de hook, ângulo, ritmo) e **clonar adaptando** pro nicho, oferta e ruminação da persona do expert.
- A KB é repertório — usar pra nomear e enriquecer, **não pra filtrar**. Se o padrão clonado contraria um framework da KB, manter o padrão (o dado venceu).
- Campo `MODELANDO` de cada anúncio: qual anúncio-concorrente foi clonado + o que foi adaptado.

**Modo 🛡️ Seguro (Método):**
- Ponto de partida: a **KB** — escolher ângulo (`01`), formato (`02`) e estrutura (`04`) pelos frameworks.
- Os dados do brief entram como **validação**: priorizar ângulos/formatos que o brief confirma terem longevidade.
- Antes de aprovar cada anúncio, rodar os checklists da KB (hook, estrutura, anti-padrões, palavras proibidas, diversidade).
- Campo `MODELANDO` de cada anúncio: o framework usado + "passou no checklist".

Os passos abaixo (distribuição C1/C2/C3, diversidade, formato de saída) valem pros 2 modos.

### Montagem

Para cada anúncio, montar via combinação **Ângulo × Formato × Consciência**:

### Distribuição-alvo (20 anúncios — ajustar pelo brief)
- ~8 anúncios **C1** (consciência baixa — dor, conteúdo de valor, quebra de padrão)
- ~7 anúncios **C2** (consciência média — hard sell, demonstrativo, comparativo)
- ~5 anúncios **C3** (consciência alta — prova social, objeção, urgência, remarketing)

### Diversidade obrigatória no lote
- **Mecânica:** mix de vídeo curto + estático + carrossel (não 20 vídeos)
- **Visual:** formatos visuais variados (talking head, diálogo, POV, demonstração, narrado, react...)
- **Temática:** ângulos variados (dor, desejo, prova, curiosidade, disrupção...)

### Cada anúncio entrega
```
ANÚNCIO {NN} — {FORMATO}_{angulo}_{C1|C2|C3}_H{NN}
Ângulo:   {qual + evidência do brief}
Formato:  {qual + evidência do brief}
Nível:    {C1/C2/C3 + quem é esse público}
HOOK (3-5s):  {a abertura — 2-3 gatilhos identificados}
ROTEIRO:  {roteiro completo na estrutura escolhida —
           Universal 4 partes / Ruminação / Conflito-Virada-Mudança / PRSA}
NOTA DE PRODUÇÃO:  {como gravar — formato, vertical 9:16, lo-fi}
MODELANDO:  {qual hook/anúncio de concorrente do brief inspirou}
```

### Regras de geração
- Hook com 2-3 gatilhos combinados naturalmente (ver `03-hooks-e-headlines.md`)
- Estrutura de roteiro adequada ao formato e à consciência (ver `04-estruturas-e-copy.md`)
- Low ticket → respeitar palavras proibidas; usar protocolo/pack/guia
- Nunca abrir com a marca nem com "Oi gente"
- Mecanismo tangível presente sempre que o expert tiver um
- Modelar os hooks de longevidade do brief — adaptar, não copiar

---

## Step 5: Validar o lote (antes de salvar)

- [ ] Modo escolhido pelo expert e respeitado na geração
- [ ] 20+ anúncios gerados
- [ ] Cobertura C1/C2/C3
- [ ] Mix mecânico (tem vídeo, estático e carrossel)
- [ ] Ângulos variados — não é o mesmo ângulo 20x
- [ ] Cada anúncio tem evidência (brief ou KB)
- [ ] Nenhum hook abre com marca ou "Oi gente"
- [ ] Low ticket: zero palavras proibidas

---

## Step 6: Salvar e apresentar

1. Salvar em `research/anuncios/anuncios-sugeridos-{YYYY-MM-DD}.md` — lote completo, organizado por nível de consciência.
2. Apresentar ao expert: resumo do lote (quantos por C, por formato) + **os 3-5 pra produzir primeiro** (os de ângulo/formato mais validado no brief), com o porquê.
3. Devolver o controle pro Argus.

---

## Quality Gate — QG-SAA-005 (estende o do brief)

Lote aprovado quando: 20+ anúncios, cobertura C1/C2/C3, diversidade tripartite real, cada anúncio ancorado, salvo em arquivo.

---

**Task Status:** Ready for Production
