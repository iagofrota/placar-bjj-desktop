import { describe, expect, it } from "vitest";
import { listSrcFiles, readSrcFile } from "./test-files";

const arenaCss = readSrcFile("styles/arena.css");
const fontsCss = readSrcFile("styles/fonts.css");
const fontFiles = listSrcFiles([".woff2"]).map((path) => path.split("/").pop());

type Face = { family: string; style: string; weight: string; file: string };

function facesOf(css: string): Face[] {
  return [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => {
    const pick = (property: string) => new RegExp(`${property}:\\s*([^;]+);`).exec(body)?.[1].trim() ?? "";
    return {
      family: pick("font-family").replace(/"/g, ""),
      style: pick("font-style"),
      weight: pick("font-weight"),
      file: /url\("\.\.\/assets\/fonts\/([^"]+)"\)/.exec(body)?.[1] ?? "",
    };
  });
}

const EXPECTED = [
  "Bebas Neue|normal|400",
  "JetBrains Mono|normal|400",
  "JetBrains Mono|normal|500",
  "JetBrains Mono|normal|700",
  "Inter|normal|400",
  "Inter|normal|500",
  "Inter|normal|600",
  "Cormorant Garamond|italic|500",
];

describe("fontes embutidas", () => {
  it("fontes_declara_so_os_pesos_usados_pelo_placar", () => {
    const declared = facesOf(fontsCss).map((face) => `${face.family}|${face.style}|${face.weight}`);

    expect(declared.sort()).toEqual([...EXPECTED].sort());
  });

  it("fontes_apontam_para_woff2_locais_que_existem", () => {
    const present = new Set(fontFiles);
    const faces = facesOf(fontsCss);

    expect(faces).toHaveLength(EXPECTED.length);
    for (const face of faces) {
      expect(face.file, `${face.family} ${face.weight}`).toMatch(/\.woff2$/);
      expect(present.has(face.file), face.file).toBe(true);
    }
    expect(present.size).toBe(EXPECTED.length);
  });

  it("estilos_nao_referenciam_rede", () => {
    expect(fontsCss).not.toMatch(/https?:\/\/|\/\/fonts\./);
    expect(arenaCss).not.toMatch(/https?:\/\//);
  });

  it("tema_expoe_as_quatro_familias", () => {
    for (const family of ["Bebas Neue", "JetBrains Mono", "Inter", "Cormorant Garamond"]) {
      expect(arenaCss).toContain(`"${family}"`);
    }
  });
});
