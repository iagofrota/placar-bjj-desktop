# botao_toda_variante_renderiza_com_52px_na_mesa_e_so_com_tokens

Teste: `frontend/src/components/ui/button.test.tsx`

```gherkin
Funcionalidade: Botão base
  Como operador de mesa
  Eu quero botões grandes e coloridos pelos tokens
  Para acertar o toque na mesa

  Cenário: Toda variante renderiza só com tokens
    Dado cada variante no tamanho mesa
    Quando renderizo o botão
    Então ele tem h-[52px] e nenhuma cor literal nem classe de cor fora dos tokens
```
