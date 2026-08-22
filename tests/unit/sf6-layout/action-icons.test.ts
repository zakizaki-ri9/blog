import { describe, expect, it } from "vitest";
import {
  formatLabelOptionDisplay,
  formatSlotBadge,
  formatSlotBadgeLines,
  resolveActionVisual,
} from "@/domain/sf6-layout/action-icons";

describe("resolveActionVisual", () => {
  it("Classic ラベルを kind/strength に解決する", () => {
    expect(resolveActionVisual("LP")).toEqual({
      kind: "punch",
      strength: "light",
      title: "弱パンチ",
      code: "LP",
    });
    expect(resolveActionVisual("MK")).toEqual({
      kind: "kick",
      strength: "medium",
      title: "中キック",
      code: "MK",
    });
    expect(resolveActionVisual("Throw")).toEqual({
      kind: "throw",
      title: "投げ",
      code: "Throw",
    });
  });

  it("Modern ラベルを解決する", () => {
    expect(resolveActionVisual("L")).toEqual({
      kind: "attack",
      strength: "light",
      title: "弱攻撃",
      code: "L",
    });
    expect(resolveActionVisual("SP")).toEqual({
      kind: "special",
      title: "必殺技",
      code: "SP",
    });
    expect(resolveActionVisual("Assist")).toEqual({
      kind: "assist",
      title: "アシスト",
      code: "Assist",
    });
  });

  it("空ラベルは null", () => {
    expect(resolveActionVisual("")).toBeNull();
  });
});

describe("formatSlotBadge", () => {
  it("単体を弱中強 PK の短文にする", () => {
    expect(formatSlotBadge("LP")).toBe("弱P");
    expect(formatSlotBadge("HK")).toBe("強K");
    expect(formatSlotBadge("DI")).toBe("DI");
    expect(formatSlotBadge("Parry")).toBe("DP");
    expect(formatSlotBadge("Throw")).toBe("投");
    expect(formatSlotBadge("Stick")).toBe("");
  });

  it("組み合わせは PPP ではなく弱中強を残す", () => {
    expect(formatSlotBadge("LP+MP+HP")).toBe("弱P+中P+強P");
    expect(formatSlotBadge("MP+HP")).toBe("中P+強P");
    expect(formatSlotBadge("LK+MK+HK")).toBe("弱K+中K+強K");
    expect(formatSlotBadge("L+M+H")).toBe("弱+中+強");
  });

  it("組み合わせは円内で縦積みする", () => {
    expect(formatSlotBadgeLines("LP+MP+HP")).toEqual(["弱P", "+中P", "+強P"]);
    expect(formatSlotBadgeLines("LP")).toEqual(["弱P"]);
    expect(formatSlotBadgeLines("Stick")).toEqual([]);
  });

  it("セレクト表示も短文にする", () => {
    expect(formatLabelOptionDisplay("LP")).toBe("弱P");
    expect(formatLabelOptionDisplay("LP+MP+HP")).toBe("弱P+中P+強P");
    expect(formatLabelOptionDisplay("")).toBe("未割当");
  });
});
