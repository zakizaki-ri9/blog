# 実行チェックリスト

## 共通DoD
- [ ] 新規/変更分のテストがRed→Green→Refactorで確定
- [ ] Lint/型チェックが通過
- [ ] 契約テスト（該当ポート）が緑
- [ ] 変更点と残課題をIssue/PRに記録

## テストダブル
- [ ] `FakeHttp`（固定レスポンス/遅延注入）
- [ ] `FixedClock`（固定日時）
- [ ] `FixedIdGenerator`（連番/UUID固定）
- [ ] `FakeOgpGenerator`（固定PNGバイトorダミーパス）
- [ ] `InMemoryContentRepo`（投稿/タグの最小データ）

## 重要経路（E2E最低限）
- [ ] トップ→記事詳細→タグ一覧
- [ ] RSS生成（`/rss.xml`）
- [ ] OGP画像リンクの存在検証
