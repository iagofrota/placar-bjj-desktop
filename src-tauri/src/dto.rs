//! Tradução dos argumentos que a UI manda por IPC para os tipos do domínio.
//!
//! São só marshalling de dados de fronteira — nenhuma regra. Ficam aqui, e não
//! em `lib.rs`, para serem testados (a cola do Tauri em `lib.rs` não é).

use placar_core::{ClockAdjust, Delta, EndMethod, ScoreKind, Side};
use serde::Deserialize;

/// Lado da luta, como a UI o nomeia.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SideDto {
    White,
    Blue,
}

impl From<SideDto> for Side {
    fn from(value: SideDto) -> Self {
        match value {
            SideDto::White => Side::White,
            SideDto::Blue => Side::Blue,
        }
    }
}

/// Controle de placar acionado.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ScoreKindDto {
    Point2,
    Point3,
    Point4,
    Advantage,
    Penalty,
}

impl From<ScoreKindDto> for ScoreKind {
    fn from(value: ScoreKindDto) -> Self {
        match value {
            ScoreKindDto::Point2 => ScoreKind::Point2,
            ScoreKindDto::Point3 => ScoreKind::Point3,
            ScoreKindDto::Point4 => ScoreKind::Point4,
            ScoreKindDto::Advantage => ScoreKind::Advantage,
            ScoreKindDto::Penalty => ScoreKind::Penalty,
        }
    }
}

/// Marcar (+) ou corrigir (−).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum DeltaDto {
    Add,
    Remove,
}

impl From<DeltaDto> for Delta {
    fn from(value: DeltaDto) -> Self {
        match value {
            DeltaDto::Add => Delta::Add,
            DeltaDto::Remove => Delta::Remove,
        }
    }
}

/// Ajuste do cronômetro em ±10 s.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum AdjustDto {
    Plus10,
    Minus10,
}

impl From<AdjustDto> for ClockAdjust {
    fn from(value: AdjustDto) -> Self {
        match value {
            AdjustDto::Plus10 => ClockAdjust::Plus10,
            AdjustDto::Minus10 => ClockAdjust::Minus10,
        }
    }
}

/// Método de encerramento escolhido no diálogo.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MethodDto {
    Points,
    Submission,
    Decision,
    Dq,
    Wo,
}

impl From<MethodDto> for EndMethod {
    fn from(value: MethodDto) -> Self {
        match value {
            MethodDto::Points => EndMethod::Points,
            MethodDto::Submission => EndMethod::Submission,
            MethodDto::Decision => EndMethod::Decision,
            MethodDto::Dq => EndMethod::Dq,
            MethodDto::Wo => EndMethod::Wo,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn side_desserializa_de_snake_case() {
        assert_eq!(
            serde_json::from_str::<SideDto>("\"white\"").unwrap(),
            SideDto::White
        );
        assert_eq!(
            serde_json::from_str::<SideDto>("\"blue\"").unwrap(),
            SideDto::Blue
        );
        assert_eq!(Side::from(SideDto::Blue), Side::Blue);
    }

    #[test]
    fn score_kind_desserializa_os_cinco_controles() {
        for (raw, expected) in [
            ("\"point2\"", ScoreKindDto::Point2),
            ("\"point3\"", ScoreKindDto::Point3),
            ("\"point4\"", ScoreKindDto::Point4),
            ("\"advantage\"", ScoreKindDto::Advantage),
            ("\"penalty\"", ScoreKindDto::Penalty),
        ] {
            assert_eq!(serde_json::from_str::<ScoreKindDto>(raw).unwrap(), expected);
        }
        assert_eq!(ScoreKind::from(ScoreKindDto::Point4), ScoreKind::Point4);
    }

    #[test]
    fn delta_e_ajuste_e_metodo_convertem() {
        assert_eq!(Delta::from(DeltaDto::Remove), Delta::Remove);
        assert_eq!(ClockAdjust::from(AdjustDto::Minus10), ClockAdjust::Minus10);
        assert_eq!(EndMethod::from(MethodDto::Wo), EndMethod::Wo);
        assert_eq!(
            serde_json::from_str::<AdjustDto>("\"plus10\"").unwrap(),
            AdjustDto::Plus10
        );
        assert_eq!(
            serde_json::from_str::<MethodDto>("\"submission\"").unwrap(),
            MethodDto::Submission
        );
    }

    #[test]
    fn valor_desconhecido_e_recusado() {
        assert!(serde_json::from_str::<SideDto>("\"green\"").is_err());
        assert!(serde_json::from_str::<MethodDto>("\"tap\"").is_err());
    }
}
