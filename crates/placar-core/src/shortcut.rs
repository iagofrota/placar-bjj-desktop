//! Predicado puro do atalho de Espaço do relógio.
//!
//! Oráculo: `lib/clock-shortcut.ts:1-25` (`isClockShortcut`). O Espaço pertence
//! ao relógio, exceto em campo de texto (`input`, `textarea`, `select`,
//! `[contenteditable]`) ou dentro de um modal (`[role="dialog"]`) — mesmo com
//! foco num botão o atalho dispara. Aqui o DOM é modelado como dados: quem
//! chama (a onda 3) traduz o `event.target` para um `FocusTarget`.

/// A tag do elemento em foco, no que interessa ao seletor
/// `input, textarea, select` de `clock-shortcut.ts:6`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ElementTag {
    Body,
    Button,
    Input,
    Textarea,
    Select,
    /// Qualquer outra tag (div, span, …).
    Other,
}

/// O elemento em foco quando o Espaço foi pressionado. Reproduz o que o
/// `event.target.closest(SELECTOR)` de `clock-shortcut.ts:22` enxergaria:
/// além da própria tag, se o elemento é (ou está dentro de) um `contenteditable`
/// ativo ou de um `[role="dialog"]`.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FocusTarget {
    pub tag: ElementTag,
    /// O elemento, ou um ancestral, é `contenteditable` (e não
    /// `contenteditable="false"`).
    pub content_editable: bool,
    /// O elemento, ou um ancestral, tem `role="dialog"`.
    pub within_dialog: bool,
}

impl FocusTarget {
    /// Um foco só com a tag, sem `contenteditable` nem diálogo.
    #[must_use]
    pub fn tag(tag: ElementTag) -> Self {
        Self {
            tag,
            content_editable: false,
            within_dialog: false,
        }
    }

    /// O Espaço mantém o comportamento nativo do navegador aqui? (campo de
    /// texto ou modal — `clock-shortcut.ts:5-6`.)
    #[must_use]
    fn keeps_native_behavior(&self) -> bool {
        matches!(
            self.tag,
            ElementTag::Input | ElementTag::Textarea | ElementTag::Select
        ) || self.content_editable
            || self.within_dialog
    }
}

/// Um toque de tecla, no que o atalho precisa saber (`clock-shortcut.ts:15-24`).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct KeyPress {
    /// `event.code === 'Space'`.
    pub code_is_space: bool,
    pub alt: bool,
    pub ctrl: bool,
    pub meta: bool,
    pub target: FocusTarget,
}

impl KeyPress {
    /// Um toque de Espaço, sem modificadores, com foco em `target`.
    #[must_use]
    pub fn space(target: FocusTarget) -> Self {
        Self {
            code_is_space: true,
            alt: false,
            ctrl: false,
            meta: false,
            target,
        }
    }
}

/// Este toque deve alternar o relógio? Só o Espaço, sem Alt/Ctrl/Meta, fora de
/// campo de texto e de modal (`clock-shortcut.ts:15-24`).
#[must_use]
pub fn is_clock_shortcut(key: &KeyPress) -> bool {
    key.code_is_space && !key.alt && !key.ctrl && !key.meta && !key.target.keeps_native_behavior()
}
