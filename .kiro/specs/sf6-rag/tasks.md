# SF6 パッチノート RAG 機能 実装計画

## タスク概要

設計書で定義したコンポーネントを実装順序に従って構築します。依存関係を考慮し、以下の順序で進めます：

1. 基盤インフラ（Database, External Services の設定）
2. データパイプライン（ETL Script）
3. バックエンド API（RAG Logic）
4. フロントエンド UI（Chat Component）
5. テストと検証

## 実装タスク

### フェーズ 1: 基盤インフラのセットアップ

- [ ] 1. Supabase プロジェクトのセットアップ
- [ ] 1.1 Supabase でプロジェクトを作成
  - Free Tier プランを選択
  - リージョン: Tokyo (ap-northeast-1)
  - プロジェクト名: `sf6-rag`
  - _Requirements: 4_

- [ ] 1.2 pgvector 拡張機能を有効化
  - SQL Editor で `CREATE EXTENSION IF NOT EXISTS vector;` を実行
  - バージョンを確認: `SELECT * FROM pg_extension WHERE extname = 'vector';`
  - _Requirements: 4_

- [ ] 1.3 patchnotes テーブルのスキーマを作成
  - `design.md` の Physical Data Model に従って SQL を実行
  - インデックス（ivfflat, gin, content_hash）を作成
  - RPC 関数 `match_patchnotes` を作成
  - _Requirements: 4_

- [ ] 1.4 Supabase API キーを取得
  - Settings → API で `anon` key と `service_role` key を確認
  - `.env.example` に記載
  - _Requirements: 5_

