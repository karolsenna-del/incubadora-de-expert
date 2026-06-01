# Squad Carrossel Arcane

> **Versao 1.0.0** — release 2026-05-21. Squad pra producao de carrosseis e posts estaticos pra Instagram. Identity Designer + Producer. Output em ~/Downloads/.

---

## Ativacao

```
/squad-carrossel-arcane
```

---

## Fluxo

### Primeiro uso

1. Identity Designer pergunta tuas referencias visuais
2. (Opcional) configura API de imagem AI
3. Loop iterativo de criacao de templates (3-5 ideal, 1 minimo)
4. Templates salvos em `~/.carrossel-arcane/templates/`

### Producao normal

1. Greeting mostra menu (carrossel / post estatico / add template / listar)
2. Cola copy
3. Squad infere numero de slides e confirma
4. Aluno escolhe template (previews visuais)
5. Producer monta cada slide:
   - Pausa em placeholders de imagem AI (mostra preview)
   - Pausa em placeholders manuais (pede imagem)
   - Slides so texto rodam direto
6. PNGs em `~/Downloads/{nome-do-carrossel}/`

---

## Agentes

| Agente | Funcao |
|--------|--------|
| **carrossel-chief** | Orchestrator. Detecta estado, mostra menu, roteia |
| **identity-designer** | Cria templates visuais iterativamente |
| **producer** | Produz carrossel/post a partir de copy + template |

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
├── templates/
│   ├── capa-minimalista/
│   │   ├── template.html
│   │   ├── meta.yaml
│   │   ├── preview.png
│   │   └── assets/avatar.png
│   ├── conteudo-padrao/
│   │   └── ...
│   └── cta-limpo/
│       └── ...
└── config/
    └── api.yaml          # so se conectou API
```

Output dos carrosseis vai pra:

```
~/Downloads/{nome-do-carrossel}/
├── slide-01.png
├── slide-02.png
└── slide-N.png
```

---

## Comandos

| Comando | Descricao |
|---------|-----------|
| `*start` | Detecta estado e roteia |
| `*setup` | Forcar fluxo Identity Designer |
| `*produce` | Forcar fluxo Producer |
| `*list` | Listar templates salvos |
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
