/**
 * Double controlável de {@link ScoreboardClient} para os testes. NÃO replica
 * regra do placar: guarda um estado que o teste empurra, registra as ações
 * chamadas e deixa o teste emitir estado/beep aos assinantes. A lógica de
 * verdade mora no `placar-core`/`Session` do backend, testada em Rust.
 */
import type { ScoreboardClient } from "../ipc/client";
import type {
  AdjustId,
  DeltaId,
  MethodId,
  SideId,
  ScoreKindId,
  StateView,
} from "../ipc/types";

export const SETUP_STATE: StateView = { stage: "setup", board: null, ended: null };

export type RecordedCall = { method: string; args: unknown[] };

export class FakeClient implements ScoreboardClient {
  state: StateView;
  calls: RecordedCall[] = [];
  canStartResult = true;
  endBoutError: string | null = null;

  private stateListeners = new Set<(s: StateView) => void>();
  private beepListeners = new Set<() => void>();

  constructor(initial: StateView = SETUP_STATE) {
    this.state = initial;
  }

  private record(method: string, ...args: unknown[]): Promise<StateView> {
    this.calls.push({ method, args });
    return Promise.resolve(this.state);
  }

  getState(): Promise<StateView> {
    this.calls.push({ method: "getState", args: [] });
    return Promise.resolve(this.state);
  }

  canStart(white: string, blue: string, duration: string): Promise<boolean> {
    this.calls.push({ method: "canStart", args: [white, blue, duration] });
    return Promise.resolve(this.canStartResult);
  }

  start(white: string, blue: string, duration: string): Promise<StateView> {
    return this.record("start", white, blue, duration);
  }

  mark(side: SideId, kind: ScoreKindId, delta: DeltaId): Promise<StateView> {
    return this.record("mark", side, kind, delta);
  }

  toggleClock(): Promise<StateView> {
    return this.record("toggleClock");
  }

  adjustClock(adjust: AdjustId): Promise<StateView> {
    return this.record("adjustClock", adjust);
  }

  endBout(method: MethodId, winner: SideId | null, submission: string | null): Promise<StateView> {
    this.calls.push({ method: "endBout", args: [method, winner, submission] });
    if (this.endBoutError) {
      return Promise.reject(new Error(this.endBoutError));
    }
    return Promise.resolve(this.state);
  }

  cancel(): Promise<StateView> {
    return this.record("cancel");
  }

  newBout(): Promise<StateView> {
    return this.record("newBout");
  }

  onState(callback: (s: StateView) => void): () => void {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  onBeep(callback: () => void): () => void {
    this.beepListeners.add(callback);
    return () => this.beepListeners.delete(callback);
  }

  // --- gatilhos que o teste usa para simular o backend ---------------------

  /** Empurra um novo estado, como o backend faria ao emitir. */
  emitState(state: StateView): void {
    this.state = state;
    for (const cb of this.stateListeners) {
      cb(state);
    }
  }

  /** Dispara o beep, como o backend faria na expiração. */
  emitBeep(): void {
    for (const cb of this.beepListeners) {
      cb();
    }
  }

  lastCall(method: string): RecordedCall | undefined {
    return [...this.calls].reverse().find((c) => c.method === method);
  }
}
