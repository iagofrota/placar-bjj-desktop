//! Domínio puro do placar de Jiu-Jitsu Brasileiro.
//!
//! Replica o comportamento do placar avulso da plataforma (`avulso.tsx`, commit
//! `9c1cafc`) como domínio Rust puro: estágios `setup → board → encerrada`,
//! placar por lado com clamp em zero, cronômetro wall-clock com [`Clock`]
//! injetável, desempate por pontos e encerramento por método. Qualquer sequência
//! de ações do operador dá o mesmo resultado da web, e isso é provado por testes
//! determinísticos, sem relógio real nem espera de tempo de parede.
//!
//! O crate **não** depende de Tauri nem de nenhuma forma de I/O. O estado é
//! imutável: cada operação devolve um estado novo e o anterior fica intacto.
//! Ver `SDD.md` para o mapa de linhas do oráculo e as mutações de C11.

#![forbid(unsafe_code)]

mod board;
mod clock;
mod ended;
mod match_state;
mod setup;
mod shortcut;

pub use board::{Board, LAST_SECONDS_THRESHOLD};
pub use clock::{Clock, ClockAdjust, ManualClock};
pub use ended::{EndError, EndMethod, Ended};
pub use match_state::{Match, StartError, Tick};
pub use setup::{can_start, MAX_DURATION_MINUTES, MIN_DURATION_MINUTES};
pub use shortcut::{is_clock_shortcut, ElementTag, FocusTarget, KeyPress};
pub use side::{Delta, ScoreKind, Side, SideScore};

mod side;
