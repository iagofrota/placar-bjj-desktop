/**
 * Registro dos diálogos abertos, para o board saber quando ficar `inert`. O
 * `Dialog` reporta seu estado aberto/fechado; o `ModalProvider` agrega e entrega
 * `anyOpen` para quem desenha a região que deve ser travada. É o que reproduz o
 * comportamento modal da web (Radix prende o foco): com um diálogo aberto, o
 * conteúdo de trás não recebe Tab, Espaço nem Enter.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";

type RegisterFn = (id: string, open: boolean) => void;

const ModalContext = createContext<RegisterFn | null>(null);

/** Reporta o estado aberto de um diálogo ao provider mais próximo (se houver). */
export function useModalRegistration(open: boolean): void {
  const register = useContext(ModalContext);
  const id = useId();
  useEffect(() => {
    if (!register) {
      return;
    }
    register(id, open);
    return () => register(id, false);
  }, [register, id, open]);
}

/**
 * Envolve a região que deve ser travada. `children` é uma função que recebe
 * `anyOpen` (há algum diálogo aberto?) para aplicar `inert` na raiz de trás.
 */
export function ModalProvider({ children }: { children: (anyOpen: boolean) => ReactNode }) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set());
  const register = useCallback<RegisterFn>((id, open) => {
    setOpenIds((prev) => {
      const has = prev.has(id);
      if (open === has) {
        return prev;
      }
      const next = new Set(prev);
      if (open) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  return <ModalContext.Provider value={register}>{children(openIds.size > 0)}</ModalContext.Provider>;
}
