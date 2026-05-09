import { test, expect } from "@playwright/test";

test.describe("Diaryページ", () => {
  test("一覧から詳細へ遷移できる", async ({ page }) => {
    await page.goto("/diary");

    await expect(page).toHaveTitle(/Diary/);
    await expect(page.getByRole("heading", { name: "Diary" })).toBeVisible();

    const firstCard = page.getByRole("link", { name: /フリックの手ざわり/ }).first();
    await firstCard.click();
    await expect(page).toHaveURL(/\/diary\//);
    await expect(page.getByRole("heading", { name: "フリックの手ざわり" })).toBeVisible();
  });

  test("左右キーで前後の日記に移動できる", async ({ page }) => {
    await page.goto("/diary/2026-05-06-flick-note");
    await expect(page.getByRole("heading", { name: "フリックの手ざわり" })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(page).toHaveURL("/diary/2026-05-05-notebook-start");
    await expect(page.getByRole("heading", { name: "ノートを開く" })).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL("/diary/2026-05-06-flick-note");
  });

  test("ドラッグ操作で前後の日記に移動できる", async ({ page }) => {
    await page.goto("/diary/2026-05-06-flick-note");
    const paper = page.getByLabel("日記ページ");
    await expect(paper).toBeVisible();

    const box = await paper.boundingBox();
    expect(box).not.toBeNull();

    const y = (box?.y ?? 0) + (box?.height ?? 0) / 2;
    const startX = (box?.x ?? 0) + (box?.width ?? 0) * 0.7;
    const endX = (box?.x ?? 0) + (box?.width ?? 0) * 0.2;

    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(endX, y);
    await page.mouse.up();

    await expect(page).toHaveURL("/diary/2026-05-05-notebook-start");
  });
});
