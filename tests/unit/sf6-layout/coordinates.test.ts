import { describe, expect, it } from "vitest";
import {
  applyGrab,
  clampPosition,
  clampRadius,
  clampSlot,
  DRAG_MOVE_THRESHOLD,
  grabOffset,
  hasDragMoved,
  toPixelCoords,
} from "@/domain/sf6-layout/coordinates";

describe("coordinates", () => {
  it("半径を許容範囲にクランプする", () => {
    expect(clampRadius(0.001)).toBe(0.01);
    expect(clampRadius(0.5)).toBe(0.20);
    expect(clampRadius(0.04)).toBe(0.04);
  });

  it("円全体が 0〜1 内に収まるよう座標をクランプする", () => {
    const { x, y } = clampPosition(0, 0, 0.05);
    expect(x).toBe(0.05);
    expect(y).toBe(0.05);
  });

  it("スロットをクランプする", () => {
    const slot = clampSlot({ id: "a", x: 1, y: 1, r: 0.04 });
    expect(slot.x).toBeLessThan(1);
    expect(slot.y).toBeLessThan(1);
    expect(slot.r).toBe(0.04);
  });

  it("ピクセル座標へ変換する", () => {
    const pixel = toPixelCoords({ id: "a", x: 0.5, y: 0.5, r: 0.1 }, { width: 800, height: 400 });
    expect(pixel.cx).toBe(400);
    expect(pixel.cy).toBe(200);
    expect(pixel.radius).toBe(40);
  });

  it("掴みオフセットを足すと中心は元の位置のままである", () => {
    const slot = { x: 0.5, y: 0.4 };
    const pointer = { x: 0.52, y: 0.43 };
    const offset = grabOffset(slot, pointer);
    expect(applyGrab(pointer, offset)).toEqual({ x: 0.5, y: 0.4 });
  });

  it("ポインタ移動分だけ中心が平行移動する", () => {
    const slot = { x: 0.5, y: 0.4 };
    const down = { x: 0.52, y: 0.43 };
    const moved = { x: 0.60, y: 0.48 };
    const offset = grabOffset(slot, down);
    const next = applyGrab(moved, offset);
    expect(next.x).toBeCloseTo(0.58);
    expect(next.y).toBeCloseTo(0.45);
  });

  it("しきい値未満のポインタ移動は未ドラッグとする", () => {
    expect(hasDragMoved({ x: 0.5, y: 0.5 }, { x: 0.502, y: 0.501 }, DRAG_MOVE_THRESHOLD)).toBe(false);
    expect(hasDragMoved({ x: 0.5, y: 0.5 }, { x: 0.52, y: 0.5 }, DRAG_MOVE_THRESHOLD)).toBe(true);
  });
});
