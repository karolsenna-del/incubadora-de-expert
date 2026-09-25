# Setup — Planilha Automática do Diagnóstico do Método VIP

Réplica do "Crie seu Método em 1 Hora" (`business/campanhas/metodo-em-1-hora/`) pra cliente que
**já comprou** o Método VIP — primeiro passo do onboarding (ver seção 4 de
`business/processos/onboarding-pos-compra.md`).

Diferenças pro original (decisão da Karol, 24/09):
- **Sem** a pergunta final "quer ajuda individual? Sim/Não" (cliente já comprou)
- **Mantém** os 3 blocos de perguntas, inclusive "Hora de pensar nas suas ferramentas"
- Planilha **separada** (produto diferente)

**Página:** `vendas.incubadoradeexpert.com.br/metodo-vip/diagnostico/` — arquivo
`business/campanhas/crm-reativacao-leads/paginas-vendas/site/metodo-vip/diagnostico/index.html`
(projeto Vercel `vendas-incubadora`, mesmo padrão do diagnóstico do Sprint).

---

## Passo 1 — Criar a planilha

Conta **karolsenna@incubadoradeexpert.com.br** (REGRA-022 — conferir o avatar).
Nome: **Diagnóstico do Método VIP — Respostas**

## Passo 2 — Script (Extensões → Apps Script)

Projeto: **Recebe Diagnóstico Método VIP** — runtime **V8** (REGRA-023).

```javascript
var DEST_EMAIL = "karolsenna@incubadoradeexpert.com.br";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var payload = JSON.parse(e.postData.contents);

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

  var row = payload.row.slice();
  sheet.appendRow(row);

  MailApp.sendEmail({
    to: DEST_EMAIL,
    subject: "Diagnóstico VIP respondido: " + (row[1] || "sem nome"),
    body: "Nome: " + (row[1] || "") + "\nWhatsApp: " + (row[2] || "") +
          "\n\nPróximo passo: agendar o Encontro 1 do Método VIP." +
          "\n\nRespostas completas na planilha:\n" + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ok: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### Identidade visual da Incubadora na planilha (25/09)

O mesmo projeto tem uma 2ª função, `formatarIdentidadeVisual()`, rodada **1x manualmente**
(Executar, com ela selecionada no dropdown). Ela não mexe no `doPost` nem precisa de reimplantação.
Aplica as cores de `docs/knowledge/expert-mind/identidade/design-system.md`: cabeçalho preto `#0B0B0C` com texto branco
em negrito e linha laranja `#FF6B1A` embaixo, linhas alternando branco/`#F4F4F5` (faixas coloridas até a
linha 1000, então resposta nova já entra formatada), fonte Sora, bordas `#D4D4D8`, nome em
negrito, linha 1 + colunas Data/Nome congeladas, aba "Respostas" com cor laranja, sem linhas de grade.
Serve de molde pra formatar as planilhas dos outros diagnósticos: é só trocar `cols`.

## Passo 3 — Publicar como Web App

Implantar → Nova implantação → App da Web · Executar como: **Eu** · Acesso: **Qualquer pessoa**.
Copiar a URL `/exec` e colar em `SHEETS_ENDPOINT_URL` no `index.html` da página.

## Como funciona o aviso

Cada diagnóstico concluído → linha nova na planilha + e-mail "Diagnóstico VIP respondido: {nome}"
com o link da planilha. É o sinal pra Karol chamar a cliente e agendar o Encontro 1.
