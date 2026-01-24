---
description: cc-sdd を使って新機能の仕様を策定し、実装計画を作成します
---

# SDD (Specification-Driven Development) Workflow

このワークフローは、cc-sdd を使用して仕様駆動開発を実行し、実装前に設計を固めます。

## 実行タイミング

- 新しい機能を実装する前
- 既存機能の大幅な変更を行う前
- アーキテクチャに影響する変更を行う前

## 前提条件

- `.kiro/steering/` に Steering ドキュメントが存在すること
- cc-sdd がセットアップ済みであること

## ワークフローステップ

// turbo
### 1. Steering の確認

プロジェクト指針ドキュメントの存在を確認:

```bash
ls .kiro/steering/
```

必要に応じて Steering を更新してください。

### 2. 仕様ディレクトリの作成

機能名（kebab-case）でディレクトリを作成:

```bash
mkdir -p .kiro/specs/{feature-name}
```

> [!IMPORTANT]
> **要件明確化プロセス**
> 
> Step 3 以降の各ステップで、以下を必ず実施してください：
> 1. 要件に不明瞭な点があれば、必ずユーザーに確認する
> 2. 推測・検討時は、最新の日本語リソースを優先的に検索・参照
> 3. 参照したリソースの URL と該当文章を証跡として提示
> 
> 詳細は `.agent/skills/sdd/SKILL.md` Phase 1 冒頭を参照。

### 3. 要件定義の作成

`.agent/skills/sdd/SKILL.md` に従って、以下を作成:
- `spec.json`: 仕様のメタデータ
- `requirements.md`: EARS フォーマットで要件を定義

**チェックポイント**:
- [ ] 全ての機能要件が明確に定義されている
- [ ] 非機能要件（パフォーマンス、セキュリティ、コスト）が含まれている
- [ ] ユーザーストーリー形式（As a X, I want Y, so that Z）で記述

### 4. 設計書の作成

`design.md` を作成:
- アーキテクチャ図（Mermaid）
- コンポーネント設計
- データモデル
- API 仕様
- エラーハンドリング
- テスト戦略

**チェックポイント**:
- [ ] アーキテクチャ図が可視化されている
- [ ] 要件とコンポーネントのマッピングが明確
- [ ] データモデルが定義されている

### 5. タスク分解の作成

`tasks.md` を作成:
- フェーズごとのタスク階層
- タスクの依存関係（Mermaid 図）
- 並列実行可能なタスクに `(P)` マーク

**チェックポイント**:
- [ ] 全ての実装タスクが洗い出されている
- [ ] 依存関係が明確
- [ ] 各タスクに要件が紐付いている

### 6. 実装計画書の作成

Artifact として `implementation_plan.md` を作成:
- 概要
- User Review Required（重要な判断事項）
- Proposed Changes
- Verification Plan

### 7. ユーザー承認の依頼

`notify_user` で以下のファイルのレビューを依頼:
- `implementation_plan.md`
- `requirements.md`
- `design.md`
- `tasks.md`

```
BlockedOnUser: true
ShouldAutoProceed: false（重要な設計判断がある場合）
```

### 8. 承認後の実装

ユーザーの承認を得たら、EXECUTION モードに移行して実装を開始:
- `tasks.md` の順序に従って実装
- `/review`, `/commit`, `/pr` などの既存 Workflow を活用

## spec.json のステータス更新

各フェーズ完了時に `spec.json` の `status` と `phases` を更新してください。

## 注意事項

- 思考は英語、出力は日本語（Gemini.md のルールに従う）
- 各フェーズで必ずユーザーのレビューを経ること
- implementation_plan.md では重要な判断事項を明示すること
- **不明瞭な要件は必ずユーザーに確認**し、推測範囲を明確化すること
- **推測・検討時は最新の日本語リソースを参照**し、URL と該当文章を証跡として提示すること

## 関連ドキュメント

- [SDD Skill](./.agent/skills/sdd/SKILL.md)
- [Gemini.md](./Gemini.md)
- [Steering ドキュメント](./.kiro/steering/)
