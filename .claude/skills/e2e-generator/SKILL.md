---
name: e2e-generator
description: テスト計画からPlaywright E2Eテストコードを生成するスキル
---

# E2E Generator Skill

このスキルは、テスト計画書（Markdown）を読み込み、PlaywrightによるE2Eテストコードを生成します。

## 前提条件

- テスト計画書が存在すること（`docs/e2e-plan.md`または指定ファイル）
- Playwrightがインストール済みであること

## 実行手順

### 1. テスト計画の読み込み

テスト計画書を読み込み、各テストケースを解析します。

### 2. テストコードの生成

各テストケースに対して、以下のテンプレートでPlaywrightコードを生成：

```typescript
import { test, expect } from '@playwright/test';

test.describe('[テストグループ名]', () => {
  test('[テストケース名]', async ({ page }) => {
    // 1. ページ遷移
    await page.goto('/');

    // 2. 要素の検証
    await expect(page.getByRole('...')).toBeVisible();

    // 3. インタラクション
    await page.getByRole('button', { name: '...' }).click();

    // 4. 結果の確認
    await expect(page).toHaveURL('/expected-path');
  });
});
```

### 3. セレクター戦略

**推奨（壊れにくい順）**:

| 優先度 | セレクター | 例 |
|-------|-----------|-----|
| 1 | `getByRole()` | `getByRole('button', { name: '送信' })` |
| 2 | `getByText()` | `getByText('ようこそ')` |
| 3 | `getByLabel()` | `getByLabel('メールアドレス')` |
| 4 | `getByTestId()` | `getByTestId('nav-menu')`（乱用注意） |

**避けるべき**:
- CSSクラスセレクター（`.btn-primary`）
- 複雑なXPath
- DOM構造に依存するセレクター

### 4. 出力先

生成したテストコードは以下に保存：

```
tests/e2e/[テスト名].spec.ts
```

### 5. 生成後の確認

```bash
pnpm test:e2e
```

テストが正常に実行されることを確認

## 注意事項

- 1テストファイル = 1つの機能/ユーザーフロー
- テストは独立して実行可能であること
- 環境に依存しない（CI/ローカル両方で動作）
