# chaves_do_placar_sao_as_do_avulso_e_dos_componentes_dele

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: A lista de chaves é a do placar avulso
    Dado a lista PLACAR_KEYS
    Quando a inspeciono
    Então tem 64 chaves sem repetição, inclui as de setup e correção, e não inclui as de fila e offline
```
