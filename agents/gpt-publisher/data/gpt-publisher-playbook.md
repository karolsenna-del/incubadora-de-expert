# Publicador de GPT — Playbook

> SOPs e procedures. Cresce a cada missao documentada.
> Consultar ANTES de iniciar qualquer missao. Se ja tem SOP, seguir.
> **Regras operacionais:** ver `gpt-publisher-rules.md` (arquivo separado, carregado no start).

---

## Tier 1 — Recorrentes

### [SOP-001] Criar Custom GPT novo via GPT Builder (Playwright)
**Criado em:** 2026-08-07
**Ultima execucao:** 2026-08-07 (ExpertViral — sucesso)
**Trigger:** Criação nova confirmada (sem registro em `custom-gpt/gpt-id.md`)
**Tempo estimado:** ~5 min de automação, após pacote já aprovado
**Ferramentas:** Playwright (browser_navigate, browser_snapshot, browser_click, browser_type, browser_file_upload)
**Regras obrigatórias:** (nenhuma ainda — preencher quando surgirem)

**Pre-requisitos:**
- Pacote aprovado (Instructions.txt, knowledge-base.md, conversation-starters.md)
- Sessão ChatGPT logada no navegador do Playwright (confirmar navegando pra `chatgpt.com/gpts/mine` e checando se aparece "Meus GPTs" + nome da conta, não "Cadastre-se gratuitamente")

**Passos:**
1. Navegar pra `https://chatgpt.com/gpts/editor` (abre em modo "Criar" conversacional por padrão)
   - Verificar: heading "Novo GPT" / "Rascunho" aparece
2. Clicar no radio "Configurar" (mais previsível pra automação que o builder conversacional)
   - Verificar: formulário com campos Nome/Descrição/Instruções/Quebra-gelos/Conhecimento aparece
3. Preencher campo "Nome" (textbox com placeholder "Nomeie seu GPT") com o nome da mente
4. Preencher campo "Descrição" (textbox com placeholder "Adicione uma breve descrição...")
   - Nota: preencher a Descrição faz a URL mudar pra incluir um ID do gizmo (`/gpts/editor/g-{id}`) — sinal de que o rascunho foi criado no backend
5. Clicar no campo "Instruções" e digitar o conteúdo completo do `Instructions.txt`
   - Verificar: texto aparece completo no campo, sem erro de limite (o campo aceita até 8.000 chars — não há alerta visual de erro nesta versão do editor, só checar visualmente que o texto não foi cortado)
6. Preencher "Quebra-gelos" (conversation starters) um de cada vez: clicar no textbox vazio mais recente → digitar → apertar Enter (submit) → um novo textbox vazio aparece automaticamente pro próximo starter. Repetir pra cada starter (a UI não tem limite visível, mas manter em 4 por padrão)
7. Upload de Knowledge: clicar no botão externo "Carregar arquivos" (o `<input type=file>` interno costuma estar coberto por outro elemento e trava com timeout se clicado diretamente — clicar no botão-container em vez do input) → isso abre um file chooser → usar `browser_file_upload` com o path absoluto do arquivo
   - Verificar: nome do arquivo aparece como grupo com botão "Remover ficheiro"
8. Clicar no botão "Criar" (canto superior direito, fica desabilitado até nome+instruções estarem preenchidos)
   - Abre dialog "Compartilhar GPT" com 3 opções: "Apenas para mim" / "Qualquer pessoa com o link" / "Loja GPT" (desabilitada)
   - **"Qualquer pessoa com o link" já vem selecionada por padrão** nesta versão do editor — mas checar antes de assumir, versões futuras podem mudar o default
9. Clicar em "Salvar" no dialog de compartilhamento
   - Verificar: dialog fecha, aparece dialog "Configurações salvas" com o link final e botão "Ver GPT"; o header da página muda pra mostrar "Ao vivo · Qualquer pessoa com um link"
10. Capturar o link exibido no dialog "Configurações salvas" (formato `https://chatgpt.com/g/g-{id}-{slug}`)
11. Fechar o dialog

**Output esperado:** GPT publicado e ao vivo, link capturado, registro criado em `custom-gpt/gpt-id.md`

**Troubleshooting:**
- Clicar direto no `<input type="file">` trava com timeout ("intercepts pointer events") → clicar no botão-container visível em vez do input escondido
- Se `chatgpt.com/gpts/mine` mostrar "Cadastre-se gratuitamente" sem menu de conta → sessão não está logada, parar e avisar (não é erro de automação, é pré-condição não satisfeita)

## Tier 2 — Sob demanda
(SOPs que rodam quando pedido — ex: fluxo de atualização de GPT existente. Ainda não executado — próxima vez que a Karol pedir atualização de um GPT já publicado, esse fluxo vira SOP-002)

## Tier 3 — One-shot
(SOPs executados uma vez, mantidos pra referencia)

---

## Template de SOP

### [SOP-XXX] {Nome do Processo}
**Criado em:** {data}
**Ultima execucao:** {data}
**Trigger:** {o que dispara}
**Tempo estimado:** {quanto tempo}
**Ferramentas:** {quais}
**Regras obrigatorias:** (nenhuma ainda — preencher quando surgirem)

**Pre-requisitos:**
- {o que precisa}

**Passos:**
1. {passo 1}
   - Verificar: {como saber que deu certo}

**Output esperado:** {o que deve sair}

**Troubleshooting:**
- {problema}: {solucao}
