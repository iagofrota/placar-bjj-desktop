# promocao_por_merge_commit_preserva_os_commits_de_dev

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: promocao_por_merge_commit_preserva_os_commits_de_dev — Promoção por merge commit preserva os commits de dev
    Dado main recebeu dev por merge commit com título "chore: promove dev para main"
    E dev trazia um "feat:" e um "fix:"
    Quando o cálculo roda sobre o fixture "promocao-merge-commit"
    Então a próxima versão é 0.2.0
```
