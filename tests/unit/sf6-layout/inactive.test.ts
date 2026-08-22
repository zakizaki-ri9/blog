import { describe, expect, it } from "vitest";
import { createLayoutScene, DEFAULT_VIEW_BOX } from "@/app/sf6-layout/create-scene";

describe("createLayoutScene inactive dimming", () => {
  const slots = [
    { id: "slot_dpad", x: 0.2, y: 0.4, r: 0.05 },
    { id: "slot_ls", x: 0.3, y: 0.6, r: 0.04 },
    { id: "slot_face_1", x: 0.7, y: 0.5, r: 0.04, inactive: true },
  ];

  it("初期は十字も左STも薄表示しない", () => {
    const scene = createLayoutScene(slots.slice(0, 2), DEFAULT_VIEW_BOX, null, {
      formFactor: "pad",
    });
    expect(scene.slots.every((s) => !s.dimmed)).toBe(true);
    expect(scene.chrome ?? []).toEqual([]);
  });

  it("inactive のスロットだけ薄表示する", () => {
    const scene = createLayoutScene(slots, DEFAULT_VIEW_BOX, null, {
      formFactor: "pad",
    });
    expect(scene.slots.find((s) => s.slotId === "slot_dpad")?.dimmed).toBe(false);
    expect(scene.slots.find((s) => s.slotId === "slot_ls")?.dimmed).toBe(false);
    expect(scene.slots.find((s) => s.slotId === "slot_face_1")?.dimmed).toBe(true);
  });

  it("非パッドでも inactive は薄表示する", () => {
    const scene = createLayoutScene(
      [{ id: "slot_face_1", x: 0.5, y: 0.5, r: 0.04, inactive: true }],
      DEFAULT_VIEW_BOX,
      null,
      { formFactor: "stick" },
    );
    expect(scene.slots[0].dimmed).toBe(true);
  });
});
