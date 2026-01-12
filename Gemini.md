# AI-DLCと仕様駆動開発 (Spec-Driven Development)

AI-DLC (AI開発ライフサイクル) 上でのKiro流仕様駆動開発の実装

## 使用言語

- 必ず日本語を利用してください。
- 英語の場合は日本語に訳して出力してください。

## プロジェクトコンテキスト

### パス
- ステアリング (Steering): `.kiro/steering/`
- 仕様書 (Specs): `.kiro/specs/`

### ステアリング vs 仕様書

**ステアリング** (`.kiro/steering/`) - プロジェクト全体のルールとコンテキストでAIを導く
**仕様書** (`.kiro/specs/`) - 個別機能の開発プロセスを形式化する

### アクティブな仕様書
- `.kiro/specs/` でアクティブな仕様書を確認
- `/kiro:spec-status [feature-name]` で進捗を確認

## 開発ガイドライン
- 思考は英語で行い、応答は日本語で生成してください。プロジェクトファイル（例：requirements.md, design.md, tasks.md, research.md, validation reports）に書き込まれるすべてのMarkdownコンテンツは、この仕様書用に設定されたターゲット言語（spec.json.languageを参照）で記述する必要があります。

## 最小ワークフロー
- フェーズ 0 (任意): `/kiro:steering`, `/kiro:steering-custom`
- フェーズ 1 (仕様策定):
  - `/kiro:spec-init "description"`
  - `/kiro:spec-requirements {feature}`
  - `/kiro:validate-gap {feature}` (任意: 既存コードベース向け)
  - `/kiro:spec-design {feature} [-y]`
  - `/kiro:validate-design {feature}` (任意: 設計レビュー)
  - `/kiro:spec-tasks {feature} [-y]`
- フェーズ 2 (実装): `/kiro:spec-impl {feature} [tasks]`
  - `/kiro:validate-impl {feature}` (任意: 実装後)
- 進捗確認: `/kiro:spec-status {feature}` (いつでも使用可)

## 開発ルール
- 3段階の承認フロー: 要件 (Requirements) → 設計 (Design) → タスク (Tasks) → 実装 (Implementation)
- 各フェーズで人間のレビューが必要; `-y` は意図的なファストトラックの場合のみ使用
- ステアリングを最新に保ち、`/kiro:spec-status` で整合性を確認
- ユーザーの指示に正確に従い、その範囲内で自律的に行動する: 必要なコンテキストを収集し、この実行内で要求された作業をエンドツーエンドで完了させる。質問は、重要な情報が欠落している場合や指示が致命的に曖昧な場合にのみ行う。

## ステアリング設定
- `.kiro/steering/` 全体をプロジェクトメモリとしてロード
- デフォルトファイル: `product.md`, `tech.md`, `structure.md`
- カスタムファイルもサポート (`/kiro:steering-custom` で管理)