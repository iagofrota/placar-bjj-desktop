//! `Session`: guarda a luta atual (`Match`) e aplica cada ação do operador,
//! devolvendo o retrato para a UI. É a única lógica da camada de app — os
//! comandos IPC em `lib.rs` só destrancam o mutex e delegam para cá.
//!
//! O tempo real vem de [`SystemClock`]; os testes injetam o `ManualClock` do
//! `placar-core`, sem `sleep` e sem tocar o relógio do SO.

use std::time::Instant;

use placar_core::{
    Clock, ClockAdjust, Delta, EndError, EndMethod, Match, ScoreKind, Side, StartError,
};

use crate::view::StateView;

/// Relógio monotônico dentro de uma luta: parte de um `Instant` base criado com
/// o relógio e conta o decorrido. Ao contrário do relógio de parede do SO, um
/// ajuste da hora do sistema no meio da luta não faz o cronômetro congelar nem
/// encerrar antes da hora — e isso honra o contrato de `Clock` do `placar-core`
/// ("monotônico dentro de uma luta").
#[derive(Debug, Clone, Copy)]
pub struct SystemClock {
    base: Instant,
}

impl SystemClock {
    /// Um relógio ancorado no instante atual.
    #[must_use]
    pub fn new() -> Self {
        Self {
            base: Instant::now(),
        }
    }
}

impl Default for SystemClock {
    fn default() -> Self {
        Self::new()
    }
}

impl Clock for SystemClock {
    fn now_ms(&self) -> i64 {
        // `Instant` é monotônico: nunca anda para trás, independentemente da
        // hora do SO. O domínio usa só diferenças de `now_ms`, então a origem
        // arbitrária (base) não importa.
        self.base.elapsed().as_millis() as i64
    }
}

/// Por que iniciar a luta falhou, na fronteira de app.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum StartFail {
    /// Duração não numérica/inteira ou nomes vazios (o botão já barra isto).
    InvalidSetup,
}

/// Por que encerrar falhou, com o motivo que a UI precisa distinguir.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EndFail {
    /// Empate total por `points`: a luta continua, a UI mostra o aviso.
    Tie,
    /// `submission` sem texto (o botão de confirmar já barra isto).
    EmptySubmission,
}

impl EndFail {
    /// Tag estável para a UI decidir a mensagem de i18n.
    #[must_use]
    pub fn tag(self) -> &'static str {
        match self {
            EndFail::Tie => "tie",
            EndFail::EmptySubmission => "empty_submission",
        }
    }
}

/// A sessão de placar do app: uma luta por vez.
#[derive(Debug, Default)]
pub struct Session {
    current: Match,
}

impl Session {
    /// Sessão nova, no Setup.
    #[must_use]
    pub fn new() -> Self {
        Self {
            current: Match::new(),
        }
    }

    /// Retrato do estado atual.
    #[must_use]
    pub fn view(&self, clock: &impl Clock) -> StateView {
        StateView::from_match(&self.current, clock)
    }

    /// O Setup aceita estes nomes e esta duração (texto do campo)? A regra é do
    /// domínio; aqui só se converte o texto do campo em número.
    #[must_use]
    pub fn can_start(white: &str, blue: &str, duration_raw: &str) -> bool {
        placar_core::can_start(white, blue, parse_duration(duration_raw))
    }

    /// Inicia a luta a partir do Setup. Erro se o domínio recusar.
    ///
    /// # Errors
    /// [`StartFail::InvalidSetup`] quando nomes/duração são inválidos.
    pub fn start(
        &mut self,
        white: &str,
        blue: &str,
        duration_raw: &str,
        clock: &impl Clock,
    ) -> Result<StateView, StartFail> {
        match self
            .current
            .start(white, blue, parse_duration(duration_raw))
        {
            Ok(next) => {
                self.current = next;
                Ok(self.view(clock))
            }
            Err(StartError::InvalidSetup) => Err(StartFail::InvalidSetup),
        }
    }

    /// Marca/corrige num lado.
    pub fn mark(
        &mut self,
        side: Side,
        kind: ScoreKind,
        delta: Delta,
        clock: &impl Clock,
    ) -> StateView {
        self.current = self.current.mark(side, kind, delta);
        self.view(clock)
    }

