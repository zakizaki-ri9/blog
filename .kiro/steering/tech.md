# 技術スタック

## アーキテクチャ

Astroで構築され、Vercelにデプロイされる静的サイト生成 (SSG)。

## コアテクノロジー

- **言語**: TypeScript
- **フレームワーク**: Astro v5
- **ランタイム**: Node.js (pnpmで管理)
- **スタイリング**: CSS (Global styles)

## 主要ライブラリ

- **@astrojs/mdx**: コンテンツレンダリング
- **satori / @resvg/resvg-js**: サーバーサイドOG画像生成
- **sharp**: 画像処理
- **cheerio**: HTML操作

## 開発標準

### 型安全性
- ロジックとコンポーネントにTypeScriptを使用。
- `pnpm run type-check` (`tsc --noEmit`) による厳格な型チェック。

### コード品質
- `astro-eslint-parser` と `@stylistic/eslint-plugin` で設定されたESLint。
- コマンド: `pnpm run lint`

### テスト & セキュリティ
- `pnpm run security-check` によるセキュリティチェック。
- 統合レビューコマンド: `pnpm run review`。

## 開発環境

### 必須ツール
- pnpm (Corepack enabled 推奨)
- Node.js

### 共通コマンド
```bash
# 開発: pnpm run dev
# ビルド: pnpm run build
# プレビュー: pnpm run preview
# レビュー (Lint+Type+Sec): pnpm run review
```

## 主要な技術的決定

- **Vercel Adapter**: エッジ配信に最適化するため、静的出力用に設定。
- **カスタムインテグレーション**: OG画像生成は `src/integrations/` 内のローカルAstroインテグレーション経由で処理。
- **パスエイリアス**: `@/` はクリーンなインポートのために `/src` にマップ。

---
_すべての依存関係ではなく、標準とパターンを文書化する_