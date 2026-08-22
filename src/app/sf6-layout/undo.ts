import type { SessionState } from "@/domain/sf6-layout/types";

/** 操作単位 undo（1段） */
export interface UndoStack {
  // eslint-disable-next-line no-unused-vars -- インターフェースの引数名
  pushBefore: (state: SessionState) => void;
  undo: () => SessionState | null;
  clear: () => void;
  canUndo: () => boolean;
}

export function createUndoStack(): UndoStack {
  let previous: SessionState | null = null;

  return {
    pushBefore(state: SessionState) {
      previous = {
        baseModelId: state.baseModelId,
        controlScheme: state.controlScheme,
        slots: state.slots.map((slot) => ({ ...slot })),
      };
    },
    undo() {
      if (!previous) return null;
      const restored = previous;
      previous = null;
      return restored;
    },
    clear() {
      previous = null;
    },
    canUndo() {
      return previous !== null;
    },
  };
}
