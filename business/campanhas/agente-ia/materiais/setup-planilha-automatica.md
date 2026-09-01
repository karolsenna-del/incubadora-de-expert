# Setup — Planilha Automática do Briefing de Agente de IA

Mesmo processo dos outros diagnósticos — planilha **separada**, porque é um produto diferente
(pedido pós-venda de quem vai receber um agente de IA feito sob medida).

Essa versão já formata a planilha sozinha (cabeçalho em negrito + linha congelada) e também
recebe os arquivos anexados no formulário, salvando cada envio numa subpasta dentro de uma
pasta do Google Drive que você escolhe.

---

## Passo 1 — Criar a pasta no Drive

1. Acesse [drive.google.com](https://drive.google.com) e crie uma pasta, ex: **Briefings — Agente de IA**
2. Abra a pasta e copia o ID dela na URL — é o trecho depois de `/folders/`:
   `https://drive.google.com/drive/folders/`**`1AbCdEfGhIjKlMnOpQrSt`**

## Passo 2 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Briefing Agente de IA — Respostas**

## Passo 3 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague **tudo** que estiver no editor (Ctrl+A, Delete) e cole isto — já vem com o ID da sua pasta certo, não precisa trocar nada:

```javascript
var FOLDER_ID = "1nRHlUhAJmVbSYZp57pKu2u2f0FmkFWkO";

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var payload = JSON.parse(e.postData.contents);

  var headers = [
    "Data","Nome","WhatsApp","Nicho",
    "Nome do Agente","Propósito","Quem Usa","Produto/Programa",
    "Documentos","Perguntas Frequentes","Fora do Escopo","Terminologia",
    "Abertura","Fluxo","Etapas","Confirmações","Entrega Final",
    "Estilo de Tom","Frases Próprias","Nunca Fazer",
    "Fora do Assunto","Quem Pode Usar","Sigilo",
    "Conversa Real","Teste no ChatGPT","Pasta de Arquivos"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  var folderUrl = "";
  if (payload.files && payload.files.length) {
    var parent = DriveApp.getFolderById(FOLDER_ID);
    var nome = (payload.row[1] || "sem-nome").toString();
    var subfolder = parent.createFolder(payload.row[0] + " — " + nome);
    payload.files.forEach(function (f) {
      var bytes = Utilities.base64Decode(f.base64);
      var blob = Utilities.newBlob(bytes, f.mimeType, f.name);
      subfolder.createFile(blob);
    });
    folderUrl = subfolder.getUrl();
  }

  var row = payload.row.slice();
  row.push(folderUrl);
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ok: true, folderUrl: folderUrl}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Salvar (ícone de disquete), dar nome tipo "Recebe Briefing Agente de IA"

## Passo 4 — Publicar como Web App

1. **Implantar → Nova implantação**
2. Engrenagem → **App da Web**
3. **Executar como:** Eu · **Quem pode acessar:** Qualquer pessoa
4. **Implantar** → autorizar (vai pedir permissão de acesso ao Drive, é normal — é o script
   salvando os arquivos) → copiar a **URL do app da Web**
   (algo como `https://script.google.com/macros/s/AKfycb.../exec`)

## Passo 5 — Me manda a URL

Cola aqui na conversa que eu conecto no arquivo (substitui `COLE_AQUI_A_URL_DO_APPS_SCRIPT`
em `diagnostico-interativo.html`).

## Passo 6 — Hospedar

Igual os outros: sobe o `diagnostico-interativo.html` num host estático (Vercel, GitHub Pages
ou domínio próprio) pra virar um link que você manda pra quem comprou.

---

## Sobre arquivos grandes

O formulário recusa arquivo acima de 15MB (avisa na hora, sem travar). Se alguém precisar
mandar algo maior, melhor pedir separado por WhatsApp ou Drive nesse caso específico.
