import "../test-support/rtl-cleanup";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FakeClient, SETUP_STATE } from "../test-support/fake-client";
import type { BoardView, StateView } from "../ipc/types";
import { beep } from "./beep";
import { useScoreboard } from "./useScoreboard";

vi.mock("./beep", () => ({ beep: vi.fn() }));

function boardState(): StateView {
  const board: BoardView = {
    white: { name: "Ana", points: 2, advantages: 0, penalties: 0, penalty_alert: false },
    blue: { name: "Bia", points: 0, advantages: 0, penalties: 0, penalty_alert: false },
    remaining_seconds: 300,
    remaining_display: "05:00",
    duration_seconds: 300,
    duration_display: "05:00",
    is_running: false,
    clock_urgent: false,
  };
  return { stage: "board", board, ended: null };
}

describe("useScoreboard", () => {
  beforeEach(() => {
    vi.mocked(beep).mockClear();
  });

  it("busca_o_estado_inicial_na_montagem", async () => {
    const client = new FakeClient(SETUP_STATE);
    const { result } = renderHook(() => useScoreboard(client));

    await waitFor(() => expect(result.current.state).toEqual(SETUP_STATE));
    expect(client.calls.some((c) => c.method === "getState")).toBe(true);
  });

  it("atualiza_o_estado_quando_o_backend_emite", async () => {
    const client = new FakeClient(SETUP_STATE);
    const { result } = renderHook(() => useScoreboard(client));
    await waitFor(() => expect(result.current.state).not.toBeNull());

    act(() => client.emitState(boardState()));
    expect(result.current.state?.stage).toBe("board");
  });

  it("toca_o_beep_quando_o_backend_sinaliza", async () => {
    const client = new FakeClient(SETUP_STATE);
    renderHook(() => useScoreboard(client));
    await waitFor(() => expect(client.calls.length).toBeGreaterThan(0));

    act(() => client.emitBeep());
    expect(beep).toHaveBeenCalledTimes(1);
  });

  it("as_acoes_chamam_os_comandos_do_cliente", async () => {
    const client = new FakeClient(boardState());
    const { result } = renderHook(() => useScoreboard(client));
    await waitFor(() => expect(result.current.state).not.toBeNull());

    act(() => result.current.actions.mark("white", "point2", "add"));
    act(() => result.current.actions.toggleClock());
    act(() => result.current.actions.adjustClock("plus10"));
    act(() => result.current.actions.cancel());
    act(() => result.current.start("Ana", "Bia", "5"));

    await waitFor(() => {
      expect(client.lastCall("mark")?.args).toEqual(["white", "point2", "add"]);
      expect(client.lastCall("adjustClock")?.args).toEqual(["plus10"]);
      expect(client.lastCall("start")?.args).toEqual(["Ana", "Bia", "5"]);
    });
  });

  it("endBout_devolve_null_no_sucesso_e_a_tag_no_empate", async () => {
    const client = new FakeClient(boardState());
    const { result } = renderHook(() => useScoreboard(client));
    await waitFor(() => expect(result.current.state).not.toBeNull());

    let ok: unknown;
    await act(async () => {
      ok = await result.current.actions.endBout("decision", "white", null);
    });
    expect(ok).toBeNull();

    client.endBoutError = "tie";
    let reason: unknown;
    await act(async () => {
      reason = await result.current.actions.endBout("points", null, null);
    });
    expect(reason).toBe("tie");
  });

  it("canStart_delega_ao_cliente", async () => {
    const client = new FakeClient(SETUP_STATE);
    client.canStartResult = false;
    const { result } = renderHook(() => useScoreboard(client));
    await expect(result.current.canStart("", "Bia", "5")).resolves.toBe(false);
  });
});
