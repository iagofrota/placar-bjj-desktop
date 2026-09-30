//! Retrato serializável do estado da luta para a UI.
//!
//! A tela desenha só o que está aqui: nada de regra, nada de cálculo de tempo. O
//! MM:SS é formatado neste módulo (no backend) de propósito — o frontend nunca
//! divide segundos nem faz `Math.max`/`Date.now` (P11 da task-spec). Métodos e
//! lados serializam como strings estáveis (`points`, `white`, …) que a UI mapeia
//! para as chaves de i18n.

use placar_core::{Clock, EndMethod, Ended, Match, Side, SideScore};
use serde::Serialize;

/// Nome estável de um lado, para serialização e chave de i18n.
#[must_use]
pub fn side_key(side: Side) -> &'static str {
    match side {
        Side::White => "white",
        Side::Blue => "blue",
    }
}

/// Nome estável de um método de encerramento (`end_bout.methods.<key>`).
#[must_use]
pub fn method_key(method: EndMethod) -> &'static str {
    match method {
        EndMethod::Points => "points",
        EndMethod::Submission => "submission",
        EndMethod::Decision => "decision",
        EndMethod::Dq => "dq",
        EndMethod::Wo => "wo",
    }
}

/// Segundos em `MM:SS`, com minutos e segundos sempre em dois dígitos
/// (`avulso`/`formatClock`: `05:00`). Formatar aqui tira do frontend qualquer
/// cálculo de tempo.
#[must_use]
pub fn format_clock(total_seconds: u32) -> String {
    format!("{:02}:{:02}", total_seconds / 60, total_seconds % 60)
}

/// O estágio da luta, em `snake_case` para a UI.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum StageKind {
    Setup,
    Board,
    Ended,
}

/// Placar de um lado, já com o alerta de 3ª punição resolvido.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct SideView {
    pub name: String,
    pub points: u32,
    pub advantages: u32,
    pub penalties: u32,
    pub penalty_alert: bool,
}

impl SideView {
    fn build(name: &str, score: SideScore, alert: bool) -> Self {
        Self {
            name: name.to_string(),
            points: score.points,
            advantages: score.advantages,
            penalties: score.penalties,
            penalty_alert: alert,
        }
    }
}

/// A luta em andamento, como a UI a desenha.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct BoardView {
    pub white: SideView,
    pub blue: SideView,
    pub remaining_seconds: u32,
    pub remaining_display: String,
    pub duration_seconds: u32,
    pub duration_display: String,
    pub is_running: bool,
    /// `is_running && is_last_seconds`: o realce de alerta do relógio.
    pub clock_urgent: bool,
}

/// O resultado de uma luta encerrada, como a tela de encerramento a desenha.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct EndedView {
    pub method: String,
    pub winner: Option<String>,
    pub winner_name: Option<String>,
    pub white_name: String,
    pub blue_name: String,
    pub white_points: u32,
    pub blue_points: u32,
    pub submission: Option<String>,
}

/// O retrato completo do estado, com só um dos ramos preenchido por vez.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
pub struct StateView {
    pub stage: StageKind,
    pub board: Option<BoardView>,
    pub ended: Option<EndedView>,
}

impl StateView {
    /// Monta o retrato a partir do estado do domínio, lendo o relógio para o
    /// tempo restante quando há board.
    #[must_use]
    pub fn from_match(state: &Match, clock: &impl Clock) -> Self {
        if let Some(board) = state.board() {
            let remaining = board.remaining_seconds(clock);
            let duration = board.duration_minutes() * 60;
            let running = board.is_running();
            return Self {
                stage: StageKind::Board,
                board: Some(BoardView {
                    white: SideView::build(
                        board.white_name(),
                        board.score(Side::White),
                        board.penalty_alert(Side::White),
                    ),
                    blue: SideView::build(
                        board.blue_name(),
                        board.score(Side::Blue),
                        board.penalty_alert(Side::Blue),
                    ),
                    remaining_seconds: remaining,
                    remaining_display: format_clock(remaining),
                    duration_seconds: duration,
                    duration_display: format_clock(duration),
                    is_running: running,
                    clock_urgent: running && board.is_last_seconds(clock),
                }),
                ended: None,
            };
        }

        if let Some(ended) = state.ended() {
            return Self {
                stage: StageKind::Ended,
                board: None,
                ended: Some(ended_view(ended)),
            };
        }

        Self {
            stage: StageKind::Setup,
            board: None,
            ended: None,
        }
    }
}

