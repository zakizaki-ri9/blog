# プロジェクト構造

## 組織化の哲学

標準的なAstroプロジェクト構造に従い、適切な場所で機能ベースの分離（例：integrations）を行います。

## ディレクトリパターン

### ソースルート
**場所**: `src/`
**目的**: アプリケーションのソースコード。

### コンポーネント
**場所**: `src/components/`
**目的**: 再利用可能なUIコンポーネント (`.astro`)。
**例**: `LinkCard.astro`

### コンテンツコレクション
**場所**: `src/content/`
**目的**: Markdown/MDXコンテンツソース。
**例**: `blog/`, `pages/`

### ページ & ルーティング
**場所**: `src/pages/`
**目的**: ファイルベースのルーティング。
**例**: `index.astro`, `blog/[...slug].astro`

### インテグレーション
**場所**: `src/integrations/`
**目的**: カスタムAstroインテグレーション（例：OG画像ジェネレータ）。

### 設定
**場所**: `src/config/`
**目的**: アプリケーション全体の設定定数。
**例**: `site.ts`

## 命名規則

- **コンポーネント**: PascalCase (例: `BaseHead.astro`)
- **ファイル/ユーティリティ**: camelCase (例: `generateOgImage.ts`)
- **設定**: camelCase (例: `astro.config.ts`)

## インポート構成

設定されたエイリアスを使用した絶対パスインポートを優先する:

```typescript
import { SITE_TITLE } from '@/consts';
import BaseHead from '@/components/BaseHead.astro';
```

**パスエイリアス**:
- `@/`: `/src` にマップ

## コード構成原則

- **コンテンツ駆動**: 特定のコンテンツタイプに関連するロジックは、`content/` または `utils/` の近くに配置する。
- **関心の分離**: UIコンポーネントは、ページロジックや設定から分離する。

---
_ファイルツリーではなくパターンを文書化する。パターンに従う新しいファイルは更新を必要とすべきではない_