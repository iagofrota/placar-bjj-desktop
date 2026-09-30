# encerramento_por_pontos_traz_vencedor_e_nome

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: o encerramento por pontos traz vencedor e nome
    Dado uma partida em que o branco fez 2 pontos
    Quando é encerrada por pontos
    Então o método é "points", o vencedor é "white" (Ana), o placar é 2 a 0 e não há finalização
```
