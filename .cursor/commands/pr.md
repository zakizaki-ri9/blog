# pr

**目的**: Push および Pull Request の作成・更新
**実行フロー**:
1. **Push**: `git push origin HEAD` を実行（upstream未設定時は `-u` を付加）。
2. **確認**: GitHub MCPを使用し、現在のブランチに関連するPRが既に存在するか確認する。
3. **実行**:
   - **PR未存在の場合**: MCPツール `create_pull_request` を実行。
     - Title: 実装内容の要約
     - Body: 変更点の詳細リスト（Markdown形式）
   - **PR存在済みの場合**: MCPツールを使用し、既存PRに状況を追記するか、コメントを追加して更新を通知する。
