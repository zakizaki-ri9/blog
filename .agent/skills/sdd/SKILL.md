---
name: sdd
description: cc-sdd を使った仕様駆動開発（Specification-Driven Development）を支援するスキル
---

# Specification-Driven Development (SDD) Skill

このスキルは、cc-sdd（Claude Code Spec-Driven Development）ツールを活用し、Kiro スタイルの仕様駆動開発プロセスを実行します。

## 前提条件

- cc-sdd がセットアップ済み（`.gemini/commands/kiro/` にコマンドが配置されている）
- `.kiro/steering/` にプロジェクト全体の指針ドキュメントが存在する

## ワークフロー

### Phase 0: Steering（プロジェクト指針）の確認・更新

既存プロジェクトの場合、まず Steering ドキュメントを確認します。

1. **Steering の確認**
   ```bash
   ls .kiro/steering/
   ```
   - `product.md`: プロダクトの概要と価値提案
   - `tech.md`: 技術スタック
   - `structure.md`: プロジェクト構造

2. **必要に応じて Custom Steering を追加**
   - API 規約、認証、データベース、デプロイ、エラーハンドリング、セキュリティ、テストなど

### Phase 1: 仕様策定

> [!IMPORTANT]
> **要件の明確化プロセス**
>
> 仕様策定の各段階で、以下のプロセスを必ず実施してください：
>
> 1. **不明瞭な要件の確認**
>    - 要件に不明瞭な点、推測・検討が必要な点がある場合、必ず開発者（ユーザー）に確認する
>    - 「これは推測に基づく提案です」と明記し、推測範囲を明確化
>
> 2. **調査・検討時のリソース参照**
>    - 推測・検討を依頼された際は、極力**最新**かつ**日本語**の事例を検索・参考とする
>    - `search_web` ツールを活用し、公式ドキュメントや信頼できる技術ブログを優先
>
> 3. **証跡の提示**
>    - 推測・検討した際に参照したリソースの **URL** と **該当文章（引用）** を証跡として提示
>    - ソースなき提案は「独自提案」と明記し、慎重な判断を促す
>
> **参照**: `.agent/rules/rules.md` Section 8: 提案と情報の信頼性

#### Step 1: 仕様の初期化

新しい機能を実装する際は、まず仕様ディレクトリを作成します。

```bash
mkdir -p .kiro/specs/{feature-name}
```

#### Step 2: spec.json の作成

仕様のメタデータを定義します。

```json
{
  "language": "ja",
  "feature": "{feature-name}",
  "description": "{機能の簡潔な説明}",
  "status": "requirements",
  "created": "{YYYY-MM-DD}",
  "updated": "{YYYY-MM-DD}",
  "phases": {
    "requirements": "in-progress",
    "design": "pending",
    "tasks": "pending",
    "implementation": "pending"
  }
}
```

#### Step 3: 要件定義（requirements.md）

EARS フォーマット（Event-Action-Response-System）を使用して要件を定義します。

**テンプレート**: `.kiro/settings/templates/specs/requirements.md`

**主要セクション**:
- Introduction: 機能の目的と設計思想
- Requirements: 各要件を番号付きで記述
  - Objective: ユーザーストーリー形式（As a X, I want Y, so that Z）
  - Acceptance Criteria: EARS フォーマットで受け入れ基準を記述
    - `When [event], the [system] shall [response/action]`
    - `If [trigger], then the [system] shall [response/action]`

**完了条件**:
- 全ての機能要件が明確に定義されている
- 非機能要件（パフォーマンス、セキュリティ、コスト）が含まれている

#### Step 4: 設計（design.md）

設計書を作成し、要件を具体的なアーキテクチャとコンポーネントに落とし込みます。

**テンプレート**: `.kiro/settings/templates/specs/design.md`

**主要セクション**:
- Overview: 目的、ユーザー、影響範囲
- Architecture: パターン選定、技術スタック、システムフロー（Mermaid 図）
- Requirements Traceability: 要件とコンポーネントのマッピング
- Components and Interfaces: 詳細なコンポーネント設計
- Data Models: ドメインモデル、論理/物理データモデル
- Error Handling: エラー戦略とカテゴリ
- Testing Strategy: ユニット、統合、E2E テストの計画

