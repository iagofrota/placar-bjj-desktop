# detector_de_literal_de_cor_reconhece_hex_rgb_e_hsl

Teste: `frontend/src/styles/design-tokens.test.ts`

```gherkin
Funcionalidade: Tokens de cor do placar
  Como operador de mesa
  Eu quero as cores exatas da identidade da plataforma
  Para que o placar seja reconhecível e sem cor solta no código

  Cenário: Controle: o detector acha literais de verdade
    Dado textos com hex de 3 e 6 dígitos, rgb(), rgba() e hsl()
    E um texto só com classes de token e um id como #root
    Quando aplico o detector
    Então ele acusa os literais e não acusa o texto limpo
```
