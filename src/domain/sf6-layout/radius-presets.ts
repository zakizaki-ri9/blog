import type { FormFactor } from "./types";

/** 機種ごとの半径段階（小さい順、viewBox 短辺に対する比率） */
const STEPS: Record<FormFactor, number[]> = {
  pad: [0.065, 0.080, 0.085, 0.107, 0.117],
  stick: [0.080, 0.110],
  leverless: [0.078, 0.092],
};

/** 機種ごとの半径段階 */
export function getRadiusSteps(formFactor: FormFactor): number[] {
  return STEPS[formFactor];
}

/** 半径に最も近い段階の index */
export function nearestRadiusIndex(r: number, formFactor: FormFactor): number {
  const steps = getRadiusSteps(formFactor);
  let best = 0;
  let bestDist = Number.POSITIVE_INFINITY;
  for (let i = 0; i < steps.length; i += 1) {
    const dist = Math.abs(steps[i] - r);
    if (dist < bestDist) {
      best = i;
      bestDist = dist;
    }
  }
  return best;
}

/** 段階 index の半径。範囲外は端にクランプする */
export function radiusAtIndex(index: number, formFactor: FormFactor): number {
  const steps = getRadiusSteps(formFactor);
  const clamped = Math.min(steps.length - 1, Math.max(0, Math.round(index)));
  return steps[clamped];
}

/** 追加ボタンの初期半径（面 / レバーレスは通常） */
export function defaultSlotRadius(formFactor: FormFactor): number {
  if (formFactor === "leverless") return 0.078;
  if (formFactor === "stick") return 0.080;
  return 0.085;
}
