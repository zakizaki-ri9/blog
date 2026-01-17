# 実装計画

## タスクリスト

- [x] 1. LinkCardコンポーネントの改修 (P)
  - `src/components/LinkCard.astro` の `Props` インターフェースを更新し、`title`, `description` をオプショナルプロパティとして追加する
  - `src/utils/ogp.ts` のインポートと `getOgpData` の呼び出しを削除する
  - 外部メタデータ（`favicon`, `ogpData.image`）への依存を削除し、関連するマークアップを削除する
  - URLからドメイン名を抽出するロジックを追加する（`new URL(url).hostname`）
  - `title` が提供されない場合のフォールバック表示（ドメイン名またはURL）を実装する
  - 新しいテキストベースのレイアウトに合わせてCSSを調整する
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 3.1, 3.2_

- [x] 2. 不要な依存関係の削除
  - `src/utils/ogp.ts` ファイルを削除する
  - `package.json` から `cheerio` などの不要になった依存ライブラリをアンインストールする
  - プロジェクト全体のビルドとLintが通ることを確認する
  - _Requirements: 1.1, 1.2_

- [x] 3. 動作確認と検証
  - 既存のブログ記事ページでのLinkCard表示を確認する（URLのみの場合）
  - 新規記事ページで `title`, `description` を指定した場合の表示を確認する
  - _Requirements: 3.1, 3.2_
