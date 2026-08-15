import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => {
  const listeners = new Map<
    string,
    Set<(event: { payload: unknown }) => void>
  >();

  (globalThis as Record<string, unknown>).__emitTauriEvent = (
    event: string,
    payload: unknown,
  ) => {
    listeners.get(event)?.forEach((handler) => handler({ payload }));
  };

  return {
    listen: vi.fn(
      (event: string, handler: (e: { payload: unknown }) => void) => {
        if (!listeners.has(event)) listeners.set(event, new Set());
        listeners.get(event)!.add(handler);
        return Promise.resolve(() => listeners.get(event)?.delete(handler));
      },
    ),
  };
});
