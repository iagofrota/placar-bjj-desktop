# audio_indisponivel_nao_lanca

```gherkin
Funcionalidade: Beep da expiração
  Cenário: áudio indisponível não lança
    Dado que nem AudioContext nem webkitAudioContext existem
    Quando beep() é chamado
    Então não lança exceção
```
