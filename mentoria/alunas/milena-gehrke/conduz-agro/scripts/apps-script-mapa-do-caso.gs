/**
 * Conduz Agro — gera 4 abas-modelo (formatadas na identidade visual da
 * Milena) do Mapa do Caso: 3 modelos de S4 específicos por serviço
 * (Crédito Rural, Regularização e Georreferenciamento) e versão avançada.
 *
 * É a MESMA ferramenta com modelos por serviço e uma versão avançada (não 4 ferramentas
 * distintas como Círculo de Controle x Matriz de Responsabilidade) — por
 * isso fica num arquivo só, com 4 abas-modelo. O aluno escolhe qual duplicar
 * conforme o tipo e a complexidade do caso.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

// Paleta — branding.md Seção 6
var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_GOLD = "#B07A16";
var COR_PAPER = "#F5F0E6";
var COR_PAPER_DEEP = "#E4DBC4";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";

function criarTodosMapasDoCaso() {
  criarTemplateMapaCreditoRural();
  criarTemplateMapaRegularizacao();
  criarTemplateMapaGeorreferenciamento();
  criarTemplateMapaAvancado();
}

function criarTemplateMapaCreditoRural() {
  criarTemplateMapaPorServico_("Crédito Rural", [
    ["DEMANDA DE CRÉDITO DECLARADA", "O que o produtor pediu, nas palavras dele"],
    ["NECESSIDADE REAL", "O objetivo por trás do pedido e o que precisa ser viabilizado"],
    ["RISCOS E PENDÊNCIAS", "O que pode impedir ou atrasar a condução do caso"],
    ["PRÓXIMO PASSO", "A ação concreta, o responsável e o prazo"]
  ]);
}

function criarTemplateMapaRegularizacao() {
  criarTemplateMapaPorServico_("Regularização", [
    ["DEMANDA DE REGULARIZAÇÃO DECLARADA", "O que o produtor pediu, nas palavras dele"],
    ["PROBLEMA REAL", "O que precisa ficar regular e por que isso importa neste caso"],
    ["RISCOS E PENDÊNCIAS", "Documentos, pessoas ou prazos que podem travar a condução"],
    ["PRÓXIMO PASSO", "A ação concreta, o responsável e o prazo"]
  ]);
}

function criarTemplateMapaGeorreferenciamento() {
  criarTemplateMapaPorServico_("Georreferenciamento", [
    ["DEMANDA DE GEORREFERENCIAMENTO", "O que o produtor pediu e qual imóvel/área está envolvido"],
    ["PROBLEMA REAL", "O que o georreferenciamento precisa destravar neste caso"],
    ["RISCOS E PENDÊNCIAS", "Informações, documentos, envolvidos ou prazos que exigem atenção"],
    ["PRÓXIMO PASSO", "A ação concreta, o responsável e o prazo"]
  ]);
}

function criarTemplateMapaPorServico_(servico, campos) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO — " + servico + " (S4)";
  if (servico === "Crédito Rural") {
    var legado = ss.getSheetByName("MODELO — Rápida (S4)");
    if (legado) ss.deleteSheet(legado);
  }
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 620);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("MAPA DO CASO — " + servico.toUpperCase())
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — modelo específico de " + servico + " para uso na Sessão 4. Duplique esta aba a cada caso novo.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 30);


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

function criarTemplateMapaAvancado() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO — Avançada (S12)";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 620);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("MAPA DO CASO — VERSÃO AVANÇADA")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — uso na Sessão 12, casos com múltiplos envolvidos e interesses divergentes (ex: conflito familiar, decisão patrimonial). Duplique esta aba a cada caso complexo novo.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var campos = [
    ["PESSOAS ENVOLVIDAS", "Quem participa da decisão — nem sempre é só quem contratou"],
    ["DOCUMENTOS ENVOLVIDOS", "Matrícula, CAR, CCIR, ITR, inventário, procurações..."],
    ["INTERESSES DE CADA PARTE", "O que cada pessoa envolvida quer, mesmo que não diga abertamente"],
    ["RISCOS", "O que pode dar errado — jurídico, financeiro, relacional"],
    ["CONFLITOS IDENTIFICADOS", "Onde os interesses batem de frente"],
    ["PRIORIDADES", "O que precisa ser resolvido primeiro pra destravar o resto"],
    ["PRÓXIMOS PASSOS", "Sequência de ações, não só a próxima"]
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
