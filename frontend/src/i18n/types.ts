export type Dictionary = { readonly [key: string]: string | Dictionary };

export type Locale = "pt_BR" | "en" | "es";

export type Replacements = Readonly<Record<string, string | number>>;
