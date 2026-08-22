import {
  persistedToSession,
  serializeSession,
  SESSION_STORAGE_KEY,
  validatePersistedSession,
} from "@/app/sf6-layout/session-schema";
import type { SessionState } from "@/domain/sf6-layout/types";

/** localStorage からセッションを読み込む */
export function loadPersistedSession(validModelIds: string[]): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const validated = validatePersistedSession(JSON.parse(raw), validModelIds);
    if (!validated) return null;
    return persistedToSession(validated);
  } catch {
    return null;
  }
}

/** localStorage にセッションを保存する */
export function savePersistedSession(state: SessionState): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(serializeSession(state)));
  } catch {
    // 容量超過等は無視（編集は継続可能）
  }
}

/** localStorage のセッションを削除する */
export function clearPersistedSession(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // 無視
  }
}
