# breaking_change_no_rodape_antes_de_1_0_gera_minor

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: breaking_change_no_rodape_antes_de_1_0_gera_minor — BREAKING CHANGE no rodapé antes da 1.0 gera minor
    Dado a última versão publicada é 0.1.0
    E entrou um commit "refactor:" com rodapé "BREAKING CHANGE:"
    Quando o cálculo roda sobre o fixture "breaking-rodape"
    Então a próxima versão é 0.2.0, e não 1.0.0
```
