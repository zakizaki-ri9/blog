# branch

**目的**: 開発用ブランチの定義と作成
**実行フロー**:
1. **現状確認**: `git branch --show-current` で現在のブランチを確認。
2. **命名**: ユーザーの指示や直近の会話から実装内容を推測し、ブランチ名を決定する。
   - 形式: `cursor/{type}/{description}` (例: `cursor/feat/add-login-ui`)
   - **ルール**: 必ず `cursor/` をprefixにすること。
3. **作成**:
   - 既に `cursor/` 系ブランチにいる場合: そのまま使用する（作成しない）。
   - それ以外の場合: `git switch -c {決定したブランチ名}` を実行。
