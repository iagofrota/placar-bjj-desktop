import { fileURLToPath } from "node:url";
import path from "node:path";
import { config as base } from "./wdio.conf.js";

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * P8 (b) — mesma pilha do e2e do binário real (tauri-driver + WebKitWebDriver
 * sob Xvfb do `wdio.conf.js`), porém só com o teste de layout em escala real do
 * GTK. Roda uma vez por `GDK_SCALE` (1 e 2), porque a escala do GTK é lida do
 * ambiente na abertura do processo — não dá para trocá-la em runtime via
 * WebDriver (o WebKitGTK não expõe emulação de escala; ver a emenda do PE em P8).
 */
export const config = {
  ...base,
  specs: [path.join(here, "layout-native", "**", "*.e2e.js")],
};
