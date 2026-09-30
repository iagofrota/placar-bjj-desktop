//! Relógio injetável. O domínio nunca lê o relógio do sistema: quem fornece o
//! tempo é um `Clock`, para que os testes sejam determinísticos, sem tocar o
//! relógio de parede do SO. A fonte de tempo real vive na camada do app
//! (onda 3), fora deste crate.

use core::cell::Cell;

/// Fonte de tempo de parede em milissegundos. Espelha o `Date.now()` que o
/// `avulso.tsx` usa via `startedAt`.
pub trait Clock {
    /// Instante atual, em milissegundos desde uma época arbitrária mas
    /// monotônica dentro de uma luta.
    fn now_ms(&self) -> i64;
}

/// Relógio de teste, avançado à mão. Não faz I/O nem lê o relógio do SO — só
/// guarda um instante que o teste controla.
#[derive(Debug)]
pub struct ManualClock {
    now_ms: Cell<i64>,
}

impl ManualClock {
    /// Cria um relógio parado em `start_ms`.
    #[must_use]
    pub fn new(start_ms: i64) -> Self {
        Self {
            now_ms: Cell::new(start_ms),
        }
    }

    /// Avança `seconds` segundos.
    pub fn advance_secs(&self, seconds: i64) {
        self.now_ms.set(self.now_ms.get() + seconds * 1000);
    }
}

impl Clock for ManualClock {
    fn now_ms(&self) -> i64 {
        self.now_ms.get()
    }
}

/// Ajuste do cronômetro pelos controles de ±10 s (`avulso.tsx:294`,
/// `delta: -10 | 10`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ClockAdjust {
    Plus10,
    Minus10,
}

impl ClockAdjust {
    /// O delta em segundos.
    #[must_use]
    pub fn seconds(self) -> i64 {
        match self {
            ClockAdjust::Plus10 => 10,
            ClockAdjust::Minus10 => -10,
        }
    }
}
