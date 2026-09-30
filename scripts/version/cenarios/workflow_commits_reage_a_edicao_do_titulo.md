# workflow_commits_reage_a_edicao_do_titulo

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: workflow_commits_reage_a_edicao_do_titulo — O check commits reage à edição do título
    Dado o workflow commits.yml
    Quando o gatilho e o job são lidos
    Então ele roda em PR para dev nos eventos opened, edited, synchronize e reopened
    E o job se chama commits
    E e o título entra por variável de ambiente, sem interpolação no script
```
