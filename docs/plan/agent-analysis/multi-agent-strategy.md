# 複数エージェント対応戦略：Antigravity / Gemini / Copilot

## 現状分析

### 1. 現在のプロジェクト構成

| 層 | Antigravity (Claude Code) | Gemini CLI | Cursor | GitHub Copilot |
|---|---|---|---|---|
| **全体指示** | `claude.md` | `Gemini.md` | – | `copilot-instructions.md`（未実装） |
| **クロスツール** | `AGENTS.md` | – | – | `AGENTS.md`（共有） |
| **ルール** | `.agent/rules/rules.md` | – | `.cursor/rules/coding.mdc` | 要実装 |
| **スキル/コマンド** | `.agent/skills/` | `.gemini/commands/` | `.cursor/commands/` | `.github/agents/`（未実装） |
| **仕様駆動開発** | `.agent/skills/sdd/` | `.gemini/commands/kiro/` | – | 要検討 |
| **MCP設定** | `.gemini/settings.json` | – | – | 要実装 |

### 2. 参考URL（SIOS Tech Lab）の主要知見

#### 発火条件の違い
- **Claude Code**: ディレクトリ単位。`claude.md` が階層的に継承
- **GitHub Copilot**: ファイル単位。glob pattern で細かく指定（`applyTo: "*.ts"`）
- **Gemini CLI**: コマンド駆動（`/kiro:spec-init` など）

#### 設定ファイルの対応関係（参考表）

```
[全体ルール]
  Claude Code    : CLAUDE.md
  GitHub Copilot : copilot-instructions.md
  Gemini CLI     : Gemini.md

[手動呼び出し]
  Claude Code    : .claude/commands/*.md
  GitHub Copilot : *.prompt.md，/で呼び出し
  Gemini CLI     : /kiro:spec-init など自然言語

[観点切り替え]
  Claude Code    : .claude/skills/*.md
  GitHub Copilot : .github/agents/*.md (ドロップダウン選択)
  Gemini CLI     : コマンド駆動

[条件付き自動適用]
  Claude Code    : ディレクトリ別CLAUDE.md
  GitHub Copilot : *.instructions.md (glob match でファイル編集時発火)
  Gemini CLI     : 仕様駆動（明示的実行）
```

#### 相互運用の可能性
- Claude Code の Skill で `AGENTS.md` を読み込める
- GitHub Copilot の Agent Skill（2025年12月パブリックプレビュー）で `CLAUDE.md` を読み込める
- ディレクトリ構造の類似化（`.github/skills/` ↔ `.claude/skills/`）により相互参照が容易化

---

## 課題と改善戦略

### 課題 A: エージェント固有の指示ファイルの重複

**現状**:
- `claude.md`: Claude Code 専用
- `Gemini.md`: Gemini CLI 専用
- `copilot-instructions.md`: 未実装
- `AGENTS.md`: クロスツール標準（ベンダー中立）

**問題**:
- 同じコンテンツが複数ファイルに分散
- 更新時に複数ファイルを手動修正する手間
- ツール間でニュアンスの違い生じやすい

**改善案（推奨）**:

#### Step 1: 共通指示の一本化（AGENTS.md 中心化）

`AGENTS.md` を「唯一の指示源」として使用：

1. **AGENTS.md の充実**
   - 現在の内容を保持（言語設定、TDDルール、開発ガイドライン）
   - エージェント固有の差分を明示（セクション「エージェント別対応」）

2. **claude.md, Gemini.md, copilot-instructions.md の簡潔化**
   ```markdown
   # claude.md
   # Claude Code 用指示ファイル
   
   詳細なルールは [AGENTS.md](./AGENTS.md) を参照してください。
   
   ## Claude Code 固有の設定
   - （Claude Code 専用の設定のみ）
   ```

#### Step 2: ツール別の差分ドキュメント作成

`.agent-config/` ディレクトリを新規作成：

```
.agent-config/
├── STRATEGY.md              ← これを作成（本文書そのもの）
├── multi-agent-matrix.md    ← ツール別機能対応表
├── tool-specific/
│   ├── claude-code.md       ← Claude Code 固有の設定
│   ├── gemini-cli.md        ← Gemini CLI 固有の設定
│   ├── copilot.md           ← Copilot 固有の設定
│   └── cursor.md            ← Cursor 固有の設定
└── migration-checklist.md   ← 各ツール対応実装チェックリスト
```

---

### 課題 B: Copilot 対応の未実装

**参考URL からの抽出**:
- GitHub Copilot は `copilot-instructions.md`, `.github/agents/`, `.github/skills/` をサポート
- glob pattern（`*.instructions.md`）でファイル単位の条件付き指示が可能
- Agent Skills（2025年12月パブリックプレビュー）で `.claude/skills/` とほぼ同等の機能

