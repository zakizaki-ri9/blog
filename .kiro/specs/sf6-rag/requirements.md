# SF6 パッチノート RAG 機能 要件定義書

## Introduction

本機能は、既存の Astro ベースの技術ブログポートフォリオ内に、ストリートファイター6（SF6）のパッチノートに関する質問に回答する AI チャットツールを統合するものです。Island Architecture を採用し、ブログ全体の高いパフォーマンスを維持しながら、特定のページでのみ動的なインタラクティブ機能を提供します。

### 設計思想

- **Island Architecture**: ブログ本体は静的 HTML、チャット部分のみ動的 Hydration
- **Serverless RAG**: 常駐サーバー不要、リクエスト時のみ Serverless Function で処理
- **Cost Efficiency**: 個人運用における持続可能性を重視、無料枠内での動作を目標

### 技術スタック（予定）

- **Framework**: Astro (SSG), Vue.js (Interactive UI)
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI Service**: Google Gemini API (Embedding & LLM)
- **Deployment**: Vercel

## Requirements

### Requirement 1: チャット UI の実装

**Objective:** As a **ブログ訪問者**, I want **SF6 パッチノートに関する質問をチャット形式で投げかける**, so that **手動で膨大なパッチノートを検索することなく、必要な情報を素早く取得できる**

#### Acceptance Criteria

1. When ユーザーが SF6 関連ページにアクセスした際、the システムは チャットウィンドウ UI を表示する
2. When ユーザーがチャット入力欄にテキストを入力し送信ボタンを押した際、the システムは API リクエストを非同期で送信し、ローディング状態を表示する
3. When API からレスポンスが返却された際、the システムは チャット履歴にユーザーの質問と AI の回答を追加表示する
4. If API エラーが発生した際、the システムは ユーザーに適切なエラーメッセージを表示し、UI がクラッシュしないようにする
5. The チャット UI は ページの他の静的コンテンツに影響を与えず、独立した Island として動作する

#### Technical Notes

- チャットウィンドウは Vue.js で実装し、Astro の `client:load` または `client:idle` ディレクティブで Hydration
- レスポンシブデザイン対応（モバイル・デスクトップ両対応）

### Requirement 2: RAG バックエンド API の実装

**Objective:** As a **システム**, I want **ユーザーの質問を受け取り、関連するパッチノート情報を検索して LLM で回答を生成する**, so that **正確で文脈に即した回答を提供できる**

#### Acceptance Criteria

1. When ユーザーから質問が POST リクエストとして送信された際、the API は リクエストボディから質問テキストを抽出する
2. When 質問テキストを受け取った際、the システムは Gemini API を使用して質問をベクトル埋め込み（Embedding）に変換する
3. When ベクトル埋め込みが生成された際、the システムは Supabase の pgvector を使用して類似度検索（Similarity Search）を実行し、関連するパッチノート情報を取得する
4. When 関連情報が取得された際、the システムは 取得した情報をコンテキストとして Gemini API (LLM) に質問と共に送信し、自然言語での回答を生成する
5. When LLM から回答が生成された際、the システムは 回答を JSON 形式でクライアントに返却する
6. If 外部 API（Gemini, Supabase）でエラーが発生した際、the システムは 適切なエラーハンドリングを行い、ユーザーフレンドリーなエラーメッセージを返却する

#### Technical Notes

- Astro の Server Endpoint (`/pages/api/chat.ts`) で実装
- Serverless Function として Vercel にデプロイ
- API キーは環境変数で管理（`.env`）、クライアントサイドに流出させない

### Requirement 3: データパイプライン（ETL）の構築

**Objective:** As a **システム管理者**, I want **SF6 のパッチノート情報を自動的に取得・変換・格納する**, so that **最新のパッチノート情報に基づいた回答が可能になる**

#### Acceptance Criteria

1. When データ取り込みスクリプトが実行された際、the システムは 信頼できる情報源（Wiki 等）から SF6 パッチノートのテキストデータを抽出する
2. When テキストデータが抽出された際、the システムは LLM の Context Window に適したサイズ（例: 512 トークン単位）に Chunk 分割する
3. When Chunk 分割が完了した際、the システムは 各 Chunk を Gemini Embedding API でベクトル化する
4. When ベクトル化が完了した際、the システムは Supabase にメタデータ（バージョン、キャラクター名、日付）と共に Upsert する
5. The スクリプトは API レート制限（RPM/RPD）を遵守し、並列処理ではなく直列処理 + Sleep で実行する

#### Technical Notes

- TypeScript スクリプトとして実装（`scripts/etl-sf6-patchnotes.ts`）
- 手動実行、または GitHub Actions での定期実行を想定
- 処理進捗のログ出力

