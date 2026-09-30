import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  buttonClasses,
  type ButtonSize,
  type ButtonVariant,
} from "./button";

const variants = Object.keys(BUTTON_VARIANTS) as ButtonVariant[];
const sizes = Object.keys(BUTTON_SIZES) as ButtonSize[];

function heightPx(size: ButtonSize): number {
  return Number(/(?:^|\s)h-\[(\d+)px\]/.exec(BUTTON_SIZES[size])?.[1]);
}

describe("Button", () => {
  afterEach(cleanup);

  it("botao_tem_as_variantes_de_cor_do_placar", () => {
    expect(variants.sort()).toEqual(["ghost", "gold", "green", "primary", "red"]);
  });

  it("botao_todo_tamanho_tem_no_minimo_44px", () => {
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(heightPx(size), size).toBeGreaterThanOrEqual(44);
    }
  });

  it("botao_mesa_tem_52px", () => {
    expect(heightPx("mesa")).toBe(52);
  });

  it("botao_toda_variante_renderiza_com_52px_na_mesa_e_so_com_tokens", () => {
    for (const variant of variants) {
      render(<Button variant={variant} size="mesa">{variant}</Button>);

      const classes = screen.getByRole("button", { name: variant }).className;
      expect(classes, variant).toContain("h-[52px]");
      expect(classes, variant).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgb|hsl)a?\(|\[(?:hsl|rgb)/i);
      expect(classes, variant).not.toMatch(/\b(?:bg|text|border)-(?:white|black|neutral|red|green|yellow|blue)-?\d*\b/);
    }
  });

  it("botao_variantes_de_cor_apontam_para_os_tokens_certos", () => {
    expect(BUTTON_VARIANTS.green).toContain("bg-score-points");
    expect(BUTTON_VARIANTS.gold).toContain("bg-score-advantage");
    expect(BUTTON_VARIANTS.red).toContain("bg-score-penalty");
    expect(BUTTON_VARIANTS.primary).toContain("bg-ink");
    expect(BUTTON_VARIANTS.gold).toContain("text-arena-black");
  });

  it("botao_padrao_e_primario_46px_e_type_button", () => {
    render(<Button>ir</Button>);

    const button = screen.getByRole("button", { name: "ir" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("bg-ink");
    expect(button.className).toContain("h-[46px]");
  });

  it("botao_repassa_props_e_mescla_className", () => {
    render(<Button type="submit" disabled className="w-full">enviar</Button>);

    const button = screen.getByRole("button", { name: "enviar" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toBeDisabled();
    expect(button.className).toContain("w-full");
    expect(buttonClasses("red", "compact")).toContain("h-[44px]");
  });
});