    /// Inicia/pausa o cronômetro.
    pub fn toggle_clock(&mut self, clock: &impl Clock) -> StateView {
        self.current = self.current.toggle_clock(clock);
        self.view(clock)
    }

    /// Ajusta o cronômetro em ±10 s.
    pub fn adjust_clock(&mut self, adjust: ClockAdjust, clock: &impl Clock) -> StateView {
        self.current = self.current.adjust_clock(adjust, clock);
        self.view(clock)
    }

    /// Reconcilia o relógio. Devolve o retrato e se o beep deve soar agora.
    pub fn tick(&mut self, clock: &impl Clock) -> (StateView, bool) {
        let tick = self.current.tick(clock);
        self.current = tick.state;
        (self.view(clock), tick.beep)
    }

    /// O cronômetro está correndo? (o tick só precisa emitir enquanto corre.)
    #[must_use]
    pub fn is_running(&self) -> bool {
        self.current
            .board()
            .is_some_and(placar_core::Board::is_running)
    }

    /// Encerra a luta.
    ///
    /// # Errors
    /// [`EndFail::Tie`] no empate total por `points`; [`EndFail::EmptySubmission`]
    /// se `submission` vier sem texto.
    pub fn end_bout(
        &mut self,
        method: EndMethod,
        winner: Option<Side>,
        submission: Option<&str>,
        clock: &impl Clock,
    ) -> Result<StateView, EndFail> {
        match self.current.end_bout(method, winner, submission) {
            Ok(next) => {
                self.current = next;
                Ok(self.view(clock))
            }
            Err(EndError::Tie) => Err(EndFail::Tie),
            Err(EndError::EmptySubmission) => Err(EndFail::EmptySubmission),
        }
    }

    /// Cancela a luta e volta ao Setup.
    pub fn cancel(&mut self, clock: &impl Clock) -> StateView {
        self.current = self.current.cancel();
        self.view(clock)
    }

    /// Começa uma luta nova depois do encerramento, voltando ao Setup.
    pub fn new_bout(&mut self, clock: &impl Clock) -> StateView {
        self.current = self.current.new_bout();
        self.view(clock)
    }
}

/// Texto do campo de duração em minutos. Vazio/não numérico vira `NaN`, que o
/// domínio (`can_start`) recusa — nenhuma regra de validade mora aqui.
fn parse_duration(raw: &str) -> f64 {
    raw.trim().parse::<f64>().unwrap_or(f64::NAN)
}

#[cfg(test)]
mod tests {
    use super::*;
    use placar_core::ManualClock;

    #[test]
    fn parse_duration_recusa_vazio_e_texto() {
        assert!(parse_duration("").is_nan());
        assert!(parse_duration("abc").is_nan());
        assert_eq!(parse_duration("5"), 5.0);
        assert_eq!(parse_duration(" 7 "), 7.0);
        assert_eq!(parse_duration("2.5"), 2.5);
    }

    #[test]
    fn can_start_delega_ao_dominio() {
        assert!(Session::can_start("Ana", "Bia", "5"));
        assert!(!Session::can_start(" ", "Bia", "5"));
        assert!(!Session::can_start("Ana", "Bia", "2.5"));
        assert!(!Session::can_start("Ana", "Bia", "0"));
        assert!(!Session::can_start("Ana", "Bia", "21"));
        assert!(!Session::can_start("Ana", "Bia", ""));
    }

    #[test]
    fn start_invalido_e_recusado_e_mantem_setup() {
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        assert_eq!(
            s.start("", "Bia", "5", &clock),
            Err(StartFail::InvalidSetup)
        );
        assert_eq!(s.view(&clock).stage, crate::view::StageKind::Setup);
    }

    #[test]
    fn fluxo_completo_espelha_o_placar_core() {
        // P1: sequência fixa; o oráculo é o próprio domínio, comparado ao final.
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "5", &clock).unwrap();

        s.mark(Side::White, ScoreKind::Point2, Delta::Add, &clock);
        s.mark(Side::White, ScoreKind::Point3, Delta::Add, &clock);
        s.mark(Side::Blue, ScoreKind::Advantage, Delta::Add, &clock);
        s.mark(Side::White, ScoreKind::Point2, Delta::Remove, &clock); // correção
        s.mark(Side::Blue, ScoreKind::Penalty, Delta::Add, &clock);

