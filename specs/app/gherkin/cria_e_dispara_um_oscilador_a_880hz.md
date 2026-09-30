# cria_e_dispara_um_oscilador_a_880hz

```gherkin
Funcionalidade: Beep da expiração
  Cenário: o beep cria e dispara um oscilador a 880 Hz
    Dado um AudioContext falso instalado
    Quando beep() é chamado
    Então um oscilador é criado a 880 Hz, iniciado uma vez e parado uma vez
    E ao fim da nota o contexto de áudio é fechado
```
