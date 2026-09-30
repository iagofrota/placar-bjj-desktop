# C4 — Cronômetro conta só quando está rodando

Oráculo: `avulso.tsx:52-85` (relógio local), `264-286` (`toggleClock`). Tempo
pausado não conta; iniciar e pausar é um único toggle. `Clock` injetável, sem
relógio real nem `sleep`.

```gherkin
Funcionalidade: Cronômetro wall-clock
  Cenário: 90 s correndo, 60 s pausado, 30 s correndo, numa luta de 5 min
    Dado uma luta de 5 min no board, com relógio falso
    Quando inicio o cronômetro e avanço 90 s
    Então restam 3:30
    Quando pauso e avanço 60 s
    Então continuam 3:30 (pausado não conta)
    Quando retomo e avanço 30 s
    Então restam exatamente 3:00
```
