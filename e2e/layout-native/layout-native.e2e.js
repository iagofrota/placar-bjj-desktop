import { browser, expect } from "@wdio/globals";
import { boardButtons, startBout, waitForSetup } from "../specs/helpers.js";

/**
 * P8 (b) — layout no binário Tauri real (WebKitGTK), em escala REAL do GTK
 * (`GDK_SCALE`), não por zoom CSS. Complementa a matriz do Chromium
 * (`layout/layout.spec.js`, frente `a`): o WebKitGTK não expõe emulação de
 * escala via WebDriver (emenda do PE em P8), então a escala vem do ambiente do
 * processo (`GDK_SCALE=1|2`) e é confirmada pelo `window.devicePixelRatio`
 * reportado (1 ou 2) — é o que distingue escala real de zoom CSS.
 *
 * Em cada um dos 4 viewports, a medição é por `getBoundingClientRect()` de cada
 * um dos 26 controles contra o viewport CSS real (`clientWidth/clientHeight`),
 * igual à frente `a`. As escalas 125% e 150% no Linux ficam no checklist manual
 * do PE (`docs/qa/release-checklist.md`), como P8 pede.
 */
const VIEWPORTS = [
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
  { name: "1366x500-altura-baixa", width: 1366, height: 500 },
];
const MIN_TARGET = 44;
const EPS = 0.75;

// Escala real do GTK, vinda do ambiente do processo (não é zoom CSS). O CI roda
// este spec uma vez com GDK_SCALE=1 e outra com GDK_SCALE=2.
const EXPECTED_DPR = Number(process.env.GDK_SCALE || "1");

async function measureBoard() {
  return browser.execute(
    ({ min, eps }) => {
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const buttons = [...document.querySelectorAll('[data-testid="board"] button')];
      const problems = [];
      for (const button of buttons) {
        const r = button.getBoundingClientRect();
        const name = button.getAttribute("aria-label") || (button.textContent || "").trim();
        if (r.width < min - eps || r.height < min - eps) {
          problems.push(`${name}: ${Math.round(r.width)}x${Math.round(r.height)} < ${min}px`);
        }
        if (r.left < -eps || r.top < -eps || r.right > vw + eps || r.bottom > vh + eps) {
          problems.push(
            `${name}: transborda (${Math.round(r.left)},${Math.round(r.top)})-(${Math.round(r.right)},${Math.round(r.bottom)}) vw=${vw} vh=${vh}`,
          );
        }
      }
      return { count: buttons.length, dpr: window.devicePixelRatio, vw, vh, problems };
    },
    { min: MIN_TARGET, eps: EPS },
  );
}

describe("P8 (b) — layout no binário real em escala do GTK", () => {
  it("layout_real_no_webkitgtk_cabe_e_mede_44px_na_escala_do_gtk", async () => {
    await waitForSetup();
    await startBout("Ana", "Bia", "5");
    expect(await boardButtons().length).toBe(26);

    const failures = [];
    for (const vp of VIEWPORTS) {
      await browser.setWindowSize(vp.width, vp.height);

      // Espera o reflow depois do resize sem sleep fixo: mede até reencontrar os
      // 26 controles (ou estoura o timeout, o que também é falha observável).
      let r;
      await browser.waitUntil(
        async () => {
          r = await measureBoard();
          return r.count === 26;
        },
        { timeout: 8000, timeoutMsg: `${vp.name}: board não reestabilizou com 26 controles` },
      );

      const where = `${vp.name} @ GDK_SCALE=${EXPECTED_DPR} (dpr=${r.dpr}, viewport ${r.vw}x${r.vh})`;
      if (Math.abs(r.dpr - EXPECTED_DPR) > 0.02) {
        failures.push(`${where}: devicePixelRatio ${r.dpr} != escala real ${EXPECTED_DPR} (seria zoom CSS?)`);
      }
      if (r.count !== 26) failures.push(`${where}: ${r.count} controles (esperado 26)`);
      for (const p of r.problems) failures.push(`${where}: ${p}`);
    }

    if (failures.length > 0) {
      throw new Error(`P8 (b) — transbordo/alvo/escala no binário real:\n${failures.join("\n")}`);
    }
    expect(failures).toEqual([]);
  });
});
