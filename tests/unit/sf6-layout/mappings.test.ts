import { describe, expect, it } from "vitest";
import controllersData from "@/data/sf6-layout/controllers.json";
import mappingsData from "@/data/sf6-layout/mappings.json";
import { createSessionFromPreset } from "@/domain/sf6-layout/slots";
import type { ControlScheme, ControllerPreset, MappingsData } from "@/domain/sf6-layout/types";

const presets = controllersData.presets as ControllerPreset[];
const mappings = mappingsData as MappingsData;

function labelsFor(modelId: string, scheme: ControlScheme): Record<string, string> {
  const preset = presets.find((item) => item.modelId === modelId);
  if (!preset) throw new Error(`preset not found: ${modelId}`);
  const session = createSessionFromPreset(preset, scheme, mappings);
  return Object.fromEntries(session.slots.map((slot) => [slot.id, slot.label ?? ""]));
}

describe("公式デフォルト割当", () => {
  it("パッド Classic は DualSense 伝統 6 ボタン", () => {
    const labels = labelsFor("generic-pad", "classic");
    expect(labels.slot_face_4).toBe("LP");
    expect(labels.slot_face_1).toBe("MP");
    expect(labels.slot_face_2).toBe("MK");
    expect(labels.slot_face_3).toBe("LK");
    expect(labels.slot_r1).toBe("HP");
    expect(labels.slot_r2).toBe("HK");
    expect(labels.slot_l1).toBe("HP+HK");
    expect(labels.slot_l2).toBe("MP+MK");
    expect(labels.slot_ls).toBe("Stick");
    expect(labels.slot_dpad).toBe("");
  });

  it("パッド Modern は delaymania 初期配置（PS 基準）", () => {
    const labels = labelsFor("generic-pad", "modern");
    expect(labels.slot_face_4).toBe("L");
    expect(labels.slot_face_3).toBe("M");
    expect(labels.slot_face_2).toBe("H");
    expect(labels.slot_face_1).toBe("SP");
    expect(labels.slot_l1).toBe("DI");
    expect(labels.slot_l2).toBe("Throw");
    expect(labels.slot_r1).toBe("Parry");
    expect(labels.slot_r2).toBe("Assist");
  });

  it("レバー Classic は 8 ボタンアケコン", () => {
    const labels = labelsFor("generic-stick", "classic");
    expect(labels.slot_face_1).toBe("LP");
    expect(labels.slot_face_2).toBe("MP");
    expect(labels.slot_face_3).toBe("HP");
    expect(labels.slot_l1).toBe("HK");
    expect(labels.slot_face_4).toBe("LK");
    expect(labels.slot_face_5).toBe("MK");
    expect(labels.slot_face_6).toBe("MP+MK");
    expect(labels.slot_l2).toBe("HP+HK");
  });

  it("レバー Modern は上段攻撃・下段システム", () => {
    const labels = labelsFor("generic-stick", "modern");
    expect(labels.slot_face_1).toBe("L");
    expect(labels.slot_face_2).toBe("M");
    expect(labels.slot_face_3).toBe("H");
    expect(labels.slot_l1).toBe("SP");
    expect(labels.slot_face_4).toBe("Throw");
    expect(labels.slot_face_5).toBe("Assist");
    expect(labels.slot_face_6).toBe("Parry");
    expect(labels.slot_l2).toBe("DI");
  });

  it("レバーレス Classic はパッド □△R1L1 / ✕○R2L2", () => {
    const labels = labelsFor("generic-leverless", "classic");
    expect(labels.slot_face_1).toBe("LP");
    expect(labels.slot_face_2).toBe("MP");
    expect(labels.slot_face_3).toBe("HP");
    expect(labels.slot_l1).toBe("HP+HK");
    expect(labels.slot_face_4).toBe("LK");
    expect(labels.slot_face_5).toBe("MK");
    expect(labels.slot_face_6).toBe("HK");
    expect(labels.slot_l2).toBe("MP+MK");
    expect(labels.slot_up).toBe("↑");
  });

  it("レバーレス Modern はパッド物理位置に対応", () => {
    const labels = labelsFor("generic-leverless", "modern");
    expect(labels.slot_face_1).toBe("L");
    expect(labels.slot_face_2).toBe("SP");
    expect(labels.slot_face_3).toBe("Parry");
    expect(labels.slot_l1).toBe("DI");
    expect(labels.slot_face_4).toBe("M");
    expect(labels.slot_face_5).toBe("H");
    expect(labels.slot_face_6).toBe("Assist");
    expect(labels.slot_l2).toBe("Throw");
  });
});
