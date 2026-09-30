# translate_devolve_o_texto_do_idioma_pedido

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: translate escolhe o idioma
    Dado a chave side.white
    Quando peço em pt_BR, en e es
    Então recebo Branco, White e Blanco
```
