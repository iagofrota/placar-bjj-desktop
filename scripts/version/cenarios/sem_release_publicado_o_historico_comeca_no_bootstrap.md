# sem_release_publicado_o_historico_comeca_no_bootstrap

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: sem_release_publicado_o_historico_comeca_no_bootstrap — O marco da 0.1.0 limita o histórico
    Dado nenhuma versão foi publicada e o manifest diz 0.1.0
    E o histórico tem um "feat:" antes do commit marcado em bootstrap-sha e um "fix:" depois dele
    Quando o cálculo roda
    Então a próxima versão é 0.1.1, porque o que veio antes do marco já é a 0.1.0
```
