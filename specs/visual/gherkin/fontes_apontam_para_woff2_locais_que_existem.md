# fontes_apontam_para_woff2_locais_que_existem

Teste: `frontend/src/styles/fonts.test.ts`

```gherkin
Funcionalidade: Fontes embutidas
  Como operador de mesa
  Eu quero as quatro famílias tipográficas dentro do app
  Para que o placar tenha a mesma cara sem depender de rede

  Cenário: Cada @font-face aponta para um .woff2 local
    Dado os @font-face de fonts.css
    Quando confiro cada url()
    Então ela termina em .woff2 e o arquivo existe em frontend/src/assets/fonts, sem arquivo sobrando
```
