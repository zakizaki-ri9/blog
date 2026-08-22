import type { ActionVisual } from "@/domain/sf6-layout/action-icons";
import { getStrengthColor } from "@/domain/sf6-layout/action-icons";
import { CALLOUT_ICON_SIZE, type SceneCallout } from "@/domain/sf6-layout/callouts";

/** SVG 描画専用の模式図色（トークン化対象外） */
const WHITE = "#ffffff";
const GRAY = "#9ca3af";

/** SVG グループに抽象アイコンを描画する */
export function drawActionIconToSvg(
  parent: SVGGElement,
  visual: ActionVisual,
  centerX: number,
  centerY: number,
  dimmed = false,
  iconSize = CALLOUT_ICON_SIZE,
): void {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const scale = iconSize / 32;
  g.setAttribute(
    "transform",
    `translate(${centerX}, ${centerY}) scale(${scale}) translate(-16, -16)`,
  );
  if (dimmed) {
    g.setAttribute("opacity", "0.35");
  }

  const color = getIconAccentColor(visual);
  drawIconShapes(g, visual, color);
  parent.appendChild(g);
}

/** Canvas に抽象アイコンを描画する */
export function drawActionIconToCanvas(
  ctx: CanvasRenderingContext2D,
  visual: ActionVisual,
  centerX: number,
  centerY: number,
  dimmed = false,
  iconSize = CALLOUT_ICON_SIZE,
): void {
  ctx.save();
  if (dimmed) {
    ctx.globalAlpha = 0.35;
  }
  const scale = iconSize / 32;
  ctx.translate(centerX, centerY);
  ctx.scale(scale, scale);
  ctx.translate(-16, -16);
  const color = getIconAccentColor(visual);
  drawIconShapesCanvas(ctx, visual, color);
  ctx.restore();
}

function getIconAccentColor(visual: ActionVisual): string {
  if (visual.strength) return getStrengthColor(visual.strength);
  switch (visual.kind) {
    case "special":
      return "#ea580c";
    case "assist":
      return "#7c3aed";
    case "di":
      return "#b45309";
    case "parry":
      return "#0891b2";
    case "throw":
      return "#6b7280";
    case "direction":
      return "#374151";
    case "stick":
      return "#4b5563";
    default:
      return "#4b5563";
  }
}

/** Classic: 色円の中に白い拳シルエット */
function drawFistInCircle(parent: SVGGElement, color: string): void {
  appendCircle(parent, 16, 16, 14, color, true);
  // 拳（抽象シルエット）
  appendPath(
    parent,
    "M10 18 L10 12 Q10 9 13 9 L15 9 Q16 7.5 17.5 8 L19 8.5 Q21 9 21 11.5 L21 18 Q21 21 18 21 L13 21 Q10 21 10 18 Z",
    WHITE,
    true,
  );
  appendPath(parent, "M12 12 L12 16", color, false, 1.2);
  appendPath(parent, "M14.5 11 L14.5 16", color, false, 1.2);
  appendPath(parent, "M17 11 L17 16", color, false, 1.2);
}

/** Classic: 色円の中に白い足シルエット */
function drawFootInCircle(parent: SVGGElement, color: string): void {
  appendCircle(parent, 16, 16, 14, color, true);
  appendPath(
    parent,
    "M11 9 Q12 7 14 8 L16 14 L22 15 Q24 16 23 18 Q22 20 19 19 L14 18 Q11 17 11 14 Z",
    WHITE,
    true,
  );
}

function drawFistInCircleCanvas(ctx: CanvasRenderingContext2D, color: string): void {
  fillCircle(ctx, 16, 16, 14, color);
  const fist = new Path2D(
    "M10 18 L10 12 Q10 9 13 9 L15 9 Q16 7.5 17.5 8 L19 8.5 Q21 9 21 11.5 L21 18 Q21 21 18 21 L13 21 Q10 21 10 18 Z",
  );
  ctx.fillStyle = WHITE;
  ctx.fill(fist);
  strokeLine(ctx, 12, 12, 12, 16, color, 1.2);
  strokeLine(ctx, 14.5, 11, 14.5, 16, color, 1.2);
  strokeLine(ctx, 17, 11, 17, 16, color, 1.2);
}

