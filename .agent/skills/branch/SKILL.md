---
name: branch
description: 開発用ブランチの命名規則と作成を支援するスキル
---

# Branch Skill

このスキルは、開発用ブランチの適切な命名と作成を支援します。

## 1. 現状確認

現在のブランチを確認します。

// turbo
1. 現在のブランチを表示
```bash
git branch --show-current
```

## 2. ブランチ名の決定

実装内容に基づいてブランチ名を決定してください。

**命名規則**: `cursor/{type}/{description}`
- `type`: `feat`, `fix`, `refactor`, `docs`, `test`, `chore` など
- `description`: 英数字とハイフン（日本語は不可）
- **必須**: prefixとして `cursor/` を付けること

例: `cursor/feat/add-login-ui`

## 3. ブランチの作成・切り替え

決定したブランチ名でスイッチします。
（既に存在する場合はスイッチのみ、新規の場合は作成してスイッチ）

1. ブランチを作成・切り替え
```bash
git switch -c <ブランチ名>
```
※ 既にそのブランチにいる場合はスキップしてください。
