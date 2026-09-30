//! Lados, placar de um lado e a marcação com clamp em zero.
//!
//! Oráculo: `avulso.tsx:30-50, 308-349` (tipos `Side`/`SideScore` e a função
//! `mark`, com o clamp `Math.max(0, …)` em `323`, `333`, `342-345`).

/// Os dois lados de uma luta.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum Side {
    White,
    Blue,
}

/// Placar de um lado: pontos, vantagens e punições. Nunca negativo.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct SideScore {
    pub points: u32,
    pub advantages: u32,
    pub penalties: u32,
}

impl SideScore {
    /// A partir desta contagem de punições o lado entra em alerta
    /// (`avulso.tsx`: 3ª punição sinaliza, sem desclassificar).
    pub const PENALTY_ALERT_THRESHOLD: u32 = 3;

    /// O lado atingiu a 3ª punição?
    #[must_use]
    pub fn in_alert(&self) -> bool {
        self.penalties >= Self::PENALTY_ALERT_THRESHOLD
    }
}

/// Quanto vale cada controle de ponto (`avulso.tsx:38-42`).
const POINT2_VALUE: u32 = 2;
const POINT3_VALUE: u32 = 3;
const POINT4_VALUE: u32 = 4;

/// O tipo de contador que um controle mexe.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScoreKind {
    Point2,
    Point3,
    Point4,
    Advantage,
    Penalty,
}

/// Marcar (+) ou corrigir (−), espelhando o `delta: 1 | -1` de `avulso.tsx`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Delta {
    Add,
    Remove,
}

impl SideScore {
    /// Aplica um controle a este placar, devolvendo um placar novo. O contador
    /// nunca fica negativo: uma correção num contador zerado o deixa em 0
    /// (`avulso.tsx:323,333,342-345`). O outro lado é responsabilidade de quem
    /// chama — aqui só muda este placar.
    #[must_use]
    pub fn marked(self, kind: ScoreKind, delta: Delta) -> SideScore {
        match kind {
            ScoreKind::Advantage => SideScore {
                advantages: clamp_step(self.advantages, delta, 1),
                ..self
            },
            ScoreKind::Penalty => SideScore {
                penalties: clamp_step(self.penalties, delta, 1),
                ..self
            },
            ScoreKind::Point2 => SideScore {
                points: clamp_step(self.points, delta, POINT2_VALUE),
                ..self
            },
            ScoreKind::Point3 => SideScore {
                points: clamp_step(self.points, delta, POINT3_VALUE),
                ..self
            },
            ScoreKind::Point4 => SideScore {
                points: clamp_step(self.points, delta, POINT4_VALUE),
                ..self
            },
        }
    }
}

/// Soma ou subtrai `amount` de `current`, sem nunca passar de zero por baixo.
/// Este é o clamp que a mutação de C11 inverte.
fn clamp_step(current: u32, delta: Delta, amount: u32) -> u32 {
    match delta {
        Delta::Add => current + amount,
        Delta::Remove => current.saturating_sub(amount),
    }
}
