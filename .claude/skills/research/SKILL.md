---
name: research
description: 技術調査・ライブラリ比較・技術選定・PoC候補検討・最新動向・調査レポート作成時に使用する。結論・根拠・出典を構造化する。公式APIは Context7、OSS内部実装は oss-source-reader、SPAは browser-reader に委譲する。
allowed-tools: Read, Write, Grep, Glob, Bash(gh:*), WebSearch, WebFetch
---

# 技術調査スキル（/research）

目的: 技術調査を構造化し、**結論・根拠・出典**を明確化する。

**本リポジトリの技術前提**: Astro / TypeScript / pnpm / Vercel / Playwright（E2E）。想定読者は開発者・レビュー担当。

## 進め方（オーケストレーション）

1. **調査スコープの確認**
   - 調査対象/目的
   - 想定読者（開発者/レビュー担当など）
   - 調査深度（下記「深度ゲート」）
   - **現在日時の確認**: 実行時点の現在日時（例: 2026年8月現在）を認識し、調査テーマの最新動向を追うための基準とする
2. **Prior Art（必須）**
   - `docs/plan/`・`docs/coding-guidelines/` を Grep/Glob で検索する
   - 調査レポート本体は sibling `../private-memo` の `docs/research/`（SF6 配置は `docs/research/sf6-site/visualiza/`）を参照する
   - Serena MCP が利用可能なら `list_memories` / `read_memory` で関連知見を確認する
   - 既存レポートがあれば再調査せず相対パスで参照し、差分のみ更新する
   - 公開側索引は [`docs/research/index.md`](../../../docs/research/index.md)（保存先の案内のみ）
3. **検索クエリの設計（最新情報の確保）**
   - 最新の動向や事例を取得するため、検索クエリに現在年（例: `2026`）や `latest`、`recent` などのキーワードを戦略的に付与する
4. **取得チャネルの選択**（下記ルーティング表）
5. **専門スキルへ委譲**（該当時は SKILL.md を Read して手順を実行）
6. **CRAAP 評価（簡易）** → **結論と推奨** → **保存と索引更新**

## 深度ゲート

| 深度 | 情報収集 | 打ち切り条件 |
| --- | --- | --- |
| クイック | 一次情報 1〜2 件 | 公式 docs または信頼できる1ソースで結論が立つ |
| 標準 | チャネル 1 本 + 別ソースで検証 | 矛盾がなければ完了 |
| ディープダイブ | 複数チャネル（docs + OSS + Web 等） | 採用/非採用の根拠が反証可能なまで |

## 取得ルーティング表

| 問いの種類 | 委譲先 | 使わない手段 |
| --- | --- | --- |
| 公式 API・設定・バージョン固有 | Context7 MCP（下記） | 広範 WebSearch → 全文 WebFetch |
| 動向・比較・選定 | 本スキル（WebSearch + CRAAP） | ブログ量産を一次扱い |
| 内部実装・型・シグネチャ | [oss-source-reader](../oss-source-reader/SKILL.md) | 学習データの推測 |
| 既知バグ・マイグレーション | `gh` Issue/Discussion + 公式 changelog | 二次記事のみ |
| 静的 HTML・SSR ページ | WebFetch（短い本文のみ context に） | 最初から Playwright |
| SPA / JS 必須 / 認証後 UI | [browser-reader](../browser-reader/SKILL.md)（WebFetch 失敗後） | Playwright MCP / 常時ブラウザ |

### Context7（公式 docs 調査）

公式 API・設定・バージョン固有の調査は Context7 MCP を第一候補とする:

1. `GetMcpTools` で `plugin-context7-plugin-context7` のスキーマを確認
2. `resolve-library-id` でライブラリ ID を解決
3. `query-docs` で公式ドキュメントを取得

### WebFetch → browser-reader エスカレーション条件

いずれかに該当したら `browser-reader` を検討する:

- 本文が極端に短い（目安: 500 文字未満）
- `Loading...`、`Please wait`、`JavaScript required` が含まれる
- `<div id="root">` や `<div id="app">` のみで実コンテンツがない
- `<noscript>` 誘導のみ
- WebFetch が 403/401 で失敗し、ブラウザ文脈が必要と判断できる

## 判断に迷う場合

- ライブラリの「概要・用途・マイグレーション」→ 本スキル（WebSearch）
- ライブラリの「内部実装・型定義・関数シグネチャ」→ oss-source-reader
- ページが「静的 HTML」→ WebFetch で十分
- ページが「SPA / JS レンダリング必須」→ 先に WebFetch、失敗時 browser-reader

## CRAAP 評価（簡易）

- Currency: 更新日の確認（現在日時から見て十分に最新であるか。最新仕様、ベストプラクティス、ライブラリの非推奨化（deprecated）情報が反映されているか）
- Relevance: 対象課題との一致
- Authority: 著者/組織の信頼性
- Accuracy: 他ソースで検証できるか
- Purpose: 商用/教育/中立性

## 保存ルール

- 保存先: sibling `../private-memo` の `docs/research/YYYY-MM-DD-{slug}.md`（SF6 配置は `docs/research/sf6-site/visualiza/`）
- テンプレート: [references/output-template.md](references/output-template.md)
- 完了後: private-memo の `docs/research/index.md`（または visualiza の README）に 1 行追記
- 公開リポ `blog` の [`docs/research/index.md`](../../../docs/research/index.md) には結論を書かない
- ユーザーが保存を依頼しない場合はチャット報告のみでもよい
- WebFetch が禁止されている場合は WebSearch のみで整理し、必要ならユーザーに承認を求める

## フォールバック

Context7 / oss-source-reader / browser-reader が利用不可の場合:

- WebSearch で代替し、利用できなかったチャネルと精度の限界を明記する
