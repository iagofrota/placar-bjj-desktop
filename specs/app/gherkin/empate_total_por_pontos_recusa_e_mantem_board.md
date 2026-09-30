# empate_total_por_pontos_recusa_e_mantem_board

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: empate total por pontos é recusado e mantém o board
    Dado uma sessão iniciada com os dois lados zerados (empate total)
    Quando se tenta encerrar por pontos
    Então devolve Err(Tie)
    E o estágio continua em Board
```
