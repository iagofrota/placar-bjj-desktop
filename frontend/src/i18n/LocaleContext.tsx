/**
 * Idioma corrente do app e a função `t` ligada a ele. Trocar o idioma
 * re-renderiza toda a UI no novo idioma (P9). Sem persistência: reabrir volta ao
 * padrão.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { translate, type TranslationKey } from "./translate";
import type { Locale, Replacements } from "./types";

type TFn = (key: TranslationKey, replacements?: Replacements) => string;

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TFn;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initial = "pt_BR",
}: {
  children: ReactNode;
  initial?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(initial);
  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, replacements) => translate(locale, key, replacements),
    }),
    [locale],
  );
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale precisa de um LocaleProvider acima");
  }
  return ctx;
}
