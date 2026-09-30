# marcar_no_lado_branco_despacha_mark_white

```gherkin
Funcionalidade: Tela do board
  Cenário: marcar no lado branco despacha o mark do branco
    Dado o board renderizado com ações espiãs
    Quando se clica em "+2 Queda / raspagem" do primeiro lado (branco)
    Então mark é chamado com ("white", "point2", "add")
    Quando se clica em "Corrigir vantagem" do segundo lado (azul)
    Então mark é chamado com ("blue", "advantage", "remove")
```
