/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Mapa de Valor Percebido no Agro: traduz tarefa técnica em risco evitado e
 * ganho, reduzindo disputa por preço.
 *
 * Diferente das outras ferramentas do Portfólio, essa NÃO é preenchida por
 * caso e duplicada — é uma BIBLIOTECA CUMULATIVA que o aluno vai alimentando
 * com argumentos ao longo da carreira (mesma lógica do CRM: 1 tabela só, que
 * cresce com o tempo). Não existe "aba MODELO" pra duplicar aqui.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_RULE = "#D9CDB0";

function criarMapaValorPercebido() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Mapa de Valor Percebido";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 240);
  sh.setColumnWidth(2, 240);
  sh.setColumnWidth(3, 240);
  sh.setColumnWidth(4, 260);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:D1").merge().setValue("MAPA DE VALOR PERCEBIDO NO AGRO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:D2").merge().setValue("Conduz Agro — Sessão 7. Biblioteca cumulativa: vá adicionando linhas conforme encontrar tarefas técnicas novas. Use na hora de montar qualquer proposta (Sessão 6 do Roteiro de Condução).")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var headers = [["Tarefa técnica", "Risco evitado", "Ganho / decisão destravada", "Quando usar esse argumento"]];
  sh.getRange("A4:D4").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10);
  sh.setRowHeight(4, 26);

  var seed = [
    ["Retificação de área na matrícula", "Perda de financiamento por divergência de área declarada", "Segurança jurídica pra vender ou usar a terra como garantia", "Produtor quer contratar crédito rural"],
    ["Regularização do CAR", "Multa ambiental e embargo da propriedade", "Elegibilidade pra programas de crédito e seguro rural", "Produtor não sabe que o CAR está desatualizado"],
    ["Análise cruzada de CCIR/ITR", "Inconsistência que trava financiamento ou venda no meio do processo", "Documentação pronta pra qualquer negociação futura", "Produtor pretende vender ou já pensa em transmitir a propriedade"],
    ["Regularização de posse / usucapião", "Disputa familiar ou judicial futura sobre a terra", "Propriedade formalizada, sem dúvida sobre quem é o dono", "Terra passada de geração em geração sem documentação"]
  ];
  sh.getRange(5, 1, seed.length, 4).setValues(seed);

  var totalLinhas = 20;
  var range = sh.getRange(5, 1, totalLinhas, 4);
  range.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top").setWrap(true);
  sh.setRowHeights(5, totalLinhas, 42);

  sh.setFrozenRows(4);
}
