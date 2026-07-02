---
task: "Prep Creatives"
responsavel: "@creative-prep-operator"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Pasta com criativos crus (videos/imagens ja produzidos) + tipo de lote (teste ou escala) + produto"
Saida: "Pasta {LOTE}/ pronta: criativos renomeados no padrao Andromeda, transcricoes, e manifesto criativos-{LOTE}.md com 3 titulos + 1 legenda (sem data) por criativo. Pronta pro scale/test-operator subir."
Checklist:
  - "Tipo de lote definido (teste ou escala) e nome do lote gerado"
  - "Videos transcritos (ffmpeg + whisper.cpp)"
  - "Consciencia (C1/C2/C3) e angulo inferidos da transcricao"
  - "Formato e hook confirmados pelo usuario"
  - "Nomenclatura aprovada e arquivos renomeados"
  - "3 titulos + 1 legenda gerados por criativo"
  - "Check de data: nenhuma legenda com data/referencia temporal"
  - "Pasta + manifesto .md entregues + handoff pro operador"
execution_type: "interactive"
quality_gate: "QG-PREP-001 (nomenclatura aprovada) + QG-PREP-002 (zero data na legenda)"
---

# Task: Prep Creatives — Preparar Lote de Criativos pro Upload

## Sumario Executivo

Transforma uma pasta de criativos crus (videos/imagens ja produzidos) num **lote pronto pra subir**: organizado, nomeado no padrao Andromeda, transcrito, com 3 titulos e a legenda completa de cada anuncio. O resultado e uma pasta + um `.md` que o scale-operator (escala) ou test-operator (teste) consome direto no upload via API.

**O que esta task NAO faz:** gravar/editar/gerar criativo (e da equipe de criacao) e subir no Meta (e do scale/test-operator). Ela prepara e empacota.

**2 regras inegociaveis:**
1. **Nomenclatura aprovada pelo usuario** antes de renomear (QG-PREP-001).
2. **Zero data na legenda** — o criativo e atemporal, roda em qualquer lote/ciclo (QG-PREP-002).

---

## Pipeline Visual

```
START
  |
  v
1. Apontar a pasta dos criativos crus + listar conteudo
  |
  v
2. Definir lote: TESTE ou ESCALA + nome do lote + produto
  |
  v
3. Criar estrutura {LOTE}/ (criativos/ transcricoes/ + manifesto)
  |
  v
4. Transcrever cada video (ffmpeg -> whisper.cpp -> .txt)
  |
  v
5. Classificar consciencia (C1/C2/C3) + angulo da transcricao
  |
  v
6. Confirmar FORMATO + HOOK com o usuario (lista nomeada)
  |
  v
7. [QG-PREP-001] Aprovacao da nomenclatura -> renomear arquivos
  |
  v
8. Gerar 3 titulos + 1 legenda por criativo (KB criativos-avaliacao)
  |
  v
9. [QG-PREP-002] Check de data em TODAS as legendas
  |
  v
10. Montar manifesto criativos-{LOTE}.md + empacotar pasta
  |
  v
11. Handoff -> scale-operator (setup-scale) ou test-operator (setup-test)
  |
  v
END
```

---

## Step-by-Step

### Step 1: Apontar a pasta e listar

Pedir o caminho da pasta com os criativos crus. Listar o conteudo:

```bash
ls -1 "<pasta>" | grep -iE '\.(mp4|mov|m4v|webm|png|jpg|jpeg)$'
```

Reportar: quantos videos, quantas imagens. Se nao bate com 9 (3 C1 + 3 C2 + 3 C3), avisar — mas nao bloquear (ver `criativos-avaliacao.md` Sec 6: nao ha minimo obrigatorio pra subir).

### Step 2: Definir o lote

Perguntar:
- **Teste ou escala?** (muda o prefixo)
- **Qual produto?** (codigo: NDF, ARC, ULTRA, ARK...)
- **Qual numero de lote?** (L01, L02...) — se ja existem lotes, sugerir o proximo

