import { describe, expect, it } from "vitest";
import { getAlignmentGuides } from "@/domain/sf6-layout/align";
import type { ButtonSlot } from "@/domain/sf6-layout/types";

describe("getAlignmentGuides", () => {
  const slots: ButtonSlot[] = [
    { id: "a", x: 0.2, y: 0.3, r: 0.04 },
    { id: "b", x: 0.5, y: 0.3, r: 0.04 },
    { id: "c", x: 0.5, y: 0.6, r: 0.04 },
  ];

  it("閾値内の x/y 一致で補助線座標を返す", () => {
    const guides = getAlignmentGuides(slots, "a", 0.505, 0.305, 0.02);
    expect(guides.verticalXs).toContain(0.5);
    expect(guides.horizontalYs).toContain(0.3);
  });

  it("閾値外では補助線を返さない", () => {
    const guides = getAlignmentGuides(slots, "a", 0.1, 0.1, 0.01);
    expect(guides.verticalXs).toHaveLength(0);
    expect(guides.horizontalYs).toHaveLength(0);
  });

  it("異なる face でも同一キャンバスなら補助線を出す", () => {
    const mixed: ButtonSlot[] = [
      { id: "front_a", x: 0.2, y: 0.3, r: 0.04, face: "front" },
      { id: "top_a", x: 0.5, y: 0.3, r: 0.04, face: "top" },
    ];
    const guides = getAlignmentGuides(mixed, "front_a", 0.5, 0.3, 0.02);
    expect(guides.verticalXs).toContain(0.5);
  });
});
