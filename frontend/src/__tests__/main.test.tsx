import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

describe("main", () => {
  beforeEach(() => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("main_monta_app_no_elemento_root", async () => {
    await import("../main");

    expect(
      await screen.findByRole("heading", { name: "Placar BJJ" }),
    ).toBeInTheDocument();
  });
});
