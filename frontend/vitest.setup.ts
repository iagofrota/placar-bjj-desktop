import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Sem `globals: true`, o RTL não registra o cleanup sozinho: sem isto, os
// renders de um teste vazam para o seguinte (elementos duplicados).
afterEach(() => {
  cleanup();
});
