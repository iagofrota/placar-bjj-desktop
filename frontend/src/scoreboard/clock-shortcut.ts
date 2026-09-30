/**
 * Atalho de Espaço do relógio. Isto é roteamento de entrada da UI (qual tecla
 * dispara qual comando), não regra de placar: espelha `lib/clock-shortcut.ts` da
 * plataforma, que também mora no frontend. O predicado precisa ser síncrono para
 * `preventDefault`, então lê o DOM aqui e não passa por IPC. O domínio guarda o
 * mesmo predicado em `placar_core::is_clock_shortcut` (paridade documentada no
 * SDD); nenhuma regra de pontuação/tempo/desempate é replicada.
 */

/**
 * Onde o Espaço continua sendo do navegador: digitação e modal. Em qualquer
 * outro lugar, inclusive com foco num botão, ele é do relógio.
 */
const SPACE_KEEPS_NATIVE_BEHAVIOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="dialog"]';

/** O Espaço pertence ao relógio? Fora de campo de texto e de modal, sim. */
export function isClockShortcut(event: KeyboardEvent): boolean {
  return (
    event.code === "Space" &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !(event.target instanceof Element && event.target.closest(SPACE_KEEPS_NATIVE_BEHAVIOR))
  );
}

/**
 * Liga o atalho de Espaço na janela. Barra a ação nativa no keydown e no keyup
 * (o botão focado se aciona ao soltar a tecla) e alterna uma vez por toque:
 * segurar a tecla não fica alternando. Devolve a função que desliga.
 */
export function listenClockShortcut(toggleClock: () => void): () => void {
  function onKeyDown(event: KeyboardEvent) {
    if (!isClockShortcut(event)) {
      return;
    }
    event.preventDefault();
    if (!event.repeat) {
      toggleClock();
    }
  }

  function onKeyUp(event: KeyboardEvent) {
    if (isClockShortcut(event)) {
      event.preventDefault();
    }
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
  };
}
