# placeholders_de_en_e_es_batem_com_pt_BR

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Os placeholders batem entre idiomas
    Dado cada texto dos três dicionários
    Quando extraio os :placeholders
    Então en e es têm os mesmos que pt_BR na mesma chave
```
