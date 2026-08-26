/**
 * Conduz Agro — gera as 2 abas (formatadas na identidade visual da Milena)
 * do CRM Comercial: Prospecção (pipeline até o fechamento + financeiro) e
 * Reativação Anual (renovação de CAR/CCIR/ITR). Adaptado do Rastreador de
 * Leads do Expert360º da própria Milena (M3.5).
 *
 * Entregável ao aluno também (corrigido 23/08 — não é ferramenta interna),
 * cada mentorado roda o próprio pipeline no negócio dele. É biblioteca
 * cumulativa — não duplica, as 2 abas crescem com o tempo.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_PAPER_DEEP = "#E4DBC4";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";
var COR_OLIVE_TINT = "#E9EEDD";
var COR_RUST_TINT = "#F0DAD0";

function criarCRMComercial() {
  criarAbaProspeccao();
  criarAbaReativacao();
}

function criarAbaProspeccao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Prospecção";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  var headers = ["Nome do Produtor","Propriedade","Contato","Origem","Status","Data Última Interação",
    "Próxima Ação","Data Próxima Ação","Fechou?","Valor do Serviço","Forma de Pagamento",
    "Status de Pagamento","Data de Vencimento","Valor Pago Até Agora","Data Fechamento","Observações"];

  sh.setHiddenGridlines(true);
  for (var i = 0; i < headers.length; i++) sh.setColumnWidth(i + 1, 145);
  sh.setColumnWidth(16, 260);

  sh.getRange(1, 1).setValue("CRM COMERCIAL CONDUZ AGRO — PROSPECÇÃO")
    .setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.getRange(1, 1, 1, 16).setBackground(COR_OLIVE_DEEP);
  sh.setRowHeight(1, 32);

  sh.getRange(2, 1).setValue("Pipeline de prospecção até o fechamento + financeiro de cada cliente. Atualize o Status sempre que um produtor avançar de etapa — é isso que transforma a planilha em pipeline, não em lista parada. Apague a linha de exemplo (linha 4) antes de usar de verdade.")
    .setFontColor(COR_INK_SOFT).setFontStyle("italic").setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.getRange(2, 1, 1, 16).setBackground(COR_PAPER);
  sh.setRowHeight(2, 34);

  sh.getRange(3, 1, 1, 16).setValues([headers])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(9.5)
    .setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(3, 32);

  var exemplo = ["[exemplo — apague] João Bezerra","Fazenda Santa Rita","(67) 99999-0000",
    "Indicação de produtor","Proposta enviada","28/06","Ligar pra confirmar retorno","30/06",
    "Em aberto","R$ 3.500,00","Parcelado","A pagar","","","",
    "Tem CAR pendente há 2 anos, urgência alta pro financiamento"];
  sh.getRange(4, 1, 1, 16).setValues([exemplo]).setFontStyle("italic").setFontColor(COR_INK_SOFT).setFontSize(9);

  var totalLinhas = 30;
  var dataRange = sh.getRange(4, 1, totalLinhas, 16);
  dataRange.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle").setFontSize(9);
  sh.setRowHeights(4, totalLinhas, 26);

  setDropdown(sh, 4, 4, totalLinhas, ["Indicação de produtor","Indicação de colega técnico",
    "Prospecção ativa (Milena buscou)","Redes sociais / conteúdo","Fui procurada"]);
  setDropdown(sh, 4, 5, totalLinhas, ["Não abordado","Abordado","Respondeu","Diagnóstico feito",
    "Proposta enviada","Cliente","Não fechou"]);
  setDropdown(sh, 4, 9, totalLinhas, ["Sim","Não","Em aberto"]);
  setDropdown(sh, 4, 11, totalLinhas, ["À vista","Parcelado","Outro"]);
  setDropdown(sh, 4, 12, totalLinhas, ["A pagar","Em dia","Atrasado","Quitado"]);

  var statusPagRange = sh.getRange(4, 12, totalLinhas, 1);
  var rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Atrasado").setBackground(COR_RUST_TINT).setRanges([statusPagRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Em dia").setBackground(COR_OLIVE_TINT).setRanges([statusPagRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Quitado").setBackground(COR_GOLD_TINT).setRanges([statusPagRange]).build());
  sh.setConditionalFormatRules(rules);

  sh.setFrozenRows(3);
  sh.setFrozenColumns(1);
}

function criarAbaReativacao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Reativação";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  var headers = ["Nome do Produtor","Documento a Renovar","Data da Última Atualização",
    "Data Prevista de Reativação","Status de Reativação","Observações"];

  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 200);
  sh.setColumnWidth(2, 150);
  sh.setColumnWidth(3, 170);
  sh.setColumnWidth(4, 170);
  sh.setColumnWidth(5, 190);
  sh.setColumnWidth(6, 320);

  sh.getRange(1, 1).setValue("CRM COMERCIAL CONDUZ AGRO — REATIVAÇÃO ANUAL")
    .setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.getRange(1, 1, 1, 6).setBackground(COR_OLIVE_DEEP);
  sh.setRowHeight(1, 32);

  sh.getRange(2, 1).setValue("Documentos (CAR, CCIR, ITR) vencem e precisam ser atualizados — essa aba garante que nenhum cliente fica esquecido depois que o serviço foi entregue. A coluna de Data Prevista já calcula 12 meses à frente sozinha. Apague a linha de exemplo (linha 4) antes de usar de verdade.")
    .setFontColor(COR_INK_SOFT).setFontStyle("italic").setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.getRange(2, 1, 1, 6).setBackground(COR_PAPER);
  sh.setRowHeight(2, 40);

  sh.getRange(3, 1, 1, 6).setValues([headers])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(9.5)
    .setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(3, 32);

  sh.getRange(4, 1).setValue("[exemplo — apague] João Bezerra").setFontStyle("italic").setFontColor(COR_INK_SOFT);
  sh.getRange(4, 2).setValue("CAR").setFontStyle("italic").setFontColor(COR_INK_SOFT);
  sh.getRange(4, 3).setValue("15/03/2026").setFontStyle("italic").setFontColor(COR_INK_SOFT);
  sh.getRange(4, 4).setFormula("=IF(C4=\"\",\"\",EDATE(C4,12))").setFontStyle("italic").setFontColor(COR_INK_SOFT);
  sh.getRange(4, 5).setValue("A vencer").setFontStyle("italic").setFontColor(COR_INK_SOFT);
  sh.getRange(4, 6).setValue("Renovação anual padrão — sem pendência conhecida").setFontStyle("italic").setFontColor(COR_INK_SOFT);

  var totalLinhas = 30;
  var dataRange = sh.getRange(4, 1, totalLinhas, 6);
  dataRange.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle").setFontSize(9);
  sh.setRowHeights(4, totalLinhas, 26);

  // Fórmula de data prevista pras linhas seguintes (a partir da linha 5)
  for (var r = 5; r < 4 + totalLinhas; r++) {
    sh.getRange(r, 4).setFormula("=IF(C" + r + "=\"\",\"\",EDATE(C" + r + ",12))");
  }

  setDropdown(sh, 4, 2, totalLinhas, ["CAR","CCIR","ITR","Outro"]);
  setDropdown(sh, 4, 5, totalLinhas, ["A vencer (90+ dias)","Vence em breve (até 90 dias)","Vencido","Contatado","Renovado"]);

  var statusRange = sh.getRange(4, 5, totalLinhas, 1);
  var rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Vencido").setBackground(COR_RUST_TINT).setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Vence em breve (até 90 dias)").setBackground(COR_GOLD_TINT).setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Renovado").setBackground(COR_OLIVE_TINT).setRanges([statusRange]).build());
  sh.setConditionalFormatRules(rules);

  sh.setFrozenRows(3);
  sh.setFrozenColumns(1);
}

function setDropdown(sh, startRow, col, numRows, options) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();
  sh.getRange(startRow, col, numRows, 1).setDataValidation(rule);
}
