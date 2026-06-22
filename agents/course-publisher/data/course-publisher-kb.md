# Course Publisher — Knowledge Base

**Versao:** 1.0.0
**Worker:** course-publisher
**Dominio:** Design de plataforma educacional + publicacao Hotmart Club

---

## 1. HOTMART CLUB — DIMENSOES DE ASSETS

Dimensoes oficiais para todos os assets da Hotmart Club. Usar sem tolerancia — pixel exato.

| Asset | Dimensoes (px) | Formato | Uso |
|-------|---------------|---------|-----|
| Capa de modulo | 1920 × 1080 | PNG/JPG | Galeria de modulos (modo "Galeria") |
| Thumbnail de aula | 1280 × 720 | PNG/JPG/GIF/BMP | Miniatura de cada aula (max 2MB) |
| Thumbnail vertical do produto (vitrine) | 720 × 1040 | PNG/JPG | Produto na vitrine da area de membros |
| Banner vitrine — desktop | 1920 × 800 | PNG/JPG/GIF | Banner principal da vitrine |
| Banner vitrine — mobile | 720 × 960 | PNG/JPG/GIF | Banner mobile (max 5MB pra GIF) |
| Header do produto | 1920 × 640 | PNG/JPG | Header interno do produto |
| Certificado (padrao) | 2480 × 3508 | PNG/JPG | Fundo do certificado (A4 portrait) |
| Certificado (alta qualidade) | 4960 × 7016 | PNG/JPG | Fundo do certificado alta resolucao |
| Avatar do produto | 600 × 600 | PNG/JPG | Icone do produto |
| Logo da vitrine | 112 × 40 | PNG | Logo no header da vitrine |
| Imagem de cabecalho | 180 × 48 | PNG (fundo transparente) | Header interno |
| Tela de acesso (fundo) | 2912 × 2160 | PNG/JPG (max 8MB) | Pagina de login da area de membros |

### Configuracao de Galeria de Modulos

Para que as capas de modulo apare cam, o modo de exibicao precisa ser "Galeria":
- Acesse o produto → Personalizacao → Exibicao dos modulos → alterar de "Lista" para "Galeria"

---

## 2. DESIGN SYSTEM — INCUBADORA DE EXPERT

### Paleta oficial da marca

| Papel | Hex | Uso |
|-------|-----|-----|
| Laranja (acento principal) | `#f85627` | Destaques, numeros, elementos visuais de impacto |
| Cinza claro | `#ddddde` | Elementos secundarios, separadores |
| Quase preto | `#090a0b` | Fundo padrao da mentoria |
| Branco | `#fcfcfc` | Texto claro, fundos limpos |

### Design System — Expert360º (variacao)

| Papel | Hex | Uso |
|-------|-----|-----|
| Base dominante | `#090a0b` | Fundo principal das capas (mais denso que a mentoria) |
| Acento | `#f85627` | Numero do modulo, elementos de destaque |
| Texto principal | `#fcfcfc` | Titulos e subtitulos |
| Neutro | `#ddddde` | Uso minimo — textos secundarios |

### Tom Visual

- Autoritario e humano — sem frieza corporativa
- Direto, sem ornamentos — cada elemento tem funcao
- Premium sem ostentacao
- Sem gradientes neon, raios, estrelas, confete
- Referencias: MasterClass, Escola do Copywriting
- Evitar: visual de guru digital, paletas vibrantes/motivacionais

### Tipografia

- **Familia:** sans-serif bold, all-caps para titulos (no HTML: Arial Black, Impact, ou fontes web similares)
- **Hierarquia:** Label do produto > Numero do modulo (grande) > Nome do modulo > Subtitulo
- Numero do modulo em `#f85627`, grande (acento visual)
- Nome do modulo em `#fcfcfc`, peso maximo

### Template HTML base (capa de modulo 1920×1080)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;900&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px;
      height: 1080px;
      background: #090a0b;
      font-family: 'Montserrat', 'Arial Black', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 100px 120px;
      overflow: hidden;
      position: relative;
    }
    .bg-number {
      position: absolute;
      right: 80px;
      top: -40px;
      font-size: 520px;
      font-weight: 900;
      color: #f85627;
      opacity: 0.07;
      line-height: 1;
      user-select: none;
    }
    .label {
      color: #f85627;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .module-name {
      color: #fcfcfc;
      font-size: 100px;
      font-weight: 900;
      text-transform: uppercase;
      line-height: 0.95;
      margin-bottom: 24px;
    }
    .subtitle {
      color: #ddddde;
      font-size: 36px;
      font-weight: 400;
      opacity: 0.7;
    }
    .bottom-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: #f85627;
    }
  </style>
