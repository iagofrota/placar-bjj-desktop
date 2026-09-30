//! Testes de aceitação do domínio `placar-core`, 1:1 com os cenários Gherkin em
//! `tests/scenarios/*.md` (mesmo nome do teste). O oráculo é `avulso.tsx`
//! (commit `9c1cafc`) da plataforma; as linhas citadas estão em `SDD.md`.

use placar_core::{ClockAdjust, Delta, EndMethod, Match, ScoreKind, Side};

/// Helper: uma luta já no board, branco/azul, 5 min, placar zerado.
fn board_5min() -> Match {
    Match::new()
        .start("Branco", "Azul", 5.0)
        .expect("setup válido inicia a luta")
}

// ---------------------------------------------------------------------------
// C1
// ---------------------------------------------------------------------------

#[test]
fn c1_marcacao_soma_e_correcao_nao_fica_negativa() {
    let start = board_5min();

    // Marca todos os tipos no branco.
    let after_white = start
        .mark(Side::White, ScoreKind::Point2, Delta::Add)
        .mark(Side::White, ScoreKind::Point3, Delta::Add)
        .mark(Side::White, ScoreKind::Point4, Delta::Add)
        .mark(Side::White, ScoreKind::Advantage, Delta::Add)
        .mark(Side::White, ScoreKind::Penalty, Delta::Add);

    let board = after_white.board().unwrap();
    assert_eq!(board.score(Side::White).points, 9);
    assert_eq!(board.score(Side::White).advantages, 1);
    assert_eq!(board.score(Side::White).penalties, 1);
    // O outro lado não muda.
    assert_eq!(board.score(Side::Blue).points, 0);
    assert_eq!(board.score(Side::Blue).advantages, 0);
    assert_eq!(board.score(Side::Blue).penalties, 0);

    // Estado anterior intacto (imutabilidade).
    assert_eq!(start.board().unwrap().score(Side::White).points, 0);

    // Marca todos os tipos no azul; o branco não muda.
    let after_blue = after_white
        .mark(Side::Blue, ScoreKind::Point2, Delta::Add)
        .mark(Side::Blue, ScoreKind::Point3, Delta::Add)
        .mark(Side::Blue, ScoreKind::Point4, Delta::Add)
        .mark(Side::Blue, ScoreKind::Advantage, Delta::Add)
        .mark(Side::Blue, ScoreKind::Penalty, Delta::Add);

    let board = after_blue.board().unwrap();
    assert_eq!(board.score(Side::Blue).points, 9);
    assert_eq!(board.score(Side::Blue).advantages, 1);
    assert_eq!(board.score(Side::Blue).penalties, 1);
    assert_eq!(board.score(Side::White).points, 9);

    // Correções (−) além do que cada contador tem: para em 0, nunca negativo.
    let corrected = after_blue
        .mark(Side::White, ScoreKind::Point4, Delta::Remove) // 9 -> 5
        .mark(Side::White, ScoreKind::Point3, Delta::Remove) // 5 -> 2
        .mark(Side::White, ScoreKind::Point2, Delta::Remove) // 2 -> 0
        .mark(Side::White, ScoreKind::Point2, Delta::Remove) // 0 -> 0 (clamp)
        .mark(Side::White, ScoreKind::Advantage, Delta::Remove) // 1 -> 0
        .mark(Side::White, ScoreKind::Advantage, Delta::Remove) // 0 -> 0 (clamp)
        .mark(Side::White, ScoreKind::Penalty, Delta::Remove) // 1 -> 0
        .mark(Side::White, ScoreKind::Penalty, Delta::Remove); // 0 -> 0 (clamp)

    let board = corrected.board().unwrap();
    assert_eq!(board.score(Side::White).points, 0);
    assert_eq!(board.score(Side::White).advantages, 0);
    assert_eq!(board.score(Side::White).penalties, 0);
}

// ---------------------------------------------------------------------------
// C2
// ---------------------------------------------------------------------------

#[test]
fn c2_terceira_punicao_liga_alerta_sem_encerrar() {
    let start = board_5min();

    let three = start
        .mark(Side::Blue, ScoreKind::Penalty, Delta::Add)
        .mark(Side::Blue, ScoreKind::Penalty, Delta::Add)
        .mark(Side::Blue, ScoreKind::Penalty, Delta::Add);

    let board = three.board().unwrap();
    assert!(board.penalty_alert(Side::Blue), "3ª punição liga o alerta");
    assert!(!board.penalty_alert(Side::White), "o outro lado não alerta");
    // Nenhum vencedor, luta segue no board.
    assert!(three.board().is_some());
    assert!(three.ended().is_none());

    // Corrigir para 2 desliga o alerta.
    let two = three.mark(Side::Blue, ScoreKind::Penalty, Delta::Remove);
    assert!(!two.board().unwrap().penalty_alert(Side::Blue));
}

