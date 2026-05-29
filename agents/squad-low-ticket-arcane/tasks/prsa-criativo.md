---
task: "PRSA Criativo — 2 Fases (Copy → Producao)"
responsavel: "@lt-copywriter (Fase 1: ESCREVE) + @lt-creative-director (Fase 2: PRODUZ)"
atomic_layer: "task"
Entrada: "6 inputs verificados + 2-3 prototipos validados + Pagina pronta + headline + ruminacoes Score 4-5 + entregaveis 4+3"
Saida: "10 criativos PRSA gravados/editados (formatos diferentes, copies 100% diferentes, tom validado)"
execution_type: "sequential multi-agent"
---

# Task: PRSA Criativo — Estrutura Universal de Copy de Criativo

**Task ID:** squad-low-ticket-arcane/prsa-criativo
**Version:** 2.1.0 (pre-trabalho obrigatorio + protocolo de prototipos)

---

## Conceito

PRSA = **Problema + Rota + Solucao + Acao**. Estrutura obrigatoria pra criativo de perpetuo low ticket. Maxxima: "PRSA, PRSA. E automatico."

Criativo NÃO vende — leva pra pagina. Funcao unica: menor CVP possivel (<4% do produto = Criativo 3X).

---

## FRONTEIRA CRISTALINA (v2.0)

| Fase | O que faz | QUEM |
|------|-----------|------|
| **Fase 1 — Escrever** | EDI, ruminação Score 5, headline, **PRSA estratégico (texto)**, hooks textuais, empilhamento de gancho, palavras proibidas | **`lt-copywriter` (Quinn)** |
| **Fase 2 — Produzir** | Escolher formato visual, cenário, equipamento, gravar, montar Hulk/Lego, editar CapCut, validar matching visual | **`lt-creative-director` (Kevin)** |

**REGRA:** copywriter NUNCA produz. creative NUNCA escreve copy. Aluno que chega no Kevin pedindo PRSA é redirecionado pro Quinn.

---

## PRÉ-CONDIÇÕES OBRIGATÓRIAS (antes da Fase 1)

**LEI:** Quinn NÃO inicia a Fase 1 sem ter os 6 inputs verificados + 2-3 protótipos validados. Sem isso, todo batch grande vira lixo.

### Pré-condição A — Os 6 inputs verificados

| # | Input | Verificação | Fornece |
|---|-------|-------------|---------|
| 1 | EDI verificado | Fonte real (YouTube/TikTok/áudio aluna/votação Stories) ou marcada como HIPÓTESE | `lt-strategist` ou aluno |
| 2 | Página de vendas existe | Headline + bullets + entregáveis + autoridade + preço (mesmo rascunho) | `lt-page-master` |
| 3 | Pneu furado em 1 frase | "[Persona] que sente [dor central] mesmo [bind]" | `lt-strategist` |
| 4 | Mecanismo único | O QUE FAZ FUNCIONAR (não é entregável) | `lt-strategist` |
| 5 | Persona da gravação | Quem grava + vídeo de referência + vibe + ritmo + linguagem religiosa + show de produto | Aluno |
| 6 | Tom desejado | Acolhedor / confrontador / cinematográfico / vulnerável / convidativo / diagnóstico / conspiratório | Aluno |

**Se algum desses estiver faltando:** Quinn roda `*pre-trabalho` pra coletar com o aluno antes de seguir.

**Exceção page-first:** se o cliente quer fazer page-first (criativo informa página), declarar explicitamente e construir os 2 em paralelo.

### Pré-condição B — Protocolo de Protótipos

**REGRA INEGOCIÁVEL:** nunca cuspir batch de 10+ PRSAs antes de validar tom.

1. Quinn produz **2-3 protótipos curtos** com **estilos de abertura diferentes** (escolher 3 dos 6 estilos A-F catalogados em `data/core/estilos-de-abertura.md`)
2. Apresenta os 2-3 protótipos + pergunta de calibragem:
   - Tom geral OK?
   - Voz da persona da gravação?
   - Linguagem religiosa no ponto?
   - Comprimento e cadência?
   - Show do produto cabe?
3. Espera feedback EXPLÍCITO (não "mais ou menos" — pede o vetor: o que mudar, em que direção)
4. **Só então** cospe o batch de 10

