/**
 * Conduz Agro — gera a aba-modelo (formatada na identidade visual da Milena)
 * do Plano Personalizado: construído na S2, revisado ao final de cada
 * etapa/sub-fase (S8, S12, S16, S20) e estendido em plano de continuidade
 * na S24 (fim do programa).
 *
 * Mesmo padrão do Mapa de Posicionamento — duplica a aba a cada revisão,
 * NÃO apaga a versão anterior. Guarda o histórico de todo o plano ao
 * longo dos 12 meses numa sequência de abas.
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

function criarTemplatePlanoPersonalizado() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 640);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("PLANO PERSONALIZADO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — criado na Sessão 2, revisado ao final de cada etapa/sub-fase (S8, S12, S16, S20) e estendido em plano de continuidade na S24. Duplique esta aba em cada revisão pra guardar o histórico — não apague a versão anterior. Renomeie a cópia com a sessão (ex: \"S8 — Revisão\").")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 48);

  var campos = [
    ["DATA / SESSÃO DESTA VERSÃO", "Quando esse plano foi criado ou revisado"],
    ["ONDE VOCÊ ESTÁ AGORA", "Referência ao papel nomeado no Diagnóstico (S1) — ainda é verdade?"],
    ["META PRINCIPAL DO PERÍODO", "O que precisa ser verdade até a próxima revisão"],
    ["3 PRIORIDADES", "O que vem antes de tudo o resto até lá"],
    ["O QUE JÁ MUDOU DESDE A ÚLTIMA VERSÃO", "Deixe em branco na 1ª versão (S2) — preencha a partir da 1ª revisão"],
    ["PRÓXIMOS PASSOS", "O que fazer entre agora e a próxima sessão de revisão"],
    ["CONTINUIDADE (só na S24)", "O que sustenta esse resultado depois que as sessões quinzenais acabarem"]
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
