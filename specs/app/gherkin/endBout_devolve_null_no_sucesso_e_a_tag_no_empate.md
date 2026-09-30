# endBout_devolve_null_no_sucesso_e_a_tag_no_empate

```gherkin
Funcionalidade: Hook do placar
  Cenário: endBout devolve null no sucesso e a tag no empate
    Dado o hook montado no board
    Quando endBout encerra por decisão com sucesso
    Então devolve null
    Quando o cliente responde empate e endBout tenta por pontos
    Então devolve a tag "tie"
```
