/**
 * Tela de configuração: dois nomes e a duração. "Iniciar luta" só habilita
 * quando o domínio aceita (via `canStart`, no backend) — o frontend não decide a
 * validade. A seta do rótulo vira um SVG (a fonte embutida não cobre "→", P13).
 * Portado de `AvulsoSetup`.
 */
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { TFn } from "./controls";
import { ArrowRightIcon } from "./icons";

export function Setup({
  canStart,
  onStart,
  t,
}: {
  canStart: (white: string, blue: string, duration: string) => Promise<boolean>;
  onStart: (white: string, blue: string, duration: string) => void;
  t: TFn;
}) {
  const [white, setWhite] = useState("");
  const [blue, setBlue] = useState("");
  const [duration, setDuration] = useState("5");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    void canStart(white, blue, duration).then((ok) => {
      if (active) {
        setEnabled(ok);
      }
    });
    return () => {
      active = false;
    };
  }, [white, blue, duration, canStart]);

  // A seta não vira glifo: o rótulo perde o "→" final e ganha o ícone SVG.
  const startLabel = t("queue.start_bout").replace(/\s*→\s*$/u, "");

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <p className="font-mono text-[11px] tracking-[.24em] text-ink-faint uppercase">
          {t("avulso.title")}
        </p>
        <h1 className="font-display text-4xl text-ink uppercase">{t("avulso.setup.heading")}</h1>
        <p className="mt-2 font-mono text-xs text-ink-faint">{t("avulso.setup.description")}</p>
      </div>
      <div className="w-full space-y-4 text-left">
        <div className="space-y-1">
          <label htmlFor="setup-white" className="text-sm font-medium text-ink">
            {t("side.white")}
          </label>
          <Input
            id="setup-white"
            value={white}
            onChange={(event) => setWhite(event.target.value)}
            placeholder={t("avulso.setup.athlete_name_placeholder")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="setup-blue" className="text-sm font-medium text-ink">
            {t("side.blue")}
          </label>
          <Input
            id="setup-blue"
            value={blue}
            onChange={(event) => setBlue(event.target.value)}
            placeholder={t("avulso.setup.athlete_name_placeholder")}
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="setup-duration" className="text-sm font-medium text-ink">
            {t("avulso.setup.duration_label")}
          </label>
          <Input
            id="setup-duration"
            type="number"
            min={1}
            max={20}
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
          />
        </div>
      </div>
      <Button
        variant="green"
        size="mesa"
        className="w-full"
        disabled={!enabled}
        onClick={() => onStart(white, blue, duration)}
      >
        {startLabel}
        <ArrowRightIcon className="size-5" />
      </Button>
    </div>
  );
}
