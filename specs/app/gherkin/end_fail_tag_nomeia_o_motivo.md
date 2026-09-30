# end_fail_tag_nomeia_o_motivo

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: a tag de falha de encerramento nomeia o motivo
    Dado os motivos de falha de encerramento
    Quando se lê a tag de Tie e de EmptySubmission
    Então são "tie" e "empty_submission" respectivamente
```
