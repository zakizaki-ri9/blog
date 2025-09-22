# プロジェクト構造

## ディレクトリ構成
```
src/
├── components/          # Astroコンポーネント
│   ├── BaseHead.astro  # HTML head要素
│   ├── Header.astro    # ヘッダーコンポーネント
│   ├── FormattedDate.astro # 日付フォーマット
│   └── ...
├── layouts/            # ページレイアウト
│   └── BlogPost.astro  # ブログ記事レイアウト
├── pages/              # ページルーティング
│   ├── index.astro     # トップページ
│   ├── blog/           # ブログ記事ページ
│   ├── tags/           # タグページ
│   └── tils/           # TILページ
├── content/            # コンテンツ管理
│   ├── blog/           # ブログ記事（MDX）
│   └── pages/          # 静的ページ（MDX）
├── styles/             # グローバルスタイル
│   └── global.css
├── utils/              # ユーティリティ
│   ├── generateOgImage.ts
│   ├── ogp.ts
│   └── tags.ts
├── config/             # 設定ファイル
│   └── site.ts
└── integrations/       # Astro統合
    └── og-image.ts
```

## 主要ファイル
- `astro.config.ts`: Astro設定
- `content.config.ts`: コンテンツコレクション設定
- `tsconfig.json`: TypeScript設定
- `eslint.config.js`: ESLint設定
- `package.json`: 依存関係とスクリプト

## コンテンツ管理
- ブログ記事は `src/content/blog/` にMDXファイルで保存
- フロントマターでメタデータを管理
- タグ機能で記事を分類
- TIL記事は特別なタグで管理