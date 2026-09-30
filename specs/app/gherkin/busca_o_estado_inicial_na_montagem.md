# busca_o_estado_inicial_na_montagem

```gherkin
Funcionalidade: Hook do placar
  Cenário: o hook busca o estado inicial na montagem
    Dado o hook useScoreboard com o cliente no setup
    Quando é montado
    Então o estado inicial vira o de setup e getState foi chamado
```
