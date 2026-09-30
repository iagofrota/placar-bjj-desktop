# Implementation Plan: App desktop do placar

**Branch**: `feat/app-placar` | **Date**: 2026-09-30 | **Spec**: [spec.md](./spec.md)

## Arquitetura: o domínio no backend, a tela burra no frontend

O ponto que faz P11 passar limpo: **todo estado e toda regra ficam em Rust**. O frontend
não tem `Match`, não conta pontos, não faz clamp, não deriva tempo de `Date.now()`.

```
placar-core (onda 2, read-only)
        ▲
        │ usa
src-tauri/src/scoreboard.rs   Session { current: Match }  + SystemClock  ── testado
src-tauri/src/view.rs         StateView (retrato serializável) + formatação MM:SS ── testado
src-tauri/src/shortcut.rs     DTO do KeyPress → placar_core::is_clock_shortcut ── testado
src-tauri/src/lib.rs          builder Tauri, estado gerenciado, #[command], tick, emit ── glue
        │ IPC (invoke) + eventos (state/beep)
        ▼
frontend/src/ipc/*            cliente tipado (interface + impl Tauri + fake p/ teste)
frontend/src/scoreboard/*     hook useScoreboard, telas Setup/Board/Ended, diálogos
frontend/src/i18n/*           LocaleContext + chaves de app
```

### Backend (Rust)

- `Session` guarda o `Match` atual e aplica cada ação, devolvendo `StateView`. `SystemClock`
  implementa `placar_core::Clock` lendo o relógio de parede real (ms). Testes injetam
  `ManualClock` do próprio crate — determinísticos, sem `sleep`.
- `StateView` traz tudo que a UI desenha: estágio, nomes, placar, `remaining_seconds` +
  `remaining_display` (MM:SS formatado **no Rust**), `is_running`, `clock_urgent`
  (`is_running && is_last_seconds`), alerta de punição, e o resultado de encerramento. Os
  métodos e lados serializam como strings (`points`, `white`, …) que a UI mapeia para i18n.
- O tick roda a cada 250 ms: enquanto há board rodando, `tick` reconcilia, emite `state` e,
  na expiração, emite `beep` uma vez. Cada comando também emite `state` após mutar.
- `is_clock_shortcut` do domínio decide o atalho; o frontend só extrai o DTO do evento DOM.
- `lib.rs` concentra a cola do Tauri (não testável sem webview) e é ignorada na cobertura,
  como `main.rs` já é (ver `docs/qa/cobertura.md`). Toda a lógica mora nos módulos testados.

### Frontend (React)

- `ipc/client.ts`: interface `ScoreboardClient` (uma chamada por comando + `onState`/`onBeep`).
  Impl Tauri usa `invoke`/`listen`; um fake em memória serve os testes de componente e hook.
- Componentes **apresentacionais** recebem `state` + callbacks por props → testáveis em jsdom
  sem Tauri. O `App` liga o hook, o atalho de espaço, o beep e o `LocaleContext`.
- `controls.ts` lista os 26 rótulos acessíveis (10/lado + 6) montados das chaves i18n, batendo
  1:1 com `scoreboard.fixture.ts:48-64`. O teste de contrato conta 26 e falha se um sumir.
- Atalho de espaço portado de `lib/clock-shortcut.ts` (input handling da UI, não regra de
  placar): predicado + listener, com teste dos 3 focos. Nenhuma regra de placar é replicada.
- `beep()` (Web Audio) só toca; o *quando* vem do evento `beep` do backend.

## Formatação do relógio fica no Rust (P11)

`formatClock` da plataforma usa `Math.max(0, …)`, que o grep de P11 barra. Por isso o MM:SS
é formatado no `view.rs` e chega pronto no `StateView`. O frontend nunca divide nem faz
`Math.max`/`Date.now`/`setInterval` para o relógio.

## i18n de app

`keys.ts` (as 64 chaves da plataforma) fica intacto. Chaves só do app (rótulo do seletor de
idioma) entram em `app_keys.ts`; os dicionários ganham o namespace `app`; o teste de
completude passa a exigir a **união** `PLACAR_KEYS ∪ APP_KEYS`, então nenhuma chave sobra nem
falta. Os endônimos das línguas (Português/English/Español) são nomes próprios, constantes.

## e2e (binário real)

`e2e/` com WebdriverIO + `tauri-driver`. O `wdio.conf` builda `cargo tauri build` e aponta o
`tauri:options.application` para o binário. Specs: fluxo completo (oráculo = `placar-core`,
via fixture do próprio crate), contrato dos 26 controles, matriz de layout
(`getBoundingClientRect`, escala por `document.body.style.zoom`), i18n. No CI, job próprio
com WebKitWebDriver + Xvfb. O red-proof (P12) remove um controle numa branch descartável e
linka a execução vermelha no corpo do PR.

## TDD — ordem e prova

Teste vermelho antes da implementação, em cada camada. O ciclo RED→GREEN registrado está em
[SDD.md](./SDD.md). Provas de detecção de defeito (mutação/par de falsificação) por critério
crítico descritas no PR e no `SDD.md`.

## Dependências novas

- Frontend: `@wdio/*`, `webdriverio` (devDependencies do e2e, isoladas em `e2e/`), sem subir
  o engine mínimo de Node do app. `src-tauri/Cargo.toml` ganha `placar-core` (path) e
  `serde`/`serde_json` (já presentes).

## Verificação

`cargo test --workspace`, `cargo llvm-cov` (≥ 80% geral, `lib/main` ignorados), `npm test`
+ cobertura no `frontend/`, `cargo tauri build` compilando, e o job e2e verde no CI.
