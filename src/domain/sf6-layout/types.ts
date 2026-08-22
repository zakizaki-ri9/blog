/** コントローラーの外形カテゴリ */
export type FormFactor = "pad" | "stick" | "leverless";

/** SF6 の操作方式 */
export type ControlScheme = "classic" | "modern";

/** パッドの表示面（表 / 上面） */
export type PadFace = "front" | "top";

/** 正規化座標のボタンスロット（0〜1） */
export interface ButtonSlot {
  id: string;
  x: number;
  y: number;
  /** viewBox 短辺に対する半径比率 */
  r: number;
  label?: string;
  /** 非活性（薄表示）。省略時は活性 */
  inactive?: boolean;
  /** パッドの表/上面。省略時は front */
  face?: PadFace;
}

/** プリセットメタデータ */
export interface ControllerMeta {
  sourceUrl: string | null;
  verifiedAt: string;
  note: string;
}

/** コントローラープリセット */
export interface ControllerPreset {
  manufacturerId: string;
  manufacturerName?: string;
  modelId: string;
  displayName: string;
  formFactor: FormFactor;
  buttonSlots: ButtonSlot[];
  meta: ControllerMeta;
}

/** 描画命令: 筐体枠 */
export interface SceneBodyOutline {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  /** パッド外形。ある場合は rect の代わりに描画する */
  path?: string;
  /** タッチパッドなど内側の補助パス */
  innerPaths?: string[];
  /** パッド肩ボタン帯 */
  shoulderBand?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rx: number;
  };
}

import type { SceneCallout } from "@/domain/sf6-layout/callouts";
import type { SlotShape } from "./slot-shape";

/** 描画命令: スロット円 */
export interface SceneSlotCircle {
  slotId: string;
  cx: number;
  cy: number;
  radius: number;
  label: string;
  selected: boolean;
  /** 非活性（薄表示） */
  dimmed?: boolean;
  shape?: SlotShape;
}

/** キャンバス上の飾り（非編集） */
export type SceneChromeKind =
  | "shoulderLabel"
  | "rsStick"
  | "usbPort"
  | "select"
  | "start"
  | "zoneDivider";

export interface SceneChromeItem {
  kind: SceneChromeKind;
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
}

/** 描画命令: 吹き出し（型は callouts.ts と同期） */
export type { SceneCallout };

/** レイアウト描画シーン（色・DOM は含まない） */
export interface LayoutScene {
  viewBox: ViewBoxSize;
  bodyOutline: SceneBodyOutline;
  slots: SceneSlotCircle[];
  callouts: SceneCallout[];
  chrome?: SceneChromeItem[];
}

/** 操作方式ごとのスロット ID → ラベル */
export interface SchemeMappings {
  classic: Record<string, string>;
  modern: Record<string, string>;
}

/** 操作方式ごとのデフォルトラベル割当 */
export interface MappingsData {
  classic: Record<string, string>;
  modern: Record<string, string>;
  /** パッド（面ダイヤ + 肩） */
  pad?: SchemeMappings;
  /** レバー（8 ボタン弧） */
  stick?: SchemeMappings;
  /** レバーレス（2×4） */
  leverless?: SchemeMappings;
  /** パッド上面の肩ボタン用（後方互換） */
  padTop?: SchemeMappings;
}

/** ランタイム編集状態 */
export interface SessionState {
  baseModelId: string;
  controlScheme: ControlScheme;
  slots: ButtonSlot[];
}

/** 描画用ビューボックス寸法 */
export interface ViewBoxSize {
  width: number;
  height: number;
}
