import { describe, expect, it } from "vitest";
import { DEFAULT_VIEW_BOX } from "@/app/sf6-layout/create-scene";
import { PAD_BODY_PATH } from "@/data/sf6-layout/pad-body-path";
import controllersData from "@/data/sf6-layout/controllers.json";
import { magnetizePosition, snapAlignX, snapAlignY } from "@/domain/sf6-layout/align";
import { toPixelCoords } from "@/domain/sf6-layout/coordinates";
import {
  diagnosePadLayout,
  formatConstraintViolation,
} from "@/domain/sf6-layout/layout-constraints";
import type { ButtonSlot, ControllerPreset } from "@/domain/sf6-layout/types";

const presets = controllersData.presets as ControllerPreset[];

describe("align", () => {
  const slots: ButtonSlot[] = [
    { id: "a", x: 0.2, y: 0.3, r: 0.04 },
    { id: "b", x: 0.5, y: 0.3, r: 0.04 },
    { id: "c", x: 0.5, y: 0.6, r: 0.04 },
  ];

  it("縦揃えで x を最寄りスロットに合わせる", () => {
    const aligned = snapAlignX(slots, "a");
    const a = aligned.find((s) => s.id === "a");
    expect(a?.x).toBe(0.5);
  });

  it("横揃えで y を最寄りスロットに合わせる", () => {
    const aligned = snapAlignY(slots, "c");
    const c = aligned.find((s) => s.id === "c");
    expect(c?.y).toBe(0.3);
  });

  it("マグネットで近い軸に吸着する", () => {
    const result = magnetizePosition(slots, "a", 0.505, 0.315, 0.02);
    expect(result.x).toBe(0.5);
    expect(result.y).toBe(0.3);
  });
});

