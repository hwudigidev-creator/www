/**
 * 聯絡表單 Google Apps Script
 * 接收前端表單資料並寫入 Google Sheets
 *
 * 使用方式：
 * 1. 建立新的 Google Sheets
 * 2. 開啟 Apps Script（擴充功能 > Apps Script）
 * 3. 貼上此代碼
 * 4. 部署為網頁應用程式（部署 > 新增部署 > 網頁應用程式）
 * 5. 設定「執行身份」為「我」，「存取權」為「所有人」
 * 6. 複製部署的 URL 設定到前端的 VITE_CONTACT_API_URL
 */

// 設定 Google Sheets ID（從 URL 取得）
const SHEET_ID = '你的_GOOGLE_SHEETS_ID';
const SHEET_NAME = '聯絡表單';

/**
 * 處理 GET 請求（用於測試）
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Contact Form API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 處理 POST 請求（接收表單資料）
 */
function doPost(e) {
  try {
    // 解析 JSON 資料
    const data = JSON.parse(e.postData.contents);

    // 取得試算表
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);

    // 如果工作表不存在，建立新的
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // 設定標題列
      sheet.getRange(1, 1, 1, 9).setValues([[
        '時間戳記',
        '學校',
        '科別',
        '姓名',
        '手機',
        'Email',
        '想成為',
        '職涯描述',
        '留言'
      ]]);
      // 設定標題列格式
      sheet.getRange(1, 1, 1, 9)
        .setBackground('#4285f4')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
      // 凍結標題列
      sheet.setFrozenRows(1);
    }

    // 準備資料列
    const timestamp = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    const row = [
      timestamp,
      data.school || '',
      data.department || '',
      data.name || '',
      data.phone || '',
      data.email || '',
      data.career || '',
      data.careerDescription || '',
      data.message || ''
    ];

    // 新增資料到試算表
    sheet.appendRow(row);

    // 自動調整欄寬
    sheet.autoResizeColumns(1, 9);

    // 回傳成功訊息
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: '感謝您的留言，我們會盡快與您聯繫！'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // 回傳錯誤訊息
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: '發送失敗，請稍後再試。',
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 測試函數 - 在 Apps Script 編輯器中執行測試
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        school: '測試高中',
        department: '資訊科',
        name: '測試姓名',
        phone: '0912345678',
        email: 'test@example.com',
        career: '遊戲設計師',
        careerDescription: '開發遊戲的專業人員',
        message: '這是測試留言'
      })
    }
  };

  const result = doPost(testData);
  console.log(result.getContent());
}
