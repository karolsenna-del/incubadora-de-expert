/**
 * Conduz Agro — gera as abas-modelo (formatadas na identidade visual da Milena)
 * do Círculo de Controle da Condução (uso interno) e da Matriz de
 * Responsabilidade e Prazos (versão entregue ao produtor).
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 * Depois de gerar a aba-modelo 1 vez, é só clicar com o botão direito na aba
 * e "Duplicar" a cada caso novo — o Sheets mantém toda a formatação.
 */

// Paleta — branding.md Seção 6
var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_GOLD = "#B07A16";
var COR_GOLD_SOFT = "#C08A1E";
var COR_PAPER = "#F5F0E6";
var COR_PAPER_RAISED = "#EDE6D6";
var COR_PAPER_DEEP = "#E4DBC4";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";
var COR_OLIVE_TINT = "#E9EEDD";

function criarTodosTemplates() {
  criarTemplateCirculoControle();
  criarTemplateMatrizResponsabilidade();
}

function criarTemplateCirculoControle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO — Círculo de Controle";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidths(1, 3, 240);
  sh.setHiddenGridlines(true);

  // Título
  sh.getRange("A1:C1").merge().setValue("CÍRCULO DE CONTROLE DA CONDUÇÃO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:C2").merge().setValue("Conduz Agro — ferramenta de uso interno (Sessão 3). Duplique esta aba a cada situação de pressão nova.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 26);

  // Situação de pressão
  sh.getRange("A4:C4").merge().setValue("SITUAÇÃO DE PRESSÃO (descreva o caso ou momento que está gerando pressão agora)")
    .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontWeight("bold").setFontSize(10);
  sh.getRange("A5:C6").merge().setBackground(COR_PAPER)
    .setBorder(true, true, true, true, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top").setWrap(true);
  sh.setRowHeights(5, 2, 26);

  // Cabeçalhos dos 3 anéis
  var headers = [["Fora do meu controle", "Posso influenciar", "Eu controlo"]];
  var headerRange = sh.getRange("A8:C8");
  headerRange.setValues(headers).setFontWeight("bold").setFontSize(11).setHorizontalAlignment("center");
  sh.getRange("A8").setBackground(COR_PAPER_DEEP).setFontColor(COR_INK_SOFT);
  sh.getRange("B8").setBackground(COR_PAPER_RAISED).setFontColor(COR_INK);
  sh.getRange("C8").setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD);
  sh.setRowHeight(8, 28);

  var subHeaders = [[
    "Não depende de você — terceiros, prazos, decisões alheias",
    "Não controla, mas pode afetar — sua comunicação, o tom, o momento",
    "100% seu — sua postura, preparação, o limite que você estabelece"
  ]];
  sh.getRange("A9:C9").setValues(subHeaders).setFontStyle("italic").setFontSize(8)
    .setFontColor(COR_INK_SOFT).setWrap(true).setVerticalAlignment("top");
  sh.setRowHeight(9, 40);

  // Linhas pra itens
  var itemsRange = sh.getRange("A10:C19");
  itemsRange.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);
  sh.setRowHeights(10, 10, 24);

  // Próxima ação
  sh.getRange("A21:C21").merge().setValue("PRÓXIMA AÇÃO (dentro do que você controla — o que vai fazer agora?)")
    .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontWeight("bold").setFontSize(10);
  sh.getRange("A22:C23").merge().setBackground(COR_PAPER)
    .setBorder(true, true, true, true, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top").setWrap(true);
  sh.setRowHeights(22, 2, 26);

  sh.setFrozenRows(0);
}

function criarTemplateMatrizResponsabilidade() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO — Matriz de Responsabilidade";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 260);
  sh.setColumnWidth(2, 140);
  sh.setColumnWidth(3, 110);
  sh.setColumnWidth(4, 220);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:D1").merge().setValue("MATRIZ DE RESPONSABILIDADE E PRAZOS")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:D2").merge().setValue("Documento do PROFISSIONAL pro PRODUTOR — sem marca Conduz Agro, é seu, personalize com seu nome/empresa. Duplique esta aba a cada caso novo.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 26);

  var campos = [
    ["Seu nome / empresa:", ""],
    ["Nome do produtor:", ""],
    ["Serviço contratado:", ""],
    ["Data:", ""]
  ];
  sh.getRange("A4:B7").setValues(campos);
  sh.getRange("A4:A7").setFontWeight("bold").setFontColor(COR_INK).setFontSize(10);
  sh.getRange("B4:D7").setBackground(COR_PAPER).setFontColor(COR_INK)
    .setBorder(false, false, true, false, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);

  // Cabeçalho da tabela
  var headers = [["Etapa / Tarefa", "Responsável", "Prazo", "Observação"]];
  sh.getRange("A9:D9").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10);
  sh.setRowHeight(9, 26);

  // Legenda
  sh.getRange("A10:D10").merge().setValue("Responsável: Você = dourado · Produtor = verde-oliva · Terceiro (cartório, banco) = neutro — a cor muda sozinha ao escolher na lista")
    .setFontStyle("italic").setFontSize(8).setFontColor(COR_INK_SOFT).setWrap(true);
  sh.setRowHeight(10, 20);

  // Linhas de exemplo (seed)
  var seed = [
    ["Envio de documentos do imóvel", "Produtor", "", ""],
    ["Análise técnica e diagnóstico", "Você", "", ""],
    ["Protocolo no cartório", "Terceiro", "", "Cartório"],
    ["Aprovação de crédito", "Terceiro", "", "Banco"]
  ];
  sh.getRange("A11:D14").setValues(seed);

  // Linhas em branco pra mais etapas
  var totalLinhas = 20; // até a linha 30
  var range = sh.getRange(11, 1, totalLinhas, 4);
  range.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle");
  sh.setRowHeights(11, totalLinhas, 24);

  // Dropdown de Responsável
  var respRange = sh.getRange(11, 2, totalLinhas, 1);
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Você", "Produtor", "Terceiro"], true)
    .setAllowInvalid(false)
    .build();
  respRange.setDataValidation(rule);

  // Formatação condicional por Responsável
  var rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Você")
    .setBackground(COR_GOLD_TINT)
    .setRanges([respRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Produtor")
    .setBackground(COR_OLIVE_TINT)
    .setRanges([respRange])
    .build());
  rules.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Terceiro")
    .setBackground(COR_PAPER_DEEP)
    .setRanges([respRange])
    .build());
  sh.setConditionalFormatRules(rules);

  // Assinaturas
  var assinRow = 11 + totalLinhas + 1;
  sh.getRange(assinRow, 1, 1, 2).merge().setValue("Assinatura do profissional")
    .setBorder(true, false, false, false, false, false, COR_INK, SpreadsheetApp.BorderStyle.SOLID)
    .setFontSize(9).setFontColor(COR_INK_SOFT);
  sh.getRange(assinRow, 3, 1, 2).merge().setValue("Assinatura / ciência do produtor")
    .setBorder(true, false, false, false, false, false, COR_INK, SpreadsheetApp.BorderStyle.SOLID)
    .setFontSize(9).setFontColor(COR_INK_SOFT);
  sh.setRowHeight(assinRow, 28);

  sh.setFrozenRows(0);
}
