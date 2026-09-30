# tokens_css_espelha_tabela_de_design_tokens

Teste: `frontend/src/styles/design-tokens.test.ts`

```gherkin
Funcionalidade: Tokens de cor do placar
  Como operador de mesa
  Eu quero as cores exatas da identidade da plataforma
  Para que o placar seja reconhecível e sem cor solta no código

  Cenário: tokens.css espelha a tabela de design tokens
    Dado que docs/design-tokens.md lista 15 tokens com hex
    Quando leio as variáveis de frontend/src/styles/tokens.css
    Então nome e hex são os mesmos da tabela, nos dois sentidos
```
