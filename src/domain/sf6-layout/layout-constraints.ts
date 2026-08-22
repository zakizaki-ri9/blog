import { toPixelCoords } from "./coordinates";
import type { GeometryPoint, GeometryRect } from "./slot-geometry";
import { getSlotAabb, sampleSlotBoundary } from "./slot-geometry";
import { getSlotShape } from "./slot-shape";
import type { ButtonSlot, FormFactor, ViewBoxSize } from "./types";

/** 外郭内包の安全余白（px） */
export const BODY_MARGIN_PX = 2;

/** 実形状同士の最小隙間（px） */
export const SHAPE_GAP_PX = 4;

/** 三次ベジェ 1 本あたりの平坦化分割数 */
const CURVE_STEPS = 16;

const polygonCache = new Map<string, GeometryPoint[]>();

function polygonFor(bodyPath: string): GeometryPoint[] {
  const cached = polygonCache.get(bodyPath);
  if (cached) return cached;
  const polygon = flattenSvgPath(bodyPath);
  polygonCache.set(bodyPath, polygon);
  return polygon;
}

/** 制約違反の種別 */
export type ConstraintKind = "body-outside" | "overlap";

/** スロット単位の診断結果 */
export interface ConstraintViolation {
  slotId: string;
  kind: ConstraintKind;
  otherSlotId?: string;
  outsideCount?: number;
  sampleCount?: number;
}

interface CubicPoint {
  x: number;
  y: number;
}

function cubicPoint(p0: CubicPoint, p1: CubicPoint, p2: CubicPoint, p3: CubicPoint, t: number): GeometryPoint {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;
  return {
    x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
    y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
  };
}

function isCommand(token: string): boolean {
  return token === "M" || token === "C" || token === "Q" || token === "H" || token === "V" || token === "Z";
}

