import { describe, expect, it } from "vitest";
import { translate } from "../i18n/translate";
import { boardControlNames, PAGE_CONTROL_COUNT, SIDE_CONTROL_COUNT } from "./controls";

/**
 * O contrato dos 26 controles: 10 por lado + 6 da página, com os rótulos
 * acessíveis exatos de `tests/e2e/scoreboard.fixture.ts:48-64` da plataforma
 * (em pt_BR). O e2e faz o par de falsificação (remover um controle derruba o
 * teste); aqui a lista de rótulos é a fonte única desse contrato.
 */
describe("contrato dos controles do board", () => {
  it("sao_exatamente_26_controles", () => {
    const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
      translate("pt_BR", key, r);
    const names = boardControlNames(t);
    expect(SIDE_CONTROL_COUNT * 2 + PAGE_CONTROL_COUNT).toBe(26);
    expect(names).toHaveLength(26);
  });

  it("rotulos_batem_com_a_fixture_da_plataforma_em_pt_BR", () => {
    const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
      translate("pt_BR", key, r);
    const names = boardControlNames(t);

    // 10 por lado (SIDE_CONTROLS), aparecem para branco e azul
    const sidePad = [
      "+2 Queda / raspagem",
      "+3 Passagem de guarda",
      "+4 Montada / costas",
      "ADV Vantagem",
      "PUN Punição",
      "Corrigir queda / raspagem",
      "Corrigir passagem de guarda",
      "Corrigir montada / costas",
      "Corrigir vantagem",
      "Corrigir punição",
    ];
    for (const label of sidePad) {
      expect(names.filter((n) => n === label), label).toHaveLength(2);
    }

    // 6 da página (PAGE_CONTROLS); o tempo restante casa por prefixo
    expect(names).toContain("Iniciar cronômetro (espaço)");
    expect(names).toContain("−10s");
    expect(names).toContain("+10s");
    expect(names).toContain("Cancelar");
    expect(names).toContain("Encerrar luta");
    expect(names.some((n) => /^Tempo restante:/.test(n))).toBe(true);
  });
});
