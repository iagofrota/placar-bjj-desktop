# dicionarios_pt_BR_en_es_tem_todas_as_chaves_do_placar

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Os três dicionários estão completos
    Dado a lista de chaves que o placar usa
    Quando peço cada chave em pt_BR, en e es
    Então nenhuma falta, nenhuma está vazia e nenhuma sobra
```