**完了条件**:
- アーキテクチャ図が Mermaid で可視化されている
- 全ての要件がコンポーネントにマッピングされている
- データモデルとAPI仕様が明確に定義されている

#### Step 5: タスク分解（tasks.md）

実装タスクを依存関係を考慮して分解します。

**テンプレート**: `.kiro/settings/templates/specs/tasks.md`

**主要セクション**:
- Task Format: フェーズごとにタスクを階層化
  - `- [ ] X. Major Task`
  - `- [ ] X.Y Sub Task`
  - Detail bullets（詳細説明）
  - `_Requirements: X, Y_`（関連要件）
- Parallel marker: `(P)` を並列実行可能なタスクに付与
- Dependency graph: Mermaid 図でタスク依存関係を可視化

**完了条件**:
- 全ての実装タスクが洗い出されている
- タスクの依存関係が明確
- 各タスクに関連要件が紐付いている

### Phase 2: 実装計画の承認

仕様策定が完了したら、`implementation_plan.md` をアーティファクトとして作成し、ユーザーに承認を依頼します。

**implementation_plan.md の構成**:
- 概要
- 設計アプローチ
- User Review Required（重要な判断事項）
- Proposed Changes（コンポーネントごとの変更内容）
- Verification Plan（検証計画）
- 実装順序

**承認依頼**:
```
notify_user で以下を設定:
- PathsToReview: implementation_plan.md, requirements.md, design.md, tasks.md
- BlockedOnUser: true
- ShouldAutoProceed: false（重要な設計判断が必要な場合）
```

### Phase 3: 実装（Implementation）

ユーザーの承認後、EXECUTION モードに移行して実装を進めます。

**実装時の原則**:
- tasks.md の順序に従って実装
- 各タスク完了後、spec.json と task.md を更新
- コミットは適切な粒度で分割（`/commit` スキル使用）
- E2E テストは実装と並行して作成

## spec.json のステータス管理

各フェーズ完了時に `spec.json` を更新します。

```json
{
  "status": "requirements" | "design" | "tasks" | "implementation" | "complete",
  "phases": {
    "requirements": "in-progress" | "complete",
    "design": "pending" | "in-progress" | "complete",
    "tasks": "pending" | "in-progress" | "complete",
    "implementation": "pending" | "in-progress" | "complete"
  }
}
```

## ディレクトリ構造の例

```
.kiro/
├── settings/           # cc-sdd 設定とテンプレート
├── steering/          # プロジェクト全体の指針
│   ├── product.md
│   ├── tech.md
│   └── structure.md
└── specs/             # 個別機能の仕様
    └── {feature-name}/
        ├── spec.json
        ├── requirements.md
        ├── design.md
        └── tasks.md
```

## 注意事項

> [!IMPORTANT]
> **言語設定**
> - 思考は英語、出力は日本語（Gemini.md のルールに従う）
> - requirements.md, design.md, tasks.md は全て日本語で記述

> [!IMPORTANT]
> **要件の明確化と証跡提示**
> - 不明瞭な要件は必ずユーザーに確認すること
> - 推測・検討時は最新の日本語リソースを優先的に参照
> - 参照したリソースの URL と該当文章を証跡として提示（特に技術選定、アーキテクチャ決定時）
> - 詳細は Phase 1 冒頭の「要件の明確化プロセス」を参照

> [!WARNING]
> **承認プロセスの厳守**
> - 各フェーズで必ずユーザーのレビューを経ること
> - `-y` フラグによるファストトラックは、明示的な指示がある場合のみ

> [!CAUTION]
> **implementation_plan.md の重要性**
> - 実装の全体像を示す最も重要なドキュメント
> - User Review Required セクションで判断事項を明確に提示
- Breaking Changes や設計上の重要な決定は必ず記載

## 既存の Skill/Workflow との連携

- `/review`: 実装後のコード品質チェック
- `/branch`: 機能ブランチの作成
- `/commit`: 適切なコミットメッセージでコミット
- `/pr`: プルリクエストの作成
- `/all-commit`: Review → Branch → Commit → PR の一連の流れ

SDD Skill は、これらの既存 Workflow の**前段階**として機能し、実装前の設計フェーズを充実させます。
