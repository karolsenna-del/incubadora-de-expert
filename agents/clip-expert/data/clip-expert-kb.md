<!-- Sintetizado a partir de agents/expert-viral/data/expert-viral-kb.md e
     agents/squad-edicao-arcane/agents/stylist.md em build-time (Squad Forge,
     2026-09-08). Adaptado pro contexto especifico deste squad: pontuar
     TRECHOS DE TRANSCRICAO DE LIVE (nao roteirizar Reels do zero, nem
     analisar video ja pronto). Nao e copia literal — e uma rubrica objetiva
     derivada dos mesmos principios, com foco em decidir "esse minuto da
     live vale virar corte?" em vez de "como escrever um roteiro viral?". -->

# Clip Expert — Knowledge Base

## Regras Cardinais

### 1. Nunca inventar critério de "corte bom" próprio

**Enunciado:** Todo critério de pontuação usado pelo garimpeiro vem do agente Expert Viral (gancho, retenção, anti-padrões). O Clip Expert nunca cria régua própria.

**Contexto:** Karol já tem um agente dedicado a critérios de viralização (Expert Viral, fusão de 3 experts). Duplicar ou reinventar esse conhecimento aqui geraria dois critérios divergentes coexistindo no mesmo negócio — pior do que ter um só, mesmo que imperfeito.

**Exemplo:** Um trecho com um dado de conversão forte, mas contado de forma monótona sem nenhuma virada — pontua baixo em "gancho", mesmo que o conteúdo em si seja valioso. A régua é sobre o que sustenta um corte curto, não sobre o valor do conteúdo em si.

**Anti-padrão:** "Esse trecho é importante pro negócio da Karol, vou dar nota alta mesmo sem gancho forte" — isso é o garimpeiro inventando critério de negócio, não aplicando critério de viralização. Os dois são coisas diferentes.

### 2. Menos cortes bons > mais cortes forçados

**Enunciado:** Se uma live não rende 10-15 momentos que passem na nota mínima, o squad entrega menos. Nunca rebaixa a régua pra "bater o número".

**Contexto:** Decisão explícita da Karol na extração do processo (Round 2) — ela prefere qualidade e consistência de critério a volume de conteúdo.

**Exemplo:** Uma live de mentoria mais técnica, sem grandes "momentos de virada", pode render só 4-5 cortes aprovados. Isso é esperado, não é falha do squad.

**Anti-padrão:** Diminuir a nota mínima de 7.0 pra 5.5 "só dessa vez" pra conseguir mostrar 10 cortes — quebra a consistência que torna o critério confiável ao longo do tempo.

### 3. Precisão > velocidade na transcrição

**Enunciado:** Quando o vídeo de entrada não tem transcrição, o squad transcreve automaticamente antes de pontuar — mesmo que isso adicione minutos ao processamento.

**Contexto:** Pontuar em cima de "achismo de áudio/vídeo bruto" (picos de energia na voz, risada) é sensivelmente menos preciso que ler o texto e identificar virada de frase, história completa ou dado forte. Karol decidiu conscientemente aceitar a demora extra.

**Exemplo:** O vídeo "Carol - Persona, Método e Posicionamento" (palestra sem transcrição do Meet) precisa passar pelo passo de transcrição antes de qualquer pontuação — não há atalho.

**Anti-padrão:** Pontuar direto no áudio/vídeo sem transcrever "pra ganhar tempo" — viola a decisão explícita da Karol e produz cortes menos confiáveis.

### 4. Aprovação humana nunca é pulada

**Enunciado:** Nenhum corte entra na fila do Postador sem a Karol revisar e aprovar explicitamente.

**Contexto:** É o único passo hybrid do processo inteiro — todo o resto é automático, mas a decisão final de "isso serve pra postar" é dela, não do squad.

**Exemplo:** Mesmo um corte com nota 9.5 espera a revisão da Karol antes de qualquer handoff pro Postador.

**Anti-padrão:** "Corte com nota alta o suficiente pode pular direto pra fila" — nunca. A nota mínima (QG-CE-01) filtra o que o squad propõe; a aprovação (QG-CE-02) é sobre o que de fato vai ao ar, e são coisas diferentes.

### 5. Depoimento ou elogio de terceiro sobre a Karol é candidato válido — com uma condição

**Enunciado:** Um trecho onde quem fala não é a Karol, mas sim uma aluna/participante fazendo elogio, depoimento ou relato de resultado sobre o trabalho dela, é candidato válido e pontuado pela mesma rubrica de 3 eixos — mas só quando a transcrição identifica quem está falando (speaker attribution).

