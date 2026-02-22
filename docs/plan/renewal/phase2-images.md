# Phase 2: 画像配信移行（microCMS）

## 概要

記事内画像（OGP除く）を microCMS に移行し、ビルド時にダウンロード → Astro で最適化 → 静的サイトに組み込む。

## ステータス

- [ ] microCMS スペース作成
- [ ] 画像アップロード
- [ ] `microcms-js-sdk` 導入
- [ ] ビルド時画像取得の仕組み構築
- [ ] 記事内画像参照の変更
- [ ] 動作確認

## 技術詳細

### microCMS 設定

- Hobby プラン（無料）で利用
- メディア管理用の API を作成
- 環境変数: `MICROCMS_SERVICE_DOMAIN`, `MICROCMS_API_KEY`

### パッケージ

- `microcms-js-sdk` — microCMS API クライアント

### 画像取得方式

**方式A: Astro の `<Image>` でリモート画像を直接参照**

```astro
---
import { Image } from 'astro:assets';
---
<Image
  src="https://images.microcms-assets.io/assets/xxx/yyy/image.jpg"
  alt="説明文"
  width={720}
  height={480}
/>
```

Astro がビルド時にリモート画像をダウンロード・最適化する。
`astro.config.ts` の `image.domains` に microCMS のドメインを追加する必要あり。

**方式B: ビルド前スクリプトでダウンロード → ローカル参照**

```ts
// scripts/fetch-images.ts
// microCMS API からメディア一覧を取得し、src/assets/images/ に保存
```

### OGP画像

既存の satori + sharp による OGP 画像生成は**変更なし**（引き続きビルド時に自動生成）。

### データ転送量の見積もり

- 画像 9記事 × 平均1〜2枚 × 500KB ≒ 5〜10 MB/ビルド
- 月 500回ビルドでも 2.5〜5 GB → 20GB 枠に余裕あり

## 検証方法

- microCMS API 疎通確認
- 記事ページでの画像表示確認
- 既存E2Eテスト通過確認
