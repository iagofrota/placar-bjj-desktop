import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));

// O binário Tauri já buildado. Local: debug; CI: release (TAURI_APP_PATH).
const application = process.env.TAURI_APP_PATH
  ? path.resolve(process.env.TAURI_APP_PATH)
  : path.resolve(here, "..", "target", "release", "placar-bjj-desktop");

// Caminho do WebKitWebDriver (o driver nativo que o tauri-driver encapsula).
// CI o instala em /usr/bin; localmente aponta-se via NATIVE_WEBDRIVER.
const nativeDriver = process.env.NATIVE_WEBDRIVER;

let tauriDriver;

export const config = {
  runner: "local",
  specs: [path.join(here, "specs", "**", "*.e2e.js")],
  maxInstances: 1,
  hostname: "127.0.0.1",
  port: 4444,
  path: "/",
  capabilities: [
    {
      "tauri:options": { application },
    },
  ],
  logLevel: "warn",
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: { ui: "bdd", timeout: 120000 },

  onPrepare: () => {
    const args = ["--port", "4444"];
    if (nativeDriver) {
      args.push("--native-driver", nativeDriver);
    }
    tauriDriver = spawn("tauri-driver", args, {
      stdio: [null, process.stdout, process.stderr],
    });
    tauriDriver.on("error", (error) => {
      console.error("tauri-driver falhou ao iniciar:", error);
      process.exit(1);
    });
  },

  onComplete: () => {
    tauriDriver?.kill();
  },
};
