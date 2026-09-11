# Setup — Planilha Automática do DNA do Expert

Esse formulário (`dna.incubadoradeexpert.com.br`, check-in pré-1ª sessão da Incubadora de
Expert) foi montado por outro squad e não tinha nenhum guia de setup salvo no repositório —
por isso não dava pra confirmar se o script já publicado manda e-mail ou não.

> **⚠️ Antes de colar este script por cima do que já existe:** os cabeçalhos abaixo foram
> reconstruídos a partir das perguntas do formulário atual (`index.html`), na ordem exata
> que o formulário envia (`QUESTIONS.forEach`). Se a planilha que você já usa tiver
> cabeçalhos numa ordem diferente, as respostas novas podem cair na coluna errada — dá uma
> olhada rápida na 1ª linha da planilha antes de reimplantar, só pra confirmar que bate com
> a lista abaixo. Se não bater, me avisa antes de reimplantar que eu ajusto.

---

## Passo 1 — Criar a planilha (se ainda não tiver uma)

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **DNA do Expert — Respostas**

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão e cole isto:

```javascript
var DEST_EMAIL = "karolsenna@incubadoradeexpert.com.br";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var headers = [
    "Data/Hora","Nome Completo","CPF","Endereço","E-mail","Idade","Instagram",
    "Estado/País","WhatsApp","Área de Atuação/Nicho","Ativos Hoje","Negócio Atual",
    "Persona Compradora","Momento Atual","Produto/Serviço","O Que Incomoda",
    "Faturamento Mensal","Referências","Maior Dificuldade","Planos até 12/2026",
    "Barreiras","Rotina","Equipe","Transformação que Causa",
    "Pontos Fortes e Fracos","Propósitos",
    "Por Que Escolheu a Karol","O Que Gostou na Proposta","Comprometimento (0-10)",
    "Cena do Futuro","Modalidade (Grupo/Individual)"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var payload = JSON.parse(e.postData.contents);
  sheet.appendRow(payload.row);

  var nome = payload.row[1] || "sem nome";
  var whatsapp = payload.row[8] || "";
  var modalidade = payload.row[30] || "";
  MailApp.sendEmail({
    to: DEST_EMAIL,
    subject: "Novo DNA do Expert preenchido: " + nome,
    body: "Nome: " + nome + "\nWhatsApp: " + whatsapp + "\nModalidade: " + modalidade +
          "\n\nRespostas completas na planilha:\n" + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Salvar (ícone de disquete), dar nome tipo "Recebe DNA do Expert"

## Passo 3 — Publicar como Web App

1. **Implantar → Nova implantação** (ou, se já existir uma implantação ativa: **Gerenciar
   implantações → ✏️ → Nova versão → Implantar**, pra manter a mesma URL)
2. Engrenagem → **App da Web**
3. **Executar como:** Eu · **Quem pode acessar:** Qualquer pessoa
4. **Implantar** → autorizar → copiar a **URL do app da Web**
   (algo como `https://script.google.com/macros/s/AKfycb.../exec`)

## Passo 4 — Me manda a URL

Se a URL mudou (implantação nova em vez de nova versão), me avisa que eu atualizo o
`SHEETS_ENDPOINT_URL` em `dna-do-expert/index.html`. Se você usou "Nova versão" numa
implantação existente, a URL não muda — não precisa fazer nada aqui.

---

## Como funciona

- Toda vez que alguém completa o DNA do Expert, você recebe um e-mail com nome, WhatsApp
  e modalidade (Grupo/Individual), além da resposta cair como linha nova na planilha.
- Dado sensível (CPF, endereço) fica só na planilha — não vai no corpo do e-mail.
