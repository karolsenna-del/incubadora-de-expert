/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Protocolo Pessoal de Condução: o sistema próprio e repetível que o
 * mentorado constrói nas Sessões 23-24, a partir do caso real final (S22).
 *
 * Diferente das outras ferramentas — este é preenchido pelo PRÓPRIO ALUNO,
 * com as palavras dele. Por isso os campos ficam em branco, com só a
 * pergunta-guia de cada passo (não é rascunho de fala como o Roteiro de
 * Condução — aqui não cabe eu inventar a resposta por ele).
 *
 * Documento único por aluno, preenchido uma vez ao fim do programa — não
 * duplica.
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

function criarProtocoloPessoal() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Protocolo Pessoal de Condução";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 640);
  sh.setHiddenGridlines(true);

  sh.getRange("A1").setValue("PROTOCOLO PESSOAL DE CONDUÇÃO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2").setValue("Conduz Agro — Sessões 23-24. Seu sistema pessoal e repetível, construído a partir do caso real da S22. Escreva com suas próprias palavras — não existe resposta certa, existe a SUA versão.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var passos = [
    ["1 · ABRIR", "Como você inicia um atendimento, na sua própria linguagem?"],
    ["2 · OUVIR", "Como você garante que realmente ouviu antes de agir?"],
    ["3 · INVESTIGAR", "Quais perguntas você sempre faz pra achar o problema real por trás do pedido?"],
    ["4 · DIAGNOSTICAR", "Como você nomeia o problema e os riscos, do seu jeito?"],
    ["5 · ORIENTAR", "Como você traduz o técnico pro produtor, com a sua voz?"],
    ["6 · PROPOR", "Qual é a sua estrutura de proposta, na prática?"],
    ["7 · NEGOCIAR", "Como você ajusta condições sem abrir mão do valor do serviço?"],
    ["8 · DECIDIR", "Como você formaliza o fechamento com o produtor?"],
    ["9 · CONDUZIR", "Como você executa e comunica durante a prestação do serviço?"],
    ["10 · ACOMPANHAR", "Como você garante que o produtor nunca fica no escuro até a entrega?"]
  ];

  var row = 4;
  passos.forEach(function(p){
    sh.getRange(row, 1).setValue(p[0] + "  —  " + p[1])
      .setBackground(COR_GOLD_TINT).setFontColor(COR_GOLD).setFontWeight("bold").setFontSize(10).setWrap(true);
    sh.setRowHeight(row, 26);
    sh.getRange(row + 1, 1, 2, 1).merge().setBackground(COR_PAPER)
      .setBorder(true, true, true, true, false, false, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
      .setVerticalAlignment("top").setWrap(true);
    sh.setRowHeights(row + 1, 2, 24);
    row += 3;
  });

  sh.setFrozenRows(0);
}
