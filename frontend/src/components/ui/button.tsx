import type { ButtonHTMLAttributes } from "react";

/** Cores só por token (`styles/tokens.css`, expostas como utilitários em `styles/arena.css`). */
export const BUTTON_VARIANTS = {
  primary: "bg-ink text-card",
  green: "bg-score-points text-card",
  gold: "bg-score-advantage text-arena-black",
  red: "bg-score-penalty text-card",
  ghost: "border border-line bg-transparent text-ink hover:bg-line-soft",
} as const;

/** Toda altura fica em 44 px ou mais (alvo de toque). `mesa` é a do operador. */
export const BUTTON_SIZES = {
  compact: "h-[44px] px-[18px] text-[16px]",
  default: "h-[46px] px-[22px] text-[18px]",
  mesa: "h-[52px] px-[26px] text-[18px]",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

const BASE =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[3px] font-display uppercase tracking-wide " +
  "transition-[transform,opacity] duration-150 hover:opacity-90 active:translate-y-px " +
  "outline-none focus-visible:ring-[3px] focus-visible:ring-ink/30 " +
  "disabled:pointer-events-none disabled:border-transparent disabled:bg-line-soft disabled:text-ink-faint";

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "default",
  className = "",
): string {
  return [BASE, BUTTON_SIZES[size], BUTTON_VARIANTS[variant], className]
    .filter(Boolean)
    .join(" ");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}
