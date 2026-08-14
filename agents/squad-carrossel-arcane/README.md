# Squad Carrossel Arcane

> **Versao 1.2.0** — Squad pra producao de carrosseis e posts estaticos pra Instagram. Faz a ARTE do post (nao a copy), em duas camadas: arte em CSS + imagem gerada por IA. Output em ~/Downloads/.

---

## Ativacao

```
/squad-carrossel-arcane
```

---

## O que faz / o que NAO faz

**Faz:** transforma copy pronta em carrossel ou post estatico — PNGs prontos pra postar.

**Nao faz:** nao escreve a copy nem o texto do post (isso tu traz pronto) e nao posta em rede social (entrega os arquivos).

---

## As duas camadas visuais

Entender essa separacao e o que faz usar bem o squad:

| Camada | O que e | Onde e feita | Custo | Agente |
|--------|---------|--------------|-------|--------|
| **1. Arte em CSS** | A moldura do post: fundo, tipografia, layout, avatar, caixa de texto | Aqui, no Claude Code (HTML+CSS → PNG via Chromium) | Nenhum — refaz a vontade | Identity Designer |
| **2. Imagem de IA** | A ilustracao de conteudo do card: a cena que encena a tese e para o scroll | GPT Image 2 / Nano Banana Pro | Gasta credito/API | Image Director |

Um carrossel forte normalmente usa as **duas** — a imagem de IA entra dentro da moldura CSS. Carrossel so-texto usa so a camada 1.

---

## Os dois padroes reutilizaveis

Define uma vez, reusa em todo post:

| Padrao | Camada | Agente | Onde fica |
|--------|--------|--------|-----------|
| **Template de arte** | 1 (CSS) | Identity Designer | `~/.carrossel-arcane/templates/` |
| **Estilo de imagem** | 2 (IA) | Image Director | `~/.carrossel-arcane/image-styles/` |

O estilo de imagem faz toda imagem gerada sair na tua linguagem visual em qualquer sessao nova — o conhecimento vive no template, nao na conversa. O squad ja vem com o estilo `euriler` embarcado como referencia.

---

## Fluxo

### Primeiro uso

1. Identity Designer pergunta tuas referencias visuais
2. Loop iterativo de criacao de templates de arte (3-5 ideal, 1 minimo)
3. Templates salvos em `~/.carrossel-arcane/templates/`

### Producao com imagens de IA

1. **Image Director** carrega/calibra teu estilo de imagem
2. Gera as imagens dos cards (batch ou incremental) → `card{N}-FINAL.png`
3. Cristaliza os aprendizados no teu estilo salvo
4. **Producer** monta o carrossel apontando pra essa pasta

### Producao so-texto

1. Cola copy → Producer infere numero de slides e confirma
2. Escolhe template de arte (previews visuais)
3. PNGs em `~/Downloads/{nome-do-carrossel}/`

---

## Agentes

| Agente | Funcao |
|--------|--------|
| **carrossel-chief** | Orchestrator. Apresenta o squad, detecta estado, roteia |
| **identity-designer** | Cria/ajusta o template de arte em CSS (camada 1) |
| **image-director** | Define o estilo de imagem e gera as imagens de IA dos cards (camada 2) |
| **producer** | Junta copy + template + imagens e entrega os PNGs |

---

## Dependencias

### Obrigatorias

- **Chromium ou Chrome** pra renderizar HTML como PNG
  - Recomendado: `npx @playwright/mcp install-browser chromium`
  - Fallback: Chrome instalado no sistema

- **Python 3.x** pra manipulacao de imagens (PIL)

### Opcionais

- **Chave de API de geracao de imagem** — so se for usar placeholders AI
  - OpenAI gpt-image-2 (~$0.04-0.20/imagem)
  - Google Gemini (free tier disponivel)
  - Nano Banana via Higgsfield

---

## Estrutura de Arquivos do Aluno

Apos primeiro uso, o squad cria estes diretorios na home do aluno:

```
~/.carrossel-arcane/
├── templates/                # CAMADA 1 — arte em CSS (Identity Designer)
│   ├── capa-minimalista/
│   │   ├── template.html
│   │   ├── meta.yaml
│   │   ├── preview.png
│   │   └── assets/avatar.png
│   ├── conteudo-padrao/
│   │   └── ...
│   └── cta-limpo/
│       └── ...
├── image-styles/             # CAMADA 2 — estilo das imagens de IA (Image Director)
│   └── {meu-estilo}/
│       ├── style.md          # regras, direcao visual, vibe
│       ├── examples.md       # texto do card → prompt → resultado aprovado
│       └── meta.yaml
└── config/
    └── api.yaml              # so se conectou API de imagem
```

Output dos carrosseis vai pra:

```
~/Downloads/{nome-do-carrossel}/
├── card-1-FINAL.png      # imagens de IA (Image Director)
├── card-2-FINAL.png
├── slide-01.png          # post montado (Producer)
├── slide-02.png
└── slide-N.png
```

---

## Comandos

| Comando | Descricao |
|---------|-----------|
| `*start` | Apresentacao + detecta estado + roteia |
| `*setup` | Criar template de arte CSS (Identity Designer) |
| `*images` | Gerar as imagens de IA dos cards (Image Director) |
| `*style` | Criar/ajustar o estilo padrao de imagem (Image Director) |
| `*produce` | Montar o post (Producer) |
| `*list` | Listar templates de arte e estilos de imagem salvos |
| `*help` | Comandos |
| `*exit` | Sair |

---

## Tipos de Template Suportados

- **Capa** — slide 1 do carrossel (headline curta + visual)
- **Conteudo padrao** — slides do meio (1 ideia + opcionalmente imagem)
- **CTA/Fechamento** — ultimo slide (pergunta + comando)
- **Lista numerada** — itens 1, 2, 3...
- **Citacao/Quote** — frase grande centralizada
- **Stats hero** — numero gigante + descricao
- **Antes/Depois** — 2 imagens lado a lado
- **Custom** — qualquer estrutura que Identity Designer crie

---

## Casos de Uso

### Aluno solo (sem designer)
1. Cria 3-5 templates uma vez
2. Toda copy nova → carrossel em 5 minutos

### Aluno com nicho visual forte
1. Manda referencias do Pinterest
2. Identity Designer cria templates fieis ao estilo
3. Producao mantem consistencia visual de marca

### Aluno produzindo com imagens AI
1. Configura API no setup
2. Templates usam placeholders AI
3. Producer gera imagens automaticamente, aluno aprova

### Aluno produzindo so com texto
1. Skipa API no setup
2. Templates so texto (capa, lista, quote, CTA)
3. Producao 100% automatica sem pausas

---

## NAO faz

- Postar automaticamente em Instagram/TikTok (entrega arquivos, postagem e manual)
- Criar copy/roteiro (use `/squad-conteudo-arcane`)
- Criar apresentacoes pra palestra/aula (use `/slideForgeV2`)
- Editar videos (use squad-iavideos-arcane ou pipeline de video)

---

## Smoke Test

```bash
# 1. Verificar estrutura
ls squads/squad-carrossel-arcane/
# Esperado: agents/ tasks/ workflows/ knowledge/ data/ tools/ templates-base/ README.md skill.md squad.yaml

# 2. Verificar Chromium disponivel
bash squads/squad-carrossel-arcane/tools/render.sh --help 2>&1 | head -1

# 3. Renderizar template base como teste
bash squads/squad-carrossel-arcane/tools/render.sh \
  squads/squad-carrossel-arcane/templates-base/tweet-light/template.html \
  /tmp/test-render.png
open /tmp/test-render.png
```
