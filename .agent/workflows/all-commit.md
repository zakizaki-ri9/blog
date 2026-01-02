---
description: ReviewからPR作成までの一連のフローを一括実行します
---

# All-Commit Workflow

このワークフローは、開発の区切りにおいて、品質チェックからPR作成までを自動的に連鎖実行します。

## 実行ステップ

// turbo
1. **Review**: コード品質チェック
```bash
/review
```

// turbo
2. **Branch**: ブランチ確認・作成
```bash
/branch
```

// turbo
3. **Commit**: コミット作成
```bash
/commit
```

// turbo
4. **PR**: PR作成・更新
```bash
/pr
```
