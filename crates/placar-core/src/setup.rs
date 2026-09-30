//! Validação do Setup: nomes não vazios após `trim` e duração inteira de 1 a 20.
//!
//! Oráculo: `avulso.tsx:96-104` (`validDuration`) e `166-171` (`disabled`
//! do botão + `whiteName.trim()`/`blueName.trim()`).

/// Menor duração de luta, em minutos.
pub const MIN_DURATION_MINUTES: f64 = 1.0;
/// Maior duração de luta, em minutos.
pub const MAX_DURATION_MINUTES: f64 = 20.0;

/// A luta pode começar com estes nomes e esta duração?
///
/// Aceita quando ambos os nomes têm conteúdo após `trim` e a duração é um
/// inteiro de 1 a 20. A duração é `f64` de propósito, para recusar valores
/// fracionários como 2.5 (`Number.isInteger` em `avulso.tsx:102`).
#[must_use]
pub fn can_start(white_name: &str, blue_name: &str, duration_minutes: f64) -> bool {
    !white_name.trim().is_empty()
        && !blue_name.trim().is_empty()
        && is_valid_duration(duration_minutes)
}

/// A duração é um inteiro finito dentro de [1, 20]?
fn is_valid_duration(duration_minutes: f64) -> bool {
    duration_minutes.is_finite()
        && duration_minutes.fract() == 0.0
        && (MIN_DURATION_MINUTES..=MAX_DURATION_MINUTES).contains(&duration_minutes)
}
