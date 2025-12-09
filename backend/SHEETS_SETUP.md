# Google Sheets 資料表設定指南

請在 Google Sheets 中建立以下工作表 (Sheet)，並依照指定的欄位結構設定。

## 1. Hero 工作表

首頁主視覺區塊的資料。

| title | subtitle | buttonText | buttonLink |
|-------|----------|------------|------------|
| 歡迎來到我們的官方網站 | 我們致力於提供最優質的產品與服務 | 了解更多 | /about |

## 2. Features 工作表

首頁特色區塊的資料。

| icon | title | description |
|------|-------|-------------|
| 🚀 | 快速服務 | 我們提供迅速且高效的服務體驗 |
| 💎 | 優質產品 | 嚴選最高品質的產品給您 |
| 🤝 | 專業團隊 | 經驗豐富的專業團隊為您服務 |
| 💬 | 客戶支援 | 24/7 全天候客戶服務支援 |

## 3. Products 工作表

產品列表資料。

| id | name | description | price | image |
|----|------|-------------|-------|-------|
| 1 | 產品 A | 這是產品 A 的描述文字 | 1200 | https://example.com/image1.jpg |
| 2 | 產品 B | 這是產品 B 的描述文字 | 2400 | https://example.com/image2.jpg |
| 3 | 產品 C | 這是產品 C 的描述文字 | 3600 | https://example.com/image3.jpg |

## 4. About 工作表

關於我們頁面資料。

| title | content | mission | vision |
|-------|---------|---------|--------|
| 關於我們 | 我們是一家致力於創新與品質的公司... | 我們的使命是... | 成為業界最受信賴的合作夥伴... |

## 5. Contacts 工作表 (自動建立)

聯絡表單提交的資料會自動儲存到此工作表。

| 時間戳記 | 姓名 | 電子郵件 | 訊息 |
|----------|------|----------|------|
| (自動填入) | (表單資料) | (表單資料) | (表單資料) |

---

## 設定步驟

1. 建立新的 Google Sheets 試算表
2. 建立上述 4 個工作表 (Hero, Features, Products, About)
3. 在每個工作表的第一行填入欄位名稱 (headers)
4. 從第二行開始填入資料
5. 複製試算表 URL 中的 ID (位於 `/d/` 和 `/edit` 之間)
6. 將 ID 貼到 Code.gs 中的 `SPREADSHEET_ID` 變數

### 試算表 ID 範例

```
https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit
                                       ^^^^^^^^^^^^
                                       這是試算表 ID
```
