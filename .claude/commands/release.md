# Release - 發布新版本

整合版本發布流程：更新版本 → 寫 ChangeLog → git commit。

## 執行步驟

1. 詢問用戶本次更新的內容摘要
2. 詢問版本變更類型 (alpha/beta/milestone)
3. 更新版本號 (package.json, README.md)
4. 在 README.md 的「更新日誌」區塊新增版本記錄
5. 執行 git add 加入變更的檔案
6. 執行 git commit，訊息格式：`vX.Y.Za`
7. 提示用戶使用 GitHub Desktop 進行 Push

## Commit 訊息格式

```
vX.Y.Za
```

## 注意事項

- 遵循 SPEC.md 規範：每次更新後寫記錄到 ChangeLog，然後 git commit
- 用戶自行使用 GitHub Desktop Push
- commit 訊息需包含 Co-Authored-By 標記
- README.md 的更新日誌格式需與現有格式一致

## 更新日誌格式範例

```markdown
### vX.Y.Za
- **功能名稱**
  - 細項說明 1
  - 細項說明 2
```
