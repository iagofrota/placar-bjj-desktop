# commits_anteriores_ao_ultimo_release_nao_contam

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: commits_anteriores_ao_ultimo_release_nao_contam — Commits anteriores ao último release não contam
    Dado existe o release v0.2.0
    E antes dele há um "feat:" e depois dele só um "fix:"
    Quando o cálculo roda sobre o fixture "apos-release"
    Então a próxima versão é 0.2.1
```
