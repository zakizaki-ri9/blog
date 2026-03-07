# 実装テンプレート：Copilot 向けファイルサンプル

このドキュメントは、Copilot 対応実装時に使用するテンプレートとサンプルコードを提供します。

---

## Template 1: `copilot-instructions.md`

**配置**: プロジェクトルート

**用途**: GitHub Copilot が起動時に読み込む全体指示

```markdown
# GitHub Copilot 用指示ファイル

このプロジェクトはAstro（TypeScript）によるブログサイトです。

## 言語設定

**必ず日本語で回答・コメント・ドキュメントを記述してください。**

## パッケージマネージャー

**必ず `pnpm` を使用してください。**
`npm` や `npx` は禁止、代わりに `pnpm dlx` を使用。

## プロジェクト構成

```
src/
├── components/      # Astro コンポーネント（表示専用）
├── pages/           # ページコンポーネント
├── layouts/         # レイアウトコンポーネント
├── content/         # mdx ブログ記事
├── utils/           # ユーティリティ関数
└── config/          # 設定ファイル

docs/
├── coding-guidelines/   # コーディング基準
└── guides/              # 操作ガイド

.github/agents/         # Copilot Agent Skills
.agent/                 # Claude Code スキル（Copilot から参考可）
```

## 基本ルール

### 実装時のチェック項目

- パフォーマンス面に問題ないか（CPU, メモリ）
- 誤字脱字はないか
- セキュリティ上の問題はないか

### コード参照

技術的な判断や実装の基準は、`docs/coding-guidelines/` 配下のドキュメントを参照：

- **[アーキテクチャ設計](./docs/coding-guidelines/architecture.md)**: DIP, レイヤー構造, テスト容易性
- **[Astro/TypeScript](./docs/coding-guidelines/astro-typescript.md)**: 型安全性, コンポーネント設計
- **[セキュリティ](./docs/coding-guidelines/security.md)**: XSS 対策, 機密情報管理
- **[コード品質](./docs/coding-guidelines/code-quality.md)**: レビュー基準

### テスト駆動開発（TDD）

t-wada流の Red → Green → Refactor サイクルに従ってください。

- **Red**: 失敗するテストを先に書く
- **Green**: 最小限の実装で緑化
- **Refactor**: 重複排除・命名改善

## ツール・MCP

### Serena MCP

複雑なコード分析やアーキテクチャ理解が必要な場面では Serena を活用：

- コードベース全体の構造理解
- シンボル間の参照関係調査
- ファイル間の依存関係分析
- 大規模リファクタリングの影響範囲調査

### GitHub MCP

PR・Issue 操作時：

- Pull Request 作成・更新
- Issue コメント

## エージェント（Agent Skills）

`.github/agents/` にスキルを配置。ドロップダウンから選択して利用：

- **sdd**: 仕様駆動開発（要件 → 設計 → タスク → 実装）
- **branch**: ブランチ作成・管理
- **commit**: Conventional Commits に従いコミット作成
- **pr**: PR 作成・更新
- **review**: PR レビューと品質チェック

詳細は [AGENTS.md](./AGENTS.md) を参照。

## Git 操作の制限

### 自律的に行える操作

- コード修正
- ローカルブランチ作成・切り替え
- コミット作成（`git commit`）

### ユーザー承認が必要な操作

明示的な指示なく以下は禁止：

- **リモートへの反映** (`git push`)
- **Pull Request 作成・更新**

実行前に確認してください。

## 開発の流れ

1. **計画フェーズ**: 要件・設計・タスク分解を SDD Agent で実行
2. **実装フェーズ**: Red → Green → Refactor でコード作成
3. **テストフェーズ**: `pnpm test` と `pnpm e2e` で検証
4. **レビュー**: review Agent で品質チェック
5. **PR 作成**: pr Agent で GitHub へ反映

## コマンド

```bash
# 開発サーバー起動
pnpm dev

# テスト実行
pnpm test

# E2E テスト
pnpm e2e

# Lint・型チェック
pnpm lint
pnpm typecheck

