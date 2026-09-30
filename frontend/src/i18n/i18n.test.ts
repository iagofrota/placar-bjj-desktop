import { describe, expect, it } from "vitest";
import { extraKeys, flatten, missingKeys, placeholdersOf } from "./completeness";
import { PLACAR_KEYS } from "./keys";
import { DICTIONARIES, LOCALES, replacePlaceholders, translate } from "./translate";
import type { Dictionary } from "./types";

function without(dictionary: Dictionary, path: string): Dictionary {
  const [head, ...rest] = path.split(".");
  return Object.fromEntries(
    Object.entries(dictionary).flatMap(([key, value]): [string, string | Dictionary][] => {
      if (key !== head) return [[key, value]];
      if (rest.length === 0 || typeof value === "string") return [];
      return [[key, without(value, rest.join("."))]];
    }),
  );
}

describe("i18n do placar", () => {
  it("dicionarios_pt_BR_en_es_tem_todas_as_chaves_do_placar", () => {
    for (const locale of LOCALES) {
      expect(missingKeys(DICTIONARIES[locale], PLACAR_KEYS), locale).toEqual([]);
      expect(extraKeys(DICTIONARIES[locale], PLACAR_KEYS), locale).toEqual([]);
    }
  });

  it("chaves_do_placar_sao_as_do_avulso_e_dos_componentes_dele", () => {
    expect(PLACAR_KEYS).toHaveLength(64);
    expect(new Set(PLACAR_KEYS).size).toBe(PLACAR_KEYS.length);
    expect(PLACAR_KEYS).toContain("avulso.setup.duration_label");
    expect(PLACAR_KEYS).toContain("score_pad.penalty.correction_label");
    expect(PLACAR_KEYS).not.toContain("offline.offline_line");
    expect(PLACAR_KEYS).not.toContain("queue.title");
  });

  it("teste_de_completude_falha_quando_falta_chave_em_es_par_de_falsificacao", () => {
    const complete = DICTIONARIES.es;
    const broken = without(complete, "clock_bar.pause");

    expect(missingKeys(complete, PLACAR_KEYS)).toEqual([]);
    expect(missingKeys(broken, PLACAR_KEYS)).toEqual(["clock_bar.pause"]);
  });

  it("teste_de_completude_falha_quando_a_chave_existe_vazia", () => {
    const blank: Dictionary = { ...DICTIONARIES.en, name_tbd: "  " };

    expect(missingKeys(blank, PLACAR_KEYS)).toEqual(["name_tbd"]);
  });

  it("teste_de_completude_acusa_chave_sobrando", () => {
    const extra: Dictionary = { ...DICTIONARIES.en, offline: { lost_write: "x" } };

    expect(extraKeys(extra, PLACAR_KEYS)).toEqual(["offline.lost_write"]);
  });

  it("placeholders_de_en_e_es_batem_com_pt_BR", () => {
    const reference = flatten(DICTIONARIES.pt_BR);

    for (const locale of LOCALES) {
      for (const [key, text] of flatten(DICTIONARIES[locale])) {
        expect(placeholdersOf(text), `${locale} ${key}`).toEqual(placeholdersOf(reference.get(key) ?? ""));
      }
    }
  });

  it("translate_devolve_o_texto_do_idioma_pedido", () => {
    expect(translate("pt_BR", "side.white")).toBe("Branco");
    expect(translate("en", "side.white")).toBe("White");
    expect(translate("es", "side.white")).toBe("Blanco");
  });

  it("translate_troca_placeholders", () => {
    expect(translate("pt_BR", "avulso.winner", { name: "Ana" })).toBe("Vencedor: Ana");
    expect(translate("en", "clock_bar.remaining_time_aria", { time: "3:00", action: "pause" })).toBe(
      "Time left: 3:00. Click to pause.",
    );
    expect(translate("es", "clock_bar.round", { number: 2 })).toBe("Ronda 2");
  });

  it("translate_lanca_erro_para_chave_inexistente", () => {
    expect(() => translate("en", "nao.existe" as never)).toThrow('chave de tradução inexistente: "nao.existe"');
  });

  it("placeholders_respeitam_capitalizacao_e_o_mais_longo_vence", () => {
    expect(replacePlaceholders(":name / :Name / :NAME", { name: "ana" })).toBe("ana / Ana / ANA");
    expect(replacePlaceholders(":names e :name", { name: "A", names: "B" })).toBe("B e A");
    expect(replacePlaceholders("sem troca :outro", { name: "A" })).toBe("sem troca :outro");
  });
});
