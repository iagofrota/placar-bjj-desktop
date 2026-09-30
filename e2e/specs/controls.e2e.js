import { browser, expect } from "@wdio/globals";
import { boardButtons, startBout, waitForSetup } from "./helpers.js";

/**
 * P7 — contrato dos 26 controles no binário real, com os rótulos acessíveis
 * exatos de `tests/e2e/scoreboard.fixture.ts:48-64` (pt_BR). O par de
 * falsificação (remover um controle e ver o CI vermelho) é o red-proof do PR.
 */
const SIDE_CONTROLS = [
  "+2 Queda / raspagem",
  "+3 Passagem de guarda",
  "+4 Montada / costas",
  "ADV Vantagem",
  "PUN Punição",
  "Corrigir queda / raspagem",
  "Corrigir passagem de guarda",
  "Corrigir montada / costas",
  "Corrigir vantagem",
  "Corrigir punição",
];

describe("P7 — contrato dos 26 controles", () => {
  it("existem_exatamente_26_com_os_rotulos_da_fixture", async () => {
    await waitForSetup();
    await startBout("Ana", "Bia", "5");

    expect(await boardButtons().length).toBe(26);

    // nomes acessíveis renderizados no board (aria-label ou texto)
    const names = await browser.execute(() =>
      [...document.querySelectorAll('[data-testid="board"] button')].map(
        (b) => b.getAttribute("aria-label") || (b.textContent || "").trim(),
      ),
    );

    for (const label of SIDE_CONTROLS) {
      expect(names.filter((n) => n === label).length).toBe(2);
    }
    expect(names).toContain("Iniciar cronômetro (espaço)");
    expect(names).toContain("−10s");
    expect(names).toContain("+10s");
    expect(names).toContain("Cancelar");
    expect(names).toContain("Encerrar luta");
    expect(names.some((n) => /^Tempo restante:/.test(n))).toBe(true);
  });
});
