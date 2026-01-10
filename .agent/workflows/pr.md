---
description: PRを作成または更新します
---

# PR Workflow

このワークフローは、現在のブランチをプッシュし、GitHub上でPRを作成または更新します。
**前提**: GitHub MCPサーバーが設定・認証済みであること。

> [!IMPORTANT]
> `gh` CLI の使用は禁止されています。すべてのGitHub操作はMCP経由で行ってください。

## 1. Push

現在のブランチをリモートにプッシュします。

1. Push実行
```bash
git push origin HEAD
```
※ upstreamが設定されていない場合は、gitの出力に従って `-u` 付きで実行してください。

## 2. 既存PRの確認（MCP経由）

現在のブランチに関連するPRがあるか確認します。

1. ブランチ名取得
```bash
git branch --show-current
```

2. **MCPでPRリスト確認**
   - GitHub MCPサーバーの `list_pull_requests` ツールを使用
   - パラメータ: `owner`, `repo`, `head` (現在のブランチ名)

## 3. PRの作成・更新（MCP経由）

### PRが存在しない場合

PRを新規作成します。

1. **MCPでPR作成**
   - GitHub MCPサーバーの `create_pull_request` ツールを使用
   - パラメータ:
     - `owner`: リポジトリオーナー
     - `repo`: リポジトリ名
     - `head`: 現在のブランチ名
     - `base`: マージ先ブランチ（通常 `main`）
     - `title`: 実装内容の要約（**日本語**）
     - `body`: 変更点の詳細リスト（**Markdown形式、日本語**）

### PRが既に存在する場合

必要に応じてPRの内容を更新します。コードの変更だけであればPushのみで十分ですが、タイトルや本文の修正が必要な場合は `update_pull_request` を使用します。

1. **MCPでPR更新** (任意)
   - GitHub MCPサーバーの `update_pull_request` ツールを使用
   - パラメータ: `owner`, `repo`, `pull_number` (手順2で取得), `title`, `body`
   - 内容を適宜修正・追記してください（**日本語**）

