//! Domínio puro do placar de Jiu-Jitsu Brasileiro.
//!
//! Este crate não depende de Tauri nem de nenhuma forma de I/O. As regras de
//! placar, cronômetro e estado da luta são implementadas na tarefa
//! `placar-core` (onda 2); aqui o crate existe apenas para provar que o
//! workspace compila e que a suíte de testes roda.

#[cfg(test)]
mod tests {
    #[test]
    fn crate_compila_e_testes_rodam() {
        assert_eq!(1 + 1, 2);
    }
}