Montar o nome do lote conforme `knowledge/nomenclatura-protocol.md`:
- Escala: `ANDRO_{PRODUTO}` (campanha principal) ou `VENDAS_{PRODUTO}_{LOTE}`
- Teste: `TESTE_{PRODUTO}_{LOTE}`

### Step 3: Criar estrutura de saida

```bash
LOTE="ANDRO_NDF_L02"          # exemplo
DEST="<pasta-base>/${LOTE}"
mkdir -p "${DEST}/criativos" "${DEST}/transcricoes"
```

Manter os arquivos crus intactos ate a renomeacao ser aprovada (Step 7).

### Step 4: Transcrever os videos (ffmpeg + whisper.cpp)

**Pre-flight — checar ferramentas:**

```bash
command -v ffmpeg     >/dev/null || echo "FALTA_FFMPEG"
command -v whisper-cli >/dev/null || echo "FALTA_WHISPER"
```

- `FALTA_FFMPEG` -> guiar: `brew install ffmpeg`
- `FALTA_WHISPER` -> guiar: `brew install whisper-cpp` e baixar o modelo:
  ```bash
  # modelo recomendado (qualidade boa, ~1.5GB)
  curl -L -o ggml-medium.bin \
    https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin
  # alternativa leve pra maquina fraca: ggml-base.bin ou ggml-small.bin
  ```

Localizar o modelo (caminho tipico no Mac do Euriler):
`/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin`. Se nao houver, usar o `ggml-medium.bin` baixado acima e referenciar pelo caminho real.

**Transcrever cada video** (whisper.cpp exige WAV 16kHz mono):

```bash
MODEL="/opt/homebrew/share/whisper-cpp/models/ggml-medium.bin"  # ou caminho real
for f in "<pasta>"/*.mp4; do
  base="$(basename "${f%.*}")"
  # 1) extrair audio normalizado
  ffmpeg -y -i "$f" -ar 16000 -ac 1 -c:a pcm_s16le "/tmp/${base}.wav"
  # 2) transcrever em portugues, saida .txt
  whisper-cli -m "$MODEL" -f "/tmp/${base}.wav" -l pt -otxt -of "${DEST}/transcricoes/${base}"
done
```

> Preferencia do Euriler: na maquina dele, transcricao costuma ir pelo MacWhisper. Aqui o squad usa **whisper.cpp** de proposito — e a via autocontida que funciona tambem na maquina do aluno (squad distribuido). Se whisper-cli ja existir, usar direto; nao depender do app.

**Imagens** nao tem audio: pular a transcricao e, no Step 5, pedir o angulo/contexto ao usuario ou ler o texto que aparece na arte.

Ler cada `.txt` gerado antes de classificar.

### Step 5: Classificar consciencia + angulo (da transcricao)

Para cada criativo, ler a transcricao e classificar usando `knowledge/criativos-avaliacao.md`:

| Consciencia | Sinal na fala | Subtipos (Sec 3-5) |
|-------------|---------------|--------------------|
| **C1** | Fala do problema/universo, NAO do produto | dor/sintoma, quebra de padrao, conteudo de valor |
| **C2** | Apresenta a solucao/produto, posiciona autoridade | hard sell, demonstrativo, comparativo |
| **C3** | Prova, quebra de objecao, urgencia | prova social/mecanismo, objecao, urgencia |

Derivar o **angulo** (slug curto) do tema concreto: `dor-insta`, `metodo`, `result-aluno`, `do-zero`, `objecao-preco`... (exemplos em `nomenclatura-protocol.md` Sec 3).

Inferir tambem o **formato base**: video vs imagem (pelo tipo de arquivo). O formato fino (SELF/UGC/POD...) vem do usuario no Step 6.

### Step 6: Confirmar FORMATO + HOOK com o usuario

Apresentar a lista nomeada (consciencia/angulo ja inferidos), pedir o que falta:

