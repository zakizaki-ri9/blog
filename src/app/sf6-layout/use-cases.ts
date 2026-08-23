import { snapAlignX, snapAlignY } from "@/domain/sf6-layout/align";
import {
  applySchemeLabels,
  createSessionFromPreset,
  resetSession,
} from "@/domain/sf6-layout/slots";
import type {
  ControlScheme,
  ControllerPreset,
  FormFactor,
  MappingsData,
  SessionState,
} from "@/domain/sf6-layout/types";

/** プリセット一覧から modelId で検索する */
export function findPresetByModelId(
  presets: ControllerPreset[],
  modelId: string,
): ControllerPreset | undefined {
  return presets.find((preset) => preset.modelId === modelId);
}

/** 操作方式を切り替え、デフォルトラベルを再適用する */
export function switchControlScheme(
  state: SessionState,
  scheme: ControlScheme,
  mappings: MappingsData,
  formFactor?: FormFactor,
): SessionState {
  const slots = applySchemeLabels(state.slots, mappings, scheme, formFactor);
  return { ...state, controlScheme: scheme, slots };
}

/** プリセットを読み込んで新しいセッションを開始する */
export function loadPresetSession(
  preset: ControllerPreset,
  scheme: ControlScheme,
  mappings: MappingsData,
): SessionState {
  return createSessionFromPreset(preset, scheme, mappings);
}

/** セッションをプリセット初期状態へ戻す */
export function resetSessionToPreset(
  preset: ControllerPreset,
  scheme: ControlScheme,
  mappings: MappingsData,
): SessionState {
  return resetSession(preset, scheme, mappings);
}

/** 選択スロットを縦方向に揃える（x 軸スナップ） */
export function alignSessionSlotX(state: SessionState, slotId: string): SessionState {
  return {
    ...state,
    slots: snapAlignX(state.slots, slotId),
  };
}

/** 選択スロットを横方向に揃える（y 軸スナップ） */
export function alignSessionSlotY(state: SessionState, slotId: string): SessionState {
  return {
    ...state,
    slots: snapAlignY(state.slots, slotId),
  };
}