// ---------------------------------------------------------------------------
// C3
// ---------------------------------------------------------------------------

#[test]
fn c3_can_start_valida_nomes_e_duracao() {
    use placar_core::can_start;

    // As sete entradas do critério (avulso.tsx:96-104,166-171).
    assert!(!can_start("", "Azul", 5.0), "nome branco vazio");
    assert!(!can_start("   ", "Azul", 5.0), "nome só com espaços");
    assert!(!can_start("Branco", "Azul", 0.0), "duração 0");
    assert!(!can_start("Branco", "Azul", 21.0), "duração 21");
    assert!(
        !can_start("Branco", "Azul", 2.5),
        "duração 2.5 (fracionária)"
    );
    assert!(can_start("Branco", "Azul", 1.0), "duração 1 válida");
    assert!(can_start("Branco", "Azul", 20.0), "duração 20 válida");

    // start recusa setup inválido e aceita válido, guardando os nomes com trim
    // e a duração (avulso.tsx:170).
    assert!(Match::new().start("", "Azul", 5.0).is_err());
    let started = Match::new().start("  Branco  ", "  Azul  ", 5.0).unwrap();
    let board = started.board().unwrap();
    assert_eq!(board.white_name(), "Branco");
    assert_eq!(board.blue_name(), "Azul");
    assert_eq!(board.duration_minutes(), 5);
}

// ---------------------------------------------------------------------------
// C4
// ---------------------------------------------------------------------------

#[test]
fn c4_cronometro_conta_so_rodando() {
    use placar_core::ManualClock;

    let clock = ManualClock::new(0);
    let m = board_5min().toggle_clock(&clock); // inicia em t=0, 300 s

    clock.advance_secs(90);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 210); // 3:30

    let m = m.toggle_clock(&clock); // pausa, ancora 210
    clock.advance_secs(60);
    assert_eq!(
        m.board().unwrap().remaining_seconds(&clock),
        210,
        "pausado não conta"
    );

    let m = m.toggle_clock(&clock); // retoma
    clock.advance_secs(30);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 180); // 3:00 exato
}

// ---------------------------------------------------------------------------
// C5
// ---------------------------------------------------------------------------

#[test]
fn c5_ajuste_de_dez_segundos_reancora() {
    use placar_core::ManualClock;

    let clock = ManualClock::new(0);
    let m = board_5min();

    // Parado: +10 e −10.
    let m = m.adjust_clock(ClockAdjust::Plus10, &clock);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 310); // 5:10
    let m = m.adjust_clock(ClockAdjust::Minus10, &clock);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 300); // 5:00

    // Rodando: inicia, avança 20 s, +10 (reancora, sem salto).
    let m = m.toggle_clock(&clock);
    clock.advance_secs(20);
    let m = m.adjust_clock(ClockAdjust::Plus10, &clock);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 290); // 4:50

    // −10 rodando.
    let m = m.adjust_clock(ClockAdjust::Minus10, &clock);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 280); // 4:40

    // Sem salto: 30 s depois, contagem contínua.
    clock.advance_secs(30);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 250); // 4:10

    // −10 com menos de 10 s restantes: para em 0, nunca negativo.
    let clock2 = ManualClock::new(0);
    let m2 = Match::new()
        .start("Branco", "Azul", 1.0)
        .unwrap()
        .toggle_clock(&clock2);
    clock2.advance_secs(54); // restam 6
    assert_eq!(m2.board().unwrap().remaining_seconds(&clock2), 6);
    let m2 = m2.adjust_clock(ClockAdjust::Minus10, &clock2);
    assert_eq!(m2.board().unwrap().remaining_seconds(&clock2), 0);
}

// ---------------------------------------------------------------------------
// C6
// ---------------------------------------------------------------------------

