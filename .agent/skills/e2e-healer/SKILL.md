---
name: e2e-healer
description: 壊れたPlaywright E2Eテストを自動修復するスキル
---

# E2E Healer Skill

このスキルは、失敗したPlaywright E2Eテストを解析し、自動的に修復します。

## 前提条件

- 失敗したテストの実行結果があること
- 開発サーバーが起動可能であること

## 実行手順

### 1. テスト実行と失敗の検出

```bash
pnpm test:e2e
```

失敗したテストを特定

### 2. 失敗原因の分析

Playwrightのエラーメッセージから原因を特定：

| エラータイプ | 原因 | 修復アプローチ |
|------------|------|--------------|
| `locator.click: Error` | セレクターが見つからない | `browser_subagent`で現在のUIを確認し、セレクター更新 |
| `expect(locator).toBeVisible` | 要素が表示されない | 待機時間追加または条件変更 |
| `expect(page).toHaveTitle` | タイトル変更 | 期待値を更新 |
| `Timeout` | ページ読み込み遅延 | タイムアウト値調整 |

### 3. 現在のUIの確認

`browser_subagent` を使用して現在のページ状態を確認：

1. 該当ページを開く
2. 対象要素の現在の状態を確認
3. アクセシビリティツリーを分析

### 4. テストコードの修正

失敗原因に応じてテストコードを修正：

**セレクター変更の例**:
```typescript
// Before: 壊れたセレクター
await page.locator('.old-class').click();

// After: 安定したセレクター
await page.getByRole('button', { name: '送信' }).click();
```

**待機追加の例**:
```typescript
// Before: 即時チェック
await expect(page.getByText('完了')).toBeVisible();

// After: 待機を追加
await expect(page.getByText('完了')).toBeVisible({ timeout: 10000 });
```

### 5. 修正後の検証

```bash
pnpm test:e2e
```

修正したテストが通ることを確認

### 6. 修正のコミット

修正内容を確認し、適切なコミットメッセージで保存：

```
fix(test): [テスト名]のセレクターを更新
```

## 自動修復の限界

以下の場合は手動対応が必要：

- **仕様変更**: 機能自体が変更された場合
- **新規要素**: 新しいUIコンポーネントが追加された場合
- **根本的な設計問題**: テスト設計自体に問題がある場合

これらの場合は `/e2e-plan` → `/e2e-gen` の再実行を推奨
