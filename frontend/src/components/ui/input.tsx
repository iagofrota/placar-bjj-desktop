import type { InputHTMLAttributes } from "react";

/** Campo de texto base, só com tokens de cor (sem literal — P13). */
export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={
        "h-[46px] w-full rounded-[3px] border border-line bg-card px-3 text-[16px] text-ink " +
        "outline-none focus-visible:ring-[3px] focus-visible:ring-ink/30 " +
        "placeholder:text-ink-faint " +
        className
      }
      {...props}
    />
  );
}
