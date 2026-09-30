# historico_git_le_commits_desde_a_ultima_tag_estavel

Critério: L4 · Teste: `scripts/version/test/historico-git.test.mjs`

```gherkin
Funcionalidade: Beta calculado do git local
  Como mantenedor do projeto
  Eu quero que o beta leia o histórico real de dev
  Para o número sair dos commits desde a última versão estável

  Cenário: historico_git_le_commits_desde_a_ultima_tag_estavel — Commits desde a última tag estável
    Dado um repositório git com a tag v0.2.0 e o beta v0.2.1-beta.1 depois dela
    E o manifest ainda em 0.1.0
    Quando o histórico é lido
    Então só os commits depois de v0.2.0 entram
    E a versão publicada considerada é 0.2.0
```
