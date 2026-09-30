/**
 * Implementação Tauri de {@link ScoreboardClient}: cada método é um `invoke` do
 * comando de mesmo nome, e as assinaturas de evento usam o `listen` do Tauri.
 * Só marshalling — nenhuma regra.
 */
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { BEEP_EVENT, STATE_EVENT, type ScoreboardClient } from "./client";
import type { AdjustId, DeltaId, MethodId, ScoreKindId, SideId, StateView } from "./types";

function subscribe<T>(event: string, handler: (payload: T) => void): () => void {
  let unlisten: UnlistenFn | undefined;
  let cancelled = false;
  void listen<T>(event, (e) => handler(e.payload)).then((fn) => {
    if (cancelled) {
      fn();
    } else {
      unlisten = fn;
    }
  });
  return () => {
    cancelled = true;
    unlisten?.();
  };
}

export function createTauriClient(): ScoreboardClient {
  return {
    getState: () => invoke<StateView>("get_state"),
    canStart: (white, blue, duration) =>
      invoke<boolean>("can_start", { white, blue, duration }),
    start: (white, blue, duration) => invoke<StateView>("start", { white, blue, duration }),
    mark: (side: SideId, kind: ScoreKindId, delta: DeltaId) =>
      invoke<StateView>("mark", { side, kind, delta }),
    toggleClock: () => invoke<StateView>("toggle_clock"),
    adjustClock: (adjust: AdjustId) => invoke<StateView>("adjust_clock", { adjust }),
    endBout: (method: MethodId, winner: SideId | null, submission: string | null) =>
      invoke<StateView>("end_bout", { method, winner, submission }),
    cancel: () => invoke<StateView>("cancel"),
    newBout: () => invoke<StateView>("new_bout"),
    onState: (callback) => subscribe<StateView>(STATE_EVENT, callback),
    onBeep: (callback) => subscribe<null>(BEEP_EVENT, () => callback()),
  };
}
