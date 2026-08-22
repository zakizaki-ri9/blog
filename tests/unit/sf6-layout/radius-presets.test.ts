import { describe, expect, it } from "vitest";
import {
  defaultSlotRadius,
  getRadiusSteps,
  nearestRadiusIndex,
  radiusAtIndex,
} from "@/domain/sf6-layout/radius-presets";
import { createDefaultSlot } from "@/domain/sf6-layout/slots";

describe("radius-presets", () => {
  it("パッドは 5 段階（小から大）", () => {
    expect(getRadiusSteps("pad")).toEqual([0.065, 0.080, 0.085, 0.107, 0.117]);
  });

  it("レバーは 2 段階", () => {
    expect(getRadiusSteps("stick")).toEqual([0.080, 0.110]);
  });

  it("レバーレスは 2 段階", () => {
    expect(getRadiusSteps("leverless")).toEqual([0.078, 0.092]);
  });

  it("半径と index を往復できる", () => {
    expect(nearestRadiusIndex(0.085, "pad")).toBe(2);
    expect(radiusAtIndex(2, "pad")).toBe(0.085);
    expect(nearestRadiusIndex(0.070, "pad")).toBe(0);
    expect(nearestRadiusIndex(0.200, "pad")).toBe(4);
    expect(radiusAtIndex(-1, "pad")).toBe(0.065);
    expect(radiusAtIndex(99, "pad")).toBe(0.117);
  });

  it("追加スロットの初期半径は中段（面 / 通常）", () => {
    expect(defaultSlotRadius("pad")).toBe(0.085);
    expect(defaultSlotRadius("stick")).toBe(0.080);
    expect(defaultSlotRadius("leverless")).toBe(0.078);
    expect(createDefaultSlot([], undefined, "pad").r).toBe(0.085);
    expect(createDefaultSlot([], undefined, "stick").r).toBe(0.080);
    expect(createDefaultSlot([], undefined, "leverless").r).toBe(0.078);
  });
});
