/**
 * Chaves que só o app desktop usa (não vêm do `avulso.tsx` da plataforma): o
 * rótulo do seletor de idioma e os nomes das línguas. Ficam separadas de
 * `PLACAR_KEYS` (que segue congelado nas 64 chaves da plataforma) e o teste de
 * completude exige a união das duas listas.
 */
export const APP_KEYS = [
  "app.language_label",
  "app.languages.pt_BR",
  "app.languages.en",
  "app.languages.es",
] as const;

export type AppKey = (typeof APP_KEYS)[number];
