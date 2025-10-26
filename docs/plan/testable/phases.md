# フェーズ計画（細分化）

各フェーズは最大30〜90分のベイビーステップで完了可能な粒度です。各フェーズは「狙い / 手順 / 成果物(DoD) / ロールバック」を明記します。

---

## Phase 0: 現状可視化と安全策
- 狙い: 変更前の振る舞いを固定し、回帰検知の土台を用意
- 手順:
  - README に現状機能一覧を追記
  - `pnpm lint` を常用スクリプトにし、CI なしでローカル検証
- 成果物(DoD): 主要ページがローカルで動作、Lint 無警告
- ロールバック: なし（ドキュメントのみ）

## Phase 1: 単体テスト基盤の最小導入
- 狙い: Red→Green→Refactor のループを回す最小セット
- 手順:
  - `vitest` を導入し `pnpm test` を追加
  - `tests/unit/FormattedDate.spec.ts` を作成（ISO→YYYY-MM-DD の表示確認）
- 成果物(DoD): テスト1件が失敗→緑化→再実行で安定
- ロールバック: `devDependencies` と `tests/` を削除で元通り

## Phase 2: ポート定義（HTTP/Clock/Id）
- 狙い: 決定性の確保と外部依存の隔離
- 手順:
  - `src/app/ports/http.ts`, `clock.ts`, `id.ts` を追加
  - `ogp.ts` は `HttpClient` 経由で取得するように改修
- 成果物(DoD): 単体テストで固定 `Clock/Id`、`FakeHttp` による決定的な検証
- ロールバック: 旧実装の関数直呼びに戻す

## Phase 3: OGP取得ユースケース化
- 狙い: 表示からデータ取得ロジックを分離
- 手順:
  - `src/app/usecases/fetchOgp.ts` を作成（入力:URL、出力:OgpData）
  - 例外系や相対URL解決を仕様化（テストで明示）
- 成果物(DoD): 正常系/404/メタ欠落/相対URLの4系統テスト
- ロールバック: 直接 `getOgpData` 利用に戻す

## Phase 4: OGP画像生成の分割（Core/Adapter）
- 狙い: 画像生成の純粋化と副作用の隔離
- 手順:
  - Core: `renderOgpSvg(title, description): string` を純粋関数化
  - Adapter: `OgpGenerator`（Satori/Resvg/Sharp）と `FakeOgpGenerator`
- 成果物(DoD): Core のスナップショット最小化テスト、`FakeOgpGenerator` 契約テスト
- ロールバック: 既存 `generateOgImage` 直呼びへ戻す

## Phase 5: ContentRepo 抽象化と契約テスト
- 狙い: `astro:content` 依存の主要I/Oを境界化
- 手順:
  - `src/app/ports/content-repo.ts` を定義
  - InMemory 実装でタグ/slug 検索の契約テスト
- 成果物(DoD): `content-repo.contract.spec.ts` 緑化
- ロールバック: ページ側で直接 `getCollection` に戻す

## Phase 6: コンポジションルート作成
- 狙い: 実装の束ね先を一本化
- 手順:
  - `src/config/compose.ts` に本番配線（HttpClient/Clock/Id/OgpGenerator/ContentRepo）
  - テストでは InMemory/Fake を配線
- 成果物(DoD): ページからユースケース呼び出しに切替、E2E 変化なし
- ロールバック: 既存 import へ戻す

## Phase 7: Astro ページの境界整理
- 狙い: 表示専用化
- 手順:
  - `src/pages/**` からデータ整形をユースケースへ移動
  - Props は DTO のみを受け取り表示に徹する
- 成果物(DoD): 主要ページの統合テストが緑化
- ロールバック: 一時的にユースケース層をバイパス

## Phase 8: 重要ユーザー経路のE2E
- 狙い: 回帰検知の最終網
- 手順:
  - `playwright` で トップ→記事→タグ→RSS のHappyPath
  - OGP画像リンクの生成有無を確認（存在チェック）
- 成果物(DoD): E2E 1〜2本が安定
- ロールバック: E2E をスキップしてリリース可能

---

## 進め方
- 各フェーズは PR を分け、小さく速くマージ
- すべての PR に「テスト追加→緑化→リファクタ」を含める
- リスクが高いと感じたら、契約テストを先に追加してから実装変更
