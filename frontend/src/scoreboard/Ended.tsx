/**
 * Tela de encerramento: placar final, vencedor e método. "Nova luta" volta ao
 * setup zerado (o backend faz o `new_bout`). Só desenha o `EndedView`. Portado
 * do ramo `result` de `AvulsoBoard`.
 */
import { Button } from "../components/ui/button";
import type { EndedView } from "../ipc/types";
import type { TFn } from "./controls";

export function Ended({
  ended,
  onNewBout,
  t,
}: {
  ended: EndedView;
  onNewBout: () => void;
  t: TFn;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-6 text-center">
      <p className="font-mono text-[11px] tracking-[.24em] text-ink-faint uppercase">
        {t("avulso.ended_prefix", { method: t(`end_bout.methods.${ended.method}`) })}
      </p>
      <div className="flex items-center gap-10">
        <div>
          <p className="font-display text-2xl text-ink uppercase">{ended.white_name}</p>
          <p className="font-mono text-6xl font-extrabold text-ink tabular-nums">
            {ended.white_points}
          </p>
        </div>
        <span className="font-accent text-3xl text-score-submission italic">{t("queue.vs")}</span>
        <div>
          <p className="font-display text-2xl text-ink uppercase">{ended.blue_name}</p>
          <p className="font-mono text-6xl font-extrabold text-ink tabular-nums">
            {ended.blue_points}
          </p>
        </div>
      </div>
      {ended.winner_name && (
        <p className="font-display text-xl text-score-advantage uppercase">
          {t("avulso.winner", { name: ended.winner_name })}
        </p>
      )}
      {ended.submission && (
        <p className="font-mono text-sm text-ink-faint">
          {t("avulso.submission_result", { submission: ended.submission })}
        </p>
      )}
      <Button variant="primary" size="mesa" onClick={onNewBout}>
        {t("avulso.new_bout")}
      </Button>
    </div>
  );
}
