import { screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

/** Garante que a página-harness de layout renderiza o board com o estado estático. */
describe("harness de layout", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });
  afterEach(() => {
    document.body.textContent = "";
  });

  it("renderiza_o_board_com_estado_estatico", async () => {
    await import("./main");
    expect(await screen.findByTestId("points-white")).toHaveTextContent("6");
    expect(await screen.findByTestId("points-blue")).toHaveTextContent("2");
  });
});
