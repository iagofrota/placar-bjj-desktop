/**
 * Seletor de idioma. Troca pt_BR/en/es em toda a UI. O rótulo (aria-label) e os
 * nomes das línguas mudam com o idioma (P9). Sem persistência.
 */
import { useLocale } from "../i18n/LocaleContext";
import { LOCALES } from "../i18n/translate";
import type { Locale } from "../i18n/types";

export function LanguageSelector() {
  const { locale, setLocale, t } = useLocale();
  return (
    <select
      aria-label={t("app.language_label")}
      value={locale}
      onChange={(event) => setLocale(event.target.value as Locale)}
      className="rounded-[3px] border border-line bg-card px-2 py-1 font-mono text-xs text-ink outline-none focus-visible:ring-[3px] focus-visible:ring-ink/30"
    >
      {LOCALES.map((loc) => (
        <option key={loc} value={loc}>
          {t(`app.languages.${loc}`)}
        </option>
      ))}
    </select>
  );
}
