import { clampSlot } from "./coordinates";
import { isCustomSlotId } from "./labels";
import { defaultSlotRadius } from "./radius-presets";
import type {
  ButtonSlot,
  ControlScheme,
  ControllerPreset,
  FormFactor,
  PadFace,
  SessionState,
} from "./types";
import type { MappingsData } from "./types";

function schemeMap(
  mappings: { classic: Record<string, string>; modern: Record<string, string> },
  scheme: ControlScheme,
): Record<string, string> {
  return scheme === "classic" ? mappings.classic : mappings.modern;
}

/** スロットのデフォルトラベルを解決する */
export function resolveDefaultLabel(
  slot: ButtonSlot,
  mappings: MappingsData,
  scheme: ControlScheme,
  formFactor?: FormFactor,
): string | undefined {
  if (formFactor) {
    const specific = mappings[formFactor];
    if (specific) {
      const label = schemeMap(specific, scheme)[slot.id];
      if (label !== undefined) return label;
    }
  }
  if (slot.face === "top" && mappings.padTop) {
    const topLabel = schemeMap(mappings.padTop, scheme)[slot.id];
    if (topLabel !== undefined) return topLabel;
  }
  return schemeMap(mappings, scheme)[slot.id];
}

/** スロット配列のディープコピー */
export function cloneSlots(slots: ButtonSlot[]): ButtonSlot[] {
  return slots.map((slot) => ({ ...slot }));
}

/** カスタムスロット用の一意 ID を生成する */
export function createCustomSlotId(existingSlots: ButtonSlot[]): string {
  let index = 1;
  while (existingSlots.some((slot) => slot.id === `custom_${index}`)) {
    index += 1;
  }
  return `custom_${index}`;
}

/** スロットを追加する */
export function addSlot(slots: ButtonSlot[], slot: ButtonSlot): ButtonSlot[] {
  return [...slots, clampSlot(slot)];
}

/** スロットを削除する */
export function removeSlot(slots: ButtonSlot[], id: string): ButtonSlot[] {
  return slots.filter((slot) => slot.id !== id);
}

/** スロットを部分更新する */
export function updateSlot(
  slots: ButtonSlot[],
  id: string,
  partial: Partial<ButtonSlot>,
): ButtonSlot[] {
  return slots.map((slot) => {
    if (slot.id !== id) return slot;
    return clampSlot({ ...slot, ...partial });
  });
}

/** マッピングからデフォルトラベルを適用する */
export function applyDefaultLabels(
  slots: ButtonSlot[],
  mappings: MappingsData,
  scheme: ControlScheme,
  overwrite = false,
  formFactor?: FormFactor,
): ButtonSlot[] {
  return slots.map((slot) => {
    const defaultLabel = resolveDefaultLabel(slot, mappings, scheme, formFactor);
    if (!defaultLabel) return slot;
    if (!overwrite && slot.label) return slot;
    return { ...slot, label: defaultLabel };
  });
}

/** scheme 切替時: 既知 slotId は上書き、custom_* は手動ラベルを維持 */
export function applySchemeLabels(
  slots: ButtonSlot[],
  mappings: MappingsData,
  scheme: ControlScheme,
  formFactor?: FormFactor,
): ButtonSlot[] {
  return slots.map((slot) => {
    if (isCustomSlotId(slot.id)) return slot;
    const defaultLabel = resolveDefaultLabel(slot, mappings, scheme, formFactor);
    if (!defaultLabel) return slot;
    return { ...slot, label: defaultLabel };
  });
}

/** プリセットからセッション状態を生成する */
export function createSessionFromPreset(
  preset: ControllerPreset,
  scheme: ControlScheme,
  mappings: MappingsData,
): SessionState {
  const slots = applyDefaultLabels(
    cloneSlots(preset.buttonSlots),
    mappings,
    scheme,
    true,
    preset.formFactor,
  );
  return {
    baseModelId: preset.modelId,
    controlScheme: scheme,
    slots,
  };
}

/** プリセット初期状態へリセットする */
export function resetSession(
  preset: ControllerPreset,
  scheme: ControlScheme,
  mappings: MappingsData,
): SessionState {
  return createSessionFromPreset(preset, scheme, mappings);
}

/** 新規スロットのデフォルト位置 */
export function createDefaultSlot(
  existingSlots: ButtonSlot[],
  face?: PadFace,
  formFactor: FormFactor = "pad",
): ButtonSlot {
  const id = createCustomSlotId(existingSlots);
  return clampSlot({
    id,
    x: 0.5,
    y: 0.5,
    r: defaultSlotRadius(formFactor),
    label: "",
    ...(face ? { face } : {}),
  });
}