describe("controller presets", () => {
  it("レバーレスは NOLVA 寄せ 15 スロット（方向4+攻撃8+拡張3）", () => {
    const leverless = presets.find((p) => p.modelId === "generic-leverless");
    expect(leverless?.buttonSlots.length).toBe(15);
    const up = leverless?.buttonSlots.find((s) => s.id === "slot_up");
    const left = leverless?.buttonSlots.find((s) => s.id === "slot_left");
    const down = leverless?.buttonSlots.find((s) => s.id === "slot_down");
    const right = leverless?.buttonSlots.find((s) => s.id === "slot_right");
    const face1 = leverless?.buttonSlots.find((s) => s.id === "slot_face_1");
    const extra2 = leverless?.buttonSlots.find((s) => s.id === "slot_extra_2");
    const extra3 = leverless?.buttonSlots.find((s) => s.id === "slot_extra_3");
    expect(up?.r).toBeGreaterThan(left?.r ?? 0);
    expect(left?.r ?? 0).toBeGreaterThanOrEqual(0.075);
    expect(up?.r).toBeCloseTo(0.092, 3);
    expect(up?.y).toBeGreaterThan(left?.y ?? 0);
    // 左クラスタは ↓ が頂点。← → はその下で左右
    expect(down?.y ?? 1).toBeLessThan(left?.y ?? 0);
    expect(down?.y ?? 1).toBeLessThan(right?.y ?? 0);
    expect(Math.abs((left?.y ?? 0) - (right?.y ?? 1))).toBeLessThan(0.02);
    expect(down?.x ?? 0).toBeGreaterThan(left?.x ?? 1);
    expect(down?.x ?? 1).toBeLessThan(right?.x ?? 0);
    const extra1 = leverless?.buttonSlots.find((s) => s.id === "slot_extra_1");
    expect(extra1?.x).toBeLessThan(left?.x ?? 0);
    // 中央は Up と拡張 2 つの横一列
    expect(Math.abs((extra2?.y ?? 0) - (up?.y ?? 1))).toBeLessThan(0.02);
    expect(Math.abs((extra3?.y ?? 0) - (up?.y ?? 1))).toBeLessThan(0.02);
    expect(extra2?.x).toBeLessThan(up?.x ?? 0);
    expect(extra3?.x).toBeGreaterThan(up?.x ?? 0);
    expect(Math.abs((up?.x ?? 0) - (extra2?.x ?? 0) - ((extra3?.x ?? 0) - (up?.x ?? 0)))).toBeLessThan(0.04);
    // 攻撃は 2×4 格子
    const face2 = leverless?.buttonSlots.find((s) => s.id === "slot_face_2");
    const face4 = leverless?.buttonSlots.find((s) => s.id === "slot_face_4");
    const face5 = leverless?.buttonSlots.find((s) => s.id === "slot_face_5");
    expect(Math.abs((face1?.y ?? 0) - (face2?.y ?? 1))).toBeLessThan(0.01);
    expect(Math.abs((face1?.x ?? 0) - (face4?.x ?? 1))).toBeLessThan(0.01);
    expect(Math.abs((face2?.x ?? 0) - (face5?.x ?? 1))).toBeLessThan(0.01);
  });

  it("レバーレスのスロットはピクセル空間で重ならない", () => {
    const leverless = presets.find((p) => p.modelId === "generic-leverless");
    const slots = leverless?.buttonSlots ?? [];
    const margin = 8;
    for (let i = 0; i < slots.length; i += 1) {
      for (let j = i + 1; j < slots.length; j += 1) {
        const a = toPixelCoords(slots[i], DEFAULT_VIEW_BOX);
        const b = toPixelCoords(slots[j], DEFAULT_VIEW_BOX);
        const dist = Math.hypot(a.cx - b.cx, a.cy - b.cy);
        expect(
          dist,
          `${slots[i].id} と ${slots[j].id} が重なる (dist=${dist.toFixed(1)})`,
        ).toBeGreaterThanOrEqual(a.radius + b.radius + margin);
      }
    }
  });

  it("スティックはレバー + 8 アクション", () => {
    const stick = presets.find((p) => p.modelId === "generic-stick");
    expect(stick?.buttonSlots.length).toBe(9);
    expect(stick?.buttonSlots.some((s) => s.id === "slot_stick")).toBe(true);
    const slot = (id: string) => stick?.buttonSlots.find((s) => s.id === id);
    expect(slot("slot_stick")?.r).toBeCloseTo(0.110, 3);
    expect(slot("slot_face_1")?.r).toBeCloseTo(0.080, 3);
    expect(slot("slot_l1")?.r).toBe(slot("slot_face_1")?.r);
    expect(slot("slot_stick")?.x ?? 1).toBeLessThan(0.38);
    expect(slot("slot_face_1")?.x ?? 0).toBeGreaterThan(0.38);
    expect(slot("slot_face_2")?.y ?? 1).toBeLessThan(slot("slot_face_1")?.y ?? 0);
    expect(slot("slot_face_3")?.y ?? 1).toBeLessThan(slot("slot_face_2")?.y ?? 0);
    expect(slot("slot_face_1")?.y ?? 1).toBeLessThan(slot("slot_face_4")?.y ?? 0);
  });

  it("パッドのスロットは外郭内で実形状が重ならない", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    const violations = diagnosePadLayout(pad?.buttonSlots ?? [], PAD_BODY_PATH, DEFAULT_VIEW_BOX);
    expect(violations.map(formatConstraintViolation), violations.map(formatConstraintViolation).join("\n")).toEqual([]);
  });

  it("パッドは肩4 + 面4 + 十字1 + 左ST1 で slot_up を持たない", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    expect(pad?.buttonSlots.length).toBe(10);
    const ids = pad?.buttonSlots.map((s) => s.id) ?? [];
    expect(ids).toEqual(expect.arrayContaining([
      "slot_l1",
      "slot_l2",
      "slot_r1",
      "slot_r2",
      "slot_face_1",
      "slot_face_2",
      "slot_face_3",
      "slot_face_4",
      "slot_dpad",
      "slot_ls",
    ]));
    expect(ids).not.toContain("slot_up");
    expect(ids).not.toContain("slot_rs");
  });

  it("パッド肩は L2/R2 が上段、L1/R1 が下段の左右クラスタ", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    const slot = (id: string) => pad?.buttonSlots.find((s) => s.id === id);
    const l1 = slot("slot_l1");
    const l2 = slot("slot_l2");
    const r1 = slot("slot_r1");
    const r2 = slot("slot_r2");
    expect(l2?.y ?? 1).toBeLessThan(l1?.y ?? 0);
    expect(r2?.y ?? 1).toBeLessThan(r1?.y ?? 0);
    expect(Math.abs((l2?.y ?? 0) - (r2?.y ?? 1))).toBeLessThan(0.02);
    expect(Math.abs((l1?.y ?? 0) - (r1?.y ?? 1))).toBeLessThan(0.02);
    expect(Math.abs((l2?.x ?? 0) - (l1?.x ?? 1))).toBeLessThan(0.02);
    expect(Math.abs((r2?.x ?? 0) - (r1?.x ?? 1))).toBeLessThan(0.02);
    expect(l2?.x ?? 1).toBeLessThan(r2?.x ?? 0);
    expect((r2?.x ?? 0) - (l2?.x ?? 1)).toBeGreaterThan(0.45);
  });

  it("パッドの面・十字・左STは直前サイズの約2/3で、肩は拡大する", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    const slot = (id: string) => pad?.buttonSlots.find((s) => s.id === id);
    expect(slot("slot_dpad")?.r).toBeCloseTo(0.117, 3);
    expect(slot("slot_ls")?.r).toBeCloseTo(0.107, 3);
    expect(slot("slot_face_1")?.r).toBeCloseTo(0.085, 3);
    expect(slot("slot_face_2")?.r).toBe(slot("slot_face_1")?.r);
    expect(slot("slot_l2")?.r ?? 0).toBeGreaterThanOrEqual(0.07);
    expect(slot("slot_l1")?.r ?? 0).toBeGreaterThanOrEqual(0.055);
    expect(slot("slot_r2")?.r).toBe(slot("slot_l2")?.r);
    expect(slot("slot_r1")?.r).toBe(slot("slot_l1")?.r);
  });

  it("パッド表は DualSense 寄せ（十字が左、左STはその下内側、面は右ダイヤ）", () => {
    const pad = presets.find((p) => p.modelId === "generic-pad");
    const slot = (id: string) => pad?.buttonSlots.find((s) => s.id === id);
    const dpad = slot("slot_dpad");
    const ls = slot("slot_ls");
    const face1 = slot("slot_face_1");
    const face2 = slot("slot_face_2");
    const face3 = slot("slot_face_3");
    const face4 = slot("slot_face_4");
    expect(dpad?.y ?? 1).toBeLessThan(ls?.y ?? 0);
    expect(dpad?.x ?? 1).toBeLessThan(ls?.x ?? 0);
    expect(face1?.y ?? 1).toBeLessThan(face3?.y ?? 0);
    expect(face4?.x ?? 1).toBeLessThan(face2?.x ?? 0);
    expect(Math.abs((face1?.x ?? 0) - (face3?.x ?? 1))).toBeLessThan(0.02);
    expect(Math.abs((face2?.y ?? 0) - (face4?.y ?? 1))).toBeLessThan(0.02);
    expect(dpad?.x ?? 1).toBeLessThan(face4?.x ?? 0);
    const faceCenterY = ((face1?.y ?? 0) + (face3?.y ?? 0)) / 2;
    expect(Math.abs((dpad?.y ?? 0) - faceCenterY)).toBeLessThan(0.20);
  });

  it("参考 URL はメーカー公式製品ページである", () => {
    const url = (modelId: string) => presets.find((p) => p.modelId === modelId)?.meta.sourceUrl ?? "";
    expect(url("generic-pad")).toContain("playstation.com/ja-jp/accessories/dualsense-wireless-controller");
    expect(url("generic-stick")).toContain("hori.jp/products/p5/fs_alpha");
    expect(url("generic-leverless")).toContain("hori.jp/products/p5/spf-049");
  });
});
