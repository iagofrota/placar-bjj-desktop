# fix_gera_patch

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: fix_gera_patch — Só correções geram patch
    Dado a última versão publicada é 0.1.0
    E desde ela só entraram commits "fix:"
    Quando o cálculo do release-please roda em dry-run sobre o histórico fixture "so-fix"
    Então a próxima versão é 0.1.1
```
