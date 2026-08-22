import type { SlotShape } from "./slot-shape";

/** ピクセル座標 */
export interface GeometryPoint {
  x: number;
  y: number;
}

/** 外接矩形 */
export interface GeometryRect {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
}

/** トリガー（L2/R2）の半径に対する幅・高さ倍率。上面図の肩バンプに収まる浅い矩形 */
export const TRIGGER_SIZE = { width: 2.15, height: 1.55 } as const;

/** バンパー（L1/R1）の半径に対する幅・高さ倍率 */
export const BUMPER_SIZE = { width: 2.7, height: 1.2 } as const;

/** 十字の腕幅（半径比） */
export const DPAD_ARM_RATIO = 0.34;

/** 十字の SVG path を返す */
export function dpadPath(cx: number, cy: number, radius: number): string {
  const arm = radius * DPAD_ARM_RATIO;
  const len = radius;
  return [
    `M ${cx - arm} ${cy - len}`,
    `H ${cx + arm}`,
    `V ${cy - arm}`,
    `H ${cx + len}`,
    `V ${cy + arm}`,
    `H ${cx + arm}`,
    `V ${cy + len}`,
    `H ${cx - arm}`,
    `V ${cy + arm}`,
    `H ${cx - len}`,
    `V ${cy - arm}`,
    `H ${cx - arm}`,
    "Z",
  ].join(" ");
}

/** 角丸矩形 / トリガーの描画属性 */
export function roundRectAttrs(
  cx: number,
  cy: number,
  radius: number,
  shape: "roundRect" | "trigger",
): GeometryRect {
  const size = shape === "trigger" ? TRIGGER_SIZE : BUMPER_SIZE;
  const width = radius * size.width;
  const height = radius * size.height;
  return {
    x: cx - width / 2,
    y: cy - height / 2,
    width,
    height,
    rx: Math.min(shape === "trigger" ? 8 : 10, height / 3),
  };
}

/** 形状の外接矩形 */
export function getSlotAabb(
  cx: number,
  cy: number,
  radius: number,
  shape: SlotShape,
): GeometryRect {
  if (shape === "roundRect" || shape === "trigger") {
    return roundRectAttrs(cx, cy, radius, shape);
  }
  return {
    x: cx - radius,
    y: cy - radius,
    width: radius * 2,
    height: radius * 2,
    rx: 0,
  };
}

/** 外郭内包判定用の外周サンプル */
export function sampleSlotBoundary(
  cx: number,
  cy: number,
  radius: number,
  shape: SlotShape,
): GeometryPoint[] {
  if (shape === "circle") {
    const points: GeometryPoint[] = [];
    const count = 16;
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count;
      points.push({
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      });
    }
    return points;
  }

  if (shape === "dpad") {
    const arm = radius * DPAD_ARM_RATIO;
    return [
      { x: cx - arm, y: cy - radius },
      { x: cx + arm, y: cy - radius },
      { x: cx + arm, y: cy - arm },
      { x: cx + radius, y: cy - arm },
      { x: cx + radius, y: cy + arm },
      { x: cx + arm, y: cy + arm },
      { x: cx + arm, y: cy + radius },
      { x: cx - arm, y: cy + radius },
      { x: cx - arm, y: cy + arm },
      { x: cx - radius, y: cy + arm },
      { x: cx - radius, y: cy - arm },
      { x: cx - arm, y: cy - arm },
    ];
  }

  const box = roundRectAttrs(cx, cy, radius, shape);
  return [
    { x: box.x, y: box.y },
    { x: box.x + box.width / 2, y: box.y },
    { x: box.x + box.width, y: box.y },
    { x: box.x + box.width, y: box.y + box.height / 2 },
    { x: box.x + box.width, y: box.y + box.height },
    { x: box.x + box.width / 2, y: box.y + box.height },
    { x: box.x, y: box.y + box.height },
    { x: box.x, y: box.y + box.height / 2 },
  ];
}
