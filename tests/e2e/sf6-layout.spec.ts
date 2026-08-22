import { test, expect } from "@playwright/test";
import { SESSION_STORAGE_KEY } from "@/app/sf6-layout/session-schema";

async function openSlotMenu(page: import("@playwright/test").Page, slotId: string): Promise<void> {
  await page.locator(`.sf6-slot[data-slot-id='${slotId}']`).click({ button: "right" });
  await expect(page.getByRole("menu", { name: "スロット操作" })).toBeVisible();
}

async function openCanvasMenu(page: import("@playwright/test").Page): Promise<void> {
  await page.getByLabel("コントローラー配置プレビュー").click({ button: "right", position: { x: 12, y: 12 } });
  await expect(page.getByRole("menu", { name: "スロット操作" })).toBeVisible();
}

test.describe("SF6 配置ビジュアライザ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tools/sf6/layout");
    await page.evaluate((key) => localStorage.removeItem(key), SESSION_STORAGE_KEY);
    await page.reload();
  });

  test("ページが表示され免責文言がある", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "SF6 配置エディター" })).toBeVisible();
    await expect(page.getByText("本ツールは非公式")).toBeVisible();
    await expect(page.getByLabel("コントローラー配置プレビュー")).toBeVisible();
  });

  test("テンプレート切替でスロット数が変わる", async ({ page }) => {
    await expect(page.locator(".sf6-slot")).toHaveCount(10);
    await page.locator(".sf6-sidebar").getByRole("button", { name: "レバー", exact: true }).click();
    await expect(page.locator(".sf6-slot")).toHaveCount(9);
    await page.locator(".sf6-sidebar").getByRole("button", { name: "レバーレス" }).click();
    await expect(page.locator(".sf6-slot")).toHaveCount(15);
  });

  test("パッドは肩と正面を同一キャンバスに表示する", async ({ page }) => {
    await expect(page.locator(".sf6-slot")).toHaveCount(10);
    await expect(page.locator(".sf6-slot[data-slot-id='slot_face_1']")).toBeVisible();
    await expect(page.locator(".sf6-slot[data-slot-id='slot_l1']")).toBeVisible();
    await expect(page.locator(".sf6-slot[data-slot-id='slot_dpad']")).toBeVisible();
    await expect(page.getByLabel("パッド表示面")).toHaveCount(0);
    await expect(page.getByText("上面（肩ボタン）")).toHaveCount(0);
  });

  test("パッドはグリップ外形パスで描画する", async ({ page }) => {
    const path = page.locator("#sf6-body-path");
    await expect(path).toBeVisible();
    const d = await path.getAttribute("d");
    expect(d).toContain("C");
    await expect(page.locator("#sf6-body-outline")).toBeHidden();
  });

  test("割り当ては円内の短文で表示し吹き出しは出ない", async ({ page }) => {
    await expect(page.locator(".sf6-callout")).toHaveCount(0);
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "弱P" })).toHaveCount(1);
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "中P" }).first()).toBeVisible();
    await expect(page.locator("#sf6-slots")).not.toContainText("LP");
  });

  test("Classic 初期は公式ダイヤ（左=弱P、上=中P）", async ({ page }) => {
    await expect(page.locator(".sf6-slot[data-slot-id='slot_face_4']")).toBeVisible();
    await expect(page.locator(".sf6-slot[data-slot-id='slot_face_1']")).toBeVisible();
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "弱P" })).toHaveCount(1);
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: /^中P$/ })).toHaveCount(1);
  });

  test("Modern 切替後は △ が SP", async ({ page }) => {
    await page.locator(".sf6-sidebar [data-scheme-chip='modern']").click();
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "SP" }).first()).toBeVisible();
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "弱" }).first()).toBeVisible();
  });

  test("組み合わせラベルは弱中強を残して表示する", async ({ page }) => {
    await page.locator(".sf6-sidebar").getByRole("button", { name: "レバー", exact: true }).click();
    await openSlotMenu(page, "slot_l2");
    await page.getByRole("menuitem", { name: "ラベル" }).click();
    await page.getByRole("menuitem", { name: "弱P+中P+強P" }).click();
    await expect(page.locator("#sf6-slots")).toContainText("弱P");
    await expect(page.locator("#sf6-slots")).toContainText("+中P");
    await expect(page.locator("#sf6-slots")).toContainText("+強P");
  });

  test("パッド初期は十字も左STも薄表示しない", async ({ page }) => {
    await expect(page.locator("[data-slot-id='slot_ls'].sf6-slot-dimmed")).toHaveCount(0);
    await expect(page.locator("[data-slot-id='slot_dpad'].sf6-slot-dimmed")).toHaveCount(0);
    await expect(page.getByText("移動:")).toHaveCount(0);
  });

  test("右クリックで非活性にすると薄表示になる", async ({ page }) => {
    await openSlotMenu(page, "slot_ls");
    await page.getByRole("menuitem", { name: "非活性にする" }).click();
    await expect(page.locator("[data-slot-id='slot_ls'].sf6-slot-dimmed")).toHaveCount(1);
    await openSlotMenu(page, "slot_ls");
    await page.getByRole("menuitem", { name: "活性にする" }).click();
    await expect(page.locator("[data-slot-id='slot_ls'].sf6-slot-dimmed")).toHaveCount(0);
  });

  test("空キャンバスの右クリックでボタン追加できる", async ({ page }) => {
    await page.locator(".sf6-sidebar").getByRole("button", { name: "レバー", exact: true }).click();
    const slots = page.locator(".sf6-slot");
    const before = await slots.count();
    await openCanvasMenu(page);
    await page.getByRole("menuitem", { name: "ボタン追加" }).click();
    await expect(slots).toHaveCount(before + 1);
  });

  test("scheme 切替で Modern ラベルへ変わる", async ({ page }) => {
    await page.locator(".sf6-sidebar [data-scheme-chip='modern']").click();
    await expect(page.locator(".sf6-slot-badge").filter({ hasText: "SP" })).toHaveCount(1);
  });

  test("カスタムスロットのラベルは scheme 切替後も維持する", async ({ page }) => {
    await openCanvasMenu(page);
    await page.getByRole("menuitem", { name: "ボタン追加" }).click();
    await openSlotMenu(page, "custom_1");
    await page.getByRole("menuitem", { name: "ラベル" }).click();
    await page.getByRole("menuitem", { name: "投", exact: true }).click();
    await page.locator(".sf6-sidebar [data-scheme-chip='modern']").click();
    await expect(page.locator("#sf6-slots")).toContainText("投");
  });

  test("選択時に揃え補助線が表示される", async ({ page }) => {
    await page.locator(".sf6-slot[data-slot-id='slot_face_1']").click();
    const guideOnSelect = await page.locator(".sf6-align-guide").count();
    expect(guideOnSelect).toBeGreaterThan(0);
  });

  test("ドラッグ後に座標が変わり undo で戻せる", async ({ page }) => {
    const slot = page.locator(".sf6-slot[data-slot-id='slot_face_1']");
    const svg = page.getByLabel("コントローラー配置プレビュー");
    const startCx = await slot.evaluate((el) => el.getAttribute("cx"));

    await slot.dragTo(svg, {
      targetPosition: { x: 200, y: 200 },
    });

    const afterCx = await slot.evaluate((el) => el.getAttribute("cx"));
    expect(afterCx).not.toBe(startCx);

    await page.getByRole("button", { name: "元に戻す" }).click();
    const undoneCx = await slot.evaluate((el) => el.getAttribute("cx"));
    expect(undoneCx).toBe(startCx);
  });

  test("スロットをクリックしただけでは座標が変わらない", async ({ page }) => {
    const slot = page.locator(".sf6-slot[data-slot-id='slot_face_1']");
    const startCx = await slot.evaluate((el) => el.getAttribute("cx"));
    const startCy = await slot.evaluate((el) => el.getAttribute("cy"));

    await slot.click();

    const afterCx = await slot.evaluate((el) => el.getAttribute("cx"));
    const afterCy = await slot.evaluate((el) => el.getAttribute("cy"));
    expect(afterCx).toBe(startCx);
    expect(afterCy).toBe(startCy);
  });

  test("縦揃えで選択スロットの x が他と揃う", async ({ page }) => {
    await page.locator(".sf6-sidebar").getByRole("button", { name: "レバー", exact: true }).click();
    await openCanvasMenu(page);
    await page.getByRole("menuitem", { name: "ボタン追加" }).click();
    const refCx = await page.locator(".sf6-slot[data-slot-id='slot_face_1']").evaluate((el) => el.getAttribute("cx"));
    await page.locator(".sf6-slot[data-slot-id='custom_1']").click();
    await page.getByRole("button", { name: "縦揃え" }).click();
    const alignedCx = await page.locator(".sf6-slot[data-slot-id='custom_1']").evaluate((el) => el.getAttribute("cx"));
    expect(alignedCx).toBe(refCx);
  });

  test("大きさスライダー・削除・リセットが動作する", async ({ page }) => {
    const beforeDelete = await page.locator(".sf6-slot").count();
    const slot = page.locator(".sf6-slot[data-slot-id='slot_face_1']");
    await slot.click();
    const startR = await slot.evaluate((el) => el.getAttribute("r"));
    const slider = page.locator(".sf6-sidebar").getByLabel("大きさ");
    await expect(slider).toBeEnabled();
    await slider.fill("0");
    const afterR = await slot.evaluate((el) => el.getAttribute("r"));
    expect(afterR).not.toBe(startR);
    await expect(page.locator(".sf6-sidebar").getByText("1 / 5")).toBeVisible();

    await openSlotMenu(page, "slot_face_1");
    await page.getByRole("menuitem", { name: "削除" }).click();
    await expect(page.locator(".sf6-slot")).toHaveCount(beforeDelete - 1);

    await page.getByRole("button", { name: "リセット" }).click();
    await expect(page.locator(".sf6-slot")).toHaveCount(beforeDelete);
  });

  test("localStorage 復元と破損データのフォールバック", async ({ page }) => {
    await openCanvasMenu(page);
    await page.getByRole("menuitem", { name: "ボタン追加" }).click();
    await page.reload();
    await expect(page.locator(".sf6-slot[data-slot-id='custom_1']")).toBeVisible();

    await page.evaluate((key) => {
      localStorage.setItem(key, "{broken");
    }, SESSION_STORAGE_KEY);
    await page.reload();
    await expect(page.locator(".sf6-slot[data-slot-id='custom_1']")).toHaveCount(0);
  });

  test("inactive を localStorage から復元する", async ({ page }) => {
    await openSlotMenu(page, "slot_dpad");
    await page.getByRole("menuitem", { name: "非活性にする" }).click();
    await page.reload();
    await expect(page.locator("[data-slot-id='slot_dpad'].sf6-slot-dimmed")).toHaveCount(1);
  });

  test("キーボードで選択・移動できる", async ({ page }) => {
    await page.locator(".sf6-slot[data-slot-id='slot_face_1']").click();
    const svg = page.getByLabel("コントローラー配置プレビュー");
    await svg.focus();
    const slot = page.locator(".sf6-slot[data-slot-id='slot_face_1']");
    const startCx = await slot.evaluate((el) => el.getAttribute("cx"));
    await page.keyboard.press("ArrowRight");
    const afterCx = await slot.evaluate((el) => el.getAttribute("cx"));
    expect(Number(afterCx)).toBeGreaterThan(Number(startCx));
  });

  test("PNG ダウンロードが非空の PNG を生成する", async ({ page }) => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "画像を保存" }).click();
    const download = await downloadPromise;
    const path = await download.path();
    expect(path).toBeTruthy();

    const fs = await import("node:fs");
    const buffer = fs.readFileSync(path!);
    expect(buffer.length).toBeGreaterThan(100);
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50);
    expect(buffer[2]).toBe(0x4E);
    expect(buffer[3]).toBe(0x47);
  });

  test("参考リンクは sourceUrl があるプリセットで表示", async ({ page }) => {
    const link = page.getByRole("link", { name: "参考にしたコントローラー" });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute(
      "href",
      "https://www.playstation.com/ja-jp/accessories/dualsense-wireless-controller/",
    );
    await expect(page.getByText("ボタン配置の相対関係を参考にした抽象模式図")).toBeVisible();
  });

  test("右クリックでラベルを変更できる", async ({ page }) => {
    await openSlotMenu(page, "slot_face_1");
    await page.getByRole("menuitem", { name: "ラベル" }).click();
    await page.getByRole("menuitem", { name: "投", exact: true }).click();
    await expect(page.locator("#sf6-slots")).toContainText("投");
  });
});
