import { $, browser, expect } from "@wdio/globals";
import { startBout, waitForSetup } from "./helpers.js";

/** P9 — troca de idioma no binário real, sem chave crua nem texto vazio. */
async function switchTo(locale) {
  await $("select").selectByAttribute("value", locale);
}
async function bodyText() {
  return browser.execute(() => document.body.textContent || "");
}

describe("P9 — i18n das telas", () => {
  it("troca_pt_en_es_no_setup_e_no_board_sem_chave_crua", async () => {
    await waitForSetup();

    // setup nos três idiomas
    expect(await bodyText()).toContain("Luta casada");
    await switchTo("en");
    await browser.waitUntil(async () => (await bodyText()).includes("Ad-hoc match"), {
      timeout: 5000,
    });
    await switchTo("es");
    await browser.waitUntil(async () => (await bodyText()).includes("Combate libre"), {
      timeout: 5000,
    });

    // board nos três idiomas (o botão de encerrar troca de rótulo)
    await switchTo("pt_BR");
    await startBout("Ana", "Bia", "5");
    expect(await $("button=Encerrar luta").isExisting()).toBe(true);
    await switchTo("en");
    await browser.waitUntil(async () => $("button=End match").isExisting(), { timeout: 5000 });
    await switchTo("es");
    await browser.waitUntil(async () => $("button=Finalizar combate").isExisting(), {
      timeout: 5000,
    });

    // nenhuma chave crua vazou em nenhum momento
    const text = await bodyText();
    expect(text).not.toContain("app_mesa.");
    expect(text).not.toContain("undefined");
  });
});