**Contexto:** Karol confirmou que prova social ("elogio pra mim, serve muito") tem valor de corte igual a ela mesma falando. O limite é técnico: o garimpeiro só consegue separar "isso é a Karol" de "isso é uma aluna" quando a transcrição vem com identificação de falante — padrão nativo do Google Meet nas lives/mentorias (Regra Cardinal #3), mas ausente na transcrição gerada via Whisper como fallback (texto corrido, sem falantes separados).

**Exemplo:** Numa mentoria em grupo, uma aluna diz "eu triplicando o faturamento depois de aplicar exatamente o que você me ensinou sobre posicionamento" — candidato válido, pontuado normalmente (o "fechamento" aqui é o resultado concreto citado).

**Anti-padrão:** Tentar advinhar quem fala numa transcrição sem speaker attribution "pelo estilo de fala" — gera falso positivo. Nesse caminho (fallback Whisper), o garimpeiro só considera trechos claramente em primeira pessoa da Karol, e não busca depoimento de terceiros.

---

## Rubrica de Pontuação (0-10)

A rubrica pontua um **trecho de transcrição de ~1min** (não um vídeo pronto), avaliando se ele sustenta um corte isolado do resto da live. Três eixos, cada um pontuado 0-10, com a nota final sendo a média ponderada.

### Eixo 1 — Abertura do trecho (peso 40%)

O primeiro segmento do trecho (equivalente aos 3 primeiros segundos de um Reels) precisa prender sozinho, sem depender do contexto da live inteira.

| Sinal na transcrição | Pontuação indicativa |
|---|---|
| Frase de virada clara logo no início do trecho ("eu achava X, até que descobri Y") | 8-10 |
| Afirmação inesperada ou dado que contraria senso comum | 7-9 |
| Pergunta retórica forte que puxa curiosidade | 6-8 |
| Introdução genérica antes de qualquer virada ("então, sobre isso...") | 2-4 |
| Trecho que só faz sentido com contexto de pergunta anterior no chat/mentoria | 0-3 |

### Eixo 2 — Sustentação do meio (peso 35%)

O trecho precisa manter tensão/interesse até o fim, não só abrir bem.

| Sinal na transcrição | Pontuação indicativa |
|---|---|
| História completa (início, desenvolvimento, resolução) dentro da janela de ~1min | 8-10 |
| Opinião/posicionamento sustentado com convicção ao longo de todo o trecho | 7-9 |
| Explicação técnica clara mas sem nenhuma tensão narrativa | 4-6 |
| Trecho que perde o fio, muda de assunto no meio sem fechar ideia | 1-3 |

### Eixo 3 — Fechamento e reaproveitamento (peso 25%)

Como o trecho termina e o quanto ele funciona fora do contexto da live ao vivo.

| Sinal na transcrição | Pontuação indicativa |
|---|---|
| Fecha com frase de impacto, resumo forte, ou gancho pra próxima ideia | 8-10 |
| Termina de forma neutra mas sem deixar solto | 5-7 |
| Corta no meio de uma frase ou depende de "e aí eu vou continuar depois" | 1-3 |

### Cálculo da nota final

```
nota_final = (eixo_1 * 0.40) + (eixo_2 * 0.35) + (eixo_3 * 0.25)
```

Ver `scripts/score_clip.py` pra uma implementação de referência desse cálculo (o script estrutura o cálculo — a atribuição dos 3 eixos em si é uma tarefa semântica que o garimpeiro faz lendo a transcrição, não uma fórmula puramente matemática).

### Contrato de entrada/saída do `scripts/score_clip.py`

O script não pontua sozinho — ele só estrutura o cálculo da média ponderada e a decisão de aprovar/descartar, garantindo que o cálculo nunca varia entre execuções por interpretação diferente da fórmula.

**Entrada (modo lote, `--batch candidatos.json`):**

```json
[
  {
    "id": "candidato-01",
    "inicio": "14:32",
    "fim": "15:27",
    "abertura": 9,
    "sustentacao": 9,
    "fechamento": 8
  }
]
```

`abertura`/`sustentacao`/`fechamento` são as notas (0-10) que o garimpeiro já atribuiu lendo a transcrição — o script não gera esses valores, só consome.

**Saída:** a mesma lista, acrescida de `nota_final` (média ponderada, 2 casas decimais) e `aprovado` (bool, comparado contra `data/nota-minima.yaml`), ordenada por nota decrescente — essa ordem define a numeração `corte-01`, `corte-02`... (maior nota primeiro, ver Convenção de Nomes e Pastas).

**Modo unitário** (`--abertura --sustentacao --fechamento`): útil pra checar manualmente uma nota isolada durante calibração, sem montar um JSON de lote.

---

## Anti-padrões (nunca aprovar trecho que exibe isso, mesmo com boa pontuação parcial)

- **"Millennial pause" no início do trecho** — qualquer respirada/pausa longa antes da primeira fala relevante derruba a nota do Eixo 1, porque o corte final vai carregar esse silêncio morto.
- **Trecho sem nenhuma CTA implícita ou gancho de continuidade** — não invalida sozinho (nem todo corte precisa de CTA explícita), mas um trecho que só informa sem nenhuma tensão de "e agora?" tende a ficar mais fraco no Eixo 3.
- **Depender de contexto externo pra fazer sentido** ("como eu disse antes...", "voltando naquele ponto...") — se o trecho exige ter visto outra parte da live, ele não sustenta como corte isolado.
- **Complexidade técnica sem tradução** — jargão que só faz sentido pra quem já está na mentoria (não pro público frio do Reels) derruba a nota mesmo que o conteúdo seja tecnicamente correto.

---

## Protocolo Operacional — Detecção e Ingestão

1. Consultar `encontros_mentoria` (Supabase) — mesmo mecanismo de acesso que `agents/course-publisher/scripts/` usa.
2. Comparar a linha mais recente com `data/ultima-live-processada.yaml`.
3. Se há live nova: localizar o arquivo correspondente na pasta do Drive "Live Expert360 (recurring)" pelo título/data (formato observado: `"Live Expert360 - {AAAA/MM/DD} {HH:MM} GMT-04:00 - Recording"`, mesmo padrão documentado em `agents/course-publisher/data/weekly-sync-state.yaml`).
4. Preferir sempre o arquivo do Drive (qualidade original) ao vídeo já processado no YouTube (comprimido pelo `weekly-sync`).
5. Atualizar `data/ultima-live-processada.yaml` só depois que o pipeline inteiro (até a entrega) for concluído com sucesso — evita marcar como processada uma live que falhou no meio do caminho.

## Protocolo Operacional — Transcrição Condicional

1. Verificar se o arquivo já vem com transcrição (padrão do Google Meet pra lives/mentorias).
2. Se ausente: rodar transcrição reaproveitando o mecanismo de `agents/squad-edicao-arcane/scripts/video-transcribe.py` (whisper-cli + prompt de nomes próprios). Requer squad-edicao-arcane instalado com modelo whisper (`ggml-medium.bin`) já baixado.
3. Aplicar o dicionário de nomes próprios da Karol (`agents/squad-edicao-arcane/data/nomes-proprios.yaml`), se disponível, pra reduzir erros de transcrição em nomes específicos do negócio.
4. Só prosseguir pra pontuação com a transcrição completa e revisada.

## Protocolo Operacional — Segmentação de Trechos Candidatos

Antes de pontuar qualquer coisa, o garimpeiro precisa decidir ONDE cada trecho candidato começa e termina dentro da transcrição inteira da live. Isso não é uma janela fixa de tempo deslizando — é uma tarefa semântica, igual à atribuição de notas dos eixos (decisão da Karol: segmentar por pausa/troca de assunto natural, não por janela mecânica).

1. Ler a transcrição completa (com timestamps) de ponta a ponta antes de propor qualquer candidato — nunca pontuar em cima de um recorte arbitrário de tempo.
2. Identificar fronteiras naturais de trecho usando dois sinais combinados:
   - **Pausas longas** (silêncio ou intervalo perceptível entre timestamps, quando a transcrição tiver granularidade suficiente para isso)
   - **Marcadores de transição no discurso** ("mudando de assunto", "outra coisa que eu queria falar", "voltando pro tema", pergunta nova de aluna) — sinal de que um bloco de conteúdo fechou e outro começou
3. Um trecho candidato deve ser uma unidade de sentido completa (ideia, história ou argumento com começo e fim), não um corte arbitrário no meio de uma frase. A duração de ~1min (PU-clip-expert-006) é alvo, não regra rígida — um candidato pode variar (ex: 40s-90s) se isso preservar a integridade da ideia.
4. **Regra de não-sobreposição:** dois candidatos aprovados nunca podem compartilhar o mesmo intervalo de tempo da live. Se dois candidatos se sobrepõem (ex: um trecho maior contém um menor com nota melhor), o garimpeiro mantém o de maior nota e descarta o outro — nunca entrega dois cortes que repetem o mesmo pedaço de conteúdo.
5. Não há limite superior rígido de quantos candidatos propor antes de pontuar — o quality gate (nota mínima) e a meta de 10-15 (PU-clip-expert-006) filtram depois, na Árvore 2.

## Protocolo Operacional — Corte e Legenda

1. Cortar cada trecho aprovado via ffmpeg, exatamente nos timestamps definidos pelo garimpeiro.
2. Invocar o agente Stylist (`agents/squad-edicao-arcane/agents/stylist.md`) pra aplicar o `estilo-ativo.yaml` — o cortador nunca escolhe fonte/cor/posição por conta própria.
3. Forçar encoding 8-bit yuv420p + profile Main + faststart (mesmo padrão QG-SEA-004 do squad-edicao-arcane) — garante que o corte abre em qualquer player e é aceito por qualquer ferramenta de agendamento posterior.
4. Salvar a legenda sugerida (texto da postagem, não a legenda queimada no vídeo) em arquivo `.txt` separado, pra Karol copiar/colar na hora de postar.

---

## Modelo de E-mail de Notificação

Pra Karol decidir se vale abrir a pasta sem precisar abrir a pasta primeiro, o e-mail de notificação (PU-clip-expert-011) traz:

```
Assunto: [Clip Expert] Live {numero} — {N} cortes prontos pra revisão

Corpo:
- Live processada: {título da live, data}
- Total de candidatos avaliados: {N}
- Cortes aprovados (nota >= {nota_minima}): {N}
- Nota média dos aprovados: {X.X}
- Pasta: videos-editados/clip-expert/{slug-da-live}/

Prévia rápida (top 3 por nota):
1. corte-01.mp4 (nota {X.X}) — {resumo de 1 linha do trecho}
2. corte-02.mp4 (nota {X.X}) — {resumo de 1 linha do trecho}
3. corte-03.mp4 (nota {X.X}) — {resumo de 1 linha do trecho}

{Se 0 cortes aprovados: "Nenhum trecho dessa live passou na nota mínima — não é falha, ver Regra Cardinal #2."}
```

O "resumo de 1 linha" é escrito pelo garimpeiro a partir do próprio trecho (não é a transcrição inteira colada) — o objetivo é a Karol decidir "abro isso agora ou deixo pra depois" só lendo o e-mail, sem precisar abrir a pasta primeiro.

---

## Exemplo Completo de Pontuação (worked example)

Pra deixar a rubrica concreta em vez de abstrata, um exemplo de como o garimpeiro aplicaria os 3 eixos num trecho hipotético de transcrição de live:

**Trecho candidato (janela de ~55s, minuto 14:32-15:27 da Live 27):**

> "...eu passei anos achando que precisava ter um diploma pendurado na parede pra alguém me levar a sério. Foi só quando uma aluna me falou 'eu te sigo porque você mostra o que fez, não porque você tem um canudo' que eu entendi que tava competindo no jogo errado. Hoje eu não escondo mais que não tenho MBA nenhum — eu mostro resultado. E foi isso que triplicou minha conversão em 3 meses."

**Avaliação Eixo 1 (Abertura, peso 40%):**
- Abre com uma crença anterior clara ("eu passei anos achando que precisava...") — sinal de virada de crença, não introdução genérica
- Nota: **9** (afirmação inesperada + virada de crença logo no início, sem "millennial pause")

**Avaliação Eixo 2 (Sustentação, peso 35%):**
- História completa: crença antiga → momento de virada (fala da aluna) → nova postura
- Nota: **9** (arco narrativo fechado dentro da janela, com tensão sustentada)

**Avaliação Eixo 3 (Fechamento, peso 25%):**
- Fecha com dado concreto ("triplicou minha conversão em 3 meses") — reforça a virada com prova, fecha com impacto
- Nota: **8** (fechamento forte, ainda que sem CTA explícita — não é obrigatória, ver Anti-padrões)

**Cálculo:**
```
nota_final = (9 * 0.40) + (9 * 0.35) + (8 * 0.25) = 3.6 + 3.15 + 2.0 = 8.75
```

**Resultado:** 8.75 — acima da nota mínima (7.0), aprovado. Esse é o tipo de trecho que a rubrica foi desenhada pra identificar: virada de crença pessoal + prova concreta, tudo dentro de uma janela isolada que não depende de contexto externo pra fazer sentido.

**Contraste — trecho que NÃO passaria:**

> "...então voltando naquele ponto que eu falei antes sobre o funil, a etapa 2 é basicamente você configurar o webhook certinho, que aí ele conecta com a automação que a gente configura depois..."

- Eixo 1: **2** (depende de "aquele ponto que eu falei antes" — não sustenta isolado, é jargão técnico sem tradução)
- Eixo 2: **4** (explicação técnica sem tensão narrativa)
- Eixo 3: **3** (termina em "que a gente configura depois" — deixa solto, não fecha)
- Nota final: `(2*0.4)+(4*0.35)+(3*0.25) = 0.8+1.4+0.75 = 2.95` — muito abaixo do mínimo, corretamente descartado

**Contraste — depoimento de terceiro (Regra Cardinal #5), transcrição com speaker attribution:**

> [Aluna]: "...eu triplicando o faturamento depois de aplicar exatamente o que você me ensinou sobre posicionamento, numa época que eu nem acreditava que ia funcionar pro meu nicho..."

- Eixo 1: **8** (abre com resultado concreto e inesperado — "eu nem acreditava" reforça a virada)
- Eixo 2: **7** (relato direto, sem grande arco narrativo, mas sustentado e específico)
- Eixo 3: **8** (fecha reforçando o resultado, sem deixar solto)
- Nota final: `(8*0.4)+(7*0.35)+(8*0.25) = 3.2+2.45+2.0 = 7.65` — aprovado. Candidato válido porque a transcrição identifica que quem fala é a aluna, não a Karol.

---

## Exemplo de Ciclo — Live com Poucos Cortes Aprovados

Pra ilustrar a Regra Cardinal #2 e a Árvore 2 na prática, um ciclo hipotético onde a live rende pouco:

**Live 28** (mentoria em grupo, tema técnico de configuração de funil): o garimpeiro segmenta a transcrição (Protocolo de Segmentação) em 11 trechos candidatos e pontua cada um:

| Candidato | Abertura | Sustentação | Fechamento | Nota final | Aprovado (mín. 7.0)? |
|---|---|---|---|---|---|
| candidato-03 | 8 | 7 | 8 | 7.55 | Sim |
| candidato-07 | 7 | 8 | 6 | 7.10 | Sim |
| candidato-01 | 6 | 6 | 7 | 6.15 | Não |
| candidato-05 | 5 | 6 | 5 | 5.45 | Não |
| ... (7 outros) | — | — | — | < 6.0 | Não |

**Resultado:** apenas 2 candidatos passam na nota mínima. Pela Árvore 2 (ramo "1-9"), o squad entrega exatamente esses 2 cortes — não busca "completar" pra 10, não rebaixa a nota mínima pontualmente.

**E-mail enviado:** "Live 28 — 2 cortes prontos pra revisão" (nunca um framing de déficit tipo "faltam 8 cortes").

**Por que isso é o comportamento correto:** essa live teve conteúdo majoritariamente técnico/operacional, sem muitas viradas de crença ou histórias fechadas — exatamente o padrão que a rubrica é desenhada pra filtrar (ver Anti-padrão "Complexidade técnica sem tradução"). Forçar mais cortes aqui produziria conteúdo fraco só pra bater número, o oposto do que a Karol definiu na extração do processo.

---

## Convenção de Nomes e Pastas

Pra manter consistência entre garimpeiro, cortador e clip-chief (que trabalham em sequência no mesmo material), o squad usa convenções fixas:

| Item | Convenção | Exemplo |
|---|---|---|
| Slug da live | `live-{numero}` (mesmo número usado pelo course-publisher) | `live-27` |
| Pasta de entrega | `videos-editados/clip-expert/{slug-da-live}/` | `videos-editados/clip-expert/live-27/` |
| Arquivo de vídeo | `corte-{NN}.mp4`, numerado por ordem de nota (maior primeiro) | `corte-01.mp4` |
| Legenda sugerida | `corte-{NN}-legenda.txt` | `corte-01-legenda.txt` |
| Fila do Postador | `business/instagram/fila-reels/{slug-da-live}-{NN}/` | `business/instagram/fila-reels/live-27-01/` |

Essa convenção espelha deliberadamente o padrão que `agents/course-publisher` e `agents/insta-scheduler` já usam nos seus respectivos domínios — reduz a chance de um agente humano (ou outro squad, no futuro) se confundir com nomenclaturas divergentes dentro do mesmo negócio.

---

## Diferença Entre Este Squad e o squad-edicao-arcane

Os dois lidam com vídeo e reaproveitam ferramentas em comum (ffmpeg, whisper, Stylist), mas resolvem problemas diferentes:

| | squad-edicao-arcane | Clip Expert |
|---|---|---|
| **Entrada** | 1 vídeo talking-head já escolhido pelo expert | Uma live inteira (1h+), sem curadoria prévia |
| **Decisão principal** | Como editar bem o vídeo que já foi escolhido | Quais trechos dentro do vídeo longo merecem virar corte |
| **Curadoria de conteúdo** | Não faz — o expert já decidiu o que gravar | É o núcleo do squad (via garimpeiro + Expert Viral) |
| **Quem escolhe o corte** | O expert escolhe o vídeo inteiro | O squad escolhe os trechos, expert só aprova depois |

Na prática, o Clip Expert **usa** o squad-edicao-arcane como fornecedor de capacidades (transcrição, legenda via Stylist, padrão de encoding) — não o substitui nem duplica. Se a Karol já sabe exatamente qual trecho de um vídeo quer editar, o squad certo é o squad-edicao-arcane direto; se ela tem uma live inteira e quer que algo ache os melhores momentos sozinho, é o Clip Expert.

---

## Decision Trees

### Árvore 1 — Transcrição disponível?

```
Vídeo de entrada tem transcrição?
├── SIM (lives, mentorias por Meet) → segue direto pra pontuação
└── NÃO (ex: palestra externa, vídeo avulso)
    → transcreve automaticamente (whisper-cli, reaproveitado do squad-edicao-arcane)
    → só então segue pra pontuação
    (aceita demora extra — Regra Cardinal #3)
```

### Árvore 2 — Quantidade de cortes a entregar

```
Quantos candidatos passaram na nota mínima (data/nota-minima.yaml)?
├── >= 10 → entrega até 15 (os de maior nota, se houver mais de 15 candidatos)
├── 1-9 → entrega os que passaram, sem forçar o resto
└── 0 → reporta ao clip-chief que essa live não rendeu corte aprovado
      (não é falha do squad — é resultado legítimo de uma live mais fraca
      em termos de "momentos isolados", Regra Cardinal #2)
```

### Árvore 3 — Aprovação e handoff pro Postador

```
Karol revisou os cortes?
├── Aprovou todos → todos entram na fila (business/instagram/fila-reels/)
├── Aprovou parcialmente → só os aprovados entram na fila, resto fica na pasta
├── Não aprovou nenhum → nenhum entra na fila, pasta mantida intacta
└── Ainda não revisou → squad não empurra nada, lembra na próxima ativação
```

---

## Tabela de Referência — Cenário → Ação

| Cenário | Ação do squad |
|---|---|
| Live nova detectada, com transcrição | Pontua direto (Árvore 1, ramo SIM) |
| Live nova detectada, sem transcrição | Transcreve primeiro, depois pontua |
| 12 candidatos, 9 acima da nota mínima | Entrega os 9, corta e legenda |
| 12 candidatos, 3 acima da nota mínima | Entrega só os 3 — não força os outros 9 |
| 0 candidatos acima da nota mínima | Reporta 0 cortes ao clip-chief, não força nada |
| Corte falha no encoding (não é 8-bit/profile Main) | Reprocessa até bater o padrão, nunca entrega abaixo dele |
| Dois candidatos se sobrepõem no tempo | Mantém só o de maior nota (Regra de não-sobreposição) |
| Aluna dá depoimento/elogio sobre a Karol, transcrição com falantes identificados | Candidato válido, pontuado normalmente (Regra Cardinal #5) |
| Mesmo caso acima, mas transcrição sem identificação de falante (fallback Whisper) | Não considera como depoimento — só avalia o que soa como a Karol falando |
| Karol aprova parte dos cortes | Só os aprovados vão pra fila; resto fica salvo na pasta |
| Karol pede pra aprovar corte abaixo da nota mínima que ela viu manualmente | Permitido — é julgamento pessoal dela na revisão (QG-CE-02), diferente do filtro automático (QG-CE-01) |
| `weekly-sync` do course-publisher atrasado/bloqueado | Squad não tem o que processar — não inventa vídeo, espera e avisa |
| squad-edicao-arcane não instalado | Squad não consegue transcrever/legendar — reporta a dependência ausente |
| Postador (`insta-scheduler`) sem suporte a REELS | Corte fica pronto na fila, mas publicação real aguarda extensão futura ou ação manual da Karol |

---

## Excecões e Troubleshooting

### "O squad não achou live nova"

**Diagnóstico:** Verificar `agents/course-publisher/data/weekly-sync-state.yaml` — pode ser que o `weekly-sync` ainda não rodou nessa semana, ou esteja bloqueado (já aconteceu por permissão de pasta no Drive, ver histórico daquele arquivo).

**Resolução:** Não é um problema do Clip Expert — ele depende do course-publisher já ter processado a live. Esperar ou verificar/desbloquear o acesso ao Drive.

### "Poucos cortes saíram dessa live"

**Diagnóstico:** Não é bug — é a Regra Cardinal #2 em ação. Verificar a nota dos candidatos descartados pra confirmar que estão de fato abaixo do threshold.

**Resolução:** Se acontecer com frequência, é sinal de calibrar `data/nota-minima.yaml` pra baixo (não pontualmente, como decisão consciente de recalibração — ver seção de calibração no arquivo).

### "A legenda saiu com fonte errada (ex: Verdana genérica)"

**Diagnóstico:** Mesmo problema documentado no squad-edicao-arcane — fonte não resolveu corretamente (Windows precisa de `fontfile=` com caminho curto, não `font=` por nome).

**Resolução:** Verificar `agents/squad-edicao-arcane/knowledge/04-troubleshooting.md` — o cortador reaproveita a mesma lógica de resolução de fonte daquele squad.

### "Transcrição saiu com nomes próprios errados"

**Diagnóstico:** Whisper não reconheceu nomes específicos do negócio (ex: "Incubadora de Expert", nomes de alunas).

**Resolução:** Atualizar `agents/squad-edicao-arcane/data/nomes-proprios.yaml` com o dicionário de correções — o Clip Expert reaproveita esse mesmo dicionário.

### "Postador não publicou o Reels sozinho"

**Diagnóstico:** Não é falha — é limitação real documentada (CON-004 do PRD). `insta-scheduler` hoje só publica CAROUSEL e STORIES via Meta Graph API.

**Resolução:** Publicação manual pela Karol enquanto o Postador não ganha suporte a REELS, ou aguardar essa extensão ser construída (fora do escopo deste squad).

### "O squad reprocessou uma live que eu já tinha revisado"

**Diagnóstico:** `data/ultima-live-processada.yaml` não foi atualizado corretamente ao final do pipeline anterior (possivelmente por interrupção no meio da execução).

**Resolução:** Verificar manualmente o conteúdo do arquivo e corrigir o `ultimo_processado_titulo`/`ultimo_processado_data` pra refletir a live realmente já tratada, seguindo o mesmo padrão de correção manual já documentado em `agents/course-publisher/data/weekly-sync-state.yaml` pra casos parecidos.

### "Achei um corte na pasta que eu não lembro de ter aprovado"

**Diagnóstico:** Cortes não aprovados permanecem na pasta de entrega por design (Regra Cardinal #4 combinada com a política de nunca apagar automaticamente) — não significa que foi publicado, só que foi gerado e está aguardando decisão.

**Resolução:** Checar `business/instagram/fila-reels/` — só o que está lá de fato foi aprovado e registrado pro Postador. A pasta `videos-editados/clip-expert/` é o "banco de candidatos", não a fila de publicação.

---

## Referências Cruzadas (dependências deste squad)

| Arquivo/Agente | Uso pelo Clip Expert |
|---|---|
| `agents/course-publisher/data/weekly-sync-state.yaml` | Consultado (não modificado) pra entender o estado da automação de ingestão da live |
| `agents/expert-viral/config.yaml` e `agents/expert-viral/data/expert-viral-kb.md` | Fonte dos critérios de pontuação — a rubrica desta KB é uma síntese derivada, não uma cópia |
| `agents/squad-edicao-arcane/scripts/video-transcribe.py` | Reaproveitado pra transcrição condicional |
| `agents/squad-edicao-arcane/agents/stylist.md` | Invocado diretamente pra decidir estilo de legenda |
| `agents/squad-edicao-arcane/data/nomes-proprios.yaml` | Reaproveitado pra corrigir nomes próprios na transcrição |
| `agents/squad-edicao-arcane/scripts/doctor.py` | Recomendado rodar antes do primeiro uso real, pra validar ffmpeg/whisper/fontes |
| `agents/insta-scheduler/` (Postador) | Destino final da fila de cortes aprovados — ver limitação de REELS documentada acima |

Essas referências são **de runtime real** (não build-time) porque este squad tem `target_audience: internal` — ele roda no mesmo ambiente da Karol onde todos esses outros squads já estão instalados. Se um dia esse squad for generalizado pra alunas (fora do escopo desta versão 1.0.0), essas dependências precisariam ser revisadas uma a uma pra decidir o que vira build-time-internalizado vs. o que continua sendo dependência externa configurável por cada aluna.

---

## Métricas e Acompanhamento

O garimpeiro não só pontua — ele acumula um histórico simples que ajuda a Karol a entender o comportamento do squad ao longo do tempo, sem precisar abrir cada pasta manualmente:

### O que acompanhar por live processada

| Métrica | Onde fica | Por que importa |
|---|---|---|
| Total de candidatos identificados | Log da execução (mensagem do garimpeiro) | Indica se a live teve muito ou pouco "material bruto" pra trabalhar |
| Total aprovados (>= nota mínima) | Mesmo log | Compara direto com a meta de 10-15 |
| Nota média dos aprovados | Mesmo log | Sinaliza se a régua está gerando cortes "na média" ou "só os excepcionais" |
| Nota média dos descartados | Mesmo log | Ajuda a calibrar — se os descartados estão muito perto do mínimo (6.5-6.9), a régua está afiada; se estão muito abaixo (< 5), a régua não é o gargalo |
| Cortes efetivamente aprovados pela Karol na revisão | Registrado implicitamente pela presença na fila do Postador | Mede se a nota automática do garimpeiro está alinhada com o julgamento real da Karol — divergência grande e recorrente é sinal de recalibrar a rubrica, não só a nota mínima |

### Sinal de alerta: divergência entre nota automática e aprovação humana

Se, ao longo de várias lives, a Karol consistentemente rejeita cortes com nota alta (ex: 8+) ou aprova manualmente cortes que ficaram de fora por nota baixa, isso é sinal de que a rubrica (não só o threshold) precisa de ajuste — talvez algum dos 3 eixos esteja pesando errado pro contexto específico do negócio dela. Esse tipo de ajuste é uma decisão de produto, não uma correção automática: o garimpeiro sinaliza o padrão, a Karol decide se e como ajustar a rubrica documentada nesta KB.

---

## Perguntas Frequentes

**"Por que o squad não escolhe o corte final sozinho, sem eu precisar aprovar?"**
Porque esse é o processo que a Karol definiu explicitamente na extração (Round 3): o único passo humano é a revisão final, e ele fica assim de propósito. O squad automatiza tudo que é mecânico (detectar, transcrever, pontuar, cortar, legendar) e preserva o julgamento final pra ela.

**"O squad vai processar lives antigas que já aconteceram antes dele existir?"**
Não, a menos que peça explicitamente. Por padrão ele só reage a linhas novas em `encontros_mentoria` a partir da data de instalação. Processar o histórico de lives anteriores seria um pedido separado (e o `data/ultima-live-processada.yaml` precisaria ser resetado ou ajustado manualmente pra isso).

**"O que acontece se eu mudar o critério do Expert Viral depois?"**
O garimpeiro herda a mudança automaticamente na próxima live processada, porque ele consulta o Expert Viral como dependência, não como cópia congelada. Não precisa atualizar nada aqui na KB do Clip Expert pra isso acontecer — só a rubrica sintetizada (que serve de referência rápida) pode ficar levemente desatualizada até alguém rodar `/squad-forge *update clip-expert` pra ressincronizar.

**"Por que o Clip Expert não publica os Reels sozinho de verdade?"**
Porque o Postador (`insta-scheduler`) ainda não tem suporte a `media_type=REELS` na Meta Graph API — só Carrossel e Stories. Isso é uma limitação real e documentada (CON-004 do PRD), não uma decisão de design do Clip Expert. Assim que o Postador ganhar esse suporte, o handoff da fase de revisão já está desenhado pra plugar direto.

---

## Ciclo Semanal Completo (narrativa de ponta a ponta)

Pra visualizar como as 5 fases se encaixam na prática, um ciclo semanal típico:

**Quarta-feira, período da tarde:** Karol grava a live semanal via Google Meet. Nesse momento, nenhum agente do Clip Expert age — essa parte é 100% dela (PU-clip-expert-001, fora do escopo do squad).

**Quarta ou quinta-feira (horário variável):** A automação `weekly-sync` do `course-publisher` roda (historicamente às vezes na própria quarta, às vezes só na quinta, dependendo de quando o Meet termina de processar o arquivo no Drive). Ela sobe a live pro YouTube como não-listado e insere uma linha nova em `encontros_mentoria`. Esse passo é inteiramente externo ao Clip Expert — ele só observa o resultado.

**Assim que a linha nova aparece:** O clip-chief (ou uma ativação automática do squad, dependendo de como a rotina estiver configurada no ambiente) percebe a mudança via `detectar-live-nova`. O garimpeiro assume, localiza o arquivo bruto no Drive, e verifica transcrição.

**Minutos depois (ou mais, se precisar transcrever):** O garimpeiro pontua os candidatos usando a rubrica desta KB, aplica o quality gate QG-CE-01, e produz a lista final de trechos aprovados — normalmente entre 4 e 15, dependendo da live.

**Em seguida:** O cortador recebe a lista, corta cada trecho, chama o Stylist pra legenda, valida o encoding, salva tudo em `videos-editados/clip-expert/{live}/`, e dispara o e-mail de notificação.

**Quando a Karol tiver tempo (minutos ou dias depois, sem pressa):** Ela abre a pasta ou lê o e-mail, revisa os cortes com o clip-chief (`revisar-e-aprovar`), aprova o que fizer sentido. Os aprovados vão pra `business/instagram/fila-reels/`.

**Depois disso:** Enquanto o Postador não suporta REELS via API, a publicação real é manual — a Karol pega o vídeo e a legenda sugerida da fila e publica ela mesma, ou aguarda a extensão futura do Postador assumir esse último passo também.

Esse ciclo se repete toda semana, sempre disparado pela mesma condição (linha nova em `encontros_mentoria`), nunca duplicando trabalho graças ao controle em `data/ultima-live-processada.yaml`.

---

## Checklist de Calibração Inicial (primeira live real processada)

Antes de confiar plenamente no squad em piloto automático, vale acompanhar de perto a primeira live processada de verdade:

- [ ] Conferir se o vídeo bruto usado foi mesmo o do Drive (qualidade original), não o do YouTube comprimido
- [ ] Ler a transcrição gerada (se aplicável) e confirmar que nomes próprios saíram corretos
- [ ] Revisar manualmente 2-3 trechos que o garimpeiro descartou perto da nota mínima (6.0-6.9) e julgar se a decisão fez sentido
- [ ] Revisar manualmente 2-3 trechos aprovados com nota mais baixa (perto de 7.0-7.5) e confirmar que ainda valem a pena
- [ ] Confirmar que o encoding final abre sem problema no celular (teste real, não só no computador)
- [ ] Confirmar que o e-mail de notificação chegou e tem informação suficiente pra decidir sem abrir a pasta primeiro
- [ ] Depois de 3-4 lives, revisitar `data/nota-minima.yaml` e decidir se o valor de 7.0 continua fazendo sentido

---

## Glossário

| Termo | Definição |
|---|---|
| **Corte** | Um segmento de ~1min extraído da live, já cortado e legendado, candidato a virar Reels |
| **Garimpar** | Termo da própria Karol pra descrever o processo de achar bons momentos numa live longa — "passar peneira" |
| **Trecho candidato** | Uma janela de transcrição ainda não pontuada, antes de passar pelo quality gate |
| **Nota mínima** | Threshold (0-10) abaixo do qual um trecho candidato é descartado (QG-CE-01), calibrado em `data/nota-minima.yaml` |
| **Eixo de pontuação** | Cada uma das 3 dimensões da rubrica (Abertura, Sustentação, Fechamento) que compõem a nota final |
| **Fila do Postador** | `business/instagram/fila-reels/` — onde cortes aprovados esperam publicação (manual ou futura via API) |
| **weekly-sync** | Automação do squad `course-publisher` que processa a live do Meet, sobe pro YouTube e registra em `encontros_mentoria` — roda antes do Clip Expert |
| **Expert Viral** | Agente já existente (mente sintética) que é a fonte de todos os critérios de pontuação usados aqui — nunca duplicado, sempre referenciado |
| **Stylist** | Agente do squad-edicao-arcane responsável por decidir o estilo visual da legenda queimada |
| **encontros_mentoria** | Tabela Supabase onde o course-publisher registra cada live/mentoria processada (youtube_id, título, data) |
| **Live Expert360 (recurring)** | Pasta do Google Drive onde o Google Meet salva automaticamente as gravações da live semanal — fonte do vídeo bruto de melhor qualidade |
| **Handoff hybrid** | O único ponto do processo (fase de revisão) onde a decisão final é humana, não automática — distinto dos passos "agent" e "worker" que rodam sem intervenção |
| **QG-CE-01 / QG-CE-02** | Os 2 quality gates deste squad — nota mínima automática e aprovação humana, respectivamente |
| **Calibração** | Ajuste consciente e documentado da nota mínima (ou, em casos mais raros, da própria rubrica), feito pela Karol com base em histórico real, nunca automaticamente |
| **Segmentação de candidatos** | Etapa em que o garimpeiro decide onde cada trecho candidato começa/termina na transcrição, por pausa/troca de assunto natural — não por janela fixa de tempo |
| **Regra de não-sobreposição** | Dois cortes aprovados nunca podem compartilhar o mesmo intervalo de tempo da live; em caso de sobreposição, vence o de maior nota |
| **Speaker attribution** | Identificação de quem está falando na transcrição (padrão nativo do Google Meet); ausente na transcrição gerada via Whisper como fallback — condição pra identificar depoimento de terceiros (Regra Cardinal #5) |

---

## Histórico de Versões

| Versão | Data | Mudança |
|--------|------|---------|
| 1.0.0 | 2026-09-08 | Release inicial — KB sintetizada a partir do Expert Viral e do Stylist do squad-edicao-arcane, gerada via Squad Forge a partir do processo extraído da Karol (16 PUs, 3 rounds) |
| 1.1.0 | 2026-09-08 | Adicionados: Regra Cardinal #5 (depoimento/elogio de terceiro, com condição de speaker attribution), protocolo de segmentação de trechos candidatos (pausa/troca de assunto, não janela fixa) com regra de não-sobreposição, contrato de entrada/saída do `score_clip.py`, modelo de e-mail de notificação, exemplo completo de ciclo com poucos cortes aprovados, exemplo de pontuação de depoimento de terceiro |
