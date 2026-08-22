import { clampPosition } from "./coordinates";
import { getAlignableSlots } from "./faces";
import type { ButtonSlot } from "./types";

/** ドラッグ中マグネットの閾値（正規化座標） */
export const MAGNET_THRESHOLD = 0.012;

type Axis = "x" | "y";

function nearestAxisValue(
  slots: ButtonSlot[],
  targetId: string,
  axis: Axis,
): number | null {
  const target = slots.find((slot) => slot.id === targetId);
  if (!target) return null;

  const others = getAlignableSlots(slots, targetId);
  if (others.length === 0) return null;

  const current = target[axis];
  let nearest = others[0][axis];
  let minDist = Math.abs(current - nearest);

  for (const slot of others.slice(1)) {
    const dist = Math.abs(current - slot[axis]);
    if (dist < minDist) {
      minDist = dist;
      nearest = slot[axis];
    }
  }

  return nearest;
}

/** 選択スロットを他スロットの x へ縦揃え */
export function snapAlignX(slots: ButtonSlot[], targetId: string): ButtonSlot[] {
  const x = nearestAxisValue(slots, targetId, "x");
  if (x === null) return slots;
  return slots.map((slot) => {
    if (slot.id !== targetId) return slot;
    const { y } = clampPosition(slot.x, slot.y, slot.r);
    return { ...slot, x, y };
  });
}

/** 選択スロットを他スロットの y へ横揃え */
export function snapAlignY(slots: ButtonSlot[], targetId: string): ButtonSlot[] {
  const y = nearestAxisValue(slots, targetId, "y");
  if (y === null) return slots;
  return slots.map((slot) => {
    if (slot.id !== targetId) return slot;
    const { x } = clampPosition(slot.x, slot.y, slot.r);
    return { ...slot, x, y };
  });
}

/** ドラッグ中に近い軸へ吸着する */
export function magnetizePosition(
  slots: ButtonSlot[],
  targetId: string,
  x: number,
  y: number,
  threshold = MAGNET_THRESHOLD,
): { x: number; y: number } {
  const target = slots.find((slot) => slot.id === targetId);
  if (!target) return { x, y };

  const others = getAlignableSlots(slots, targetId);
  let snappedX = x;
  let snappedY = y;

  for (const slot of others) {
    if (Math.abs(x - slot.x) <= threshold) snappedX = slot.x;
    if (Math.abs(y - slot.y) <= threshold) snappedY = slot.y;
  }

  const { x: clampedX, y: clampedY } = clampPosition(snappedX, snappedY, target.r);
  return { x: clampedX, y: clampedY };
}

/** 揃え補助線の座標（正規化） */
export interface AlignmentGuides {
  verticalXs: number[];
  horizontalYs: number[];
}

/** マグネット閾値内で一致する軸の補助線を返す */
export function getAlignmentGuides(
  slots: ButtonSlot[],
  targetId: string,
  x: number,
  y: number,
  threshold = MAGNET_THRESHOLD,
): AlignmentGuides {
  const others = getAlignableSlots(slots, targetId);
  const verticalXs = new Set<number>();
  const horizontalYs = new Set<number>();

  for (const slot of others) {
    if (Math.abs(x - slot.x) <= threshold) verticalXs.add(slot.x);
    if (Math.abs(y - slot.y) <= threshold) horizontalYs.add(slot.y);
  }

  return {
    verticalXs: [...verticalXs],
    horizontalYs: [...horizontalYs],
  };
}
