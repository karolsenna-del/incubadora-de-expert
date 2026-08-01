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
├── "Gera o certificado"
│   └── SOP-005
└── (agendada, sem pedido explicito) "Sincroniza gravacoes da semana"
    └── SOP-009
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

### SOP-009: Sincronizar Gravações Semanais do Meet → Hotmart (recorrente, autônoma)

**Quando usar:** disparada por agendamento (Task Scheduler configurado pelo Ops), não por pedido
direto da Karol. Roda toda semana sozinha.

**Inputs necessários:**
- Pasta Drive "Meet Recordings" (`1eZySH6OIAsGasoHAZB9XxII0Gx686qQi`)
- `data/weekly-sync-state.yaml` (o que já foi processado)
- `business/campanhas/lives-semanais/live-{N}-*.md` (roteiros das Lives, pra título)
- Anotações do Gemini de cada Encontro Incubadora (Drive, pra tema)
- Sessão Hotmart ativa (`combo_incubadora_url` no vault)

**Passos:** ver `tasks/weekly-sync.md` — protocolo completo.

**Regras obrigatórias:** REGRA-002, REGRA-003, REGRA-009, REGRA-013, REGRA-014, REGRA-015.

**Diferença essencial vs SOP-002:** essa missão nunca pergunta nada pra Karol no meio da execução
— o que não dá pra decidir com segurança vira pendência registrada, não uma pergunta pendurada.

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

### SOP-008: Publicar Aulas na Voomp Play (YouTube + Voomp Tube via API)

**Quando usar:** vincular vídeos de aula do Expert360 (ou outro curso) na Voomp Play.
**Contexto:** o plano da Voomp NÃO hospeda vídeo de curso (upload direto: máx 80MB/arquivo, 3GB total). Vídeos ficam no YouTube como "Não listado" e entram na aula via Voomp Tube (player customizado por cima do YouTube).

**Fase 1 — YouTube (canal profissional Karol Senna, UCZRmVUdvdj_87fzQz7hSi3Q):**
1. Studio → Configurações → Padrões de envio → Visibilidade: Não listado (fazer 1x por canal)
2. Criar → Enviar vídeos → selecionar os .mp4 em lote (upload paralelo, ~1min/GB)
3. Vídeos ficam como RASCUNHO — publicar cada um: Editar rascunho → etapa Visibilidade → Não listado → Salvar → fechar modal "Vídeo publicado"
   - Automação Playwright: cliques REAIS (browser_click) em `ytcp-uploads-dialog #step-badge-3`, `tp-yt-paper-radio-button[name="UNLISTED"]`, `#done-button`. Cliques sintéticos (JS .click()) marcam o radio mas NÃO salvam.
4. Coletar IDs: lista de conteúdo → href de cada row (`/video/{id}`) → registrar `youtube_id` no config.yaml

**Fase 2 — Voomp (API api.voompplay.com.br, token = header `authorization` de qualquer chamada do app logado):**
1. Thumb: `POST /media` multipart (`file` + `title`) → retorna `id` (custom_thumb) 
2. Aula nova: `POST /course/{curso}/module/{mod}/lesson`
   Aula existente: `POST /course/{curso}/module/{mod}/lesson/{id}` (PUT retorna 500 — rota só aceita POST)
3. Payload: `{course_id, title, mediaType: "voomptube", source, content: "<p>descrição</p>", order, thumb: "https://img.youtube.com/vi/{yt}/sddefault.jpg", custom_thumb: media_id, status: "draft", small_category: null}`
4. `source` = hex de XOR 0x33 sobre `{"url":"https://youtu.be/{yt}","theme":"default","carryOn":false}` (JSON sem espaços)

**Script pronto:** `scripts/voomp-link-youtube.py` (dry-run com `--dry-run`; editar TASKS). Verificação: `GET /course/{c}/module/{m}/lesson` → conferir mediaType=voomptube + custom_thumb.

**Publicação final (lançamento):** aulas ficam em `status: draft` — publicar em massa depois via mesmo POST com `status: "published"`.

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
