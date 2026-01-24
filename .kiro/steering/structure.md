# Project Structure

## ディレクトリ構成

```
/
├── .agent/                 # Antigravity Agent の設定
│   ├── skills/            # カスタムスキル（review, pr, commit など）
│   └── workflows/         # 開発ワークフロー（/review, /pr など）
├── .gemini/               # Gemini CLI 設定
│   └── commands/kiro/     # cc-sdd の Kiro コマンド
├── .kiro/                 # 仕様駆動開発のルート
│   ├── settings/         # cc-sdd 設定とテンプレート
│   ├── steering/         # プロジェクト全体の指針
│   └── specs/            # 個別機能の仕様（feature ごと）
├── docs/                  # プロジェクトドキュメント
│   ├── coding-guidelines/ # コーディングガイドライン
│   └── plan/             # 機能計画書
├── src/                   # ソースコード
│   ├── components/       # Astro/Vue コンポーネント
│   ├── content/          # MDX コンテンツ
│   ├── integrations/     # Astro インテグレーション
│   ├── layouts/          # レイアウトコンポーネント
│   ├── pages/            # ページ（ルーティング）
│   └── styles/           # グローバルスタイル
├── public/                # 静的アセット
├── tests/                 # E2E テスト（Playwright）
└── dist/                  # ビルド出力（デプロイ対象）
```

## 命名規則

- **ファイル名**: kebab-case（例: `og-image.ts`, `post-card.astro`）
- **コンポーネント**: PascalCase（例: `PostCard.astro`, `ChatWindow.vue`）
- **ユーティリティ**: camelCase（例: `formatDate()`, `getPostSlug()`）

## 設定ファイルの配置

- **Astro**: `astro.config.ts`
- **TypeScript**: `tsconfig.json`
- **ESLint**: `eslint.config.js`
- **Playwright**: `playwright.config.ts`
- **Vercel**: `vercel.json`
- **Agent Rules**: `AGENTS.md`, `Gemini.md`

## コンテンツの配置

- **記事**: `src/content/blog/*.mdx`
- **ドキュメント**: `docs/**/*.md`
- **計画書**: `docs/plan/**/*.md`

---
_Keep feature code colocated; prefer flat structures over deep nesting_
