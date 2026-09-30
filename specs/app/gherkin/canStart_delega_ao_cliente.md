# canStart_delega_ao_cliente

```gherkin
Funcionalidade: Hook do placar
  Cenário: canStart delega ao cliente
    Dado o hook montado e o cliente respondendo falso a canStart
    Quando se chama canStart com o nome branco vazio
    Então resolve como falso (o veredito vem do cliente/backend)
```
