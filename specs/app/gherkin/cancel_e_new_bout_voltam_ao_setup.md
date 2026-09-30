# cancel_e_new_bout_voltam_ao_setup

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: cancelar e nova luta voltam ao setup
    Dado uma sessão iniciada
    Quando é cancelada
    Então o estágio volta a Setup
    Quando outra luta é iniciada, encerrada por decisão e então "nova luta" é acionada
    Então o estágio volta a Setup
```
