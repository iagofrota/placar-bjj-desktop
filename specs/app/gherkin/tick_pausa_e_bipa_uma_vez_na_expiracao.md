# tick_pausa_e_bipa_uma_vez_na_expiracao

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: o tick pausa e bipa uma única vez na expiração
    Dado uma sessão de 1 minuto com o relógio rodando (relógio controlado, sem sleep)
    Quando o relógio avança 60 s e um tick cruza o zero
    Então o tick sinaliza beep, restam 0 s e o relógio auto-pausa
    Quando o relógio avança mais 10 s e ocorre novo tick
    Então não bipa de novo
```
