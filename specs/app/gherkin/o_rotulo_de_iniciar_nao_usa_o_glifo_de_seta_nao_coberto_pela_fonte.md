# o_rotulo_de_iniciar_nao_usa_o_glifo_de_seta_nao_coberto_pela_fonte

```gherkin
Funcionalidade: Tela de setup
  Cenário: o rótulo de iniciar não usa o glifo de seta não coberto pela fonte
    Dado a tela de setup renderizada
    Quando se lê todo o texto exibido
    Então não contém o glifo "→" (U+2192), ausente das fontes embutidas
```
