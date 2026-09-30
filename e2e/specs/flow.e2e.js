import { $, browser, expect } from "@wdio/globals";
import { clockRunning, mark, pointsEl, pressSpaceOnBody, startBout, waitForSetup } from "./helpers.js";

/**
 * P1 — fluxo completo no binário real, com o oráculo = regras do `placar-core`.
 *
 * Sequência fixa e o cálculo do domínio (documentado, não número solto):
 *   Branco: +2, +3, +4, Corrigir passagem(−3)  → pontos 2→5→9→6 ; ADV → 1 vant.
 *           (clamp e valores em `crates/placar-core/src/side.rs`)
 *   Azul:   +2, ADV, ADV, PUN, Corrigir punição(−1) → 2 pontos, 2 vant., 0 punições.
 *   Encerrar por `points`: desempate por pontos (6 > 2) → vence o Branco (Ana).
 *           (desempate em `crates/placar-core/src/ended.rs`)
 */
describe("P1 — fluxo completo", () => {
  it("configura_pontua_controla_o_tempo_encerra_e_recomeca", async () => {
    await waitForSetup();
    await startBout("Ana", "Bia", "5");

    // pontuação do Branco, conferida passo a passo contra o oráculo
    await mark("white", "+2 Queda / raspagem");
    await expect(pointsEl("white")).toHaveText("2");
    await mark("white", "+3 Passagem de guarda");
    await expect(pointsEl("white")).toHaveText("5");
    await mark("white", "+4 Montada / costas");
    await expect(pointsEl("white")).toHaveText("9");
    await mark("white", "Corrigir passagem de guarda");
    await expect(pointsEl("white")).toHaveText("6");
    await mark("white", "ADV Vantagem");

    // pontuação do Azul
    await mark("blue", "+2 Queda / raspagem");
    await mark("blue", "ADV Vantagem");
    await mark("blue", "ADV Vantagem");
    await mark("blue", "PUN Punição");
    await mark("blue", "Corrigir punição");
    await expect(pointsEl("blue")).toHaveText("2");

    // ±10 s com o relógio parado (determinístico)
    const clock = () => $('[data-testid="board"] button[aria-label^="Tempo restante:"]');
    await expect(clock()).toHaveText("05:00");
    await $("button=−10s").click();
    await expect(clock()).toHaveText("04:50");
    await $("button=+10s").click();
    await expect(clock()).toHaveText("05:00");

    // pausar e retomar pelo espaço
    expect(await clockRunning()).toBe(false);
    await pressSpaceOnBody();
    await browser.waitUntil(async () => clockRunning(), { timeout: 5000 });
    await pressSpaceOnBody();
    await browser.waitUntil(async () => !(await clockRunning()), { timeout: 5000 });

    // encerrar por pontos → vencedor pelo desempate do domínio
    await $("button=Encerrar luta").click();
    await $("div[role=dialog]").waitForExist({ timeout: 5000 });
    await $("button=Confirmar").click();

    await browser.waitUntil(
      async () => (await browser.execute(() => document.body.textContent || "")).includes("Vencedor: Ana"),
      { timeout: 5000, timeoutMsg: "não mostrou o vencedor" },
    );
    const ended = await browser.execute(() => document.body.textContent || "");
    expect(ended).toContain("Luta encerrada · Pontos");
    expect(ended).toContain("Vencedor: Ana");

    // nova luta volta ao setup zerado
    await $("button=Nova luta").click();
    await waitForSetup();
    expect(await $('[data-testid="board"]').isExisting()).toBe(false);
  });
});
