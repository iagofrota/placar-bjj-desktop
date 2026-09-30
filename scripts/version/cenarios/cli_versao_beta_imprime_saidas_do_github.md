# cli_versao_beta_imprime_saidas_do_github

Critério: L4 · Teste: `scripts/version/test/historico-git.test.mjs`

```gherkin
Funcionalidade: Beta calculado do git local
  Como mantenedor do projeto
  Eu quero que o beta leia o histórico real de dev
  Para o número sair dos commits desde a última versão estável

  Cenário: cli_versao_beta_imprime_saidas_do_github — O comando do beta imprime as saídas do workflow
    Dado um repositório git com v0.2.0, v0.2.1-beta.1 e um "fix:" depois de v0.2.0
    Quando o comando do beta roda
    Então imprime version=0.2.1-beta.2, tag=v0.2.1-beta.2 e base_tag=v0.2.0
    E e, depois de uma tag estável sem commits novos, sai 1 dizendo que não há commit liberável
```
