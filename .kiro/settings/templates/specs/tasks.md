# 実装計画

## タスクフォーマットテンプレート

作業分解に合ったパターンを使用してください:

### 主要タスクのみ
- [ ] {{NUMBER}}. {{TASK_DESCRIPTION}}{{PARALLEL_MARK}}
  - {{DETAIL_ITEM_1}} *(必要な場合のみ詳細を含める。タスクが単独で成立する場合は、箇条書き項目を省略する。)*
  - _Requirements: {{REQUIREMENT_IDS}}_

### 主要 + サブタスク構造
- [ ] {{MAJOR_NUMBER}}. {{MAJOR_TASK_SUMMARY}}
- [ ] {{MAJOR_NUMBER}}.{{SUB_NUMBER}} {{SUB_TASK_DESCRIPTION}}{{SUB_PARALLEL_MARK}}
  - {{DETAIL_ITEM_1}}
  - {{DETAIL_ITEM_2}}
  - _Requirements: {{REQUIREMENT_IDS}}_ *(IDのみ; 説明や括弧を追加しないこと。)*

> **並行マーカー**: 並行して実行できるタスクにのみ ` (P)` を追加する。`--sequential` モードで実行する場合はマーカーを省略する。
>
> **オプションのテストカバレッジ**: サブタスクが受け入れ基準に紐付いた延期可能なテスト作業である場合、チェックボックスを `- [ ]*` としてマークし、詳細箇条書きで参照要件を説明する。