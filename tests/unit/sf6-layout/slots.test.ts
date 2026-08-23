import { describe, expect, it } from "vitest";
import { switchControlScheme } from "@/app/sf6-layout/use-cases";
import {
  addSlot,
  applySchemeLabels,
  createDefaultSlot,
  createSessionFromPreset,
  removeSlot,
  resetSession,
  updateSlot,
} from "@/domain/sf6-layout/slots";
import type { ControllerPreset, MappingsData } from "@/domain/sf6-layout/types";

const preset: ControllerPreset = {
  manufacturerId: "generic",
  modelId: "generic-pad",
  displayName: "汎用パッド",
  formFactor: "pad",
  buttonSlots: [
    { id: "slot_face_1", x: 0.6, y: 0.5, r: 0.035 },
    { id: "slot_face_2", x: 0.7, y: 0.4, r: 0.035 },
  ],
  meta: {
    sourceUrl: null,
    verifiedAt: "2026-08-09",
    note: "抽象模式図",
  },
};

const mappings: MappingsData = {
  classic: { slot_face_1: "LP", slot_face_2: "MP" },
  modern: { slot_face_1: "L", slot_face_2: "M" },
};

describe("slots", () => {
  it("スロットを追加・削除できる", () => {
    const added = addSlot(preset.buttonSlots, { id: "custom_1", x: 0.5, y: 0.5, r: 0.03 });
    expect(added.length).toBe(3);
    const removed = removeSlot(added, "custom_1");
    expect(removed.length).toBe(2);
  });

  it("スロットを更新できる", () => {
    const updated = updateSlot(preset.buttonSlots, "slot_face_1", { x: 0.55 });
    expect(updated[0].x).toBe(0.55);
  });

  it("scheme ラベルを適用する", () => {
    const classic = applySchemeLabels(preset.buttonSlots, mappings, "classic");
    expect(classic[0].label).toBe("LP");
    const modern = applySchemeLabels(preset.buttonSlots, mappings, "modern");
    expect(modern[0].label).toBe("L");
  });

  it("カスタムスロットのラベルは scheme 切替後も維持する", () => {
    const session = createSessionFromPreset(preset, "classic", mappings);
    const withCustom = {
      ...session,
      slots: addSlot(session.slots, {
        id: "custom_1",
        x: 0.5,
        y: 0.5,
        r: 0.03,
        label: "MyLabel",
      }),
    };
    const switched = switchControlScheme(withCustom, "modern", mappings);
    const custom = switched.slots.find((s) => s.id === "custom_1");
    expect(custom?.label).toBe("MyLabel");
    expect(switched.slots[0].label).toBe("L");
  });

  it("プリセットからセッションを生成しリセットできる", () => {
    const session = createSessionFromPreset(preset, "classic", mappings);
    expect(session.baseModelId).toBe("generic-pad");
    const modifiedSlots = updateSlot(session.slots, "slot_face_1", { x: 0.1 });
    const reset = resetSession(preset, "classic", mappings);
    expect(reset.slots[0].x).not.toBe(modifiedSlots[0].x);
  });

  it("カスタムスロット ID を生成する", () => {
    const slot = createDefaultSlot(preset.buttonSlots);
    expect(slot.id).toBe("custom_1");
  });
});
