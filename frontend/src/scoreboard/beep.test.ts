import { afterEach, describe, expect, it, vi } from "vitest";
import { beep } from "./beep";

afterEach(() => {
  vi.unstubAllGlobals();
});

type FakeOsc = {
  frequency: { value: number };
  connect: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  onended: null | (() => void);
};

describe("beep", () => {
  it("cria_e_dispara_um_oscilador_a_880hz", () => {
    let created: FakeOsc | undefined;
    const close = vi.fn().mockResolvedValue(undefined);

    function FakeAudioContext(this: Record<string, unknown>) {
      this.destination = {};
      this.currentTime = 0;
      this.close = close;
      this.createOscillator = () => {
        created = {
          frequency: { value: 0 },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
          onended: null,
        };
        return created;
      };
    }
    vi.stubGlobal("AudioContext", FakeAudioContext);

    beep();

    expect(created).toBeDefined();
    expect(created?.frequency.value).toBe(880);
    expect(created?.start).toHaveBeenCalledTimes(1);
    expect(created?.stop).toHaveBeenCalledTimes(1);
    // fecha o contexto ao fim da nota
    created?.onended?.();
    expect(close).toHaveBeenCalled();
  });

  it("audio_indisponivel_nao_lanca", () => {
    vi.stubGlobal("AudioContext", undefined);
    vi.stubGlobal("webkitAudioContext", undefined);
    expect(() => beep()).not.toThrow();
  });
});
