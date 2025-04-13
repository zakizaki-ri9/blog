# Zaki Blog

個人的なブログサイトです。

## 開発環境

- Astro
- TypeScript
- Vercel

## 機能

- ブログ投稿
- タグでの分類
- RSS配信
- 記事検索機能（PageFind使用）

## 検索機能について

[PageFind](https://pagefind.app/)を利用した静的サイト検索機能を実装しています。

- Markdownの`frontmatter`（title, description, tags）
- 記事の見出しや本文

などを検索対象としています。ビルド時に自動的にインデックスが生成されます。

## 開発

```bash
# 開発サーバーの起動
pnpm run dev

# ビルド
pnpm run build

# ビルドしたサイトのプレビュー
pnpm run preview
```
