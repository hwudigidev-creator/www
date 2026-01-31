# Dev - 啟動開發伺服器

啟動 Vite 開發伺服器進行本地開發測試。

## 執行步驟

1. 切換到 frontend 目錄
2. 確認 node_modules 存在，若無則先安裝
3. 執行 `npm run dev`
4. 回報開發伺服器 URL

## 指令

```bash
cd frontend && npm run dev
```

## 注意事項

- 預設開發伺服器會在 http://localhost:5173 啟動
- 支援 HMR (Hot Module Replacement)
- 若端口被佔用會自動使用下一個可用端口
