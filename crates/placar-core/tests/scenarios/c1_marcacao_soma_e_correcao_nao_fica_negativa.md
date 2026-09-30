# C1 — Marcação por lado e correção sem ficar negativo

Oráculo: `avulso.tsx:308-349` (função `mark`), clamp em `323`, `333`, `342-345`.

```gherkin
Funcionalidade: Marcação de pontos, vantagens e punições por lado
  O placar soma exatamente o valor do controle, só no lado marcado, e nenhum
  contador fica negativo. Cada operação devolve um estado novo.

  Cenário: somar cada tipo em cada lado e corrigir abaixo de zero
    Dado uma luta no board com placar zerado
    Quando marco +2, +3, +4, vantagem e punição no branco
    Então o branco tem 9 pontos, 1 vantagem e 1 punição
    E o azul continua zerado
    Quando marco +2, +3, +4, vantagem e punição no azul
    Então o azul tem 9 pontos, 1 vantagem e 1 punição
    E o branco não muda
    Quando aplico correções (−) além do que cada contador tem
    Então nenhum contador fica negativo (para em 0)
    E o estado anterior a cada operação continua intacto
```
