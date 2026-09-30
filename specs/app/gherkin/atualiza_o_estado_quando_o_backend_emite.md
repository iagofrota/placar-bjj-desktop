# atualiza_o_estado_quando_o_backend_emite

```gherkin
Funcionalidade: Hook do placar
  Cenário: o hook atualiza o estado quando o backend emite
    Dado o hook montado com um estado inicial
    Quando o backend emite um estado de board
    Então o estado do hook passa a "board"
```
