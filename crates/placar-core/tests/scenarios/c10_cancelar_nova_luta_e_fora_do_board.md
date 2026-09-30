# C10 — Cancelar, nova luta e no-op fora do board

Oráculo: `avulso.tsx:303-306` (`cancelBout`), `428-435` ("Nova luta"),
`490-540` (o Setup remonta o board zerado).

```gherkin
Funcionalidade: Voltar ao Setup e ignorar controles fora do board
  Cenário: cancelar no board volta ao Setup
    Dado uma luta no board com placar marcado
    Quando cancelo
    Então volto ao Setup, e uma luta nova nasce zerada
  Cenário: nova luta depois de encerrar volta ao Setup
    Dado uma luta encerrada
    Quando começo uma luta nova
    Então volto ao Setup
  Cenário: marcar e mexer no relógio fora do board não muda nada
    Dado uma luta no Setup
    Então marcar, dar toggle, ajustar e tick não mudam o estado
    Dado uma luta encerrada
    Então marcar, dar toggle, ajustar e tick não mudam o estado
```
