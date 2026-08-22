# Setup — Planilhas dos Diagnósticos Conduz Agro

Conecta os 2 diagnósticos interativos (`diagnostico-interativo.html` e `pre-diagnostico-vendas.html`) a uma planilha Google, sem precisar de domínio, servidor ou banco de dados.

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
4. Volta pra planilha — as 2 abas ("Diagnóstico Completo" e "Pré-Diagnóstico Vendas") já aparecem com cabeçalho

## 4. Publicar como Web App

1. No Apps Script, canto superior direito: **Implantar → Nova implantação**
2. Clica na engrenagem ao lado de "Selecionar tipo" → **App da Web**
3. Configura:
   - **Executar como:** Eu (seu e-mail)
   - **Quem tem acesso:** Qualquer pessoa
4. Clica em **Implantar**
5. Autoriza de novo se pedir (mesmo processo do Passo 3)
6. Copia a **URL do app da Web** que aparece (termina em `/exec`)

## 5. Colar a URL nos 2 arquivos HTML

Em cada um dos 2 arquivos (`diagnostico-interativo.html` e `pre-diagnostico-vendas.html`), procura a linha:

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