function drawFootInCircleCanvas(ctx: CanvasRenderingContext2D, color: string): void {
  fillCircle(ctx, 16, 16, 14, color);
  const foot = new Path2D(
    "M11 9 Q12 7 14 8 L16 14 L22 15 Q24 16 23 18 Q22 20 19 19 L14 18 Q11 17 11 14 Z",
  );
  ctx.fillStyle = WHITE;
  ctx.fill(foot);
}

function drawIconShapes(
  parent: SVGGElement,
  visual: ActionVisual,
  color: string,
): void {
  switch (visual.kind) {
    case "punch":
      drawFistInCircle(parent, color);
      break;
    case "kick":
      drawFootInCircle(parent, color);
      break;
    case "attack":
      appendCircle(parent, 16, 16, 14, color, true);
      break;
    case "special":
      appendRect(parent, 4, 4, 24, 24, 5, color, true);
      appendPath(parent, "M16 8 L20 16 L16 24 L12 16 Z", WHITE, true);
      break;
    case "assist":
      appendCircle(parent, 12, 16, 8, color, false);
      appendCircle(parent, 20, 16, 8, color, true);
      break;
    case "di":
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x2 = 16 + Math.cos(angle) * 13;
        const y2 = 16 + Math.sin(angle) * 13;
        appendLine(parent, 16, 16, x2, y2, color, 2.5);
      }
      appendCircle(parent, 16, 16, 5, color, true);
      break;
    case "parry":
      appendPath(parent, "M16 4 L26 10 L23 26 L9 26 L6 10 Z", color, true);
      appendLine(parent, 11, 16, 21, 16, WHITE, 2.5);
      break;
    case "throw":
      appendPath(parent, "M8 12 Q16 4 24 12", color, false, 2.5);
      appendPath(parent, "M8 20 Q16 28 24 20", color, false, 2.5);
      appendCircle(parent, 8, 12, 3, color, true);
      appendCircle(parent, 24, 20, 3, color, true);
      break;
    case "direction":
      drawDirectionIcon(parent, visual.code, color);
      break;
    case "stick":
      appendCircle(parent, 16, 16, 13, color, false);
      appendCircle(parent, 16, 16, 5, color, true);
      break;
    default:
      appendCircle(parent, 16, 16, 12, GRAY, false);
      appendText(parent, 16, 16, "?", GRAY);
      break;
  }
}

function drawIconShapesCanvas(
  ctx: CanvasRenderingContext2D,
  visual: ActionVisual,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  switch (visual.kind) {
    case "punch":
      drawFistInCircleCanvas(ctx, color);
      break;
    case "kick":
      drawFootInCircleCanvas(ctx, color);
      break;
    case "attack":
      fillCircle(ctx, 16, 16, 14, color);
      break;
    case "special":
      roundRect(ctx, 4, 4, 24, 24, 5, color);
      fillPath(ctx, [[16, 8], [20, 16], [16, 24], [12, 16]], WHITE);
      break;
    case "assist":
      strokeCircle(ctx, 12, 16, 8, color, 2);
      fillCircle(ctx, 20, 16, 8, color);
      break;
    case "di":
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        strokeLine(
          ctx,
          16,
          16,
          16 + Math.cos(angle) * 13,
          16 + Math.sin(angle) * 13,
          color,
          2.5,
        );
      }
      fillCircle(ctx, 16, 16, 5, color);
      break;
    case "parry":
      fillPath(ctx, [[16, 4], [26, 10], [23, 26], [9, 26], [6, 10]], color);
      strokeLine(ctx, 11, 16, 21, 16, WHITE, 2.5);
      break;
    case "throw":
      strokeQuad(ctx, 8, 12, 16, 4, 24, 12, color, 2.5);
      strokeQuad(ctx, 8, 20, 16, 28, 24, 20, color, 2.5);
      fillCircle(ctx, 8, 12, 3, color);
      fillCircle(ctx, 24, 20, 3, color);
      break;
    case "direction":
      drawDirectionIconCanvas(ctx, visual.code, color);
      break;
    case "stick":
      strokeCircle(ctx, 16, 16, 13, color, 2.5);
      fillCircle(ctx, 16, 16, 5, color);
      break;
    default:
      strokeCircle(ctx, 16, 16, 12, GRAY, 2);
      ctx.fillStyle = GRAY;
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", 16, 16);
      break;
  }
}

