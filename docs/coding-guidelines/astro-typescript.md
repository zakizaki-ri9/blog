# Astro/TypeScript コーディングガイドライン

このドキュメントでは、Astro と TypeScript に特化したコーディングガイドラインを説明します。

## コーディングと設計の指針

### TypeScript の厳格モード

TypeScript の厳格モードを維持しつつ、テストからインターフェースを導出して依存の向きを明確化します。

- `strict: true` を維持
- テストから必要なインターフェースを導出
- 依存の方向を明確にする（ドメイン → アプリ → アダプタ）

### テストを最小の仕様書として扱う

テストを最小の仕様書とみなし、振る舞いの期待（例・反例）をテスト名とアサーションに埋め込みます。

- テスト名で期待される振る舞いを明確に表現
- アサーションで具体的な期待値を示す
- 反例（エラーケース）もテストに含める

### ファイル構造と命名規則

ファイル構造・命名規則・ESLint ルールは既存メモ（`code_style_conventions`）に従い、ドメイン単位で関心を分離します。

- ドメイン単位でディレクトリを構成
- 一貫した命名規則を維持
- ESLint ルールを尊重

### 仕様の曖昧さへの対応

仕様が曖昧な場合は「誤りに対して合否が判断できるテスト」を先に追加し、意図をコード化してから実装を変えます。

- テストで仕様を明確化
- エラーケースも含めてテスト
- 実装前に意図をコード化

### リファクタリングの方針

リファクタリング時はテスト網で守られている範囲だけを対象にし、不要な最適化や広範囲の変更を避けてください。

- テストで保護されている範囲のみリファクタリング
- 動作仕様を変えない
- 段階的にリファクタリング

## Astro固有のチェック項目

### コンポーネントの適切な使用

- `.astro`ファイルでコンポーネントが適切にインポート・使用されているか
- クライアントサイドコンポーネント（`client:*`ディレクティブ）の使用が適切か
- サーバーコンポーネントとクライアントコンポーネントの境界が明確か

#### ベストプラクティス

```astro
---
// ✅ 良い例: サーバーコンポーネントでデータ取得
import { getPost } from '@/app/use-cases/posts';
const post = await getPost(slug);
---

<article>
  <h1>{post.title}</h1>
  <p>{post.content}</p>
</article>
```

```astro
---
// ❌ 悪い例: クライアントサイドで不要なJavaScriptを送信
import Counter from './Counter.astro';
---

<Counter client:load />
```

### 静的生成とSSRの適切な使い分け

- `output: "static"` と `output: "server"` の使い分けが適切か
- `getStaticPaths` の実装が正しいか（動的ルーティング時）
- 静的生成可能なページは静的生成されているか

#### 使い分けの指針

- **静的生成（`output: "static"`）**: ビルド時に生成可能なページ
- **SSR（`output: "server"`）**: リクエストごとに動的に生成が必要なページ
- 可能な限り静的生成を選択（パフォーマンス向上）

### 画像最適化の確認

- `astro:assets` を使用した画像最適化が行われているか
- 画像のサイズとフォーマットが適切か
- 遅延読み込み（`loading="lazy"`）が適切に使用されているか

#### 実装例

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Hero image"
  loading="lazy"
  formats={['avif', 'webp']}
/>
```

### SEO関連のメタタグ確認

- `<title>` タグが適切に設定されているか
- `<meta>` タグ（description, og:title, og:description等）が適切に設定されているか
- `BaseHead.astro` などの共通コンポーネントが適切に使用されているか

#### 実装例

```astro
---
import BaseHead from '@/components/BaseHead.astro';
const title = 'ページタイトル';
const description = 'ページの説明';
---

<BaseHead title={title} description={description} />
```

### パフォーマンス

- 不要なJavaScriptバンドルの読み込みがないか
- コンポーネントの分割が適切か（コード分割）
- 大きな依存関係のインポートが適切か

#### 最適化のポイント

- クライアントサイドコンポーネントは必要最小限に
- 動的インポートでコード分割
- 大きなライブラリは必要な部分のみインポート

## TypeScriptチェック項目

### 型安全性の確保

- `any`型の使用が回避されているか（やむを得ない場合はコメントで理由を明記）
- 型アサーション（`as`）の使用が最小限か
- 型ガードが適切に使用されているか

#### ベストプラクティス

```ts
// ❌ 悪い例: any型の使用
function processData(data: any) {
  return data.value;
}

// ✅ 良い例: 適切な型定義
interface Data {
  value: string;
}
function processData(data: Data): string {
  return data.value;
}

// ✅ 良い例: 型ガードの使用
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

### 厳密なnullチェック

- `strictNullChecks` が有効な環境でのnull/undefinedチェックが適切か
- オプショナルチェーン（`?.`）やnull合体演算子（`??`）が適切に使用されているか
- 非nullアサーション（`!`）の使用が適切か（最小限に）

#### 実装例

```ts
// ✅ 良い例: オプショナルチェーンとnull合体演算子
const value = data?.property ?? 'default';

// ❌ 悪い例: 非nullアサーションの乱用
const value = data!.property; // 危険
```

### 型定義の適切性

- インターフェースと型エイリアスの使い分けが適切か
- ジェネリクスの使用が適切か
- ユニオン型とインターセクション型の使用が適切か

#### 使い分けの指針

- **インターフェース**: オブジェクトの形状を定義、拡張可能
- **型エイリアス**: 複雑な型の組み合わせ、ユニオン型など
- **ジェネリクス**: 再利用可能な型定義

### インポート/エクスポート

- 型のみのインポートは `import type` を使用しているか
- エクスポートされる型が適切に定義されているか

#### 実装例

```ts
// ✅ 良い例: 型のみのインポート
import type { Post } from '@/types/post';
import { getPost } from '@/app/use-cases/posts';

// ❌ 悪い例: 型と値の混在インポート（型のみの場合）
import { Post } from '@/types/post'; // 値として使わない場合は type を付ける
```

## 関連ドキュメント

- [アーキテクチャ設計](./architecture.md) - テスト容易性を確保するアーキテクチャ
- [セキュリティ](./security.md) - セキュリティチェック項目
- [コード品質](./code-quality.md) - コード品質チェック項目
- [`AGENTS.md`](../../AGENTS.md) - エージェント開発ガイド
