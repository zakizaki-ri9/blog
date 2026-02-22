# Tech Stack

## Framework & Build Tools

- **Astro 5.x**: メインフレームワーク（SSG + Hybrid Rendering）
- **TypeScript**: 型安全性の確保
- **Vite**: 高速なビルドツール
- **pnpm**: パッケージマネージャー（必須）

## コンテンツ管理

- **MDX**: Markdown + JSX によるコンテンツ作成
- **RSS**: フィード生成
- **Sitemap**: SEO 対応

## デプロイ & インフラ

- **Vercel**: ホスティングとCI/CD
- **Static Site Hosting**: デフォルトは静的生成
- **Serverless Functions**: 必要に応じて動的処理（例: API エンドポイント）

## コード品質

- **ESLint**: コード品質チェック
  - Astro、TypeScript、Playwright プラグイン
  - Stylistic プラグインによるフォーマット
- **Playwright**: E2E テスト
- **npm scripts**: `review` コマンドで lint + type-check + security-check

## 開発ツール & プロセス

- **Gemini CLI**: AI アシスタント（cc-sdd による仕様駆動開発）
- **GitHub MCP**: GitHub 操作の統合
- **Serena**: AI エージェント（`.agent/` 配下のルールとワークフロー）

## 今後の技術追加予定

- **Supabase**: PostgreSQL + pgvector（RAG 用）
- **Google Gemini API**: Embedding + LLM（RAG 用）
- **Vue.js**: インタラクティブ UI コンポーネント（Island として）

---
_Prefer convention over configuration; leverage Astro's defaults_
