# changelog_usa_secoes_em_portugues

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: changelog_usa_secoes_em_portugues — O CHANGELOG sai com seções em português
    Dado o CHANGELOG.md atual com cabeçalho, introdução e a entrada 0.1.0
    E um histórico com "feat:", "fix:" e "chore:"
    Quando a entrada nova é gerada
    Então ela entra entre a introdução e a entrada 0.1.0
    E tem as seções "Novidades" e "Correções"
    E e o "chore:" não aparece
```
