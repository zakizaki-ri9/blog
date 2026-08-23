import type { ButtonSlot, PadFace } from "./types";

/** スロットの表示面（省略時 front） */
export function getSlotFace(slot: ButtonSlot): PadFace {
  return slot.face ?? "front";
}

/** 同一 face のスロットのみ返す */
export function filterSlotsByFace(slots: ButtonSlot[], face: PadFace): ButtonSlot[] {
  return slots.filter((slot) => getSlotFace(slot) === face);
}

/** 対象スロット以外の全スロット（揃え・マグネット用） */
export function getAlignableSlots(slots: ButtonSlot[], targetId: string): ButtonSlot[] {
  return slots.filter((slot) => slot.id !== targetId);
}
