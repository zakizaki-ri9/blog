# 雑に更新するブログ

## 開発

```bash
# 開発サーバーの起動
pnpm run dev

# ビルド
pnpm run build

# ビルドしたサイトのプレビュー
pnpm run preview
```

## Dailyテンプレート生成

```bash
# 当日分を作成
pnpm daily

# タイトルと説明を指定
pnpm daily -- --title "今日のメモ" --description "1日の振り返り"

# devOnlyで作成
pnpm daily -- --title "検証メモ" --dev-only true

# ファイルを書き込まずに確認
pnpm daily -- --title "確認" --dry-run
```
