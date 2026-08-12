---
task: "Execute Mission"
responsavel: "@live-deck-builder"
responsavel_type: "agent"
atomic_layer: "task"
Entrada: "Número da live (ou path do roteiro)"
Saida: "Deck publicado (Artifact) + cópia HTML local + log atualizado"
Checklist:
  - "Roteiro lido por inteiro (4 partes)"
  - "Fio condutor visual identificado (se houver)"
  - "Slides condensados por bloco"
  - "Skills artifact-design e dataviz carregadas"
  - "Paleta e logos aplicadas em 100% dos slides"
  - "Pelo menos 1 slide de resumo antes do CTA"
  - "Deck publicado como Artifact"
  - "Cópia HTML local salva"
  - "Resumo apresentado pra aprovação"
  - "Log atualizado"
execution_type: "sequential"
---

# Task: Execute Mission — Montar Deck da Live

## Objetivo

Executar o pipeline completo: ler roteiro → condensar → desenhar → aplicar marca → publicar → documentar.

## Trigger

`*mission`, `*monta {N}`, ou qualquer instrução de montagem de deck.

## Pré-condições

- `business/campanhas/lives-semanais/live-{N}-roteiro.md` existe

---

## Passos

### Step 1: Ler o Roteiro Inteiro

1. Abrir `business/campanhas/lives-semanais/live-{N}-roteiro.md`
2. Ler cabeçalho: Tema, Duração, Modelo
3. Ler as 4 partes por inteiro (Narrativa / Execução / Prática / Prova Racional+Pitch)
4. Ler Checklist Pré-Live e DoD se existirem — podem conter pendências relevantes (ex: fio condutor visual sugerido)

**Confirmar antes de prosseguir:**
```
Live {N} — "{tema}". {duração}min, modelo {modelo}.
{SE roteiro sinaliza fio condutor visual pendente}
Roteiro sugere usar "{metáfora}" como fio condutor — vou aplicar como slide de diagrama dedicado.
{FIM SE}
Vou gerar em torno de {duração/1.75} slides. Começo?
```

### Step 2: Consultar Fontes de Contexto

- `docs/knowledge/expert-business/dossie-personas.md` — identificar qual dor/objeção da Laura essa live específica ataca (normalmente clara no gancho de abertura)
- `data/live-deck-builder-kb.md` — catálogo de tipos de slide e regra de densidade

### Step 3: Condensar por Bloco

Para cada uma das 4 partes do roteiro:

1. Identificar os sub-blocos de conteúdo (gancho, história, frase-âncora, princípios, exercício, prova racional, pitch, CTA — variam por roteiro)
2. Pra cada sub-bloco, condensar em título curto + 2-4 frases (nunca copiar o texto do roteiro verbatim)
3. Escolher o tipo de slide certo (ver catálogo na KB — quote isolada, história real, cards triplos, bloco de estatística, gráfico, timeline, diagrama, resumo, CTA)
4. Se o bloco for grande demais pra 1 slide: quebrar em mais slides, nunca encolher fonte pra caber

**Reportar progresso por parte:**
"Parte {N} ({nome}) condensada em {X} slides."

Ao final: adicionar pelo menos 1 slide de resumo (recap com 2-3 pontos-chave) antes do slide de CTA, mesmo que o roteiro não tenha seção equivalente.

### Step 4: Desenhar o Deck

1. Carregar a skill `artifact-design` antes de escrever a primeira linha de CSS
2. Carregar a skill `dataviz` pra qualquer slide com gráfico, estatística ou timeline
3. Escrever o HTML autocontido (CSS inline, sem CDN), paginado por slide em formato 16:9, navegável por teclado/clique, fullscreen-friendly
4. Aplicar a paleta em todo slide: laranja `#f85627` (destaque/CTA/números), cinza `#ddddde` (fundo secundário), preto `#090a0b` (fundo escuro), branco `#fcfcfc` (fundo claro)
5. Aplicar a logo Expert360 no rodapé/cabeçalho de cada slide — versão branca (`Logo Expert360 - branco.png`) em fundo escuro, versão preta (`Logo Expert360 - preto.png`) em fundo claro

### Step 5: Publicar

1. Publicar como Artifact (link privado)
2. Salvar cópia standalone em `business/campanhas/lives-semanais/live-{N}-apresentacao.html`

### Step 6: Apresentar Resumo pra Aprovação

```
=== DECK PRONTO — LIVE {N} ===

{X} slides · paleta e logo aplicados em 100%
{SE houve fio condutor visual} Fio condutor: "{metáfora}" (slide {N})

Link: {url do artifact}
Backup local: business/campanhas/lives-semanais/live-{N}-apresentacao.html

Aprova, ou ajusta algo?
```

### Step 7: Atualizar Log

Adicionar linha em `data/live-deck-builder-missions.md`, sempre incluindo o link do Artifact (é a forma mais rápida da Karol reencontrar o deck depois):

```
| {DD/MM/YYYY} | Live {N} — {tema} | {X} slides | {fio condutor ou —} | {link do Artifact} | {aprovado/ajuste pedido} |
```

### Step 8: PDSA

1. **Plan:** Live {N}, {duração}min, ~{Y} slides esperados
2. **Do:** {X} slides gerados, tipos usados, fio condutor aplicado ou não
3. **Study:** Aprovado de primeira? Ficou parecido demais com o deck anterior?
4. **Act:** SE repetição de layout → atualizar Playbook com nota de variação. SE padrão novo bem-sucedido → documentar (`document-process`).

---

## Error Handling

| Cenário | Ação |
|---------|------|
| Roteiro não encontrado | PARAR — "Não achei `live-{N}-roteiro.md` em `business/campanhas/lives-semanais/`. Confirma o número ou me passa o path." |
| Roteiro incompleto (falta alguma das 4 partes) | Sinalizar o que falta, perguntar se segue mesmo assim ou aguarda o roteiro completo |
| Bloco do roteiro ambíguo sobre tipo de slide | Escolher o mais próximo do catálogo e sinalizar a escolha no resumo, não travar o pipeline |
| Overflow de texto num slide | Sinal de condensação insuficiente — voltar ao Step 3 pro bloco específico, nunca encolher fonte |
