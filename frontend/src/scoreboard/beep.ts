/**
 * Beep da expiração, via Web Audio. O *quando* não é decidido aqui: o backend
 * emite o evento de beep (uma única vez, na expiração) e o app chama isto.
 * Portado de `hooks/use-bout-clock.ts` (`beep`) da plataforma.
 */
export function beep(): void {
  try {
    const AudioCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtor();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    // Fecha o contexto ao fim da nota: sem isso cada beep deixa um AudioContext
    // aberto e o navegador estoura o limite por página.
    osc.onended = () => {
      void ctx.close();
    };
  } catch {
    // áudio indisponível — ignora
  }
}
