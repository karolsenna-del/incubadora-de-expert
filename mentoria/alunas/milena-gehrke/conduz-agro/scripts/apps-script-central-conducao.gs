/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) da
 * Central de Condução do Atendimento: acompanhamento OPERACIONAL de cada
 * caso já fechado — etapa atual, próximo checkpoint, última comunicação com
 * o produtor, prazo combinado.
 *
 * Metade operacional do CRM (divisão comercial/operacional definida pela
 * Karol) — o CRM cuida de fechar a venda, esta ferramenta cuida de entregar
 * o serviço. Cruza com o CRM pelo Nome do Produtor.
 *
 * Biblioteca cumulativa (como o CRM) — não duplica, 1 tabela que cresce.
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";
var COR_OLIVE_TINT = "#E9EEDD";
var COR_RUST_TINT = "#F0DAD0";

function criarCentralConducao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Central de Condução";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  var headers = ["Nome do Produtor","Serviço Contratado","Etapa Atual","Data do Último Update",
    "Próximo Checkpoint Previsto","Última Comunicação ao Produtor","Prazo Final Combinado",
    "Status Geral","Observações"];

  sh.setHiddenGridlines(true);
  sh.setColumnWidth(1, 170);
  sh.setColumnWidth(2, 200);
  sh.setColumnWidth(3, 170);
  sh.setColumnWidth(4, 140);
  sh.setColumnWidth(5, 160);
  sh.setColumnWidth(6, 220);
  sh.setColumnWidth(7, 140);
  sh.setColumnWidth(8, 120);
  sh.setColumnWidth(9, 240);

  sh.getRange(1, 1).setValue("CENTRAL DE CONDUÇÃO DO ATENDIMENTO")
    .setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.getRange(1, 1, 1, 9).setBackground(COR_OLIVE_DEEP);
  sh.setRowHeight(1, 32);

  sh.getRange(2, 1).setValue("Metade OPERACIONAL do CRM — o CRM fecha a venda, esta planilha acompanha a entrega do serviço. Cruza com o CRM pelo Nome do Produtor. Atualize sempre que der um checkpoint pro produtor — é isso que evita cobrança por atraso que não é seu. Apague a linha de exemplo (linha 4) antes de usar de verdade.")
    .setFontColor(COR_INK_SOFT).setFontStyle("italic").setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.getRange(2, 1, 1, 9).setBackground(COR_PAPER);
  sh.setRowHeight(2, 40);

  sh.getRange(3, 1, 1, 9).setValues([headers])
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(9.5)
    .setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(3, 32);

  var exemplo = ["[exemplo — apague] João Bezerra","Regularização de área na matrícula",
    "Aguardando cartório","24/08","07/09","\"Protocolamos dia 22, aguardando retorno do cartório\" (24/08)",
    "30/09","No prazo","Prazo combinado na Matriz de Responsabilidade no fechamento"];
  sh.getRange(4, 1, 1, 9).setValues([exemplo]).setFontStyle("italic").setFontColor(COR_INK_SOFT).setFontSize(9);

  var totalLinhas = 30;
  var dataRange = sh.getRange(4, 1, totalLinhas, 9);
  dataRange.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("middle").setWrap(true).setFontSize(9);
  sh.setRowHeights(4, totalLinhas, 40);

  setDropdown(sh, 4, 3, totalLinhas, ["Documentação recebida","Análise em andamento","Protocolado",
    "Aguardando cartório","Aguardando banco/crédito","Aguardando produtor","Concluído"]);
  setDropdown(sh, 4, 8, totalLinhas, ["No prazo","Atenção","Atrasado","Concluído"]);

  var statusRange = sh.getRange(4, 8, totalLinhas, 1);
  var rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Atrasado").setBackground(COR_RUST_TINT).setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Atenção").setBackground(COR_GOLD_TINT).setRanges([statusRange]).build());
  rules.push(SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo("Concluído").setBackground(COR_OLIVE_TINT).setRanges([statusRange]).build());
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
