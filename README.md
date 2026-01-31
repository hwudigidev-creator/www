# 動態官方首頁

> **版本：v0.6.1a**

使用 React + Google Apps Script + Google Sheets 打造的動態官方網站。

## 更新日誌

### v0.6.1a
- **浮動翻頁工具整合**
  - 上下翻頁整合為右下角浮動工具
  - UP/DOWN 文字 + 箭頭呼吸閃爍動畫
  - 金色漸層分隔線
  - 電腦版支援滾輪觸發（500ms 冷卻防連續觸發）
  - 頂端隱藏 UP、底端隱藏 DOWN

### v0.6.0a
- **聯絡頁面滾動優化**
  - 送出按鈕獨立為一個焦點（共 5 個焦點）
  - PC 版檢測內容是否超出畫面，若已到底直接彈出 Footer
- **共用 ScrollIndicator 元件**
  - 上下箭頭統一管理
  - Tap Up / Tap Down 文字提示
  - 箭頭與文字獨立呼吸動畫（2s 週期）
- **視覺優化**
  - 箭頭與文字加入多層黑暈效果增強可見度
  - Footer TOP 按鈕加入 drop-shadow 黑暈
  - 箭頭定位調整（上方避開 Header、下方增加安全距離）

### v0.5.x
- **文字雨背景效果**（About 頁面）
  - 分類顯示：動畫（藍）、影視（青）、遊戲（紫）、設計（金）
  - 垂直下落動畫，起始/結束模糊淡入淡出
  - 手機版減少數量、降低速度優化效能
  - 防重疊位置計算
- **共用 Page Hero 樣式**
  - 統一各頁面標題區 CSS
- **PWA 優化**
  - 自動更新設定（skipWaiting、clientsClaim）
  - Runtime caching 處理影片檔案
  - 修正大檔案預緩存錯誤

### v0.4.0a
- **課程頁方塊展示區放大**
  - 方塊尺寸：桌面 240px / 手機 160px
  - 圖片容器：桌面 700×900px / 手機 340×450px
- **雙層框線效果**
  - 金色外框 (cube-face)：240px
  - 紫色內框 (cube-edge)：200px
- **內層影片支援**
  - 支援 V01-V06.mp4 影片檔案
  - 影片無法播放時自動切換至 WEBP 備用圖片
  - poster 屬性預載圖片
- **首頁方塊樣式獨立**
  - 將首頁 `.cube-face` 改為 `.home-face`
  - 避免與課程頁方塊樣式衝突

### v0.3.0a
- **課程頁 3D 方塊展示**
  - 線框方塊 + 圖片雙層遮罩效果
  - 內層圖片（中心顯示）+ 外層背景（邊緣顯示）
  - 方塊隨滾動旋轉切換課程卡片
  - 金色邊框 + 紫色漸層邊線
- **課程卡片文字同步首頁**

### v0.2.1a
- **聯絡表單 Google Sheets 串接**
  - 新增獨立的 Google Apps Script 處理表單提交
  - 表單資料自動寫入 Google Sheets
  - 支援科別自動完成（與學校欄位相同介面）

### v0.2.0a
- **聯絡頁面重構**
  - 標題區 FIXED 固定不動
  - 表單區 FIXED 滿版，內部捲動（如同首頁 CUBE 字卡）
  - 上下漸層遮蔽效果
  - 捲動邏輯：表單捲完後 Footer 上浮，往上捲優先收回 Footer
  - 職業選擇器與留言並排，選擇器緊密配比
  - 圓點指示器移入選擇器框內
- **學校清單更新**
  - 使用完整 hslist.json（約 560 所學校）

### v0.1.0a
- 3D 方塊 UI 重構與角色圖滑入動畫
- 首頁 Hero + Cube Section 結構
- Footer 上浮效果

## 技術架構

### 前端 (Frontend)
- **框架**: React + Vite
- **建置工具**: Vite
- **部署**: GitHub Pages

