# pr_de_release_atualiza_todos_os_arquivos_de_versao

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: pr_de_release_atualiza_todos_os_arquivos_de_versao — O PR de release atualiza todos os arquivos de versão
    Dado uma cópia dos arquivos de versão do repositório
    E um histórico com "feat:"
    Quando os updaters reais do release-please são aplicados à cópia
    Então o manifest, o CHANGELOG e todo arquivo de extra-files mudam
    E a sincronia de versão passa com a versão nova
```
