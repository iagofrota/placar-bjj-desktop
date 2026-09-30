//! A luta em andamento (estágio `board`): placar dos dois lados e o cronômetro
//! wall-clock com `Clock` injetável.
//!
//! Oráculo: `avulso.tsx:218-479` (`AvulsoBoard`), com o relógio local em
//! `52-85` e `241-301`, a auto-pausa na expiração em `252-262` e a marcação em
//! `308-349`. Estado imutável: cada operação devolve um `Board` novo.

use crate::clock::{Clock, ClockAdjust};
use crate::ended::{decide_points_winner, require_submission, EndError, EndMethod, Ended};
use crate::side::{Delta, ScoreKind, Side, SideScore};

/// Segundos num minuto — a duração vem em minutos e o relógio conta em segundos.
const SECONDS_PER_MINUTE: u32 = 60;

/// A partir deste tempo restante liga o sinal de "últimos 30 s".
pub const LAST_SECONDS_THRESHOLD: u32 = 30;

/// A luta em andamento.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Board {
    white_name: String,
    blue_name: String,
    duration_minutes: u32,
    white_score: SideScore,
    blue_score: SideScore,
    /// Tempo restante ancorado: quando parado é o restante; quando rodando é o
    /// restante no instante em que `started_at_ms` foi fixado.
    remaining_seconds: u32,
    /// Wall-clock de quando o cronômetro começou a correr, ou `None` se parado
    /// (`avulso.tsx:236` `startedAt`).
    started_at_ms: Option<i64>,
    /// A expiração já foi sinalizada? Trava o beep em uma única vez
    /// (`avulso.tsx:238` `expired`).
    expired: bool,
}

impl Board {
    /// Uma luta nova: placar zerado, cronômetro parado no tempo cheio.
    pub(crate) fn new(white_name: String, blue_name: String, duration_minutes: u32) -> Self {
        Self {
            white_name,
            blue_name,
            duration_minutes,
            white_score: SideScore::default(),
            blue_score: SideScore::default(),
            remaining_seconds: duration_minutes * SECONDS_PER_MINUTE,
            started_at_ms: None,
            expired: false,
        }
    }

    // --- consultas -------------------------------------------------------

    #[must_use]
    pub fn white_name(&self) -> &str {
        &self.white_name
    }

    #[must_use]
    pub fn blue_name(&self) -> &str {
        &self.blue_name
    }

    #[must_use]
    pub fn duration_minutes(&self) -> u32 {
        self.duration_minutes
    }

    /// O placar de um lado.
    #[must_use]
    pub fn score(&self, side: Side) -> SideScore {
        match side {
            Side::White => self.white_score,
            Side::Blue => self.blue_score,
        }
    }

    /// O lado atingiu a 3ª punição? (`avulso.tsx`: sinal, sem desclassificar.)
    #[must_use]
    pub fn penalty_alert(&self, side: Side) -> bool {
        self.score(side).in_alert()
    }

    /// O cronômetro está correndo?
    #[must_use]
    pub fn is_running(&self) -> bool {
        self.started_at_ms.is_some()
    }

    /// A expiração já foi sinalizada nesta luta?
    #[must_use]
    pub fn is_expired(&self) -> bool {
        self.expired
    }

    /// Tempo restante em segundos, contando o tempo decorrido se estiver
    /// correndo (`avulso.tsx:78-85`). Consulta pura: não muda o estado.
    #[must_use]
    pub fn remaining_seconds(&self, clock: &impl Clock) -> u32 {
        match self.started_at_ms {
            None => self.remaining_seconds,
            Some(started_at) => {
                let elapsed_ms = (clock.now_ms() - started_at).max(0);
                let elapsed_secs = (elapsed_ms / 1000) as u32;
                self.remaining_seconds.saturating_sub(elapsed_secs)
            }
        }
    }

    /// Estamos nos últimos 30 s? (`remaining <= 30`.)
    #[must_use]
    pub fn is_last_seconds(&self, clock: &impl Clock) -> bool {
        self.remaining_seconds(clock) <= LAST_SECONDS_THRESHOLD
    }

    // --- operações (devolvem estado novo) --------------------------------

    /// Aplica um controle de placar a um lado; o outro lado não muda
    /// (`avulso.tsx:308-349`).
    #[must_use]
    pub fn marked(&self, side: Side, kind: ScoreKind, delta: Delta) -> Board {
        let mut next = self.clone();
        match side {
            Side::White => next.white_score = self.white_score.marked(kind, delta),
            Side::Blue => next.blue_score = self.blue_score.marked(kind, delta),
        }
        next
    }

    /// Inicia ou pausa o cronômetro — um único toggle (`avulso.tsx:264-286`).
    #[must_use]
    pub fn toggled_clock(&self, clock: &impl Clock) -> Board {
        let mut next = self.clone();
        if self.is_running() {
            // Pausa: ancora o restante decorrido.
            next.remaining_seconds = self.remaining_seconds(clock);
            next.started_at_ms = None;
        } else {
            // Inicia: rearma a expiração e marca o instante.
            next.expired = false;
            next.started_at_ms = Some(clock.now_ms());
        }
        next
    }

    /// Ajusta o cronômetro em ±10 s, reancorando se estiver rodando para não dar
    /// salto (`avulso.tsx:294-301`).
    #[must_use]
    pub fn adjusted_clock(&self, adjust: ClockAdjust, clock: &impl Clock) -> Board {
        let current = i64::from(self.remaining_seconds(clock));
        let next_remaining = (current + adjust.seconds()).max(0) as u32;

        let mut next = self.clone();
        next.remaining_seconds = next_remaining;
        if self.is_running() {
            next.started_at_ms = Some(clock.now_ms());
        }
        next
    }

    /// Reconciliação periódica do relógio (o análogo do interval de 250 ms de
    /// `avulso.tsx:73`). Ao cruzar o zero rodando, auto-pausa e sinaliza o beep
    /// uma única vez (`avulso.tsx:252-262`). Devolve o novo board e se o beep
    /// deve soar agora — `true` só no tick que cruza o zero.
    pub(crate) fn ticked(&self, clock: &impl Clock) -> (Board, bool) {
        let remaining = self.remaining_seconds(clock);

        if self.is_running() && remaining == 0 && !self.expired {
            let mut next = self.clone();
            next.expired = true;
            next.remaining_seconds = 0;
            next.started_at_ms = None; // a pausa na expiração; mutação de C11 a remove
            (next, true)
        } else {
            (self.clone(), false)
        }
    }

    /// Encerra a luta. Com `points`, o vencedor sai do desempate e o empate
    /// total devolve `EndError::Tie` (a luta continua aberta). Nos outros
    /// métodos o vencedor vem do operador; `submission` exige texto não vazio
    /// (`avulso.tsx:351-380`, Orientation Spec).
    pub(crate) fn end(
        &self,
        method: EndMethod,
        winner: Option<Side>,
        submission: Option<&str>,
    ) -> Result<Ended, EndError> {
        let (winner, submission) = match method {
            EndMethod::Points => (
                Some(decide_points_winner(self.white_score, self.blue_score)?),
                None,
            ),
            EndMethod::Submission => (winner, Some(require_submission(submission)?)),
            EndMethod::Decision | EndMethod::Dq | EndMethod::Wo => (winner, None),
        };

        Ok(Ended {
            method,
            winner,
            submission,
            white_name: self.white_name.clone(),
            blue_name: self.blue_name.clone(),
            white_score: self.white_score,
            blue_score: self.blue_score,
        })
    }
}
