import type { ButtonSlot, ControlScheme, SessionState } from "@/domain/sf6-layout/types";

export const SESSION_SCHEMA_VERSION = 12;
export const SESSION_STORAGE_KEY = "sf6-layout:v12";
export const MAX_SLOTS = 32;

/** localStorage に保存するセッション形式 */
export interface PersistedSession {
  version: number;
  baseModelId: string;
  controlScheme: ControlScheme;
  slots: ButtonSlot[];
}

function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function isValidSlot(slot: unknown): slot is ButtonSlot {
  if (!slot || typeof slot !== "object") return false;
  const s = slot as ButtonSlot;
  return (
    typeof s.id === "string"
    && s.id.length > 0
    && isFiniteNumber(s.x)
    && isFiniteNumber(s.y)
    && isFiniteNumber(s.r)
    && s.x >= 0 && s.x <= 1
    && s.y >= 0 && s.y <= 1
    && s.r >= 0.01 && s.r <= 0.20
    && (s.label === undefined || typeof s.label === "string")
    && (s.face === undefined || s.face === "front" || s.face === "top")
    && (s.inactive === undefined || typeof s.inactive === "boolean")
  );
}

/** 永続化データを検証する。失敗時は null */
export function validatePersistedSession(
  data: unknown,
  validModelIds: string[],
): PersistedSession | null {
  if (!data || typeof data !== "object") return null;
  const record = data as PersistedSession;

  if (record.version !== SESSION_SCHEMA_VERSION) return null;
  if (!validModelIds.includes(record.baseModelId)) return null;
  if (record.controlScheme !== "classic" && record.controlScheme !== "modern") return null;
  if (!Array.isArray(record.slots) || record.slots.length > MAX_SLOTS) return null;

  const ids = new Set<string>();
  for (const slot of record.slots) {
    if (!isValidSlot(slot)) return null;
    if (ids.has(slot.id)) return null;
    ids.add(slot.id);
  }

  return record;
}

/** セッション状態を永続化形式へ変換する */
export function serializeSession(state: SessionState): PersistedSession {
  return {
    version: SESSION_SCHEMA_VERSION,
    baseModelId: state.baseModelId,
    controlScheme: state.controlScheme,
    slots: state.slots.map((slot) => ({ ...slot })),
  };
}

/** 永続化データをセッション状態へ変換する */
export function persistedToSession(data: PersistedSession): SessionState {
  return {
    baseModelId: data.baseModelId,
    controlScheme: data.controlScheme,
    slots: data.slots.map((slot) => ({ ...slot })),
  };
}
