import { browser, expect } from "@wdio/globals";
import { waitForSetup } from "./helpers.js";

describe("smoke do binário Tauri", () => {
  it("abre_no_setup_com_o_titulo_do_app", async () => {
    await waitForSetup();
    const text = await browser.execute(() => document.body.textContent || "");
    expect(text).toContain("Placar avulso");
    expect(text).toContain("Luta casada");
  });
});
