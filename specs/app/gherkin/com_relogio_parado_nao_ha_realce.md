# com_relogio_parado_nao_ha_realce

```gherkin
Funcionalidade: Tela do board
  Cenário: com o relógio parado não há realce
    Dado o board com clock_urgent falso
    Quando é renderizado
    Então o relógio tem data-urgent "false" e não usa a classe text-score-penalty
```
