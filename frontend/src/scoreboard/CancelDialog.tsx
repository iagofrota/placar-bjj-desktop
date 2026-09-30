/**
 * Gatilho "Cancelar" + diálogo de confirmação. Confirmar descarta a luta e volta
 * ao setup (o backend faz o `cancel`). Portado de `CancelAvulsoDialog`.
 */
import { useState } from "react";
import { Button } from "../components/ui/button";
import type { TFn } from "./controls";
import { Dialog } from "./Dialog";

export function CancelDialog({ onConfirm, t }: { onConfirm: () => void; t: TFn }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="mesa"
        className="border-card/20 text-card hover:bg-card/10"
        onClick={() => setOpen(true)}
      >
        {t("common_actions.cancel")}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t("cancel_bout.title")}
        description={t("cancel_bout.avulso_description")}
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              {t("cancel_bout.back")}
            </Button>
            <Button
              variant="red"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              {t("cancel_bout.confirm")}
            </Button>
          </>
        }
      />
    </>
  );
}
