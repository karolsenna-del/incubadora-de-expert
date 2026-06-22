# Course Publisher — Playbook

> SOPs e procedures. Consultar antes de executar qualquer missao.
> Cresce a cada missao nova executada.

---

## ARVORE DE DECISAO

```
Missao recebida
├── "Publica [produto] completo"
│   └── SOP-001 → SOP-002 (por modulo) → SOP-003 → SOP-004
├── "Gera as capas / assets de [produto]"
│   └── SOP-001
├── "Sobe as aulas do [modulo]"
│   └── SOP-002
├── "Configura as capas na Hotmart"
│   └── SOP-003 + SOP-004
└── "Gera o certificado"
    └── SOP-005
```

---

## TIER 1 — RECORRENTES

### SOP-001: Gerar Set Completo de Assets (HTML → PNG via Playwright)

**Quando usar:** sempre que precisar gerar capas de modulo, thumbnails, banners ou certificado.

**Inputs necessarios:**
- Produto (ex: `expert360`)
- Tipo de asset (capa de modulo, thumbnail, banner, certificado)
- Briefing visual do produto (`business/campanhas/{produto}/branding/briefing-visual-logo.md`)

**Passos:**

1. Verificar briefing visual do produto — paleta, tipografia, tom
2. Criar pasta `business/producao/{produto}/assets/` e subpastas se nao existirem
3. Para cada modulo/asset a gerar:
   a. Montar HTML com variaveis do modulo (numero, nome, subtitulo)
   b. Salvar HTML temporario em `/tmp/course-publisher/{slug}.html`
   c. Renderizar via Playwright com viewport nas dimensoes exatas
   d. Screenshot → salvar PNG em `assets/{tipo}/`
   e. Verificar dimensoes do PNG (Pillow ou Playwright metadata)
4. Listar arquivos gerados no relatorio final

**Regras obrigatorias:** REGRA-001, REGRA-008, REGRA-012

**Exemplo de execucao:**
```
Missao: "Gera as capas dos modulos do Expert360"
→ Briefing: branding/briefing-visual-logo.md (Expert360)
→ Modulos: M0 Desbloqueio, M1 Persona e Promessa, M2 Metodo Autoral,
           M3 Vendas Secretas, M4 Autoridade Digital, Orientacoes
→ Para cada: gerar HTML → Playwright → PNG 1920×1080
→ Salvar em: business/producao/expert360/assets/capas-modulos/
→ Output: 6 arquivos PNG gerados
```

---

### SOP-002: Upload de Modulo Completo na Hotmart

**Quando usar:** subir aulas de um ou mais modulos.

**Inputs necessarios:**
- Produto na Hotmart (nome exato)
- Modulo (ex: M0, M1)
- Videos na pasta `business/producao/{produto}/{modulo}/`
- `business/producao/{produto}/descricoes.md` (se existir)
- Thumbnails gerados em `assets/thumbnails/`

**Passos:**

1. Verificar que todos os videos do modulo existem na pasta (REGRA-007)
2. Ordenar videos por prefixo numerico (00, 01, 02...)
3. Ler `descricoes.md` e mapear aula → descricao (REGRA-006)
4. Abrir Playwright → login na Hotmart (credenciais do vault)
5. Navegar ate o produto correto (REGRA-003)
6. Navegar ate o modulo correto
7. Para cada video na ordem:
   a. Clicar em "Adicionar aula" / "+ Aula"
   b. Selecionar tipo: Video
   c. `page.set_input_files(selector_upload, caminho_video)`
   d. Aguardar upload completar (REGRA-009 — timeout 30min)
   e. Preencher titulo: `clean_title(filename)` (REGRA-002)
   f. Preencher descricao: texto do `descricoes.md` (ou vazio + registrar gap)
   g. Salvar aula
8. Reportar: X de Y aulas upadas, gaps de descricao encontrados

**Regras obrigatorias:** REGRA-002, REGRA-003, REGRA-005, REGRA-006, REGRA-007, REGRA-009

---

### SOP-003: Configurar Capa de Modulo na Hotmart

**Quando usar:** apos upload das aulas, configurar a imagem de capa do modulo.

**Inputs necessarios:**
- PNG da capa em `assets/capas-modulos/{modulo}.png` (1920×1080)
- Acesso ao produto na Hotmart

**Passos:**

1. Navegar ate o modulo na Hotmart
2. Clicar em editar modulo / icone de imagem
3. `page.set_input_files(selector_capa, caminho_png)`
4. Confirmar upload
5. Verificar que a capa aparece na galeria
6. Checar configuracao de exibicao: Personalizacao → Exibicao dos modulos → "Galeria"

**Nota:** O modo "Galeria" precisa estar ativo para as capas aparecerem. Verificar sempre.

---

### SOP-004: Configurar Thumbnail de Aula na Hotmart

**Quando usar:** configurar a imagem em miniatura de cada aula.

**Inputs necessarios:**
- PNG do thumbnail em `assets/thumbnails/{aula}.png` (1280×720)

**Passos:**

1. Navegar ate a aula na Hotmart
2. Clicar em editar aula → campo de miniatura/thumbnail
3. `page.set_input_files(selector_thumb, caminho_png)`
4. Confirmar
5. Repetir para cada aula do modulo

---

## TIER 2 — SOB DEMANDA

### SOP-005: Gerar Certificado

**Quando usar:** criar imagem de fundo do certificado para o produto.

**Inputs necessarios:**
- Briefing visual do produto
- Texto a incluir (nome do curso, assinatura, logo)

**Passos:**

1. Montar HTML de certificado (orientacao portrait — 2480×3508)
2. Elementos: logo do produto (topo), nome do curso (centro, grande), linha de assinatura (rodape), barra laranja decorativa
3. Renderizar via Playwright com viewport 2480×3508
4. Salvar em `assets/certificado/{produto}-certificado.png`
5. Verificar dimensoes
6. Instruir como subir na Hotmart: Produto → Certificado → Imagem de fundo → Upload

**Nota:** Hotmart sobrepoe nome do aluno, data e numero automaticamente. O PNG e so o fundo visual.

### SOP-006: Gerar Banner da Vitrine

**Quando usar:** criar banner para a pagina de vitrine do produto.

**Inputs necessarios:** briefing visual, texto do banner (headline, CTA se houver)

**Passos:**
1. Gerar versao desktop (1920×800) e mobile (720×960) — dois HTMLs separados
2. Mobile: composicao vertical, texto maior, sem elementos laterais
3. Desktop: composicao horizontal, hierarquia completa
4. Salvar em `assets/banners/`

---

## TIER 3 — ONE-SHOT

### SOP-007: Configurar Modo Galeria na Hotmart

**Quando usar:** primeira vez que configura capas de modulo num produto.

**Passos:**
1. Acessar o produto
2. Menu lateral → Personalizacao
3. Exibicao dos modulos → alterar de "Lista" para "Galeria"
4. Salvar

---

**Playbook Status:** Production Ready
**Versao:** 1.0.0
