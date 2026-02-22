# Phase 3: Cloudflare Pages 移行

## 概要

ホスティングを Vercel から Cloudflare Pages に移行する。

## ステータス

- [ ] `@astrojs/cloudflare` アダプタ導入
- [ ] `@astrojs/vercel` 削除
- [ ] `vercel.json` 削除
- [ ] Cloudflare Pages のGitHub連携設定
- [ ] CI/CD 設定
- [ ] OGP画像生成の動作確認
- [ ] カスタムドメイン設定（必要に応じて）

## 技術詳細

### アダプタ変更

```ts
// astro.config.ts
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare({}),
  // ...
});
```

### Cloudflare Pages 設定

- ビルドコマンド: `pnpm build`
- ビルド出力ディレクトリ: `dist`
- 環境変数: `NODE_VERSION`, `MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY`

### 削除対象

- `vercel.json`
- `@astrojs/vercel`（devDependencies から削除）

### OGP画像生成

現行の satori + sharp による OGP 画像生成が Cloudflare Pages のビルド環境で動作することを確認。
sharp は Node.js ネイティブモジュールのため、ビルド環境の互換性に注意。

## 検証方法

```bash
# ローカルビルド確認
pnpm build

# 既存E2Eテスト実行
pnpm test:e2e
```

- Cloudflare Pages にデプロイ後、全ページ表示確認
- OGP画像の生成・表示確認
- RSS/Sitemap の動作確認
- Lighthouse スコア確認