#[test]
fn c6_expiracao_pausa_e_bipa_uma_vez() {
    use placar_core::ManualClock;

    let clock = ManualClock::new(0);
    let mut m = Match::new()
        .start("Branco", "Azul", 1.0)
        .unwrap()
        .toggle_clock(&clock); // 60 s, rodando

    // Faltam 31 s: sinal desligado.
    clock.advance_secs(29);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 31);
    assert!(!m.board().unwrap().is_last_seconds(&clock));

    // Faltam 30 s: sinal ligado.
    clock.advance_secs(1);
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 30);
    assert!(m.board().unwrap().is_last_seconds(&clock));

    // Zera: o tick que cruza o zero bipa, pausa e marca expiração.
    clock.advance_secs(30);
    let mut beeps = 0;
    let tick = m.tick(&clock);
    if tick.beep {
        beeps += 1;
    }
    m = tick.state;
    assert!(m.board().unwrap().is_expired(), "expiração marcada");
    assert!(!m.board().unwrap().is_running(), "pausa sozinha ao zerar");
    assert_eq!(m.board().unwrap().remaining_seconds(&clock), 0);

    // Vários ticks depois de zerar: o beep não soa de novo.
    for _ in 0..5 {
        clock.advance_secs(10);
        let tick = m.tick(&clock);
        if tick.beep {
            beeps += 1;
        }
        m = tick.state;
        assert!(!m.board().unwrap().is_running());
        assert_eq!(m.board().unwrap().remaining_seconds(&clock), 0);
    }

    assert_eq!(beeps, 1, "beep exatamente uma vez em N consultas");
}

// ---------------------------------------------------------------------------
// C7
// ---------------------------------------------------------------------------

#[test]
fn c7_encerrar_por_pontos_desempate() {
    // Pontos diferentes: mais pontos vence.
    let m = board_5min().mark(Side::White, ScoreKind::Point2, Delta::Add);
    let ended = m.end_bout(EndMethod::Points, None, None).unwrap();
    assert_eq!(ended.ended().unwrap().winner, Some(Side::White));

    // Pontos iguais, vantagens diferentes: mais vantagens vence.
    let m = board_5min()
        .mark(Side::White, ScoreKind::Point2, Delta::Add)
        .mark(Side::Blue, ScoreKind::Point2, Delta::Add)
        .mark(Side::Blue, ScoreKind::Advantage, Delta::Add);
    let ended = m.end_bout(EndMethod::Points, None, None).unwrap();
    assert_eq!(ended.ended().unwrap().winner, Some(Side::Blue));

    // Pontos e vantagens iguais, punições diferentes: MENOS punições vence.
    let m = board_5min()
        .mark(Side::White, ScoreKind::Point2, Delta::Add)
        .mark(Side::Blue, ScoreKind::Point2, Delta::Add)
        .mark(Side::Blue, ScoreKind::Penalty, Delta::Add); // azul com mais punições
    let ended = m.end_bout(EndMethod::Points, None, None).unwrap();
    assert_eq!(
        ended.ended().unwrap().winner,
        Some(Side::White),
        "branco vence por menos punições"
    );

    // Empate total: erro e a luta continua no board.
    let m = board_5min();
    let err = m.end_bout(EndMethod::Points, None, None);
    assert_eq!(err, Err(placar_core::EndError::Tie));
    // A luta original não mudou: continua no board, não encerrada.
    assert!(m.board().is_some());
    assert!(m.ended().is_none());
}

// ---------------------------------------------------------------------------
// C8
// ---------------------------------------------------------------------------

#[test]
fn c8_encerrar_por_outros_metodos() {
    // O vencedor é o informado pelo operador.
    let by_decision = board_5min()
        .end_bout(EndMethod::Decision, Some(Side::Blue), None)
        .unwrap();
    assert_eq!(by_decision.ended().unwrap().winner, Some(Side::Blue));
    assert_eq!(by_decision.ended().unwrap().method, EndMethod::Decision);

    let by_dq = board_5min()
        .end_bout(EndMethod::Dq, Some(Side::White), None)
        .unwrap();
    assert_eq!(by_dq.ended().unwrap().winner, Some(Side::White));

    let by_wo = board_5min()
        .end_bout(EndMethod::Wo, Some(Side::Blue), None)
        .unwrap();
    assert_eq!(by_wo.ended().unwrap().winner, Some(Side::Blue));

    // submission exige texto útil.
    let m = board_5min();
    assert_eq!(
        m.end_bout(EndMethod::Submission, Some(Side::White), None),
        Err(placar_core::EndError::EmptySubmission)
    );
    assert_eq!(
        m.end_bout(EndMethod::Submission, Some(Side::White), Some("")),
        Err(placar_core::EndError::EmptySubmission)
    );
    assert_eq!(
        m.end_bout(EndMethod::Submission, Some(Side::White), Some("   ")),
        Err(placar_core::EndError::EmptySubmission)
    );

    let by_sub = m
        .end_bout(EndMethod::Submission, Some(Side::White), Some("armlock"))
        .unwrap();
    let ended = by_sub.ended().unwrap();
    assert_eq!(ended.winner, Some(Side::White));
    assert_eq!(ended.submission.as_deref(), Some("armlock"));
}

