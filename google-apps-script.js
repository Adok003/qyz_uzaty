/**
 * ═══════════════════════════════════════════════════════
 * ҚЫЗ ҰЗАТУ — Google Apps Script
 * RSVP деректерін Google Sheets-ке автоматты жіберу
 * ═══════════════════════════════════════════════════════
 *
 * ── ОРНАТУ ЖОЛЫ (қадам бойынша) ──────────────────────
 *
 * 1. Google Sheets ашыңыз → жаңа кесте жасаңыз
 *    Атауы: "Қыз Ұзату RSVP"
 *
 * 2. Sheets URL-нен ID алыңыз:
 *    https://docs.google.com/spreadsheets/d/ [ID осында] /edit
 *    Мысалы: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
 *
 * 3. Sheets → Extensions → Apps Script ашыңыз
 *
 * 4. Осы кодты толығымен қойып, SPREADSHEET_ID өзгертіңіз
 *
 * 5. Сақтаңыз (Ctrl+S)
 *
 * 6. Deploy → New deployment:
 *    • Type: "Web app"
 *    • Execute as: "Me"
 *    • Who has access: "Anyone"
 *    → "Deploy" басыңыз
 *
 * 7. Берілген URL-ды script.js ішіндегі
 *    CONFIG.appsScriptUrl-ға қойыңыз
 *
 * ═══════════════════════════════════════════════════════
 */

// ── КОНФИГУРАЦИЯ ────────────────────────────────────────
const SPREADSHEET_ID = 'YOUR_GOOGLE_SHEETS_ID_HERE';
const SHEET_NAME     = 'RSVP';
const NOTIFY_EMAIL   = ''; // Хабарлама алу үшін email (міндетті емес)
// ────────────────────────────────────────────────────────

/**
 * GET сұранысы — скрипт жұмыс жасайтынын тексеру
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'RSVP API жұмыс жасап тұр ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * POST сұранысы — форма деректерін қабылдап, Sheets-ке жазу
 */
function doPost(e) {
  try {
    // ── Деректерді талдау ──
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (_) {
      data = e.parameter || {};
    }

    // ── Spreadsheet ашу / парақ алу ──
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
    } else if (sheet.getLastRow() === 0) {
      setupHeaders(sheet);
    }

    // ── Жолды жазу ──
    const row = [
      data.timestamp  || new Date().toLocaleString('kk-KZ'),
      data.guestName  || '',
      data.guestPhone || '',
      data.status     || '',
      data.guestCount || '1',
      data.guestWish  || '',
    ];

    sheet.appendRow(row);

    // ── Соңғы жолды форматтау ──
    const lastRow = sheet.getLastRow();
    formatRow(sheet, lastRow, data.status);

    // ── Email хабарлама (орнатылса) ──
    if (NOTIFY_EMAIL) {
      sendEmail(data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', row: lastRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Қате: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Тақырып жолдарын орнату
 */
function setupHeaders(sheet) {
  const headers = ['Уақыт', 'Аты-жөні', 'Телефон', 'Келу статусы', 'Адам саны', 'Тілек'];

  const range = sheet.getRange(1, 1, 1, headers.length);
  range.setValues([headers]);
  range.setBackground('#7B1040');
  range.setFontColor('#D4AF37');
  range.setFontWeight('bold');
  range.setFontSize(11);

  sheet.setColumnWidth(1, 160);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 140);
  sheet.setColumnWidth(4, 130);
  sheet.setColumnWidth(5, 90);
  sheet.setColumnWidth(6, 240);
  sheet.setFrozenRows(1);
}

/**
 * Жолды форматтау
 */
function formatRow(sheet, rowNum, status) {
  const range = sheet.getRange(rowNum, 1, 1, 6);
  range.setBackground(rowNum % 2 === 0 ? '#FDF5E6' : '#FFFFFF');

  const statusCell = sheet.getRange(rowNum, 4);
  if (status && status.includes('Келемін')) {
    statusCell.setBackground('#EAF3DE');
    statusCell.setFontColor('#27500A');
  } else if (status && status.includes('Келе алмаймын')) {
    statusCell.setBackground('#FCEBEB');
    statusCell.setFontColor('#7A1515');
  }
  range.setVerticalAlignment('middle');
  range.setWrap(true);
}

/**
 * Email хабарлама жіберу
 */
function sendEmail(data) {
  const subject = `Жаңа RSVP: ${data.guestName} — ${data.status}`;
  const body = `
Қыз Ұзату тойына жаңа жауап!

━━━━━━━━━━━━━━━━━━━━━━━
Аты-жөні:    ${data.guestName}
Телефон:     ${data.guestPhone || 'Жазылмаған'}
Статус:      ${data.status}
Адам саны:   ${data.guestCount}
Тілек:       ${data.guestWish || '—'}
Уақыт:       ${data.timestamp}
━━━━━━━━━━━━━━━━━━━━━━━

Google Sheets:
https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}
  `.trim();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

/**
 * Статистика (Apps Script редакторынан іске қосыңыз)
 */
function getStats() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() <= 1) { Logger.log('Деректер жоқ'); return; }

  const rows      = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();
  const coming    = rows.filter(r => r[3] && r[3].includes('Келемін'));
  const notComing = rows.filter(r => r[3] && r[3].includes('Келе алмаймын'));
  const total     = coming.reduce((s, r) => s + (parseInt(r[4]) || 1), 0);

  Logger.log(`
  ════════════════════════
  RSVP СТАТИСТИКАСЫ
  ════════════════════════
  Барлық жауап: ${rows.length}
  Келеді:       ${coming.length} жауап (~${total} адам)
  Келмейді:     ${notComing.length} жауап
  ════════════════════════
  `);
}
