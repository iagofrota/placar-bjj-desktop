# parse_duration_recusa_vazio_e_texto

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: parse_duration recusa vazio e texto e aceita número com espaços
    Dado a função parse_duration da sessão
    Quando recebe "" e "abc"
    Então devolve NaN (entrada não numérica)
    Quando recebe "5", " 7 " e "2.5"
    Então devolve 5.0, 7.0 (após trim) e 2.5
```
