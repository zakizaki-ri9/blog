import { describe, expect, it } from "vitest";
import {
  CALLOUT_BAR_HEIGHT,
  CALLOUT_ICON_PAD,
  CALLOUT_ICON_SIZE,
  CALLOUT_SIDE_MARGIN,
  getCalloutBarSize,
  layoutCallouts,
} from "@/domain/sf6-layout/callouts";
import type { ButtonSlot } from "@/domain/sf6-layout/types";

const VIEW_BOX = { width: 800, height: 500 };

describe("layoutCallouts", () => {
  it("空ラベルは吹き出しに含めない", () => {
    const slots: ButtonSlot[] = [
      { id: "a", x: 0.2, y: 0.3, r: 0.04, label: "LP" },
      { id: "b", x: 0.8, y: 0.3, r: 0.04 },
    ];
    const callouts = layoutCallouts(slots, VIEW_BOX, null);
    expect(callouts).toHaveLength(1);
    expect(callouts[0].slotId).toBe("a");
  });

  it("左スロットは左帯、右スロットは右帯に配置する", () => {
    const slots: ButtonSlot[] = [
      { id: "left", x: 0.2, y: 0.4, r: 0.04, label: "LP" },
      { id: "right", x: 0.8, y: 0.4, r: 0.04, label: "MP" },
    ];
    const callouts = layoutCallouts(slots, VIEW_BOX, null);
    const left = callouts.find((c) => c.slotId === "left");
    const right = callouts.find((c) => c.slotId === "right");
    expect(left!.barX).toBe(CALLOUT_SIDE_MARGIN);
    expect(right!.barX + right!.barWidth).toBe(VIEW_BOX.width - CALLOUT_SIDE_MARGIN);
  });

  it("吹き出しはアイコンにフィットしたサイズでビュー内に収まる", () => {
    const slots: ButtonSlot[] = [
      { id: "a", x: 0.2, y: 0.3, r: 0.04, label: "LP" },
      { id: "b", x: 0.8, y: 0.3, r: 0.04, label: "HP" },
    ];
    const expected = getCalloutBarSize({ kind: "punch", strength: "light", title: "弱パンチ", code: "LP" });
    const callouts = layoutCallouts(slots, VIEW_BOX, null);
    for (const c of callouts) {
      expect(c.barWidth).toBe(expected.width);
      expect(c.barHeight).toBe(expected.height);
      expect(c.barX).toBeGreaterThanOrEqual(CALLOUT_SIDE_MARGIN - 0.01);
      expect(c.barX + c.barWidth).toBeLessThanOrEqual(VIEW_BOX.width - CALLOUT_SIDE_MARGIN + 0.01);
      expect(c.barY).toBeGreaterThanOrEqual(0);
      expect(c.barY + c.barHeight).toBeLessThanOrEqual(VIEW_BOX.height);
    }
    expect(expected.width).toBe(CALLOUT_ICON_SIZE + CALLOUT_ICON_PAD * 2);
  });

  it("同一側の吹き出しは縦スタックで重ならない", () => {
    const slots: ButtonSlot[] = [
      { id: "a", x: 0.2, y: 0.2, r: 0.04, label: "LP" },
      { id: "b", x: 0.15, y: 0.22, r: 0.04, label: "LK" },
      { id: "c", x: 0.18, y: 0.24, r: 0.04, label: "MK" },
    ];
    const callouts = layoutCallouts(slots, VIEW_BOX, null);
    const sorted = callouts
      .map((c) => c.barY)
      .sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i] - sorted[i - 1]).toBeGreaterThanOrEqual(CALLOUT_BAR_HEIGHT);
    }
  });
});
