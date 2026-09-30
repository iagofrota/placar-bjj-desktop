/**
 * Registra o cleanup do Testing Library entre os testes. Sem `globals: true` no
 * vitest, o RTL não faz isso sozinho e os renders de um teste vazam para o
 * seguinte (elementos duplicados). Importado no topo de cada teste que renderiza.
 */
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
  cleanup();
});
