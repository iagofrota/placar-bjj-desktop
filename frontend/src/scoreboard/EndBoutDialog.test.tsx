import "../test-support/rtl-cleanup";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { translate } from "../i18n/translate";
import { EndBoutDialog } from "./EndBoutDialog";

const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
  translate("pt_BR", key, r);

function open() {
  fireEvent.click(screen.getByRole("button", { name: "Encerrar luta" }));
  return screen.getByRole("dialog");
}

describe("EndBoutDialog", () => {
  it("empate_total_por_pontos_mostra_mensagem_e_nao_fecha", async () => {
    const onEnd = vi.fn().mockResolvedValue("tie");
    render(<EndBoutDialog whiteName="Ana" blueName="Bia" onEnd={onEnd} t={t} />);

    open();
    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));

    expect(onEnd).toHaveBeenCalledWith("points", null, null);
    await waitFor(() =>
      expect(
        screen.getByText("Empate total: encerre por Decisão e escolha o vencedor."),
      ).toBeInTheDocument(),
    );
    // o diálogo continua aberto
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("submission_vazio_nao_confirma_preenchido_encerra", async () => {
    const onEnd = vi.fn().mockResolvedValue(null);
    render(<EndBoutDialog whiteName="Ana" blueName="Bia" onEnd={onEnd} t={t} />);

    open();
    fireEvent.click(screen.getByRole("button", { name: "Finalização" }));

    // vazio: confirmar desabilitado
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Golpe"), { target: { value: "Armlock" } });
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onEnd).toHaveBeenCalledWith("submission", "white", "Armlock");
    // sucesso: o diálogo fecha
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("nenhuma_mensagem_do_dialogo_fala_de_conexao_offline", () => {
    render(<EndBoutDialog whiteName="Ana" blueName="Bia" onEnd={vi.fn()} t={t} />);
    open();
    expect(document.body.textContent?.toLowerCase()).not.toContain("conexão");
  });
});
