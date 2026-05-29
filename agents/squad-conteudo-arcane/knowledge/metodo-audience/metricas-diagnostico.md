# Método Audience — Métricas-Chave e Diagnóstico Cirúrgico

**Aplicação:** análise pós-publicação (Aria).
**Princípio:** 3 métricas determinam se o algoritmo entrega ou não. Cada uma indica problema específico.

---

## As 3 Métricas-Chave

### Métrica 1 — TAXA APÓS 3 PRIMEIROS SEGUNDOS

**O que mede:** % de pessoas que continuaram assistindo após o 3º segundo.

**Threshold:** **>50%**

**Cálculo:** (views após 3s) ÷ (views totais) × 100

**Onde encontrar (Instagram Insights):**
- Reels → Estatísticas → "Tempo de exibição médio" + "Visualizações iniciais"
- Algumas versões mostram "Taxa de retenção nos primeiros segundos"

### Diagnóstico se Falha (<50%)

**Problema:** GANCHO FRACO

**Causas possíveis:**
1. **Hook verbal:** frase de abertura sem gatilho ou genérica
2. **Hook visual:** cenário não chama atenção / pessoa sem postura forte
3. **Hook textual:** sem texto na tela OU texto irrelevante
4. **Sem combinação de gatilhos:** usou só 1 gatilho fraco

**Ações sugeridas:**
- Combinar 2-3 gatilhos diferentes (recompensa + mistério / disrupção + reconhecimento)
- Garantir 3 camadas alinhadas (verbal + visual + textual)
- Visual: começar com elemento que para o scroll (objeto, expressão, movimento)
- Texto na tela: palavra-chave grande, alto contraste

---

### Métrica 2 — TEMPO MÉDIO DE VISUALIZAÇÃO

**O que mede:** quanto tempo (em média) cada pessoa assiste do vídeo.

**Threshold:** **25-30% da duração total**

**Cálculo:** (tempo médio) ÷ (duração total) × 100

**Onde encontrar:**
- Reels → Estatísticas → "Tempo de exibição médio"

**Padrão por duração do vídeo:**

| Duração total | Tempo médio mínimo |
|---------------|--------------------|
| 30 segundos | 8-10s (~30%) |
| 60 segundos | 15-20s (~25-33%) |
| 90 segundos | 22-27s (~25-30%) |
| 3 minutos | 36-54s (~20-30%) |

### Diagnóstico se Falha (<25%)

**Problema:** ESTRUTURA / CONTEÚDO

**Causas possíveis:**
1. **Looping não fechou:** prometeu algo no hook e demorou demais pra entregar
2. **Transição perdeu ritmo:** corte/mudança quebrou fluxo
3. **Conteúdo raso no meio:** info nova fraca, sem elementos notáveis
4. **Construção de raciocínio frouxa:** pessoa não acompanha a lógica

**Ações sugeridas:**
- Fechar loopings em <30s do hook (ou abrir novo já antes de fechar)
- Aplicar mais elementos notáveis no meio (3-5 dos 8)
- Variação emocional ao longo (raiva, alívio, choque...)
- Estrutura crescente: cada parte sustenta a próxima
- Cortar parte que não acrescenta

---

### Métrica 3 — INTERAÇÃO POR VISUALIZAÇÃO

**O que mede:** % de visualizações que viraram engajamento (curtir, comentar, compartilhar, salvar).

**Threshold:** **>10%** pra viralizar

**Cálculo:** (curtidas + comentários + compartilhamentos + salvamentos) ÷ views × 100

**Onde encontrar:**
- Reels → Estatísticas → soma dos números de cada interação
- Apify retorna alguns desses campos (não todos)

### Diagnóstico se Falha (<10%)

**Problema:** CTA ou NOTABILIDADE

**Causas possíveis:**

**(A) CTA genérico ou ausente:**
- "Curte, comenta, segue" → genérico, ninguém faz
- Sem CTA → pessoa vê e segue scroll
- CTA no início → destrói entrega e ninguém chega ao CTA

**(B) Conteúdo não-notável:**
- Sem polêmica → ninguém comenta
- Sem identificação → ninguém compartilha
- Sem info nova → ninguém salva