```
PROPOSTA DE NOMENCLATURA — lote ANDRO_NDF_L02

  #  arquivo cru          consc.  angulo        -> nome (falta FORMATO+HOOK)
  -  -------------------  ------  ------------  ----------------------------------
  1  video_final_01.mp4   C1      dor-insta     {FORMATO}_dor-insta_C1_{Hnn}
  2  export_jube_02.mp4   C2      metodo        {FORMATO}_metodo_C2_{Hnn}
  3  depoimento_ana.mp4   C3      result-aluno  {FORMATO}_result-aluno_C3_{Hnn}
  ...

Consciencia e angulo eu tirei da transcricao. Me passa o FORMATO de cada um
(SELF/UGC/POD/NORMAL/LOFI/CAR/REEL... — EST pra estatica) e o HOOK (H01, H02...).
```

Codigos de formato validos em `nomenclatura-protocol.md` Sec 3. **Imagem estatica = `EST`** (padrao consolidado das campanhas reais; `IMG` e legado). Hook (H01...) = variacao de gancho; default H01 quando ha 1 versao.

### Step 7: [QG-PREP-001] Aprovar nomenclatura + renomear

Montar o nome final de cada criativo: `[FORMATO]_[ANGULO]_[CONSCIENCIA]_[Hnn]`. Validar contra a nomenclatura (formato existe? consciencia C1/C2/C3? hook Hnn?). Apresentar a lista final e pedir **OK explicito**.

Apos aprovado, renomear pra `{LOTE}/criativos/`:

```bash
cp "<pasta>/video_final_01.mp4" "${DEST}/criativos/SELF_dor-insta_C1_H01.mp4"
# ... um por criativo (renomear a transcricao junto, mesmo nome base)
```

**QG-PREP-001 bloqueia se:** usuario nao aprovou, ou algum nome foge do padrao.

### Step 8: Gerar 3 titulos + 1 legenda por criativo

Para cada criativo, usando a transcricao + `knowledge/criativos-avaliacao.md`:

**3 titulos (headline curto — campo `title`):**
- O titulo e o recurso visual mais importante pro algoritmo (Sec 7)
- 3 variacoes REAIS (angulos/ganchos diferentes), nao a mesma frase trocando 1 palavra
- Curto, no nivel de consciencia do criativo

**1 legenda (campo `message`):**
- Estilo definido com o Euriler: **media** — gancho na 1a linha + corpo curto que espelha a mensagem do video + CTA no fim
- No nivel de consciencia: C1 aperta a dor; C2 vende direto (Hard Sell 7 elementos, Sec 8); C3 prova/quebra objecao (5 objecoes, Sec 9)
- **CTA obrigatorio** (CR-10)

**CTA do Meta (`call_to_action.type`) — campo separado da legenda:**
- Sugerir por criativo (o operador confirma no upload). Regra observada na pratica real:
  **LEARN_MORE** pra C1/topo e conteudo de valor; **SHOP_NOW** pra C2/C3 de venda/oferta direta.

**[Opcional] descricao do link (`description`):**
- Frase curta de reforco (ex: "Workshop Negocio Digital do Futuro"). So quando agrega — nao obrigatoria.

**Regras do copy (inegociaveis):**
- **Zero data** — sem data (9/06, "junho"), dia da semana ("ate sexta"), ou referencia temporal datada ("amanha", "hoje", "essa semana", "24h"). Urgencia atemporal OK ("vagas limitadas", "por tempo limitado")
- **Espelhar, nao inventar** — nao criar oferta/promessa que nao esta no criativo
- **Sem expectativa pesada** — nada de "resultado garantido", numeros milagrosos, "ganhe X em Y dias"

### Step 9: [QG-PREP-002] Check de data

Varrer TODAS as legendas geradas antes de fechar:

```bash
grep -niE '([0-3]?[0-9]/[0-1]?[0-9])|(\b[0-3]?[0-9] de (jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez))|(janeiro|fevereiro|marco|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)|(\bamanh[aã]\b)|(\bhoje\b)|(\bontem\b)|(essa semana|esta semana|esse mes|este mes)|(segunda|terca|terça|quarta|quinta|sexta|sabado|sábado|domingo)|(\b\d{1,2}h\b)|(\b\d+ ?horas?\b)' "${DEST}/criativos-${LOTE}.md"
```

