# Feature Specification: App desktop do placar (Setup → Board → Encerramento)

**Feature Branch**: `feat/app-placar`

**Created**: 2026-09-30

**Status**: Approved

**Input**: Task Spec aprovada pelo PE antes do início da implementação
(`.aipe/journeys/.../task-specs/placar-bjj-desktop.md`, tarefa `app`, onda 3).

## Objetivo

Um operador abre o app desktop e conduz uma luta inteira de jiu-jitsu só com mouse e
barra de espaço: configura, pontua, controla o tempo, encerra e começa outra. O
resultado é o mesmo que o placar público da web daria para a mesma sequência de ações,
porque **toda regra vem do `placar-core`** (crate Rust, somente leitura nesta onda). A
tela só mostra o estado que o backend emite e repassa as ações por comandos IPC.

O app tem a identidade visual da onda 2, fala pt_BR, en e es, cabe de 1366×768 a
2560×1440 em escala de 100% a 200%, funciona offline e sem persistência.

## Requisitos

- **FR-001 — Ponte IPC fina sobre `placar-core`.** O estado da luta (`Match`) vive no
  backend Rust, num estado gerenciado pelo Tauri. Comandos IPC (`get_state`, `can_start`,
  `start`, `mark`, `toggle_clock`, `adjust_clock`, `end_bout`, `cancel`, `new_bout`)
  aplicam a operação ao domínio e devolvem/emitem um retrato serializável do estado. O
  frontend não recalcula pontuação, desempate, clamp nem tempo.
- **FR-002 — Tick do relógio no backend.** Uma tarefa periódica reconcilia o relógio via
  `Match::tick` com um `Clock` de tempo real e emite o estado à UI enquanto o cronômetro
  corre. O tempo exibido vem desse estado emitido, nunca de um `Date.now()` do frontend.
- **FR-003 — Setup.** Dois nomes e a duração (minutos). "Iniciar luta" fica habilitado só
  quando o domínio (`can_start`, via IPC) aceita nomes e duração; casos inválidos (vazio,
  só espaços, `2.5`, `0`, `21`) deixam o botão desabilitado.
- **FR-004 — Board.** Dois painéis (branco/azul) com nome, pontos, vantagens, punições,
  aviso da 3ª punição e o pad de 10 controles por lado; barra do relógio com ±10 s,
  iniciar/pausar, relógio central clicável, cancelar e encerrar. Exatamente **26
  controles**, com os rótulos de `scoreboard.fixture.ts:48-64` da plataforma.
- **FR-005 — Atalho de espaço.** A barra de espaço alterna o relógio, exceto com foco em
  campo de texto (`input`/`textarea`/`select`/`contenteditable`) ou com um diálogo aberto
  (`[role="dialog"]`). Mesmo com foco num botão, o espaço é do relógio.
- **FR-006 — Encerramento.** Diálogo com método (`points`/`submission`/`decision`/`dq`/`wo`).
  Por `points`, o vencedor sai do desempate do domínio; empate total mostra a mensagem, o
  diálogo **não fecha** e a luta continua. `submission` exige texto não vazio para confirmar.
  "Nova luta" volta ao setup zerado.
- **FR-007 — Expiração.** Nos últimos 30 s o relógio ganha o destaque de alerta (token
  `--score-penalty`). Ao zerar, o backend pausa sozinho e sinaliza o beep **uma vez**, que
  o frontend toca via Web Audio.
- **FR-008 — i18n em app.** Seletor de idioma troca pt_BR/en/es em toda a UI (setup, board,
  diálogos, resultado), sem chave crua nem texto vazio. Chaves novas do app entram cobertas
  pelo teste de completude.
- **FR-009 — Sem persistência, sem rede.** Fechar a janela perde a luta; reabrir volta ao
  setup. Nenhuma mensagem cita "conexão".
- **FR-010 — Layout responsivo.** `clamp()` e o breakpoint `max-height: 500px` portados. Em
  1366×768, 1920×1080, 2560×1440 e altura ≤ 500 px, nas escalas 100/125/150/200% emuladas,
  nenhum controle transborda e todos medem ≥ 44 px.
- **FR-011 — e2e do binário real.** Suíte e2e com `tauri-driver` + WebdriverIO exercita o
  binário Tauri (não um atalho que pula o shell), cobrindo o fluxo completo, os 26
  controles e a matriz de layout. Roda no CI, verde, e fica vermelha quando um controle é
  removido.

## Cenários de aceite

Espelham P1–P13 e T1–T3 da task-spec. Um `.md` Gherkin por nome de teste em `gherkin/`.

1. Fluxo completo: sequência fixa dá o mesmo placar/vencedor/método do `placar-core`.
2. Setup valida as 6 entradas (botão desabilitado nas inválidas).
3. Empate total por `points`: diálogo aberto, mensagem visível, board ativo.
4. `submission` vazio não confirma; preenchido encerra e mostra o texto.
5. Últimos 30 s → alerta; zerar → auto-pausa e beep 1×.
6. Espaço nos 3 focos (corpo, campo de texto, diálogo).
7. Contrato dos 26 controles com par de falsificação.
8. Matriz 4 viewports × 4 escalas: sem transbordo, ≥ 44 px por `getBoundingClientRect`.
9. i18n nos 3 idiomas sem chave crua.
10. Fechar/reabrir volta ao setup vazio.
11. Nenhuma regra de placar no frontend (só IPC + render).
12. e2e no CI verde + red-proof de controle removido.
13. Nenhuma cor literal nem fonte externa nas telas novas.

## Fora de escopo

Telemetria e distribuição (onda 4), telão, segunda janela, histórico, persistência,
atalhos além do espaço, qualquer conexão com a plataforma, e mudar `placar-core`.
