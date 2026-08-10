# Setup — Planilha Automática do Diagnóstico (Sprint do Método)

Passo a passo pra ligar o diagnóstico interativo numa planilha Google que se preenche
sozinha, sem depender do cliente clicar em nada. Uma vez feito, fica pronto pra sempre —
não precisa repetir a cada cliente novo.

---

## Passo 1 — Criar a planilha

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma planilha em branco
2. Nomeie: **Diagnósticos — Sprint do Método**
3. Não precisa criar cabeçalho — o script faz isso sozinho na primeira resposta

## Passo 2 — Colar o script

1. Na planilha, vá em **Extensões → Apps Script**
2. Apague o conteúdo padrão (`function myFunction() {}`) e cole isto:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  var headers = [
    "Data","Nome","Profissão","Anos de Atuação","WhatsApp",
    "Atuação (Presencial/Online)","Instagram","Já Tentou Digital?",
    "Oferta Atual","Como Atende Hoje","Dor Principal","O Que Já Tentou",
    "Uma Coisa a Resolver",
    "HR - Padrões","HR - Forças das Dores","HR - Territórios de Autoridade",
    "HR - Chamado","HR - Alta Performance","HR - Trabalho (Recompensa/Meio)",
    "HR - Fechamento",
    "IK - Talentos","IK - Paixões","IK - Demanda do Mundo","IK - Interseção",
    "IK - Frase (Por Que Existo)","IK - Algo Certo Hoje","IK - Faz Bem Sem Esforço",
    "IK - O Que Brilha","IK - Quem Admira",
    "Melhor Dia/Horário"
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

3. Clique em **Salvar** (ícone de disquete)
4. Dê um nome ao projeto, tipo "Recebe Diagnóstico Sprint"

## Passo 3 — Publicar como Web App

1. No Apps Script, clique em **Implantar → Nova implantação**
2. Clique na engrenagem ao lado de "Selecionar tipo" → escolha **App da Web**
3. Configure:
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** Qualquer pessoa
4. Clique em **Implantar**
5. Autorize o acesso quando o Google pedir (é a sua própria planilha, pode confirmar)
6. Copie a **URL do app da Web** que aparece — algo como:
   `https://script.google.com/macros/s/AKfycb.../exec`

## Passo 4 — Colar a URL no diagnóstico

Me manda essa URL (pode colar aqui na conversa) que eu atualizo o arquivo do diagnóstico
com ela. É só isso — depois de conectada, toda resposta completa cai como uma linha nova
na planilha, sozinha, no instante em que o cliente termina.

---

## Como funciona

- Cada vez que alguém completa o diagnóstico (todas as perguntas obrigatórias
  respondidas), o navegador dele manda os dados pra essa URL — sem precisar da Karol nem
  do cliente fazerem mais nada.
- A primeira linha da planilha (cabeçalho) é criada sozinha na primeira resposta que
  chegar.
- O botão de WhatsApp na tela final continua existindo, mas agora é só um "alô" — mesmo
  que o cliente não clique nele, a resposta já está na planilha.
- **Importante:** isso só funciona na versão publicada no seu site (Vercel). A prévia
  que abre dentro do Claude (o link que te mandei antes) tem uma proteção de segurança
  que bloqueia esse tipo de envio — serve só pra você ver o visual, não pra uso real com
  clientes.

## Se precisar reconectar

Se um dia a URL parar de funcionar (por exemplo, se você editar o script de novo), repita
o Passo 3 criando uma **nova implantação** — cada edição no código exige uma implantação
nova pra valer.
