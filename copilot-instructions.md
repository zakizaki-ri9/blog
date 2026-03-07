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
    ├── sdd/           # 仕様駆動開発
    ├── branch/        # ブランチ管理
    ├── commit/        # Conventional Commits
    ├── pr/            # Pull Request
    ├── review/        # コード品質レビュー
    ├── e2e-generator/ # E2E テスト生成
    ├── e2e-planner/   # E2E テスト計画
    └── e2e-healer/    # E2E テスト修復

.kiro/
├── steering/          # プロジェクト指針（Kiro形式）
│   ├── product.md     # プロダクト概要
│   ├── tech.md        # 技術スタック
│   └── structure.md   # プロジェクト構造
└── specs/             # 個別機能の仕様
    └── {feature-name}/
        ├── spec.json
        ├── requirements.md
        ├── design.md
        └── tasks.md

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

## 仕様駆動開発（SDD）ワークフロー

新機能実装や大規模変更前に、以下の仕様駆動開発プロセスを実施：

### 実行タイミング
- 新機能を実装する前
- 既存機能を大幅に変更する前
- アーキテクチャに影響する変更を行う前

### Phase 0: Steering（プロジェクト指針）の確認
```bash
ls .kiro/steering/
```
- `product.md`: プロダクト概要と価値提案
- `tech.md`: 技術スタック
- `structure.md`: プロジェクト構造

### Phase 1: 仕様策定

#### Step 1: 仕様ディレクトリ初期化
```bash
mkdir -p .kiro/specs/{feature-name}
```

#### Step 2: spec.json（メタデータ）作成
```json
{
  "language": "ja",
  "feature": "{feature-name}",
  "description": "{機能の簡潔な説明}",
  "status": "requirements",
  "created": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "phases": {
    "requirements": "in-progress",
    "design": "pending",
    "tasks": "pending",
    "implementation": "pending"
  }
}
```

#### Step 3: 要件定義（requirements.md）
EARS フォーマット（Event-Action-Response-System）で要件を定義：

```markdown
# 要件定義命

## Introduction
[機能の目的と背景]

## Requirements

### Req-001: ユーザーストーリー
- **As a** [ユーザー]
- **I want** [機能]
- **So that** [価値]

### Acceptance Criteria
- When [トリガー], the [システム] shall [動作]
- If [条件], then the [システム] shall [動作]
```

#### Step 4: 設計（design.md）
アーキテクチャ、データモデル、API仕様、テスト戦略を記述：

- Overview: 目的・ユーザー・影響範囲
- Architecture: パターン選定、技術スタック、システムフロー
- Components and Interfaces: 詳細設計
- Data Models: ドメインモデル、論理/物理データモデル
- Error Handling: エラー戦略
- Testing Strategy: 単体・統合・E2Eテスト計画

#### Step 5: タスク分解（tasks.md）
実装タスクを依存関係を考慮して分解：

```markdown
# タスク分解

| ID | タイトル | 依存先 | 見積り |
|----|--------|------|------|
| T-001 | X 実装 | – | 2h |
| T-002 | Y 実装 | T-001 | 3h |

## 詳細

### T-001: X 実装
- 関連要件: Req-001
- 詳細説明と実装ステップ
```

### Phase 2: 実装計画の承認
仕様策定完了後、ユーザーレビューを依頼：
- `requirements.md`, `design.md`, `tasks.md` を確認
- 重要な設計判断・Breaking Changes の明記
- 承認後、EXECUTION モードで実装開始

詳細は [.claude/skills/sdd/SKILL.md](./.claude/skills/sdd/SKILL.md) を参照。

## エージェント（Agent Skills）

`.claude/skills/` に配置されたスキルはCopilot、Claude Codeから参照可能：

- **sdd**: 仕様駆動開発のワークフロー（要件 → 設計 → タスク → 実装）
- **branch**: 開発用ブランチの命名と作成
- **commit**: Conventional Commits に準拠した日本語コミット作成
- **pr**: GitHub MCP経由での PR 作成・更新
- **review**: コード品質とガイドラインのレビュー実行
- **e2e-generator**: テスト計画からPlaywright E2Eテストコード生成
- **e2e-planner**: Webアプリ探索からE2Eテスト計画生成
- **e2e-healer**: 壊れたPlaywright E2Eテストの自動修復

各スキルの詳細は [.claude/skills/](./.claude/skills/) 配下の `SKILL.md` を参照。

## 開発フロー

1. **計画フェーズ**: SDD で要件 → 設計 → タスク分解
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
- **[.claude/skills/sdd/SKILL.md](./.claude/skills/sdd/SKILL.md)**: 仕様駆動開発スキル
- **[docs/coding-guidelines/](./docs/coding-guidelines/)**: コーディングガイドライン全集
- **[.kiro/steering/](./.kiro/steering/)**: プロジェクト指針ドキュメント

## 最後に

不明な点や判断に迷った場合：

1. まず [docs/coding-guidelines/](./docs/coding-guidelines/) を確認
2. プロジェクト全体の方針は [AGENTS.md](./AGENTS.md) を参照
3. SDD ワークフローは [.claude/skills/sdd/SKILL.md](./.claude/skills/sdd/SKILL.md) を参照
4. 仕様駆動開発の進捗は `.kiro/specs/{feature}` で確認

---

**Version**: 2026-02-28  
**For**: GitHub Copilot, Claude Code, Gemini CLI
