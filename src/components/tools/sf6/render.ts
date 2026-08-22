import { createLayoutScene, DEFAULT_VIEW_BOX, type LayoutSceneContext } from "@/app/sf6-layout/create-scene";
import { formatSlotBadgeLines } from "@/domain/sf6-layout/action-icons";
import type { AlignmentGuides } from "@/domain/sf6-layout/align";
import { dpadPath, roundRectAttrs } from "@/domain/sf6-layout/slot-geometry";
import type {
  ButtonSlot,
  LayoutScene,
  SceneChromeItem,
  SceneSlotCircle,
  ViewBoxSize,
} from "@/domain/sf6-layout/types";

export const VIEW_BOX = DEFAULT_VIEW_BOX;
export const EXPORT_SIZE: ViewBoxSize = { width: 1200, height: 630 };

/** SVG 描画専用の模式図色（トークン化対象外・ツール内ダーク） */
const COLORS = {
  background: "#12141c",
  bodyFill: "#2a3148",
  bodyStroke: "#8a9bb8",
  innerFill: "#161922",
  innerStroke: "#3d4a63",
  fill: "#243049",
  stroke: "#c5d0e6",
  selectedStroke: "#e8b84a",
  dimmedStroke: "#6b7a99",
  dimmedFill: "#1c2233",
  text: "#f4f4f5",
  dimmedText: "#8b98b3",
  chromeText: "#9aa8c3",
  guide: "#e8b84a",
  cross: "#6b7a99",
};

const DIMMED_OPACITY = "0.18";
const BADGE_FONT = "Atkinson, \"Hiragino Sans\", \"Noto Sans JP\", sans-serif";

function badgeFontSize(radius: number, lineCount: number): number {
  if (lineCount >= 3) return Math.max(9, radius * 0.36);
  if (lineCount === 2) return Math.max(11, radius * 0.46);
  return Math.max(13, radius * 0.62);
}

function applySlotAppearance(el: SVGElement, slot: SceneSlotCircle): void {
  el.setAttribute("fill", slot.dimmed ? COLORS.dimmedFill : COLORS.fill);
  const stroke = slot.selected
    ? COLORS.selectedStroke
    : slot.dimmed
      ? COLORS.dimmedStroke
      : COLORS.stroke;
  el.setAttribute("stroke", stroke);
  el.setAttribute("stroke-width", slot.selected ? "3" : "2");
  if (slot.dimmed) {
    el.setAttribute("opacity", DIMMED_OPACITY);
  }
  el.dataset.slotId = slot.slotId;
  el.classList.add("sf6-slot");
  if (slot.dimmed) {
    el.classList.add("sf6-slot-dimmed");
  }
}

/** スロットと短いバッジを SVG へ描画する */
export function renderSceneSlotsToSvg(container: SVGGElement, scene: LayoutScene): void {
  container.replaceChildren();

  for (const slot of scene.slots) {
    const shape = slot.shape ?? "circle";
    if (shape === "dpad") {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", dpadPath(slot.cx, slot.cy, slot.radius));
      applySlotAppearance(path, slot);
      container.appendChild(path);
    } else if (shape === "roundRect" || shape === "trigger") {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      const box = roundRectAttrs(slot.cx, slot.cy, slot.radius, shape);
      rect.setAttribute("x", String(box.x));
      rect.setAttribute("y", String(box.y));
      rect.setAttribute("width", String(box.width));
      rect.setAttribute("height", String(box.height));
      rect.setAttribute("rx", String(box.rx));
      applySlotAppearance(rect, slot);
      container.appendChild(rect);
    } else {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(slot.cx));
      circle.setAttribute("cy", String(slot.cy));
      circle.setAttribute("r", String(slot.radius));
      applySlotAppearance(circle, slot);
      container.appendChild(circle);
    }

    if (slot.selected) {
      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("cx", String(slot.cx));
      ring.setAttribute("cy", String(slot.cy));
      ring.setAttribute("r", String(slot.radius + 6));
      ring.setAttribute("fill", "none");
      ring.setAttribute("stroke", COLORS.selectedStroke);
      ring.setAttribute("stroke-width", "2");
      ring.setAttribute("pointer-events", "none");
      ring.classList.add("sf6-slot-ring");
      container.appendChild(ring);
    }

    appendSlotBadge(container, slot);
  }
}

