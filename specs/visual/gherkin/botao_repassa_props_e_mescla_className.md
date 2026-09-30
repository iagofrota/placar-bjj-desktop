# botao_repassa_props_e_mescla_className

Teste: `frontend/src/components/ui/button.test.tsx`

```gherkin
Funcionalidade: Botão base
  Como operador de mesa
  Eu quero botões grandes e coloridos pelos tokens
  Para acertar o toque na mesa

  Cenário: O botão repassa props e mescla className
    Dado type submit, disabled e className w-full
    Quando renderizo
    Então os atributos chegam ao elemento e a classe extra é mantida
```