// ---------------------------------------------------------------------------
// C9
// ---------------------------------------------------------------------------

#[test]
fn c9_atalho_de_espaco() {
    use placar_core::{is_clock_shortcut, ElementTag, FocusTarget, KeyPress};

    let space = |target: FocusTarget| is_clock_shortcut(&KeyPress::space(target));

    // Dispara no body e no button.
    assert!(space(FocusTarget::tag(ElementTag::Body)));
    assert!(space(FocusTarget::tag(ElementTag::Button)));

    // Não dispara em campo de texto.
    assert!(!space(FocusTarget::tag(ElementTag::Input)));
    assert!(!space(FocusTarget::tag(ElementTag::Textarea)));
    assert!(!space(FocusTarget::tag(ElementTag::Select)));

    // Não dispara em contenteditable.
    assert!(!space(FocusTarget {
        tag: ElementTag::Other,
        content_editable: true,
        within_dialog: false,
    }));

    // Não dispara dentro de um [role=dialog], mesmo com foco num botão.
    assert!(!space(FocusTarget {
        tag: ElementTag::Button,
        content_editable: false,
        within_dialog: true,
    }));
}

// ---------------------------------------------------------------------------
// C10
// ---------------------------------------------------------------------------

#[test]
fn c10_cancelar_nova_luta_e_fora_do_board() {
    use placar_core::ManualClock;

    let clock = ManualClock::new(0);

    // Cancelar no board volta ao Setup.
    let m = board_5min().mark(Side::White, ScoreKind::Point4, Delta::Add);
    let cancelled = m.cancel();
    assert!(cancelled.is_setup());
    // Uma luta nova nasce zerada.
    let fresh = cancelled.start("Branco", "Azul", 5.0).unwrap();
    assert_eq!(fresh.board().unwrap().score(Side::White).points, 0);

    // Nova luta depois de encerrar volta ao Setup.
    let ended = board_5min()
        .end_bout(EndMethod::Decision, Some(Side::White), None)
        .unwrap();
    assert!(ended.new_bout().is_setup());

    // Fora do board, os controles não mudam o estado. `Match::default()` é o
    // mesmo que `Match::new()` (Setup).
    let setup = Match::default();
    assert_eq!(setup, Match::new());
    assert!(setup.board().is_none());
    assert!(setup.ended().is_none());
    assert_eq!(
        setup.mark(Side::White, ScoreKind::Point2, Delta::Add),
        setup
    );
    assert_eq!(setup.toggle_clock(&clock), setup);
    assert_eq!(setup.adjust_clock(ClockAdjust::Plus10, &clock), setup);
    let tick = setup.tick(&clock);
    assert_eq!(tick.state, setup);
    assert!(!tick.beep);
    assert_eq!(
        setup.end_bout(EndMethod::Points, None, None),
        Ok(setup.clone())
    );
    assert_eq!(setup.cancel(), setup);
    assert_eq!(setup.new_bout(), setup);

    // `start` só transiciona a partir do Setup: no board ou no encerramento é
    // no-op, sem descartar a luta em curso (avulso.tsx:521-531).
    assert_eq!(m.start("Outro", "Outro2", 3.0), Ok(m.clone()));

    // Idem no encerramento: os controles e o cancelar são no-op.
    assert!(ended.board().is_none());
    assert_eq!(ended.start("Outro", "Outro2", 3.0), Ok(ended.clone()));
    assert_eq!(
        ended.mark(Side::White, ScoreKind::Point2, Delta::Add),
        ended
    );
    assert_eq!(ended.toggle_clock(&clock), ended);
    assert_eq!(ended.adjust_clock(ClockAdjust::Plus10, &clock), ended);
    assert_eq!(ended.tick(&clock).state, ended);
    assert_eq!(ended.cancel(), ended);
    assert_eq!(
        ended.end_bout(EndMethod::Points, None, None),
        Ok(ended.clone())
    );
}
