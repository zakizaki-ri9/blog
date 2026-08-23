import type { ControlScheme } from "./types";

export interface LabelOption {
  value: string;
  label: string;
}

/** Classic 方式で選択可能なラベル */
export const CLASSIC_LABEL_OPTIONS: LabelOption[] = [
  { value: "", label: "未割当" },
  { value: "↑", label: "↑" },
  { value: "↓", label: "↓" },
  { value: "←", label: "←" },
  { value: "→", label: "→" },
  { value: "LP", label: "LP" },
  { value: "MP", label: "MP" },
  { value: "HP", label: "HP" },
  { value: "LK", label: "LK" },
  { value: "MK", label: "MK" },
  { value: "HK", label: "HK" },
  { value: "LP+MP", label: "LP+MP" },
  { value: "MP+HP", label: "MP+HP" },
  { value: "LP+HP", label: "LP+HP" },
  { value: "LP+MP+HP", label: "LP+MP+HP" },
  { value: "LK+MK", label: "LK+MK" },
  { value: "MK+HK", label: "MK+HK" },
  { value: "LK+HK", label: "LK+HK" },
  { value: "LK+MK+HK", label: "LK+MK+HK" },
  { value: "LP+LK", label: "LP+LK" },
  { value: "MP+MK", label: "MP+MK" },
  { value: "HP+HK", label: "HP+HK" },
  { value: "Throw", label: "Throw" },
  { value: "Parry", label: "Parry" },
  { value: "DI", label: "DI" },
  { value: "Stick", label: "Stick" },
];

/** Modern 方式で選択可能なラベル（パンチ/キック区別なし） */
export const MODERN_LABEL_OPTIONS: LabelOption[] = [
  { value: "", label: "未割当" },
  { value: "↑", label: "↑" },
  { value: "↓", label: "↓" },
  { value: "←", label: "←" },
  { value: "→", label: "→" },
  { value: "L", label: "L" },
  { value: "M", label: "M" },
  { value: "H", label: "H" },
  { value: "SP", label: "SP" },
  { value: "L+M", label: "L+M" },
  { value: "M+H", label: "M+H" },
  { value: "L+H", label: "L+H" },
  { value: "L+M+H", label: "L+M+H" },
  { value: "Assist", label: "Assist" },
  { value: "DI", label: "DI" },
  { value: "Parry", label: "Parry" },
  { value: "Throw", label: "Throw" },
  { value: "Stick", label: "Stick" },
];

export function getLabelOptions(scheme: ControlScheme): LabelOption[] {
  return scheme === "classic" ? CLASSIC_LABEL_OPTIONS : MODERN_LABEL_OPTIONS;
}

/** カスタムスロットかどうか */
export function isCustomSlotId(id: string): boolean {
  return id.startsWith("custom_");
}
