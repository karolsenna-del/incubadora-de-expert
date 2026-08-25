# Setup — Planilhas dos Diagnósticos Conduz Agro

Conecta os 4 formulários interativos (`diagnostico-interativo.html`, `pre-diagnostico-vendas.html`, `ficha-inscricao.html` e `raio-x-conversa.html`) a uma planilha Google, sem precisar de domínio, servidor ou banco de dados.

> **Addendum 23/08/2026:** `ficha-inscricao.html` (Fase 9, ferramenta do Destrava Condução) foi adicionado ao mesmo script/planilha, numa 3ª aba ("Ficha de Inscrição").
> **Addendum 24/08/2026:** `raio-x-conversa.html` (Raio-X da Conversa com o Produtor, uso dentro do programa) foi adicionado numa 4ª aba ("Raio-X de Conversas"), com uma coluna "Status da Análise" que começa em "Pendente" — muda pra "Feito" na mão depois de analisar, funciona como fila de trabalho da Milena. O formulário aceita **print(s) da conversa** (até 5, 6MB cada) além de texto colado — copiar e colar de WhatsApp/Direct raramente sai formatado direito, então print virou a opção principal. Os prints são salvos automaticamente numa pasta do Drive ("Conduz Agro — Prints do Raio-X", criada sozinha no primeiro envio) e o link de cada um cai na planilha, na coluna "Prints (links)".
> Se a planilha e o Apps Script já estavam implantados antes desses addendums, siga a seção "Quando atualizar o script" abaixo pra colar a versão nova do `.gs` e reimplantar — a URL não muda.

## 1. Criar a planilha

1. Cria uma planilha nova no Google Sheets, nomeia **"Conduz Agro — Diagnósticos"**
2. Não precisa criar as abas manualmente — o script cria sozinho no primeiro envio (ou você roda `testSetup` uma vez, ver Passo 3)

## 2. Colar o script

1. Na planilha: **Extensões → Apps Script**
2. Apaga o conteúdo padrão (`function myFunction() {}`) e cola o conteúdo inteiro de `apps-script-diagnosticos.gs` (mesma pasta deste guia)
3. Salva (ícone de disquete ou Ctrl+S), dá um nome pro projeto (ex: "Diagnósticos Conduz Agro")

## 3. (Opcional) Criar as abas com cabeçalho antes de testar

1. No topo do editor, troca a função selecionada de `doPost` pra **`testSetup`**
2. Clica em **Executar** (▶)
3. Na primeira vez, o Google vai pedir autorização — clica em **Revisar permissões**, escolhe sua conta, clica em **Avançado** → **Acessar [nome do projeto] (não seguro)** → **Permitir**. É só o aviso padrão pra scripts que você mesmo escreveu, não é perigoso.
4. Volta pra planilha — as 4 abas ("Diagnóstico Completo", "Pré-Diagnóstico Vendas", "Ficha de Inscrição" e "Raio-X de Conversas") já aparecem com cabeçalho

## 4. Publicar como Web App

1. No Apps Script, canto superior direito: **Implantar → Nova implantação**
2. Clica na engrenagem ao lado de "Selecionar tipo" → **App da Web**
3. Configura:
   - **Executar como:** Eu (seu e-mail)
   - **Quem tem acesso:** Qualquer pessoa
4. Clica em **Implantar**
5. Autoriza de novo se pedir (mesmo processo do Passo 3)
6. Copia a **URL do app da Web** que aparece (termina em `/exec`)

## 5. Colar a URL nos arquivos HTML

Em cada um dos 4 arquivos (`diagnostico-interativo.html`, `pre-diagnostico-vendas.html`, `ficha-inscricao.html` e `raio-x-conversa.html`), procura a linha:

```js
var SHEETS_ENDPOINT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
```

E troca `"COLE_AQUI_A_URL_DO_APPS_SCRIPT"` pela URL copiada no Passo 4, entre aspas. Depois é só publicar a versão nova do Artifact de novo (mesmo link continua funcionando).

## 6. Testar

1. Abre o link do diagnóstico, responde até o fim, clica em enviar
2. Confere se a linha apareceu na aba certa da planilha
3. Se não aparecer nada e não der erro visível: normal — o `fetch` usa `mode:"no-cors"` (não precisa de configuração extra de CORS no Apps Script), mas isso também significa que o navegador não mostra se deu erro. Confere direto na planilha.

## Quando atualizar o script

Se um dia mudar alguma pergunta ou coluna nos diagnósticos, atualiza `apps-script-diagnosticos.gs` aqui no repo, cola a versão nova no Apps Script (Extensões → Apps Script, substitui o conteúdo), salva, e faz **Implantar → Gerenciar implantações → editar (ícone de lápis) → Nova versão → Implantar**. A URL continua a mesma, não precisa trocar nada nos HTMLs.