- [ ] 2. Gemini API のセットアップ (P)
- [ ] 2.1 Google AI Studio で API キーを発行
  - [Google AI Studio](https://aistudio.google.com/) にアクセス
  - API Key を生成
  - _Requirements: 5_

- [ ] 2.2 環境変数ファイルの設定
  - `.env.example` を作成:
    ```
    GEMINI_API_KEY=your_api_key_here
    SUPABASE_URL=your_supabase_url
    SUPABASE_ANON_KEY=your_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    ```
  - `.env` をローカルで作成し、実際の値を設定
  - `.gitignore` に `.env` を追加済みか確認
  - _Requirements: 5_

### フェーズ 2: RAG コアライブラリの実装

> **Requirement 8** に基づき、汎用的な RAG ロジックを別リポジトリに切り出すことを検討。
> ただし、初期フェーズでは本リポジトリ内で実装し、後でリファクタリング可能にする。

- [ ] 3. GeminiService の実装
- [ ] 3.1 依存パッケージのインストール
  - `@google/generative-ai` をインストール: `pnpm add @google/generative-ai`
  - _Requirements: 2_

- [ ] 3.2 GeminiService インターフェースと実装
  - `src/lib/services/gemini.ts` を作成
  - `embed(text: string)` メソッドを実装
  - `generateAnswer(query: string, context: string)` メソッドを実装
  - エラーハンドリング（Rate Limit, Network, Safety Filter）
  - _Requirements: 2, 5, 6_

- [ ] 3.3 GeminiService のユニットテスト
  - `src/lib/services/gemini.test.ts` を作成
  - モックレスポンスで embedding が 768 次元であることを確認
  - エラーケースのテスト（Rate Limit, Invalid Input）
  - _Requirements: 2_

- [ ] 4. SupabaseClient の実装
- [ ] 4.1 依存パッケージのインストール
  - `@supabase/supabase-js` をインストール: `pnpm add @supabase/supabase-js`
  - _Requirements: 2_

- [ ] 4.2 SupabaseClient インターフェースと実装
  - `src/lib/services/supabase.ts` を作成
  - `searchSimilar(embedding, topK, filters)` メソッドを実装
  - `upsertChunk(chunk)` メソッドを実装
  - _Requirements: 2, 4_

- [ ] 4.3 SupabaseClient のユニットテスト
  - `src/lib/services/supabase.test.ts` を作成
  - モックデータで Top K 検索が動作することを確認
  - Upsert の重複処理（content_hash）をテスト
  - _Requirements: 2, 4_

### フェーズ 3: データパイプライン（ETL）の実装

- [ ] 5. ETL Script の実装
- [ ] 5.1 スクリプトファイルの作成
  - `src/scripts/etl-sf6.ts` を作成
  - CLI 引数パーサーを実装（version, wiki_url）
  - _Requirements: 3_

- [ ] 5.2 データ抽出機能の実装
  - SF6 Wiki からパッチノートテキストを抽出（cheerio または Playwright）
  - バージョン、キャラクター名、日付をメタデータとして抽出
  - _Requirements: 3_

- [ ] 5.3 Chunk 分割機能の実装
  - 512 トークン単位で Chunk 分割
  - トークナイザー（tiktoken または GPT-3 tokenizer）を使用
  - _Requirements: 3_

- [ ] 5.4 ベクトル化と Upsert の実装
  - GeminiService を使用して各 Chunk をベクトル化
  - レート制限対策: 15 リクエストごとに 60 秒の Sleep
  - SupabaseClient を使用して Upsert
  - content_hash（SHA-256）を生成して重複排除
  - _Requirements: 3_

- [ ] 5.5 ログとエラーハンドリング
  - 処理進捗のログ出力（`console.log` または `winston`）
  - エラーが発生した Chunk を `errors.json` に記録
  - _Requirements: 3, 6_

- [ ] 5.6 npm script の追加
  - `package.json` に `"etl:sf6": "tsx src/scripts/etl-sf6.ts"` を追加
  - _Requirements: 3_

- [ ] 5.7* ETL Script のインテグレーションテスト
  - サンプル Wiki データで全パイプラインが動作することを確認
  - _Requirements: 3_

### フェーズ 4: RAG API の実装

- [ ] 6. Chat API Handler の実装
- [ ] 6.1 API エンドポイントファイルの作成
  - `src/pages/api/chat.ts` を作成
  - `export async function POST()` を実装
  - _Requirements: 2_

- [ ] 6.2 リクエストバリデーション
  - Zod スキーマで `ChatRequest` をバリデーション
  - 400 エラーを適切に返す
  - _Requirements: 2, 6_

- [ ] 6.3 RAG パイプラインの実装
  - GeminiService で query を Embedding
  - SupabaseClient で Vector Search（Top 5）
  - 取得した Chunks を Context として LLM に送信
  - LLM の回答を `ChatResponse` として返却
  - _Requirements: 2_

- [ ] 6.4 エラーハンドリングの実装
  - try-catch で外部 API のエラーをキャッチ
  - エラーコード（400, 429, 500, 503）を適切に返す
  - _Requirements: 6_

- [ ] 6.5 タイムアウトの設定
  - API 全体で 30 秒のタイムアウトを設定
  - _Requirements: 6_

- [ ] 6.6* Chat API のインテグレーションテスト
  - 実際の Gemini API と Supabase を使用して E2E テスト
  - _Requirements: 2_

### フェーズ 5: フロントエンド UI の実装

- [ ] 7. Vue.js のセットアップ
- [ ] 7.1 依存パッケージのインストール
  - `vue` をインストール: `pnpm add vue`
  - Astro の Vue インテグレーションをインストール: `pnpm astro add vue`
  - _Requirements: 1_

- [ ] 7.2 ChatWindow コンポーネントの作成
  - `src/components/ChatWindow.vue` を作成
  - State 管理（messages, isLoading, error）
  - テキストエリア（最大 500 文字）
  - 送信ボタン（Enter キーで送信、Shift+Enter で改行）
  - _Requirements: 1_

- [ ] 7.3 API 通信機能の実装
  - Fetch API で `/api/chat` に POST リクエスト
  - ローディング状態の管理
  - エラーハンドリング
  - _Requirements: 1, 6_

- [ ] 7.4 チャット履歴の表示
  - メッセージリストの表示（ユーザー・アシスタント）
  - スクロール最下部への自動移動
  - セッションストレージへの一時保存
  - _Requirements: 1_

- [ ] 7.5 スタイリング
  - レスポンシブデザイン（モバイル・デスクトップ対応）
  - ダークモード対応（既存ブログのテーマに合わせる）
  - _Requirements: 1_

- [ ] 8. Astro ページへの統合 (P)
- [ ] 8.1 SF6 専用ページの作成
  - `src/pages/sf6/patch-notes.astro` を作成
  - Static コンテンツ（説明文、使い方）を記述
  - _Requirements: 1_

- [ ] 8.2 ChatWindow を Island として追加
  - `<ChatWindow client:load />` で Hydration
  - ページの他の部分は静的 HTML として生成
  - _Requirements: 1, 7_

### フェーズ 6: テストと検証

- [ ] 9. E2E テストの実装
- [ ] 9.1 Playwright テストの作成
  - `tests/sf6-chat.spec.ts` を作成
  - ユーザーが質問を送信し、回答が表示されるテスト
  - エラー発生時のメッセージ表示テスト
  - ローディング状態の表示テスト
  - _Requirements: 1, 6_

- [ ] 9.2 E2E テストの実行
  - `pnpm run test:e2e` で実行
  - CI で自動実行されるよう設定
  - _Requirements: 1_

- [ ] 10. パフォーマンス検証
- [ ] 10.1 Lighthouse でスコア計測
  - SF6 ページで Lighthouse を実行
  - Core Web Vitals が 90 点以上であることを確認
  - _Requirements: 7_

- [ ] 10.2 API レスポンスタイムの計測
  - Chat API の p95 レスポンスタイムが 3 秒以内であることを確認
  - _Requirements: 7_

- [ ] 10.3 ベクトル検索のパフォーマンス確認
  - Supabase の SQL クエリログで検索時間を確認（100ms 以内）
  - _Requirements: 7_

### フェーズ 7: デプロイと監視の設定

- [ ] 11. Vercel 環境変数の設定
- [ ] 11.1 Vercel Dashboard で環境変数を追加
  - `GEMINI_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - _Requirements: 5_

- [ ] 11.2 プレビューデプロイでの動作確認
  - PR を作成し、Vercel のプレビューデプロイで動作確認
  - _Requirements: 5_

- [ ] 12. 監視とアラートの設定 (P)
- [ ] 12.1 Vercel Analytics の確認
  - API のレスポンスタイムとエラー率を確認
  - _Requirements: 6_

- [ ] 12.2 Supabase Dashboard で DB 使用量を確認
  - ストレージ使用量が 50 MB 以内であることを確認
  - _Requirements: 7_

- [ ] 12.3 Google Cloud Console で Gemini API 使用量を確認
  - RPM/RPD が制限内であることを確認
  - コスト見積もり（月額 50 円程度）
  - _Requirements: 7_

### フェーズ 8: ライブラリ分離の検討（将来的）

- [ ] 13. RAG コアライブラリの切り出し
- [ ] 13.1 別リポジトリの作成（`@zakizaki-ri9/rag-gemini-supabase`）
  - GeminiService と SupabaseClient を汎用化
  - Dependency Injection で設定を外部から注入可能に
  - README.md にサンプルコードを記載
  - _Requirements: 8_

- [ ] 13.2 本リポジトリでライブラリを利用
  - `pnpm add @zakizaki-ri9/rag-gemini-supabase`
  - ETL Script と Chat API で利用
  - _Requirements: 8_

## 依存関係の整理

```mermaid
graph TD
    1[1. Supabase Setup] --> 4[4. SupabaseClient]
    2[2. Gemini API Setup] --> 3[3. GeminiService]
    3 --> 5[5. ETL Script]
    4 --> 5
    3 --> 6[6. Chat API]
    4 --> 6
    6 --> 7[7. ChatWindow UI]
    7 --> 8[8. Astro Integration]
    8 --> 9[9. E2E Tests]
    9 --> 10[10. Performance Tests]
    10 --> 11[11. Deployment]
    11 --> 12[12. Monitoring]
    
    style 13 fill:#e1f5ff
    13[13. Library Separation<br/>(Future)] -.->|Refactor| 3
    13 -.->|Refactor| 4
```

## Notes

- **(P)** マークのあるタスクは並列実行可能
- **\*** マークのあるテストタスクは遅延可能（実装後に実施）
- フェーズ 8（ライブラリ分離）は将来的な検討事項であり、初期リリースには不要
