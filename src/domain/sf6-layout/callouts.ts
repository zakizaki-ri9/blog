import { resolveActionVisual, type ActionVisual } from "@/domain/sf6-layout/action-icons";
import { toPixelCoords } from "@/domain/sf6-layout/coordinates";
import type { ButtonSlot, ViewBoxSize } from "@/domain/sf6-layout/types";

/** アイコン本体の一辺（ピクセル） */
export const CALLOUT_ICON_SIZE = 32;
/** アイコン周りの余白（ピクセル） */
export const CALLOUT_ICON_PAD = 4;
/** 吹き出し同士の最小ギャップ */
export const CALLOUT_BAR_GAP = 4;
/** 角丸 */
export const CALLOUT_BAR_RX = 6;
/** ビューボックス端からの余白（見切れ防止） */
export const CALLOUT_SIDE_MARGIN = 16;

/** @deprecated 互換用。動的サイズの基準高さ */
export const CALLOUT_BAR_HEIGHT = CALLOUT_ICON_SIZE + CALLOUT_ICON_PAD * 2;

/** 描画命令: 吹き出し */
export interface SceneCallout {
  slotId: string;
  lineStartX: number;
  lineStartY: number;
  lineEndX: number;
  lineEndY: number;
  barX: number;
  barY: number;
  barWidth: number;
  barHeight: number;
  barRx: number;
  visual: ActionVisual;
  selected: boolean;
  dimmed?: boolean;
}

interface SlotCalloutDraft {
  slotId: string;
  cx: number;
  cy: number;
  idealBarCenterY: number;
  side: "left" | "right";
  visual: ActionVisual;
  selected: boolean;
  dimmed?: boolean;
  barWidth: number;
  barHeight: number;
}

/** 吹き出しバー寸法（アイコンにフィット） */
export function getCalloutBarSize(visual: ActionVisual): { width: number; height: number } {
  // kind に応じた差分は将来拡張。現状は全アクション同一のコンパクト枠
  void visual;
  const size = CALLOUT_ICON_SIZE + CALLOUT_ICON_PAD * 2;
  return { width: size, height: size };
}

function stackBarCenters(
  drafts: SlotCalloutDraft[],
  gap: number,
  minCenter: number,
  maxCenter: number,
): number[] {
  const indexed = drafts.map((d, i) => ({
    y: d.idealBarCenterY,
    halfH: d.barHeight / 2,
    i,
  }));
  indexed.sort((a, b) => a.y - b.y);

  const centers: number[] = new Array(drafts.length);
  let prevBottom = -Infinity;

  for (const item of indexed) {
    const stacked = Math.max(item.y, prevBottom + gap + item.halfH);
    const clamped = Math.min(maxCenter, Math.max(minCenter, stacked));
    centers[item.i] = clamped;
    prevBottom = clamped + item.halfH;
  }

  return centers;
}

/** スロットから吹き出しレイアウトを計算する */
export function layoutCallouts(
  slots: ButtonSlot[],
  viewBox: ViewBoxSize,
  selectedId: string | null,
  dimmedSlotIds?: ReadonlySet<string>,
): SceneCallout[] {
  const drafts: SlotCalloutDraft[] = [];

  for (const slot of slots) {
    const label = slot.label ?? "";
    const visual = resolveActionVisual(label);
    if (!visual) continue;

    const { cx, cy } = toPixelCoords(slot, viewBox);
    const side: "left" | "right" = slot.x < 0.5 ? "left" : "right";
    const { width, height } = getCalloutBarSize(visual);

    drafts.push({
      slotId: slot.id,
      cx,
      cy,
      idealBarCenterY: cy,
      side,
      visual,
      selected: slot.id === selectedId,
      dimmed: dimmedSlotIds?.has(slot.id),
      barWidth: width,
      barHeight: height,
    });
  }

  const leftDrafts = drafts.filter((d) => d.side === "left");
  const rightDrafts = drafts.filter((d) => d.side === "right");

  const maxHalfH = Math.max(
    CALLOUT_BAR_HEIGHT / 2,
    ...drafts.map((d) => d.barHeight / 2),
    0,
  );
  const minCenter = maxHalfH + 4;
  const maxCenter = viewBox.height - maxHalfH - 4;

  const leftCenters = stackBarCenters(leftDrafts, CALLOUT_BAR_GAP, minCenter, maxCenter);
  const rightCenters = stackBarCenters(rightDrafts, CALLOUT_BAR_GAP, minCenter, maxCenter);

  const callouts: SceneCallout[] = [];

  for (let i = 0; i < leftDrafts.length; i++) {
    const draft = leftDrafts[i];
    const barCenterY = leftCenters[i];
    const barY = barCenterY - draft.barHeight / 2;
    const barX = CALLOUT_SIDE_MARGIN;
    callouts.push({
      slotId: draft.slotId,
      lineStartX: draft.cx,
      lineStartY: draft.cy,
      lineEndX: barX + draft.barWidth,
      lineEndY: barCenterY,
      barX,
      barY,
      barWidth: draft.barWidth,
      barHeight: draft.barHeight,
      barRx: CALLOUT_BAR_RX,
      visual: draft.visual,
      selected: draft.selected,
      dimmed: draft.dimmed,
    });
  }

  for (let i = 0; i < rightDrafts.length; i++) {
    const draft = rightDrafts[i];
    const barCenterY = rightCenters[i];
    const barY = barCenterY - draft.barHeight / 2;
    const barX = viewBox.width - CALLOUT_SIDE_MARGIN - draft.barWidth;
    callouts.push({
      slotId: draft.slotId,
      lineStartX: draft.cx,
      lineStartY: draft.cy,
      lineEndX: barX,
      lineEndY: barCenterY,
      barX,
      barY,
      barWidth: draft.barWidth,
      barHeight: draft.barHeight,
      barRx: CALLOUT_BAR_RX,
      visual: draft.visual,
      selected: draft.selected,
      dimmed: draft.dimmed,
    });
  }

  return callouts;
}
