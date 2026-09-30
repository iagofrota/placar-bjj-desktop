import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke, listen } = vi.hoisted(() => ({ invoke: vi.fn(), listen: vi.fn() }));
vi.mock("@tauri-apps/api/core", () => ({ invoke }));
vi.mock("@tauri-apps/api/event", () => ({ listen }));

import { createTauriClient } from "./tauri-client";

const STATE = { stage: "setup", board: null, ended: null };

describe("createTauriClient", () => {
  beforeEach(() => {
    invoke.mockReset();
    listen.mockReset();
    invoke.mockResolvedValue(STATE);
  });

  it("cada_comando_invoca_o_ipc_de_mesmo_nome_com_os_argumentos", async () => {
    const client = createTauriClient();

    await client.getState();
    expect(invoke).toHaveBeenCalledWith("get_state");

    await client.canStart("Ana", "Bia", "5");
    expect(invoke).toHaveBeenCalledWith("can_start", { white: "Ana", blue: "Bia", duration: "5" });

    await client.start("Ana", "Bia", "5");
    expect(invoke).toHaveBeenCalledWith("start", { white: "Ana", blue: "Bia", duration: "5" });

    await client.mark("white", "point2", "add");
    expect(invoke).toHaveBeenCalledWith("mark", { side: "white", kind: "point2", delta: "add" });

    await client.toggleClock();
    expect(invoke).toHaveBeenCalledWith("toggle_clock");

    await client.adjustClock("plus10");
    expect(invoke).toHaveBeenCalledWith("adjust_clock", { adjust: "plus10" });

    await client.endBout("submission", "white", "Armlock");
    expect(invoke).toHaveBeenCalledWith("end_bout", {
      method: "submission",
      winner: "white",
      submission: "Armlock",
    });

    await client.cancel();
    expect(invoke).toHaveBeenCalledWith("cancel");

    await client.newBout();
    expect(invoke).toHaveBeenCalledWith("new_bout");
  });

  it("onState_assina_o_evento_entrega_o_payload_e_desassina", async () => {
    const unlisten = vi.fn();
    listen.mockResolvedValue(unlisten);
    const client = createTauriClient();

    const received = [];
    const off = client.onState((s) => received.push(s));
    expect(listen).toHaveBeenCalledWith("scoreboard://state", expect.any(Function));

    // dispara o handler que o listen recebeu
    const handler = listen.mock.calls[0][1];
    handler({ payload: STATE });
    expect(received).toEqual([STATE]);

    await Promise.resolve();
    off();
    expect(unlisten).toHaveBeenCalledTimes(1);
  });

  it("onBeep_assina_o_evento_e_chama_a_callback", async () => {
    const unlisten = vi.fn();
    listen.mockResolvedValue(unlisten);
    const client = createTauriClient();

    const calls = [];
    const off = client.onBeep(() => calls.push(1));
    expect(listen).toHaveBeenCalledWith("scoreboard://beep", expect.any(Function));

    const handler = listen.mock.calls[0][1];
    handler({ payload: null });
    expect(calls).toEqual([1]);

    await Promise.resolve();
    off();
    expect(unlisten).toHaveBeenCalledTimes(1);
  });
});
