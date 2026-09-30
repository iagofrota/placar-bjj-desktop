# feat_gera_minor

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: feat_gera_minor — Funcionalidade nova gera minor
    Dado a última versão publicada é 0.1.0
    E desde ela entraram "fix:", "feat:" e "chore:"
    Quando o cálculo roda sobre o fixture "com-feat"
    Então a próxima versão é 0.2.0
```
