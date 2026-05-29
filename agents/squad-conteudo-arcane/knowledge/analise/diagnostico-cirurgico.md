# Diagnóstico Cirúrgico de Posts

**Aplicação:** Aria usa em todo post analisado.
**Princípio:** cada métrica falhada aponta pra UMA causa específica. Identificar a causa = saber o que ajustar.

---

## Resumo Visual

```
═══════════════════════════════════════════════════════════════
MÉTRICA           | THRESHOLD | SE FALHA → PROBLEMA EM:
═══════════════════════════════════════════════════════════════
Taxa após 3s      | >50%      | GANCHO (hook)
Tempo médio       | 25-30%    | ESTRUTURA / CONTEÚDO
Interação/views   | >10%      | CTA ou NOTABILIDADE
═══════════════════════════════════════════════════════════════
```

---

## Métrica 1 — Taxa Após 3 Segundos

### O Que Mede

% de pessoas que continuaram assistindo após o 3º segundo.

### Threshold

**>50% pra algoritmo entregar bem.**

Abaixo disso, algoritmo corta entrega (entendido como "conteúdo não é relevante").

### Se Falha: PROBLEMA NO GANCHO

**Causas possíveis:**

1. **Hook verbal genérico**
   - Frase de abertura sem gatilho
   - "Hoje eu vou falar..." (clichê)
   - Sem punch

2. **Hook visual fraco**
   - Cenário comum sem elemento que chama atenção
   - Pessoa sem postura forte
   - Sem movimento ou elemento visual marcante

3. **Hook textual ausente ou fraco**
   - Capa sem texto (perde 70% que vê sem som)
   - Texto pequeno, fonte ilegível
   - Texto irrelevante (não conecta com hook verbal)

4. **Sem combinação de gatilhos**
   - Usou só 1 gatilho dos 7
   - Gatilho fraco (Mistério genérico, sem peso)

### Ações Sugeridas

✓ Combinar 2-3 gatilhos (Recompensa + Mistério; Disrupção + Reconhecimento)
✓ Garantir 3 camadas alinhadas (verbal + visual + textual)
✓ Visual: começar com elemento que para scroll
✓ Texto na tela: palavra-chave grande, alto contraste

---

## Métrica 2 — Tempo Médio de Visualização

### O Que Mede

Quanto tempo (em média) cada pessoa assistiu do vídeo.

### Threshold

**25-30% da duração total.**

Acima disso = algoritmo amplifica. Abaixo = corta entrega.

### Se Falha: PROBLEMA NA ESTRUTURA / CONTEÚDO

**Causas possíveis:**

1. **Looping não fechou**
   - Prometeu algo no hook e demorou demais pra entregar
   - Pessoa frustrou e saiu

2. **Transição perdeu ritmo**
   - Corte/mudança quebrou fluxo
   - Pessoa se distrai

3. **Conteúdo raso no meio**
   - Info nova fraca
   - Sem elementos notáveis
   - Pasteurizado

4. **Construção de raciocínio frouxa**
   - Saltos lógicos
   - Pessoa não acompanha

5. **Sem variação emocional**
   - Monotom adormece

### Ações Sugeridas

✓ Fechar loopings em <20s do hook (ou abrir novo antes)
✓ Aplicar 3-5 elementos notáveis dos 8
✓ Variar emoção a cada 5-10s
✓ Construir raciocínio crescente (cada parte sustenta a próxima)
✓ Cortar partes que não acrescentam

---

## Métrica 3 — Interação por Visualização

### O Que Mede

% de visualizações que viraram engajamento.

Cálculo: (curtidas + comentários + compartilhamentos + salvamentos) ÷ views × 100

### Threshold

**>10% pra viralizar.**

### Se Falha: PROBLEMA NO CTA OU NOTABILIDADE

#### A) CTA Genérico ou Ausente

- "Curte, comenta, segue" → genérico, ninguém faz
- Sem CTA → pessoa vê e segue scroll
- CTA no início → destrói entrega

#### B) Conteúdo Não-Notável

- Sem polêmica → ninguém comenta
- Sem identificação → ninguém compartilha
- Sem info nova → ninguém salva
- Sem valor prático → ninguém volta