### Sinais de "PARE, NÃO CONTINUE"

| Feedback do aluno | O que significa |
|-------------------|-----------------|
| "Mais ou menos" pra tudo | Problema sistêmico (tom errado, eixo errado), não refinamento de exemplos. PARA. Investiga. |
| "Não consigo imaginar a [persona] falando isso" | Tom errado, refazer |
| "Tá forçado / inconveniente / estranho" | Falta tato, refazer |
| "Tá soando como camelô / vendedor de tapete" | Em tema sensível, refazer com estilo lateral |

### Sinais de "estamos quase"

- "Esse aqui quase pegou" → identifica vetor e amplia
- "Gostei desse e desse, refaça os outros nesse estilo" → ok pra batch

---

## FASE 1 — ESCREVER (lt-copywriter)

**Comando entry sequencial:**
1. `*pre-trabalho` (no copywriter) — verifica 6 inputs
2. `*prototipos` (no copywriter) — 2-3 protótipos pra validar tom
3. `*prsa` (no copywriter) — só roda DEPOIS de 1+2 aprovados

### As 4 Partes do PRSA

| Letra | Nome | Funcao | Tempo no video |
|-------|------|--------|----------------|
| **P** | Problema/Desejo | Hook, dor, ruminacao | Primeiros 3-5s |
| **R** | Rota | Mostra que tem solucao, sobe consciencia | Trecho intermediario |
| **S** | Solucao | Apresenta produto, ONDE encontrar | Antes do CTA |
| **A** | Acao | CTA duplo "saiba mais" 2x com 10s | Ultimos segundos |

### Template (Quinn preenche)

```
[P] Voce esta cansada de [PROBLEMA / RUMINACAO SCORE 5]?
[R] A verdade e que [EXPLICACAO DO PORQUE ISSO ACONTECE].
[S] E por isso que eu criei o [PRODUTO], onde [BENEFICIO PRINCIPAL].
[A] Se voce quer ter acesso, e so tocar no botao abaixo e garantir agora mesmo.
[A2 — 10s depois] Toque no botao Saiba Mais agora.
```

### 10 Regras de Copy PRSA (do copywriter)

1. P + Promessa SEMPRE Juntos (não só dor isolada)
2. R não pula — sobe consciencia
3. Inflar Problema (fazer SENTIR) e Inflar Solucao (com peso)
4. Mostrar facilidade do produto na S
5. CTA duplo (2x "saiba mais" com 10s) — TEXTO escrito pelo Quinn
6. Preparar 3 versões de CTA (site / grupo / comercial) — TEXTO escrito pelo Quinn, gravacao do Kevin
7. Repetir promessa 2-3 vezes
8. Ruminacoes inicio max 2-3 (não 5+)
9. Nichar (mestre de obra > "prestador")
10. Clareza em 5 segundos

### Costura mínima por PRSA (anti AP5 Sovaco — versão criativo)

Cada PRSA precisa carregar **pelo menos 4 dos 6 elementos da página**:

- [ ] Termo-âncora da headline (palavra-chave que aparece no topo)
- [ ] Promessa-mãe ou parafraseamento próximo
- [ ] Pelo menos 1 sub-bullet da página
- [ ] Mecanismo / autoridade (livro/método/produto físico mostrado)
- [ ] Tempo (X dias)
- [ ] Nome do produto

**Audit:** ao entregar o batch, listar badge no final de cada PRSA com elementos costurados.

### Variedade real entre PRSAs no mesmo batch

Cada PRSA do batch deve variar em pelo menos **2 dos 4 vetores**:

| Vetor | Variações |
|-------|-----------|
| **Eixo emocional** | Quantos eixos a persona tem? (Ex: Deus, filhos, marido) |
| **Estilo de abertura** | 6 estilos A-F (consultar `data/core/estilos-de-abertura.md`) |
| **Comprimento** | 20-30s / 30-45s / 45-60s |
| **Mostra produto** | Sem show / show parcial / show máximo |

Sem variedade = 10 versões da mesma coisa = teste F1 sem sinal estatístico.

### Tom por tipo de tema

Consultar `data/kb/swipe-file/tom-por-tema.md`:

