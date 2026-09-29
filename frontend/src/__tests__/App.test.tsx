import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  it("app_renderiza_titulo_placar_bjj", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Placar BJJ" }),
    ).toBeInTheDocument();
  });
});
