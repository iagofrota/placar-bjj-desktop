# jsonpath_sem_correspondencia_reprova_a_sincronia

Critério: L2 · Teste: `scripts/version/test/sincronia.test.mjs`

```gherkin
Funcionalidade: Sincronia de versão
  Como mantenedor do projeto
  Eu quero que a versão viva num lugar só
  Para o app, o frontend e o Cargo nunca divergirem

  Cenário: jsonpath_sem_correspondencia_reprova_a_sincronia — JSONPath sem correspondência reprova a sincronia
    Dado uma config com um JSONPath que não acha nada
    Quando a sincronia é checada
    Então ela reprova com "nenhum valor encontrado", em vez de passar em silêncio
```