function appendSlotBadge(container: SVGGElement, slot: SceneSlotCircle): void {
  const lines = formatSlotBadgeLines(slot.label);
  if (lines.length === 0) return;

  const fontSize = badgeFontSize(slot.radius, lines.length);
  const lineHeight = fontSize * 1.05;
  const startY = slot.cy - ((lines.length - 1) * lineHeight) / 2;

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute("x", String(slot.cx));
  text.setAttribute("y", String(startY));
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("dominant-baseline", "middle");
  text.setAttribute("fill", slot.dimmed ? COLORS.dimmedText : COLORS.text);
  if (slot.dimmed) {
    text.setAttribute("opacity", DIMMED_OPACITY);
  }
  text.setAttribute("font-size", String(fontSize));
  text.setAttribute("font-weight", "700");
  text.setAttribute("font-family", BADGE_FONT);
  text.setAttribute("pointer-events", "none");
  text.classList.add("sf6-slot-badge");

  lines.forEach((line, index) => {
    const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
    tspan.setAttribute("x", String(slot.cx));
    tspan.setAttribute("dy", index === 0 ? "0" : String(lineHeight));
    tspan.textContent = line;
    text.appendChild(tspan);
  });

  container.appendChild(text);
}

/** 吹き出しは使わない（互換のため空にする） */
export function renderSceneCalloutsToSvg(container: SVGGElement, scene: LayoutScene): void {
  void scene;
  container.replaceChildren();
}

/** シーンを SVG グループへ描画する（後方互換） */
export function renderSceneToSvg(container: SVGGElement, scene: LayoutScene): void {
  renderSceneSlotsToSvg(container, scene);
}

/** 揃え補助線を SVG へ描画する */
export function renderAlignmentGuidesToSvg(
  container: SVGGElement,
  guides: AlignmentGuides | null,
  viewBox: ViewBoxSize,
): void {
  container.replaceChildren();
  if (!guides) return;

  for (const nx of guides.verticalXs) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const x = nx * viewBox.width;
    line.setAttribute("x1", String(x));
    line.setAttribute("x2", String(x));
    line.setAttribute("y1", "0");
    line.setAttribute("y2", String(viewBox.height));
    line.setAttribute("stroke", COLORS.guide);
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "6 4");
    line.setAttribute("pointer-events", "none");
    line.classList.add("sf6-align-guide");
    container.appendChild(line);
  }

  for (const ny of guides.horizontalYs) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const y = ny * viewBox.height;
    line.setAttribute("x1", "0");
    line.setAttribute("x2", String(viewBox.width));
    line.setAttribute("y1", String(y));
    line.setAttribute("y2", String(y));
    line.setAttribute("stroke", COLORS.guide);
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-dasharray", "6 4");
    line.setAttribute("pointer-events", "none");
    line.classList.add("sf6-align-guide");
    container.appendChild(line);
  }
}

