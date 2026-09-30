# estilos_nao_referenciam_rede

Teste: `frontend/src/styles/fonts.test.ts`

```gherkin
Funcionalidade: Fontes embutidas
  Como operador de mesa
  Eu quero as quatro famílias tipográficas dentro do app
  Para que o placar tenha a mesma cara sem depender de rede

  Cenário: Os estilos não referenciam rede
    Dado fonts.css e arena.css
    Quando procuro http:// ou https://
    Então não há ocorrência
```
