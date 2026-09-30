# translate_troca_placeholders

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: translate troca placeholders
    Dado textos com :name, :time, :action e :number
    Quando passo os valores
    Então eles entram no texto de cada idioma
```