function quadraticPoint(p0: CubicPoint, p1: CubicPoint, p2: CubicPoint, t: number): GeometryPoint {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

/** 絶対座標の M/H/V/Q/C/Z パスを多角形へ平坦化する */
export function flattenSvgPath(d: string, stepsPerCurve = CURVE_STEPS): GeometryPoint[] {
  const tokens = d.trim().split(/\s+/);
  const polygon: GeometryPoint[] = [];
  let current: GeometryPoint = { x: 0, y: 0 };
  let i = 0;

  while (i < tokens.length) {
    const cmd = tokens[i];
    if (cmd === "M") {
      current = { x: Number(tokens[i + 1]), y: Number(tokens[i + 2]) };
      polygon.push(current);
      i += 3;
      continue;
    }
    if (cmd === "H") {
      i += 1;
      while (i < tokens.length && !isCommand(tokens[i])) {
        current = { x: Number(tokens[i]), y: current.y };
        polygon.push(current);
        i += 1;
      }
      continue;
    }
    if (cmd === "V") {
      i += 1;
      while (i < tokens.length && !isCommand(tokens[i])) {
        current = { x: current.x, y: Number(tokens[i]) };
        polygon.push(current);
        i += 1;
      }
      continue;
    }
    if (cmd === "Q") {
      i += 1;
      while (i < tokens.length && !isCommand(tokens[i])) {
        const control = { x: Number(tokens[i]), y: Number(tokens[i + 1]) };
        const end = { x: Number(tokens[i + 2]), y: Number(tokens[i + 3]) };
        for (let step = 1; step <= stepsPerCurve; step += 1) {
          polygon.push(quadraticPoint(current, control, end, step / stepsPerCurve));
        }
        current = end;
        i += 4;
      }
      continue;
    }
    if (cmd === "C") {
      i += 1;
      while (i < tokens.length && !isCommand(tokens[i])) {
        const p1 = { x: Number(tokens[i]), y: Number(tokens[i + 1]) };
        const p2 = { x: Number(tokens[i + 2]), y: Number(tokens[i + 3]) };
        const p3 = { x: Number(tokens[i + 4]), y: Number(tokens[i + 5]) };
        for (let step = 1; step <= stepsPerCurve; step += 1) {
          polygon.push(cubicPoint(current, p1, p2, p3, step / stepsPerCurve));
        }
        current = p3;
        i += 6;
      }
      continue;
    }
    if (cmd === "Z") {
      break;
    }
    i += 1;
  }

  return polygon;
}

/** 三次ベジェ中心のパス平坦化（flattenSvgPath の別名） */
export function flattenCubicPath(d: string, stepsPerCurve = CURVE_STEPS): GeometryPoint[] {
  return flattenSvgPath(d, stepsPerCurve);
}

/** 点が多角形の内側か（偶数奇数則） */
export function isPointInPolygon(point: GeometryPoint, polygon: GeometryPoint[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    const intersects = (a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function expandFromCenter(center: GeometryPoint, point: GeometryPoint, margin: number): GeometryPoint {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const length = Math.hypot(dx, dy);
  if (length === 0) {
    return { x: point.x, y: point.y - margin };
  }
  return {
    x: point.x + (dx / length) * margin,
    y: point.y + (dy / length) * margin,
  };
}

type OccupiedShape =
  | { kind: "circle"; cx: number; cy: number; r: number }
  | { kind: "rect"; aabb: GeometryRect };

function aabbsOverlap(a: GeometryRect, b: GeometryRect, gap: number): boolean {
  return !(
    a.x + a.width + gap <= b.x
    || b.x + b.width + gap <= a.x
    || a.y + a.height + gap <= b.y
    || b.y + b.height + gap <= a.y
  );
}

function circleAabbOverlap(cx: number, cy: number, r: number, box: GeometryRect, gap: number): boolean {
  const closestX = Math.min(Math.max(cx, box.x), box.x + box.width);
  const closestY = Math.min(Math.max(cy, box.y), box.y + box.height);
  return Math.hypot(cx - closestX, cy - closestY) < r + gap;
}

function shapesOverlap(a: OccupiedShape, b: OccupiedShape, gap: number): boolean {
  if (a.kind === "circle" && b.kind === "circle") {
    return Math.hypot(a.cx - b.cx, a.cy - b.cy) < a.r + b.r + gap;
  }
  if (a.kind === "rect" && b.kind === "rect") {
    return aabbsOverlap(a.aabb, b.aabb, gap);
  }
  const circle = a.kind === "circle" ? a : b as Extract<OccupiedShape, { kind: "circle" }>;
  const rect = a.kind === "rect" ? a : b as Extract<OccupiedShape, { kind: "rect" }>;
  return circleAabbOverlap(circle.cx, circle.cy, circle.r, rect.aabb, gap);
}

/** 診断メッセージをエージェント向けに整形する */
export function formatConstraintViolation(violation: ConstraintViolation): string {
  if (violation.kind === "body-outside") {
    return `${violation.slotId}: body outside (${violation.outsideCount}/${violation.sampleCount})`;
  }
  return `${violation.slotId}: overlap with ${violation.otherSlotId}`;
}

/** スロットの外郭内包と実形状衝突を診断する */
export function diagnoseSlotLayout(
  slots: ButtonSlot[],
  bodyPath: string,
  viewBox: ViewBoxSize,
  formFactor: FormFactor,
  options?: { marginPx?: number; gapPx?: number },
): ConstraintViolation[] {
  const marginPx = options?.marginPx ?? BODY_MARGIN_PX;
  const gapPx = options?.gapPx ?? SHAPE_GAP_PX;
  const polygon = polygonFor(bodyPath);
  const violations: ConstraintViolation[] = [];

  const geometries = slots.map((slot) => {
    const pixel = toPixelCoords(slot, viewBox);
    const shape = getSlotShape(slot.id, formFactor);
    return {
      slot,
      pixel,
      shape,
      occupied: (shape === "roundRect" || shape === "trigger")
        ? { kind: "rect" as const, aabb: getSlotAabb(pixel.cx, pixel.cy, pixel.radius, shape) }
        : { kind: "circle" as const, cx: pixel.cx, cy: pixel.cy, r: pixel.radius },
      samples: sampleSlotBoundary(pixel.cx, pixel.cy, pixel.radius, shape),
    };
  });

  for (const geo of geometries) {
    const center = { x: geo.pixel.cx, y: geo.pixel.cy };
    const expanded = geo.samples.map((point) => expandFromCenter(center, point, marginPx));
    const outsideCount = expanded.filter((point) => !isPointInPolygon(point, polygon)).length;
    if (outsideCount > 0) {
      violations.push({
        slotId: geo.slot.id,
        kind: "body-outside",
        outsideCount,
        sampleCount: expanded.length,
      });
    }
  }

  for (let i = 0; i < geometries.length; i += 1) {
    for (let j = i + 1; j < geometries.length; j += 1) {
      if (shapesOverlap(geometries[i].occupied, geometries[j].occupied, gapPx)) {
        violations.push({
          slotId: geometries[i].slot.id,
          kind: "overlap",
          otherSlotId: geometries[j].slot.id,
        });
      }
    }
  }

  return violations;
}

/** パッドスロットの外郭内包と実形状衝突を診断する */
export function diagnosePadLayout(
  slots: ButtonSlot[],
  bodyPath: string,
  viewBox: ViewBoxSize,
  options?: { marginPx?: number; gapPx?: number },
): ConstraintViolation[] {
  return diagnoseSlotLayout(slots, bodyPath, viewBox, "pad", options);
}
