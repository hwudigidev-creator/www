/**
 * 動態官方首頁 - Google Apps Script 後端
 *
 * 設定說明：
 * 1. 將此程式碼複製到 Google Apps Script
 * 2. 將 SPREADSHEET_ID 替換為你的 Google Sheets ID
 * 3. 部署為 Web 應用程式
 */

// Google Sheets ID - 請替換為你的試算表 ID
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

/**
 * 處理 GET 請求
 */
function doGet(e) {
  const action = e.parameter.action;
  let result;

  try {
    switch (action) {
      case 'getHomeData':
        result = getHomeData();
        break;
      case 'getProducts':
        result = getProducts();
        break;
      case 'getAbout':
        result = getAbout();
        break;
      default:
        result = { error: 'Invalid action' };
    }
  } catch (error) {
    result = { error: error.message };
  }

  return createJsonResponse(result);
}

/**
 * 處理 POST 請求
 */
function doPost(e) {
  const action = e.parameter.action;
  let result;

  try {
    const data = JSON.parse(e.postData.contents);

    switch (action) {
      case 'submitContact':
        result = submitContact(data);
        break;
      default:
        result = { error: 'Invalid action' };
    }
  } catch (error) {
    result = { error: error.message };
  }

  return createJsonResponse(result);
}

/**
 * 建立 JSON 回應 (含 CORS 設定)
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 取得試算表
 */
function getSpreadsheet() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * 取得首頁資料
 */
function getHomeData() {
  const ss = getSpreadsheet();

  // 取得 Hero 資料
  const heroSheet = ss.getSheetByName('Hero');
  const heroData = heroSheet ? getSheetData(heroSheet)[0] : null;

  // 取得 Features 資料
  const featuresSheet = ss.getSheetByName('Features');
  const features = featuresSheet ? getSheetData(featuresSheet) : [];

  return {
    hero: heroData ? {
      title: heroData.title,
      subtitle: heroData.subtitle,
      buttonText: heroData.buttonText,
      buttonLink: heroData.buttonLink
    } : null,
    features: features.map(f => ({
      icon: f.icon,
      title: f.title,
      description: f.description
    }))
  };
}

/**
 * 取得產品資料
 */
function getProducts() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('Products');

  if (!sheet) {
    return { products: [] };
  }

  const products = getSheetData(sheet);

  return {
    products: products.map((p, index) => ({
      id: p.id || index + 1,
      name: p.name,
      description: p.description,
      price: Number(p.price) || 0,
      image: p.image || ''
    }))
  };
}

/**
 * 取得關於我們資料
 */
function getAbout() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName('About');

  if (!sheet) {
    return {};
  }

  const data = getSheetData(sheet)[0];

  return {
    title: data?.title || '關於我們',
    content: data?.content || '',
    mission: data?.mission || '',
    vision: data?.vision || ''
  };
}

/**
 * 提交聯絡表單
 */
function submitContact(data) {
  const ss = getSpreadsheet();
  let sheet = ss.getSheetByName('Contacts');

  // 如果 Contacts 工作表不存在，則建立
  if (!sheet) {
    sheet = ss.insertSheet('Contacts');
    sheet.appendRow(['時間戳記', '姓名', '電子郵件', '訊息']);
  }

  // 新增資料
  sheet.appendRow([
    new Date().toLocaleString('zh-TW'),
    data.name,
    data.email,
    data.message
  ]);

  return {
    success: true,
    message: '感謝您的留言，我們會盡快與您聯繫！'
  };
}

/**
 * 將工作表資料轉換為物件陣列
 */
function getSheetData(sheet) {
  const data = sheet.getDataRange().getValues();

  if (data.length < 2) {
    return [];
  }

  const headers = data[0];
  const rows = data.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}
