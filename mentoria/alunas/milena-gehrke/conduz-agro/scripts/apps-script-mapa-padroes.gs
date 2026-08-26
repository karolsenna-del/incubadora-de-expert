/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Mapa Pessoal de Padrões: trava → situação → efeito comercial. Usado a
 * partir da Sessão 9 (travas mais profundas), quando o mentorado já tem
 * casos reais da Etapa 1 pra reconhecer padrões recorrentes.
 *
 * Biblioteca cumulativa (como o Mapa de Valor Percebido e o CRM) — não
 * duplica aba, é 1 tabela só que cresce toda vez que um padrão novo aparece.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_RULE = "#D9CDB0";

function criarMapaPadroes() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Mapa Pessoal de Padrões";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 220);
  sh.setColumnWidth(2, 260);
  sh.setColumnWidth(3, 220);
  sh.setColumnWidth(4, 220);
  sh.setColumnWidth(5, 110);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:E1").merge().setValue("MAPA PESSOAL DE PADRÕES")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:E2").merge().setValue("Conduz Agro — Sessão 9. Biblioteca cumulativa: toda vez que uma trava se repetir num caso novo, adicione uma linha. Ver o padrão escrito é o que separa \"tive um dia ruim\" de \"isso sempre acontece quando X\".")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 40);

  var headers = [["Trava identificada", "Situação em que apareceu", "Efeito comercial (o que custou)", "Como você respondeu", "Data"]];
  sh.getRange("A4:E4").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10);
  sh.setRowHeight(4, 26);

  var seed = [
    ["Ex: medo de cobrar o que vale", "Produtor achou o valor alto, baixei sem ele nem contestar", "Perdi 30% do valor do serviço sem precisar", "Aceitei o desconto na hora", "[data]"]
  ];
  sh.getRange(5, 1, seed.length, 5).setValues(seed).setFontStyle("italic").setFontColor(COR_INK_SOFT);

  var totalLinhas = 20;
  var range = sh.getRange(5, 1, totalLinhas, 5);
  range.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top").setWrap(true);
  sh.setRowHeights(5, totalLinhas, 42);

  sh.setFrozenRows(4);
}
