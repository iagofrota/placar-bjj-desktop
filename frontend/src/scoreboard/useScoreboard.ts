/**
 * Liga a UI ao backend: assina o estado emitido, toca o beep quando o backend
 * sinaliza, e expõe as ações (cada uma um comando IPC). Nenhuma regra mora aqui —
 * o estado sempre vem do backend, nunca é calculado no frontend.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScoreboardClient } from "../ipc/client";
import type { EndErrorTag, MethodId, SideId, StateView } from "../ipc/types";
import { beep } from "./beep";
import type { BoardActions } from "./Board";

export type Scoreboard = {
  state: StateView | null;
  canStart: (white: string, blue: string, duration: string) => Promise<boolean>;
  start: (white: string, blue: string, duration: string) => void;
  newBout: () => void;
  actions: BoardActions;
};

export function useScoreboard(client: ScoreboardClient): Scoreboard {
  const [state, setState] = useState<StateView | null>(null);

  useEffect(() => {
    const offState = client.onState(setState);
    const offBeep = client.onBeep(() => beep());
    void client.getState().then(setState);
    return () => {
      offState();
      offBeep();
    };
  }, [client]);

  const canStart = useCallback(
    (white: string, blue: string, duration: string) => client.canStart(white, blue, duration),
    [client],
  );

  const start = useCallback(
    (white: string, blue: string, duration: string) => {
      void client
        .start(white, blue, duration)
        .then(setState)
        .catch(() => {
          // O botão já barra o inválido; um erro aqui não muda a tela.
        });
    },
    [client],
  );

  const newBout = useCallback(() => {
    void client.newBout().then(setState);
  }, [client]);

  const endBout = useCallback(
    async (
      method: MethodId,
      winner: SideId | null,
      submission: string | null,
    ): Promise<EndErrorTag | null> => {
      try {
        const view = await client.endBout(method, winner, submission);
        setState(view);
        return null;
      } catch (error) {
        const tag = error instanceof Error ? error.message : String(error);
        return tag === "empty_submission" ? "empty_submission" : "tie";
      }
    },
    [client],
  );

  const actions = useMemo<BoardActions>(
    () => ({
      mark: (side, kind, delta) => {
        void client.mark(side, kind, delta).then(setState);
      },
      toggleClock: () => {
        void client.toggleClock().then(setState);
      },
      adjustClock: (adjust) => {
        void client.adjustClock(adjust).then(setState);
      },
      cancel: () => {
        void client.cancel().then(setState);
      },
      endBout,
    }),
    [client, endBout],
  );

  return { state, canStart, start, newBout, actions };
}
