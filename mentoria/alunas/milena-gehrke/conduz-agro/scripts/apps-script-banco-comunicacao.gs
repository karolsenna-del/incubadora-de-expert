/**
 * Conduz Agro — gera a tabela (formatada na identidade visual da Milena) do
 * Banco de Comunicação: perguntas de escuta que funcionaram + argumentos de
 * valor que destravaram decisão, coletados a partir de casos reais. Junta
 * o que antes eram 2 entregáveis separados (S13 "modelo de comunicação" e
 * S14 "banco de perguntas") — mesma função, evita duplicar ferramenta.
 *
 * Biblioteca cumulativa (como o Mapa de Valor Percebido e o CRM) — não
 * duplica aba, é 1 tabela só que cresce a cada caso real bem conduzido.
 *
 * Como usar: ver `SETUP-FERRAMENTAS.md` na mesma pasta.
 */

var COR_INK = "#3D2817";
var COR_INK_SOFT = "#6B5A44";
var COR_OLIVE = "#5C6B3F";
var COR_OLIVE_DEEP = "#34401F";
var COR_PAPER = "#F5F0E6";
var COR_RULE = "#D9CDB0";
var COR_GOLD_TINT = "#F3E6C8";

function criarBancoComunicacao() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var nome = "Banco de Comunicação";
  var old = ss.getSheetByName(nome);
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet(nome);

  sh.setColumnWidth(1, 130);
  sh.setColumnWidth(2, 220);
  sh.setColumnWidth(3, 260);
  sh.setColumnWidth(4, 220);
  sh.setHiddenGridlines(true);

  sh.getRange("A1:D1").merge().setValue("BANCO DE COMUNICAÇÃO")
    .setBackground(COR_OLIVE_DEEP).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(14).setHorizontalAlignment("center");
  sh.setRowHeight(1, 32);

  sh.getRange("A2:D2").merge().setValue("Conduz Agro — Sessões 13 e 14. Biblioteca cumulativa: toda vez que uma pergunta ou um argumento funcionar de verdade num caso real, adicione uma linha. Vira seu próprio repertório, não teoria de curso.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 40);

  var headers = [["Tipo", "Situação onde usar", "O que dizer", "Por que funciona"]];
  sh.getRange("A4:D4").setValues(headers)
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER).setFontWeight("bold").setFontSize(10);
  sh.setRowHeight(4, 26);

  var seed = [
    ["Pergunta", "Produtor apressado, quer resposta rápida sem contexto", "\"Antes de eu te responder certo, me conta: isso é pra resolver agora ou pra já deixar encaminhado?\"", "Separa urgência real de ansiedade — evita responder errado por pressa"],
    ["Argumento", "Objeção de preço em serviço de regularização", "\"O valor que você investe aqui é menor do que o risco de perder financiamento por documentação divergente.\"", "Troca o foco de custo pra risco evitado — sai da disputa de preço"],
    ["Pergunta", "Produtor sumiu depois de demonstrar interesse — NUNCA manda \"só retomando o contato\"/\"só passando pra ver como estão as coisas\", soa vendedor genérico e diminui seu valor", "\"Me parece que você ainda não está seguro da decisão. O que falta para avançarmos?\"", "Pergunta calibrada (Never Split the Difference) — devolve o controle pro produtor sem soar cobrança, exige reflexão e resposta"],
    ["Pergunta", "Produtor sumiu — quer entender a trava real por trás do silêncio", "\"Qual o maior obstáculo que te impede de seguir com isso agora?\"", "Tática do Voss — força revelar o \"black swan\", o detalhe invisível que trava a decisão, destrava objeção oculta"],
    ["Argumento", "Produtor morno, precisa de leve pressão pra decidir", "\"Ainda faz sentido eu deixar esse espaço reservado pra você?\"", "Cria escassez implícita — a deixa de que pode perder a vaga/oportunidade move quem está indeciso"],
    ["Pergunta", "Produtor sumiu há tempo, reabordagem direta e mais informal", "\"Você desistiu ou só ficou preso na rotina mesmo?\"", "Pergunta provocativa mas amigável — alta taxa de resposta, quebra o silêncio sem soar cobrança"]
  ];
  sh.getRange(5, 1, seed.length, 4).setValues(seed).setFontStyle("italic").setFontColor(COR_INK_SOFT);

  var totalLinhas = 24;
  var range = sh.getRange(5, 1, totalLinhas, 4);
  range.setBackground(COR_PAPER)
    .setBorder(true, true, true, true, true, true, COR_RULE, SpreadsheetApp.BorderStyle.SOLID)
    .setVerticalAlignment("top").setWrap(true);
  sh.setRowHeights(5, totalLinhas, 44);

  setDropdown(sh, 5, 1, totalLinhas, ["Pergunta", "Argumento"]);

  sh.setFrozenRows(4);
}

function setDropdown(sh, startRow, col, numRows, options) {
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(options, true)
    .setAllowInvalid(false)
    .build();
  sh.getRange(startRow, col, numRows, 1).setDataValidation(rule);
}
