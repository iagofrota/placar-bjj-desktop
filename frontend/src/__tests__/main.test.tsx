import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";

// O `main` usa o cliente Tauri real; aqui os módulos do Tauri são mockados para
// o app montar em jsdom sem um webview. O objetivo é só provar que o `main`
// monta o app no `#root`.
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue({ stage: "setup", board: null, ended: null }),
}));
vi.mock("@tauri-apps/api/event", () => ({
  listen: vi.fn().mockResolvedValue(() => {}),
}));

describe("main", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.textContent = "";
    vi.resetModules();
  });

  it("main_monta_o_app_no_root", async () => {
    await import("../main");
    expect(await screen.findByText("Luta casada")).toBeInTheDocument();
  });
});