| Tema | Tons recomendados |
|------|-------------------|
| Sensível (vergonha, culpa, vazio íntimo) | Acolhedor + vulnerável + cinematográfico |
| Agressivo (frustração, raiva) | Confrontador + diagnóstico |
| Técnico (resultado, performance) | Convidativo + diagnóstico |

### Variante SA (Quinn decide)

Pula P e R, vai direto pra mecanismo + acao. Pra publico que JA conhece o problema.

### Comando ChatGPT pra Quinn gerar PRSA

```
Crie a copia de vendas de um criativo pra vender meu produto [NOME].
Vamos anunciar pra publico frio. Utilize a estrutura PRSA.

Detalhes:
- Persona: [X]
- Promessa principal: [headline da pagina]
- Mecanismo unico: [Y]
- Ruminacao Score 5: "[frase literal da persona]"

[ADICIONAR SEMPRE:]
Escreva exatamente as frases do dialogo interno dela, frases que brasileiros
falam sem formalidade, com girias e palavroes e expressoes reais.
```

### Output da Fase 1 (Quinn entrega ao Kevin)

```yaml
prsa_pacote:
  oferta: "[nome]"
  ruminacao_score_5: "[frase]"
  promessa_principal: "[headline]"
  palavras_proibidas_auditadas: true
  frases_chave_que_aparecem_na_pagina: ["X", "Y", "Z"]

  prsa_principal:
    p: "[texto literal]"
    r: "[texto literal]"
    s: "[texto literal]"
    a_principal: "[CTA literal]"
    a2_10s_depois: "[CTA literal]"

  variacoes_para_F1: # 10 copies diferentes
    - {p_alt_1, r, s, a}
    - {p_alt_2, r_alt_1, s, a}
    - {p_alt_3, r, s_alt_1, a}
    # ... 10 variacoes

  ctas_3_versoes:
    site: "[texto]"
    grupo: "[texto]"
    comercial: "[texto]"
```

→ Handoff pro Kevin: *"PRSA pronto. Te passo pro @lt-creative-director pra producao."*

---

## FASE 2 — PRODUZIR (lt-creative-director)

**Comando entry:** `*producao-prsa` (no creative-director)

**Pre-condicao:** receber pacote PRSA da Fase 1.

### Workflow do Kevin

1. **Receber pacote PRSA** do Quinn (input estruturado acima)
2. **Decidir formato visual** (18+ catalogados):
   - Selfie movimento? Dupla? Narrativo? Frankenstein?
   - Considerar: persona, mecanismo, expert pode aparecer?
3. **Setup equipamento:**
   - iPhone 4K 60fps, microfone obrigatorio
   - Cenario unico (clinica > escritorio > sala)
   - Roupa, luz, enquadramento 5x7 (1080x1920)
4. **Gravar** seguindo PRSA do Quinn LITERALMENTE
   - Repetir promessa 2-3x conforme regra
   - Gravar 3 CTAs alternativos (textos do Quinn)
5. **Editar CapCut:**
   - Legenda palavra unica branca + sombra
   - Acelerar voz 1.1-1.3x
   - Volume 400-1000 + cancelamento ruido
6. **Validar matching visual com pagina:**
   - Frases-chave do Quinn aparecem na pagina (1-2-3x)?
   - Hierarquia grafica espelhada?
7. **Output:** criativo .mp4 pronto pra subir

### O que Kevin NAO faz

- ❌ Não muda nenhuma palavra da copy do Quinn
- ❌ Não escreve hook novo (volta pro Quinn)
- ❌ Não inventa CTA (volta pro Quinn)
- ❌ Não decide variacao de fala (volta pro Quinn)

Se durante a gravacao Kevin sente que copy precisa ajuste → **handoff de volta pro Quinn**.

---

## Workflow Completo (Fase 1 → Fase 2)

```
Aluno chama "preciso de criativo"
  ↓
lt-chief detecta intent "criativo" → roteia pra lt-copywriter
  ↓
lt-copywriter (Fase 1):
  ├── *edi (se ainda nao tem)
  ├── *ruminacao-score
  ├── *prsa (gera pacote PRSA com 10 variacoes F1)
  └── handoff → @lt-creative-director
  ↓
lt-creative-director (Fase 2):
  ├── *producao-prsa (recebe pacote)
  ├── Define formato visual + cenario + equipamento
  ├── Grava (10 criativos F1, copies do Quinn)
  ├── Edita CapCut
  ├── *matching-pagina (valida)
  └── handoff → @lt-traffic-ops (subir ABO Testadora)
```

