import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import type { StateView } from "../ipc/types";
import { FakeClient, SETUP_STATE } from "../test-support/fake-client";

const BOARD_STATE: StateView = {
  stage: "board",
  board: {
    white: { name: "Ana", points: 2, advantages: 1, penalties: 0, penalty_alert: false },
    blue: { name: "Bia", points: 0, advantages: 0, penalties: 0, penalty_alert: false },
    remaining_seconds: 300,
    remaining_display: "05:00",
    duration_seconds: 300,
    duration_display: "05:00",
    is_running: false,
    clock_urgent: false,
  },
  ended: null,
};

const ENDED_STATE: StateView = {
  stage: "ended",
  board: null,
  ended: {
    method: "points",
    winner: "white",
    winner_name: "Ana",
    white_name: "Ana",
    blue_name: "Bia",
    white_points: 2,
    blue_points: 0,
    submission: null,
  },
};

describe("App", () => {
  it("percorre_setup_board_encerramento_pelo_estado_emitido", async () => {
    const client = new FakeClient(SETUP_STATE);
    render(<App client={client} />);

    // setup
    await waitFor(() => expect(screen.getByText("Luta casada")).toBeInTheDocument());

    // board
    act(() => client.emitState(BOARD_STATE));
    await waitFor(() => expect(screen.getByTestId("points-white")).toHaveTextContent("2"));
    expect(screen.getAllByRole("button", { name: "+2 Queda / raspagem" })).toHaveLength(2);

    // encerramento
    act(() => client.emitState(ENDED_STATE));
    await waitFor(() =>
      expect(screen.getByText("Vencedor: Ana")).toBeInTheDocument(),
    );
  });

  it("trocar_idioma_muda_todo_o_texto_sem_chave_crua", async () => {
    const client = new FakeClient(BOARD_STATE);
    render(<App client={client} />);
    await waitFor(() => expect(screen.getByTestId("points-white")).toBeInTheDocument());

    // pt_BR
    expect(screen.getByRole("button", { name: "Encerrar luta" })).toBeInTheDocument();

    // troca para en
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "End match" })).toBeInTheDocument(),
    );

    // troca para es
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "es" } });
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Finalizar combate" })).toBeInTheDocument(),
    );

    // nenhuma chave crua vazou para o DOM
    expect(document.body.textContent).not.toContain("app_mesa");
    expect(document.body.textContent).not.toContain("undefined");
  });

  it("espaco_no_board_alterna_o_relogio_via_ipc", async () => {
    const client = new FakeClient(BOARD_STATE);
    render(<App client={client} />);
    await waitFor(() => expect(screen.getByTestId("points-white")).toBeInTheDocument());

    document.body.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true }));
    await waitFor(() =>
      expect(client.calls.some((c) => c.method === "toggleClock")).toBe(true),
    );
  });
});
