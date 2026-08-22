import { PAD_BODY_PATH } from "@/data/sf6-layout/pad-body-path";
import { scaleSvgPath } from "@/app/sf6-layout/svg-path";
import { toPixelCoords } from "@/domain/sf6-layout/coordinates";
import { getSlotShape } from "@/domain/sf6-layout/slot-shape";
import type {
  ButtonSlot,
  FormFactor,
  LayoutScene,
  SceneChromeItem,
  ViewBoxSize,
} from "@/domain/sf6-layout/types";

export const DEFAULT_VIEW_BOX: ViewBoxSize = { width: 800, height: 500 };

export interface LayoutSceneContext {
  formFactor?: FormFactor;
}

function scaledX(viewBox: ViewBoxSize, x: number): string {
  return ((x / DEFAULT_VIEW_BOX.width) * viewBox.width).toFixed(1);
}

function scaledY(viewBox: ViewBoxSize, y: number): string {
  return ((y / DEFAULT_VIEW_BOX.height) * viewBox.height).toFixed(1);
}

function scaledPoint(viewBox: ViewBoxSize, x: number, y: number): string {
  return `${scaledX(viewBox, x)} ${scaledY(viewBox, y)}`;
}

function px(viewBox: ViewBoxSize, x: number, y: number): { x: number; y: number } {
  return {
    x: (x / DEFAULT_VIEW_BOX.width) * viewBox.width,
    y: (y / DEFAULT_VIEW_BOX.height) * viewBox.height,
  };
}

/** パッド: 汎用パッドの一体外形（L2/R2 を含む左右対称の三次ベジェ） */
function padFrontPath(viewBox: ViewBoxSize): string {
  return scaleSvgPath(PAD_BODY_PATH, DEFAULT_VIEW_BOX, viewBox);
}

/** レバーの横長筐体 */
function stickBodyPath(viewBox: ViewBoxSize): string {
  const p = (x: number, y: number) => scaledPoint(viewBox, x, y);
  return [
    `M ${p(80, 110)}`,
    `H ${scaledX(viewBox, 720)}`,
    `Q ${p(760, 110)} ${p(760, 150)}`,
    `V ${scaledY(viewBox, 350)}`,
    `Q ${p(760, 390)} ${p(720, 390)}`,
    `H ${scaledX(viewBox, 80)}`,
    `Q ${p(40, 390)} ${p(40, 350)}`,
    `V ${scaledY(viewBox, 150)}`,
    `Q ${p(40, 110)} ${p(80, 110)}`,
    "Z",
  ].join(" ");
}

/** レバーレス: 30×21 系のタブレット型。製品トレースではない */
function leverlessBodyPath(viewBox: ViewBoxSize): string {
  const p = (x: number, y: number) => scaledPoint(viewBox, x, y);
  return [
    `M ${p(90, 40)}`,
    `H ${scaledX(viewBox, 710)}`,
    `Q ${p(750, 40)} ${p(750, 80)}`,
    `V ${scaledY(viewBox, 410)}`,
    `Q ${p(750, 450)} ${p(710, 450)}`,
    `H ${scaledX(viewBox, 90)}`,
    `Q ${p(50, 450)} ${p(50, 410)}`,
    `V ${scaledY(viewBox, 80)}`,
    `Q ${p(50, 40)} ${p(90, 40)}`,
    "Z",
  ].join(" ");
}

function resolveBodyOutline(
  viewBox: ViewBoxSize,
  context?: LayoutSceneContext,
): LayoutScene["bodyOutline"] {
  const scaleX = viewBox.width / DEFAULT_VIEW_BOX.width;
  const scaleY = viewBox.height / DEFAULT_VIEW_BOX.height;
  const scaleMin = Math.min(scaleX, scaleY);

  if (context?.formFactor === "pad") {
    return {
      x: 40 * scaleX,
      y: 16 * scaleY,
      width: 720 * scaleX,
      height: 468 * scaleY,
      rx: 40 * scaleMin,
      path: padFrontPath(viewBox),
    };
  }

  if (context?.formFactor === "leverless") {
    return {
      x: 50 * scaleX,
      y: 40 * scaleY,
      width: 700 * scaleX,
      height: 410 * scaleY,
      rx: 28 * scaleMin,
      path: leverlessBodyPath(viewBox),
    };
  }

  if (context?.formFactor === "stick") {
    return {
      x: 40 * scaleX,
      y: 110 * scaleY,
      width: 720 * scaleX,
      height: 280 * scaleY,
      rx: 24 * scaleMin,
      path: stickBodyPath(viewBox),
    };
  }

  return {
    x: 40 * scaleX,
    y: 40 * scaleY,
    width: 720 * scaleX,
    height: 420 * scaleY,
    rx: 24 * scaleMin,
  };
}

function resolveChrome(
  viewBox: ViewBoxSize,
  context?: LayoutSceneContext,
): SceneChromeItem[] {
  const items: SceneChromeItem[] = [];
  const formFactor = context?.formFactor;

  if (formFactor === "stick") {
    const divider = px(viewBox, 304, 110);
    items.push({
      kind: "zoneDivider",
      x: divider.x,
      y: divider.y,
      height: (280 / DEFAULT_VIEW_BOX.height) * viewBox.height,
    });
  }

  return items;
}

function isSlotDimmed(slot: ButtonSlot): boolean {
  return slot.inactive === true;
}

/** スロット配列から描画シーンを生成する */
export function createLayoutScene(
  slots: ButtonSlot[],
  viewBox: ViewBoxSize,
  selectedId: string | null,
  context?: LayoutSceneContext,
): LayoutScene {
  const bodyOutline = resolveBodyOutline(viewBox, context);
  const chrome = resolveChrome(viewBox, context);

  const sceneSlots = slots.map((slot) => {
    const { cx, cy, radius } = toPixelCoords(slot, viewBox);
    return {
      slotId: slot.id,
      cx,
      cy,
      radius,
      label: slot.label ?? "",
      selected: slot.id === selectedId,
      dimmed: isSlotDimmed(slot),
      shape: getSlotShape(slot.id, context?.formFactor),
    };
  });

  return { viewBox, bodyOutline, slots: sceneSlots, callouts: [], chrome };
}
