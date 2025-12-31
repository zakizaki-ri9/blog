# セキュリティガイドライン

このドキュメントでは、セキュリティに関するチェック項目とベストプラクティスを説明します。

## XSS対策

### Astroの自動エスケープ

- Astroの自動エスケープが適切に機能しているか
- `set:html` や `set:text` の使用が適切か（信頼できないデータの場合は使用しない）
- ユーザー入力が適切にサニタイズされているか

#### ベストプラクティス

```astro
---
// ✅ 良い例: 自動エスケープ（デフォルト）
const userInput = '<script>alert("XSS")</script>';
---

<div>{userInput}</div> <!-- 自動的にエスケープされる -->

---
// ⚠️ 注意: set:html は信頼できるデータのみ
const trustedHtml = sanitize(userInput);
---

<div set:html={trustedHtml} /> <!-- 信頼できるデータのみ -->
```

### サニタイゼーション

- ユーザー入力は必ずサニタイズ
- HTMLタグを含む可能性のあるデータは適切に処理
- 外部APIからのデータも信頼しない

## 環境変数の適切な管理

### 機密情報の管理

- 機密情報が環境変数として管理されているか
- `import.meta.env` の使用が適切か
- クライアントサイドで公開される環境変数に機密情報が含まれていないか（`PUBLIC_` プレフィックスの確認）

#### 実装例

```ts
// ✅ 良い例: サーバーサイドのみの環境変数
const apiKey = import.meta.env.API_KEY; // サーバーサイドのみ

// ✅ 良い例: クライアントサイドで公開する場合
const publicApiUrl = import.meta.env.PUBLIC_API_URL; // PUBLIC_ プレフィックス

// ❌ 悪い例: 機密情報をクライアントサイドで公開
const secretKey = import.meta.env.SECRET_KEY; // PUBLIC_ がないとクライアントで使えないが、念のため確認
```

### 環境変数の命名規則

- 機密情報は `PUBLIC_` プレフィックスを付けない
- 公開可能な情報のみ `PUBLIC_` プレフィックスを付ける
- 環境変数の一覧をドキュメント化

## 依存関係の脆弱性

### 定期的な監査

- `pnpm audit` で検出された脆弱性が修正されているか
- 依存関係のバージョンが適切に管理されているか
- 不要な依存関係がインストールされていないか

#### チェック方法

```bash
# 脆弱性の確認
pnpm audit

# 脆弱性の修正
pnpm audit --fix

# 依存関係の更新
pnpm update
```

### 依存関係の管理方針

- 定期的に依存関係を更新
- セキュリティパッチは優先的に適用
- 不要な依存関係は削除

## 機密情報のハードコーディング回避

### チェック項目

- APIキー、パスワード、トークンなどがコードに直接記述されていないか
- 設定ファイルに機密情報が含まれていないか
- `.env` ファイルが適切に `.gitignore` に含まれているか

#### ベストプラクティス

```ts
// ❌ 悪い例: ハードコーディング
const apiKey = 'sk-1234567890abcdef';

// ✅ 良い例: 環境変数から取得
const apiKey = import.meta.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY is not set');
}
```

### .gitignore の確認

```gitignore
# .env ファイルを必ず除外
.env
.env.local
.env.*.local
```

## 入力値検証の確認

### フォーム入力の検証

- フォーム入力の検証が適切に行われているか
- サーバーサイドでも検証を実施（クライアントサイドのみでは不十分）
- 型安全性を活用した検証

#### 実装例

```ts
// ✅ 良い例: 入力値検証
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(0).max(120),
});

function validateInput(input: unknown) {
  return schema.parse(input);
}
```

### URLパラメータの検証

- URLパラメータの検証が適切に行われているか
- 型安全性を確保
- 不正な値に対する適切なエラーハンドリング

### 外部APIからのレスポンスの検証

- 外部APIからのレスポンスの検証が適切に行われているか
- スキーマ検証を実施
- 想定外のデータに対する防御的プログラミング

#### 実装例

```ts
// ✅ 良い例: 外部APIレスポンスの検証
import { z } from 'zod';

const ApiResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    title: z.string(),
  })),
});

async function fetchData() {
  const response = await fetch('/api/data');
  const json = await response.json();
  return ApiResponseSchema.parse(json); // 検証
}
```

## 認証・認可

### 認証の実装

- 認証が必要なページが適切に保護されているか
- セッション管理が適切に行われているか（SSR使用時）
- トークンの適切な管理

### 認可チェック

- 認可チェックが適切に実装されているか
- リソースへのアクセス権限が適切に検証されているか
- 権限エラーの適切な処理

#### 実装例

```ts
// ✅ 良い例: 認可チェック
async function getPost(slug: string, userId: string) {
  const post = await postRepo.getBySlug(slug);
  
  if (!post) {
    throw new Error('Post not found');
  }
  
  // 認可チェック
  if (post.authorId !== userId && !post.isPublic) {
    throw new Error('Unauthorized');
  }
  
  return post;
}
```

## その他のセキュリティ考慮事項

### HTTPSの使用

- HTTPSの使用が強制されているか（本番環境）
- リダイレクト設定が適切か
- 証明書の管理

### CORS設定

- CORS設定が適切か
- 必要最小限のオリジンのみ許可
- 本番環境での適切な設定

### セキュリティヘッダー

- セキュリティヘッダーが適切に設定されているか
- Content-Security-Policy (CSP) の設定
- X-Frame-Options, X-Content-Type-Options などの設定

#### 実装例（Astro設定）

```ts
// astro.config.mjs
export default defineConfig({
  // ...
  vite: {
    // ...
  },
  // セキュリティヘッダーの設定（ミドルウェアまたはホスティング設定で）
});
```

## セキュリティチェックリスト

実装・レビュー時に以下の項目を確認してください：

- [ ] XSS対策が適切に実装されているか
- [ ] 環境変数が適切に管理されているか
- [ ] 依存関係の脆弱性が修正されているか
- [ ] 機密情報がハードコーディングされていないか
- [ ] 入力値検証が適切に行われているか
- [ ] 認証・認可が適切に実装されているか
- [ ] HTTPSが使用されているか（本番環境）
- [ ] CORS設定が適切か
- [ ] セキュリティヘッダーが設定されているか

## 関連ドキュメント

- [Astro/TypeScript](./astro-typescript.md) - Astro/TypeScript コーディングガイドライン
- [コード品質](./code-quality.md) - コード品質チェック項目
- [`AGENTS.md`](../../AGENTS.md) - エージェント開発ガイド
