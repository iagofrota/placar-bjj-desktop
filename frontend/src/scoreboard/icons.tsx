/**
 * Ícones como SVG inline (formas, não glifos de fonte). Evita depender de
 * `lucide-react` e, principalmente, evita glifos que a fonte embutida não cobre
 * (P13): a seta `→` não está em nenhuma das fontes, então nunca vira texto.
 * Todos são decorativos (`aria-hidden`): o nome acessível vem do botão.
 */
type IconProps = { className?: string };

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M5 3.5v13l11-6.5z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <rect x="4.5" y="3.5" width="4" height="13" rx="1" />
      <rect x="11.5" y="3.5" width="4" height="13" rx="1" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10h11M11 5l5 5-5 5" />
    </svg>
  );
}
