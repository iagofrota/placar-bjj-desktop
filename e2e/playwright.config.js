import { defineConfig } from "@playwright/test";

/**
 * P8 — matriz de layout no Chromium (o motor do WebView2, alvo no Windows).
 * Serve a página-harness pelo Vite dev e mede o Board real. A escala é emulada
 * por `deviceScaleFactor` (ver layout.spec.js). Local usa o Chrome do sistema
 * (channel), o CI usa o chromium do Playwright.
 */
const PORT = 5199;

export default defineConfig({
  testDir: "./layout",
  timeout: 60000,
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    cwd: "../frontend",
    url: `http://localhost:${PORT}/src/layout-harness/index.html`,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
});
