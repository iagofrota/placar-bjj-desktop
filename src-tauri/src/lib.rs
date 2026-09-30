//! Cola do Tauri: estado gerenciado, comandos IPC e o tick do relógio.
//!
//! Aqui não mora regra nenhuma — cada comando destranca o mutex e delega para
//! [`scoreboard::Session`], que é testado. Por isso este arquivo (e `main.rs`)
//! fica de fora da cobertura, como `docs/qa/cobertura.md` registra: ele só existe
//! com um webview e um runtime Tauri de verdade, exercitado pelo e2e.

mod dto;
mod scoreboard;
mod view;

use std::sync::Mutex;
use std::thread;
use std::time::Duration;

use tauri::{AppHandle, Emitter, Manager, State};

use dto::{AdjustDto, DeltaDto, MethodDto, ScoreKindDto, SideDto};
use scoreboard::{Session, SystemClock};
use view::StateView;

/// Evento com o retrato do estado, a cada mutação e a cada tick rodando.
const STATE_EVENT: &str = "scoreboard://state";
/// Evento de beep, emitido uma única vez na expiração.
const BEEP_EVENT: &str = "scoreboard://beep";
/// Período do tick do relógio, em milissegundos (análogo ao interval de 250 ms
/// da plataforma).
const TICK_MS: u64 = 250;

/// Estado gerenciado: a sessão de placar e o relógio de parede real.
struct AppState {
    session: Mutex<Session>,
    clock: SystemClock,
}

impl AppState {
    fn new() -> Self {
        Self {
            session: Mutex::new(Session::new()),
            clock: SystemClock::new(),
        }
    }
}

fn emit_state(app: &AppHandle, view: &StateView) {
    let _ = app.emit(STATE_EVENT, view);
}

#[tauri::command]
fn get_state(state: State<'_, AppState>) -> StateView {
    state.session.lock().unwrap().view(&state.clock)
}

#[tauri::command]
fn can_start(white: String, blue: String, duration: String) -> bool {
    Session::can_start(&white, &blue, &duration)
}

#[tauri::command]
fn start(
    app: AppHandle,
    state: State<'_, AppState>,
    white: String,
    blue: String,
    duration: String,
) -> Result<StateView, String> {
    let view = state
        .session
        .lock()
        .unwrap()
        .start(&white, &blue, &duration, &state.clock)
        .map_err(|_| "invalid_setup".to_string())?;
    emit_state(&app, &view);
    Ok(view)
}

#[tauri::command]
fn mark(
    app: AppHandle,
    state: State<'_, AppState>,
    side: SideDto,
    kind: ScoreKindDto,
    delta: DeltaDto,
) -> StateView {
    let view =
        state
            .session
            .lock()
            .unwrap()
            .mark(side.into(), kind.into(), delta.into(), &state.clock);
    emit_state(&app, &view);
    view
}

#[tauri::command]
fn toggle_clock(app: AppHandle, state: State<'_, AppState>) -> StateView {
    let view = state.session.lock().unwrap().toggle_clock(&state.clock);
    emit_state(&app, &view);
    view
}

#[tauri::command]
fn adjust_clock(app: AppHandle, state: State<'_, AppState>, adjust: AdjustDto) -> StateView {
    let view = state
        .session
        .lock()
        .unwrap()
        .adjust_clock(adjust.into(), &state.clock);
    emit_state(&app, &view);
    view
}

#[tauri::command]
fn end_bout(
    app: AppHandle,
    state: State<'_, AppState>,
    method: MethodDto,
    winner: Option<SideDto>,
    submission: Option<String>,
) -> Result<StateView, String> {
    let result = state.session.lock().unwrap().end_bout(
        method.into(),
        winner.map(Into::into),
        submission.as_deref(),
        &state.clock,
    );
    match result {
        Ok(view) => {
            emit_state(&app, &view);
            Ok(view)
        }
        Err(fail) => Err(fail.tag().to_string()),
    }
}

#[tauri::command]
fn cancel(app: AppHandle, state: State<'_, AppState>) -> StateView {
    let view = state.session.lock().unwrap().cancel(&state.clock);
    emit_state(&app, &view);
    view
}

#[tauri::command]
fn new_bout(app: AppHandle, state: State<'_, AppState>) -> StateView {
    let view = state.session.lock().unwrap().new_bout(&state.clock);
    emit_state(&app, &view);
    view
}

/// Reconcilia o relógio a cada 250 ms enquanto ele corre e emite o estado, para
/// a UI ver a contagem regressiva. Na expiração, o `Session` auto-pausa e
/// sinaliza o beep, emitido uma única vez.
fn spawn_clock_tick(app: AppHandle) {
    thread::spawn(move || loop {
        thread::sleep(Duration::from_millis(TICK_MS));
        let state = app.state::<AppState>();
        let mut session = state.session.lock().unwrap();
        if !session.is_running() {
            continue;
        }
        let (view, beep) = session.tick(&state.clock);
        drop(session);
        emit_state(&app, &view);
        if beep {
            let _ = app.emit(BEEP_EVENT, ());
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState::new())
        .setup(|app| {
            spawn_clock_tick(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_state,
            can_start,
            start,
            mark,
            toggle_clock,
            adjust_clock,
            end_bout,
            cancel,
            new_bout,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
