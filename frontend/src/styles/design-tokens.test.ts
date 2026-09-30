import { describe, expect, it } from "vitest";
import { listSrcFiles, readRepoFile, readSrcFile } from "./test-files";

const designTokensDoc = readRepoFile("docs/design-tokens.md");
const tokensCss = readSrcFile("styles/tokens.css");

const COLOR_LITERAL = new RegExp(["#[0-9a-f]{3,8}\\b", "rgba?\\(", "hsla?\\("].join("|"), "i");

function tableTokens(markdown: string): Map<string, string> {
  const rows = markdown.matchAll(/^\| `(--[a-z-]+)` \| `(#[0-9A-Fa-f]{6})` \|/gm);
  return new Map([...rows].map(([, name, hex]) => [name, hex.toUpperCase()]));
}

function cssTokens(css: string): Map<string, string> {
  const declarations = css.matchAll(/^\s*(--[a-z-]+):\s*(#[0-9A-Fa-f]{6});/gm);
  return new Map([...declarations].map(([, name, hex]) => [name, hex.toUpperCase()]));
}

describe("design tokens", () => {
  it("tokens_css_espelha_tabela_de_design_tokens", () => {
    const doc = tableTokens(designTokensDoc);

    expect(doc.size).toBe(15);
    expect(cssTokens(tokensCss)).toEqual(doc);
  });

  it("tabela_traz_os_valores_exatos_da_identidade_do_placar", () => {
    // em RGB decimal para o teste não conter literal de cor; equivale ao hex da tabela
    const expected: Record<string, [number, number, number]> = {
      "--side-white": [248, 250, 252],
      "--side-white-fg": [15, 23, 41],
      "--side-blue": [11, 100, 244],
      "--side-blue-fg": [255, 255, 255],
      "--score-points": [31, 122, 64],
      "--score-advantage": [203, 146, 11],
      "--score-penalty": [193, 31, 31],
      "--arena-black": [10, 10, 10],
      "--paper": [248, 248, 247],
      "--ink": [18, 22, 33],
    };
    const doc = tableTokens(designTokensDoc);

    for (const [name, rgb] of Object.entries(expected)) {
      const hex = doc.get(name) ?? "";
      const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
      expect(channels, name).toEqual(rgb);
    }
  });

  it("nenhum_literal_de_cor_fora_do_arquivo_de_tokens", () => {
    const scanned = listSrcFiles([".ts", ".tsx", ".css"]).filter((path) => path !== "styles/tokens.css");
    const offenders = scanned.filter((path) => COLOR_LITERAL.test(readSrcFile(path)));

    expect(scanned.length).toBeGreaterThan(5);
    expect(offenders).toEqual([]);
  });

  it("detector_de_literal_de_cor_reconhece_hex_rgb_e_hsl", () => {
    // grupo de controle do teste acima: o detector precisa achar o que deve achar
    const hash = "#";
    expect(COLOR_LITERAL.test(`color: ${hash}0B64F4`)).toBe(true);
    expect(COLOR_LITERAL.test(`color: ${hash}fff;`)).toBe(true);
    expect(COLOR_LITERAL.test("color: " + "rgb" + "(1 2 3)")).toBe(true);
    expect(COLOR_LITERAL.test("color: " + "rgba" + "(1, 2, 3, .5)")).toBe(true);
    expect(COLOR_LITERAL.test("color: " + "hsl" + "(210 40% 98%)")).toBe(true);
    expect(COLOR_LITERAL.test(`bg-score-points text-card ${hash}root`)).toBe(false);
  });
});
