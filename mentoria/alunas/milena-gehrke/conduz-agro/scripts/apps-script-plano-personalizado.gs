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
    ["DATA / SESSÃO DESTA VERSÃO", "Informe a data e S2, S8, S12, S16, S20 ou S24"],
    ["PONTO DE PARTIDA", "Copie do Diagnóstico da S1: papel atual, trava prioritária e evidência concreta"],
    ["TRANSFORMAÇÃO DOS 12 MESES", "Descreva o resultado final e qual evidência observável provará que aconteceu"],
    ["META ATÉ O PRÓXIMO CHECKPOINT", "Escreva um resultado verificável e o prazo"],
    ["3 PRIORIDADES DO PERÍODO", "Liste exatamente três, em ordem; diga o que ficará fora de foco"],
    ["AÇÕES DAS PRIORIDADES", "Para cada prioridade: ação concreta, prazo, evidência de conclusão e apoio necessário"],
    ["BARREIRA PREVISÍVEL E RESPOSTA", "O que pode travar a execução e o que você fará se acontecer"],
    ["O QUE MUDOU DESDE A ÚLTIMA VERSÃO", "Na S2, escreva 'primeira versão'; nas revisões, compare evidências e decisões"],
    ["COMPROMISSO ATÉ A REVISÃO", "Primeira ação, data e frase de compromisso do mentorado"],
    ["CONTINUIDADE (S24)", "Resultado a sustentar; hábitos; frequência de revisão; indicadores; riscos de recaída e resposta; apoio; primeira ação; próxima revisão. Antes da S24, escreva 'não se aplica nesta versão'."]
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
