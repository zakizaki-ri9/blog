import type { FormFactor } from "./types";

/** スロットの描画形状 */
export type SlotShape = "circle" | "roundRect" | "trigger" | "dpad";

const PAD_BUMPER_IDS = new Set(["slot_l1", "slot_r1"]);
const PAD_TRIGGER_IDS = new Set(["slot_l2", "slot_r2"]);

/** ID と筐体種別から描画形状を決める */
export function getSlotShape(slotId: string, formFactor?: FormFactor): SlotShape {
  if (formFactor === "pad") {
    if (slotId === "slot_dpad") return "dpad";
    if (PAD_TRIGGER_IDS.has(slotId)) return "trigger";
    if (PAD_BUMPER_IDS.has(slotId)) return "roundRect";
  }
  return "circle";
}