Qualquer match = reescrever o trecho como urgencia atemporal e rodar de novo. **QG-PREP-002 bloqueia a entrega enquanto houver match.**

> O grep e uma rede ampla — pode pegar falso-positivo (ex: "24 horas por dia" como expressao). Avaliar cada match: o que **data/amarra a um momento** sai; expressao atemporal fica.

### Step 10: Montar o manifesto + empacotar

Gerar `{LOTE}/criativos-{LOTE}.md`, uma entrada por criativo:

```markdown
# Lote {LOTE} — Manifesto de Criativos

> Pronto pra upload. O scale/test-operator usa: 1 dos 3 titulos no `title`
> e a legenda no `message` do `object_story_spec` (ver sop-upload-criativos-api.md).

## SELF_metodo_C2_H01
**Arquivo:** criativos/SELF_metodo_C2_H01.mp4
**Formato:** Selfie · **Consciencia:** C2 (hard sell) · **Angulo:** metodo · **Hook:** H01
**CTA (Meta):** SHOP_NOW
**Descricao do link (opcional):** Workshop Negocio Digital do Futuro

### Titulos (escolher 1)
1. ...
2. ...
3. ...

### Legenda
[gancho]
[corpo]
[CTA]

### Transcricao (referencia)
> ...

---
(proximo criativo)
```

Conferir a estrutura final:

```bash
find "${DEST}" -type f | sort
```

### Step 11: Handoff

```
Lote {LOTE} pronto. 📦

  {N} criativos nomeados em criativos/
  {N} transcricoes em transcricoes/
  criativos-{LOTE}.md — 3 titulos + legenda por anuncio
  Check de data: ✓ limpo

Subir esse lote:
- Escala -> @scale-operator + *setup-scale (aponta {LOTE}/)
- Teste  -> @test-operator + *setup-test

Chamo o operador?
```

---

## Quality Gates

### QG-PREP-001 — Nomenclatura Aprovada

- [ ] Cada criativo segue `FORMATO_ANGULO_CONSCIENCIA_Hnn`
- [ ] Formato valido (lista em `nomenclatura-protocol.md` Sec 3)
- [ ] Consciencia C1/C2/C3 coerente com a transcricao
- [ ] Usuario aprovou a lista ANTES da renomeacao

### QG-PREP-002 — Zero Data na Legenda

- [ ] Check de data rodou em todas as legendas (Step 9)
- [ ] Nenhuma data, dia da semana ou referencia temporal datada
- [ ] CTA presente em toda legenda
- [ ] Nenhuma promessa pesada / expectativa garantida

---

## Outputs

| Arquivo | Conteudo |
|---------|----------|
| `{LOTE}/criativos/*` | Criativos renomeados no padrao Andromeda |
| `{LOTE}/transcricoes/*.txt` | Transcricao de cada video (referencia) |
| `{LOTE}/criativos-{LOTE}.md` | Manifesto — 3 titulos + legenda por criativo |

---

## Error Handling

| Cenario | Acao |
|---------|------|
| ffmpeg/whisper ausente | Guiar instalacao (Step 4). Nao inventar transcricao |
| Modelo whisper ausente | Apontar download do `ggml-medium.bin` (ou `base`/`small` pra maquina fraca) |
| Video sem fala (so musica) | Pedir o angulo ao usuario — sem conteudo nao da pra classificar |
| Imagem estatica | Pedir angulo/contexto ou ler o texto da arte |
| Menos de 9 criativos | Preparar os que tem; listar subtipos faltantes (3 C1 + 3 C2 + 3 C3) |
| Formato ambiguo | Perguntar — FORMATO sempre vem do usuario |
| Legenda saiu com data | Reescrever como urgencia atemporal; QG-PREP-002 nao deixa entregar |
| Usuario quer pular aprovacao | Explicar que QG-PREP-001 exige OK antes de renomear (evita lote errado) |

---

**Task Status:** Ready for Production (v1.0.0 — 2026-06-09)
