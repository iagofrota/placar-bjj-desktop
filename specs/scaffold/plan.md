# Implementation Plan: Scaffold do Placar BJJ Desktop

**Branch**: `feat/scaffold-desktop-app` | **Date**: 2026-09-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/scaffold/spec.md`

## Summary

Criar a estrutura inicial do repositório: um workspace Cargo com um crate de
domínio vazio (`placar-core`) e um app Tauri 2 (`src-tauri`) que carrega um
frontend React/TypeScript/Vite/Tailwind v4 (`frontend/`), com CSP restritiva,
janela única com tamanho mínimo, CI completo no GitHub Actions e as licenças
do projeto. Nenhuma regra de negócio do placar entra nesta tarefa — só a base
sobre a qual as ondas seguintes constroem.

## Technical Context

**Language/Version**: Rust stable (edição 2021) + TypeScript 5

**Primary Dependencies**: Tauri 2, React 19, Vite, Tailwind CSS v4, Vitest,
`cargo-llvm-cov`

**Storage**: N/A (scaffold não persiste nada)

**Testing**: `cargo test` (Rust), Vitest + Testing Library (frontend),
`cargo llvm-cov` e `@vitest/coverage-v8` para cobertura

**Target Platform**: Windows (distribuição final); desenvolvimento e CI
rodam em Linux, com um job adicional de compilação no `windows-latest`

**Project Type**: Aplicativo desktop (Tauri: núcleo Rust + WebView)

**Performance Goals**: Não aplicável nesta tarefa — não há lógica de domínio
ainda para medir

**Constraints**: CSP sem curinga, `connect-src` liberando só
`https://us.i.posthog.com`; um único gerenciador de pacotes JS (npm) com
lockfile versionado; nenhuma regra de negócio no frontend

**Scale/Scope**: Um repositório, um workspace Cargo de 2 crates, um app
frontend — sem múltiplos serviços

## Constitution Check

Este projeto não tem `memory/constitution.md`. Os gates efetivos são os
critérios transversais do brief da tarefa (TDD, cobertura, higiene git,
Gherkin em `.md`, prova de que o teste detecta o defeito) — tratados como
constituição de fato para esta e as próximas tarefas do repositório.

## Project Structure

### Documentation (this feature)

```text
specs/scaffold/
├── spec.md     # este spec
└── plan.md     # este arquivo
```

### Source Code (repository root)

```text
crates/
└── placar-core/          # domínio puro (lib vazia nesta tarefa), zero I/O, zero Tauri
    ├── Cargo.toml
    └── src/lib.rs

src-tauri/                 # app Tauri: janela, bootstrap, (IPC vem na tarefa `app`)
├── Cargo.toml
├── build.rs
├── capabilities/
├── icons/
├── src/
│   ├── main.rs
│   └── lib.rs
└── tauri.conf.json

frontend/                  # React + TypeScript + Vite + Tailwind v4 — nunca calcula placar
├── package.json
├── index.html
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    └── __tests__/App.test.tsx

.github/workflows/ci.yml   # fmt, clippy, cargo test, vitest, cobertura, build windows
docs/
├── gherkin/                # cenários Gherkin em .md, 1:1 com o nome de cada teste
└── qa/cobertura.md          # decisão de exclusão de cobertura do bootstrap Tauri
LICENSES/                  # OFL-1.1 (fontes) e ISC (Lucide)
Cargo.toml                 # workspace raiz (members: crates/placar-core, src-tauri)
LICENSE                    # MIT
README.md
```

**Structure Decision**: aplicativo desktop de projeto único (não é
frontend+backend clássico) — o "backend" é o próprio processo Tauri em Rust,
e o domínio puro fica isolado em `crates/placar-core` para poder ser testado
sem WebView e sem I/O. Este é o layout de que as ondas 2–4 (definido na
Orientation Spec do journey) dependem; mudar os caminhos aqui quebraria a
paralelização delas.

## Complexity Tracking

Sem violações de constituição a justificar — a estrutura é a mínima
necessária para separar domínio (`placar-core`), app (`src-tauri`) e UI
(`frontend`) em unidades testáveis de forma independente.
