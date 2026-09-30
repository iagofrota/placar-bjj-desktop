/**
 * Diálogo modal com `role="dialog"`. O conteúdo é portalizado para fora do board
 * (para não herdar o `inert` que trava o board) e o diálogo se registra no
 * `ModalProvider`, que aplica esse `inert`. Ao abrir, move o foco para si — com
 * o resto `inert`, o Tab passa a circular só dentro do diálogo (comportamento
 * modal da web). Fecha no Esc.
 */
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useModalRegistration } from "./modal";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useModalRegistration(open);

  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-arena-black/60 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-md rounded-[4px] bg-card p-6 text-ink shadow-xl outline-none"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onClose();
          }
        }}
      >
        <h2 className="font-display text-3xl uppercase">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-faint">{description}</p>}
        {children && <div className="mt-4">{children}</div>}
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