# ビルド
pnpm build
```

## 詳細文書

包括的な指示は [AGENTS.md](./AGENTS.md) を参照してください。

---

**最後に**: なにか不明な点があれば、docs/coding-guidelines/ をまず確認してください。
```

---

## Template 2: `.github/agents/sdd.md`

**配置**: `.github/agents/sdd.md`

**用途**: 仕様駆動開発（Spec-Driven Development）Agent

```markdown
---
name: sdd
description: 仕様駆動開発（Specification-Driven Development）- 要件定義から実装までのワークフロー
globs: ['**']
alwaysApply: false
---

# SDD (Specification-Driven Development) Agent

Kiro スタイルの仕様駆動開発をサポートします。

要件定義 → 設計策定 → タスク分解 → 実装 のサイクルを段階的に実行。

## 前提条件

このプロジェクトは `.kiro/` ディレクトリで仕様駆動開発のドキュメントを管理しています：

- `.kiro/steering/`: プロジェクト全体の指針
- `.kiro/specs/{feature}/`: 個別機能の仕様ドキュメント

## ワークフロー

### Phase 0: Steering の確認（任意）

プロジェクト全体の指針を確認します。

```
ls -la .kiro/steering/
```

以下が存在することを確認：
- `product.md`: プロダクト概要
- `tech.md`: 技術スタック
- `structure.md`: プロジェクト構造

### Phase 1: 仕様策定

#### Step 1: 仕様ディレクトリ初期化

新機能ごとに仕様ディレクトリを作成：

```bash
mkdir -p .kiro/specs/{feature-name}
```

#### Step 2: spec.json 作成

メタデータを定義：

```json
{
  "language": "ja",
  "feature": "{feature-name}",
  "description": "{簡潔な説明}",
  "status": "requirements",
  "created": "2026-02-28",
  "updated": "2026-02-28",
  "phases": {
    "requirements": "in-progress",
    "design": "pending",
    "tasks": "pending",
    "implementation": "pending"
  }
}
```

#### Step 3: 要件定義（requirements.md）

EARS フォーマットで要件を定義：

```markdown
# 要件定義

## Introduction

[機能の目的と背景]

## Requirements

### Req-001: ユーザーストーリー
- **As a** [ユーザー]
- **I want** [機能]
- **So that** [価値]

### Acceptance Criteria (EARS Format)
- When [トリガー], the [システム] shall [動作]
- If [条件], then the [システム] shall [動作]

[以降、Req-002, Req-003...]
```

#### Step 4: 設計（design.md）

アーキテクチャ、データモデル、API 仕様を記述：

```markdown
# 設計書

## アーキテクチャ

[全体図と各コンポーネント]

## データモデル

[Entity, 例: Post, Tag]

## API / インターフェース仕様

[型定義、入出力形式]

## 例外処理

[エラーハンドリング戦略]
```

#### Step 5: タスク分解（tasks.md）

実装タスクを粒度よく分解：

```markdown
# タスク分解

| タスク ID | タイトル | 依存先 | 見積り | 優先度 |
|---|---|---|---|---|
| T-001 | データモデル実装 | – | 2h | High |
| T-002 | API エンドポイント | T-001 | 3h | High |
| T-003 | フロントエンド | T-002 | 4h | Normal |
| T-004 | テスト | T-003 | 2h | Normal |

## 詳細

### T-001: データモデル実装
- 入力: 要件 Req-001, Req-002
- 出力: `src/types/post.ts`, 単体テスト
- 実装順序: 型定義 → テスト → アダプタ
```

### Phase 2: 実装計画書

ユーザーの承認を得て実装開始。

### Phase 3: 実装

タスク一覧に従い、Red → Green → Refactor で実装。

```bash
# テスト実行
pnpm test

# 型チェック
pnpm typecheck

# Lint
pnpm lint
```

## 使用例

```
# 仕様初期化
mkdir -p .kiro/specs/new-feature
echo '{ "language": "ja", "feature": "new-feature", ... }' > .kiro/specs/new-feature/spec.json

# 要件定義ファイルを作成
# requirements.md を EARS フォーマットで作成

# 設計書を作成
# design.md を記述

