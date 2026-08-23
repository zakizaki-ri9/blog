import { describe, expect, it } from "vitest";
import {
  BUMPER_SIZE,
  DPAD_ARM_RATIO,
  TRIGGER_SIZE,
  dpadPath,
  getSlotAabb,
  roundRectAttrs,
  sampleSlotBoundary,
} from "@/domain/sf6-layout/slot-geometry";

describe("slot-geometry", () => {
  it("トリガーとバンパーの外接矩形は描画倍率と一致する", () => {
    const trigger = roundRectAttrs(100, 80, 20, "trigger");
    expect(trigger.width).toBeCloseTo(20 * TRIGGER_SIZE.width);
    expect(trigger.height).toBeCloseTo(20 * TRIGGER_SIZE.height);
    expect(trigger.x).toBeCloseTo(100 - trigger.width / 2);
    expect(trigger.y).toBeCloseTo(80 - trigger.height / 2);

    const bumper = roundRectAttrs(100, 80, 20, "roundRect");
    expect(bumper.width).toBeCloseTo(20 * BUMPER_SIZE.width);
    expect(bumper.height).toBeCloseTo(20 * BUMPER_SIZE.height);
  });

  it("十字パスは半径方向へ伸びる", () => {
    const d = dpadPath(50, 50, 10);
    expect(d).toContain("H 60");
    expect(d).toContain("V 60");
    expect(d).toContain(`H ${50 - 10 * DPAD_ARM_RATIO}`);
  });

  it("円の AABB は直径の正方形になる", () => {
    const box = getSlotAabb(40, 60, 10, "circle");
    expect(box).toEqual({ x: 30, y: 50, width: 20, height: 20, rx: 0 });
  });

  it("境界サンプルは各形状の外周上にある", () => {
    const circle = sampleSlotBoundary(0, 0, 10, "circle");
    expect(circle.length).toBeGreaterThanOrEqual(8);
    expect(circle.every((p) => Math.abs(Math.hypot(p.x, p.y) - 10) < 1e-6)).toBe(true);

    const trigger = sampleSlotBoundary(0, 0, 10, "trigger");
    const box = roundRectAttrs(0, 0, 10, "trigger");
    expect(trigger.some((p) => p.x === box.x && p.y === box.y)).toBe(true);
    expect(trigger.some((p) => p.x === box.x + box.width && p.y === box.y + box.height)).toBe(true);
  });
});
