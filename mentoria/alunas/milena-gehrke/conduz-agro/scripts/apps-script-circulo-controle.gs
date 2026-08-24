/**
 * Conduz Agro — gera a aba-modelo (formatada na identidade visual da Milena)
 * do Círculo de Controle da Condução (uso interno, Sessão 3).
 *
 * Cola este script na planilha "Círculo de Controle da Condução" (arquivo
 * próprio, separado da Matriz de Responsabilidade — são ferramentas usadas
 * em momentos diferentes pelo aluno).
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 * Depois de gerar a aba MODELO 1 vez, é só clicar com o botão direito nela
 * e "Duplicar" a cada situação de pressão nova — o Sheets mantém toda a
 * formatação, e cada duplicata fica salva como histórico dentro deste mesmo
 * arquivo.
 */

// Paleta — branding.md Seção 6
var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_GOLD = "#B07A16";
var COR_PAPER = "#F5F0E6";
var COR_PAPER_RAISED = "#EDE6D6";
var COR_PAPER_DEEP = "#E4DBC4";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";

function criarTemplateCirculoControle() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO";
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
  sh.getRange("A8:C8").setValues(headers).setFontWeight("bold").setFontSize(11).setHorizontalAlignment("center");
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
  sh.getRange("A10:C19").setBackground(COR_PAPER)
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
