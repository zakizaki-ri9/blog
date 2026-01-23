# Gemini.md

## 使用言語
必ず日本語を利用してください。
英語の場合は日本語に訳してください。

# AI-DLC と仕様駆動開発 (Spec-Driven Development)

AI-DLC (AI Development Life Cycle) 上での Kiro スタイル仕様駆動開発の実装

## プロジェクトコンテキスト

### パス
- Steering (指針): `.kiro/steering/`
- Specs (仕様): `.kiro/specs/`

### Steering vs Specification

**Steering** (`.kiro/steering/`) - プロジェクト全体のルールとコンテキストでAIを導く
**Specs** (`.kiro/specs/`) - 個別の機能開発プロセスを形式化する

### アクティブな仕様
- `.kiro/specs/` でアクティブな仕様を確認
- `/kiro:spec-status [feature-name]` で進捗を確認

## 開発ガイドライン
- 思考は英語で行い、回答は日本語で生成してください。プロジェクトファイル（例：requirements.md, design.md, tasks.md, research.md, validation reports）に書き込まれるすべてのMarkdownコンテンツは、この仕様に設定されたターゲット言語（spec.json.languageを参照）で記述する必要があります。

## 最小ワークフロー
- Phase 0 (任意): `/kiro:steering`, `/kiro:steering-custom`
- Phase 1 (仕様策定):
  - `/kiro:spec-init "description"`
  - `/kiro:spec-requirements {feature}`
  - `/kiro:validate-gap {feature}` (任意: 既存コードベースの場合)
  - `/kiro:spec-design {feature} [-y]`
  - `/kiro:validate-design {feature}` (任意: デザインレビュー)
  - `/kiro:spec-tasks {feature} [-y]`
- Phase 2 (実装): `/kiro:spec-impl {feature} [tasks]`
  - `/kiro:validate-impl {feature}` (任意: 実装後)
- 進捗確認: `/kiro:spec-status {feature}` (いつでも使用可)

## 開発ルール
- 3段階承認ワークフロー: Requirements (要件) → Design (設計) → Tasks (タスク) → Implementation (実装)
- 各フェーズで人間のレビューが必須; `-y` は意図的なファストトラックの場合のみ使用すること
- Steeringを常に最新に保ち、`/kiro:spec-status` で整合性を確認すること
- ユーザーの指示に正確に従い、その範囲内で自律的に行動すること：必要なコンテキストを収集し、この実行内で要求された作業をエンドツーエンドで完了させること。重要な情報が欠けている場合や指示が致命的に曖昧な場合のみ質問すること。

## Steering 設定
- `.kiro/steering/` 全体をプロジェクトメモリとしてロード
- デフォルトファイル: `product.md`, `tech.md`, `structure.md`
- カスタムファイルもサポート (`/kiro:steering-custom` で管理)

