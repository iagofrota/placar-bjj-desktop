/**
 * Fronteira entre a UI e o backend. Uma chamada por comando IPC, mais duas
 * assinaturas de evento (estado e beep). A UI depende só desta interface — a
 * implementação Tauri e o fake dos testes a satisfazem igualmente.
 */
import type { AdjustId, DeltaId, MethodId, ScoreKindId, SideId, StateView } from "./types";

export interface ScoreboardClient {
  /** Estado atual, para a montagem inicial da UI. */
  getState(): Promise<StateView>;
  /** O Setup aceita nomes e duração? (a regra é do domínio, no backend.) */
  canStart(white: string, blue: string, duration: string): Promise<boolean>;
  start(white: string, blue: string, duration: string): Promise<StateView>;
  mark(side: SideId, kind: ScoreKindId, delta: DeltaId): Promise<StateView>;
  toggleClock(): Promise<StateView>;
  adjustClock(adjust: AdjustId): Promise<StateView>;
  /** Encerra. Rejeita com a tag (`tie`/`empty_submission`) quando o domínio recusa. */
  endBout(method: MethodId, winner: SideId | null, submission: string | null): Promise<StateView>;
  cancel(): Promise<StateView>;
  newBout(): Promise<StateView>;
  /** Assina o estado emitido pelo backend; devolve a função que desassina. */
  onState(callback: (state: StateView) => void): () => void;
  /** Assina o beep da expiração; devolve a função que desassina. */
  onBeep(callback: () => void): () => void;
}

export const STATE_EVENT = "scoreboard://state";
export const BEEP_EVENT = "scoreboard://beep";
