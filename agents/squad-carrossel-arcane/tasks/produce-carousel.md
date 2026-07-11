---
task: "Produce Carousel"
responsavel: "@producer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno tem templates salvos e quer produzir carrossel"
Saida: "PNGs numerados em ~/Downloads/{nome-do-carrossel}/ E entregues em business/instagram/fila/{slug}/"
execution_type: "interactive"
---

# Task: Produce Carousel

## Executive Summary

Recebe copy → separa em blocos → mapeia imagens por número → monta `slides.json` → roda o motor `tools/build-carousel.mjs` → entrega PNGs 1080x1350.

O motor cuida do visual padrão (header tweet + auto-fit do texto + imagem full-width com bordinha). O trabalho de inteligência do Producer é: **separar a copy, aplicar bold estratégico e mapear as imagens.**

---

## Padrão de Layout (validado 12/06/2026)

Não reinventar o CSS. O motor já aplica:

- **Header estilo tweet:** avatar circular + nome + selo verificado + @handle (vem do `meta.yaml` do template)
- **Texto com bold manual** nas palavras de impacto (números, conceitos novos, comandos)
- **Auto-fit:** a fonte do texto encolhe sozinha até o conjunto caber harmônico em 1350px. Texto longo → fonte menor; curto → fonte maior. Nunca estoura.
- **Imagem full-width com bordinha lateral** (`image_side_margin`, default 38px), **sem borda arredondada** (`image_radius: 0`) — orgânico.
- **Slide sem imagem** → text-only, centralizado verticalmente.

Pra mudar o look (margem da imagem, cor, fonte, nome): editar o `meta.yaml` do template, **não** o motor.

---

## Convenção de Mapeamento (CRÍTICA)

**`card{N}` na pasta de imagens = bloco {N} da copy.**

- A copy é separada em blocos por linhas com `-` isolado (ou linha vazia dupla). O 1º bloco é o slide 1, e assim por diante.
- Pra cada bloco N, procurar `card{N}-FINAL.png` (ou `card{N}.png`) na pasta de imagens do aluno.
  - **Existe** → slide com imagem.
  - **Não existe** → slide text-only (não inventar imagem).
- Anotações de direção visual entre parênteses na copy (ex: "(Foto do Trump...)") **não são texto do post** — viram a imagem `card{N}`. Tirar do texto.

---

## Steps

### Step 1: Receber Copy + Pasta de Imagens

```
Cola a copy do carrossel.
E me diz a pasta das imagens (ex: ~/Downloads/carrossel-x/), onde os arquivos
seguem o padrão card1-FINAL.png, card2-FINAL.png... (card{N} = bloco {N}).
```

### Step 2: Separar em Blocos + Confirmar

Aplicar `knowledge/infer-slides.md`. Confirmar com o aluno:

```
Vai {N} slides:
- Slide 1 (capa): "{primeiras palavras}..."  [imagem: card1 ✓ / sem card → texto]
- ...
Ta certo ou ajustamos?
```

### Step 3: Montar o slides.json

Pra cada bloco: aplicar bold (`<strong>`), limpar anotações de direção, resolver imagem.

```json
{
  "template": "euriler-tweet-light",
  "name": "carrossel-mythos",
  "slides": [
    { "text": "<strong>Breaking News:</strong> ...", "image": "/Users/.../carrossel-mythos/card1-FINAL.png" },
    { "text": "...", "image": null }
  ]
}
```

- `template`: slug da pasta em `~/.carrossel-arcane/templates/`
- `name`: vira `~/Downloads/{name}/`
- `image`: path absoluto do `card{N}` OU `null` (text-only)

### Step 4: Rodar o Motor

```bash
node squads/squad-carrossel-arcane/tools/build-carousel.mjs <slides.json>
```

Renderiza tudo em `~/Downloads/{name}/slide-NN.png` (1080x1350). Reporta quantos com imagem / text-only. Avisa se algum `card{N}` apontado não existe (vira text-only).

### Step 5: Validar e Entregar

- Conferir alguns slides (capa, um de texto denso, um com imagem que tenha texto nas bordas, o CTA).
- Garantir: fonte carregou, sem texto cortado, imagem inteira (sem corte de elemento importante), nada de placeholder.
- Sinalizar inconsistências imagem×texto pro aluno revisar (a copy é dele).

```
Pronto. {N} slides em ~/Downloads/{name}/. Abrir?
```

```bash
open "$HOME/Downloads/{name}"
```

### Step 6: Entregar na Fila do Agendador (OBRIGATÓRIO — fecha o pipeline)

Depois de renderizar e validar, **copiar os slides pra fila do insta-scheduler**. É isso que
faz o post ser agendado sem a Karol enviar nada na mão.

- **Slug canônico:** o nome da pasta do post em `docs/producao-conteudo/{expert}/posts/{slug}/`
  (NÃO o `{name}` do Downloads). Ex: post `ia-braco-do-expert` → fila `ia-braco-do-expert`.
  Na dúvida de qual é o slug, confirmar com o aluno antes de copiar.
- **Destino:** `business/instagram/fila/{slug}/`
- **Copiar** todos os `slide-NN.png` mantendo a numeração (slide-01.png, slide-02.png, ...).

```bash
mkdir -p "business/instagram/fila/{slug}"
cp "$HOME/Downloads/{name}"/slide-*.png "business/instagram/fila/{slug}/"
```

Contrato completo da fila: `agents/insta-scheduler/data/insta-scheduler-rules.md` (RULE-1).
O squad de conteúdo deposita o `legenda.txt` na mesma pasta — quando os dois chegam, o
insta-scheduler agenda.

```
Slides entregues na fila: business/instagram/fila/{slug}/ ({N} PNGs).
Falta só o legenda.txt (squad de conteúdo) pra o insta-scheduler agendar.
```

## Re-render parcial

Trocou 1 imagem (mesmo nome) ou 1 texto? Editar o `slides.json` e rodar o motor de novo — ele limpa e regenera. Pra um único slide, renderizar só o HTML afetado do build dir.

## Quality Gates

- N PNGs em 1080x1350, numeração sequencial sem gaps
- Cada PNG sem texto cortado, sem placeholder, imagem inteira
- Pasta de output existe e acessível

## Veto Conditions

| Cenário | Ação |
|---------|------|
| Aluno não tem template salvo | Rotear pra `setup-identity` antes |
| Copy < 50 chars | "Copy curta pra carrossel. Confirma?" |
| `card{N}` apontado não existe | Motor vira text-only e avisa — confirmar com aluno se era pra ter imagem |
| Pasta de output já existe | Motor sobrescreve só os `slide-*.png` — confirmar nome antes se houver dúvida |
| Template sem campos de identidade no meta.yaml | Motor usa defaults ("Autor"/"usuario") — completar `author_name`/`author_handle` no template |

## Nota de manutenção

O motor lê a identidade do `meta.yaml` do template: `author_name`, `author_handle`, `verified`,
`font`, `bg`, `text_color`, `image_side_margin`, `image_radius`, `text_size_image`, `text_size_textonly`.
Templates criados pelo `identity-designer` devem gravar esses campos (senão caem nos defaults).
