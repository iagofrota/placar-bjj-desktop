# teste_de_completude_falha_quando_a_chave_existe_vazia

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Chave vazia conta como ausente
    Dado o dicionário en com name_tbd só com espaços
    Quando verifico a completude
    Então name_tbd é acusada
```