fn ended_view(ended: &Ended) -> EndedView {
    let winner_name = ended.winner.map(|side| match side {
        Side::White => ended.white_name.clone(),
        Side::Blue => ended.blue_name.clone(),
    });
    EndedView {
        method: method_key(ended.method).to_string(),
        winner: ended.winner.map(|side| side_key(side).to_string()),
        winner_name,
        white_name: ended.white_name.clone(),
        blue_name: ended.blue_name.clone(),
        white_points: ended.white_score.points,
        blue_points: ended.blue_score.points,
        submission: ended.submission.clone(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use placar_core::{ClockAdjust, Delta, EndMethod, ManualClock, Match, ScoreKind, Side};

    fn started() -> Match {
        Match::new().start("Ana", "Bia", 5.0).unwrap()
    }

    #[test]
    fn format_clock_usa_dois_digitos() {
        assert_eq!(format_clock(300), "05:00");
        assert_eq!(format_clock(59), "00:59");
        assert_eq!(format_clock(0), "00:00");
        assert_eq!(format_clock(600), "10:00");
        assert_eq!(format_clock(605), "10:05");
    }

    #[test]
    fn setup_serializa_como_setup_sem_ramos() {
        let clock = ManualClock::new(0);
        let view = StateView::from_match(&Match::new(), &clock);
        assert_eq!(view.stage, StageKind::Setup);
        assert!(view.board.is_none());
        assert!(view.ended.is_none());
    }

    #[test]
    fn board_traz_nomes_placar_e_relogio_cheio_parado() {
        let clock = ManualClock::new(0);
        let view = StateView::from_match(&started(), &clock);
        assert_eq!(view.stage, StageKind::Board);
        let board = view.board.unwrap();
        assert_eq!(board.white.name, "Ana");
        assert_eq!(board.blue.name, "Bia");
        assert_eq!(board.remaining_seconds, 300);
        assert_eq!(board.remaining_display, "05:00");
        assert_eq!(board.duration_seconds, 300);
        assert!(!board.is_running);
        assert!(!board.clock_urgent);
        assert!(!board.white.penalty_alert);
    }

    #[test]
    fn alerta_de_punicao_liga_na_terceira() {
        let clock = ManualClock::new(0);
        let mut m = started();
        for _ in 0..3 {
            m = m.mark(Side::White, ScoreKind::Penalty, Delta::Add);
        }
        let board = StateView::from_match(&m, &clock).board.unwrap();
        assert!(board.white.penalty_alert);
        assert_eq!(board.white.penalties, 3);
        assert!(!board.blue.penalty_alert);
    }

    #[test]
    fn urgente_so_com_relogio_rodando_nos_ultimos_30s() {
        let clock = ManualClock::new(0);
        // relógio parado nos últimos 30 s não é urgente
        let m = started().adjust_clock(ClockAdjust::Minus10, &clock); // 290, parado
        let paused_last = m
            .adjust_clock(ClockAdjust::Minus10, &clock) // ainda longe; forçamos abaixo
            .toggle_clock(&clock);
        // roda e avança até 20 s restantes
        clock.advance_secs(280);
        let board = StateView::from_match(&paused_last, &clock).board.unwrap();
        assert!(board.is_running);
        assert!(board.clock_urgent, "rodando com <=30s deve ser urgente");

        // parado nos últimos 30 s não é urgente
        let stopped = StateView::from_match(&paused_last.toggle_clock(&clock), &clock)
            .board
            .unwrap();
        assert!(!stopped.is_running);
        assert!(!stopped.clock_urgent);
    }

    #[test]
    fn encerramento_por_pontos_traz_vencedor_e_nome() {
        let clock = ManualClock::new(0);
        let m = started()
            .mark(Side::White, ScoreKind::Point2, Delta::Add)
            .end_bout(EndMethod::Points, None, None)
            .unwrap();
        let ended = StateView::from_match(&m, &clock).ended.unwrap();
        assert_eq!(ended.stage_method(), "points");
        assert_eq!(ended.winner.as_deref(), Some("white"));
        assert_eq!(ended.winner_name.as_deref(), Some("Ana"));
        assert_eq!(ended.white_points, 2);
        assert_eq!(ended.blue_points, 0);
        assert!(ended.submission.is_none());
    }

    #[test]
    fn encerramento_por_submission_traz_texto_e_vencedor_do_operador() {
        let clock = ManualClock::new(0);
        let m = started()
            .end_bout(EndMethod::Submission, Some(Side::Blue), Some("Armlock"))
            .unwrap();
        let ended = StateView::from_match(&m, &clock).ended.unwrap();
        assert_eq!(ended.method, "submission");
        assert_eq!(ended.winner.as_deref(), Some("blue"));
        assert_eq!(ended.winner_name.as_deref(), Some("Bia"));
        assert_eq!(ended.submission.as_deref(), Some("Armlock"));
    }

    // pequeno atalho de leitura nos testes
    impl EndedView {
        fn stage_method(&self) -> &str {
            &self.method
        }
    }
}
