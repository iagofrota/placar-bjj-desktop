import { afterEach, describe, expect, it, vi } from "vitest";
import { listenClockShortcut } from "./clock-shortcut";

let dispose: (() => void) | null = null;

afterEach(() => {
  dispose?.();
  dispose = null;
  document.body.innerHTML = "";
});

function pressSpaceOn(el: Element, init: Partial<KeyboardEventInit> = {}) {
  el.dispatchEvent(new KeyboardEvent("keydown", { code: "Space", bubbles: true, ...init }));
}

describe("atalho de espaço do relógio", () => {
  it("espaco_com_foco_no_corpo_alterna_o_relogio", () => {
    const toggle = vi.fn();
    dispose = listenClockShortcut(toggle);

    const button = document.createElement("button");
    document.body.appendChild(button);
    pressSpaceOn(button); // botão não é campo de texto nem está em diálogo

    expect(toggle).toHaveBeenCalledTimes(1);
  });

  it("espaco_com_foco_em_campo_de_texto_nao_alterna", () => {
    const toggle = vi.fn();
    dispose = listenClockShortcut(toggle);

    const input = document.createElement("input");
    document.body.appendChild(input);
    pressSpaceOn(input);

    expect(toggle).not.toHaveBeenCalled();
  });

  it("espaco_com_dialogo_aberto_nao_alterna", () => {
    const toggle = vi.fn();
    dispose = listenClockShortcut(toggle);

    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    const inner = document.createElement("button");
    dialog.appendChild(inner);
    document.body.appendChild(dialog);
    pressSpaceOn(inner); // foco dentro do diálogo

    expect(toggle).not.toHaveBeenCalled();
  });

  it("espaco_com_modificador_ou_repeticao_nao_alterna", () => {
    const toggle = vi.fn();
    dispose = listenClockShortcut(toggle);

    const button = document.createElement("button");
    document.body.appendChild(button);
    pressSpaceOn(button, { ctrlKey: true });
    pressSpaceOn(button, { altKey: true });
    pressSpaceOn(button, { metaKey: true });
    pressSpaceOn(button, { repeat: true }); // segurar a tecla não fica alternando

    expect(toggle).not.toHaveBeenCalled();
  });

  it("outra_tecla_nao_alterna", () => {
    const toggle = vi.fn();
    dispose = listenClockShortcut(toggle);
    const button = document.createElement("button");
    document.body.appendChild(button);
    button.dispatchEvent(new KeyboardEvent("keydown", { code: "Enter", bubbles: true }));
    expect(toggle).not.toHaveBeenCalled();
  });
});
