# Setup — Planilha Automática do Diagnóstico do Expert

Mesmo processo que você já fez pro Sprint do Método — mas com uma planilha **separada**,
porque é um formulário diferente (leads do topo de funil, não clientes pagantes).

> **Atualização 2026-09-11:** o script original só gravava a linha na planilha — a nota
> antiga deste documento dizia que não dava pra mandar e-mail "pelas mesmas razões
> técnicas do Sprint", o que estava errado (não existe essa limitação — só faltava a
> linha de código). A versão abaixo já inclui `MailApp.sendEmail(...)`. **Se você já tem
> esse script publicado, é só abrir o projeto Apps Script existente (mesma planilha →
> Extensões → Apps Script), substituir o código pela versão nova abaixo, salvar e
> reimplantar** (Implantar → Gerenciar implantações → ✏️ na implantação ativa → Nova
> versão → Implantar). Não precisa criar planilha nova nem mudar a URL.

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Diagnóstico do Expert — Leads**

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão e cole isto:

```javascript
var DEST_EMAIL = "karolsenna@incubadoradeexpert.com.br";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();

  var headers = [
    "Data","E-mail","Nome","Celular","Sexo","Idade",
    "Instagram","Seguidores","Visualizações Médias","Comentários Médios",
    "Tempo como Especialista","Visão Geral do Negócio","História do Negócio",
    "Faturamento Mensal","Lista de E-mail/WhatsApp",
    "Perfil do Cliente Definido","Promessa Transformadora","Provas de Resultados",
    "Urgência (1-10)","Principal Dificuldade","Meta/Desejo como Infoprodutor",
    "O Que Já Tentou","Resultado Esperado da Sessão"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var payload = JSON.parse(e.postData.contents);
  sheet.appendRow(payload.row);

  MailApp.sendEmail({
    to: DEST_EMAIL,
    subject: "Novo Diagnóstico do Expert: " + (payload.row[2] || "sem nome"),
    body: "Nome: " + (payload.row[2] || "") + "\nE-mail: " + (payload.row[1] || "") +
          "\nCelular: " + (payload.row[3] || "") +
          "\n\nRespostas completas na planilha:\n" + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Salvar (ícone de disquete), dar nome tipo "Recebe Diagnóstico do Expert"

## Passo 3 — Publicar como Web App

1. **Implantar → Nova implantação**
2. Engrenagem → **App da Web**
3. **Executar como:** Eu · **Quem pode acessar:** Qualquer pessoa
4. **Implantar** → autorizar → copiar a **URL do app da Web**

## Passo 4 — Me manda a URL

Cola aqui na conversa que eu conecto no arquivo.

---

## Como funciona

- Página publicada em: `{seu domínio do projeto lp-diagnostico-expert}/diagnostico/`
- Os 4 botões da landing page (`QUERO MEU DIAGNÓSTICO GRATUITO`, `COMEÇAR MEU PRÉ-DIAGNÓSTICO` etc.) já foram
  atualizados pra apontar pra essa página nova em vez do Google Forms.
- Cada resposta completa grava uma linha sozinha na planilha, sem precisar de nada do lead.
- Diferente do Sprint do Método, essa aqui **não tem botão de WhatsApp** — faz sentido pro
  Sprint (cliente avisando você), mas aqui é lead de topo de funil: você/equipe que entra em
  contato depois, puxando da planilha.
- **Aviso por e-mail:** desde a atualização de 2026-09-11, você recebe um e-mail toda vez
  que um lead completa o diagnóstico (ver script acima). O que ainda não existe é a opção
  do Google Forms de "Enviar cópia das respostas" pro próprio respondente — se isso for
  importante, dá pra adicionar depois.
