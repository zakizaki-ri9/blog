<!--
Sync Impact Report:
- Version change: 0.0.0 -> 1.0.0
- Added Principles: 静的ファースト (Static First), 型安全性 (Type Safety), パフォーマンス (Performance), コンテンツ中心 (Content-Centric), コード品質 (Code Quality)
- Templates requiring updates: .specify/templates/plan-template.md (Constitution Check section updated)
-->

# zaki-blog 規約 (Constitution)

## 基本原則 (Core Principles)

### I. 静的ファースト (Static First)
サイトは主に静的コンテンツです。デフォルトでは静的サイト生成 (SSG) を使用してください。サーバーサイドレンダリング (SSR) は、動的機能のために厳密に必要な場合にのみ使用してください。ビルド時の生成を優先します。

### II. 型安全性 (Type Safety)
すべてのコードは TypeScript で記述されなければなりません。`any` 型の使用は避け、厳密な型定義を行ってください。コンテンツスキーマ (Astro Content Collections) は厳密に型付けされなければなりません。コミット前に `pnpm type-check` が通過する必要があります。

### III. パフォーマンス (Performance)
クライアントサイドの JavaScript を最小限に抑えてください。インタラクティブ性が必要な場合は、Astro の「アイランドアーキテクチャ」を使用して分離してください。画像は最適化し、Lighthouse スコアを高く維持することを目標とします。

### IV. コンテンツ中心 (Content-Centric)
実装はコンテンツを提供するために存在します。ブログ記事の主要フォーマットは MDX です。コンポーネントは、コンテンツ作成者が容易に使用できるように設計してください。

### V. コード品質 (Code Quality)
ESLint ルールを遵守してください。コミットメッセージはセマンティックコミット (feat, fix, docs, etc.) に従ってください。テスト (ある場合) はコード変更と共に維持・更新してください。

## 技術スタックと制約 (Technical Stack & Constraints)

### 推奨技術
- **フレームワーク**: Astro v5+
- **言語**: TypeScript, MDX
- **スタイル**: Global CSS (または必要に応じて Tailwind/Scoped CSS)
- **デプロイ**: Vercel

### 制限事項
- 重い UI ライブラリ (React/Vue 等) の無用な導入は避ける。標準の Web Components や Astro コンポーネントを優先する。
- 外部 API への依存はビルド時に解決することを推奨する。

## 開発プロセス (Development Process)

### 品質ゲート
1. **Lint**: `pnpm lint` が警告なしで通過すること。
2. **Type Check**: `pnpm type-check` がエラーなしで通過すること。
3. **Build**: `pnpm build` が正常に完了すること。

## ガバナンス (Governance)

この憲法は、プロジェクトの技術的な意思決定における最高規則です。
修正には、理由を文書化し、チーム (またはオーナー) の承認が必要です。
新しい機能やライブラリの導入は、この憲法の原則に照らして評価されなければなりません。

**Version**: 1.0.0 | **Ratified**: 2026-01-12 | **Last Amended**: 2026-01-12