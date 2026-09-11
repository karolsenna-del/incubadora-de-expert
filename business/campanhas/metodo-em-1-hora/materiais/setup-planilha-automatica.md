# Setup — Planilha Automática do Crie seu Método em 1 Hora

Mesmo processo das outras — planilha **separada**, porque é um produto diferente
(bônus de aula, não o Kit de Ferramentas pago).

Esta versão já vem com **aviso por e-mail automático** — toda vez que alguém responde o
questionário, ou quando alguém marca "Sim, quero" na pergunta final, você recebe um e-mail.

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Crie seu Método em 1 Hora — Respostas**

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão e cole isto:

```javascript
var DEST_EMAIL = "karolsenna@incubadoradeexpert.com.br";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var payload = JSON.parse(e.postData.contents);

  // Resposta da pergunta final (Sim/Não) — atualiza a linha já enviada, casando por Nome+WhatsApp
  if (payload.interesse) {
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      if (data[i][1] === payload.interesse.nome && data[i][2] === payload.interesse.whats) {
        sheet.getRange(i + 1, data[0].length).setValue(payload.interesse.resposta);
        break;
      }
    }
    if (payload.interesse.resposta === "Sim") {
      MailApp.sendEmail({
        to: DEST_EMAIL,
        subject: "🙋 " + payload.interesse.nome + " quer ajuda individual no método",
        body: "Nome: " + payload.interesse.nome + "\nWhatsApp: " + payload.interesse.whats +
              "\n\nRespostas completas na planilha:\n" + ss.getUrl()
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ok: true}))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Questionário completo
  var headers = [
    "Data","Nome","WhatsApp",
    "Propósito no Digital","Persona Compradora","Por Que Essa Persona",
    "Nível de Consciência","Dor da Persona","Desejo da Persona",
    "Promessa de Resultado","Grau de Conhecimento","Ponto de Partida",
    "Pequenas Vitórias","Mecanismo Único","Ponto de Chegada","Passos/Módulos",
    "Objeções e Ferramentas","Travas e Ferramentas","Parcerias Possíveis",
    "Brainstorm R$500mil","Quer Ajuda Individual?"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var row = payload.row.slice();
  row.push(""); // "Quer Ajuda Individual?" começa vazio, é preenchido depois pelo bloco acima
  sheet.appendRow(row);

  MailApp.sendEmail({
    to: DEST_EMAIL,
    subject: "Novo método respondido: " + (row[1] || "sem nome"),
    body: "Nome: " + (row[1] || "") + "\nWhatsApp: " + (row[2] || "") +
          "\n\nRespostas completas na planilha:\n" + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Salvar (ícone de disquete), dar nome tipo "Recebe Método em 1 Hora"

## Passo 3 — Publicar como Web App

1. **Implantar → Nova implantação**
2. Engrenagem → **App da Web**
3. **Executar como:** Eu · **Quem pode acessar:** Qualquer pessoa
4. **Implantar** → autorizar (na primeira vez o Google avisa "app não verificado" — clique em
   Avançado → Acessar Recebe Método em 1 Hora, é normal, é o seu próprio script)
5. Copiar a **URL do app da Web** (algo como `https://script.google.com/macros/s/AKfycb.../exec`)

## Passo 4 — Me manda a URL

Cola aqui na conversa que eu conecto no arquivo (`SHEETS_ENDPOINT_URL` no `index.html`).

## Como funciona o aviso por e-mail

- Assim que alguém termina o questionário → você recebe um e-mail "Novo método respondido".
- Se a pessoa marcar **"Sim, quero"** na pergunta final → você recebe um SEGUNDO e-mail
  específico ("🙋 Fulano quer ajuda individual"), pra você saber quem priorizar no contato.
- Quem marcar "Não" não gera e-mail extra, mas a resposta fica registrada na coluna
  "Quer Ajuda Individual?" da planilha mesmo assim.
