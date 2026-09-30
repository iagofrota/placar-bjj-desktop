# titulo_feat_no_pr_de_promocao_soma_um_minor

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: titulo_feat_no_pr_de_promocao_soma_um_minor — Título feat no PR de promoção soma um minor
    Dado main recebeu dev por merge commit com título "feat: lote de setembro"
    E dev só trazia um "fix:"
    Quando o cálculo roda sobre o fixture "promocao-titulo-feat"
    Então a próxima versão é 0.2.0, e não 0.1.1
    E por isso o PR de promoção deve ter título "chore: promove dev para main"
```
