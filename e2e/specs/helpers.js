import { $, $$, browser } from "@wdio/globals";

/** Espera o setup aparecer (app montado). */
export async function waitForSetup() {
  await browser.waitUntil(
    async () => (await browser.execute(() => document.body.textContent || "")).includes("Luta casada"),
    { timeout: 30000, timeoutMsg: "o setup não montou" },
  );
}

/** Preenche o setup e inicia a luta. */
export async function startBout(white, blue, duration) {
  await $("#setup-white").setValue(white);
  await $("#setup-blue").setValue(blue);
  await $("#setup-duration").setValue(duration);
  const start = $("button=Iniciar luta");
  await start.waitForEnabled({ timeout: 5000 });
  await start.click();
  await $('[data-testid="board"]').waitForExist({ timeout: 5000 });
}

/** Aciona um controle de placar de um lado, pelo nome acessível exato. */
export async function mark(side, ariaLabel) {
  await $(`[data-testid="side-${side}"] [aria-label="${ariaLabel}"]`).click();
}

/** Texto grande de pontos de um lado. */
export function pointsEl(side) {
  return $(`[data-testid="points-${side}"]`);
}

/** Todos os botões do board (os 26 controles, diálogos fechados). */
export function boardButtons() {
  return $$('[data-testid="board"] button');
}

/** Pressiona Espaço com o foco fora de qualquer controle (no corpo). */
export async function pressSpaceOnBody() {
  await browser.execute(() => {
    const active = document.activeElement;
    if (active && active !== document.body && "blur" in active) {
      active.blur();
    }
  });
  await browser.keys(["Space"]);
}

/** O cronômetro está rodando? (pelo aria-label do botão de toggle.) */
export async function clockRunning() {
  return (await $('[aria-label="Pausar cronômetro (espaço)"]').isExisting());
}
