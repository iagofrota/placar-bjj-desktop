# workflows_nao_buildam_nem_publicam_artefato

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: workflows_nao_buildam_nem_publicam_artefato — Nenhum build nem artefato
    Dado os workflows commits.yml, release-please.yml e beta.yml, sem os comentários
    Quando eles são lidos
    Então não há tauri build, tauri-action, upload de artefato nem chamada a release.yml
```
