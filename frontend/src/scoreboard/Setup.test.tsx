import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { translate } from "../i18n/translate";
import { Setup } from "./Setup";

const t = (key: Parameters<typeof translate>[1], r?: Parameters<typeof translate>[2]) =>
  translate("pt_BR", key, r);

/**
 * Oráculo do backend no teste: reproduz `can_start` do domínio (nomes não
 * vazios após trim, duração inteira de 1 a 20). A regra de verdade é do Rust
 * (`scoreboard.rs`) e do e2e; aqui prova-se o *fio*: o botão reflete o veredito.
 */
function oracleCanStart(white: string, blue: string, duration: string): Promise<boolean> {
  const d = Number(duration.trim());
  const ok =
    white.trim() !== "" &&
    blue.trim() !== "" &&
    duration.trim() !== "" &&
    Number.isInteger(d) &&
    d >= 1 &&
    d <= 20;
  return Promise.resolve(ok);
}

async function typeSetup(white: string, blue: string, duration: string) {
  fireEvent.change(screen.getByLabelText("Branco"), { target: { value: white } });
  fireEvent.change(screen.getByLabelText("Azul"), { target: { value: blue } });
  fireEvent.change(screen.getByLabelText("Duração (minutos)"), { target: { value: duration } });
}

function startButton() {
  return screen.getByRole("button", { name: /Iniciar luta/ });
}

describe("Setup", () => {
  it("iniciar_luta_desabilita_nos_invalidos_e_habilita_no_valido", async () => {
    render(<Setup canStart={oracleCanStart} onStart={vi.fn()} t={t} />);

    const invalids: Array<[string, string, string]> = [
      ["", "Bia", "5"], // nome vazio
      ["   ", "Bia", "5"], // só espaços
      ["Ana", "Bia", "2.5"], // fracionária
      ["Ana", "Bia", "0"], // abaixo de 1
      ["Ana", "Bia", "21"], // acima de 20
    ];
    for (const [w, b, d] of invalids) {
      await typeSetup(w, b, d);
      await waitFor(() => expect(startButton()).toBeDisabled());
    }

    await typeSetup("Ana", "Bia", "5");
    await waitFor(() => expect(startButton()).toBeEnabled());
  });

  it("iniciar_luta_valido_despacha_onStart_com_os_valores", async () => {
    const onStart = vi.fn();
    render(<Setup canStart={oracleCanStart} onStart={onStart} t={t} />);

    await typeSetup("Ana", "Bia", "5");
    await waitFor(() => expect(startButton()).toBeEnabled());
    fireEvent.click(startButton());

    expect(onStart).toHaveBeenCalledWith("Ana", "Bia", "5");
  });

  it("o_rotulo_de_iniciar_nao_usa_o_glifo_de_seta_nao_coberto_pela_fonte", () => {
    render(<Setup canStart={oracleCanStart} onStart={vi.fn()} t={t} />);
    // P13: "→" (U+2192) não está em nenhuma fonte embutida; não pode virar texto.
    expect(document.body.textContent).not.toContain("→");
  });
});
