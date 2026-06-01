---
task: "Setup Identity"
responsavel: "@identity-designer"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Aluno em primeiro uso, sem templates"
Saida: "1-5 templates salvos em ~/.carrossel-arcane/templates/"
execution_type: "interactive"
---

# Task: Setup Identity — Criar Templates Iniciais

## Executive Summary

Loop iterativo de criacao de templates baseados em referencias e identidade visual do aluno. Termina quando aluno tem pelo menos 1 template (ideal: 3-5).

## Steps

### Step 1: Coletar Identidade

Perguntar (numa mensagem so):

```
Pra criar teus templates preciso entender teu estilo visual:

1. Tens referencias? Manda 3-5 prints/links de carrosseis que admira
   (Pinterest, IG de criadores que gostas, etc).

2. Tens identidade visual definida? Paleta de cores, fontes especificas,
   logo, regras de marca?

3. Sem nada disso? Descreve em 1 frase como queres que pareca
   ("minimalista", "vibrante", "serio", "tropical", etc).

Pode mandar 1, 2 ou 3 — qualquer combinacao.
```

### Step 2: Configurar API de Imagem AI (opcional)

```
Antes de criar templates, decide isso:

Queres conectar API de geracao de imagem? Util se planeja produzir muitos
carrosseis com imagens AI (tipo colagens visuais por slide).

E opcional — da pra fazer carrosseis 100% texto ou enviar imagens manuais.

Opcoes:
- OpenAI gpt-image (~$0.04-0.20 por imagem)
- Google Gemini (gratuito ate certo limite)
- Nano Banana (via Higgsfield)

Conectar agora ou skip?
```

Se conectar:
- Pedir chave
- Salvar em `~/.carrossel-arcane/config/api.yaml` com `chmod 600`
- Confirmar: "API {provider} configurada. Templates podem usar placeholders AI."

Se skip:
- Templates serao criados sem placeholders AI (so texto + imagens manuais opcionais)
- Aluno pode configurar depois via `add-template` ou edicao manual

### Step 3: Loop de Criacao (por template)

Pra cada template:

#### 3.1 Decidir tipo do template

Sugerir 1 dos tipos comuns:
- **Capa** — texto curto + visual forte (1o slide do carrossel)
- **Conteudo padrao** — texto medio + 1 imagem (slides do meio)
- **CTA/Fechamento** — texto curto + assinatura (ultimo slide)
- **Lista numerada** — itens numerados, sem imagem
- **Citacao/Quote** — texto grande centralizado
- **Stats hero** — numero grande + descricao

Recomendar pro aluno: pelo menos Capa + Conteudo padrao + CTA pra ter um carrossel completo.

#### 3.2 Montar v1 do template

Baseado em referencias + identidade + tipo:
- Cria HTML+CSS em pasta temporaria
- Usa Open Sans default (ou fonte do aluno se especificou)
- Aspect ratio 1080x1350 (carrossel) ou 1080x1080 (estatico)
- Coloca placeholders apropriados ao tipo

#### 3.3 Renderizar e Mostrar

```bash
# Renderiza HTML → PNG via Chromium headless
CHROME=$(find ~/Library/Caches/ms-playwright -name "Google Chrome for Testing" -type f 2>/dev/null | head -1)
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=1080,1350 \
  --screenshot="$TEMPLATES_DIR/{slug}/preview.png" \
  "file://$TEMPLATES_DIR/{slug}/template.html"
```

Abrir PNG e mostrar pro aluno.

#### 3.4 Coletar Feedback

```
Renderizei o template {tipo}. Olha o PNG.

O que muda? Cor, fonte, layout, tamanho, qualquer coisa.
Ou ja ta bom?
```

#### 3.5 Loop de Ajustes

- Ajustar baseado no feedback (max 4 iteracoes por template)
- Re-renderizar
- Mostrar
- Confirmar: "Ta bom agora ou ainda quer mexer?"

#### 3.6 Salvar Template

Estrutura salva:

```
~/.carrossel-arcane/templates/{slug-do-template}/
├── template.html           # base parametrizavel
├── meta.yaml               # config (tipo, slots, dimensoes)
├── preview.png             # render exemplo
└── assets/                 # imagens fixas (logo, avatar)
    └── avatar.png
```

`meta.yaml` formato:

```yaml
name: "Capa Minimalista"
slug: "capa-minimalista"
type: "capa"               # capa, conteudo, cta, lista, quote, stats
dimensions: "1080x1350"
font: "Open Sans"
slots:
  - id: "headline"
    type: "text"           # text, image-ai, image-manual, image-none
    placeholder: "Texto da capa aqui"
  - id: "subtext"
    type: "text"
    placeholder: "Subtexto opcional"
  - id: "hero-image"
    type: "image-ai"       # gera via API se configurada
    fallback: "image-manual"  # se sem API, aluno envia imagem
created_at: "2026-05-21T00:00:00Z"
```

### Step 4: Mais um Template?

```
Salvei "{nome do template}".

Queres criar mais um? Recomendo ter 3-5 templates de tipos diferentes
pra cobrir capa, conteudo, CTA e variacoes.

1. Sim, criar mais um
2. Nao, ja chega — bora produzir
```

→ Se sim, voltar ao Step 3
→ Se nao, devolver controle pro @carrossel-chief com mensagem:

```
Setup completo. {N} templates salvos.

Volta no Identity Designer quando quiser adicionar mais templates
(`add-template`). Pra produzir, e so chamar `/squad-carrossel-arcane`
novamente.
```

## Quality Gates

- Pelo menos 1 template salvo com `meta.yaml` valido
- Cada template tem `preview.png` renderizado
- Se API configurada, chave salva com permissoes corretas (chmod 600)
- Aluno explicitamente aprovou cada template ("ta bom")

## Veto Conditions

| Cenario | Acao |
|---------|------|
| Aluno nao tem nenhuma referencia | Propor defaults baseados em nicho do aluno (perguntar nicho) |
| Aluno pede 10+ templates de cara | Avisar: "Recomendo 3-5 pra comecar, voce sempre pode voltar pra adicionar mais" |
| Aluno aprova primeiro template em 1 round | Salvar e perguntar se quer mais — nao forcar ajustes |
| Aluno nao aprova depois de 4 iteracoes | Sugerir pausar: "Vamos salvar como ta e continuar depois?" |
