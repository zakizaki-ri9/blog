---
title: "Astroブログに検索機能を追加しました"
description: "PageFindを使って静的サイトに検索機能を実装した方法について"
pubDate: 2024-09-14
tags: ["Astro", "PageFind", "技術ブログ"]
---

## 検索機能の追加

このブログに検索機能を実装しました！これにより、過去の記事や特定のトピックを簡単に見つけられるようになります。

### 使用技術: PageFind

検索機能の実装には[PageFind](https://pagefind.app/)というライブラリを使用しました。PageFindは静的サイト向けの検索エンジンで、ビルド時に検索インデックスを生成します。JavaScriptのみで動作し、サーバーサイドの処理は不要なので、静的サイトホスティングでも簡単に利用できます。

### 実装方法

#### 1. PageFindのインストール

```bash
pnpm add -D pagefind
```

#### 2. ビルドスクリプトの修正

`package.json`のビルドスクリプトを修正して、ビルド後に自動的にPageFindのインデックスを生成するようにしました。

```json
{
  "scripts": {
    "build": "astro build && npx pagefind --site dist --glob \"**/*.html\" --output-subdir pagefind --force-language ja"
  }
}
```

`--force-language ja`オプションで日本語検索に最適化しています。

#### 3. 検索ページの作成

`src/pages/search.astro`に検索ページを作成し、PageFindの検索UIを実装しました。

```astro
---
import BaseHead from '@/components/BaseHead.astro';
import Header from '@/components/Header.astro';
import { SITE_TITLE, SITE_DESCRIPTION } from '@/consts';
---

<!doctype html>
<html lang="ja">
	<head>
		<BaseHead title={`検索 | ${SITE_TITLE}`} description={SITE_DESCRIPTION} />
		<script is:inline define:vars={{siteTitle: SITE_TITLE}}>
			document.addEventListener('DOMContentLoaded', () => {
				// PageFindスクリプトの読み込み
				const script = document.createElement('script');
				script.src = '/pagefind/pagefind-ui.js';
				document.head.appendChild(script);

				// PageFindスタイルの読み込み
				const link = document.createElement('link');
				link.rel = 'stylesheet';
				link.href = '/pagefind/pagefind-ui.css';
				document.head.appendChild(link);

				// スクリプト読み込み後の初期化
				script.onload = () => {
					// @ts-ignore
					if (typeof window.PagefindUI !== 'undefined') {
						// @ts-ignore
						new window.PagefindUI({ 
							element: '#search',
							translations: {
								placeholder: `${siteTitle}内を検索...`,
							}
						});
					}
				};
			});
		</script>
	</head>
	<body>
		<Header />
		<main>
			<h1>検索</h1>
			<div id="search"></div>
		</main>
	</body>
</html>
```

### 検索対象

PageFindは以下の要素を検索対象としています：

- 記事のタイトル
- 記事の説明（description）
- タグ
- 記事本文（見出しも含む）

### 日本語対応について

PageFindは日本語のステミング（語幹処理）には対応していませんが、基本的な検索機能は問題なく動作します。完全一致ではなく部分一致でも検索できるため、実用上の問題はほとんどありません。

## まとめ

静的サイトジェネレーターを使ったブログでも、PageFindを使えば簡単に検索機能を実装できました。ブログの記事数が増えてきたので、この機能はとても便利だと思います。

皆さんのブログやサイトにも、ぜひ検索機能を追加してみてください！ 