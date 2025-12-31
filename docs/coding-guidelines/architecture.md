# テスト容易性を確保するアーキテクチャ

このドキュメントでは、テスト容易性を確保するためのアーキテクチャ設計原則を説明します。

## 設計原則

### 依存逆転（DIP）

ドメイン/アプリ層が上位。外部世界（FS/HTTP/画像生成/検索）はポート（インターフェース）で抽象化し、具体はアダプタで注入します。

- ビジネスロジックは外部の実装に依存しない
- インターフェース（ポート）を定義し、実装（アダプタ）を注入可能にする
- テスト時はインメモリ実装を注入して高速化

### Functional Core, Imperative Shell

コアは副作用ゼロの純粋関数と不変データで構成。I/O とフレームワーク依存は薄いシェルへ隔離します。

- **Core（コア）**: 純粋関数、不変データ、ビジネスロジック
- **Shell（シェル）**: I/O、フレームワーク依存、副作用のある処理
- コアを純粋に保つことで、テストが容易になり、バグが減る

### 境界の明示と契約

入出力 DTO を定義し、例外・エラーは Result 型（成功/失敗）や明示的エラーに収束。アダプタには契約（contract）テストを用意します。

- 入出力の型を明確に定義（DTO）
- エラーハンドリングを明示的に設計
- ポートごとに契約テストで振る舞いを保証

### 時刻/乱数/設定/環境変数の注入

`Clock`・`IdGenerator`・`Env` をポート化し、テスト時に固定化して決定的にします。

- 時刻や乱数などの非決定性を排除
- テスト時に固定値を注入可能にする
- 本番環境では実際の実装を注入

### コンポジションルートの一元化

実行環境でのみ依存を束ねる初期化コード（factory/compose）を用意し、テストではインメモリ実装を配線します。

- 依存関係の解決を一箇所に集約
- 本番用とテスト用で異なる実装を注入可能に
- 依存グラフを明確に管理

## 推奨ディレクトリ構成

```
src/
├── domain/          # エンティティ、値オブジェクト、ドメインサービス（純粋関数）
├── app/             # ユースケース、ポート定義（インターフェース）、DTO
├── adapters/        # 外部世界との接続
│   ├── content/     # Astro Content Collections 実装
│   ├── ogp/         # Satori/Sharp 実装
│   ├── rss/         # RSS出力生成
│   ├── sitemap/     # サイトマップ出力生成
│   ├── search/      # Pagefind 連携
│   ├── http/        # HTTP通信
│   ├── fs/          # ファイルシステム
│   ├── clock/       # 時刻取得
│   └── id/          # ID生成
├── web/             # Astro ページ/コンポーネント（表示専用、ビジネスロジックは app 内）
└── config/
    └── compose.ts   # コンポジションルート（本番配線）

tests/
├── unit/            # domain/app の純粋テスト
├── contract/        # 各アダプタがポート契約を満たすか
├── integration/     # ユースケース越境
└── e2e/             # Playwright 等で最重要経路
```

### 各レイヤーの役割

- **`src/domain/`**: ビジネスロジックの中核。純粋関数と不変データのみ。
- **`src/app/`**: ユースケースの実装。ポート（インターフェース）の定義と、それを使ったユースケース。
- **`src/adapters/`**: 外部世界との接続。ポートの実装。フレームワークやライブラリへの依存をここに集約。
- **`src/web/`**: Astro のページとコンポーネント。表示のみを担当。ビジネスロジックは `app` に委譲。
- **`src/config/compose.ts`**: 依存関係の解決。本番環境での実装を配線。

## 代表ポート例（TypeScript）

```ts
// src/app/ports/content-repo.ts
export interface ContentRepo {
  listPosts(params: { tag?: string }): Promise<PostSummary[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
}

// src/app/ports/ogp.ts
export interface OgpGenerator {
  render(input: OgpInput): Promise<Uint8Array>; // 画像バイト列
}

// src/app/ports/search.ts
export interface SearchIndexer {
  index(docs: SearchDoc[]): Promise<void>;
}

// 共通ポート（決定性確保）
export interface Clock {
  now(): Date;
}

export interface IdGenerator {
  next(): string;
}
```

