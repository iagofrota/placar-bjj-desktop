# app_renderiza_titulo_placar_bjj

Teste: `frontend/src/__tests__/App.test.tsx`

```gherkin
Funcionalidade: Tela inicial do app
  Como pessoa que abre o Placar BJJ Desktop
  Eu quero ver que a janela carregou o frontend React
  Para saber que o app não está numa tela em branco

  Cenário: App renderiza o título Placar BJJ
    Dado que o componente App é montado
    Quando a árvore é renderizada
    Então existe um título (heading) com o texto "Placar BJJ"
```