# タスク分解
# tasks.md をタスク一覧形式で記述

# 実装開始
pnpm test   # Red フェーズ
pnpm dev    # 実装（Green フェーズ）
pnpm test   # 検証
# Refactor フェーズ
```

## 参考リンク

- AGENTS.md の仕様駆動開発セクション参照
- `.agent/skills/sdd/SKILL.md` で詳細を確認
```

---

## Template 3: `.github/agents/branch.md`

**配置**: `.github/agents/branch.md`

**用途**: ブランチ管理

```markdown
---
name: branch
description: ブランチ作成・管理 - Git フローに準拠したブランチ戦略
globs: ['**']
alwaysApply: false
---

# Branch Agent

Git フロー準拠のブランチ管理をサポートします。

ブランチの自動命名・作成・追跡を行い、一貫したブランチ戦略を実装。

## ブランチ戦略

このプロジェクトは Git フロー採用：

```
main (本番)
  ↑
release/v1.0.0
  ↑
develop (開発)
  ↑
feature/xxx, fix/xxx
```

## ブランチ命名規則

```
feature/{feature-name}    # 新機能
fix/{bug-name}            # バグ修正
hotfix/{issue-name}       # 緊急修正
refactor/{scope}          # リファクタリング
docs/{change}             # ドキュメント更新
chore/{task}              # 環境整備
```

## 使用例

```bash
# 新機能ブランチ作成
git checkout -b feature/add-dark-mode

# 修正ブランチ作成
git checkout -b fix/rss-feed-issue

# ブランチ確認
git branch -a
```

## 実装手順

1. **カテゴリを選択**: feature / fix / hotfix など
2. **ブランチ名を指定**: kebab-case, 3語以内推奨
3. **ブランチ作成**: `git checkout -b {category}/{name}`
4. **開発実施**
5. **コミット**: Conventional Commits に準拠
6. **PR 作成**: branch Agent での作成後、review Agent で検証
```

---

## Template 4: `.github/agents/commit.md`

**配置**: `.github/agents/commit.md`

**用途**: コミット作成（Conventional Commits）

```markdown
---
name: commit
description: Conventional Commits - 統一されたコミットメッセージ形式
globs: ['**']
alwaysApply: false
---

# Commit Agent

Conventional Commits 形式に準拠したコミット作成をサポート。

## Conventional Commits フォーマット

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Type (必須)

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント更新
- `style`: コード整形（動作変更なし）
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テスト追加・変更
- `chore`: 環境構築・依存関係更新

## Scope (任意)

ファイルまたはモジュール範囲：

- `core`: コアロジック
- `ui`: UI コンポーネント
- `api`: API 関連
- `types`: 型定義
- `test`: テスト関連
- `ci`: CI/CD

## Subject (必須)

- 日本語で簡潔に（50字以内推奨）
- 命令形：「〜する」
- 先頭は大文字

## Body (任意)

- なぜその変更が必要か、詳細な文脈
- 日本語で記述
- グリッドラインは 72 文字

## Footer (任意)

```
Closes #123
Related to #456
```

## 使用例

```bash
# シンプルなコミット
git commit -m "feat(ui): ダークモード対応をページに追加"

# 詳細コミット
git commit -m "fix(rss): RSS フィード生成時のエンコーディングエラーを修正

UTF-8 エンコーディングが正しく適用されていなかったため、
XMLパーサーがエラーを発生させていた。

Closes #issue-123"
```

## Git Hook（Husky）

コミット前のチェック：

```bash
# 自動実行（Husky 設定済みの場合）
pnpm lint
pnpm typecheck
```

失敗した場合はコミットがキャンセルされます。
```

---

## Template 5: `.github/agents/pr.md`

**配置**: `.github/agents/pr.md`

**用途**: Pull Request 作成・管理

```markdown
---
name: pr
description: Pull Request - レビュー・マージワークフロー
globs: ['**']
alwaysApply: false
---

# PR (Pull Request) Agent

品質管理、レビュー、マージを管理する PR 作成サポート。

## PR タイトル

フォーマット：

```
[Type] 説明

