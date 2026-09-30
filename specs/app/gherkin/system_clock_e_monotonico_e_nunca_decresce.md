# system_clock_e_monotonico_e_nunca_decresce

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: system clock é monotônico e nunca decresce
    Dado o SystemClock ancorado num Instant base
    Quando now_ms() é lido várias vezes seguidas
    Então cada leitura é maior ou igual à anterior (imune a ajuste do relógio do SO)
```
