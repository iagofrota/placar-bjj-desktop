import { en } from "./en";
import { es } from "./es";
import type { PlacarKey } from "./keys";
import { ptBR } from "./pt_BR";
import type { Dictionary, Locale, Replacements } from "./types";

export const LOCALES: readonly Locale[] = ["pt_BR", "en", "es"];

export const DICTIONARIES: Readonly<Record<Locale, Dictionary>> = {
  pt_BR: ptBR,
  en,
  es,
};

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function lookup(dictionary: Dictionary, key: string): string {
  let node: string | Dictionary | undefined = dictionary;
  for (const segment of key.split(".")) {
    node = typeof node === "object" ? node[segment] : undefined;
  }
  if (typeof node !== "string") {
    throw new Error(`chave de tradução inexistente: "${key}"`);
  }
  return node;
}

/**
 * `:nome` vira o valor, `:Nome` vira Valor e `:NOME` vira VALOR (mesma regra
 * do `__()` do Laravel, que a plataforma usa). Numa passada só, e o
 * placeholder mais longo vence (`:names` antes de `:name`).
 */
export function replacePlaceholders(text: string, replacements: Replacements): string {
  const values = new Map<string, string>();
  for (const [name, raw] of Object.entries(replacements)) {
    const value = String(raw);
    values.set(`:${capitalize(name)}`, capitalize(value));
    values.set(`:${name.toUpperCase()}`, value.toUpperCase());
    values.set(`:${name}`, value);
  }
  if (values.size === 0) {
    return text;
  }
  const pattern = new RegExp(
    [...values.keys()]
      .sort((a, b) => b.length - a.length)
      .map((placeholder) => placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|"),
    "g",
  );
  return text.replace(pattern, (placeholder) => values.get(placeholder) ?? placeholder);
}

/** Texto do placar no idioma pedido. Chave que não existe é erro, não texto vazio. */
export function translate(locale: Locale, key: PlacarKey, replacements: Replacements = {}): string {
  return replacePlaceholders(lookup(DICTIONARIES[locale], key), replacements);
}
