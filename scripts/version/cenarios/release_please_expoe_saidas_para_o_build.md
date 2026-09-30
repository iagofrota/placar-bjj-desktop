# release_please_expoe_saidas_para_o_build

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: release_please_expoe_saidas_para_o_build — Pontos de extensão para o build de release
    Dado os workflows release-please.yml e beta.yml
    Quando as saídas dos jobs são lidas
    Então release-please expõe release_created, tag_name e version
    E e beta expõe tag, version e prerelease
```