### Requirement 4: データベーススキーマの設計

**Objective:** As a **システム**, I want **パッチノート情報とベクトル埋め込みを効率的に保存・検索できる**, so that **高速な類似度検索が可能になる**

#### Acceptance Criteria

1. The データベースは PostgreSQL + pgvector 拡張を使用する
2. The テーブルは 以下のカラムを持つ:
   - `id` (UUID, Primary Key)
   - `content` (TEXT, パッチノートの Chunk テキスト)
   - `embedding` (VECTOR, ベクトル埋め込み)
   - `metadata` (JSONB, バージョン、キャラクター名、日付などのメタデータ)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)
3. The システムは `embedding` カラムに対してベクトルインデックスを作成し、類似度検索を高速化する
4. The システムは `metadata` の特定フィールド（例: `character`）に対するフィルタリングをサポートする

#### Technical Notes

- Supabase の SQL Editor でスキーマを作成
- Migration ファイルとしてバージョン管理

### Requirement 5: セキュリティとレート制限

**Objective:** As a **システム管理者**, I want **API キーの漏洩を防ぎ、過剰なリクエストを制限する**, so that **セキュリティリスクとコストの増大を防ぐ**

#### Acceptance Criteria

1. The API キー（Gemini API Key, Supabase API Key）は 環境変数（`.env`）で管理され、リポジトリにコミットされない
2. The API キーは クライアントサイドのバンドルに含まれず、Server 側でのみ使用される
3. If API レート制限に達した際、the システムは リトライロジックまたは適切なエラーメッセージを返す
4. The システムは CORS 設定を適切に行い、不正なオリジンからのリクエストを拒否する

#### Technical Notes

- `.env.example` を用意し、必要な環境変数を明示
- Vercel の Environment Variables で本番環境の環境変数を設定

### Requirement 6: エラーハンドリングとユーザーフィードバック

**Objective:** As a **ブログ訪問者**, I want **システムエラーが発生した場合でも適切なフィードバックを受け取る**, so that **何が起こったのか理解でき、再試行などの対応ができる**

#### Acceptance Criteria

1. When 外部 API がダウンしている際、the システムは 「現在サービスが利用できません。しばらくしてから再度お試しください」というメッセージを表示する
2. When レート制限に達した際、the システムは 「リクエストが多すぎます。しばらく待ってから再度お試しください」というメッセージを表示する
3. When ネットワークエラーが発生した際、the システムは 「通信エラーが発生しました。接続を確認してください」というメッセージを表示する
4. The UI は エラー発生時もクラッシュせず、ユーザーが再試行できる状態を維持する

#### Technical Notes

- try-catch によるエラーハンドリング
- ユーザーフレンドリーなエラーメッセージの UI 表示

### Requirement 7: パフォーマンスとコスト効率

**Objective:** As a **プロジェクトオーナー**, I want **機能を無料枠内で運用し、ブログ全体のパフォーマンスを維持する**, so that **持続可能な個人プロジェクトとして運営できる**

#### Acceptance Criteria

1. The ブログ全体の Core Web Vitals（LCP, FID, CLS）は 機能追加後も「Good」スコアを維持する
2. The チャット機能は ブログの他のページには影響を与えず、必要なページでのみロードされる
3. The Gemini API の使用は 月額無料枠（15 RPM, 1500 RPD）と従量課金（月額 50 円程度）の範囲内に収める
4. The Supabase の使用は Free Tier の範囲内（500 MB ストレージ、50 MB データベース）に収める
5. The Serverless Function は コールドスタート時間を考慮し、初回応答が 3 秒以内に完了する

#### Technical Notes

- パフォーマンス計測ツール（Lighthouse, Web Vitals）での検証
- コスト監視とアラート設定（Supabase, Google Cloud Console）

## Requirement 8: ライブラリの分離と再利用性

**Objective:** As a **開発者**, I want **RAG 機能の汎用部分を別リポジトリに切り出す**, so that **他のプロジェクトでも再利用可能なライブラリとして提供できる**

#### Acceptance Criteria

1. The RAG の汎用ロジック（Embedding 生成、ベクトル検索、LLM 呼び出し）は ブログ本体から独立したモジュールとして実装される
2. The ライブラリは npm パッケージとして公開可能な形式で実装される（TypeScript + ESM）
3. The ライブラリは Gemini API と Supabase に依存するが、設定を外部から注入可能にする（Dependency Injection）
4. The ドキュメント（README.md）に使用方法とサンプルコードを記載する

#### Technical Notes

- 別リポジトリでの実装を検討（例: `@zakizaki-ri9/rag-gemini-supabase`）
- 本ブログプロジェクトでは、そのライブラリを依存として利用
