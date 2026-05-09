---
agent: "agent"
description: "ReviewからPR作成までの一連フローをCopilotで実行する"
---

# All-Commit Workflow for Copilot

このプロンプトは、開発の区切りで品質チェックからPR作成までを順番に実行するためのものです。

## 実行方針

- 各ステップの開始前に、実行内容を短く共有する
- 各ステップ完了後に、結果と次ステップを共有する
- 問題が発生した場合はそこで停止し、原因と対処案を提示する
- 既存の未関連変更は巻き戻さない

## 実行ステップ

1. Review
- [../../.claude/skills/review/SKILL.md](../../.claude/skills/review/SKILL.md) を参照して実行する
- 必要な自動チェック（lint, type-check, security-check）を実施する
- 手動レビュー項目を確認する

2. Branch
- [../../.claude/skills/branch/SKILL.md](../../.claude/skills/branch/SKILL.md) を参照して実行する
- ブランチ命名規則に従って作成または確認する

3. Commit
- [../../.claude/skills/commit/SKILL.md](../../.claude/skills/commit/SKILL.md) を参照して実行する
- Conventional Commitsに準拠した日本語コミットを作成する

4. PR
- [../../.claude/skills/pr/SKILL.md](../../.claude/skills/pr/SKILL.md) を参照して実行する
- PR本文に、変更概要・検証結果・影響範囲・未対応事項を明記する

## 完了条件

- Review, Branch, Commit, PR の4ステップが完了している
- 失敗ステップがある場合は、未完了理由と次のアクションが明記されている
