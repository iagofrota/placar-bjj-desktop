import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { translate } from "../i18n/translate";
import { CancelDialog } from "./CancelDialog";

const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
  translate("pt_BR", key, r);

describe("CancelDialog", () => {
  it("confirmar_descarta_a_luta_voltar_apenas_fecha", () => {
    const onConfirm = vi.fn();
    render(<CancelDialog onConfirm={onConfirm} t={t} />);

    // abre
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Cancelar esta luta?")).toBeInTheDocument();

    // "Voltar" só fecha
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    // reabre e confirma
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancelar luta" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
