import { describe, expect, it } from "vitest";
import { createLayoutScene, DEFAULT_VIEW_BOX } from "@/app/sf6-layout/create-scene";
import { PAD_BODY_PATH } from "@/data/sf6-layout/pad-body-path";
import controllersData from "@/data/sf6-layout/controllers.json";
import {
  diagnosePadLayout,
  diagnoseSlotLayout,
  flattenCubicPath,
  flattenSvgPath,
  formatConstraintViolation,
  isPointInPolygon,
} from "@/domain/sf6-layout/layout-constraints";
import type { ButtonSlot, ControllerPreset, FormFactor } from "@/domain/sf6-layout/types";

const presets = controllersData.presets as ControllerPreset[];

function bodyPath(formFactor: FormFactor): string {
  const path = createLayoutScene([], DEFAULT_VIEW_BOX, null, { formFactor }).bodyOutline.path;
  if (!path) throw new Error(`${formFactor} に外形パスがありません`);
  return path;
}

describe("layout-constraints", () => {
  it("正方形パスを平坦化し内外を判定できる", () => {
    const polygon = flattenCubicPath("M 0 0 C 0 0 10 0 10 0 C 10 0 10 10 10 10 C 10 10 0 10 0 10 C 0 10 0 0 0 0 Z");
    expect(polygon.length).toBeGreaterThan(4);
    expect(isPointInPolygon({ x: 5, y: 5 }, polygon)).toBe(true);
    expect(isPointInPolygon({ x: 20, y: 5 }, polygon)).toBe(false);
  });

  it("パッド外郭の中央は多角形の内側になる", () => {
    const polygon = flattenCubicPath(PAD_BODY_PATH);
    expect(polygon.length).toBeGreaterThan(50);
    expect(isPointInPolygon({ x: 400, y: 160 }, polygon)).toBe(true);
    expect(isPointInPolygon({ x: 10, y: 10 }, polygon)).toBe(false);
  });

  it("H/V/Q の角丸矩形を平坦化し内外を判定できる", () => {
    const d = "M 20 10 H 80 Q 90 10 90 20 V 80 Q 90 90 80 90 H 20 Q 10 90 10 80 V 20 Q 10 10 20 10 Z";
    const polygon = flattenSvgPath(d);
    expect(polygon.length).toBeGreaterThan(8);
    expect(isPointInPolygon({ x: 50, y: 50 }, polygon)).toBe(true);
    expect(isPointInPolygon({ x: 5, y: 50 }, polygon)).toBe(false);
    expect(flattenCubicPath(d)).toEqual(polygon);
  });

  it("外郭外のスロットを body outside として返す", () => {
    const slots: ButtonSlot[] = [{ id: "slot_face_1", x: 0.98, y: 0.98, r: 0.08 }];
    const violations = diagnosePadLayout(slots, PAD_BODY_PATH, DEFAULT_VIEW_BOX);
    expect(violations).toEqual([
      expect.objectContaining({
        slotId: "slot_face_1",
        kind: "body-outside",
      }),
    ]);
    expect(violations[0].outsideCount).toBeGreaterThan(0);
    expect(formatConstraintViolation(violations[0])).toMatch(/^slot_face_1: body outside \(/);
  });

  it("実形状が重なるスロットを overlap として返す", () => {
    const slots: ButtonSlot[] = [
      { id: "slot_face_1", x: 0.5, y: 0.4, r: 0.08 },
      { id: "slot_face_2", x: 0.52, y: 0.4, r: 0.08 },
    ];
    const violations = diagnosePadLayout(slots, PAD_BODY_PATH, DEFAULT_VIEW_BOX);
    expect(violations.some((v) => v.kind === "overlap" && v.slotId === "slot_face_1" && v.otherSlotId === "slot_face_2")).toBe(true);
    const overlap = violations.find((v) => v.kind === "overlap");
    expect(formatConstraintViolation(overlap!)).toBe("slot_face_1: overlap with slot_face_2");
  });

  it("汎用パッドの全スロットは外郭内で実形状が重ならない", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    const violations = diagnosePadLayout(pad?.buttonSlots ?? [], PAD_BODY_PATH, DEFAULT_VIEW_BOX);
    expect(violations.map(formatConstraintViolation), violations.map(formatConstraintViolation).join("\n")).toEqual([]);
  });

  it("汎用スティックの全スロットは外郭内で重ならない", () => {
    const stick = presets.find((p) => p.modelId === "generic-stick");
    const violations = diagnoseSlotLayout(
      stick?.buttonSlots ?? [],
      bodyPath("stick"),
      DEFAULT_VIEW_BOX,
      "stick",
    );
    expect(violations.map(formatConstraintViolation), violations.map(formatConstraintViolation).join("\n")).toEqual([]);
  });

  it("汎用レバーレスの全スロットは外郭内で重ならない", () => {
    const leverless = presets.find((p) => p.modelId === "generic-leverless");
    const violations = diagnoseSlotLayout(
      leverless?.buttonSlots ?? [],
      bodyPath("leverless"),
      DEFAULT_VIEW_BOX,
      "leverless",
    );
    expect(violations.map(formatConstraintViolation), violations.map(formatConstraintViolation).join("\n")).toEqual([]);
  });
});
