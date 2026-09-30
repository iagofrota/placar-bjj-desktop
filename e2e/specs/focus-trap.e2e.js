import { $, browser, expect } from "@wdio/globals";
import { mark, pointsEl, startBout, waitForSetup } from "./helpers.js";

/**
 * P6 (comentário do Codex 4146409566): com um diálogo aberto, o Tab não pode
 * alcançar um controle de trás — senão o Espaço alternaria o relógio e o Enter
 * acionaria o botão. O board fica `inert`, reproduzindo o modal da web. Aqui,
 * no binário real, abre-se o diálogo, tenta-se sair dele com Tab e dispara-se
 * Espaço e Enter; nada muda no board.
 */
describe("P6 — foco preso com diálogo aberto", () => {
  it("dialogo_aberto_barra_espaco_e_enter_no_board", async () => {
    await waitForSetup();
    await startBout("Ana", "Bia", "5");

    // um ponto para ter estado observável, e o relógio parado
    await mark("white", "+2 Queda / raspagem");
    await expect(pointsEl("white")).toHaveText("2");
    const toggleName = () =>
      $('[aria-label="Iniciar cronômetro (espaço)"]').isExisting();
    expect(await toggleName()).toBe(true); // parado

    // abre o diálogo de encerrar
    await $("button=Encerrar luta").click();
    await $("div[role=dialog]").waitForExist({ timeout: 5000 });

    // tenta escapar do diálogo e agir no board
    await browser.keys(["Tab", "Tab", "Tab", "Tab", "Tab"]);
    await browser.keys(["Space"]);
    await browser.keys(["Enter"]);

    // o board está inert: relógio segue parado e o placar não mudou
    expect(await toggleName()).toBe(true);
    await expect(pointsEl("white")).toHaveText("2");
    // e o diálogo continua aberto
    expect(await $("div[role=dialog]").isExisting()).toBe(true);
  });
});
