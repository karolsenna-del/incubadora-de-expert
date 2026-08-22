/**
 * Conduz Agro — recebe os envios dos 2 diagnósticos (diagnostico-interativo.html
 * e pre-diagnostico-vendas.html) e grava cada um na aba certa da planilha.
 *
 * Setup: ver `SETUP-PLANILHAS.md` na mesma pasta.
 */

var TAB_DIAGNOSTICO = "Diagnóstico Completo";
var TAB_PRE_DIAGNOSTICO = "Pré-Diagnóstico Vendas";

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respond({ok: false, error: "payload invalido"});
  }

  if (payload._form === "pre_diagnostico") {
    appendPreDiagnostico(ss, payload);
  } else {
    appendDiagnosticoCompleto(ss, payload);
  }

  return respond({ok: true});
}

function appendDiagnosticoCompleto(ss, p) {
  var sheet = getOrCreateSheet(ss, TAB_DIAGNOSTICO, [
    "Timestamp", "Nome", "Email", "Índice Geral (%)", "Técnica (%)", "Emocional (%)",
    "Condução (%)", "Trava Principal", "Trava Secundária", "Força Principal", "Perfil",
    "Respostas (JSON)"
  ]);
  sheet.appendRow([
    new Date(),
    p.nome || "",
    p.email || "",
    p.indice_geral != null ? p.indice_geral : "",
    p.tecnica != null ? p.tecnica : "",
    p.emocional != null ? p.emocional : "",
    p.conducao != null ? p.conducao : "",
    p.trava_principal || "",
    p.trava_secundaria || "",
    p.forca_principal || "",
    p.perfil || "",
    p.respostas ? JSON.stringify(p.respostas) : ""
  ]);
}

function appendPreDiagnostico(ss, p) {
  var sheet = getOrCreateSheet(ss, TAB_PRE_DIAGNOSTICO, [
    "Timestamp", "Nome", "Email", "WhatsApp", "Área de Atuação", "Tempo de Mercado",
    "Faturamento", "Maior Dificuldade", "Urgência (1-10)", "Resposta Técnica (contexto)",
    "Resposta Emocional (contexto)", "Resposta Condução (contexto)", "Trava Sinalizada"
  ]);
  sheet.appendRow([
    new Date(),
    p.nome || "",
    p.email || "",
    p.whatsapp || "",
    p.atuacao || "",
    p.tempo || "",
    p.faturamento || "",
    p.dificuldade || "",
    p.urgencia != null ? p.urgencia : "",
    p.t_aberta || "",
    p.e_aberta || "",
    p.c_aberta || "",
    p.trava_sinalizada || ""
  ]);
}

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Rode esta função uma vez manualmente (Executar → testSetup) pra criar
 * as 2 abas com cabeçalho antes do primeiro envio real, se quiser conferir
 * o layout com antecedência.
 */
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  getOrCreateSheet(ss, TAB_DIAGNOSTICO, [
    "Timestamp", "Nome", "Email", "Índice Geral (%)", "Técnica (%)", "Emocional (%)",
    "Condução (%)", "Trava Principal", "Trava Secundária", "Força Principal", "Perfil",
    "Respostas (JSON)"
  ]);
  getOrCreateSheet(ss, TAB_PRE_DIAGNOSTICO, [
    "Timestamp", "Nome", "Email", "WhatsApp", "Área de Atuação", "Tempo de Mercado",
    "Faturamento", "Maior Dificuldade", "Urgência (1-10)", "Resposta Técnica (contexto)",
    "Resposta Emocional (contexto)", "Resposta Condução (contexto)", "Trava Sinalizada"
  ]);
}
