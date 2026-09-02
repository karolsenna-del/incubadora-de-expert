/**
 * Conduz Agro — gera a aba-modelo (formatada na identidade visual da Milena)
 * da Proposta Comercial: contexto → diagnóstico → solução → escopo →
 * investimento → próximo passo. Reformulada na S7, ajustada de novo pra
 * casos maiores na S19.
 *
 * Duplica a aba por CASO (cada produtor novo = 1 cópia), mesmo padrão do
 * Mapa do Caso / Círculo de Controle.
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

function criarTemplatePropostaComercial() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "MODELO";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 640);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("PROPOSTA COMERCIAL")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — MODELO EDITÁVEL. Sessão 7 (estrutura essencial) e Sessão 19 (ajuste fino pra casos maiores). Duplique esta aba pra cada produtor novo, edite a cópia e não preencha por cima de uma proposta já enviada.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var campos = [
    ["CONTEXTO", "O que está acontecendo com esse produtor — situação de partida"],
    ["DIAGNÓSTICO", "O problema real identificado (não a demanda declarada)"],
    ["SOLUÇÃO", "O que você propõe fazer — em linguagem que o produtor entende"],
    ["ESCOPO", "O que está incluído (e o que não está) nesse serviço"],
    ["INVESTIMENTO", "Valor + forma de pagamento — use o Mapa de Valor Percebido como argumento"],
    ["PRÓXIMO PASSO", "O que precisa acontecer pra essa proposta virar contrato"]
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
