import type { ViewBoxSize } from "@/domain/sf6-layout/types";

/** SVG から最初の path d を取り出す */
export function extractSvgPathD(svg: string): string {
  const match = svg.match(/\sd="([^"]+)"/);
  if (!match) {
    throw new Error("SVG に path d がありません");
  }
  return match[1];
}

/** 絶対座標の M/L/C パスを別 viewBox へ拡縮する */
export function scaleSvgPath(d: string, source: ViewBoxSize, target: ViewBoxSize): string {
  if (source.width === target.width && source.height === target.height) {
    return d;
  }
  const sx = target.width / source.width;
  const sy = target.height / source.height;
  return d.replace(/(-?\d+\.?\d*)\s+(-?\d+\.?\d*)/g, (_all, x: string, y: string) => {
    return `${(Number(x) * sx).toFixed(2)} ${(Number(y) * sy).toFixed(2)}`;
  });
}
