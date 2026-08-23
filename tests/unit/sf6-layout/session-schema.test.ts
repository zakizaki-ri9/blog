import { describe, expect, it } from "vitest";
import {
  persistedToSession,
  serializeSession,
  SESSION_SCHEMA_VERSION,
  SESSION_STORAGE_KEY,
  validatePersistedSession,
} from "@/app/sf6-layout/session-schema";

describe("session-schema", () => {
  const validModelIds = ["generic-pad", "generic-stick"];

  it("正常なセッションを検証・往復できる", () => {
    const state = {
      baseModelId: "generic-pad",
      controlScheme: "classic" as const,
      slots: [{ id: "slot_face_1", x: 0.5, y: 0.5, r: 0.04, label: "LP", face: "front" as const }],
    };
    const serialized = serializeSession(state);
    const validated = validatePersistedSession(serialized, validModelIds);
    expect(validated).not.toBeNull();
    expect(persistedToSession(validated!)).toEqual(state);
  });

  it("inactive を永続化・復元できる", () => {
    const state = {
      baseModelId: "generic-pad",
      controlScheme: "classic" as const,
      slots: [{ id: "slot_face_1", x: 0.5, y: 0.5, r: 0.04, inactive: true }],
    };
    const validated = validatePersistedSession(serializeSession(state), validModelIds);
    expect(validated?.slots[0].inactive).toBe(true);
    expect(persistedToSession(validated!).slots[0].inactive).toBe(true);
  });

  it("スキーマは v12 で旧バージョンを拒否する", () => {
    expect(SESSION_SCHEMA_VERSION).toBe(12);
    expect(SESSION_STORAGE_KEY).toBe("sf6-layout:v12");
    expect(
      validatePersistedSession(
        {
          version: 11,
          baseModelId: "generic-pad",
          controlScheme: "classic",
          slots: [],
        },
        validModelIds,
      ),
    ).toBeNull();
  });

  it("破損データを拒否する", () => {
    expect(validatePersistedSession(null, validModelIds)).toBeNull();
    expect(validatePersistedSession({ version: 99 }, validModelIds)).toBeNull();
    expect(
      validatePersistedSession(
        {
          version: SESSION_SCHEMA_VERSION,
          baseModelId: "unknown",
          controlScheme: "classic",
          slots: [],
        },
        validModelIds,
      ),
    ).toBeNull();
    expect(
      validatePersistedSession(
        {
          version: SESSION_SCHEMA_VERSION,
          baseModelId: "generic-pad",
          controlScheme: "classic",
          slots: [{ id: "a", x: 2, y: 0.5, r: 0.04 }],
        },
        validModelIds,
      ),
    ).toBeNull();
    expect(
      validatePersistedSession(
        {
          version: SESSION_SCHEMA_VERSION,
          baseModelId: "generic-pad",
          controlScheme: "classic",
          slots: [{ id: "a", x: 0.5, y: 0.5, r: 0.04, face: "invalid" as "front" }],
        },
        validModelIds,
      ),
    ).toBeNull();
    expect(
      validatePersistedSession(
        {
          version: SESSION_SCHEMA_VERSION,
          baseModelId: "generic-pad",
          controlScheme: "classic",
          slots: [{ id: "a", x: 0.5, y: 0.5, r: 0.04, inactive: "yes" as unknown as boolean }],
        },
        validModelIds,
      ),
    ).toBeNull();
  });
});
