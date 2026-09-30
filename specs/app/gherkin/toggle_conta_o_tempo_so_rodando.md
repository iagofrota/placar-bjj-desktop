# toggle_conta_o_tempo_so_rodando

```gherkin
Funcionalidade: Sessão do placar (scoreboard.rs)
  Cenário: o toggle conta o tempo só com o relógio rodando
    Dado uma sessão iniciada com 5 minutos e o relógio parado
    Quando o relógio avança 10 s ainda parado
    Então restam 300 s (parado não conta)
    Quando o relógio é ligado pelo toggle e avança 10 s
    Então restam 290 s
    Quando é pausado e o relógio avança mais 100 s
    Então continua em 290 s (a pausa ancora o tempo)
```