**実装ロードマップ**:

#### Phase 1: 最小限の Copilot 対応（即実装可能）
```
✓ copilot-instructions.md          : AGENTS.md の概要 + Copilot 固有設定
✓ .github/agents/*.md              : .agent/skills/ の Copilot 版（同期）
? .github/skills/                  : 個別 Agent Skill（2025.12+ 対応予定）
```

#### Phase 2: ツール間の同期自動化（中期）
```
- タスク: `pnpm sync:instructions` でファイル同期
  - AGENTS.md → claude.md, Gemini.md, copilot-instructions.md
  - .agent/skills/ → .github/agents/
- CI/CD: GitHub Actions で定期同期＆lint
```

#### Phase 3: 統一設定フォーマット検討（長期）
```
- すべてのツール用設定を YAML/JSON で定義
- ツール別メタデータで出力ファイルを生成
```

---

### 課題 C: スキル/コマンドの設計の相違

| ツール | ファイル形式 | 発火方式 | 課題 |
|---|---|---|---|
| **Claude Code** | `.md` (SKILL.md) | `/skill-name` 手動 or 自動推論 | 柔軟だが予測困難 |
| **Gemini CLI** | `.toml` (speckit) | `/kiro:command-name` 明示的 | 宣言的。スケーリング性が高い |
| **Cursor** | `.md` (markdown) | `/command-name` 手動 | Claude Code に準拠 |
| **Copilot** | `.md` + `.github/agents/` | ドロップダウン選択 + 自動推論 | 明示的選択可、推論あり |

**改善案**:

1. **Gemini CLI の仕様駆動開発スタイルをベンチマーク化**
   - "（宣言的）コマンド駆動 → SDD ワークフロー" が最も構造化されている
   - 他のツールもこのスタイルに寄せる

2. **スキル定義の統一テンプレート**
   ```markdown
   # .agent/skills/shared-template.md
   
   ---
   name: {skill-name}
   description: {説明}
   trigger: {手動|自動|条件付き|アルウェイズオン}
   tools:
     - read_file
     - grep_search
   ---
   
   # {Skill名}
   
   ## 目的
   ...
   ```

3. **実装時のチェックリスト**
   - `.claude/` の Skill → `.github/agents/` にも同期
   - `.gemini/commands/` の仕様は `.agent-config/commands-mapping.md` で参照可能にする

---

### 課題 D: ルール の合成戦略

**現状**:
- `.agent/rules/rules.md`: Antigravity 全体ルール
- `.cursor/rules/coding.mdc`: Cursor ルール（一部重複）
- Gemini.md 内に混在

**改善案**:

#### 1. Single Source of Truth 化

```
.agent-config/
├── rules-base.md           ← 全エージェント共通ルール
├── rules-matrix.md         ← ツール別ルール対応表
└── tool-specific/
    ├── claude-code-rules.md
    ├── gemini-cli-rules.md
    ├── copilot-rules.md
    └── cursor-rules.md
```

#### 2. テンプレート化

各ツール固有ファイルは自動生成ツールで管理：
```
pnpm generate:rules
  → rules-base.md をテンプレート化するスクリプト
  → .agent/rules/rules.md
  → .cursor/rules/coding.mdc
  → copilot-instructions.md（該当セクション）
```

---

## 実装アクション （優先順位順）

### Phase 1: 基盤整備（1-2日）

- [ ] `.agent-config/` ディレクトリ作成
- [x] `multi-agent-strategy.md` (本文書) を作成・配置
- [ ] `tool-specific/claude-code.md`, `gemini-cli.md`, `copilot.md` テンプレ作成
- [ ] `migration-checklist.md` 作成

### Phase 2: Copilot 最小サポート（2-3日）

- [x] `copilot-instructions.md` を実装
  - AGENTS.md の内容を要約
  - Copilot 固有のセクション追加（発火条件、glob pattern）
  
- [ ] `.github/agents/` ディレクトリ実装
  - `.agent/skills/sdd/SKILL.md` → `sdd.md` に移行
  - `.agent/skills/branch/SKILL.md` → `branch.md` に移行
  - 他のスキルも順次追加

- [ ] `.github/instructions/` 条件付き自動適用ルール設定（Option）
  - 例: `src/**/*.ts.instructions.md` (TypeScript ファイル編集時自動適用)

### Phase 3: 同期自動化（1週間～）

- [ ] `pnpm.json` に sync スクリプト追加
  ```json
  {
    "scripts": {
      "sync:instructions": "node scripts/sync-instructions.js",
      "validate:agents": "node scripts/validate-agents.js"
    }
  }
  ```