### ポート設計のポイント

- インターフェースは抽象度を適切に保つ（過度に詳細化しない）
- テスト容易性を考慮した設計（モックしやすい）
- ドメインの言葉を使う（技術的な詳細を隠す）

## テストダブル運用

InMemory/Fake 実装を `tests/doubles/` に配置し、ユースケースの速度と決定性を確保します。

### 例

- **`InMemoryContentRepo`**: メモリ上でコンテンツを管理する実装
- **`FakeOgpGenerator`**: 一定サイズのダミーバイト列を返す実装
- **`FixedClock`**: 固定時刻を返す実装
- **`FixedIdGenerator`**: 固定IDを返す実装

### テストダブルの使い分け

- **Stub**: 固定値を返すシンプルな実装
- **Fake**: 簡易的な実装（例：InMemoryContentRepo）
- **Mock**: 呼び出しを検証する実装（必要に応じて）

## 契約テストの型

ポートごとに共通テストスイートを用意し、任意のアダプタ実装に対して同一の振る舞いを検証します。

### 例: `content-repo.contract.spec.ts`

```ts
describe('ContentRepo Contract', () => {
  it('同一タグでのフィルタが正しく動作する', async () => {
    // 任意のContentRepo実装に対して同じテストを実行
  });

  it('存在しない slug で null を返す', async () => {
    // 任意のContentRepo実装に対して同じテストを実行
  });
});
```

### 契約テストの利点

- ポートの仕様を明確化
- 実装の交換可能性を保証
- テストの再利用性向上

## Astro との境界ポリシー

Astro コンポーネントは「表示関心」に限定し、データ整形・絞り込みは `app` ユースケースに委譲します。

### 原則

- Astro コンポーネントは表示のみを担当
- ビジネスロジックは `app` レイヤーに配置
- 可能な限り `getStaticPaths`/`get` 相当のデータ取得処理はポート経由で注入
- コンポーネントを関数としてテスト可能にする

### 実装例

```ts
// ❌ 悪い例: コンポーネント内にビジネスロジック
---
const posts = await getCollection('blog');
const filtered = posts.filter(p => p.data.tags.includes('astro'));
---

// ✅ 良い例: ユースケースに委譲
---
import { listPostsByTag } from '@/app/use-cases/posts';
const posts = await listPostsByTag({ tag: 'astro' });
---
```

## 副作用の隔離ポイント

ファイル書込（RSS/サイトマップ/OGP 出力）、ネットワーク、プロセス実行（Pagefind）はアダプタに集約します。

### 副作用の種類

- **ファイルI/O**: RSS、サイトマップ、OGP画像の生成
- **ネットワーク**: HTTPリクエスト、API呼び出し
- **プロセス実行**: Pagefind などの外部コマンド実行

### テスト時の扱い

- ファイルシステムを使わずメモリ/一時ディレクトリを使用
- ネットワーク呼び出しはモック/スタブで置き換え
- プロセス実行はテストダブルで置き換え
- 観察可能な戻り値・イベントで検証

## 回帰を防ぐテクニック

バグ再現テスト → 修正 → 追加の失敗テストで三角測量 → リファクタの順で固定化します。

### バグ修正の流れ

1. **再現テスト**: バグを再現するテストを追加（Red）
2. **修正**: 最小限の修正でテストを通す（Green）
3. **三角測量**: 追加の失敗テストで仕様を明確化
4. **リファクタ**: テストを安全網としてリファクタリング

### スナップショットテスト

- 表示はスナップショットを最小単位で使用
- 過度なドキュメント一括スナップショットは避ける
- 変更の意図を明確にする

## 関連ドキュメント

- [Astro/TypeScript](./astro-typescript.md) - 実装時の具体的なガイドライン
- [コード品質](./code-quality.md) - コード品質チェック項目
- [`AGENTS.md`](../../AGENTS.md) - エージェント開発ガイド
