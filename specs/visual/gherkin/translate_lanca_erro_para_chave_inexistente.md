# translate_lanca_erro_para_chave_inexistente

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Chave inexistente é erro
    Dado uma chave que não existe
    Quando peço a tradução
    Então é lançado um erro que cita a chave
```