- [ ] `scripts/sync-instructions.js` 実装
  ```javascript
  // AGENTS.md → claude.md, Gemini.md, copilot-instructions.md
  // .agent/skills/ → .github/agents/
  ```

- [ ] GitHub Actions Workflow: `.github/workflows/validate-agents.yml`
  - PR 時に指示ファイルの一貫性チェック

### Phase 4: ドキュメント整備（追加 1日）

- [ ] 各ツール向けクイックスタートガイド作成
  - `docs/guides/claude-code-setup.md`
  - `docs/guides/gemini-setup.md`
  - `docs/guides/copilot-setup.md`
  
- [ ] AGENTS.md の「エージェント固有」セクション拡充
  - 各ツールの得意・不得意
  - パフォーマンス特性
  - MCP 対応状況

---

## 推奨： ツール相互運用マトリックス

参考URL に基づく、各ツール間の相互運用可能性：

```
                      Claude Code    Gemini CLI    Cursor         Copilot
AGENTS.md            ✓ 読み込める     △ 参照可      △ 推奨される    ✓ 自動読み込み
CLAUDE.md            ✓ 自動適用       △ 要設定      △ 読み込み可    △ Skill で読み込み
.claude/skills/      ✓ 自動実行       △ 参照可      △ 模倣可        ✓ Agent Skill で実行
SKILL.md             ✓ Claude Native   ✗             △ 模倣          △ 参考程度
.gemini/commands/    ✗                ✓ 宣言的      ✗              △ 参考（手動マッピング）
.cursor/commands/    △ 参考能         ✗             ✓ 自動実行      △ 参考能
.github/agents/      △ 参照可         ✗             ✗              ✓ ドロップダウン選択
```

**導き出せる指標**:
- **レガシーツール対応**: `.agent/` (Claude Code) ← 最も機能豊富
- **CLI駆動型**: `.gemini/` (Gemini) ← 最も構造化・宣言的
- **エディタ統合**: `.cursor/`, `.github/` ← UI 統合
- **クロスツール互換**: `AGENTS.md` ← 唯一の標準

---

## 参考資料とポイント

### SIOS Tech Lab の重要な指摘

1. **「ツールは収束している」**
   - 2025年12月、GitHub Copilot Agent Skills (パブリックプレビュー)
   - Claude Code との構造的な類似化（`.github/skills/` ↔ `.claude/skills/`）
   - **結論**: 将来的にはツール間差分が縮小

2. **「必要なのはエージェント + 良い指示ファイル1つ」**
   - 複数のツールを駆使するより、最高の指示ファイルを1つ作る方が効果的
   - ツール選択は「得意分野」に応じて使い分け
   
3. **「発火条件の粒度が異なる」ことが主な相違**
   - Claude Code の「ディレクトリ継承型」vs Copilot の「ファイル単位glob型」
   - 仕様駆動開発との親和性は Gemini CLI が最高

### 本プロジェクトの選択肢

**A. 最小限対応（推奨: 短期）**
- Copilot: `copilot-instructions.md` + `.github/agents/` のみ実装
- 他は現状維持、`AGENTS.md` に統一指示を記載
- コスト低・保守性高

**B. 同期自動化（推奨: 中期）**
- スクリプトで各ツール指示ファイルを自動生成・同期
- CI/CD で検証
- 拡張性向上、更新負荷軽減

**C. 統一メタデータ駆動（検討: 長期）**
- YAML/JSON で統一メタデータ定義
- ツール別出力ファイルを動的生成
- 最高の保守性・拡張性
- 導入コスト大

---

## 結論

### 即座に実装すべき施策

1. **`.agent-config/` ディレクトリを作成**
   - 本ドキュメント（`STRATEGY.md`）を配置
   - ツール別ガイドテンプレートを配置

2. **`copilot-instructions.md` を作成**
   - `AGENTS.md` の内容を要約
   - Copilot 固有の設定を追加

3. **`.github/agents/` を構築**
   - `.agent/skills/sdd/`, `.agent/skills/branch/` などを Copilot 向けに移植

### 中期的な改善（次のリレー）

4. **CLI 同期スクリプト** (`pnpm sync:instructions`)
5. **GitHub Actions での定期検証**

### 長期的な検討事項

6. **メタデータ駆動型への段階的移行**
   - ツール選定状況に応じて漸進的に採用

---

## 参考URL

- 本検討の基盤: https://tech-lab.sios.jp/archives/51033
- Claude Code ドキュメント: https://docs.anthropic.com/en/docs/claude-code
- GitHub Copilot Agent Skills: https://docs.github.com/en/copilot/concepts/agents/about-agent-skills
- AGENTS.md 標準: https://agents.md/
