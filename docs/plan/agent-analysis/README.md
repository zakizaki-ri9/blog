# 複数エージェント対応：分析ドキュメント INDEX

本ディレクトリ（`docs/plan/agent-analysis/`）には、**Antigravity, Gemini, Copilot** の複数エージェントに対応したプロジェクト構成化に関する分析・提案ドキュメントが含まれています。

---

## 📄 ドキュメント一覧

### 1. [multi-agent-strategy.md](./multi-agent-strategy.md) **← 最初に読むべき)**

**内容**: 複数エージェント対応の全体戦略

- 現状分析（Antigravity, Gemini, Cursor, Copilot の比較表）
- 参考URL（SIOS Tech Lab）から抽出した重要知見
- 課題の詳細と改善案（A: 共通指示の一本化 / B: 同期自動化 / C: メタデータ駆動）
- 実装アクション（優先順位付き）
- ツール相互運用マトリックス

**対象読者**: プロジェクト全体の方針を決定する人

**推奨読了時間**: 30分

---

### 2. [copilot-customization-guide.md](./copilot-customization-guide.md) **← Copilot 導入の意思決定向け**

**内容**: GitHub Copilot 導入時のカスタマイズ方針

- Copilot の特性と対応方針
- 3つの実装案（案A: 最小限、案B: 同期自動化、案C: メタデータ駆動）
- スケジュール提案（4週間路線）
- ツール別設定の差分表
- よくある質問（FAQ）
- リスク・緩和策

**対象読者**: 実装方針を決定する技術リーダー

**推奨読了時間**: 20分

---

### 3. [copilot-implementation-checklist.md](./copilot-implementation-checklist.md) **← 実装チェックリスト**

**内容**: Copilot 対応の段階的な実装タスク

- Phase 1: 基盤整備（`copilot-instructions.md`, `.claude/skills/`）
- Phase 2: 検証と最適化（`copilot-instructions.md` ルール拡張, CI/CD Workflow）
- Phase 3: ドキュメント整備
- Phase 4: 実装詳細確認
- Phase 5: テストと検証

各フェーズごとに具体的なチェック項目を記載。

**対象読者**: 実装担当者

**推奨読了時間**: 15分（必要な Phase だけ確認）

---

### 4. [implementation-templates.md](./implementation-templates.md) **← 実装に必要なテンプレート**

**内容**: 実装時に使用するテンプレートとサンプルコード

**含まれるテンプレート**:

1. **Template 1**: `copilot-instructions.md` - GitHub Copilot 用全体指示
2. **Template 2**: `.claude/skills/sdd/SKILL.md` - 仕様駆動開発 Agent
3. **Template 3**: `.claude/skills/branch/SKILL.md` - ブランチ管理 Agent
4. **Template 4**: `.claude/skills/commit/SKILL.md` - Conventional Commit Agent
5. **Template 5**: `.claude/skills/pr/SKILL.md` - PR 管理 Agent
6. **Template 6**: `.claude/skills/review/SKILL.md` - PR レビュー Agent
7. **Script**: `scripts/sync-instructions.js` - 指示ファイル同期スクリプト

各テンプレートは実装ガイド付き。

**対象読者**: 実装担当者

**推奨読了時間**: 実装時に参照

---

## 🎯 ユースケース別ガイド

### パターン A: 全体戦略を理解したい（リーダー向け）

1. **multi-agent-strategy.md** の「現状分析」「課題と改善戦略」を読む
2. **multi-agent-strategy.md** の「実装アクション」で優先順位を確認
3. デジタルホワイトボードで「案 A / B / C」の検討

**推奨所要時間**: 1時間（議論含む）

---

### パターン B: Copilot 導入を決めたい（意思決定向け）

1. **copilot-customization-guide.md** の「Copilot の特性」を読む
2. **copilot-customization-guide.md** の「3つの実装案」を比較検討
3. スケジュール・コスト・効果を判断

**推奨所要時間**: 30分

---

### パターン C: Copilot を実装する（実装担当者向け）

1. **copilot-implementation-checklist.md** で Phase選択（通常は Phase 1 から）
2. **implementation-templates.md** でテンプレートをコピー
3. プロジェクトに合わせてカスタマイズ
4. 各ファイルをプロジェクトルートに配置

**推奨所要時間**: 2-3日（Phase 1）

---

### パターン D: 複数エージェント間の同期を自動化したい

1. **copilot-implementation-checklist.md** の「Phase 2: 検証と最適化」を読む
2. **implementation-templates.md** の「Scripts」セクションでスクリプト確認
3. `scripts/sync-instructions.js` を実装
4. GitHub Actions Workflow を追加

**推奨所要時間**: 1日

---

## 📊 ドキュメント関連図

