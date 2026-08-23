/** アクションアイコンの種別（自作抽象） */
export type ActionKind =
  | "punch"
  | "kick"
  | "attack"
  | "special"
  | "assist"
  | "di"
  | "parry"
  | "throw"
  | "direction"
  | "stick"
  | "unknown";

/** 弱・中・強 */
export type ActionStrength = "light" | "medium" | "heavy";

/** 吹き出し用の視覚メタデータ */
export interface ActionVisual {
  kind: ActionKind;
  strength?: ActionStrength;
  /** 人間可読な短い名前（セレクト・a11y） */
  title: string;
  /** 永続化ラベルコード（LP 等） */
  code: string;
}

const CLASSIC_MAP: Record<string, Omit<ActionVisual, "code">> = {
  "↑": { kind: "direction", title: "上" },
  "↓": { kind: "direction", title: "下" },
  "←": { kind: "direction", title: "左" },
  "→": { kind: "direction", title: "右" },
  LP: { kind: "punch", strength: "light", title: "弱パンチ" },
  MP: { kind: "punch", strength: "medium", title: "中パンチ" },
  HP: { kind: "punch", strength: "heavy", title: "強パンチ" },
  LK: { kind: "kick", strength: "light", title: "弱キック" },
  MK: { kind: "kick", strength: "medium", title: "中キック" },
  HK: { kind: "kick", strength: "heavy", title: "強キック" },
  Throw: { kind: "throw", title: "投げ" },
  Parry: { kind: "parry", title: "ドライブパリィ" },
  DI: { kind: "di", title: "ドライブインパクト" },
  Stick: { kind: "stick", title: "スティック" },
};

const MODERN_MAP: Record<string, Omit<ActionVisual, "code">> = {
  "↑": { kind: "direction", title: "上" },
  "↓": { kind: "direction", title: "下" },
  "←": { kind: "direction", title: "左" },
  "→": { kind: "direction", title: "右" },
  L: { kind: "attack", strength: "light", title: "弱攻撃" },
  M: { kind: "attack", strength: "medium", title: "中攻撃" },
  H: { kind: "attack", strength: "heavy", title: "強攻撃" },
  SP: { kind: "special", title: "必殺技" },
  Assist: { kind: "assist", title: "アシスト" },
  DI: { kind: "di", title: "ドライブインパクト" },
  Parry: { kind: "parry", title: "ドライブパリィ" },
  Throw: { kind: "throw", title: "投げ" },
  Stick: { kind: "stick", title: "スティック" },
};

/** ラベル文字列から吹き出し用ビジュアルを解決する */
export function resolveActionVisual(label: string): ActionVisual | null {
  if (!label) return null;

  const classic = CLASSIC_MAP[label];
  if (classic) return { ...classic, code: label };

  const modern = MODERN_MAP[label];
  if (modern) return { ...modern, code: label };

  return { kind: "unknown", title: label, code: label };
}

/** 強度に応じた色（自作抽象アイコン用） */
export function getStrengthColor(strength?: ActionStrength): string {
  switch (strength) {
    case "light":
      return "#2563eb";
    case "medium":
      return "#ca8a04";
    case "heavy":
      return "#dc2626";
    default:
      return "#4b5563";
  }
}

/** 円内・セレクト用の短いバッジ（例: 弱P） */
const SLOT_BADGE: Record<string, string> = {
  "↑": "↑",
  "↓": "↓",
  "←": "←",
  "→": "→",
  LP: "弱P",
  MP: "中P",
  HP: "強P",
  LK: "弱K",
  MK: "中K",
  HK: "強K",
  L: "弱",
  M: "中",
  H: "強",
  SP: "SP",
  Assist: "AS",
  DI: "DI",
  Parry: "DP",
  Throw: "投",
  Stick: "",
};

/** 組み合わせラベルを部品に分解する */
export function splitLabelParts(label: string): string[] {
  if (!label) return [];
  return label.split("+").map((part) => part.trim()).filter((part) => part.length > 0);
}

function badgeForPart(part: string): string {
  if (part in SLOT_BADGE) return SLOT_BADGE[part];
  return part;
}

/** 円内に載せる短文（1行。組み合わせは + 連結） */
export function formatSlotBadge(label: string): string {
  const parts = splitLabelParts(label);
  if (parts.length === 0) return "";
  return parts.map(badgeForPart).filter((badge) => badge.length > 0).join("+");
}

/** 円内描画用の行（組み合わせは縦積み） */
export function formatSlotBadgeLines(label: string): string[] {
  const parts = splitLabelParts(label);
  if (parts.length === 0) return [];
  if (parts.length === 1) {
    const badge = badgeForPart(parts[0]);
    return badge ? [badge] : [];
  }
  return parts.map((part, index) => {
    const badge = badgeForPart(part);
    return index === 0 ? badge : `+${badge}`;
  });
}

/** セレクト用の表示文言（例: 弱P / 弱P+中P+強P） */
export function formatLabelOptionDisplay(label: string): string {
  if (!label) return "未割当";
  return formatSlotBadge(label) || label;
}
