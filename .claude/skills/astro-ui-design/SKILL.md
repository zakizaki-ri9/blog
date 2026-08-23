---
name: astro-ui-design
description: Astro ブログ・ツールの UI 実装時に使用する。デザイントークン、タイポグラフィ、余白、インタラクション状態、Astro スタイリング慣習を強制する。フロントエンドの見た目を改善・追加するとき、tools 配下の UI を編集するときに適用する。
paths:
  - "src/components/**"
  - "src/pages/**"
  - "src/styles/**"
---

# Astro UI デザインスキル

Astro ブログ（zaki-blog）の UI を一貫して実装するための手順。React / shadcn は導入しない。

## いつ使うか

- 新規ページ・コンポーネントの UI を追加するとき
- 既存 UI の見た目を改善するとき
- `src/pages/tools/**` や `src/components/tools/**` を編集するとき

## デザイントークン（必須）

`src/styles/global.css` のトークンを参照する。任意の hex 直書きは禁止（SVG 塗り・ストロークなど描画専用は例外としてコメントで理由を書く）。

| 用途 | トークン | 例 |
| --- | --- | --- |
| アクセント | `--color-accent` | リンク、フォーカス、強調 |
| 本文 | `--color-text`（`rgb(var(--color-text))`） | 段落テキスト |
| 見出し | `--color-heading` | h1–h6 |
| 補助テキスト | `--color-text-muted` | メタ情報、注釈 |
| 境界線 | `--color-border` | fieldset、区切り線 |
| 背景 | `--color-surface` | カード・キャンバス背景 |
| 角丸 | `--radius-sm` / `--radius-md` / `--radius-lg` | 6px / 8px / 12px |
| 余白 | `--space-1` 〜 `--space-8` | 4px 基準グリッド |

レガシー名（`--accent`, `--gray-dark` 等）も動作するが、新規コードでは semantic 名を優先する。

## タイポグラフィ

- フォント: `Atkinson`（`global.css` で定義済み）
- 見出しスケールは `global.css` の h1–h6 に準拠。独自サイズを増やさない
- ツール UI のラベル・補助文は `0.85rem` 〜 `0.95rem`

## 余白・レイアウト

- 4px / 8px グリッド（`--space-*` または Tailwind の `gap-2` / `gap-3` / `gap-4`）
- `tools/` 配下は Tailwind ユーティリティを使ってよい
- ブログ本文ページは既存の scoped CSS パターンを維持

## インタラクション

- ボタン・リンク: `:hover` と `:focus-visible` を必ず定義
- 無効状態: `opacity-50` または `cursor-not-allowed`
- `prefers-reduced-motion: reduce` ではアニメーションを無効化または短縮

## Astro スタイリング慣習

| レイヤー | 手法 |
| --- | --- |
| グローバル | `src/styles/global.css` |
| ブログコンポーネント | scoped `<style>` |
| ツール UI | Tailwind ユーティリティ + 必要最小の scoped CSS |
| グローバル漏れ | `is:global` は本当に必要なときだけ |

## Tailwind（tools 向け）

- Preflight（base）は読み込まない。`theme` + `utilities` のみ
- Vite は Astro 6 に合わせ **7.x 固定**（`package.json` の `pnpm.overrides`）。Astro 7 移行時に 8 へ上げる
- トークン連携済みユーティリティ: `text-accent`, `text-text`, `text-text-muted`, `border-border`, `bg-surface`, `rounded-sm` 等
- `@apply` は使わず、マークアップにユーティリティクラスを直接書く

## 禁止事項

- React / shadcn / 新規アイコンライブラリの無断追加
- インライン `style` の常用（`touch-action` 等の動的制御は例外）
- ブログ全体の Tailwind 化
- AI っぽい汎用デザイン（紫グラデーション、過剰なカード UI、Inter/Roboto フォント）

## 実装チェックリスト

1. トークン参照のみで色・余白・角丸を指定したか
2. `:focus-visible` をインタラクティブ要素に付けたか
3. `aria-label` / `aria-live` 等の a11y を維持したか
4. 既存 E2E が壊れない ID・ロールを変えていないか
5. `pnpm lint` と関連テストを通す
