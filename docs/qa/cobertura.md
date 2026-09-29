# Cobertura de testes

- **Geral (Rust + frontend): ≥ 80%.**
- **`crates/placar-core`: ≥ 95%** (lógica crítica do placar).

## Rust

Medida com `cargo llvm-cov --workspace --fail-under-lines 80`, mesmo comando do
job `coverage` do CI.

`src-tauri/src/main.rs` e `src-tauri/src/lib.rs` são excluídos da medição
(`--ignore-filename-regex`) enquanto forem só bootstrap do Tauri — o
`fn main()` de uma linha e um `tauri::Builder::default().plugin(...).run(...)`
sem nenhuma regra de negócio. Não há forma útil de unit-testar essas duas
linhas sem abrir uma janela de verdade; isso é trabalho de e2e (tarefa `app`),
não de cobertura de unidade.

**Esta exclusão precisa ser revisitada** assim que `src-tauri/src/lib.rs`
ganhar lógica própria (comandos IPC na tarefa `app`, cliente HTTP na tarefa
`telemetria`) — nesse ponto o código novo deve ser extraído para módulos
testáveis e cobertos, e a exclusão não deve mais varrer o arquivo inteiro.

## Frontend

Medida com `npm run test:coverage` (Vitest + `@vitest/coverage-v8`). Os
thresholds (80% linhas/funções/branches/statements) estão em
`frontend/vite.config.ts` (`test.coverage.thresholds`) — o próprio `vitest`
sai com código de erro se qualquer um ficar abaixo disso, então o job do CI
falha sem precisar de um parse manual do relatório.
