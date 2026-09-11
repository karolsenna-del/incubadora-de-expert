# Setup — Planilha Automática do Kit de Ferramentas

Mesmo processo das outras duas — planilha **separada**, porque é um produto diferente
(diagnóstico pago de R$97, vira orçamento de ferramentas).

> **Atualização 2026-09-11:** o script original só escrevia na planilha e não avisava
> ninguém — por isso o teste do Kit não gerou e-mail nenhum. A versão abaixo já inclui
> `MailApp.sendEmail(...)`. **Se você já tem esse script publicado, é só abrir o projeto
> Apps Script existente (mesma planilha → Extensões → Apps Script), substituir todo o
> código pela versão nova abaixo, salvar e reimplantar** (Implantar → Gerenciar
> implantações → ✏️ na implantação ativa → Nova versão → Implantar). Não precisa criar
> planilha nova nem mudar a URL do `SHEETS_ENDPOINT_URL` no `index.html`.

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Kit de Ferramentas — Respostas**

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão e cole isto:

```javascript
var DEST_EMAIL = "karolsenna@incubadoradeexpert.com.br";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var headers = [
    "Data","Nome","WhatsApp",
    "Propósito no Digital","Persona Compradora","Por Que Essa Persona",
    "Nível de Consciência","Dor da Persona","Desejo da Persona",
    "Promessa de Resultado","Grau de Conhecimento","Ponto de Partida",
    "Pequenas Vitórias","Mecanismo Único","Ponto de Chegada","Passos/Módulos",
    "Objeções e Ferramentas","Travas e Ferramentas","Parcerias Possíveis",
    "Brainstorm R$500mil"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var payload = JSON.parse(e.postData.contents);
  sheet.appendRow(payload.row);

  MailApp.sendEmail({
    to: DEST_EMAIL,
    subject: "Novo Kit de Ferramentas respondido: " + (payload.row[1] || "sem nome"),
    body: "Nome: " + (payload.row[1] || "") + "\nWhatsApp: " + (payload.row[2] || "") +
          "\n\nRespostas completas na planilha:\n" + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Salvar (ícone de disquete), dar nome tipo "Recebe Kit de Ferramentas"

## Passo 3 — Publicar como Web App

1. **Implantar → Nova implantação**
2. Engrenagem → **App da Web**
3. **Executar como:** Eu · **Quem pode acessar:** Qualquer pessoa
4. **Implantar** → autorizar (na primeira vez o Google avisa "app não verificado" — clique
   em Avançado → Acessar Recebe Kit de Ferramentas, é normal, é o seu próprio script) →
   copiar a **URL do app da Web** (algo como `https://script.google.com/macros/s/AKfycb.../exec`)

## Passo 4 — Me manda a URL

Cola aqui na conversa que eu conecto no arquivo.
