import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { translate } from "../i18n/translate";
import type { BoardView } from "../ipc/types";
import { Board, type BoardActions } from "./Board";
import { boardControlNames } from "./controls";

const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
  translate("pt_BR", key, r);

function boardView(overrides: Partial<BoardView> = {}): BoardView {
  return {
    white: { name: "Ana", points: 0, advantages: 0, penalties: 0, penalty_alert: false },
    blue: { name: "Bia", points: 0, advantages: 0, penalties: 0, penalty_alert: false },
    remaining_seconds: 300,
    remaining_display: "05:00",
    duration_seconds: 300,
    duration_display: "05:00",
    is_running: false,
    clock_urgent: false,
    ...overrides,
  };
}

function noopActions(overrides: Partial<BoardActions> = {}): BoardActions {
  return {
    mark: vi.fn(),
    toggleClock: vi.fn(),
    adjustClock: vi.fn(),
    cancel: vi.fn(),
    endBout: vi.fn().mockResolvedValue(null),
    ...overrides,
  };
}

describe("Board", () => {
  it("tem_exatamente_os_26_controles_com_os_rotulos_da_fixture", () => {
    render(<Board board={boardView()} actions={noopActions()} t={t} />);

    // exatamente 26 botões no board (diálogos fechados)
    expect(screen.getAllByRole("button")).toHaveLength(26);

    // e cada rótulo do contrato existe (o tempo casa por prefixo)
    for (const name of boardControlNames(t, "05:00", false)) {
      if (/^Tempo restante:/.test(name)) {
        expect(screen.getByRole("button", { name: /^Tempo restante:/ })).toBeInTheDocument();
      } else {
        expect(screen.getAllByRole("button", { name }).length).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it("marcar_no_lado_branco_despacha_mark_white", () => {
    const actions = noopActions();
    render(<Board board={boardView()} actions={actions} t={t} />);

    fireEvent.click(screen.getAllByRole("button", { name: "+2 Queda / raspagem" })[0]);
    expect(actions.mark).toHaveBeenCalledWith("white", "point2", "add");

    fireEvent.click(screen.getAllByRole("button", { name: "Corrigir vantagem" })[1]);
    expect(actions.mark).toHaveBeenCalledWith("blue", "advantage", "remove");
  });

  it("ajustes_e_toggle_despacham_os_comandos_do_relogio", () => {
    const actions = noopActions();
    render(<Board board={boardView()} actions={actions} t={t} />);

    fireEvent.click(screen.getByRole("button", { name: "−10s" }));
    expect(actions.adjustClock).toHaveBeenCalledWith("minus10");
    fireEvent.click(screen.getByRole("button", { name: "+10s" }));
    expect(actions.adjustClock).toHaveBeenCalledWith("plus10");

    fireEvent.click(screen.getByRole("button", { name: "Iniciar cronômetro (espaço)" }));
    expect(actions.toggleClock).toHaveBeenCalled();
  });

  it("terceira_punicao_mostra_o_aviso", () => {
    render(
      <Board
        board={boardView({
          white: { name: "Ana", points: 0, advantages: 0, penalties: 3, penalty_alert: true },
        })}
        actions={noopActions()}
        t={t}
      />,
    );
    expect(screen.getByText("4ª punição = desclassificação")).toBeInTheDocument();
  });

  it("relogio_nos_ultimos_30s_rodando_ganha_o_realce_de_alerta", () => {
    render(
      <Board
        board={boardView({ is_running: true, clock_urgent: true, remaining_display: "00:20" })}
        actions={noopActions()}
        t={t}
      />,
    );
    const clock = screen.getByRole("button", { name: /^Tempo restante:/ });
    expect(clock).toHaveAttribute("data-urgent", "true");
    expect(clock.className).toContain("text-score-penalty");
  });

  it("com_relogio_parado_nao_ha_realce", () => {
    render(<Board board={boardView({ clock_urgent: false })} actions={noopActions()} t={t} />);
    const clock = screen.getByRole("button", { name: /^Tempo restante:/ });
    expect(clock).toHaveAttribute("data-urgent", "false");
    expect(clock.className).not.toContain("text-score-penalty");
  });
});
