import { describe, expect, it } from "vitest";
import { createLayoutScene, DEFAULT_VIEW_BOX } from "@/app/sf6-layout/create-scene";
import { getSceneSlotCoords } from "@/components/tools/sf6/render";
import { EXPORT_SIZE } from "@/components/tools/sf6/render";

describe("createLayoutScene", () => {
  const slots = [
    { id: "slot_face_1", x: 0.5, y: 0.5, r: 0.04, label: "LP" },
    { id: "slot_face_2", x: 0.7, y: 0.4, r: 0.035, label: "MP" },
  ];

  it("プレビューとエクスポートで同一座標を生成する", () => {
    const preview = createLayoutScene(slots, DEFAULT_VIEW_BOX, "slot_face_1");
    const exportScene = createLayoutScene(slots, EXPORT_SIZE, "slot_face_1");

    expect(preview.slots[0].cx).toBeLessThan(exportScene.slots[0].cx);
    expect(preview.slots[0].label).toBe(exportScene.slots[0].label);
    const shortRatio =
      Math.min(EXPORT_SIZE.width, EXPORT_SIZE.height)
      / Math.min(DEFAULT_VIEW_BOX.width, DEFAULT_VIEW_BOX.height);
    expect(preview.slots[0].radius * shortRatio).toBeCloseTo(exportScene.slots[0].radius, 1);
  });

  it("getSceneSlotCoords が createLayoutScene と一致する", () => {
    const fromHelper = getSceneSlotCoords(slots, DEFAULT_VIEW_BOX, null);
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null);
    expect(fromHelper[0].cx).toBe(scene.slots[0].cx);
    expect(fromHelper[0].label).toBe(scene.slots[0].label);
  });

  it("パッドは一体外形パスを持ち肩帯を持たない", () => {
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null, {
      formFactor: "pad",
    });
    expect(scene.bodyOutline.path).toBeTruthy();
    expect(scene.bodyOutline.path).toMatch(/C /);
    expect(scene.bodyOutline.path?.startsWith("M 400.00 29")).toBe(true);
    expect(scene.bodyOutline.shoulderBand).toBeFalsy();
    expect(scene.chrome?.some((item) => item.kind === "shoulderLabel")).toBe(false);
    expect(scene.chrome?.some((item) => item.kind === "usbPort")).toBe(false);
  });

  it("パッド正面は DualSense 寄せ一体外形の1閉路で、中央飾りを持たない", () => {
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null, {
      formFactor: "pad",
    });
    const closed = scene.bodyOutline.path?.match(/Z/g) ?? [];
    expect(closed.length).toBe(1);
    expect(scene.bodyOutline.path).toContain("C ");
    expect(scene.bodyOutline.path).toContain("754.");
    expect(scene.bodyOutline.innerPaths ?? []).toHaveLength(0);
    expect(scene.chrome?.some((item) => item.kind === "select")).toBe(false);
    expect(scene.chrome?.some((item) => item.kind === "start")).toBe(false);
    expect(scene.chrome?.some((item) => item.kind === "rsStick")).toBe(false);
  });

  it("スロットに形状が付く", () => {
    const scene = createLayoutScene(
      [
        { id: "slot_dpad", x: 0.3, y: 0.6, r: 0.05 },
        { id: "slot_l1", x: 0.2, y: 0.17, r: 0.04 },
        { id: "slot_l2", x: 0.2, y: 0.07, r: 0.04 },
        { id: "slot_face_1", x: 0.7, y: 0.5, r: 0.04 },
      ],
      DEFAULT_VIEW_BOX,
      null,
      { formFactor: "pad" },
    );
    expect(scene.slots.find((s) => s.slotId === "slot_dpad")?.shape).toBe("dpad");
    expect(scene.slots.find((s) => s.slotId === "slot_l1")?.shape).toBe("roundRect");
    expect(scene.slots.find((s) => s.slotId === "slot_l2")?.shape).toBe("trigger");
    expect(scene.slots.find((s) => s.slotId === "slot_face_1")?.shape).toBe("circle");
  });

  it("スティックは横長筐体パスを持つ", () => {
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null, {
      formFactor: "stick",
    });
    expect(scene.bodyOutline.path).toBeTruthy();
    expect(scene.chrome?.some((item) => item.kind === "zoneDivider")).toBe(true);
  });

  it("レバーレスはタブレット型で区切り線を持たない", () => {
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null, {
      formFactor: "leverless",
    });
    expect(scene.bodyOutline.path).toBeTruthy();
    expect(scene.bodyOutline.innerPaths ?? []).toHaveLength(0);
    expect(scene.bodyOutline.height).toBeGreaterThan(350);
    expect(scene.chrome?.some((item) => item.kind === "zoneDivider")).toBeFalsy();
  });
});