```
┌─────────────────────────────────────────┐
│   実装の全体俯瞰・戦略決定              │
│  multi-agent-strategy.md                │
│  (現状分析、課題、改善案)               │
└──────────────┬──────────────────────────┘
               │
               ├─→ 案Aを選択 ──→ ┌──────────────────────┐
               │                  │ 最小限対応             │
               │                  │ (1-2日)                │
               │                  └────────────┬───────────┘
               │                               │
               ├─→ 案Bを選択 ──→ ┌──────────────────────────┐
               │                  │ 同期自動化              │
               │                  │ (1週間)                 │
               │                  │copilot-implementation- │
               │                  │checklist.md参照         │
               │                  └────────────┬────────────┘
               │                               │
               └─→ 案Cを検討 ──→ ┌──────────────────────────┐
                                  │ メタデータ駆動 (今後)   │
                                  └──────────────────────────┘
                                  
                                  ↓
                                  
                      ┌────────────────────────┐
                      │実装詳細・テンプレート  │
                      │implementation-         │
                      │templates.md            │
                      │(コピー→カスタマイズ)  │
                      └────────────────────────┘
```

---

## 🔄 読むべき順序

### 短時間（30分）で全体概要を理解

1. **multi-agent-strategy.md** - 「現状分析」セクション
2. **copilot-customization-guide.md** - 「概要」「3つの実装案」

### 詳細を理解するなら（1-2時間）

1. **multi-agent-strategy.md** - 全体
2. **copilot-customization-guide.md** - 全体

### 実装に進むなら（段階的）

1. 上記 2 つを読了
2. **copilot-implementation-checklist.md** - 該当 Phase を確認
3. **implementation-templates.md** - テンプレート適用

---

## 📌 主要なポイント整理

### 現在のプロジェクト構成

| 層 | Antigravity | Gemini | Cursor | Copilot |
|---|---|---|---|---|
| 全体指示 | `claude.md` + `AGENTS.md` | `Gemini.md` | – | `copilot-instructions.md`（実装済み） |
| スキル | `.agent/skills/` | `.gemini/commands/` | `.cursor/commands/` | `.claude/skills/`（実装済み） |
| ルール | `.agent/rules/` | – | `.cursor/rules/` | `AGENTS.md` / `copilot-instructions.md` で適用 |

### Copilot 対応で整備したファイル

```
copilot-instructions.md        ← 全体指示
.claude/skills/sdd/SKILL.md          ← SDD Agent
.claude/skills/branch/SKILL.md       ← ブランチ Agent
.claude/skills/commit/SKILL.md       ← Commit Agent
.claude/skills/pr/SKILL.md           ← PR Agent
.claude/skills/review/SKILL.md       ← Review Agent
```

### 実装案の選択肢（推奨順）

1. **案 A（最小限）**: `copilot-instructions.md` + `.claude/skills/` のみ
   - コスト: **低**（1-2日）
   - 効果: **中**（Copilot で基本的なワークフロー可能）

2. **案 B（同期自動化）**: + スクリプト + CI/CD
   - コスト: **中**（1週間）
   - 効果: **高**（複数ツール間の自動同期）

3. **案 C（メタデータ）**: 統一メタデータ駆動
   - コスト: **高**（数週間）
   - 効果: **最高**（拡張性・保守性最高）

---

## 🚀 次のアクション

### 短期（今週）

- [ ] `multi-agent-strategy.md` をチームで共有
- [x] 案 A / B / C のいずれかを決定
- [ ] 実装リードを決定

### 中期（1-2週間）

- [x] テンプレートをコピー・カスタマイズ
- [x] `copilot-instructions.md` 作成
- [ ] `.claude/skills/` を構築
- [ ] Copilot で試用開始

### 長期（以降）

- [ ] 同期スクリプト実装（案 B）
- [ ] CI/CD 追加
- [ ] メタデータ化検討（案 C）

---

## 📞 質問・相談先

これらのドキュメントについて質問がある場合：

1. `copilot-customization-guide.md` の **FAQ** セクションを確認
2. `multi-agent-strategy.md` の **参考資料** を確認
3. **SIOS Tech Lab** の参考記事を読む

---

## 📝 ドキュメント更新履歴

- **2026-02-28**: 初版作成
  - `multi-agent-strategy.md`
  - `copilot-customization-guide.md`
  - `copilot-implementation-checklist.md`
  - `implementation-templates.md`
  - 本 INDEX

---

## 参考資料

- **主な参考**: https://tech-lab.sios.jp/archives/51033
- **GitHub Copilot Agent Skills**: https://docs.github.com/en/copilot/concepts/agents/
- **Claude Code ドキュメント**: https://docs.anthropic.com/en/docs/claude-code
- **Agents.md Standard**: https://agents.md/

---

**このドキュメントはプロジェクトの意思決定・実装をサポートするための参考資料です。**
**実装時はプロジェクトの実情に合わせてカスタマイズしてください。**
