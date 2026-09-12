# Dependabot auto-merge

- `blog/.github/dependabot.yml` の `auto-merge: true` は公式オプションに存在せず無視される。自動マージは `.github/workflows/dependabot-auto-merge.yml` が担当する。
- 公式経路は Settings の Allow auto-merge（本リポは既に ON）+ GitHub Actions で `dependabot/fetch-metadata@25dd0e34` (v3.1.0) + `gh pr merge --auto --squash`。
- Dependabot 起点の `pull_request` は GITHUB_TOKEN が read-only。workflow で `contents: write` / `pull-requests: write` を明示する。`pull_request_target` は使わない。
- npm は `production-minor-patch` / `development-minor-patch`、github-actions は `github-actions-minor-patch`。major は個別 PR で人手レビュー。
- ruleset `main block` (id 11912388) の必須チェック: `Build Test`, `Code Quality Check`, `E2E Tests`（`strict_required_status_checks_policy: false`、Vercel は含めない）。E2E job 表示名は `E2E Tests`。
- 未マージ PR は 30 日で rebase 停止。2026-09-12 に #104/#109/#110/#111 を close 済み。
- 調査レポート: `../private-memo/docs/research/2026-09-12-dependabot-auto-merge.md`
