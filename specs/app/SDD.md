# SDD — App desktop do placar

Registro de decisões, o ciclo RED→GREEN e as provas de detecção de defeito, além
do que **não** ficou estabelecido (com o mesmo peso do que ficou).

## Ordem TDD — um ciclo RED→GREEN registrado

Camada de contrato dos 26 controles (`frontend/src/scoreboard/controls.ts`):

- **RED** — `controls.test.ts` escrito primeiro, contra `./controls` inexistente:
  ```
  Test Files  1 failed (1)
        Tests  no tests            (erro de resolução: módulo ./controls ausente)
  ```
- **GREEN** — implementado `controls.ts` (fonte única dos rótulos, usada pelos
  componentes e pelo contrato):
  ```
  Test Files  1 passed (1)
        Tests  2 passed (2)
  ```

O backend seguiu a mesma ordem por módulo (teste ao lado do código); a prova de
que os testes **detectam** o defeito está abaixo.

## Provas de que o teste detecta o defeito

- **Mutação (P5 / relógio urgente).** Em `view.rs`, `clock_urgent = is_running &&
  is_last_seconds` invertido para `||`:
  ```
  test view::tests::urgente_so_com_relogio_rodando_nos_ultimos_30s ... FAILED
  test result: FAILED. 0 passed; 1 failed; 21 filtered out
  ```
  Mata **exatamente** o teste esperado; árvore restaurada (`git status` limpo).
- **Oráculo (P1 / fluxo).** O e2e no binário real aplica uma sequência fixa e
  compara os números exibidos ao cálculo do `placar-core`, documentado em
  `e2e/specs/flow.e2e.js` (pontos 2→5→9→6 pelo clamp de `side.rs`; desempate por
  pontos de `ended.rs`). O oráculo é a regra do domínio, não número escrito à mão.
- **Contrato dos 26 (P7).** Contado no vitest, no e2e real e na matriz de layout.
  Remover um controle derruba os três (o red-proof do PR mostra o CI vermelho).

## Decisões e limites (state-the-limit)

O que este trabalho **estabelece**:

- Todo estado e regra vivem no backend (Rust, sobre `placar-core`). O frontend só
  chama IPC e desenha. `rg` de P11 limpo; o MM:SS é formatado no `view.rs`.
- Cobertura: Rust ~98% linhas (lib/main ignorados, só cola Tauri); frontend ~96%.
- e2e no **binário Tauri real** (wry 0.57) via tauri-driver + WebdriverIO: fluxo,
  26 controles e i18n. Layout (P8) no **Chromium** via Playwright.

O que este trabalho **NÃO** estabelece (mesmo peso):

- **Escala de P8 é emulada, não DPI real.** A matriz usa `deviceScaleFactor` no
  Chromium (motor do WebView2, alvo no Windows), com o viewport na resolução
  nomeada. Encolher o viewport para (resolução/escala) — a outra leitura de
  "escala" — daria 683×250 no pior caso, onde 26 controles ≥44 px não caberiam;
  além disso o `minSize` da janela (`tauri.conf`, fora do escopo desta tarefa) e o
  `zoom` do WebKitGTK (que não reflui) impedem essa emulação no webview real. O
  **DPI real do SO** e a janela arrastada entre monitores ficam no
  `docs/qa/release-checklist.md`, verificação manual do PE no Windows.
- **Atalho de espaço replicado no frontend.** `clock-shortcut.ts` espelha
  `placar_core::is_clock_shortcut` porque o predicado precisa ser síncrono para
  `preventDefault` — é roteamento de entrada da UI (como na plataforma), não regra
  de placar, e P11 não o proíbe. A paridade com o domínio não é verificada em
  tempo de execução; é garantida por leitura e pelos testes dos 3 focos (P6).
- **`end_bout.failed_generic` não é usada.** O texto fala de "conexão", sem sentido
  offline; encerrar só falha por `tie`/`empty_submission`, ambos tratados sem ela.
- **P10 (fechar/reabrir) não é coberto por teste automatizado.** Fechar a janela do
  webview no meio do e2e encerraria a sessão do driver; a ausência de persistência
  é estrutural (nenhum estado é gravado em disco) e fica no checklist manual.
- O e2e roda sob Xvfb no CI, sem GPU; a renderização real em telas físicas não é
  exercida aqui.

## Revisão do Codex — dois consertos (pós-primeira entrega)

Dois achados da revisão automática, aprovados pelo PE, ambos dentro da task-spec.

- **P6 — foco preso com diálogo aberto.** O `Dialog` focava o painel mas não prendia
  o foco: com o diálogo aberto, um Tab levava o foco a um botão do board, e aí o
  Espaço alternava o relógio e o Enter acionava o botão de trás. Conserto (o
  recomendado): o conteúdo do diálogo é **portalizado** para fora do board e o board
  fica **`inert`** enquanto houver diálogo aberto — barra Tab, Espaço e Enter de uma
  vez, como o modal da web (Radix). Um `ModalProvider` agrega os diálogos abertos.
  RED→GREEN: `dialogo_aberto_torna_o_board_inert_barrando_foco_atras` (vermelho sem o
  `inert`, verde com ele) + o e2e `dialogo_aberto_barra_espaco_e_enter_no_board` no
  binário real.
- **P2 — relógio não monotônico.** O `SystemClock` usava o relógio de parede do SO;
  um ajuste da hora no meio da luta congelaria ou encerraria o cronômetro antes da
  hora, violando o contrato do `Clock` do `placar-core` ("monotônico dentro de uma
  luta"). Conserto: o `SystemClock` ancora um `Instant` base e devolve
  `base.elapsed()`. `placar-core` segue somente leitura. Prova: teste de
  não-decréscimo + contrafactual `rg 'SystemTime' src-tauri/src` **vazio**.
