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
 * Cada aba tem 2 partes (adicionado 08/09, sugestão da Milena): Parte 1 é o
 * Mapa do Caso (leitura do cenário); Parte 2 é o Plano de Condução do Caso
 * (depois de ler o cenário, como vai conduzir esse produtor) — mesma aba,
 * não é ferramenta separada nem arquivo separado.
 *
 * Atualizado 11/09/2026 (design-entregaveis.md Seção 11): Parte 2 passou de 7
 * para 9 campos (combinando os campos da Milena com os de uma análise externa
 * de posicionamento), e a Parte 1 da versão avançada passou de 9 para 13
 * campos (acrescentou situação financeira, urgência, informações que faltam
 * e possibilidades). A versão essencial (por serviço) não muda.
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

// Parte 2, igual em todas as 4 abas — adicionado 08/09 a pedido da Milena,
// ampliado de 7 para 9 campos em 11/09 (combinando com uma análise externa
// de posicionamento, ver design-entregaveis.md Seção 11):
// depois de ler o cenário (Parte 1), ela define como vai conduzir o caso.
var CAMPOS_PLANO_CONDUCAO = [
  ["O QUE AINDA PRECISA SER INVESTIGADO/CONFIRMADO?", "Informação que ainda é suposição, não fato verificado"],
  ["QUAIS PERGUNTAS FAZER AO PRODUTOR?", "O que perguntar antes de orientar, não só executar o pedido"],
  ["O QUE PRECISA SER EXPLICADO AO PRODUTOR?", "O que ele precisa entender pra decidir com clareza"],
  ["QUAIS DOCUMENTOS PRECISAM SER LEVANTADOS?", "O que falta reunir antes do próximo passo"],
  ["QUEM PRECISA SER ENVOLVIDO/PARTICIPAR?", "Pessoas cuja participação ou concordância o caso exige"],
  ["QUAIS RISCOS OU POSSIBILIDADES PRECISAM SER APRESENTADOS?", "O que o produtor precisa saber antes de decidir"],
  ["QUAL É O PRÓXIMO PASSO CONCRETO?", "Uma ação, não uma intenção"],
  ["COMO CONDUZIR POSSÍVEIS OBJEÇÕES OU CONFLITOS?", "Como sustentar a condução sob pressão ou resistência"],
  ["COMO O PROCESSO SERÁ ACOMPANHADO?", "Quando e por qual canal você retorna pro produtor"]
];

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

// Desenha um bloco de campos (rótulo + área de resposta de 2 linhas) a partir da linha `row`.
// Retorna a próxima linha livre — usado pra emendar a Parte 2 depois da Parte 1 sem repetir código.
function renderCampos_(sh, row, campos) {
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
  return row;
}

// Desenha o cabeçalho da Parte 2 (Plano de Condução) a partir da linha `row`. Retorna a próxima linha livre.
function renderCabecalhoPlanoConducao_(sh, row) {
  sh.getRange(row, 1).setValue("PARTE 2 — PLANO DE CONDUÇÃO DO CASO")
    .setBackground(COR_OLIVE).setFontColor(COR_PAPER)
    .setFontWeight("bold").setFontSize(12).setHorizontalAlignment("center");
  sh.setRowHeight(row, 28);
  row += 1;
  sh.getRange(row, 1).setValue("Depois de ler o cenário (Parte 1), defina como vai conduzir esse produtor. Processo: Diagnóstico → Prioridades → Responsáveis → Documentos → Etapas → Acompanhamento.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(row, 30);
  row += 2;
  return row;
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

  sh.getRange("A2").setValue("Conduz Agro — modelo específico de " + servico + " para uso na Sessão 4. Parte 1 (abaixo) é o Mapa do Caso; Parte 2 é o Plano de Condução. Duplique esta aba a cada caso novo.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 30);

  var row = renderCampos_(sh, 4, campos);
  row = renderCabecalhoPlanoConducao_(sh, row);
  renderCampos_(sh, row, CAMPOS_PLANO_CONDUCAO);

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

  sh.getRange("A2").setValue("Conduz Agro — uso na Sessão 12, casos com múltiplos envolvidos e interesses divergentes (ex: conflito familiar, decisão patrimonial). Parte 1 (abaixo) é o Mapa do Caso; Parte 2 é o Plano de Condução. Duplique esta aba a cada caso complexo novo.")
    .setBackground(COR_PAPER).setFontColor(COR_INK_SOFT).setFontStyle("italic")
    .setFontSize(9).setHorizontalAlignment("center").setWrap(true);
  sh.setRowHeight(2, 34);

  var campos = [
    ["DEMANDA DECLARADA", "O que o produtor (ou a família) pediu, nas palavras dele — corrigido 08/09, faltava na versão avançada"],
    ["PROBLEMA REAL", "O que precisa ficar resolvido de fato e por que isso importa neste caso — mesma leitura da versão rápida, antes de mapear quem está envolvido"],
    ["PESSOAS ENVOLVIDAS", "Quem participa da decisão — nem sempre é só quem contratou"],
    ["DOCUMENTOS ENVOLVIDOS", "Matrícula, CAR, CCIR, ITR, inventário, procurações..."],
    ["SITUAÇÃO FINANCEIRA (QUANDO PERTINENTE)", "Capacidade de pagamento, dívidas, garantias ou fontes de recurso que afetam a decisão — adicionado 11/09"],
    ["INTERESSES DE CADA PARTE", "O que cada pessoa envolvida quer, mesmo que não diga abertamente"],
    ["RISCOS", "O que pode dar errado — jurídico, financeiro, relacional"],
    ["URGÊNCIA", "O que tem prazo real correndo e o que pode esperar — adicionado 11/09"],
    ["INFORMAÇÕES QUE FALTAM", "O que ainda não se sabe e precisa ser levantado antes de avançar — adicionado 11/09"],
    ["POSSIBILIDADES", "Caminhos ou soluções que ainda não foram considerados pelo produtor — adicionado 11/09"],
    ["CONFLITOS IDENTIFICADOS", "Onde os interesses batem de frente"],
    ["PRIORIDADES", "O que precisa ser resolvido primeiro pra destravar o resto"],
    ["PRÓXIMOS PASSOS", "Sequência de ações, não só a próxima"]
  ];

  var row = renderCampos_(sh, 4, campos);
  row = renderCabecalhoPlanoConducao_(sh, row);
  renderCampos_(sh, row, CAMPOS_PLANO_CONDUCAO);

  sh.setFrozenRows(0);
}
