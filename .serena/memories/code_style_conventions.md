# コードスタイルと規約

## TypeScript設定
- 厳密な型チェック（strictNullChecks: true）
- パスエイリアス: `@/*` → `src/*`
- Astroのstrict設定を継承

## ESLint設定
- **インデント**: 2スペース
- **クォート**: ダブルクォート
- **セミコロン**: 必須
- **カンマ**: マルチラインでは必須
- **ブレーススタイル**: 1tbs
- **オブジェクトの波括弧**: スペース必須
- **演算子周り**: スペース必須
- **カンマ周り**: 後ろにスペース必須

## ファイル構造
- `src/components/`: Astroコンポーネント
- `src/layouts/`: ページレイアウト
- `src/pages/`: ページルーティング
- `src/content/`: コンテンツ（MDX/Markdown）
- `src/styles/`: グローバルスタイル
- `src/utils/`: ユーティリティ関数
- `src/config/`: 設定ファイル

## 命名規則
- ファイル名: kebab-case
- コンポーネント: PascalCase
- 変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE

## コメント・ドキュメント
- JSDocコメント推奨
- 複雑なロジックには説明コメント