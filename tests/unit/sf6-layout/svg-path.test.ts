import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { extractSvgPathD, scaleSvgPath } from "@/app/sf6-layout/svg-path";
import { PAD_BODY_PATH } from "@/data/sf6-layout/pad-body-path";
import { DEFAULT_VIEW_BOX } from "@/app/sf6-layout/create-scene";

describe("svg-path", () => {
  it("pad-body.svg と path 定数が一致する", () => {
    const svg = readFileSync(resolve(process.cwd(), "src/data/sf6-layout/pad-body.svg"), "utf8");
    expect(extractSvgPathD(svg)).toBe(PAD_BODY_PATH);
  });

  it("viewBox が同じなら path を変えない", () => {
    expect(scaleSvgPath(PAD_BODY_PATH, DEFAULT_VIEW_BOX, DEFAULT_VIEW_BOX)).toBe(PAD_BODY_PATH);
  });

  it("三次ベジェの座標ペアも拡縮する", () => {
    const scaled = scaleSvgPath(
      "M 100 50 C 110 60 190 90 200 100 Z",
      { width: 800, height: 500 },
      { width: 1600, height: 1000 },
    );
    expect(scaled).toBe("M 200.00 100.00 C 220.00 120.00 380.00 180.00 400.00 200.00 Z");
  });
});