function drawDirectionIcon(parent: SVGGElement, code: string, color: string): void {
  const arrows: Record<string, string> = {
    "↑": "M16 5 L24 20 L16 16 L8 20 Z",
    "↓": "M16 27 L24 12 L16 16 L8 12 Z",
    "←": "M5 16 L20 8 L16 16 L20 24 Z",
    "→": "M27 16 L12 8 L16 16 L12 24 Z",
  };
  const path = arrows[code];
  if (path) {
    appendPath(parent, path, color, true);
  } else {
    appendCircle(parent, 16, 16, 10, color, true);
  }
}

function drawDirectionIconCanvas(
  ctx: CanvasRenderingContext2D,
  code: string,
  color: string,
): void {
  const arrows: Record<string, [number, number][]> = {
    "↑": [[16, 5], [24, 20], [16, 16], [8, 20]],
    "↓": [[16, 27], [24, 12], [16, 16], [8, 12]],
    "←": [[5, 16], [20, 8], [16, 16], [20, 24]],
    "→": [[27, 16], [12, 8], [16, 16], [12, 24]],
  };
  const pts = arrows[code];
  if (pts) {
    fillPath(ctx, pts, color);
  } else {
    fillCircle(ctx, 16, 16, 10, color);
  }
}

function appendCircle(
  parent: SVGGElement,
  cx: number,
  cy: number,
  r: number,
  color: string,
  fill: boolean,
): void {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", String(cx));
  el.setAttribute("cy", String(cy));
  el.setAttribute("r", String(r));
  if (fill) {
    el.setAttribute("fill", color);
  } else {
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", color);
    el.setAttribute("stroke-width", "2.5");
  }
  parent.appendChild(el);
}

function appendRect(
  parent: SVGGElement,
  x: number,
  y: number,
  w: number,
  h: number,
  rx: number,
  color: string,
  fill: boolean,
): void {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("width", String(w));
  el.setAttribute("height", String(h));
  el.setAttribute("rx", String(rx));
  if (fill) {
    el.setAttribute("fill", color);
  } else {
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", color);
    el.setAttribute("stroke-width", "2");
  }
  parent.appendChild(el);
}

function appendLine(
  parent: SVGGElement,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
): void {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", String(x1));
  el.setAttribute("y1", String(y1));
  el.setAttribute("x2", String(x2));
  el.setAttribute("y2", String(y2));
  el.setAttribute("stroke", color);
  el.setAttribute("stroke-width", String(width));
  el.setAttribute("stroke-linecap", "round");
  parent.appendChild(el);
}

function appendPath(
  parent: SVGGElement,
  d: string,
  color: string,
  fill: boolean,
  strokeWidth = 2,
): void {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
  el.setAttribute("d", d);
  if (fill) {
    el.setAttribute("fill", color);
  } else {
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", color);
    el.setAttribute("stroke-width", String(strokeWidth));
    el.setAttribute("stroke-linecap", "round");
  }
  parent.appendChild(el);
}