### 後端 (Backend)
- **平台**: Google Apps Script (GAS)
- **功能**: 提供 RESTful API 端點
- **部署**: Google Apps Script Web App

### 資料庫 (Database)
- **儲存**: Google Sheets
- **優點**: 免費、易於管理、即時協作編輯

## 專案結構

```
www/
├── frontend/                 # React Vite 前端
│   ├── src/
│   │   ├── components/       # React 元件
│   │   │   ├── Cube3D.jsx    # 3D 方塊 UI 元件
│   │   │   ├── Header.jsx    # 頁首導覽
│   │   │   ├── Footer.jsx    # 頁尾
│   │   │   ├── Loading.jsx   # 載入動畫
│   │   │   └── VersionInfo.jsx # 版本資訊顯示
│   │   ├── pages/            # 頁面元件
│   │   │   ├── Home.jsx      # 首頁
│   │   │   ├── About.jsx     # 關於我們
│   │   │   ├── Products.jsx  # 產品頁
│   │   │   └── Contact.jsx   # 聯絡我們
│   │   ├── services/         # API 請求服務
│   │   │   └── api.js
│   │   ├── hooks/            # 自訂 Hooks
│   │   │   └── useFetch.js
│   │   ├── assets/           # 靜態資源
│   │   │   └── styles.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # Google Apps Script 後端
│   ├── Code.gs               # 主程式碼 (含所有 API 函數)
│   ├── appsscript.json       # GAS 設定檔
│   └── SHEETS_SETUP.md       # Google Sheets 設定指南
│
├── google-apps-script/       # 獨立的 Apps Script
│   └── contact-form.gs       # 聯絡表單專用腳本
│
└── README.md
```

## 系統架構流程

```
┌─────────────┐     HTTP Request     ┌─────────────────┐     讀寫資料     ┌───────────────┐
│   React     │ ──────────────────► │  Google Apps    │ ◄─────────────► │ Google Sheets │
│   Frontend  │ ◄────────────────── │  Script API     │                 │   Database    │
│ (GitHub     │     JSON Response    └─────────────────┘                 └───────────────┘
│   Pages)    │
└─────────────┘
```

## 開發指南

### 前端開發

```bash
# 進入前端目錄
cd frontend

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

### 後端設定 (Google Apps Script)

1. 前往 [Google Apps Script](https://script.google.com/)
2. 建立新專案
3. 將 `backend/` 資料夾中的程式碼複製到 GAS 編輯器
4. 部署為 Web 應用程式
5. 複製部署 URL 作為 API 端點

### Google Sheets 設定

1. 建立新的 Google Sheets 試算表
2. 設計資料表結構 (如：首頁內容、產品資訊、聯絡表單等)
3. 將試算表 ID 設定到 Google Apps Script 中

## GitHub Pages 部署

### 方法一：使用 GitHub Actions 自動部署

1. 在 GitHub 倉庫設定中啟用 GitHub Pages
2. 選擇 Source 為 `GitHub Actions`
3. 專案已包含 `.github/workflows/deploy.yml` 自動部署設定
4. 每次推送到 `main` 分支時會自動部署

### 方法二：手動部署

```bash
# 進入前端目錄
cd frontend

# 建置專案
npm run build

# 部署到 GitHub Pages
npm run deploy
```

### GitHub Pages 設定步驟

1. 前往 GitHub 倉庫 → Settings → Pages
2. Source 選擇 `GitHub Actions` (推薦) 或 `Deploy from a branch`
3. 如選擇 branch，設定為 `gh-pages` 分支，目錄選 `/ (root)`
4. 儲存後等待部署完成
5. 網站將在 `https://<username>.github.io/<repo-name>/` 上線

### 重要設定

由於 GitHub Pages 會部署在子路徑下，需在 `vite.config.js` 中設定 base：

```javascript
export default defineConfig({
  base: '/www/',  // 目前設定為 /www/
  // ...其他設定
})
```

## API 端點

### 主要 API (VITE_API_URL)

