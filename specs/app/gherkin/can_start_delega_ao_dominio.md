# can_start_delega_ao_dominio

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: can_start delega ao domínio a validação do setup
    Dado a sessão e um par de nomes com uma duração
    Quando os nomes não são vazios e a duração é "5"
    Então can_start devolve verdadeiro
    Quando o nome branco é só espaço, ou a duração é "2.5", "0", "21" ou ""
    Então can_start devolve falso em cada caso
```
