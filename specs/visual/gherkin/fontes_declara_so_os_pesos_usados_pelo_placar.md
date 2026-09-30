# fontes_declara_so_os_pesos_usados_pelo_placar

Teste: `frontend/src/styles/fonts.test.ts`

```gherkin
Funcionalidade: Fontes embutidas
  Como operador de mesa
  Eu quero as quatro famílias tipográficas dentro do app
  Para que o placar tenha a mesma cara sem depender de rede

  Cenário: fonts.css declara só os pesos usados
    Dado frontend/src/styles/fonts.css
    Quando leio os @font-face
    Então há Bebas Neue 400, JetBrains Mono 400/500/700, Inter 400/500/600 e Cormorant Garamond 500 itálico, e nada além
```
