/**
 * Contrato dos controles do board, com os rótulos acessíveis exatos de
 * `tests/e2e/scoreboard.fixture.ts:48-64` da plataforma. Esta é a fonte única:
 * os componentes (`ScorePad`, `ClockBar`) usam estas mesmas funções para os
 * `aria-label`/textos, então o que a tela renderiza casa 1:1 com o que o
 * contrato conta. São 10 controles por lado + 6 da página = 26.
 */
import type { TranslationKey } from "../i18n/translate";
import type { Replacements } from "../i18n/types";
import type { ScoreKindId } from "../ipc/types";

export type TFn = (key: TranslationKey, replacements?: Replacements) => string;

/** Ordem dos cinco controles do pad, igual à da plataforma. */
export const SCORE_KINDS: readonly ScoreKindId[] = [
  "point2",
  "point3",
  "point4",
  "advantage",
  "penalty",
];

export const SIDE_CONTROL_COUNT = 10;
export const PAGE_CONTROL_COUNT = 6;

/** Nome acessível do botão de marcar (ex.: "+2 Queda / raspagem"). */
export function padMarkName(t: TFn, kind: ScoreKindId): string {
  return `${t(`score_pad.${kind}.label`)} ${t(`score_pad.${kind}.sub_label`)}`;
}

/** Nome acessível do botão de correção (ex.: "Corrigir queda / raspagem"). */
export function padCorrectionName(t: TFn, kind: ScoreKindId): string {
  return t("score_pad.correction_aria_label", {
    sub_label: t(`score_pad.${kind}.sub_label`).toLowerCase(),
  });
}

/** Os 10 nomes acessíveis de um lado (5 marcações + 5 correções). */
export function sideControlNames(t: TFn): string[] {
  return [
    ...SCORE_KINDS.map((kind) => padMarkName(t, kind)),
    ...SCORE_KINDS.map((kind) => padCorrectionName(t, kind)),
  ];
}

/** Nome acessível do botão iniciar/pausar o cronômetro. */
export function clockToggleName(t: TFn, running: boolean): string {
  return running ? t("clock_bar.pause_action") : t("clock_bar.start_action");
}

/** Nome acessível do relógio central clicável. */
export function remainingTimeName(t: TFn, remainingDisplay: string, running: boolean): string {
  return t("clock_bar.remaining_time_aria", {
    time: remainingDisplay,
    action: running
      ? t("clock_bar.remaining_time_pause_action")
      : t("clock_bar.remaining_time_start_action"),
  });
}

/** Os 6 controles da página (relógio, ajustes, cancelar, encerrar). */
export function pageControlNames(t: TFn, remainingDisplay = "00:00", running = false): string[] {
  return [
    clockToggleName(t, running),
    remainingTimeName(t, remainingDisplay, running),
    t("clock_bar.decrement"),
    t("clock_bar.increment"),
    t("common_actions.cancel"),
    t("end_bout.action"),
  ];
}

/** Os 26 nomes acessíveis do board: dois lados + a página. */
export function boardControlNames(t: TFn, remainingDisplay = "00:00", running = false): string[] {
  return [...sideControlNames(t), ...sideControlNames(t), ...pageControlNames(t, remainingDisplay, running)];
}
