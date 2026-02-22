# Phase 1: 検索機能追加

## 概要

現行構成（Vercel）のまま、Pagefind による記事検索機能を追加する。

## ステータス

- [x] Pagefind 導入
- [x] 検索UIコンポーネント作成
- [x] Header に検索ボタン追加
- [x] ビルドスクリプト更新
- [x] 動作確認

## 技術詳細

### パッケージ

- `pagefind` — ビルド時インデックス生成
- `astro-pagefind` — Astro 統合（開発時のプロキシ対応）

### ビルドスクリプト

```jsonc
// package.json
{
  "scripts": {
    "build": "astro build",
    "postbuild": "pagefind --site dist"
  }
}
```

### 検索UIコンポーネント

`src/components/Search.astro` を作成し、Pagefind の検索 UI をラップする。

### Header 変更

`src/components/Header.astro` に検索ボタン/リンクを追加。

## 検証方法

```bash
# ビルド確認
pnpm build

# インデックス生成確認
ls dist/pagefind/

# プレビューで検索動作確認
pnpm preview
```

- ブラウザで検索UIの動作を目視確認
- 既存E2Eテストが通ることを確認
