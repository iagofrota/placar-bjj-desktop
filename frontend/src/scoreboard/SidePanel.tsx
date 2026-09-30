/**
 * Metade branca ou azul do board: nome em Bebas, placar gigante em mono,
 * vantagem/punição, aviso da 3ª punição e o pad daquele lado. Só desenha o
 * `SideView` que o backend emitiu. Portado de `mesa-side-panel.tsx`.
 */
import type { DeltaId, ScoreKindId, SideId, SideView } from "../ipc/types";
import type { TFn } from "./controls";
import { ScorePad } from "./ScorePad";

const SIDE_TONE: Record<SideId, string> = {
  white: "bg-side-white text-side-white-fg",
  blue: "bg-side-blue text-side-blue-fg",
};

export function SidePanel({
  side,
  view,
  onMark,
  t,
  disabled = false,
}: {
  side: SideId;
  view: SideView;
  onMark: (kind: ScoreKindId, delta: DeltaId) => void;
  t: TFn;
  disabled?: boolean;
}) {
  return (
    <div
      data-testid={`side-${side}`}
      className={`flex min-h-0 flex-1 flex-col justify-between gap-4 p-4 [@media(max-height:500px)]:gap-1 [@media(max-height:500px)]:p-2 ${SIDE_TONE[side]}`}
    >
      <div className="flex flex-col items-center gap-1 text-center [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:justify-center [@media(max-height:500px)]:gap-2">
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase opacity-70">
          {t(`side.${side}`)}
        </span>
        <h2 className="truncate font-display text-[clamp(24px,4vw,44px)] leading-none uppercase [@media(max-height:500px)]:text-2xl">
          {view.name || t("name_tbd")}
        </h2>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-2 [@media(max-height:500px)]:flex-row [@media(max-height:500px)]:gap-4">
        <div
          data-testid={`points-${side}`}
          className="font-mono text-[clamp(64px,14vw,170px)] leading-none font-extrabold tabular-nums [@media(max-height:500px)]:text-[56px]"
        >
          {view.points}
        </div>
        <div className="flex items-center gap-6 font-mono text-lg font-bold tabular-nums">
          <span className="text-score-advantage">
            {view.advantages}{" "}
            <span className="text-xs opacity-70">{t("side_panel.advantages_short")}</span>
          </span>
          <span className="text-score-penalty">
            {view.penalties}{" "}
            <span className="text-xs opacity-70">{t("side_panel.penalties_short")}</span>
          </span>
        </div>
        {view.penalty_alert && (
          <p className="text-center text-xs font-semibold text-score-penalty">
            {t("side_panel.disqualification_warning")}
          </p>
        )}
      </div>

      <ScorePad onMark={onMark} t={t} disabled={disabled} />
    </div>
  );
}
