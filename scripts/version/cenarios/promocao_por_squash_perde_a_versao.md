# promocao_por_squash_perde_a_versao

Critério: L3 · Teste: `scripts/version/test/plano-de-release.test.mjs`

```gherkin
Funcionalidade: Cálculo da próxima versão
  Como mantenedor do projeto
  Eu quero que a versão saia dos conventional commits
  Para nunca decidir número de versão à mão

  Cenário: promocao_por_squash_perde_a_versao — Promoção por squash perde a versão
    Dado main recebeu os mesmos commits de dev achatados num squash
    E os commits de dev viraram uma lista "* feat: …" no corpo
    Quando o cálculo roda sobre o fixture "promocao-squash"
    Então nenhuma versão nova é proposta, porque o "feat:" se perdeu
```
