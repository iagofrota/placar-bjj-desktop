# setup_serializa_como_setup_sem_ramos

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: o setup serializa como Setup, sem os ramos de board e encerramento
    Dado uma partida recém-criada (ainda no setup)
    Quando é convertida em StateView
    Então o estágio é Setup e os campos board e ended ficam ausentes
```
