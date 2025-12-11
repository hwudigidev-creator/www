# 動態官方首頁

> **版本：v0.1.0a**

使用 React + Google Apps Script + Google Sheets 打造的動態官方網站。

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

| 方法 | 端點 | 說明 |
|------|------|------|
| GET  | `?action=getHomeData` | 取得首頁資料 |
| GET  | `?action=getProducts` | 取得產品列表 |
| GET  | `?action=getAbout` | 取得關於我們資料 |
| POST | `?action=submitContact` | 提交聯絡表單 |

## 環境變數

前端需設定以下環境變數 (建立 `.env` 檔案)：

```env
VITE_API_URL=你的Google Apps Script部署URL
```

生產環境部署時，需在 GitHub Actions 中設定 Secrets：
- `VITE_API_URL`: Google Apps Script Web App URL

## 開發注意事項

### CORS 設定
Google Apps Script 預設支援 CORS，但需確保部署時選擇「任何人」可存取。

### SPA 路由處理
GitHub Pages 不支援 SPA 路由，專案使用 HashRouter 或在 `public/404.html` 處理重導向。

## 授權條款

MIT License
