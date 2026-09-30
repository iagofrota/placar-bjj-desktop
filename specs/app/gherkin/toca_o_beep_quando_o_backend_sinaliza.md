# toca_o_beep_quando_o_backend_sinaliza

```gherkin
Funcionalidade: Hook do placar
  Cenário: o hook toca o beep quando o backend sinaliza
    Dado o hook montado (beep mockado)
    Quando o backend emite o evento de beep
    Então beep é chamado uma vez
```
