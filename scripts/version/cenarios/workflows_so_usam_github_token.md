# workflows_so_usam_github_token

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: workflows_so_usam_github_token — Só o GITHUB_TOKEN
    Dado os workflows commits.yml, release-please.yml e beta.yml
    Quando os segredos referenciados são listados
    Então o único é GITHUB_TOKEN
```
