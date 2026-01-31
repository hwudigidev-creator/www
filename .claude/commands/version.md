# Version - 更新版本號

根據 SPEC.md 版本規則更新專案版本號。

## 版本規則 (來自 SPEC.md)

- `v0.X.0` = 主要功能里程碑
- `v0.X.Ya` = 功能迭代 (a = alpha)
- `v0.X.Yb` = 修復/優化 (b = beta)
- `v1.0.0` = 正式發布版本

## 執行步驟

1. 讀取當前版本號 (從 package.json)
2. 詢問用戶要進行的版本變更類型：
   - `alpha` - 功能迭代 (Y+1, 後綴 a)
   - `beta` - 修復優化 (後綴改為 b)
   - `milestone` - 主要里程碑 (X+1, Y=0)
   - `custom` - 自訂版本號
3. 更新以下檔案的版本號：
   - `frontend/package.json`
   - `README.md` 頂部版本標示

## 需更新的檔案

- `frontend/package.json` - version 欄位
- `README.md` - 版本標示行

## 注意事項

- 版本號更新後需執行 `/release` 完成 ChangeLog 和 commit
- 遵循語意化版本規範