### Ações Sugeridas

**Pro CTA:**
✓ Específico de RECONHECIMENTO: "Compartilhe com [tipo de pessoa]"
✓ DEPOIS da entrega top
✓ Conectado ao conteúdo

**Pra Notabilidade:**
✓ Polêmica controlada (gera comentário)
✓ Identificação forte (gera compartilhamento)
✓ Valor prático (gera salvamento)
✓ Fato curioso (gera comentário "não sabia!")

---

## Padrões de Combinação

Diagnósticos combinados:

### Pattern A — Gancho ruim, resto bom

```
3s: 35% ✗
Tempo médio: OK ✓
Interação: OK ✓
```

**Interpretação:** quem ficou, gostou. Poucos ficaram.

**Ação:** REFAZER mesmo post com hook melhor.

### Pattern B — Gancho bom, conteúdo raso

```
3s: 60% ✓
Tempo médio: 18% ✗
Interação: 6% ✗ (consequência)
```

**Interpretação:** hook fisgou, mas conteúdo não sustentou.

**Ação:** revisar corpo — mais elementos notáveis, melhores loopings, variação emocional.

### Pattern C — Tudo bom mas baixa interação

```
3s: 60% ✓
Tempo médio: 30% ✓
Interação: 6% ✗
```

**Interpretação:** entrega boa mas CTA fraco OU sem polêmica/identificação.

**Ação:** melhorar CTA específico + adicionar elemento polêmico/identificação.

### Pattern D — Tudo top

```
3s: 70% ✓
Tempo médio: 40% ✓
Interação: 15% ✓
```

**Interpretação:** vídeo viral.

**Ação:** identificar PADRÃO (formato + tema + hook + elementos) e ESCALAR.

### Pattern E — Tudo baixo

```
3s: 30% ✗
Tempo médio: 15% ✗
Interação: 4% ✗
```

**Interpretação:** problema sistêmico. Tema fora do nicho? Tom errado? Formato errado?

**Ação:** revisar desde o tema (talvez não bate com público).

---

## Identificação Complementar (não só números)

Aria identifica também:

```
TEMA usado: {qual + categoria das 16}
  Está em categoria forte do nicho?
  Foi tema viral ou tema do momento?

HOOK usado: {frase + gatilhos identificados}
  Quantos gatilhos? (1, 2, 3+)
  Hook tem 3 camadas? (verbal/visual/textual)

ESTRUTURA macro: {Hook + Intro + Conteúdo + CTA estava completa?}
  Faltou alguma parte?
  Tava na ordem certa?

ELEMENTOS NOTÁVEIS aplicados: {quais dos 8}
  Quantos?
  Os mais fortes (info nova, prova, contra-intuitivo) tavam?

FORMATO: {qual da biblioteca}
  Era formato validado do expert?
  Era teste de formato novo?

TOM DE VOZ: {mantido conforme perfil ou desviou?}
```

---

## Análise Comparativa (Múltiplos Posts)

**Princípio:** 1 post = anomalia. 3+ posts com padrão = sinal.

Quando Aria tem 3+ posts:

**TOP performers** (acima dos thresholds):
- O que tinham em comum?
- Mesmo formato? Mesmo tema? Mesmo hook?
- Quais elementos notáveis recorrentes?

**BOTTOM performers** (abaixo):
- O que tinham em comum?
- Onde quebrou consistentemente?

Resultado: padrões claros + recomendações de escala (formato vs assunto).

---

## Limitações Que Aria Sempre Sinaliza

```
⚠️ AMOSTRA PEQUENA: 1 post não é padrão.
⚠️ MÉTRICAS INCOMPLETAS: faltou X — diagnóstico parcial.
⚠️ POST RECENTE: ainda em fase de descoberta. Reavaliar em 5-10 dias.
⚠️ FORA DA CADÊNCIA: 1 post isolado não reflete potencial.
```

---

## Aplicação no Squad

Aria usa diagnóstico cirúrgico em:
- Análise individual de 1 post (`analisar-post.md`)
- Análise comparativa de N posts (`analisar-batch.md`)
- Como base pra recomendações estratégicas
