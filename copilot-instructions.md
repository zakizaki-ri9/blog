---
name: copilot
description: GitHub Copilot向けプロジェクト全体指示 - Astroブログ開発のガイドライン
---

# GitHub Copilot 向けプロジェクト指示

このプロジェクトはAstro（TypeScript）によるブログサイトです。本ファイルはCopilotの開発支援を行う際の必須ガイドです。

## 言語設定

**必ず日本語で回答・コメント・ドキュメントを記述してください。**

## パッケージマネージャー

**必ず `pnpm` を使用してください。**
- `npm` や `npx` は禁止
- `npx` の代わりに `pnpm dlx` を使用

```bash
# 例
pnpm install
pnpm add <package>
pnpm dlx <command>
```

## プロジェクト構成

```
src/
├── components/         # Astro コンポーネント（表示専用）
├── pages/             # ページコンポーネント
├── layouts/           # レイアウトコンポーネント
├── content/           # mdx ブログ記事
├── utils/             # ユーティリティ関数
├── config/            # 設定ファイル
├── integrations/      # Astro 統合


docs/
├── coding-guidelines/  # コーディング基準
│   ├── README.md
│   ├── architecture.md
│   ├── astro-typescript.md
│   ├── code-quality.md
│   ├── e2e-testing.md
│   └── security.md
└── plan/              # 計画・設計ドキュメント

.claude/
└── skills/            # エージェント Skills（Claude Code & Copilot 共用）
    ├── branch/        # ブランチ管理
    ├── commit/        # Conventional Commits
    ├── pr/            # Pull Request
    ├── review/        # コード品質レビュー
    ├── e2e-generator/ # E2E テスト生成
    ├── e2e-planner/   # E2E テスト計画
    └── e2e-healer/    # E2E テスト修復

.agent/
├── rules/             # エージェント行動ルール
└── skills/            # Claude Code スキル（Copilot から参考可）
```

## 全体ルール

本セクションはcopilot、Claude Code、Gemini CLIが参照すべき共通ガイドラインです。詳細は [AGENTS.md](./AGENTS.md) を参照。

### 実装・レビュー時のチェック項目

- [ ] CPU, メモリ等のパフォーマンスに問題ないか
- [ ] 誤字脱字はないか
- [ ] セキュリティ的な問題はないか
- [ ] コメント・ドキュメントは日本語か

### パス記載ルール

- ドキュメントやコメントに絶対パス（例: `/Users/...`）を記載しない
- パスは必ずプロジェクトルート（`blog/`）基準の相対パスで記載する
- 例: `copilot-instructions.md`、`docs/plan/agent-analysis/README.md`


### 使用ガイドライン

**Serena MCP の活用**：複雑なコード解析やアーキテクチャ理解が必要な以下の場面では、Serena MCPを積極的に利用してください：

- コードベース全体の構造理解
- シンボル間の参照関係調査
- ファイル間の依存関係分析
- 大規模リファクタリングの影響範囲調査

**通常の開発**：単純なファイル読み込み・編集、既知ファイルの直接変更、シンプルな文字列検索は通常ツールで十分です。

### Git 操作の制限

**自律的に行える操作**：
- コード修正
- ローカルブランチ作成・切り替え
- コミット作成（`git commit`）

**ユーザー承認が必須**：
- **リモートへの反映** (`git push`)
- **Pull Request 作成・更新**

明示的な指示なく上記を禁止とします。必ずユーザーに確認してください。

## テスト駆動開発（t-wada流 TDD）

`Red → Green → Refactor` サイクルに厳守：

1. **Red**: テストを先に書き、失敗（赤）を確認
2. **Green**: 最小限の仮実装で緑化
3. **Triangulate**: 追加テストで仕様を明確化
4. **Refactor**: 重複排除・命名改善（テスト安全網）

**テスト設計**：
- 単体テスト: `Vitest` で純粋関数・ユーティリティをテスト
- コンポーネント：Astro レンダリングテストで出力検証
- E2E：`Playwright` でユーザーフロー検証

## コーディングガイドライン

