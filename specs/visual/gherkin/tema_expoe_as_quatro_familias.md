# tema_expoe_as_quatro_familias

Teste: `frontend/src/styles/fonts.test.ts`

```gherkin
Funcionalidade: Fontes embutidas
  Como operador de mesa
  Eu quero as quatro famílias tipográficas dentro do app
  Para que o placar tenha a mesma cara sem depender de rede

  Cenário: O tema expõe as quatro famílias
    Dado arena.css
    Quando leio o @theme
    Então as quatro famílias estão declaradas como font-display, font-mono, font-sans e font-accent
```
