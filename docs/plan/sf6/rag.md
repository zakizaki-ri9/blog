# SF6 Patch Note RAG 機能実装計画書 (Architecture & Requirements)

## 1. プロジェクトの目的と設計思想 (Philosophy)
### 目的
既存のAstroベースの技術ブログポートフォリオ内に、ストリートファイター6のパッチノートに関する質問に回答するAIチャットツールを統合する。

### 設計思想
1.  **Island Architecture (アイランドアーキテクチャ) の採用**:
    * ブログ全体は高いパフォーマンス（Core Web Vitals）を維持するため、原則として「静的（Static）」なHTMLとして生成する。
    * チャットツール部分のみを「動的（Dynamic）」なアイランドとして部分的にHydrationし、インタラクティブな機能を提供する。
2.  **Serverless RAG**:
    * 常駐サーバーを持たず、リクエスト時のみ起動するServerless Function上でRAGの推論プロセスを完結させる。
3.  **Cost Efficiency & Sustainability**:
    * 個人運用における持続可能性を重視し、無料枠（Free Tier）の制限内で動作する堅牢な設計とする。

## 2. システムアーキテクチャ (Architecture)

### フロントエンド (UI/UX)
* **Hosting**: Static Site Hosting (Vercel)
* **Rendering Strategy**: Hybrid Rendering (SSG + SSR/CSR)
* **Interaction**:
    * チャットウィンドウは独立したUIコンポーネントとして実装し、クライアントサイドでのみJavaScriptを実行する。
    * 通信は非同期（Fetch API）で行い、ページ遷移を発生させない。

### バックエンド (API & Logic)
* **API Layer**: AstroのServer Endpoint機能を利用したREST API。
* **Logic**:
    1.  User Query Reception
    2.  Vector Embedding (via External API)
    3.  Similarity Search (via Vector DB)
    4.  Response Generation (via LLM)

### データレイヤー (Data Persistence)
* **Vector Store**: PostgreSQLベースのベクトルデータベースを採用。
    * パッチノートのテキストデータとその埋め込み表現（Embeddings）を保持する。
    * メタデータ（バージョン、キャラクター名、日付）によるフィルタリングを考慮したスキーマ設計とする。

## 3. 技術スタックの選定方針
具体的なライブラリ選定は実装時に確定するが、以下の役割を持つ技術を採用する。

* **Framework**: Astro (Core), Vue.js (Interactive UI)
* **Database**: Supabase (PostgreSQL + pgvector)
* **AI Service**: Google Gemini API (Embedding & LLM)
* **Deployment**: Vercel

## 4. データパイプライン (ETL Strategy)
データの鮮度と整合性を保つため、アプリケーション本体とは分離されたデータ取り込みフローを構築する。

* **Extraction (抽出)**: 信頼できる情報源（Wiki等）からのテキスト抽出。
* **Transformation (変換)**: 
    * LLMのContext Windowに適したサイズへのChunk分割。
    * Embeddingモデルを用いたベクトル化。
* **Loading (格納)**: データベースへのUpsert処理。
* **Execution**: 手動実行、または外部CI/CDツール（GitHub Actions等）による定期バッチ実行を想定。

## 5. 非機能要件 (Constraints)
* **API Rate Limiting**: 
    * 外部AIサービスのAPIレート制限（RPM/RPD）を厳守する設計とする。特にバッチ処理（ETL）においては、並列処理ではなく直列処理や待機時間（Sleep）の導入を必須とする。
* **Error Handling**:
    * AIサービスやDBのダウンタイム、レート制限到達時において、UIがクラッシュせず、ユーザーに適切なフィードバックを返すこと。
* **Security**:
    * APIキー等の機密情報は環境変数で管理し、クライアントサイドバンドルに流出させないこと。

## 6. 開発プロセスと役割分担 (Role Division)

本プロジェクトは、Human Developer（ユーザー）と AI Agent（Antigravity）の協業により進行する。

### 🤖 AI Agent の役割 (Responsibility)
* **技術調査と提案**: 要件を満たす最適なAstroの設定、ライブラリの組み合わせ、ディレクトリ構成の提案。
* **コード生成**: 
    * DBスキーマ（SQL）の生成。
    * ETLスクリプトの実装。
    * APIエンドポイントおよびUIコンポーネントのコーディング。
* **エラー解析**: 実装中に発生したエラーログの解析と修正案の提示。

### 👤 Human Developer の役割 (Responsibility)
* **意思決定**: Agentの提案に対する採用/不採用の判断、コードレビュー。
* **環境管理**: 
    * SaaS（Supabase, Google AI Studio, Vercel）のアカウント管理とAPIキーの発行。
    * 環境変数（`.env`）の設定。
* **実行とデプロイ**:
    * ローカル環境でのコマンド実行（npm install, script execution）。
    * Git操作および本番環境へのデプロイ。
* **法的・倫理的判断**: スクレイピング対象の規約確認およびAI倫理のチェック。
