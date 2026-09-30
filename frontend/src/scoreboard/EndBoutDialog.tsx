/**
 * Gatilho "Encerrar luta" + diálogo. O vencedor por `points` NÃO é escolhido
 * aqui — quem decide é o `placar-core`, no backend. Empate total volta a tag
 * `tie`: o diálogo mostra a mensagem e NÃO fecha. `submission` exige texto para
 * confirmar. Nenhuma mensagem fala de conexão (o app é offline). Portado de
 * `end-bout-dialog.tsx`.
 */
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { EndErrorTag, MethodId, SideId } from "../ipc/types";
import type { TFn } from "./controls";
import { Dialog } from "./Dialog";

const METHOD_ORDER: readonly MethodId[] = ["points", "submission", "decision", "dq", "wo"];

export function EndBoutDialog({
  whiteName,
  blueName,
  onEnd,
  t,
}: {
  whiteName: string;
  blueName: string;
  /** Devolve `null` no sucesso ou a tag do motivo (`tie`) quando o domínio recusa. */
  onEnd: (method: MethodId, winner: SideId | null, submission: string | null) => Promise<EndErrorTag | null>;
  t: TFn;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<MethodId>("points");
  const [winner, setWinner] = useState<SideId>("white");
  const [submission, setSubmission] = useState("");
  const [error, setError] = useState<string | null>(null);

  const needsWinner = method !== "points";
  const needsSubmission = method === "submission";
  const canConfirm = !needsSubmission || submission.trim() !== "";

  function reset() {
    setMethod("points");
    setWinner("white");
    setSubmission("");
    setError(null);
  }

  function close() {
    setOpen(false);
    reset();
  }

  async function confirm() {
    if (!canConfirm) {
      return;
    }
    setError(null);
    const reason = await onEnd(
      method,
      needsWinner ? winner : null,
      needsSubmission ? submission.trim() : null,
    );
    if (reason === null) {
      close();
      return;
    }
    // Empate total (ou qualquer recusa do domínio): mensagem offline, diálogo aberto.
    setError(t("avulso.tie_message"));
  }

  return (
    <>
      <Button variant="red" size="mesa" onClick={() => setOpen(true)}>
        {t("end_bout.action")}
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title={t("end_bout.action")}
        description={t("end_bout.description")}
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              {t("common_actions.cancel")}
            </Button>
            <Button variant="red" disabled={!canConfirm} onClick={confirm}>
              {t("common_actions.confirm")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {METHOD_ORDER.map((value) => (
              <Button
                key={value}
                variant={method === value ? "primary" : "ghost"}
                size="compact"
                onClick={() => {
                  setMethod(value);
                  setError(null);
                }}
              >
                {t(`end_bout.methods.${value}`)}
              </Button>
            ))}
          </div>

          {needsWinner ? (
            <div className="flex gap-2">
              <Button
                variant={winner === "white" ? "primary" : "ghost"}
                className="flex-1"
                onClick={() => setWinner("white")}
              >
                {t("side.white")}
                {whiteName ? ` · ${whiteName}` : ""}
              </Button>
              <Button
                variant={winner === "blue" ? "primary" : "ghost"}
                className="flex-1"
                onClick={() => setWinner("blue")}
              >
                {t("side.blue")}
                {blueName ? ` · ${blueName}` : ""}
              </Button>
            </div>
          ) : (
            <p className="font-mono text-xs tracking-wide text-ink-faint uppercase">
              {t("end_bout.winner_by_score_hint")}
            </p>
          )}

          {needsSubmission && (
            <div className="space-y-1">
              <label htmlFor="submission" className="text-sm font-medium text-ink">
                {t("end_bout.submission_label")}
              </label>
              <Input
                id="submission"
                value={submission}
                onChange={(event) => setSubmission(event.target.value)}
                placeholder={t("end_bout.submission_placeholder")}
              />
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-score-penalty">
              {error}
            </p>
          )}
        </div>
      </Dialog>
    </>
  );
}