</head>
<body>
  <div class="bg-number">{NUMERO}</div>
  <div class="label">Expert360º — Modulo {NUMERO}</div>
  <div class="module-name">{NOME_MODULO}</div>
  <div class="subtitle">{SUBTITULO}</div>
  <div class="bottom-bar"></div>
</body>
</html>
```

### Modulos do Expert360º

| Modulo | Numero | Nome | Subtitulo |
|--------|--------|------|-----------|
| M0 | 0 | Desbloqueio | Sua historia e o seu metodo |
| M1 | 1 | Persona e Promessa | Para de vender pra todo mundo |
| M2 | 2 | Metodo Autoral | Incopivel. Com nome proprio. |
| M3 | 3 | Vendas Secretas | 3 vendas reais antes de aparecer |
| M4 | 4 | Autoridade Digital | Presenca que vende sem precisar pedir |
| Orientacoes | — | Modulo de Orientacoes | Como aproveitar cada etapa do curso |

---

## 3. PLAYWRIGHT — RENDERIZACAO HTML → PNG

### Fluxo padrao de geracao de PNG

```python
from playwright.sync_api import sync_playwright

def render_html_to_png(html_path, output_path, width, height):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_viewport_size({"width": width, "height": height})
        page.goto(f"file://{html_path}")
        page.wait_for_timeout(500)  # aguarda fontes web carregarem
        page.screenshot(path=output_path, full_page=False)
        browser.close()
```

### Dimensoes por tipo de asset

| Asset | width | height |
|-------|-------|--------|
| Capa de modulo | 1920 | 1080 |
| Thumbnail de aula | 1280 | 720 |
| Banner vitrine desktop | 1920 | 800 |
| Banner vitrine mobile | 720 | 960 |
| Header produto | 1920 | 640 |
| Thumbnail vertical produto | 720 | 1040 |
| Certificado padrao | 2480 | 3508 |

### Verificacao de dimensoes pos-geracao

```python
from PIL import Image
img = Image.open(output_path)
assert img.size == (width, height), f"Dimensao incorreta: {img.size}"
```

### Fontes web

- Se usar Google Fonts no HTML, aguardar 1000ms (nao 500ms) para garantir carregamento
- Alternativa offline: usar stack de sistema (`Arial Black`, `Impact`, `Trebuchet MS`)
- Para consistencia maxima, preferir fontes do sistema

---

## 4. PLAYWRIGHT — NAVEGACAO HOTMART CLUB

### URL de acesso

```
https://app.hotmart.com
Login: ver vault
```

### Persistencia de Sessao (uso normal — sem codigo 2FA)

A sessao e salva em `agents/course-publisher/data/.session/hotmart-session.json` apos o primeiro login.
Nas proximas execucoes, o worker carrega a sessao salva e ja esta autenticado.

```python
from playwright.sync_api import sync_playwright
import os, json

SESSION_PATH = "agents/course-publisher/data/.session/hotmart-session.json"

def get_browser_context(playwright):
    browser = playwright.chromium.launch(headless=False)
    if os.path.exists(SESSION_PATH):
        # Sessao existente — carrega e usa sem login
        context = browser.new_context(storage_state=SESSION_PATH)
    else:
        # Primeira vez — login manual + salva sessao
        context = browser.new_context()
        page = context.new_page()
        page.goto("https://app.hotmart.com")
        # Preencher email e senha do vault
        # Aguardar 2FA: worker pausa ate usuario inserir o codigo
        input("Insira o codigo 2FA no navegador e pressione Enter aqui para continuar...")
        # Salvar sessao para proximos usos
        os.makedirs(os.path.dirname(SESSION_PATH), exist_ok=True)
        context.storage_state(path=SESSION_PATH)
    return browser, context
