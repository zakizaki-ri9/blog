import { describe, expect, it } from "vitest";
import { getSlotShape } from "@/domain/sf6-layout/slot-shape";

describe("getSlotShape", () => {
  it("パッドの肩はバンパーが角丸矩形、トリガーが縦長、十字はプラス、他は円", () => {
    expect(getSlotShape("slot_l1", "pad")).toBe("roundRect");
    expect(getSlotShape("slot_r1", "pad")).toBe("roundRect");
    expect(getSlotShape("slot_l2", "pad")).toBe("trigger");
    expect(getSlotShape("slot_r2", "pad")).toBe("trigger");
    expect(getSlotShape("slot_dpad", "pad")).toBe("dpad");
    expect(getSlotShape("slot_ls", "pad")).toBe("circle");
    expect(getSlotShape("slot_face_1", "pad")).toBe("circle");
  });

  it("レバー・レバーレスはすべて円", () => {
    expect(getSlotShape("slot_l1", "stick")).toBe("circle");
    expect(getSlotShape("slot_up", "leverless")).toBe("circle");
    expect(getSlotShape("slot_dpad", "stick")).toBe("circle");
  });
});
