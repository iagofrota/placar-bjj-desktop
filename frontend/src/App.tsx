/**
 * Raiz do app. Liga o `LocaleProvider`, o hook do placar, o atalho de espaço e
 * escolhe a tela pelo estágio que o backend emitiu. Recebe o cliente por prop
 * para os testes injetarem um fake; o `main.tsx` passa o cliente Tauri real.
 */
import { useEffect } from "react";
import { LocaleProvider, useLocale } from "./i18n/LocaleContext";
import type { Locale } from "./i18n/types";
import type { ScoreboardClient } from "./ipc/client";
import { Board } from "./scoreboard/Board";
import { listenClockShortcut } from "./scoreboard/clock-shortcut";
import { Ended } from "./scoreboard/Ended";
import { Header } from "./scoreboard/Header";
import { Setup } from "./scoreboard/Setup";
import { useScoreboard } from "./scoreboard/useScoreboard";

function ScoreboardApp({ client }: { client: ScoreboardClient }) {
  const { t } = useLocale();
  const { state, canStart, start, newBout, actions } = useScoreboard(client);

  const onBoard = state?.stage === "board";
  useEffect(() => {
    if (!onBoard) {
      return;
    }
    return listenClockShortcut(() => actions.toggleClock());
  }, [onBoard, actions]);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper text-ink">
      <Header t={t} />
      <div className="flex min-h-0 flex-1 flex-col">
        {state?.stage === "setup" && <Setup canStart={canStart} onStart={start} t={t} />}
        {state?.stage === "board" && state.board && (
          <Board board={state.board} actions={actions} t={t} />
        )}
        {state?.stage === "ended" && state.ended && (
          <Ended ended={state.ended} onNewBout={newBout} t={t} />
        )}
      </div>
    </div>
  );
}

export default function App({
  client,
  initialLocale = "pt_BR",
}: {
  client: ScoreboardClient;
  initialLocale?: Locale;
}) {
  return (
    <LocaleProvider initial={initialLocale}>
      <ScoreboardApp client={client} />
    </LocaleProvider>
  );
}
