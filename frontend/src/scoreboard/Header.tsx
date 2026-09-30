/**
 * Cabeçalho: título do app e o seletor de idioma. Sem link de navegação (o app é
 * offline e não tem para onde voltar, ao contrário da web).
 */
import type { TFn } from "./controls";
import { LanguageSelector } from "./LanguageSelector";

export function Header({ t }: { t: TFn }) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-2 [@media(max-height:500px)]:py-1">
      <div className="w-24" />
      <h1 className="truncate font-display text-xl text-ink uppercase">{t("avulso.title")}</h1>
      <div className="flex w-24 justify-end">
        <LanguageSelector />
      </div>
    </header>
  );
}
