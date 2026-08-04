/**
 * CRM Reativação de Leads — dropdown + formatação condicional da coluna Status.
 *
 * Roda direto na planilha (Extensões > Apps Script), não mexe no n8n nem no Supabase.
 * Os 5 valores abaixo têm que bater exatamente com o check constraint de
 * crm_leads.status (migrations/001_crm_leads_followups.sql) — se o closer digitar
 * (ou colar) um valor fora da lista, o job "CRM - Sheets to Supabase" tenta um
 * UPDATE que viola o constraint. Por isso o dropdown é restrito (setAllowInvalid(false)).
 *
 * Idempotente: pode rodar quantas vezes precisar (ex: depois de mudar cor ou
 * aumentar LAST_ROW) — sempre substitui a regra antiga pela nova, nunca duplica.
 */
function configurarStatusCRM() {
  const SPREADSHEET_ID = '1BD4L6toolVi17Of1PrwmNFnRQprk8obV6wWN_lLatn0';
  const SHEET_NAME = 'CRM';
  const STATUS_COL = 'P';       // coluna Status (zona da closer)
  const FIRST_DATA_ROW = 3;     // linha 1 = título mesclado "ÁREA COMERCIAL", linha 2 = cabeçalho
  const LAST_ROW = 5000;        // margem de crescimento — reajuste aqui se o CRM passar disso
  const TOTAL_COLS = 18;        // A até R

  const STATUS = ['a_reativar', 'em_conversa', 'follow_up_marcado', 'fechou', 'desistiu'];
  const CORES = {
    a_reativar: '#F1F3F4',        // cinza claro — ainda não trabalhado
    em_conversa: '#D2E3FC',       // azul claro — em andamento
    follow_up_marcado: '#FEEFC3', // amarelo/laranja claro — aguardando prazo
    fechou: '#CEEAD6',            // verde claro — ganho
    desistiu: '#F4CCCC',          // vermelho claro — perdido
  };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Aba "' + SHEET_NAME + '" não encontrada.');

  const statusColIndex = columnToIndex(STATUS_COL);
  const numRows = LAST_ROW - FIRST_DATA_ROW + 1;

  // 1) Dropdown na coluna Status
  const statusRange = sheet.getRange(FIRST_DATA_ROW, statusColIndex, numRows, 1);
  const validationRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(STATUS, true)
    .setAllowInvalid(false)
    .setHelpText('Status válidos: ' + STATUS.join(', '))
    .build();
  statusRange.setDataValidation(validationRule);

  // 2) Formatação condicional — linha inteira (A:R) conforme o valor de Status
  const fullRowRange = sheet.getRange(FIRST_DATA_ROW, 1, numRows, TOTAL_COLS);

  // remove regra antiga que mirava esse mesmo range (evita empilhar duplicado a cada execução)
  const regrasExistentes = sheet.getConditionalFormatRules().filter(function (r) {
    return !r.getRanges().some(function (rg) {
      return rg.getA1Notation() === fullRowRange.getA1Notation();
    });
  });

  STATUS.forEach(function (status) {
    const regra = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=$' + STATUS_COL + FIRST_DATA_ROW + '="' + status + '"')
      .setBackground(CORES[status])
      .setRanges([fullRowRange])
      .build();
    regrasExistentes.push(regra);
  });

  sheet.setConditionalFormatRules(regrasExistentes);

  SpreadsheetApp.getUi().alert(
    'Pronto: dropdown + formatação condicional configurados na coluna ' + STATUS_COL +
    ' (linhas ' + FIRST_DATA_ROW + ' a ' + LAST_ROW + ').'
  );
}

function columnToIndex(letter) {
  let col = 0;
  for (let i = 0; i < letter.length; i++) {
    col = col * 26 + (letter.charCodeAt(i) - 64);
  }
  return col;
}
