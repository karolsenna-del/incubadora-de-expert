---
task: "Produce Carousel"
responsavel: "@producer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno tem templates salvos e quer produzir carrossel"
Saida: "PNGs numerados em ~/Downloads/{nome-do-carrossel}/"
execution_type: "interactive"
---

# Task: Produce Carousel

## Executive Summary

Recebe copy → infere slides → aluno escolhe template → produz PNGs.

## Steps

### Step 1: Receber Copy

```
Cola a copy do carrossel aqui.

Se ja tens texto separado por slide (com linhas vazias ou numeracao),
manda assim mesmo. Se for um texto corrido, eu separo.
```

### Step 2: Inferir Numero de Slides

Aplicar logica de `knowledge/infer-slides.md`:
- Conta blocos separados por linha vazia dupla
- Identifica marcadores numericos (1., 2., 3...)
- Identifica titulos vs corpo
- Sugere quebra em N slides

Confirmar:

```
Vai {N} slides:
- Slide 1 (capa): "{primeiras palavras do slide 1}..."
- Slide 2: "{primeiras palavras do slide 2}..."
- ...
- Slide N (CTA): "{ultimo slide}..."

Ta certo ou quer ajustar?
```

Se aluno quiser ajustar, deixar ele dizer "junta slide 2 e 3" / "separa slide 5 em 2" e refazer.

### Step 3: Escolher Template

Listar templates salvos:

```bash
TEMPLATES_DIR="$HOME/.carrossel-arcane/templates"
for tmpl in "$TEMPLATES_DIR"/*/; do
  NAME=$(grep "^name:" "$tmpl/meta.yaml" | cut -d'"' -f2)
  TYPE=$(grep "^type:" "$tmpl/meta.yaml" | cut -d'"' -f2)
  echo "$NAME ($TYPE) — $tmpl/preview.png"
done
```

Abrir todos os `preview.png` lado a lado:

```bash
open $(find "$TEMPLATES_DIR" -name "preview.png")
```

Mostrar pro aluno:

```
Tens {N} templates. Abri os previews no Finder.

Pra capa: qual queres? (recomendo o tipo "capa")
Pra slides de conteudo: qual? (recomendo "conteudo padrao")
Pra CTA/fechamento: qual? (recomendo "cta")

Podes usar 1 template pra tudo ou misturar.
```

Aluno escolhe. Se aluno escolher 1 so pra tudo, ok — pula essa pergunta.

### Step 4: Validar Compatibilidade

Pra cada slide + template escolhido:
- Verifica slots do template (`meta.yaml`)
- Se tem `image-ai` mas API nao configurada → avisa: "Slide {N} usa template com imagem AI mas API nao configurada. Tu envias imagem manual ou quer escolher outro template?"

### Step 5: Producao Slide a Slide

Pra cada slide (1 a N):

#### 5.1 Preparar Pasta de Output

```bash
NOME="${NOME:-$(date +%Y-%m-%d-%H%M)}"  # ou aluno escolhe
OUTPUT_DIR="$HOME/Downloads/$NOME"
mkdir -p "$OUTPUT_DIR"
```

Perguntar nome (opcional):

```
Como queres nomear esse carrossel? (default: {data-hora}, vai pra ~/Downloads/{nome}/)
```

#### 5.2 Montar HTML do Slide

1. Copia `template.html` pra pasta temporaria
2. Injeta texto do slide nos slots `text`
3. Aplica bold nas palavras-chave detectadas
4. Resolve placeholders de imagem:

**Se `image-ai`:**
- Gera prompt baseado em contexto do slide (texto + tipo)
- Chama API configurada (ver `knowledge/apis-imagem.md`)
- Salva PNG da imagem em pasta temporaria
- Mostra preview pro aluno:
  ```
  Slide {N}: imagem gerada via {provider}. Olha o preview.
  1. Aprovar e usar
  2. Regerar com prompt diferente
  3. Skip e enviar manual
  ```

**Se `image-manual`:**
- Pergunta: "Slide {N}: que imagem usar? Cola path do arquivo ou skip pra deixar vazio."
- Aluno responde
- Copia imagem pra pasta temporaria

**Se `image-none`:**
- Renderiza direto, sem pausa

#### 5.3 Renderizar PNG

```bash
CHROME=$(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null | head -1)
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 \
  --screenshot="$OUTPUT_DIR/slide-$(printf '%02d' $N).png" \
  "file:///tmp/slide-$N.html"
```

Aspect ratio 1080x1350 pra carrossel.

#### 5.4 Continuar pro Proximo Slide

Sem mostrar preview de cada PNG renderizado (so o final). Pausa so quando precisa input.

### Step 6: Entrega

```
Pronto. {N} slides em:

~/Downloads/{nome-do-carrossel}/
├── slide-01.png
├── slide-02.png
├── ...
└── slide-{N}.png

Abrir a pasta agora?
```

Se sim:

```bash
open "$OUTPUT_DIR"
```

## Quality Gates

- N PNGs no formato exato 1080x1350
- Numeracao sequencial sem gaps (slide-01.png, slide-02.png...)
- Pasta de output existe e e acessivel
- Cada PNG renderizado sem erros (sem texto cortado, sem placeholder ainda visivel)

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Aluno nao tem template salvo | Rotear pra `setup-identity` antes |
| Copy vazia ou muito curta (< 50 chars) | Avisar: "Copy parece curta pra carrossel. Confirma que e isso mesmo?" |
| Aluno escolheu template com IA mas API nao configurada | Oferecer 2 opcoes: configurar API agora ou trocar template |
| Pasta de output ja existe | Perguntar: "Sobrescrever ou usar nome novo?" |
| Renderizacao do PNG falha | Logar erro, mostrar HTML que falhou, pedir pra aluno avaliar |