function drawSlotBadgeToCanvas(ctx: CanvasRenderingContext2D, slot: SceneSlotCircle): void {
  const lines = formatSlotBadgeLines(slot.label);
  if (lines.length === 0) return;

  const fontSize = badgeFontSize(slot.radius, lines.length);
  const lineHeight = fontSize * 1.05;
  const startY = slot.cy - ((lines.length - 1) * lineHeight) / 2;

  ctx.fillStyle = slot.dimmed ? COLORS.dimmedText : COLORS.text;
  ctx.font = `700 ${fontSize}px ${BADGE_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  lines.forEach((line, index) => {
    ctx.fillText(line, slot.cx, startY + index * lineHeight);
  });
}

function drawSlotShapeToCanvas(ctx: CanvasRenderingContext2D, slot: SceneSlotCircle): void {
  const shape = slot.shape ?? "circle";
  ctx.beginPath();
  if (shape === "dpad") {
    ctx.fill(new Path2D(dpadPath(slot.cx, slot.cy, slot.radius)));
    ctx.stroke(new Path2D(dpadPath(slot.cx, slot.cy, slot.radius)));
    return;
  }
  if (shape === "roundRect" || shape === "trigger") {
    const box = roundRectAttrs(slot.cx, slot.cy, slot.radius, shape);
    ctx.roundRect(box.x, box.y, box.width, box.height, box.rx);
    ctx.fill();
    ctx.stroke();
    return;
  }
  ctx.arc(slot.cx, slot.cy, slot.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawChromeToCanvas(ctx: CanvasRenderingContext2D, item: SceneChromeItem): void {
  ctx.fillStyle = COLORS.chromeText;
  ctx.strokeStyle = COLORS.cross;
  ctx.lineWidth = 1.5;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 13px ${BADGE_FONT}`;

  if (item.kind === "shoulderLabel") {
    ctx.fillText(item.label ?? "", item.x, item.y);
    return;
  }
  if (item.kind === "select" || item.kind === "start") {
    ctx.beginPath();
    ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = `600 9px ${BADGE_FONT}`;
    ctx.fillText(item.label ?? "", item.x, item.y);
    return;
  }
  if (item.kind === "usbPort") {
    const w = item.width ?? 36;
    const h = item.height ?? 12;
    ctx.beginPath();
    ctx.roundRect(item.x - w / 2, item.y - h / 2, w, h, 4);
    ctx.stroke();
    return;
  }
  if (item.kind === "rsStick") {
    ctx.fillStyle = COLORS.dimmedFill;
    ctx.beginPath();
    ctx.arc(item.x, item.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(item.x, item.y, 8, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  if (item.kind === "zoneDivider") {
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(item.x, item.y);
    ctx.lineTo(item.x, item.y + (item.height ?? 0));
    ctx.stroke();
    ctx.setLineDash([]);
  }
}

function renderChromeToSvg(container: SVGGElement, scene: LayoutScene): void {
  container.replaceChildren();
  for (const item of scene.chrome ?? []) {
    if (item.kind === "shoulderLabel") {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", String(item.x));
      text.setAttribute("y", String(item.y));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", COLORS.chromeText);
      text.setAttribute("font-size", "12");
      text.setAttribute("font-family", BADGE_FONT);
      text.setAttribute("pointer-events", "none");
      text.textContent = item.label ?? "";
      container.appendChild(text);
      continue;
    }
    if (item.kind === "select" || item.kind === "start") {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("pointer-events", "none");
      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("cx", String(item.x));
      c.setAttribute("cy", String(item.y));
      c.setAttribute("r", "10");
      c.setAttribute("fill", "none");
      c.setAttribute("stroke", COLORS.cross);
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", String(item.x));
      t.setAttribute("y", String(item.y));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("fill", COLORS.chromeText);
      t.setAttribute("font-size", "9");
      t.setAttribute("font-family", BADGE_FONT);
      t.textContent = item.label ?? "";
      g.append(c, t);
      container.appendChild(g);
      continue;
    }
    if (item.kind === "usbPort") {
      const w = item.width ?? 36;
      const h = item.height ?? 12;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(item.x - w / 2));
      rect.setAttribute("y", String(item.y - h / 2));
      rect.setAttribute("width", String(w));
      rect.setAttribute("height", String(h));
      rect.setAttribute("rx", "4");
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", COLORS.cross);
      rect.setAttribute("stroke-width", "2");
      rect.setAttribute("pointer-events", "none");
      container.appendChild(rect);
      continue;
    }
    if (item.kind === "rsStick") {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("pointer-events", "none");
      const outer = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      outer.setAttribute("cx", String(item.x));
      outer.setAttribute("cy", String(item.y));
      outer.setAttribute("r", "22");
      outer.setAttribute("fill", COLORS.dimmedFill);
      outer.setAttribute("stroke", COLORS.cross);
      outer.setAttribute("stroke-width", "2");
      outer.setAttribute("opacity", "0.85");
      const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      inner.setAttribute("cx", String(item.x));
      inner.setAttribute("cy", String(item.y));
      inner.setAttribute("r", "8");
      inner.setAttribute("fill", "none");
      inner.setAttribute("stroke", COLORS.cross);
      inner.setAttribute("stroke-width", "1.5");
      inner.setAttribute("opacity", "0.85");
      g.append(outer, inner);
      container.appendChild(g);
      continue;
    }
    if (item.kind === "zoneDivider") {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", String(item.x));
      line.setAttribute("x2", String(item.x));
      line.setAttribute("y1", String(item.y));
      line.setAttribute("y2", String(item.y + (item.height ?? 0)));
      line.setAttribute("stroke", COLORS.cross);
      line.setAttribute("stroke-dasharray", "6 6");
      line.setAttribute("pointer-events", "none");
      container.appendChild(line);
    }
  }
}

/** シーンを Canvas へ描画する */
export function drawSceneToCanvas(
  ctx: CanvasRenderingContext2D,
  scene: LayoutScene,
  caption?: string,
): void {
  const { viewBox, bodyOutline } = scene;

  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, viewBox.width, viewBox.height);

  ctx.fillStyle = COLORS.bodyFill;
  ctx.strokeStyle = COLORS.bodyStroke;
  ctx.lineWidth = 2;

  if (bodyOutline.shoulderBand) {
    const band = bodyOutline.shoulderBand;
    ctx.beginPath();
    ctx.roundRect(band.x, band.y, band.width, band.height, band.rx);
    ctx.fill();
    ctx.stroke();
  }

  if (bodyOutline.path) {
    const outline = new Path2D(bodyOutline.path);
    ctx.fill(outline);
    ctx.stroke(outline);
    for (const d of bodyOutline.innerPaths ?? []) {
      const inner = new Path2D(d);
      ctx.fillStyle = COLORS.innerFill;
      ctx.strokeStyle = COLORS.innerStroke;
      ctx.lineWidth = 1.5;
      ctx.fill(inner);
      ctx.stroke(inner);
    }
    ctx.fillStyle = COLORS.bodyFill;
    ctx.strokeStyle = COLORS.bodyStroke;
    ctx.lineWidth = 2;
  } else {
    ctx.beginPath();
    ctx.roundRect(
      bodyOutline.x,
      bodyOutline.y,
      bodyOutline.width,
      bodyOutline.height,
      bodyOutline.rx,
    );
    ctx.fill();
    ctx.stroke();
  }

  for (const item of scene.chrome ?? []) {
    drawChromeToCanvas(ctx, item);
  }

  for (const slot of scene.slots) {
    ctx.save();
    if (slot.dimmed) {
      ctx.globalAlpha = 0.18;
    }
    ctx.fillStyle = slot.dimmed ? COLORS.dimmedFill : COLORS.fill;
    ctx.strokeStyle = slot.selected
      ? COLORS.selectedStroke
      : slot.dimmed
        ? COLORS.dimmedStroke
        : COLORS.stroke;
    ctx.lineWidth = slot.selected ? 3 : 2;
    drawSlotShapeToCanvas(ctx, slot);
    drawSlotBadgeToCanvas(ctx, slot);
    ctx.restore();
  }

  if (caption) {
    ctx.fillStyle = COLORS.chromeText;
    ctx.font = `600 16px ${BADGE_FONT}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(caption, viewBox.width / 2, viewBox.height - 22);
  }
}

/** 筐体枠を SVG に反映する */
export function applyBodyOutlineToSvg(
  rect: SVGRectElement,
  scene: LayoutScene,
  pathEl?: SVGPathElement | null,
  innerGroup?: SVGGElement | null,
): void {
  const { bodyOutline } = scene;
  const hasPath = Boolean(bodyOutline.path && pathEl);

  if (hasPath && pathEl && bodyOutline.path) {
    pathEl.setAttribute("d", bodyOutline.path);
    pathEl.removeAttribute("hidden");
    rect.setAttribute("hidden", "");
  } else {
    pathEl?.setAttribute("hidden", "");
    pathEl?.removeAttribute("d");
    rect.removeAttribute("hidden");
    rect.setAttribute("x", String(bodyOutline.x));
    rect.setAttribute("y", String(bodyOutline.y));
    rect.setAttribute("width", String(bodyOutline.width));
    rect.setAttribute("height", String(bodyOutline.height));
    rect.setAttribute("rx", String(bodyOutline.rx));
  }

  if (innerGroup) {
    innerGroup.replaceChildren();
    if (bodyOutline.shoulderBand) {
      const band = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      band.setAttribute("x", String(bodyOutline.shoulderBand.x));
      band.setAttribute("y", String(bodyOutline.shoulderBand.y));
      band.setAttribute("width", String(bodyOutline.shoulderBand.width));
      band.setAttribute("height", String(bodyOutline.shoulderBand.height));
      band.setAttribute("rx", String(bodyOutline.shoulderBand.rx));
      band.setAttribute("class", "sf6-body-outline");
      innerGroup.appendChild(band);
    }
    for (const d of bodyOutline.innerPaths ?? []) {
      const inner = document.createElementNS("http://www.w3.org/2000/svg", "path");
      inner.setAttribute("d", d);
      inner.setAttribute("class", "sf6-body-inner");
      innerGroup.appendChild(inner);
    }
  }
}

/** スロットからシーンを生成して SVG へ描画する */
export function renderSlotsToSvg(
  slotsGroup: SVGGElement,
  slots: ButtonSlot[],
  selectedId: string | null,
  viewBox: ViewBoxSize = VIEW_BOX,
  context?: LayoutSceneContext,
  bodyOutlineEl?: SVGRectElement | null,
  calloutsGroup?: SVGGElement | null,
  bodyPathEl?: SVGPathElement | null,
  bodyInnerGroup?: SVGGElement | null,
  chromeGroup?: SVGGElement | null,
): LayoutScene {
  const scene = createLayoutScene(slots, viewBox, selectedId, context);
  if (bodyOutlineEl) {
    applyBodyOutlineToSvg(bodyOutlineEl, scene, bodyPathEl, bodyInnerGroup);
  }
  if (chromeGroup) {
    renderChromeToSvg(chromeGroup, scene);
  }
  renderSceneSlotsToSvg(slotsGroup, scene);
  if (calloutsGroup) {
    renderSceneCalloutsToSvg(calloutsGroup, scene);
  }
  return scene;
}

/** PNG ダウンロード用 Blob を生成する */
export async function createLayoutPngBlob(
  slots: ButtonSlot[],
  context?: LayoutSceneContext,
  caption?: string,
): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = EXPORT_SIZE.width;
  canvas.height = EXPORT_SIZE.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await document.fonts.ready;
  const scene = createLayoutScene(slots, EXPORT_SIZE, null, context);
  drawSceneToCanvas(ctx, scene, caption);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}

/** 生成 PNG をダウンロードする */
export async function downloadLayoutPng(
  slots: ButtonSlot[],
  context?: LayoutSceneContext,
  caption?: string,
): Promise<void> {
  const blob = await createLayoutPngBlob(slots, context, caption);
  if (!blob) return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sf6-layout.png";
  link.click();
  URL.revokeObjectURL(url);
}

/** SVG 上のポインタ位置を正規化座標へ変換する */
export function pointerToNormalized(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0.5, y: 0.5 };
  const transformed = point.matrixTransform(matrix.inverse());
  return {
    x: transformed.x / VIEW_BOX.width,
    y: transformed.y / VIEW_BOX.height,
  };
}

/** シーンのスロット座標を取得する（テスト用） */
export function getSceneSlotCoords(
  slots: ButtonSlot[],
  viewBox: ViewBoxSize,
  selectedId: string | null = null,
  context?: LayoutSceneContext,
): Array<{ slotId: string; cx: number; cy: number; radius: number; label: string }> {
  const scene = createLayoutScene(slots, viewBox, selectedId, context);
  return scene.slots.map((slot) => ({
    slotId: slot.slotId,
    cx: slot.cx,
    cy: slot.cy,
    radius: slot.radius,
    label: slot.label,
  }));
}
