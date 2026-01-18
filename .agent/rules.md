---
description: Antigravity エージェントの行動指針と基本ルール
---

# Antigravity Rules

このファイルは、Antigravity エージェントがタスクを遂行する際に遵守すべき基本ルールと行動指針を定義します。

## 1. 言語設定 (Language)

- **日本語の徹底**: 思考、回答、コミットメッセージ、PRのタイトル・本文など、すべての出力は原則として **日本語** で行ってください。
- コード内のコメントやドキュメントも日本語で記述してください。

## 2. ドキュメント参照 (Single Source of Truth)

技術的な判断や実装の基準は、すべて `docs/coding-guidelines/` 配下のドキュメントを正とします。
このファイルには技術的な詳細は記述しません。必ず以下のリンク先を参照してください。

- **[全体ガイドライン](../docs/coding-guidelines/README.md)**
- **[アーキテクチャ](../docs/coding-guidelines/architecture.md)**: DIP, レイヤー構造, 副作用の分離
- **[Astro/TypeScript](../docs/coding-guidelines/astro-typescript.md)**: 型安全性, コンポーネント設計
- **[セキュリティ](../docs/coding-guidelines/security.md)**: XSS対策, 機密情報管理
- **[E2Eテスト](../docs/coding-guidelines/e2e-testing.md)**: スモークテスト, セレクター戦略
- **[コード品質](../docs/coding-guidelines/code-quality.md)**: レビュー基準

## 3. コンテキスト取得 (Context & Serena)

プロジェクトの全体像や複雑な依存関係を把握する必要がある場合は、**Serena MCP** の活用を推奨します。

- **推奨**: `read_resource` 等を使用して Serena から情報を引き出す。
- **代替**: Serena が利用できない、または単純なファイル操作の場合は、標準のファイル操作ツール (`list_dir`, `grep_search` 等) を使用する。

## 3.1 GitHub操作 (GitHub MCP)

GitHub に関連する操作（PR作成、PR更新、PRリスト取得など）は、**GitHub MCPサーバー** 経由で行ってください。

- **推奨**: `create_pull_request`, `list_pull_requests`, `update_pull_request` 等のMCPツールを使用
- **禁止**: `gh` CLI の使用は禁止（環境依存性・認証の一貫性のため）


## 4. プロセス遵守 (Workflows)

定義済みのワークフロー (`.agent/workflows/`) を優先的に使用し、一貫した開発プロセスを遵守してください。

- **品質チェック**: `/review` (Lint, TypeCheck, SecurityCheck)
- **ブランチ管理**: `/branch` (命名規則の統一)
- **コミット**: `/commit` (Conventional Commits + 日本語)
- **プルリクエスト**: `/pr` (日本語での説明)
- **一括実行**: 開発の区切りには `/all-commit` を提案・実行する。

## 5. パス記述のルール

- **相対パスの徹底**: ドキュメント、アーティファクト、設定ファイル内でプロジェクト内のファイルを参照する際は、**必ず相対パス** (`./`, `../docs/...` 等) または **リポジトリルート相対パス** (`/docs/...`) を使用してください。
- **禁止事項**: ユーザーのホームディレクトリを含む絶対パス (`/Users/...`, `/home/...`, `file://...`) は、環境依存性が高く、セキュリティリスクも高いため **絶対に使用禁止** です。
- **設定ファイルへの適用**: この規則は `.gemini/settings.json` や `.agent/` 配下のファイルにも適用されます。環境変数 (`$VAR_NAME`) やカレントディレクトリ参照 (`"cwd": "."`) を活用してください。

## 6. TDDと基本姿勢

- `AGENTS.md` に記載された "t-wada流TDD" のサイクル (Red -> Green -> Refactor) を尊重すること。
- テストは「仕様の例示」として扱い、可読性を高く保つこと。

## 7. Git操作とPR作成の制限

**自律的に行ってよい操作**:
- コードの修正
- ローカルブランチの作成・切り替え
- コミットの作成 (`git commit`)

**ユーザー承認が必要な操作**:
- **明示的な指示がない限り**、以下の操作は禁止します。実行前に必ず `notify_user` で許可を得てください。
  - リモートリポジトリへの反映 (`git push`)
  - Pull Request の作成・更新 (`create_pull_request`, `update_pull_request` 等)
