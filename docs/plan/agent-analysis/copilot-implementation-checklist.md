# Copilot 対応実装チェックリスト

デフォルトの主要タスクと確認項目

## Phase 1: 基盤整備

### 1. `copilot-instructions.md` の作成

- [x] ファイル作成: `copilot-instructions.md`
- [x] 内容構成:
  - [x] 言語設定（日本語）
  - [x] プロジェクト概要（Astro ブログ）
  - [x] パッケージマネージャー（pnpm）
  - [x] 開発ガイドライン参照（`docs/coding-guidelines/`）
  - [x] Serena MCP 使用ガイドライン
  - [x] Git 操作制限
- [ ] 動的生成との検討: AGENTS.md と同期可能な構成か確認

**参考**: `AGENTS.md` を和訳しつつ、GitHub Copilot ネイティブの表現に調整

### 2. `.github/agents/` ディレクトリ構築

```
.github/agents/
├── sdd.md              # Spec-Driven Development
├── branch.md           # ブランチ管理
├── commit.md           # コミット作成
├── pr.md               # PR 作成
└── review.md           # PR レビュー
```

- [ ] `.agent/skills/sdd/SKILL.md` → `.github/agents/sdd.md` に移植
  - [ ] Markdown フォーマットに調整
  - [ ] GitHub Copilot Agent Skill フォーマット の frontmatter 確認
  - [ ] コマンド形式を `/kiro` → 対応する Copilot 形式に調整
  
- [ ] `.agent/skills/branch/`, `commit/`, `pr/`, `review/` も同様に移植
  - [ ] 各ファイルのヘッダーを確認
  - [ ] GitHub Copilot での発火条件（trigger）を定義

### 3. ルール定義（`.github/agents/` に統合、または専用ファイル）

**Option A**: 既存ルール継承
- [ ] `.agent/rules/rules.md` を `.github/` にコピー
- [ ] Copilot フォーマット（`.mdc` or Markdown）に変換
- [ ] `applyTo` glob pattern を設定（全TS/JS ファイル、全Markdown等）

**Option B**: 専用ファイル作成
- [ ] `.github/copilot-rules.md` または `.github/instructions/copilot-rules.instructions.md`

---

## Phase 2: 動期検証と最適化

### 4. `.github/instructions/` 条件付き自動適用（Optional）

特定ファイル編集時に自動キック

- [ ] `.github/instructions/astro.instructions.md`
  - `applyTo: "src/**/*.astro"`
  - Astro コンポーネント編集時に自動適用

- [ ] `.github/instructions/typescript.instructions.md`
  - `applyTo: "src/**/*.ts"`
  - TypeScript 編集時に自動適用

**検証**: 実際に Copilot でファイル編集して自動発火確認

### 5. `.github/workflows/` で指示ファイルの検証

```yaml
# .github/workflows/validate-agents.yml
name: Validate Agent Instructions

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check AGENTS.md sync
        run: |
          # AGENTS.md, claude.md, Gemini.md, copilot-instructions.md が矛盾していないか確認
```

- [ ] Workflow ファイル作成
- [ ] 検証スクリプト作成（相互チェック）
- [ ] PR 時に自動実行

### 6. 同期スクリプトの実装（`pnpm sync:instructions`）

```javascript
// scripts/sync-instructions.js
// AGENTS.md をソースとして、以下に同期：
//   - claude.md
//   - Gemini.md
//   - copilot-instructions.md
```

- [ ] スクリプト実装
- [ ] package.json に登録：`"sync:instructions": "node scripts/sync-instructions.js"`
- [ ] マニュアル実行確認
- [ ] Husky pre-commit hook 登録（Option）

---

## Phase 3: ドキュメント・ガイド整備

### 7. クイックスタートガイド

- [ ] `docs/guides/copilot-setup.md` 作成
  - Copilot 設定方法
  - `.github/agents/` の利用方法
  - 推奨された典型的なワークフロー
  
- [ ] `docs/guides/multi-agent-comparison.md` 作成
  - Claude Code vs Gemini CLI vs Copilot
  - 各ツールの得意分野
  - 使い分けガイド

### 8. AGENTS.md の「エージェント別対応」セクション拡充

