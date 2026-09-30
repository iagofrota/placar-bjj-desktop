# relogio_nos_ultimos_30s_rodando_ganha_o_realce_de_alerta

```gherkin
Funcionalidade: Tela do board
  Cenário: o relógio nos últimos 30 s rodando ganha o realce de alerta
    Dado o board com o relógio rodando, urgente, em "00:20"
    Quando é renderizado
    Então o relógio tem data-urgent "true" e a classe text-score-penalty
```
