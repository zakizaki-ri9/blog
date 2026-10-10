# GitHub Actions の SHA 固定

- `.github/workflows/` の `uses` は、公式リポジトリの 40 桁 SHA と、同行コメント `# vX.Y.Z` で書く。
- 2026-10-10 時点の固定先。checkout v7.0.1、setup-node v7.1.0、cache v6.1.0、upload-artifact v7.0.2、pnpm/action-setup v6.1.0、dependabot/fetch-metadata v3.1.0。
- setup-node v7.1.0 の package-lock は brace-expansion 5.0.12。GHSA-3jxr-9vmj-r5cp の対象外。v7.0.0 は対象だった。
- `claude_review.yml` と `.github/claude/review_prompt.md` は未使用のため削除した。claude-code-action はもう使わない。
- pnpm/action-setup v6.1.0 は `version` と package.json の `packageManager` を同時に拒否する。lint / build / e2e は `version` を渡さず `packageManager` の pnpm@9.4.0 を使う。lint / build の `run_install: false` は残している。
- 更新は `.github/dependabot.yml` の github-actions。minor / patch は auto-merge。major は個別 PR。
- 検査は `scripts/check-action-pins.sh`。`.github/workflows/lint.yml` が呼ぶ。`sha_pinning_required` はデフォルトブランチに載ってから有効にする。
