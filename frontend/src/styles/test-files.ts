/// <reference types="node" />
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const FRONTEND_ROOT = resolve(import.meta.dirname, "../..");
export const SRC_ROOT = join(FRONTEND_ROOT, "src");
const REPO_ROOT = resolve(FRONTEND_ROOT, "..");

export function readRepoFile(path: string): string {
  return readFileSync(join(REPO_ROOT, path), "utf8");
}

export function readSrcFile(path: string): string {
  return readFileSync(join(SRC_ROOT, path), "utf8");
}

/** Caminhos relativos a `src`, de todos os arquivos com uma das extensões. */
export function listSrcFiles(extensions: readonly string[], dir = SRC_ROOT): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listSrcFiles(extensions, full);
    return extensions.some((ext) => entry.name.endsWith(ext)) ? [relative(SRC_ROOT, full)] : [];
  });
}