        let board = s.view(&clock).board.unwrap();
        assert_eq!(board.white.points, 3); // +2 +3 -2
        assert_eq!(board.blue.advantages, 1);
        assert_eq!(board.blue.penalties, 1);

        // oráculo: o mesmo domínio, aplicado à mão
        let oracle = Match::new()
            .start("Ana", "Bia", 5.0)
            .unwrap()
            .mark(Side::White, ScoreKind::Point2, Delta::Add)
            .mark(Side::White, ScoreKind::Point3, Delta::Add)
            .mark(Side::Blue, ScoreKind::Advantage, Delta::Add)
            .mark(Side::White, ScoreKind::Point2, Delta::Remove)
            .mark(Side::Blue, ScoreKind::Penalty, Delta::Add);
        let oracle_board = StateView::from_match(&oracle, &clock).board.unwrap();
        assert_eq!(board.white, oracle_board.white);
        assert_eq!(board.blue, oracle_board.blue);
    }

    #[test]
    fn toggle_conta_o_tempo_so_rodando() {
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "5", &clock).unwrap();

        clock.advance_secs(10); // parado: não conta
        assert_eq!(s.view(&clock).board.unwrap().remaining_seconds, 300);
        assert!(!s.is_running());

        s.toggle_clock(&clock);
        assert!(s.is_running());
        clock.advance_secs(10); // rodando: conta
        assert_eq!(s.view(&clock).board.unwrap().remaining_seconds, 290);

        s.toggle_clock(&clock); // pausa, ancora
        clock.advance_secs(100);
        assert_eq!(s.view(&clock).board.unwrap().remaining_seconds, 290);
    }

    #[test]
    fn tick_pausa_e_bipa_uma_vez_na_expiracao() {
        // P5: sem sleep — relógio controlado.
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "1", &clock).unwrap(); // 60 s
        s.toggle_clock(&clock);

        clock.advance_secs(60);
        let (view, beep) = s.tick(&clock);
        assert!(beep, "beep no tick que cruza o zero");
        assert_eq!(view.board.as_ref().unwrap().remaining_seconds, 0);
        assert!(!view.board.unwrap().is_running, "auto-pausa na expiração");

        // não bipa de novo
        clock.advance_secs(10);
        let (_, beep_again) = s.tick(&clock);
        assert!(!beep_again);
    }

    #[test]
    fn empate_total_por_pontos_recusa_e_mantem_board() {
        // P3
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "5", &clock).unwrap();
        assert_eq!(
            s.end_bout(EndMethod::Points, None, None, &clock),
            Err(EndFail::Tie)
        );
        assert_eq!(s.view(&clock).stage, crate::view::StageKind::Board);
    }

    #[test]
    fn submission_vazio_recusa_preenchido_encerra() {
        // P4
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "5", &clock).unwrap();
        assert_eq!(
            s.end_bout(EndMethod::Submission, Some(Side::White), Some("  "), &clock),
            Err(EndFail::EmptySubmission)
        );
        let view = s
            .end_bout(
                EndMethod::Submission,
                Some(Side::White),
                Some("Armlock"),
                &clock,
            )
            .unwrap();
        assert_eq!(view.ended.unwrap().submission.as_deref(), Some("Armlock"));
    }

    #[test]
    fn cancel_e_new_bout_voltam_ao_setup() {
        let clock = ManualClock::new(0);
        let mut s = Session::new();
        s.start("Ana", "Bia", "5", &clock).unwrap();
        assert_eq!(s.cancel(&clock).stage, crate::view::StageKind::Setup);

        s.start("Ana", "Bia", "5", &clock).unwrap();
        s.end_bout(EndMethod::Decision, Some(Side::White), None, &clock)
            .unwrap();
        assert_eq!(s.new_bout(&clock).stage, crate::view::StageKind::Setup);
    }

    #[test]
    fn end_fail_tag_nomeia_o_motivo() {
        assert_eq!(EndFail::Tie.tag(), "tie");
        assert_eq!(EndFail::EmptySubmission.tag(), "empty_submission");
    }

    #[test]
    fn system_clock_e_monotonico_e_nunca_decresce() {
        // P2: leituras seguidas nunca andam para trás (imune a ajuste do SO).
        let clock = SystemClock::new();
        let a = clock.now_ms();
        let b = clock.now_ms();
        let c = clock.now_ms();
        assert!(a >= 0);
        assert!(b >= a);
        assert!(c >= b);
    }
}
