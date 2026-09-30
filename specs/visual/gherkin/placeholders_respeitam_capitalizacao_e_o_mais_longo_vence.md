# placeholders_respeitam_capitalizacao_e_o_mais_longo_vence

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Capitalização e placeholder mais longo
    Dado :name, :Name, :NAME e :names
    Quando troco os valores
    Então saem ana, Ana, ANA e o :names não é cortado por :name, e :outro sem valor fica intacto
```
