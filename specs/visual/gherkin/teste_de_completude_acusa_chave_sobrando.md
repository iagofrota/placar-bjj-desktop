# teste_de_completude_acusa_chave_sobrando

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Chave fora da lista é acusada
    Dado o dicionário en com uma chave de offline
    Quando verifico as chaves extras
    Então offline.lost_write é acusada
```