```

**Resultado:** primeira execucao pede o codigo uma unica vez. Todas as seguintes: login automatico.

### Sessao expirada (quando o codigo volta a aparecer)

Se a Hotmart invalidar a sessao (troca de senha, expiracao longa):
1. Deletar `agents/course-publisher/data/.session/hotmart-session.json`
2. Executar o worker novamente — vai pedir o codigo uma vez e salvar nova sessao

### Fluxo de login (primeira vez)

```
1. Navegar para https://app.hotmart.com
2. Preencher email (vault: HOTMART_EMAIL)
3. Preencher senha (vault: HOTMART_PASSWORD)
4. Clicar em "Entrar"
5. Hotmart envia codigo pro email → worker pausa → usuario insere o codigo
6. Apos autenticacao: salvar sessao em SESSION_PATH
7. Proximas execucoes: carregar SESSION_PATH → ja autenticado
```

### Navegacao para produto

```
Dashboard → "Produtos" no menu lateral
→ Localizar produto pelo nome
→ Clicar em "Gerenciar" ou no produto
→ Acessar aba "Conteudo" ou "Modulos"
```

### Upload de aula (fluxo geral)

```
1. Navegar ate o modulo correto
2. Clicar em "Adicionar aula" / "+ Aula"
3. Selecionar tipo: Video
4. Upload do arquivo: page.set_input_files(selector, video_path)
5. Aguardar conclusao do upload (pode demorar varios minutos)
   - Monitorar barra de progresso ou estado do botao
   - Timeout minimo: 30 minutos para videos grandes
6. Preencher titulo (limpo, sem hifens/numeros)
7. Preencher descricao (de descricoes.md)
8. Salvar
```

### Configurar capa de modulo

```
1. No modulo → clicar em editar / icone de imagem
2. Upload da capa (PNG 1920×1080 da pasta assets/capas-modulos/)
3. Confirmar
```

### Configurar thumbnail de aula

```
1. Na aula → editar → imagem em miniatura
2. Upload do thumbnail (PNG 1280×720 da pasta assets/thumbnails/)
3. Confirmar
```

### Seletores (podem variar — atualizar no Playbook se mudar)

Hotmart atualiza o frontend periodicamente. Se um seletor quebrar:
1. Inspecionar elemento via Playwright
2. Atualizar SOP no Playbook
3. Registrar na secao Troubleshooting desta KB

---

## 5. LEITURA DO `descricoes.md`

### Formato esperado do arquivo

```markdown
# Descricoes das Aulas — {Produto}

## M0

### 00-intro
Bem-vinda ao Modulo 0. Neste modulo voce vai...

### 01-fracasso-como-prova
Aqui voce vai entender por que seus fracassos sao...

## M1

### 00-intro
...
```

### Logica de parse

1. Ler o arquivo completo
2. Localizar a secao do modulo atual (`## M{N}`)
3. Dentro da secao, localizar o subsecao com o nome do arquivo de video (sem extensao)
4. Extrair o texto abaixo como descricao
5. Se nao encontrar: subir sem descricao e registrar o gap

---

## 6. CONVENCAO DE NOME DE ARQUIVO → TITULO LIMPO

```python
import re

def clean_title(filename):
    # Remove extensao
    name = filename.rsplit('.', 1)[0]
    # Remove prefixo numerico (00-, 01-, 02-, etc.)
    name = re.sub(r'^\d+[-_]', '', name)
    # Substitui hifens e underscores por espacos
    name = name.replace('-', ' ').replace('_', ' ')
    # Capitaliza cada palavra
    name = name.title()
    return name

# Exemplos:
# "01-fracasso-como-prova.mp4" → "Fracasso Como Prova"
# "00-intro.mp4" → "Intro"
# "03-historia-real.mp4" → "Historia Real"
```

---

## 7. TROUBLESHOOTING

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| PNG com dimensoes erradas | Viewport nao foi setado antes do screenshot | Verificar `page.set_viewport_size()` |
| Fonte nao carregou no PNG | Google Fonts bloqueado ou timeout curto | Usar fontes do sistema OU aumentar wait para 2000ms |
| Upload trava na Hotmart | Video muito grande ou conexao instavel | Aumentar timeout, tentar novamente |
| Seletor nao encontrado na Hotmart | Interface atualizada | Inspecionar com Playwright, atualizar SOP |
| Login falhou | Credencial desatualizada | Verificar vault, atualizar se necessario |
| `descricoes.md` nao encontrado | Course Creator ainda nao gerou | Subir sem descricao, registrar pendencia |

---

**KB Status:** Production Ready
**Versao:** 1.0.0
