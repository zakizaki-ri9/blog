import { describe, expect, it } from "vitest";
import { createUndoStack } from "@/app/sf6-layout/undo";
import type { SessionState } from "@/domain/sf6-layout/types";

describe("undo", () => {
  const base: SessionState = {
    baseModelId: "generic-pad",
    controlScheme: "classic",
    slots: [{ id: "slot_face_1", x: 0.5, y: 0.5, r: 0.04, label: "LP" }],
  };

  it("直前のセッションを1段だけ復元する", () => {
    const stack = createUndoStack();

    stack.pushBefore(base);
    expect(stack.canUndo()).toBe(true);
    const restored = stack.undo();
    expect(restored).toEqual(base);
    expect(stack.canUndo()).toBe(false);
    expect(stack.undo()).toBeNull();
  });
});
