//! O agregado da luta: uma máquina de estados `setup → board → encerrada`.
//!
//! Oráculo: `avulso.tsx:481-544` (`Stage` e o componente `Avulso`). Toda
//! operação devolve um `Match` novo; o anterior fica intacto. Operações que só
//! valem no board (marcar, mexer no relógio, encerrar) são no-op fora dele
//! (`avulso.tsx`: os controles nem existem fora do board).

use crate::board::Board;
use crate::clock::{Clock, ClockAdjust};
use crate::ended::{EndError, EndMethod, Ended};
use crate::setup::can_start;
use crate::side::{Delta, ScoreKind, Side};

/// Por que iniciar a luta foi recusado.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StartError {
    /// Nomes ou duração inválidos (ver `can_start`).
    InvalidSetup,
}

/// O estágio atual da luta.
#[derive(Debug, Clone, PartialEq, Eq)]
enum Stage {
    Setup,
    Board(Board),
    Ended(Ended),
}

/// O estado completo de uma luta avulsa.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Match {
    stage: Stage,
}

/// O resultado de um `tick`: o novo estado e se o beep deve soar agora.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Tick {
    pub state: Match,
    /// `true` só no tick que cruza o zero — nunca nos seguintes.
    pub beep: bool,
}

impl Default for Match {
    fn default() -> Self {
        Self::new()
    }
}

impl Match {
    /// Uma luta nova, no Setup.
    #[must_use]
    pub fn new() -> Self {
        Self {
            stage: Stage::Setup,
        }
    }

    /// Está no Setup?
    #[must_use]
    pub fn is_setup(&self) -> bool {
        matches!(self.stage, Stage::Setup)
    }

    /// A luta em andamento, se estiver no board.
    #[must_use]
    pub fn board(&self) -> Option<&Board> {
        match &self.stage {
            Stage::Board(board) => Some(board),
            _ => None,
        }
    }

    /// O resultado, se a luta estiver encerrada.
    #[must_use]
    pub fn ended(&self) -> Option<&Ended> {
        match &self.stage {
            Stage::Ended(ended) => Some(ended),
            _ => None,
        }
    }

    /// Valida o Setup e, se aceito, entra no board com placar e relógio zerados
    /// (cronômetro parado no tempo cheio). Nomes vão com `trim`
    /// (`avulso.tsx:170`).
    ///
    /// # Errors
    /// `StartError::InvalidSetup` se `can_start` recusar nomes/duração.
    pub fn start(
        &self,
        white_name: &str,
        blue_name: &str,
        duration_minutes: f64,
    ) -> Result<Match, StartError> {
        // `start` só é uma transição válida a partir do Setup — em `avulso.tsx`
        // o `onStart` só existe no estágio setup (`521-531`). Fora dele, no-op
        // preservando o estado, para uma ação de start repetida ou fora de ordem
        // não descartar uma luta em curso ou encerrada.
        if !self.is_setup() {
            return Ok(self.clone());
        }

        if !can_start(white_name, blue_name, duration_minutes) {
            return Err(StartError::InvalidSetup);
        }

        let board = Board::new(
            white_name.trim().to_string(),
            blue_name.trim().to_string(),
            duration_minutes as u32,
        );
        Ok(Match {
            stage: Stage::Board(board),
        })
    }

    /// Marca pontos/vantagem/punição num lado. No-op fora do board.
    #[must_use]
    pub fn mark(&self, side: Side, kind: ScoreKind, delta: Delta) -> Match {
        self.map_board(|board| board.marked(side, kind, delta))
    }

    /// Inicia/pausa o cronômetro. No-op fora do board.
    #[must_use]
    pub fn toggle_clock(&self, clock: &impl Clock) -> Match {
        self.map_board(|board| board.toggled_clock(clock))
    }

    /// Ajusta o cronômetro em ±10 s. No-op fora do board.
    #[must_use]
    pub fn adjust_clock(&self, adjust: ClockAdjust, clock: &impl Clock) -> Match {
        self.map_board(|board| board.adjusted_clock(adjust, clock))
    }

    /// Reconcilia o relógio e sinaliza o beep na expiração. No-op fora do board.
    #[must_use]
    pub fn tick(&self, clock: &impl Clock) -> Tick {
        match &self.stage {
            Stage::Board(board) => {
                let (next, beep) = board.ticked(clock);
                Tick {
                    state: Match {
                        stage: Stage::Board(next),
                    },
                    beep,
                }
            }
            _ => Tick {
                state: self.clone(),
                beep: false,
            },
        }
    }

    /// Encerra a luta. No-op fora do board.
    ///
    /// # Errors
    /// `EndError::Tie` no empate total com `points` (a luta continua no board);
    /// `EndError::EmptySubmission` se `submission` vier sem texto útil.
    pub fn end_bout(
        &self,
        method: EndMethod,
        winner: Option<Side>,
        submission: Option<&str>,
    ) -> Result<Match, EndError> {
        match &self.stage {
            Stage::Board(board) => {
                let ended = board.end(method, winner, submission)?;
                Ok(Match {
                    stage: Stage::Ended(ended),
                })
            }
            _ => Ok(self.clone()),
        }
    }

    /// Cancela a luta e volta ao Setup (`avulso.tsx:303-306`). No-op fora do
    /// board.
    #[must_use]
    pub fn cancel(&self) -> Match {
        match &self.stage {
            Stage::Board(_) => Match::new(),
            _ => self.clone(),
        }
    }

    /// Começa uma luta nova depois de encerrar, voltando ao Setup
    /// (`avulso.tsx:428-435` "Nova luta"). No-op fora do encerramento.
    #[must_use]
    pub fn new_bout(&self) -> Match {
        match &self.stage {
            Stage::Ended(_) => Match::new(),
            _ => self.clone(),
        }
    }

    /// Aplica `f` ao board, ou devolve uma cópia intacta fora dele.
    fn map_board(&self, f: impl FnOnce(&Board) -> Board) -> Match {
        match &self.stage {
            Stage::Board(board) => Match {
                stage: Stage::Board(f(board)),
            },
            _ => self.clone(),
        }
    }
}
