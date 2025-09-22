# 推奨コマンド

## 開発コマンド
```bash
# 開発サーバー起動
pnpm run dev

# 本番ビルド
pnpm run build

# ビルド結果のプレビュー
pnpm run preview

# Astroコマンドの直接実行
pnpm run astro
```

## コード品質管理
```bash
# リント実行
pnpm run lint

# リント自動修正
pnpm run lint:fix
```

## パッケージ管理
```bash
# 依存関係インストール
pnpm install

# 依存関係追加
pnpm add <package-name>

# 開発依存関係追加
pnpm add -D <package-name>

# 依存関係更新
pnpm update
```

## Git操作
```bash
# ステータス確認
git status

# 変更をステージング
git add <file>

# コミット
git commit -m "message"

# プッシュ
git push

# ブランチ作成
git checkout -b <branch-name>
```

## システムコマンド（macOS）
```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd <directory>

# ファイル検索
find . -name "*.ts" -type f

# 文字列検索
grep -r "pattern" src/

# プロセス確認
ps aux | grep node
```