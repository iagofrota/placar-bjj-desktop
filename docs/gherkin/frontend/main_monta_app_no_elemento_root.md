# main_monta_app_no_elemento_root

Teste: `frontend/src/__tests__/main.test.tsx`

```gherkin
Funcionalidade: Ponto de entrada do frontend
  Como pessoa que abre o Placar BJJ Desktop
  Eu quero que o React seja montado no elemento #root do index.html
  Para que a janela mostre o app em vez de ficar em branco

  Cenário: main monta o App no elemento root
    Dado que existe um elemento com id "root" no DOM
    Quando o módulo main é importado
    Então o React monta a árvore do App dentro desse elemento
    E existe um título (heading) com o texto "Placar BJJ"
```
