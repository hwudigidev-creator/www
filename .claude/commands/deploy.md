# Deploy - 部署到 GitHub Pages

建置專案並部署到 GitHub Pages (gh-pages 分支)。

## 執行步驟

1. 切換到 frontend 目錄
2. 執行 `npm run build` 建置專案
3. 執行 `npm run deploy` 部署到 gh-pages 分支
4. 回報部署結果

## 指令

```bash
cd frontend && npm run build && npm run deploy
```

## 注意事項

- 部署前請確認所有變更已 commit
- 部署目標：gh-pages 分支
- 網站 URL：依據 GitHub Pages 設定
- vite.config.js 中的 base 路徑需正確設定
