# beta_publicado_nao_altera_a_versao_estavel

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: beta_publicado_nao_altera_a_versao_estavel — Beta publicado não altera a versão estável
    Dado existe o release v0.2.0 e, depois dele, o pre-release v0.3.0-beta.1
    E há um "feat:" antes do beta e um "fix:" depois dele
    Quando o cálculo estável roda sobre o fixture "beta-publicado"
    Então a próxima versão é 0.3.0, calculada a partir da 0.2.0 e não do beta
```
