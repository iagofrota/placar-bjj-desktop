# urgente_so_com_relogio_rodando_nos_ultimos_30s

```gherkin
Funcionalidade: Retrato de estado (view.rs)
  Cenário: a urgência liga só com o relógio rodando nos últimos 30 s
    Dado uma partida com o relógio rodando e o tempo já nos últimos 30 s
    Quando o estado é retratado
    Então clock_urgent é verdadeiro
    Quando o mesmo relógio é pausado nos últimos 30 s
    Então clock_urgent é falso (parado não é urgente)
```
