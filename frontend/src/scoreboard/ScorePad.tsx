/**
 * Pad de pontuação de um lado (US13 AC2): 5 botões grandes com subtítulo e,
 * abaixo, a fila de correção "−", uma por marcação. Só desenha e emite a ação —
 * nenhuma regra. Portado de `mesa-score-pad.tsx`.
 */
import { Button, type ButtonVariant } from "../components/ui/button";
import type { DeltaId, ScoreKindId } from "../ipc/types";
import { padCorrectionName, padMarkName, SCORE_KINDS, type TFn } from "./controls";

const KIND_VARIANT: Record<ScoreKindId, ButtonVariant> = {
  point2: "green",
  point3: "green",
  point4: "green",
  advantage: "gold",
  penalty: "red",
};

export function ScorePad({
  onMark,
  t,
  disabled = false,
}: {
  onMark: (kind: ScoreKindId, delta: DeltaId) => void;
  t: TFn;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        {SCORE_KINDS.map((kind) => (
          <Button
            key={kind}
            variant={KIND_VARIANT[kind]}
            size="mesa"
            disabled={disabled}
            aria-label={padMarkName(t, kind)}
            className="flex h-auto min-h-11 flex-col gap-0.5 px-1 py-2 leading-none [@media(max-height:500px)]:py-1"
            onClick={() => onMark(kind, "add")}
          >
            <span className="text-2xl" aria-hidden="true">
              {t(`score_pad.${kind}.label`)}
            </span>
            <span
              className="font-sans text-[10px] leading-tight whitespace-normal normal-case opacity-80"
              aria-hidden="true"
            >
              {t(`score_pad.${kind}.sub_label`)}
            </span>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {SCORE_KINDS.map((kind) => (
          <Button
            key={`${kind}-correction`}
            variant="ghost"
            size="compact"
            disabled={disabled}
            // Corrigir usa a fonte mono (o glifo "−" existe nela) e herda a cor
            // do lado, que não acompanha o tema do navegador.
            className="font-mono text-inherit"
            aria-label={padCorrectionName(t, kind)}
            onClick={() => onMark(kind, "remove")}
          >
            {t(`score_pad.${kind}.correction_label`)}
          </Button>
        ))}
      </div>
    </div>
  );
}
