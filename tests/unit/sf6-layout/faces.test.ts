import { describe, expect, it } from "vitest";
import { filterSlotsByFace, getAlignableSlots } from "@/domain/sf6-layout/faces";
import type { ButtonSlot } from "@/domain/sf6-layout/types";

describe("faces", () => {
  const slots: ButtonSlot[] = [
    { id: "front_1", x: 0.2, y: 0.2, r: 0.03, face: "front" },
    { id: "front_2", x: 0.4, y: 0.2, r: 0.03, face: "front" },
    { id: "top_1", x: 0.2, y: 0.2, r: 0.03, face: "top" },
    { id: "default", x: 0.5, y: 0.5, r: 0.03 },
  ];

  it("face でフィルタできる", () => {
    expect(filterSlotsByFace(slots, "front").map((s) => s.id)).toEqual([
      "front_1",
      "front_2",
      "default",
    ]);
    expect(filterSlotsByFace(slots, "top").map((s) => s.id)).toEqual(["top_1"]);
  });

  it("揃え対象は自分以外の全スロット", () => {
    expect(getAlignableSlots(slots, "front_1").map((s) => s.id)).toEqual([
      "front_2",
      "top_1",
      "default",
    ]);
    expect(getAlignableSlots(slots, "top_1").map((s) => s.id)).toEqual([
      "front_1",
      "front_2",
      "default",
    ]);
  });
});
