# teste_de_completude_falha_quando_falta_chave_em_es_par_de_falsificacao

Teste: `frontend/src/i18n/i18n.test.ts`

```gherkin
Funcionalidade: Textos do placar em três idiomas
  Como operador de mesa
  Eu quero o placar em pt_BR, en e es
  Para operar na minha língua sem texto faltando

  Cenário: Par de falsificação: falta uma chave em es
    Dado o dicionário es completo e uma cópia sem clock_bar.pause
    Quando verifico a completude das duas
    Então a completa não acusa nada e a cópia acusa exatamente clock_bar.pause
```
