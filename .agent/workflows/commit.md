---
description: 変更を確認し、適切な粒度でコミットします
---

# Commit Workflow

このワークフローは、変更内容を確認し、Conventional Commits に準拠した日本語メッセージでコミットを作成します。

## 1. 変更の分析

変更状態と差分を確認します。

// turbo
1. ステータス確認
```bash
git status
```

// turbo
2. 差分確認
```bash
git diff
```

## 2. コミット作成ループ

変更を「論理的な単位」に分割してコミットします。以下の手順を全ての変更がなくなるまで繰り返してください。

1. **対象ファイルのステージング**
   ```bash
   git add <ファイルパス>
   ```

2. **コミットメッセージの作成**
   - 形式: `{type}: {description}`
   - `type`: `feat`, `fix`, `refactor`, `docs`, `test`, `chore` 等
   - `description`: **必ず日本語**で具体的かつ簡潔に記述

3. **コミット実行**
   ```bash
   git commit -m "<メッセージ>"
   ```

## 完了条件

`git status` が clean になったら完了です。
