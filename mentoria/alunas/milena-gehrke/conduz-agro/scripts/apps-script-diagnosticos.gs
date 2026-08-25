/**
 * Conduz Agro — recebe os envios dos formularios (diagnostico-interativo.html,
 * pre-diagnostico-vendas.html, ficha-inscricao.html e raio-x-conversa.html) e
 * grava cada um na aba certa da planilha.
 *
 * Setup: ver `SETUP-PLANILHAS.md` na mesma pasta.
 */

var TAB_DIAGNOSTICO = "Diagnóstico Completo";
var TAB_PRE_DIAGNOSTICO = "Pré-Diagnóstico Vendas";
var TAB_FICHA_INSCRICAO = "Ficha de Inscrição";
var TAB_RAIO_X = "Raio-X de Conversas";

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
  } else if (payload._form === "ficha_inscricao") {
    appendFichaInscricao(ss, payload);
  } else if (payload._form === "raio_x") {
    appendRaioX(ss, payload);
  } else {
    appendDiagnosticoCompleto(ss, payload);
  }

  return respond({ok: true});
}

var RAIO_X_PRINTS_FOLDER = "Conduz Agro — Prints do Raio-X";

function appendRaioX(ss, p) {
  var sheet = getOrCreateSheet(ss, TAB_RAIO_X, [
    "Timestamp", "Nome", "Email", "Produtor", "Contexto",
    "Conversa (colada)", "Percepção Prévia do Aluno", "Prints (links)", "Status da Análise"
  ]);

  var printsLinks = "";
  if (p.prints && p.prints.length) {
    var folder = getOrCreateFolder(RAIO_X_PRINTS_FOLDER);
    var links = [];
    p.prints.forEach(function(file, i) {
      try {
        var blob = Utilities.newBlob(Utilities.base64Decode(file.data), file.mimeType || "image/png",
          (p.nome || "aluno") + "_" + new Date().getTime() + "_" + i + "_" + (file.filename || "print.png"));
        var driveFile = folder.createFile(blob);
        driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        links.push(driveFile.getUrl());
      } catch (err) {
        links.push("[erro ao salvar print " + (i + 1) + "]");
      }
    });
    printsLinks = links.join("\n");
  }

  sheet.appendRow([
    new Date(),
    p.nome || "",
    p.email || "",
    p.produtor || "",
    p.contexto || "",
    p.conversa || "",
    p.percepcao || "",
    printsLinks,
    "Pendente"
  ]);
}

function getOrCreateFolder(name) {
  var it = DriveApp.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  return DriveApp.createFolder(name);
}

function appendFichaInscricao(ss, p) {
  var sheet = getOrCreateSheet(ss, TAB_FICHA_INSCRICAO, [
    "Timestamp", "Nome", "Email", "Uso Nº (1 ou 2)", "Produtor/Cliente",
    "Contexto do Caso", "Trava Percebida", "O Que Já Tentou", "Urgência"
  ]);
  sheet.appendRow([
    new Date(),
    p.nome || "",
    p.email || "",
    p.usoNumero || "",
    p.produtor || "",
    p.contexto || "",
    p.trava || "",
    p.jaTentou || "",
    p.urgencia || ""
  ]);
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
  getOrCreateSheet(ss, TAB_FICHA_INSCRICAO, [
    "Timestamp", "Nome", "Email", "Uso Nº (1 ou 2)", "Produtor/Cliente",
    "Contexto do Caso", "Trava Percebida", "O Que Já Tentou", "Urgência"
  ]);
  getOrCreateSheet(ss, TAB_RAIO_X, [
    "Timestamp", "Nome", "Email", "Produtor", "Contexto",
    "Conversa (colada)", "Percepção Prévia do Aluno", "Prints (links)", "Status da Análise"
  ]);
}
