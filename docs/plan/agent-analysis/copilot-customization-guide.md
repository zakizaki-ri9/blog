# エージェント別ガイド: Copilot 向けのカスタマイズ方針

## 概要

このドキュメントは、現在のプロジェクト構成（Antigravity + Gemini CLI）に **GitHub Copilot** を追加導入する際のカスタマイズ方針をまとめています。

参考資料: [SIOS Tech Lab: Claude Code → GitHub Copilot移行ガイド](https://tech-lab.sios.jp/archives/51033)

---

## 1. GitHub Copilot の特性と対応方針

### Copilot の設計哲学

| 項目 | Claude Code | GitHub Copilot |
|---|---|---|
| **制御の主体** | エージェント自律的 | 開発者が常に主導権を持つ |
| **確認スタイル** | 連続処理（一気に進む） | 断続的（確認を挟む） |
| **指示の粒度** | ディレクトリ単位 | ファイル単位（glob） |
| **設定ファイル** | `claude.md`, `.claude/` | `copilot-instructions.md`, `.claude/skills/` |

### 導き出される対応方針

**Copilot の得意分野を活かす**:
1. **段階的なタスク分解**が得意
   - 仕様駆動開発（SDD）の各フェーズを「コマンド選択」で実行
   - `.claude/skills/` に SDD スキルを配置

2. **ファイル単位の条件付き自動提案**が得意
   - `copilot-instructions.md` 内で TypeScript, Astro など用途別セクションを管理
   - ルールは必要時に追記して段階的に拡張

3. **UI 統合による発見性**が高い
   - Agent Skills がドロップダウンで可視化
   - コマンド呼び出しより直感的

**対する課題**:
- 複雑な自動推論は期待しずらい
- ワークフロー全体の自律的管理は限定的

---

## 2. 具体的なカスタマイズ案

### 案 A: 最小限対応（推奨・低コスト）

**ファイル構成**:
```
blog/
├── copilot-instructions.md          ← AGENTS.md を簡潔にまとめたもの
└── .claude/skills/
   ├── sdd/SKILL.md                 ← Spec-Driven Development
   ├── branch/SKILL.md              ← ブランチ操作
   ├── commit/SKILL.md              ← コミット作成
   ├── pr/SKILL.md                  ← PR 作成・管理
   └── review/SKILL.md              ← PR レビュー
```

**実装内容**:

1. **`copilot-instructions.md`** (200行程度)
   ```markdown
   # GitHub Copilot 用指示
   
   ## 言語・基本設定
   - 日本語で回答
   - pnpm 使用
   
   ## ツール・MCP
   - Serena MCP: コード分析時に活用
   - GitHub MCP: PR/Issue 操作時に活用
   
   ## エージェント Agent
   - `.claude/skills/` に Spec-Driven Development など配置
   - ドロップダウンから選択して利用
   
   詳細は [AGENTS.md](./AGENTS.md) 参照。
   ```

2. **`.claude/skills/*/SKILL.md`** (各 100-200行)
   - `.agent/skills/` の Markdown 版を配置
   - GitHub Copilot Agent Skills の Frontmatter 追加
   - コマンド形式を調整（`/kiro:spec-init` → `Spec-Driven Development Agent から実行`）

**メリット**:
- 実装コスト低（1-2日）
- 既存 Claude Code ワークフロー維持
- Copilot ユーザーも同じ指示ソース（AGENTS.md）を参照

**デメリット**:
- ファイル更新が手動（重複管理）
- Copilot ネイティブ機能の活用が限定的

---

### 案 B: 同期自動化対応（推奨・中期）

**追加ファイル構成**:
```
blog/
├── scripts/
│   ├── sync-instructions.js         ← 指示ファイル同期スクリプト
│   └── validate-agents.js           ← バリデーションスクリプト
├── .github/workflows/
│   └── validate-agent-files.yml     ← CI/CD: PR時に検証
└── docs/
    └── guides/
        └── copilot-setup.md         ← Copilot セットアップガイド
```

**実装内容**:

1. **同期スクリプト** (`scripts/sync-instructions.js`)
   ```javascript
   // AGENTS.md → claude.md, Gemini.md, copilot-instructions.md
   // .agent/skills/ → .claude/skills/
   ```

2. **CI/CD Workflow** (`.github/workflows/validate-agent-files.yml`)
   ```yaml
   name: Validate Agent Instructions
   on: [pull_request]
   jobs:
     validate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - run: pnpm sync:instructions --validate
   ```

3. **セットアップガイド** (`docs/guides/copilot-setup.md`)
   - Copilot インストール
   - 設定方法
   - `.claude/skills/` の利用方法

**メリット**:
- 更新負荷軽減（自動同期）
- CI/CD で検証
- 拡張性向上
- ツール追加時の対応が容易

**デメリット**:
- スクリプト実装コスト（数日）
- Node.js 環境依存

---

### 案 C: 統一メタデータ駆動（検討・長期）

**ファイル構成**:
```
blog/
├── .agent-config/
│   ├── agents.yml                   ← 統一メタデータ定義
│   └── rules.yml
├── scripts/
│   └── generate-agent-files.js      ← メタデータから各種ファイル生成
└── generated/                       ← 生成されたファイル
    ├── claude.md
    ├── Gemini.md
    ├── copilot-instructions.md
    ├── .agent/skills/
    ├── .claude/skills/
    └── ...
```

**実装内容**:

1. **統一メタデータ** (`.agent-config/agents.yml`)
   ```yaml
   agents:
     sdd:
       name: Specification-Driven Development
       description: 仕様駆動開発
       tools: [read_file, grep_search]
       trigger: manual
       content: |
         # SDD Agent
         [長いコンテンツ]
   ```

2. **生成スクリプト** (`scripts/generate-agent-files.js`)
   - メタデータを解析
   - ツール別フォーマットで YAML, JSON, Markdown を生成

**メリット**:
- 最高の保守性
- 新ツール追加時の効率性
- DRY 原則に完全準拠

**デメリット**:
- 実装コスト大（1-2週間）
- メタデータ標準の定義が必要
- 過度な設計の可能性

---

## 3. 実装ロードマップ（推奨スケジュール）

### Week 1: 基盤整備（案 A）

**目標**: Copilot でプロジェクト開発開始可能な状態

- Day 1:
  - `copilot-instructions.md` 作成
  - `.claude/skills/sdd/SKILL.md` 作成（`.agent/skills/sdd/SKILL.md` から移植）

- Day 2:
   - `.claude/skills/branch/SKILL.md`, `commit/SKILL.md`, `pr/SKILL.md`, `review/SKILL.md` 作成
  - Copilot で試し利用・フィードバック

**チェックポイント**:
- [ ] Copilot でドロップダウンに Agent が表示される
- [ ] Agent 選択で基本的なワークフロー実行可能

### Week 2: 最適化（案 B への段階移行）

**目標**: 複数ツール間の指示ファイル自動同期

- Day 3-4:
  - `scripts/sync-instructions.js` 実装
  - CI/CD Workflow 実装

- Day 5:
  - `docs/guides/copilot-setup.md` 作成

**チェックポイント**:
- [ ] `pnpm sync:instructions` で自動同期可能
- [ ] PR 時に GitHub Actions が自動検証

### Week 3-4: ドキュメント整備・長期検討

- `docs/guides/multi-agent-comparison.md` 作成
- 案 C（メタデータ駆動）の可行性検討
- ユーザーフィードバック反映

---

## 4. ツール別設定の相違点表

Copilot へカスタマイズする際の確認表：

| 設定項目 | Claude Code | Copilot | 対応方法 |
|---|---|---|---|
| **全体指示** | `claude.md` | `copilot-instructions.md` | 内容を共通化、差分を別ファイルで管理 |
| **スキル/Agent** | `.claude/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` | 共通の Skill 定義を利用 |
| **ファイル別ルール** | ディレクトリ単位 | `copilot-instructions.md` のセクション分割 | 必要に応じてルールを追記 |
| **自動実行** | `claude.md` で常時 | `applyTo` glob で条件付き | 発火条件を明示的に定義 |
| **コマンド発動** | `/skill-name` | ドロップダウン選択 or `/` コマンド | UI 統合を活用 |
| **MCP 設定** | `.gemini/settings.json` | GitHub Copilot の設定画面 | ツール側で管理 |

---

## 5. よくある質問（FAQ）

### Q1: AGENTS.md はどうするか？

**A**: AGENTS.md を「唯一の指示源」として保持してください。

```markdown
# AGENTS.md
## 全エージェント共通ルール
[共通内容]

## エージェント別対応
### Claude Code
- ...
### Gemini CLI
- ...
### GitHub Copilot
- `.claude/skills/` を使用
- `copilot-instructions.md` を参照
```

### Q2: Copilot と Claude Code の指示の内容を変えるべきか？

**A**: コア部分（言語、基本ルール、TDD）は共通化し、ツール固有の機能差分（MCP、発火条件）だけ異なるようにしてください。

### Q3: 条件付き自動提案ルールは必須か？

**A**: オプショナルです。案 A では不要。案 B で、ファイル拡張子別（TypeScript, Astro）に指示を分岐したい場合に有用です。

### Q4: Copilot で Serena MCP は使える？

**A**: GitHub Codespaces / Dev Container で MCP 対応すれば可能です。フローティングで実装してください。

### Q5: スクリプト同期で失敗したら？

**A**: CI/CD Workflow（案 B）で検証します。PR 時に自動チェック。失敗したら修正指示。

---

## 6. リスクと緩和策

| リスク | 影響 | 緩和策 |
|---|---|---|
| ファイル重複で不整合 | Copilot で古い指示を使う | 自動同期スクリプト（案 B） |
| Copilot ネイティブ機能の未活用 | 本来の利便性が低い | ドキュメント・ガイド作成で周知 |
| 新ツール追加時の対応負荷 | 保守負荷増加 | メタデータ駆動（案 C）への段階移行 |
| MCP 設定の複雑性 | セットアップ難 | クイックスタートガイド整備 |

---

## 7. 次のステップ

### 即座に（今週中）
- [ ] `.agent-analysis/multi-agent-strategy.md` をチームで共有・レビュー
- [x] 案 A / B / C のいずれかを決定

### Week 1（案 A 実装）
- [x] `copilot-instructions.md` 作成着手
- [ ] `.claude/skills/` ディレクトリ構築

### Week 2 以降
- [ ] CI/CD Workflow 追加（案 B）
- [ ] ドキュメント整備
- [ ] ユーザー教育

---

## 参考リソース

- **SIOS Tech Lab**: https://tech-lab.sios.jp/archives/51033
- **GitHub Copilot Agent Skills**: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- **Claude Code ドキュメント**: https://docs.anthropic.com/en/docs/claude-code
- **Agents.md Standard**: https://agents.md/

---

## 本ドキュメントの管理

- **最終更新**: 2026-02-28
- **責任者**: チーム
- **次回レビュー**: 実装開始後 1 週間