---

## Variacoes de Gancho (P) — quem escreve

**TODAS escritas pelo `lt-copywriter`:**

| Tipo | Exemplo |
|------|---------|
| Caixinha de Perguntas (fake) | "Pergunta no Insta + resposta video" |
| Dueto | Duas pessoas conversando |
| React | Tela verde + reagir a video |
| Narrativo | Voz sobre b-roll |
| Educacional | Dica tecnica + CTA produto |
| Mecanismo Tangivel | Mostra produto por dentro |
| ChatGPT | Pergunta GPT que recomenda |
| Errado vs Certo | Dualidade visual |
| Papel na mesa | Estilo Gabriel Carvalho |
| Objeto inusitado | Gera curiosidade |
| Mensagem WhatsApp | Simula conversa |
| Fake Podcast | Setup podcast simulado |
| Tela Dividida | Reportagem + expert reagindo |

**Kevin escolhe QUAL formato visualiza esse hook em VIDEO.**

---

## PRSA Espelha a Pagina (regra cardinal — anti AP5 Sovaco)

**Frases do criativo APARECEM na pagina (1-2-3 vezes).** — Quinn garante isso na escrita
**Gravar COM a pagina aberta na frente.** — Kevin executa isso na producao

> "Convido pra churrasco, chego la e e pizza." — desconexão.

Se durante producao Kevin nota desconexão TEXTUAL → volta pro Quinn costurar.

---

## Anti-Padroes

| AP | Detectar | Quem corrige |
|----|----------|--------------|
| **Material/método/curso/bônus** na copy | `lt-copywriter` audita |
| **Falar preço** no criativo | `lt-copywriter` audita |
| **Mockup fake** | `lt-creative-director` substitui por produto real |
| **Antes/depois** | `lt-creative-director` evita (Meta bloqueia) |
| **Duplo sentido** | `lt-copywriter` reescreve |
| **Copy de dor sem promessa** | `lt-copywriter` SEMPRE linka P+S |
| **Pular Rota** | `lt-copywriter` (R nao pula) |
| **AP5 Criativo do Sovaco** | `lt-creative-director` exige pagina aberta |
| **AP13 Pergunta-acusação como hook em tema sensível** | `lt-copywriter` usa entrada lateral (estilos A-F) |
| **AP14 Etiqueta-rótulo repetida** ("culpa silenciosa" 4-5x) | `lt-copywriter` nomeia 1x, mostra o sentimento o resto |
| **AP15 Listão em rajada** (4-5 sintomas sem pausa em tema íntimo) | `lt-copywriter` quebra com pausa + max 2-3 sintomas |
| **Cuspir batch sem protótipos** | `lt-copywriter` roda `*prototipos` ANTES do batch |
| **Inventar caso real** (nome ficcional + frase ficcional) em tema sensível | `lt-copywriter` usa estilo A (confissão própria) se não tem caso real |

---

## Output (10 criativos pra Teste Bifasico F1)

```yaml
criativos_f1:
  total: 10
  copies: "100% diferentes" (Quinn escreve as 10)
  formatos: 3+ tipos diferentes (Kevin produz)
  cenarios: 5+ ambientes (Kevin escolhe)
  duracao_media: "40s a 1min10s"
  cta_gravados_por_criativo: 3 (CTAs textuais do Quinn)
  audio_qualidade: microfone_obrigatorio (Kevin)
  matching_pagina: ✓ (frases do Quinn aparecem na pagina)
```

---

## Handoff Final

→ `lt-traffic-ops *fase-3D` — subir ABO Testadora 1-1-1 a 45%, meia-noite e tres
→ Quando F1 valida campeao: voltar Fase 1 com Quinn pra refinar copy do top + Fase 2 com Kevin pra 50-300 versoes (Teste Bifasico F2)

---

**Task Status:** Production Ready (v2.0 — fronteira clara)
