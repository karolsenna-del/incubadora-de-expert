/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Checklist de Evidências da Autoridade: 14 indicadores (já aprovados em
 * prd.md Seção 6 — "Critérios de Qualidade"), pontuados em 5 checkpoints
 * cumulativos (S8, S12, S16, S20, S24), com referência ao baseline da S1.
 *
 * Padrão diferente dos outros: NÃO duplica aba — é 1 tabela fixa que o aluno
 * vai preenchendo, coluna por coluna, ao longo dos 12 meses do programa.
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
var COR_GOLD = "#B07A16";
var COR_GOLD_TINT = "#F3E6C8";

function criarChecklistEvidencias() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Checklist de Evidências";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 60);
  sh.setColumnWidth(2, 320);
  for (var c = 3; c <= 7; c++) sh.setColumnWidth(c, 90);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:G1").merge().setValue("CHECKLIST DE EVIDÊNCIAS DA AUTORIDADE")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:G2").merge().setValue("Conduz Agro — 5 checkpoints cumulativos ao longo dos 12 meses. Pontue de 0 a 3 em cada coluna: 0 = ainda não · 1 = às vezes · 2 = na maioria das vezes · 3 = consistente. Compare sempre com o que você era na Sessão 1.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 40);

  // Cabeçalho da tabela
  var headers = [["#", "Indicador", "S8", "S12", "S16", "S20", "S24"]];
  sh.getRange("A4:G4").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10)
    .setHorizontalAlignment("center");
  sh.getRange("B4").setHorizontalAlignment("left");
  sh.setRowHeight(4, 26);

  var indicadores = [
    ["SINAIS CONCRETOS", null],
    [1, "Apresenta o serviço com clareza"],
    [2, "Explica assuntos técnicos de forma acessível"],
    [3, "Conduz objeções sem perder firmeza"],
    [4, "Sustenta o preço, reduz descontos"],
    [5, "Estabelece limites"],
    [6, "Destrava decisões do produtor"],
    [7, "É percebido como profissional estratégico"],
    ["SINAIS INTERNOS", null],
    [8, "Reconhece o próprio valor"],
    [9, "Sente mais segurança"],
    [10, "Reduz medo de julgamento"],
    [11, "Mantém calma sob pressão"],
    [12, "Comunica com intenção"],
    [13, "Sente orgulho da própria postura"],
    [14, "Assume condução sem perder conexão humana"]
  ];

  var row = 5;
  indicadores.forEach(function(item){
    if (item[1] === null) {
      sh.getRange(row, 1, 1, 7).merge().setValue(item[0])
        .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontWeight("bold").setFontSize(9.5);
      sh.setRowHeight(row, 22);
    } else {
      sh.getRange(row, 1).setValue(item[0]).setFontColor(COR_INK_SOFT).setFontSize(9).setHorizontalAlignment("center");
      sh.getRange(row, 2).setValue(item[1]).setFontColor(COR_INK).setFontSize(10).setWrap(true);
      sh.getRange(row, 1, 1, 7).setBackground(COR_PAPER)
        .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);
      sh.getRange(row, 3, 1, 5).setHorizontalAlignment("center");

      var scoreRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["0", "1", "2", "3"], true)
        .setAllowInvalid(false)
        .build();
      sh.getRange(row, 3, 1, 5).setDataValidation(scoreRule);

      sh.setRowHeight(row, 30);
    }
    row++;
  });

  // Linha de total
  var totalRow = row + 1;
  sh.getRange(totalRow, 2).setValue("TOTAL (máx. 42)").setFontWeight("bold").setFontColor(COR_INK).setFontSize(10);
  sh.getRange(totalRow, 1, 1, 7).setBackground(COR_PAPER_DEEP)
    .setBorder(true, true, true, true, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID);
  var cols = ["C", "D", "E", "F", "G"];
  cols.forEach(function(col){
    var firstDataRow = 5;
    var lastDataRow = totalRow - 2;
    sh.getRange(col + totalRow).setFormula(
      "=SUM(" + col + firstDataRow + ":" + col + lastDataRow + ")"
    ).setFontWeight("bold").setFontColor(COR_GOLD).setHorizontalAlignment("center");
  });
  sh.setRowHeight(totalRow, 28);

  sh.setFrozenRows(4);
  sh.setFrozenColumns(2);
}
