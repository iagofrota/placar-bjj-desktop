# nenhum_literal_de_cor_fora_do_arquivo_de_tokens

Teste: `frontend/src/styles/design-tokens.test.ts`

```gherkin
Funcionalidade: Tokens de cor do placar
  Como operador de mesa
  Eu quero as cores exatas da identidade da plataforma
  Para que o placar seja reconhecível e sem cor solta no código

  Cenário: Nenhum literal de cor fora de tokens.css
    Dado todos os .ts, .tsx e .css de frontend/src, menos styles/tokens.css
    Quando procuro hex, rgb() e hsl()
    Então nenhum arquivo contém literal de cor
```
