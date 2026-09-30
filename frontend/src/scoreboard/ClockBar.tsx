/**
 * Barra inferior preta: iniciar/pausar, ±10 s, relógio central clicável,
 * cancelar e encerrar. O tempo e o realce de alerta vêm do `BoardView` que o
 * backend emitiu — nada é derivado do relógio do frontend. Portado de
 * `mesa-clock-bar.tsx`.
 */
import type { ReactNode } from "react";
import { Button } from "../components/ui/button";
import type { AdjustId, BoardView } from "../ipc/types";
import { clockToggleName, remainingTimeName, type TFn } from "./controls";
import { PauseIcon, PlayIcon } from "./icons";

const COMPACT_BUTTON =
  "[@media(max-height:500px)]:px-3 [@media(max-height:500px)]:has-[>svg]:px-3";

export function ClockBar({
  board,
  onToggleClock,
  onAdjustClock,
  t,
  cancelSlot,
  endSlot,
}: {
  board: BoardView;
  onToggleClock: () => void;
  onAdjustClock: (adjust: AdjustId) => void;
  t: TFn;
  cancelSlot: ReactNode;
  endSlot: ReactNode;
}) {
  const running = board.is_running;
  const info = [t("avulso.setup.heading"), board.duration_display].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 bg-arena-black px-4 py-3 text-card sm:px-6 [@media(max-height:500px)]:flex-nowrap [@media(max-height:500px)]:gap-2 [@media(max-height:500px)]:py-1">
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase opacity-70 [@media(max-height:500px)]:hidden">
        {info}
      </p>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="mesa"
          className={`border-card/20 text-card hover:bg-card/10 ${COMPACT_BUTTON}`}
          onClick={() => onAdjustClock("minus10")}
        >
          {t("clock_bar.decrement")}
        </Button>
        <Button
          variant={running ? "gold" : "green"}
          size="mesa"
          className={COMPACT_BUTTON}
          onClick={onToggleClock}
          aria-label={clockToggleName(t, running)}
          title={t("clock_bar.shortcut_hint")}
        >
          {running ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
          {running ? t("clock_bar.pause") : t("clock_bar.start")}
        </Button>
        <button
          type="button"
          data-urgent={board.clock_urgent}
          aria-label={remainingTimeName(t, board.remaining_display, running)}
          onClick={onToggleClock}
          className={`font-mono text-5xl font-black tabular-nums sm:text-6xl ${
            board.clock_urgent ? "text-score-penalty" : ""
          }`}
        >
          {board.remaining_display}
        </button>
        <Button
          variant="ghost"
          size="mesa"
          className={`border-card/20 text-card hover:bg-card/10 ${COMPACT_BUTTON}`}
          onClick={() => onAdjustClock("plus10")}
        >
          {t("clock_bar.increment")}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        {cancelSlot}
        {endSlot}
      </div>
    </div>
  );
}
