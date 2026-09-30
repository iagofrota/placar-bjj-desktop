//! Encerramento da luta: métodos, desempate por pontos e o resultado final.
//!
//! Oráculo: `avulso.tsx:32-36` (`EndedResult`) e `351-380` (`endBout`), com o
//! desempate em `358-369`. Contrato de `end_bout` em Orientation Spec
//! ("API do domínio").

use crate::side::{Side, SideScore};

/// Como a luta terminou.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EndMethod {
    Points,
    Submission,
    Decision,
    Dq,
    Wo,
}

/// Por que um encerramento foi recusado.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EndError {
    /// `points` com empate total: a luta continua aberta (`avulso.tsx:364-366`).
    Tie,
    /// `submission` sem texto útil (vazio ou só espaços).
    EmptySubmission,
}

/// O resultado de uma luta encerrada. Guarda um retrato do placar e dos nomes
/// para a tela de encerramento (`avulso.tsx:382-437`).
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Ended {
    pub method: EndMethod,
    pub winner: Option<Side>,
    pub submission: Option<String>,
    pub white_name: String,
    pub blue_name: String,
    pub white_score: SideScore,
    pub blue_score: SideScore,
}

/// Decide o vencedor por pontos, ou `EndError::Tie` no empate total.
///
/// Ordem do desempate (`avulso.tsx:358-369`): mais pontos, depois mais
/// vantagens, depois **menos** punições. A subtração das punições é
/// `azul − branco` (menos punições vence); inverter essa ordem é a mutação de
/// C11.
pub(crate) fn decide_points_winner(white: SideScore, blue: SideScore) -> Result<Side, EndError> {
    let difference = points_difference(white, blue);

    if difference == 0 {
        return Err(EndError::Tie);
    }

    Ok(if difference > 0 {
        Side::White
    } else {
        Side::Blue
    })
}

/// A diferença assinada do desempate: positiva favorece o branco, negativa o
/// azul, zero é empate total.
fn points_difference(white: SideScore, blue: SideScore) -> i64 {
    let points = i64::from(white.points) - i64::from(blue.points);
    if points != 0 {
        return points;
    }

    let advantages = i64::from(white.advantages) - i64::from(blue.advantages);
    if advantages != 0 {
        return advantages;
    }

    // Menos punições vence: por isso azul − branco (a mutação de C11 troca a
    // ordem para branco − azul).
    i64::from(blue.penalties) - i64::from(white.penalties)
}

/// Normaliza o texto de finalização: `Some(texto_sem_espaços_nas_bordas)` se
/// houver conteúdo, senão `EndError::EmptySubmission`.
pub(crate) fn require_submission(submission: Option<&str>) -> Result<String, EndError> {
    let text = submission.unwrap_or("").trim();
    if text.is_empty() {
        Err(EndError::EmptySubmission)
    } else {
        Ok(text.to_string())
    }
}
