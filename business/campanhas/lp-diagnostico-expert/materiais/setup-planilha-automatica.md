# Setup — Planilha Automática do Diagnóstico do Expert

Mesmo processo que você já fez pro Sprint do Método — mas com uma planilha **separada**,
porque é um formulário diferente (leads do topo de funil, não clientes pagantes).

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Diagnóstico do Expert — Leads**

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão e cole isto:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

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
- **O que ficou de fora do Google Forms original:** a opção "Enviar cópia das respostas" (o
  Forms manda um e-mail automático pro respondente). Essa página não tem como mandar e-mail
  sozinha pelas mesmas razões técnicas do Sprint — se isso for importante, me avisa que a
  gente pensa numa solução.
