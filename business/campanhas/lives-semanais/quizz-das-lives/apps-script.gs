// Planilha "QUIZZ das lives" — recebe as respostas dos quizzes das lives.
// Cada quiz manda { aba: "Live 37 - Primeira venda", campos: { "Nome": "...", ... } }.
// Se a aba não existe, ela é criada com o cabeçalho na ordem dos campos.
// Campo novo num quiz que já tem aba vira coluna nova no fim.

const FUSO = 'America/Cuiaba';
const PLANILHA = '10ZCc-6IrIATP4VIwPlOpGDEhLSeQE50Jr9TkLgGE6XU';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const d = JSON.parse(e.postData.contents);
    const aba = String(d.aba || 'Sem nome').slice(0, 90);
    const campos = d.campos || {};
    const ss = SpreadsheetApp.openById(PLANILHA);
    let sh = ss.getSheetByName(aba);
    const chaves = ['Data e hora'].concat(Object.keys(campos));
    if (!sh) {
      sh = ss.insertSheet(aba);
      sh.getRange(1, 1, sh.getMaxRows(), sh.getMaxColumns()).setNumberFormat('@');
      if (sh.getMaxColumns() < chaves.length) sh.insertColumnsAfter(sh.getMaxColumns(), chaves.length - sh.getMaxColumns());
      sh.getRange(1, 1, 1, chaves.length).setValues([chaves]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
    const cab = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].map(String);
    chaves.forEach(function (k) {
      if (cab.indexOf(k) < 0) {
        cab.push(k);
        if (sh.getMaxColumns() < cab.length) sh.insertColumnsAfter(sh.getMaxColumns(), cab.length - sh.getMaxColumns());
        sh.getRange(1, cab.length).setNumberFormat('@').setValue(k).setFontWeight('bold');
      }
    });
    const agora = Utilities.formatDate(new Date(), FUSO, 'dd/MM/yyyy HH:mm');
    const linha = cab.map(function (k) {
      if (k === 'Data e hora') return agora;
      return campos[k] !== undefined && campos[k] !== null ? String(campos[k]).slice(0, 500) : '';
    });
    const r = sh.getLastRow() + 1;
    sh.getRange(r, 1, 1, linha.length).setNumberFormat('@').setValues([linha]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, erro: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('QUIZZ das lives: ok');
}
