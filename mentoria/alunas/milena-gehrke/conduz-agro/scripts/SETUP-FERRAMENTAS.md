# Setup — Ferramentas do Portfólio (Círculo de Controle + Matriz de Responsabilidade)

Gera 2 abas-modelo, já formatadas na identidade visual do Conduz Agro (paleta, cores por responsável, bordas), dentro de uma planilha Google. Diferente dos diagnósticos, essas ferramentas **não têm formulário web** — são preenchidas direto na planilha, e reusadas por **duplicação da aba** a cada caso novo.

## 1. Onde colar

Pode ser na mesma planilha "Conduz Agro — Diagnósticos" que você já tem (fica tudo num lugar só), ou numa planilha nova — funciona do mesmo jeito. Se for a mesma planilha dos diagnósticos, é só adicionar mais este script junto do que já está lá.

1. Na planilha: **Extensões → Apps Script**
2. Se já tem código de outro script na mesma planilha (ex: `apps-script-diagnosticos.gs`), **não apague** — clica em **+ (Arquivo) → Script** no menu lateral do editor, dá o nome "templates-ferramentas", e cola o conteúdo de `apps-script-templates-ferramentas.gs` (mesma pasta deste guia) nesse arquivo novo
3. Se for um projeto de script novo (planilha nova), pode colar direto no arquivo padrão
4. Salva (Ctrl+S)

## 2. Gerar as abas-modelo

1. No topo do editor, troca a função selecionada pra **`criarTodosTemplates`**
2. Clica em **Executar** (▶)
3. Na primeira vez, autoriza o script (mesmo processo de sempre: Revisar permissões → sua conta → Avançado → Acessar → Permitir)
4. Volta pra planilha — 2 abas novas aparecem: **"MODELO — Círculo de Controle"** e **"MODELO — Matriz de Responsabilidade"**, já formatadas (cores, bordas, cabeçalhos)

Se quiser gerar só uma das duas, troca a função selecionada pra `criarTemplateCirculoControle` ou `criarTemplateMatrizResponsabilidade` antes de Executar.

## 3. Como usar no dia a dia

**Nunca edite a aba "MODELO" diretamente** — ela é o molde. Pra cada caso novo:

1. Clica com o botão direito na aba MODELO correspondente → **Duplicar**
2. Renomeia a cópia com o nome do caso/cliente (ex: "Círculo — Fazenda Santa Rita" ou "Matriz — João, regularização")
3. Preenche a cópia à vontade — a formatação (cores, bordas) já vem pronta, só digitar
4. A aba duplicada fica salva na planilha pra sempre — histórico de todos os casos, sem perder nada

**Círculo de Controle:** situação de pressão no topo, os 3 anéis no meio (fora do controle / posso influenciar / eu controlo), próxima ação embaixo.

**Matriz de Responsabilidade:** dados do caso no topo, tabela de etapas com um dropdown na coluna "Responsável" (Você / Produtor / Terceiro) — a cor da célula muda sozinha conforme a escolha. Pra entregar ao produtor: **Arquivo → Baixar → PDF (.pdf)**, ou imprimir a aba direto.

## Quando atualizar o script

Se mudar algo no layout, atualiza `apps-script-templates-ferramentas.gs` aqui no repo, cola a versão nova no Apps Script, salva, e roda `criarTodosTemplates` de novo — isso recria as abas MODELO do zero (apaga e recria, não mexe nas cópias já duplicadas de casos anteriores).
