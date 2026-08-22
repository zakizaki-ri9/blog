import type { ButtonSlot, ViewBoxSize } from "./types";

const MIN_R = 0.01;
const MAX_R = 0.20;

/** 半径を許容範囲にクランプする */
export function clampRadius(r: number): number {
  return Math.min(MAX_R, Math.max(MIN_R, r));
}

/** スロット中心座標を円全体が 0〜1 内に収まるようクランプする */
export function clampPosition(
  x: number,
  y: number,
  r: number,
): { x: number; y: number } {
  const clampedR = clampRadius(r);
  return {
    x: Math.min(1 - clampedR, Math.max(clampedR, x)),
    y: Math.min(1 - clampedR, Math.max(clampedR, y)),
  };
}

/** スロットの座標・半径を正規化範囲内にクランプする */
export function clampSlot(slot: ButtonSlot): ButtonSlot {
  const r = clampRadius(slot.r);
  const { x, y } = clampPosition(slot.x, slot.y, r);
  return { ...slot, x, y, r };
}

/** 正規化座標をピクセル座標へ変換する */
export function toPixelCoords(
  slot: ButtonSlot,
  viewBox: ViewBoxSize,
): { cx: number; cy: number; radius: number } {
  const shortSide = Math.min(viewBox.width, viewBox.height);
  return {
    cx: slot.x * viewBox.width,
    cy: slot.y * viewBox.height,
    radius: slot.r * shortSide,
  };
}

/** ドラッグ開始とみなす正規化移動量（約 5px / 800） */
export const DRAG_MOVE_THRESHOLD = 0.006;

/** 正規化座標の点 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

/** 掴み位置の差分 */
export interface GrabOffset {
  dx: number;
  dy: number;
}

/** スロット中心とポインタの差分を掴みオフセットにする */
export function grabOffset(slot: NormalizedPoint, pointer: NormalizedPoint): GrabOffset {
  return {
    dx: slot.x - pointer.x,
    dy: slot.y - pointer.y,
  };
}

/** ポインタに掴みオフセットを足して中心座標を返す */
export function applyGrab(pointer: NormalizedPoint, offset: GrabOffset): NormalizedPoint {
  return {
    x: pointer.x + offset.dx,
    y: pointer.y + offset.dy,
  };
}

/** ポインタがドラッグ開始しきい値以上動いたか */
export function hasDragMoved(
  start: NormalizedPoint,
  current: NormalizedPoint,
  threshold = DRAG_MOVE_THRESHOLD,
): boolean {
  return Math.hypot(current.x - start.x, current.y - start.y) >= threshold;
}
