# C9 — Predicado do atalho de Espaço

Oráculo: `lib/clock-shortcut.ts:1-25` (`isClockShortcut`). Dispara só fora de
campo de texto e de modal — mesmo com foco num botão.

```gherkin
Funcionalidade: Atalho de Espaço do relógio
  Cenário: os sete focos do critério
    Então Espaço com foco no body dispara
    E Espaço com foco num button dispara
    E Espaço com foco num input não dispara
    E Espaço com foco num textarea não dispara
    E Espaço com foco num select não dispara
    E Espaço com foco num contenteditable não dispara
    E Espaço dentro de um [role=dialog] não dispara
```
