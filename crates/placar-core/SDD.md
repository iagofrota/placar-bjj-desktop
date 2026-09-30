# SDD — `placar-core`

Domínio puro do placar de Jiu-Jitsu, replicando o placar avulso da plataforma
(`avulso.tsx`, commit `9c1cafc`, e `lib/clock-shortcut.ts`) como Rust sem I/O e
sem Tauri. A onda 3 (`app`) liga a UI a este domínio sem recalcular nada.

## Decisões

1. **Estado imutável.** `Match` é uma máquina de estados `Setup → Board →
   Ended`. Toda operação devolve um `Match` novo; o anterior fica intacto
   (`derive(Clone, PartialEq, Eq)` + construção de estado novo). Isso espelha o
   modelo React (`useState`) do oráculo, onde cada `setX` produz um render novo.
2. **`Clock` injetável.** O domínio nunca lê o relógio do SO. `Clock::now_ms()`
   é a única fonte de tempo; nos testes é o `ManualClock`, avançado à mão. Não há
   `sleep`, `Instant::now` nem `SystemTime::now` em `src/` (C4/C11.2). A fonte de
   tempo real é da onda 3, fora deste crate.
3. **Zero dependências.** `Cargo.toml` sem `[dependencies]`; `cargo tree -p
   placar-core` lista só o crate. Serialização para IPC é responsabilidade da
   onda 3 (feature/wrapper em `src-tauri`), não deste domínio.
4. **Duração como `f64` em `can_start`.** O critério C3 exige recusar `2.5`. Um
   inteiro não representaria o caso; por isso a duração entra como `f64` e a
   validação exige `fract() == 0` além do intervalo `[1, 20]`
   (`avulso.tsx:100-104`, `Number.isInteger`).
5. **Expiração e beep via `tick`.** O oráculo reconcilia o relógio a cada tick do
   `setInterval` (`avulso.tsx:73`) e a auto-pausa acontece num `useEffect`
   (`252-262`) travado por um `ref` `expired`. Aqui `Match::tick(clock)` é esse
   tick: devolve o estado novo e um `beep: bool`, `true` **só** no tick que cruza
   o zero. Consultas puras (`remaining_seconds`, `is_last_seconds`) não mudam o
   estado, então "consultar N vezes" nunca dispara beep de novo (C6).
6. **Atalho de espaço como predicado puro.** `is_clock_shortcut` recebe um
   `KeyPress`/`FocusTarget` que modela o que `event.target.closest(SELECTOR)`
   enxergaria (`clock-shortcut.ts:5-24`): tag, `contenteditable` efetivo e
   ancestral `[role=dialog]`. Sem DOM no domínio (C9).

## Mapa do oráculo (linhas de `avulso.tsx`, commit `9c1cafc`)

| Regra | Oráculo | Implementação |
|---|---|---|
| C1 marcação + clamp | `308-349`, clamp em `323`, `333`, `342-345` | `side.rs::SideScore::marked`, `clamp_step` |
| C2 alerta 3ª punição | `328-336` + regra de alerta | `side.rs::SideScore::in_alert`, `board.rs::penalty_alert` |
| C3 validação do Setup | `96-104`, `166-171` (trim + `validDuration`) | `setup.rs::can_start`, `match_state.rs::start` |
| C4 cronômetro | `52-85`, `264-286` (`toggleClock`) | `board.rs::remaining_seconds`, `toggled_clock` |
| C5 ±10 s reancora | `294-301` (`adjustClock`), clamp em `295` | `board.rs::adjusted_clock` |
| C6 30 s / expiração / beep | `252-262`, sinal `remaining <= 30` | `board.rs::ticked`, `is_last_seconds` |
| C7 desempate por pontos | `358-369` (pontos → vantagens → menos punições; empate → erro) | `ended.rs::decide_points_winner` |
| C8 outros métodos | `351-373`; submission exige texto | `board.rs::end`, `ended.rs::require_submission` |
| C9 atalho de espaço | `clock-shortcut.ts:1-25` | `shortcut.rs::is_clock_shortcut` |
| C10 cancelar / nova luta | `303-306`, `428-435`, `490-540` | `match_state.rs::cancel`, `new_bout`, no-op fora do board |

**C5 — limites citados:** `next = Math.max(0, remaining + delta)`
(`avulso.tsx:295`); reancoragem `if (clockRunning) setStartedAt(Date.now())`
(`avulso.tsx:298-300`). O teste `c5_...` reproduz +10/−10 parado e rodando e o
−10 abaixo de 10 s (para em 0), batendo com essas linhas.

## Prova por mutação (C11)

Cada mutação, aplicada isoladamente sobre o código verde, mata **exatamente** o
teste da regra e nada mais (verificado; ao restaurar, `git status` limpo e tudo
verde):

| Mutação | Onde | Teste que morre |
|---|---|---|
| Inverter o clamp (`saturating_sub` → `wrapping_sub`) | `side.rs::clamp_step` | só `c1_marcacao_soma_e_correcao_nao_fica_negativa` |
| Inverter a ordem das punições no desempate (`blue − white` → `white − blue`) | `ended.rs::points_difference` | só `c7_encerrar_por_pontos_desempate` |
| Remover a pausa na expiração (apagar `started_at_ms = None`) | `board.rs::ticked` | só `c6_expiracao_pausa_e_bipa_uma_vez` |

## Cobertura e pureza

- `cargo llvm-cov -p placar-core --fail-under-lines 95` passa (100% de linhas).
- `rg -n 'sleep|Instant::now|SystemTime::now' crates/placar-core/src` sai vazio.
- `cargo tree -p placar-core` não lista Tauri nem crates de I/O.

## Contrato consumido pela onda 3

`Match::{new, start, mark, toggle_clock, adjust_clock, tick, end_bout, cancel,
new_bout}` + consultas (`board`, `ended`, `is_setup`; no `Board`: `score`,
`penalty_alert`, `remaining_seconds`, `is_last_seconds`, `is_running`,
`is_expired`, nomes, duração) + `can_start` e `is_clock_shortcut`. Bate com a
"API do domínio" da Orientation Spec.

## Nota de processo — onde vive o SDD

O escopo desta unidade permite tocar **só** `crates/placar-core/**`. Por isso este
SDD (spec + plan + prova de mutação) mora dentro do crate, em vez de num diretório
`specs/` na raiz do repositório, que ficaria fora do escopo permitido. Decisão
deliberada, resolvida a favor do limite de caminhos mais específico.
