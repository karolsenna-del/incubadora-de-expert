/**
 * Conduz Agro — gera a aba-modelo (formatada na identidade visual da Milena)
 * do Mapa de Posicionamento: Eu sou → Eu resolvo → Para quem → Como faço →
 * Qual valor entrego.
 *
 * Diferente do Círculo de Controle/Matriz (ferramentas usadas por caso), o
 * Mapa de Posicionamento é REVISADO ao longo do tempo pela mesma pessoa
 * (S7 = versão inicial, S18 = versão revisada) — por isso também usa o
 * padrão de duplicar a aba, mas aqui pra guardar o "antes x depois" da
 * evolução, não um caso novo.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";
var COR_GOLD = "#B07A16";

function criarTemplateMapaPosicionamento() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 640);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("MAPA DE POSICIONAMENTO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — Sessão 7 (versão inicial) e Sessão 18 (revisão). Duplique esta aba em cada revisão pra guardar o histórico de evolução — não apague a versão anterior.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var campos = [
    ["EU SOU", "Sua identidade profissional — não o cargo, o que te diferencia de verdade"],
    ["EU RESOLVO", "O problema real que você resolve — não a tarefa técnica, a dor por trás dela"],
    ["PARA QUEM", "O recorte de produtor que você atende melhor — não \"todo mundo\""],
    ["COMO FAÇO", "O que te diferencia no COMO — sua condução, não só a técnica"],
    ["QUAL VALOR ENTREGO", "O resultado final que o produtor sente — segurança, tranquilidade, dinheiro protegido"]
  ];

  var row = 4;
  campos.forEach(function(c){
    sh.getRange(row, 1).setValue(c[0] + "  —  " + c[1])
      .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontWeight("bold").setFontSize(10).setWrap(true);
    sh.setRowHeight(row, 24);
    sh.getRange(row + 1, 1, 2, 1).merge().setBackground(COR_PAPER)
      .setBorder(true, true, true, true, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
      .setVerticalAlignment("top").setWrap(true);
    sh.setRowHeights(row + 1, 2, 26);
    row += 4;
  });

  sh.setFrozenRows(0);
}
