import { test, expect } from "@playwright/test";

test.describe("スモークテスト", () => {
  test("トップページが正常に表示される", async ({ page }) => {
    await page.goto("/");

    // サイトタイトルが含まれているか
    await expect(page).toHaveTitle(/Zaki Blog/);

    // ナビゲーションが表示されているか
    await expect(page.getByRole("navigation")).toBeVisible();

    // 記事が1件以上表示されているか
    const articles = page.getByRole("listitem");
    await expect(articles.first()).toBeVisible();
  });
});
