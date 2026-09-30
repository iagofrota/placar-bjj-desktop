# board_traz_nomes_placar_e_relogio_cheio_parado

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: o board traz nomes, placar e relógio cheio e parado
    Dado uma partida iniciada com "Ana" e "Bia" por 5 minutos
    Quando é convertida em StateView
    Então o estágio é Board com os nomes Ana e Bia
    E o relógio mostra 300 s ("05:00"), duração 300 s, parado, sem urgência e sem alerta de punição
```
