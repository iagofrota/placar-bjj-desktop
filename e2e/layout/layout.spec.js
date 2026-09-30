import { expect, test } from "@playwright/test";

/**
 * P8 — matriz 4 viewports × 4 escalas. A escala é emulada por
 * `deviceScaleFactor` (DPR), como o HiDPI real do SO: a resolução física é a
 * do viewport e a escala muda a densidade de pixels, não o número de CSS px do
 * layout. A medição é por `getBoundingClientRect()` de cada um dos 26 controles
 * contra o viewport (`clientWidth/Height`). A verificação com DPI real do SO e a
 * janela entre monitores fica no checklist manual do PE (`docs/qa/release-checklist.md`).
 */
const VIEWPORTS = [
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
  { name: "1366x500-altura-baixa", width: 1366, height: 500 },
];
const SCALES = [1, 1.25, 1.5, 2];
const MIN_TARGET = 44;
const EPS = 0.75;

async function measure(browser, vp, scale) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: scale,
  });
  const page = await context.newPage();
  await page.goto("/src/layout-harness/index.html");
  await page.waitForSelector('[data-testid="board"] button');
  const result = await page.evaluate(
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
      return { count: buttons.length, dpr: window.devicePixelRatio, problems };
    },
    { min: MIN_TARGET, eps: EPS },
  );
  await context.close();
  return result;
}

test("controles_cabem_e_medem_44px_em_toda_a_matriz_de_layout", async ({ browser }) => {
  const failures = [];
  for (const vp of VIEWPORTS) {
    for (const scale of SCALES) {
      const r = await measure(browser, vp, scale);
      const where = `${vp.name} @ ${scale * 100}%`;
      if (Math.abs(r.dpr - scale) > 0.02) failures.push(`${where}: dpr=${r.dpr}`);
      if (r.count !== 26) failures.push(`${where}: ${r.count} controles (esperado 26)`);
      for (const p of r.problems) failures.push(`${where}: ${p}`);
    }
  }
  expect(failures, `\n${failures.join("\n")}`).toEqual([]);
});
