# botao_todo_tamanho_tem_no_minimo_44px

Teste: `frontend/src/components/ui/button.test.tsx`

```gherkin
Funcionalidade: Botão base
  Como operador de mesa
  Eu quero botões grandes e coloridos pelos tokens
  Para acertar o toque na mesa

  Cenário: Todo tamanho tem 44 px ou mais
    Dado os tamanhos compact, default e mesa
    Quando leio a altura de cada um
    Então nenhuma é menor que 44 px
```
