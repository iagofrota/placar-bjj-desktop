import type { Dictionary } from "./types";

/** `{ a: { b: "x" } }` vira `{ "a.b": "x" }`. Folhas que não são texto ficam de fora. */
export function flatten(dictionary: Dictionary, prefix = ""): Map<string, string> {
  const flat = new Map<string, string>();
  for (const [key, value] of Object.entries(dictionary)) {
    const path = `${prefix}${key}`;
    if (typeof value === "string") {
      flat.set(path, value);
    } else {
      for (const [nested, text] of flatten(value, `${path}.`)) {
        flat.set(nested, text);
      }
    }
  }
  return flat;
}

/** Chaves exigidas que não existem, ou existem vazias, no dicionário. */
export function missingKeys(dictionary: Dictionary, required: readonly string[]): string[] {
  const flat = flatten(dictionary);
  return required.filter((key) => (flat.get(key) ?? "").trim() === "");
}

/** Chaves do dicionário que ninguém exige: sobra de porte ou typo. */
export function extraKeys(dictionary: Dictionary, required: readonly string[]): string[] {
  const allowed = new Set(required);
  return [...flatten(dictionary).keys()].filter((key) => !allowed.has(key));
}

const PLACEHOLDER = /:[A-Za-z_]+/g;

/** Placeholders `:nome` de um texto, sem repetição e em ordem alfabética. */
export function placeholdersOf(text: string): string[] {
  return [...new Set(text.match(PLACEHOLDER) ?? [])].sort();
}
