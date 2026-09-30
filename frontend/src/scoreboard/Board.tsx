/**
 * O board: dois painéis e a barra do relógio, com os diálogos de cancelar e
 * encerrar nos slots. Só liga o `BoardView` às ações — nenhuma regra.
 */
import type { AdjustId, BoardView, DeltaId, EndErrorTag, MethodId, ScoreKindId, SideId } from "../ipc/types";
import { CancelDialog } from "./CancelDialog";
import { ClockBar } from "./ClockBar";
import type { TFn } from "./controls";
import { EndBoutDialog } from "./EndBoutDialog";
import { ModalProvider } from "./modal";
import { SidePanel } from "./SidePanel";

export type BoardActions = {
  mark: (side: SideId, kind: ScoreKindId, delta: DeltaId) => void;
  toggleClock: () => void;
  adjustClock: (adjust: AdjustId) => void;
  cancel: () => void;
  endBout: (method: MethodId, winner: SideId | null, submission: string | null) => Promise<EndErrorTag | null>;
};

export function Board({
  board,
  actions,
  t,
}: {
  board: BoardView;
  actions: BoardActions;
  t: TFn;
}) {
  return (
    <ModalProvider>
      {(anyOpen) => (
        // Com um diálogo aberto, o board inteiro fica `inert`: nem Tab, nem
        // Espaço, nem Enter alcançam um controle de trás (P6). O conteúdo do
        // diálogo é portalizado para fora daqui, então continua interativo.
        <div
          data-testid="board"
          className="flex min-h-0 flex-1 flex-col"
          inert={anyOpen || undefined}
        >
          <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
            <SidePanel
              side="white"
              view={board.white}
              onMark={(kind, delta) => actions.mark("white", kind, delta)}
              t={t}
            />
            <SidePanel
              side="blue"
              view={board.blue}
              onMark={(kind, delta) => actions.mark("blue", kind, delta)}
              t={t}
            />
          </div>
          <ClockBar
            board={board}
            onToggleClock={actions.toggleClock}
            onAdjustClock={actions.adjustClock}
            t={t}
            cancelSlot={<CancelDialog onConfirm={actions.cancel} t={t} />}
            endSlot={
              <EndBoutDialog
                whiteName={board.white.name}
                blueName={board.blue.name}
                onEnd={actions.endBout}
                t={t}
              />
            }
          />
        </div>
      )}
    </ModalProvider>
  );
}