例:
[Feature] ダークモード対応を追加
[Fix] RSS フィード生成エラーを修正
[Docs] セットアップガイドを更新
```

## PR 本文テンプレート

```markdown
## 概要

[変更内容の簡潔な説明]

## 関連する Issue

Closes #123
Related to #456

## 変更内容

- [ ] 機能追加
- [ ] バグ修正
- [ ] パフォーマンス改善
- [ ] ドキュメント更新
- [ ] テスト追加

## スクリーンショット（UI 変更の場合）

[ビフォー・アフター]

## テスト確認

- [ ] `pnpm test` をパス
- [ ] `pnpm e2e` をパス
- [ ] `pnpm lint` をパス
- [ ] `pnpm typecheck` をパス

## レビューコメント

[作成者から確認依頼や注意点]
```

## PR ライフサイクル

1. **作成**: feature ブランチから develop への PR 作成
2. **CI チェック**: GitHub Actions が自動検証
3. **Code Review**: チームメンバーがレビュー
4. **修正**: コメント対応でコミット追加
5. **マージ**: approve 後、squash merge で develop へ統合
6. **本番デプロイ**: develop → release → main

## マージ戦略

- **Feature**: Squash Merge（ブランチの履歴を1しゅうに統約）
- **Release**: Create a Merge Commit（統合を明示）
- **Main**: Create a Merge Commit

## 使用例

```bash
# PR を作成（GitHub CLI）
gh pr create --title "[Feature] ダークモード対応を追加" \
  --body "閉じられます #123"
```
```

---

## Template 6: `.github/agents/review.md`

**配置**: `.github/agents/review.md`

**用途**: PR レビュー・品質チェック

```markdown
---
name: review
description: PR Review - コード品質検証とレビュー
globs: ['**']
alwaysApply: false
---

# Review Agent

PR の自動チェック・品質検証・レビューサポート。

## チェック項目

### 自動検証

```bash
pnpm lint       # ESLint による静的解析
pnpm typecheck  # TypeScript 型チェック
pnpm test       # ユニットテスト
pnpm e2e        # E2E テスト
pnpm build      # ビルド確認
```

### コード品質確認

- [ ] 型安全性は確保されているか
- [ ] テストカバレッジは十分か（新機能時 80% 以上）
- [ ] パフォーマンス問題はないか
- [ ] セキュリティリスクはないか
- [ ] ドキュメント（コメント）は充実しているか

### ドキュメント確認

- [ ] CHANGELOG に記載されているか（機能・バグ修正）
- [ ] README が更新されているか（シリーズ機能の場合）
- [ ] コード内コメントは日本語で明確か

### アーキテクチャ確認

- [ ] 依存逆転（DIP）の原則に従っているか
- [ ] テスト容易性は確保されているか
- [ ] 副作用の分離ができているか

## レビューコメント例

```markdown
### ✅ Good

このコンポーネントは表示専用に徹しており、ビジネスロジックが含まれていません。

### 🔄 改善提案

ここはユーティリティ関数として `src/utils/` に移動することを提案します。
テスト容易性が向上します。

### 🚨 問題

このコードは `fetch` に直接依存しており、テスト困難です。
ポート化（インターフェース化）を推奨します。
```

## Approve / Request Changes

- **Approve**: すべてのテスト
パスかつコード品質要件を満たす
- **Request Changes**: 修正が必要な項目がある

詳細は [コード品質ガイド](../../docs/coding-guidelines/code-quality.md) 参照。
```

---

## スクリプト例: `scripts/sync-instructions.js`

**配置**: `scripts/sync-instructions.js`

**用途**: AGENTS.md から他の指示ファイルへ自動同期

