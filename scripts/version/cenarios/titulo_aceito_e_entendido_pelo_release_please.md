# titulo_aceito_e_entendido_pelo_release_please

Critério: L1 · Teste: `scripts/version/test/titulo-pr.test.mjs`

```gherkin
Funcionalidade: Título de PR em conventional commits
  Como mantenedor do projeto
  Eu quero recusar PR para dev com título fora do padrão
  Porque o título vira a mensagem de onde a versão é calculada

  Cenário: titulo_aceito_e_entendido_pelo_release_please — O que o check aceita o release-please entende
    Dado cada título aceito pelo check
    Quando o parser do release-please lê o título como commit
    Então sai um commit do mesmo tipo
    E e ele é breaking só quando o título tem "!:"
```