function appendText(
  parent: SVGGElement,
  x: number,
  y: number,
  text: string,
  color: string,
): void {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "text");
  el.setAttribute("x", String(x));
  el.setAttribute("y", String(y));
  el.setAttribute("text-anchor", "middle");
  el.setAttribute("dominant-baseline", "middle");
  el.setAttribute("fill", color);
  el.setAttribute("font-size", "14");
  el.setAttribute("font-family", "sans-serif");
  el.textContent = text;
  parent.appendChild(el);
}

function fillCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string,
  width: number,
): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function strokeLine(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

function fillPath(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  color: string,
): void {
  if (points.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  color: string,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function strokeQuad(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  x2: number,
  y2: number,
  color: string,
  width: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx, cy, x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

/** 吹き出し1件の SVG を構築する */
export function renderCalloutToSvg(
  container: SVGGElement,
  callout: SceneCallout,
  colors: {
    barFill: string;
    barStroke: string;
    selectedStroke: string;
    line: string;
  },
): void {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("sf6-callout");
  group.dataset.slotId = callout.slotId;
  if (callout.dimmed) {
    group.setAttribute("opacity", "0.35");
  }

  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", String(callout.lineStartX));
  line.setAttribute("y1", String(callout.lineStartY));
  line.setAttribute("x2", String(callout.lineEndX));
  line.setAttribute("y2", String(callout.lineEndY));
  line.setAttribute("stroke", colors.line);
  line.setAttribute("stroke-width", "1");
  line.setAttribute("pointer-events", "none");
  group.appendChild(line);

  const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bar.setAttribute("x", String(callout.barX));
  bar.setAttribute("y", String(callout.barY));
  bar.setAttribute("width", String(callout.barWidth));
  bar.setAttribute("height", String(callout.barHeight));
  bar.setAttribute("rx", String(callout.barRx));
  bar.setAttribute("fill", colors.barFill);
  bar.setAttribute(
    "stroke",
    callout.selected ? colors.selectedStroke : colors.barStroke,
  );
  bar.setAttribute("stroke-width", callout.selected ? "2" : "1");
  group.appendChild(bar);

  const iconCenterX = callout.barX + callout.barWidth / 2;
  const iconCenterY = callout.barY + callout.barHeight / 2;
  const iconSize = Math.min(callout.barWidth, callout.barHeight) - 8;
  drawActionIconToSvg(
    group,
    callout.visual,
    iconCenterX,
    iconCenterY,
    callout.dimmed,
    Math.max(24, iconSize),
  );

  container.appendChild(group);
}

/** 吹き出し1件を Canvas に描画する */
export function renderCalloutToCanvas(
  ctx: CanvasRenderingContext2D,
  callout: SceneCallout,
  colors: {
    barFill: string;
    barStroke: string;
    selectedStroke: string;
    line: string;
  },
): void {
  ctx.save();
  if (callout.dimmed) {
    ctx.globalAlpha = 0.35;
  }

  ctx.beginPath();
  ctx.moveTo(callout.lineStartX, callout.lineStartY);
  ctx.lineTo(callout.lineEndX, callout.lineEndY);
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = 1;
  ctx.stroke();

  roundRect(
    ctx,
    callout.barX,
    callout.barY,
    callout.barWidth,
    callout.barHeight,
    callout.barRx,
    colors.barFill,
  );
  ctx.strokeStyle = callout.selected ? colors.selectedStroke : colors.barStroke;
  ctx.lineWidth = callout.selected ? 2 : 1;
  ctx.stroke();

  const iconCenterX = callout.barX + callout.barWidth / 2;
  const iconCenterY = callout.barY + callout.barHeight / 2;
  const iconSize = Math.min(callout.barWidth, callout.barHeight) - 8;
  drawActionIconToCanvas(
    ctx,
    callout.visual,
    iconCenterX,
    iconCenterY,
    callout.dimmed,
    Math.max(24, iconSize),
  );

  ctx.restore();
}