**Ações sugeridas:**

**Pro CTA:**
- Específico de RECONHECIMENTO: "Compartilhe com todo [tipo de pessoa]"
- DEPOIS da entrega top
- Conectado ao conteúdo (não solto)

**Pra Notabilidade:**
- Adicionar polêmica controlada (gera comentário)
- Adicionar identificação forte (gera compartilhamento)
- Adicionar valor prático (gera salvamento)
- Adicionar fato curioso (gera comentário tipo "não sabia!")

---

## Os 3 Objetivos do Conteúdo

Cada métrica corresponde a um objetivo:

| Objetivo | Métrica | Threshold |
|----------|---------|-----------|
| **1. Fazer parar** | Taxa após 3s | >50% |
| **2. Fazer assistir até o fim** | Tempo médio | 25-30% |
| **3. Fazer engajar** | Interação/view | >10% |

Se os 3 objetivos batem → algoritmo entrega exponencialmente → viral.

Se 1 ou mais falham → entrega cai → flop.

---

## Diagnóstico Combinado

Padrões comuns de combinação:

### Pattern A — Gancho ruim, resto bom
- Taxa após 3s: <50% ✗
- Tempo médio: OK ✓
- Interação: OK ✓

**Interpretação:** quem ficou, gostou. Mas poucos ficaram.

**Ação:** REFAZER mesmo post com hook melhor.

### Pattern B — Gancho bom, conteúdo raso
- Taxa após 3s: OK ✓
- Tempo médio: <25% ✗
- Interação: <10% ✗ (consequência)

**Interpretação:** hook fisgou, mas conteúdo não sustentou.

**Ação:** revisar estrutura do meio — mais elementos notáveis, melhores loopings.

### Pattern C — Tudo bom mas baixa interação
- Taxa após 3s: OK ✓
- Tempo médio: OK ✓
- Interação: <10% ✗

**Interpretação:** entrega boa mas CTA fraco OU sem polêmica/identificação que dispare reação.

**Ação:** melhorar CTA específico de reconhecimento + adicionar elemento polêmico/identificação.

### Pattern D — Tudo top
- Os 3 acima do threshold

**Interpretação:** vídeo viral. Algoritmo amplifica.

**Ação:** identificar PADRÃO (qual formato + qual tema + qual hook) e ESCALAR.

---

## Análise Comparativa (Múltiplos Posts)

Aria não tira conclusão de 1 post. **Mínimo 3 posts com padrão = sinal.**

Comparativos chave:

**Top vs Bottom Performers:**
- O que tinham em comum os tops?
- O que tinham em comum os flops?
- Padrão de hook? Tema? Formato? Elementos notáveis?

**Por Formato:**
- Carrossel vs Reels: qual performa melhor pro expert?
- Lo-fi vs Análise: qual gera mais interação?

**Por Tema (categoria):**
- Dores performam melhor que Desejos no nicho?
- Polêmicas (Inimigos) geram mais comentário?

**Por Hook (gatilho):**
- Disrupção vs Reputação: qual gera mais 3s?
- Reconhecimento + Recompensa: qual combinação ganha?

---

## Sinalização de Limites

Aria sempre sinaliza quando dado é insuficiente:

```
⚠️ AMOSTRA PEQUENA:
1 post não é padrão. Pode ser sorte ou anomalia.
Pra conclusão firme, junte 3+ posts com mesmo padrão.

⚠️ MÉTRICAS INCOMPLETAS:
Apify não traz tempo médio nem taxa após 3s.
Pra diagnóstico completo, manda print do Insights.

⚠️ DADOS DEFASADOS:
Métricas só fazem sentido após 5-10 dias de publicação.
Antes disso, ainda tá em fase de descoberta do algoritmo.
```

---

## Aplicação no Squad

- **Rico** usa os thresholds como guia ao escrever (mira em hook que vai >50%)
- **Aria** diagnostica posts publicados aplicando as 3 métricas + identificação dos elementos
- **Iris** recebe insights de comentários (via Aria) pra atualizar pool
- **Vox** repete os princípios quando expert travar ("hook fraco = 3s flopa = algoritmo corta entrega")