```javascript
#!/usr/bin/env node

/**
 * 指示ファイル同期スクリプト
 * 
 * AGENTS.md from を源流として、以下にコンテンツを同期：
 * - claude.md
 * - Gemini.md
 * - copilot-instructions.md
 * 
 * 使用: pnpm sync:instructions
 */

const fs = require('fs');
const path = require('path');

const AGENTS_PATH = path.join(__dirname, '../AGENTS.md');
const TARGETS = {
  'claude.md': {
    header: '# Claude Code用指示\n\n詳細なルールは [AGENTS.md](./AGENTS.md) を参照してください。\n\n',
    footer: ''
  },
  'Gemini.md': {
    header: '# Gemini CLI用指示\n\n詳細なルールは [AGENTS.md](./AGENTS.md) を参照してください。\n\n',
    footer: ''
  },
  'copilot-instructions.md': {
    header: '# GitHub Copilot用指示\n\n詳細なルールは [AGENTS.md](./AGENTS.md) を参照してください。\n\n',
    footer: ''
  }
};

function extractContent(content) {
  // AGENTS.md から「全エージェント共通ルール」セクション抽出
  const match = content.match(/## 全エージェント共通ルール[\s\S]*?(?=## |$)/);
  return match ? match[0] : '';
}

function syncFiles() {
  console.log('🔄 指示ファイルを同期中...');

  let agentsContent;
  try {
    agentsContent = fs.readFileSync(AGENTS_PATH, 'utf-8');
  } catch (err) {
    console.error(`❌ AGENTS.md を読み込めません: ${err.message}`);
    process.exit(1);
  }

  const commonRules = extractContent(agentsContent);

  for (const [filename, config] of Object.entries(TARGETS)) {
    const filepath = path.join(__dirname, '../', filename);
    const newContent = config.header + commonRules + config.footer;

    try {
      fs.writeFileSync(filepath, newContent, 'utf-8');
      console.log(`✅ ${filename} を更新しました`);
    } catch (err) {
      console.error(`❌ ${filename} を更新できません: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('✨ 同期完了！');
}

// バリデーションモード
if (process.argv.includes('--validate')) {
  console.log('🔍 バリデーション実行中...');
  
  let agentsContent = fs.readFileSync(AGENTS_PATH, 'utf-8');
  const commonRules = extractContent(agentsContent);

  let allValid = true;
  for (const filename of Object.keys(TARGETS)) {
    const filepath = path.join(__dirname, '../', filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    if (!content.includes(commonRules.substring(0, 50))) {
      console.warn(`⚠️  ${filename} が同期されていない可能性があります`);
      allValid = false;
    }
  }

  if (allValid) {
    console.log('✅ すべてのファイルが同期状態です');
  } else {
    console.log('💡 pnpm sync:instructions を実行してください');
    process.exit(1);
  }
} else {
  syncFiles();
}
```

**package.json に追加**:

```json
{
  "scripts": {
    "sync:instructions": "node scripts/sync-instructions.js"
  }
}
```

---

## 使用方法

### 1. テンプレートの配置

各テンプレートをプロジェクトルートに配置：

```bash
# copilot-instructions.md をプロジェクトルートに作成
cp -i template1-copilot-instructions.md copilot-instructions.md

# .github/agents/ を作成
mkdir -p .github/agents/
cp -i template2-sdd.md .github/agents/sdd.md
cp -i template3-branch.md .github/agents/branch.md
cp -i template4-commit.md .github/agents/commit.md
cp -i template5-pr.md .github/agents/pr.md
cp -i template6-review.md .github/agents/review.md

# スクリプトを配置
mkdir -p scripts/
cp -i template-sync-script.js scripts/sync-instructions.js
chmod +x scripts/sync-instructions.js
```

### 2. カスタマイズ

各ファイルをプロジェクトに合わせて修正：

- `copilot-instructions.md`: プロジェクト概要、テック スタック
- `.github/agents/*.md`: 命名規則、ワークフロー詳細
- `scripts/sync-instructions.js`: 同期ロジック

### 3. テスト

```bash
# 同期テスト
pnpm sync:instructions

# バリデーション
pnpm sync:instructions --validate
```

### 4. GitHub へ提出

```bash
git add copilot-instructions.md .github/agents/ scripts/sync-instructions.js
git commit -m "feat: GitHub Copilot 対応を実装"
git push origin feature/copilot-support
```

---

**注記**: これらはテンプレートです。プロジェクトの実際の要件に合わせて調整してください。