| 方法 | 端點 | 說明 |
|------|------|------|
| GET  | `?action=getHomeData` | 取得首頁資料 |
| GET  | `?action=getProducts` | 取得產品列表 |
| GET  | `?action=getAbout` | 取得關於我們資料 |
| POST | `?action=submitContact` | 提交聯絡表單 |

### 聯絡表單 API (VITE_CONTACT_API_URL)

獨立的 Google Apps Script，專門處理聯絡表單並寫入 Google Sheets。

| 方法 | 說明 |
|------|------|
| GET  | 測試 API 是否運作 |
| POST | 提交表單資料到 Google Sheets |

#### 設定步驟

**步驟 1：建立 Google Sheets**
1. 前往 [Google Sheets](https://sheets.google.com/) 建立新試算表
2. 將第一個工作表命名為「聯絡表單」
3. 在第一列加入欄位標題：`時間戳記`、`校名`、`科別`、`姓名`、`手機`、`Email`、`職業興趣`、`留言`
4. 從 URL 複製試算表 ID（位於 `/d/` 和 `/edit` 之間）
   ```
   https://docs.google.com/spreadsheets/d/【這裡是SHEET_ID】/edit
   ```

**步驟 2：建立 Apps Script**
1. 在試算表中，點選「擴充功能」>「Apps Script」
2. 刪除預設程式碼，貼上 `google-apps-script/contact-form.gs` 的內容
3. **重要**：修改 `SHEET_ID` 為你的試算表 ID
   ```javascript
   const SHEET_ID = '你的試算表ID';  // 從步驟 1 取得
   ```

**步驟 3：部署 Web App**
1. 點選「部署」>「新增部署」
2. 類型選擇「網頁應用程式」
3. 設定：
   - 說明：聯絡表單 API
   - 執行身份：**我**
   - 存取權：**所有人**
4. 點選「部署」
5. 複製「網頁應用程式」URL

**步驟 4：設定環境變數**
- 本機開發：將 URL 設定到 `frontend/.env` 的 `VITE_CONTACT_API_URL`
- 生產環境：在 GitHub Settings > Secrets 新增 `VITE_CONTACT_API_URL`

#### 更新部署

修改 Apps Script 程式碼後，需要重新部署：
1. 點選「部署」>「管理部署」
2. 選擇現有部署，點選「編輯」(鉛筆圖示)
3. 版本選擇「新版本」
4. 點選「部署」

> **注意**：URL 不會改變，但必須建立新版本才會套用程式碼變更。

#### 疑難排解

| 問題 | 原因 | 解決方式 |
|------|------|----------|
| `Document is missing` | SHEET_ID 設定錯誤 | 確認 SHEET_ID 與試算表 URL 相符 |
| `找不到網頁` | 部署設定錯誤 | 確認存取權為「所有人」 |
| `發送失敗` | CORS 或網路問題 | 檢查瀏覽器 Console 錯誤訊息 |
| 資料未寫入 | 工作表名稱錯誤 | 確認工作表名稱為「聯絡表單」 |

## 環境變數

前端需設定以下環境變數 (建立 `.env` 檔案)：

```env
# 主要 API（首頁、產品、關於等資料）
VITE_API_URL=你的Google Apps Script部署URL

# 聯絡表單專用 API（寫入 Google Sheets）
VITE_CONTACT_API_URL=你的聯絡表單Apps Script部署URL
```

生產環境部署時，需在 GitHub Actions 中設定 Secrets：
- `VITE_API_URL`: Google Apps Script Web App URL
- `VITE_CONTACT_API_URL`: 聯絡表單 Google Apps Script Web App URL

## 開發注意事項

### CORS 設定
Google Apps Script 預設支援 CORS，但需確保部署時選擇「任何人」可存取。

### SPA 路由處理
GitHub Pages 不支援 SPA 路由，專案使用 HashRouter 或在 `public/404.html` 處理重導向。

## 授權條款

MIT License
