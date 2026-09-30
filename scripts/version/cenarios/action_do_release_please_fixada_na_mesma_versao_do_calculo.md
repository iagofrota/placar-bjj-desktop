# action_do_release_please_fixada_na_mesma_versao_do_calculo

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: action_do_release_please_fixada_na_mesma_versao_do_calculo — A action e o cálculo usam o mesmo release-please
    Dado o release-please.yml e o package.json de scripts/version
    Quando a versão fixada de cada um é lida
    Então a action está fixada por SHA
    E e a versão do release-please no comentário é a mesma do package.json
```
