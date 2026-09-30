# dialogo_aberto_torna_o_board_inert_barrando_foco_atras

```gherkin
Funcionalidade: Tela do board
  Cenário: diálogo aberto torna o board inert barrando foco atrás
    Dado o board com um estado emitido
    Quando o diálogo de encerrar é aberto
    Então o board recebe o atributo inert (Tab/Espaço/Enter não alcançam controles de trás)
    E fechar o diálogo devolve a interação ao board
```