技術的判断の基準は [docs/coding-guidelines/](./docs/coding-guidelines/) 配下を参照：

- **[アーキテクチャ設計](./docs/coding-guidelines/architecture.md)**: DIP原則、レイヤー構造、テスト容易性
- **[Astro/TypeScript](./docs/coding-guidelines/astro-typescript.md)**: 型安全性(`strict: true`)、コンポーネント設計
- **[セキュリティ](./docs/coding-guidelines/security.md)**: XSS対策、機密情報管理
- **[コード品質](./docs/coding-guidelines/code-quality.md)**: レビュー基準、命名規則
- **[E2Eテスト](./docs/coding-guidelines/e2e-testing.md)**: セレクター戦略、テスト設計

## エージェント（Agent Skills）

`.claude/skills/` に配置されたスキルはCopilot、Claude Codeから参照可能：

- **branch**: 開発用ブランチの命名と作成
- **commit**: Conventional Commits に準拠した日本語コミット作成
- **pr**: GitHub MCP経由での PR 作成・更新
- **review**: コード品質とガイドラインのレビュー実行
- **e2e-generator**: テスト計画からPlaywright E2Eテストコード生成
- **e2e-planner**: Webアプリ探索からE2Eテスト計画生成
- **e2e-healer**: 壊れたPlaywright E2Eテストの自動修復

各スキルの詳細は [.claude/skills/](./.claude/skills/) 配下の `SKILL.md` を参照。

## 開発フロー

1. **計画フェーズ**: 要件と設計方針を整理
2. **実装フェーズ**: t-wada流 TDD で実装（Red → Green → Refactor）
3. **テストフェーズ**: `pnpm test` 、`pnpm test:e2e` で検証
4. **レビュー**: review スキルで品質チェック
5. **PR 作成**: pr スキルで GitHub へ反映

## コマンドリファレンス

```bash
# インストール・依存管理
pnpm install
pnpm add <package>
pnpm update

# 開発
pnpm dev              # 開発サーバー起動
pnpm build            # プロダクションビルド

# テスト
pnpm test             # ユニットテスト実行
pnpm test:watch       # ウォッチモード
pnpm test:e2e         # E2E テスト実行
pnpm test:e2e:ui      # E2E テスト UI

# 品質ツール
pnpm lint             # ESLint
pnpm format           # Prettier フォーマット
pnpm typecheck        # TypeScript 型チェック

# セキュリティ
pnpm security-check   # セキュリティ脆弱性スキャン
```

## 要件の明確化と証跡

**不明瞭な要件への対応**：
- 要件が曖昧な場合はユーザーに確認する
- 「これは推測に基づく提案」と明記し、推測範囲を明確化

**参考リソース**：
- 推測・検討時は最新かつ日本語のリソースを優先
- 公式ドキュメントや信頼できる技術ブログを参照
- 参照したリソースの **URL** と **該当文章（引用）** を証跡として提示

特に技術選定やアーキテクチャ決定時は証跡が必須です。

## 完了条件と品質ゲート

実装完了時：

- [ ] `pnpm lint` が通っている
- [ ] `pnpm typecheck` が通っている
- [ ] `pnpm test` の全テスト成功
- [ ] `pnpm test:e2e` の全テスト成功
- [ ] コード品質レビューが完了
- [ ] コメント・ドキュメントは日本語

未対応のテストTodoがある場合は明確に残し、優先度を示してください。

## 参考ドキュメント

- **[AGENTS.md](./AGENTS.md)**: エージェント共通ルール（詳細版）
- **[docs/coding-guidelines/](./docs/coding-guidelines/)**: コーディングガイドライン全集

## 最後に

不明な点や判断に迷った場合：

1. まず [docs/coding-guidelines/](./docs/coding-guidelines/) を確認
2. プロジェクト全体の方針は [AGENTS.md](./AGENTS.md) を参照
3. 必要なワークフローは `.claude/skills/` 配下を参照

---

**Version**: 2026-02-28  
**For**: GitHub Copilot, Claude Code, Gemini CLI