```markdown
## エージェント別対応状況

### Claude Code (Antigravity)
- ✓ 対応: AGENTS.md, claude.md, .agent/skills/, .agent/rules/
- ツール: Serena MCP, GitHub MCP
- 特徴: 自律的、Skill の自動推論
- 現在: フル稼働中

### Gemini CLI
- ✓ 対応: AGENTS.md, Gemini.md, .gemini/commands/
- ツール: Kiro スタイル仕様駆動開発
- 特徴: 宣言的、コマンド駆動
- 現在: フル稼働中

### GitHub Copilot
- ✓ 対応: AGENTS.md, copilot-instructions.md, .github/agents/
- ツール: Agent Skills (2025.12 パブリックプレビュー)
- 特徴: UI 統合、確認駆動
- 現在: 実装中（Phase 1）

### Cursor
- ☐ 対応: AGENTS.md, .cursor/rules/, .cursor/commands/
- ツール: 独自ルールシステム
- 特徴: Claude Code に準拠
- 現在: 部分的対応
```

---

## Phase 4: 実装時の注意点

### 9. Copilot フォーマットの確認

参考: GitHub Copilot Agent Skills ドキュメント

**Frontmatter テンプレート** (`.github/agents/*.md`):

```markdown
---
name: {agent-name}
description: {説明}
globs: ['**/*.{ts,astro}']  # 適用対象
enabled: true
alwaysApply: false  # true なら常時有効
type: agent-skill  # または skill
---

# {Agent 名}

[内容]
```

- [ ] が使用するすべての `.github/agents/` ファイルで確認

### 10. MCP 設定（`.github/` 向け、または GitHub Copilot 側の設定）

Copilot で Serena MCP を使用したい場合:

- [ ] GitHub Copilot の MCP 設定面で Serena を登録
  - または Copilot CodeSpace / Dev Container で MCP を有効化
  
**確認**: Copilot が「Serena を使う」旨の表示が出るか確認

---

## Phase 5: テストと検証

### 11. 実装後の動作確認

**テスト項目**:

- [ ] Copilot で `.github/agents/sdd.md` がドロップダウンに表示されるか
- [ ] `/sdd` で称号が発動するか（または UI で選択可能か）
- [ ] `src/**/*.ts` を編集したとき `.github/instructions/typescript.instructions.md` が自動提案されるか
- [ ] AGENTS.md 更新後、同期スクリプト実行で `copilot-instructions.md` が更新されるか
- [ ] GitHub Actions Workflow が PR 時に自動実行されるか

### 12. クロスツール整合性チェック

- [ ] AGENTS.md の内容が正確に Claude Code でも Copilot でも適用されているか
- [ ] `.agent/skills/` と `.github/agents/` で同等の動作が実現されているか
- [ ] エラーを超過したときの出力フォーマットが統一されているか

---

## チェックマーク確認表

完了度を追跡用：

```
Phase 1: 基盤整備
  [ ] copilot-instructions.md 作成
  [ ] .github/agents/ ディレクトリ構築
  [ ] ルール定義

Phase 2: 検証と最適化
  [ ] .github/instructions/ 構築（Optional）
  [ ] CI/CD Workflow 実装
  [ ] 同期スクリプト実装

Phase 3: ドキュメント整備
  [ ] Copilot クイックスタート作成
  [ ] マルチエージェント比較ガイド作成
  [ ] AGENTS.md 拡充

Phase 4: 実装詳細
  [ ] Copilot フォーマット確認
  [ ] MCP 設定確認

Phase 5: テストと検証
  [ ] 実装後動作確認
  [ ] クロスツール整合性チェック

全体進捗: 0/18
```

---

## 補足：実装時のTemplate

### `copilot-instructions.md` の最小テンプレート

```markdown
# GitHub Copilot 用指示ファイル

## 言語設定

必ず日本語で回答してください。

## プロジェクト概要

このプロジェクトは Astro（TypeScript）によるブログサイトです。
詳細は [AGENTS.md](./AGENTS.md) を参照してください。

## 基本ルール

- パッケージマネージャー: `pnpm`
- 開発ガイドライン: `docs/coding-guidelines/`
- テスト: `Vitest`, `Playwright`

[AGENTS.md より引用…]
```

### `.github/agents/sdd.md` の移植テンプレート

```markdown
---
name: sdd
description: 仕様駆動開発（Specification-Driven Development）を支援
globs: ['**']
alwaysApply: false
---

# SDD (Specification-Driven Development) Agent

Kiro スタイルの仕様駆動開発をサポートします。

## 使用コマンド

- `/sdd init {feature-name}`: 新仕様初期化
- `/sdd requirements {feature}`: 要件定義
- `/sdd design {feature}`: 設計策定
- `/sdd tasks {feature}`: タスク分解

[詳細は AGENTS.md → `.agent/skills/sdd/SKILL.md` を参照…]
```

---

実装進捗を追跡するため、このチェックリストをプロジェクトの Issue またはプロジェクトボードと連携させることを推奨します。
