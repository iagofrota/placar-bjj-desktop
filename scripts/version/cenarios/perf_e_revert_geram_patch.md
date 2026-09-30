# perf_e_revert_geram_patch

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: perf_e_revert_geram_patch — Desempenho e reversão geram patch
    Dado a última versão publicada é 0.1.0
    E desde ela só entraram um "perf:" e um "revert:"
    Quando o cálculo roda sobre o fixture "perf-revert"
    Então a próxima versão é 0.1.1
```
