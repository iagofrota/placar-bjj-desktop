# workflow_beta_so_roda_a_partir_de_dev

Critério: L4/L6 · Teste: `scripts/version/test/workflows.test.mjs`

```gherkin
Funcionalidade: Limites dos workflows de versão
  Como mantenedor do projeto
  Eu quero workflows que só usam o GITHUB_TOKEN e não publicam artefato
  Para o build de release se plugar depois sem PAT

  Cenário: workflow_beta_so_roda_a_partir_de_dev — O beta só sai de dev
    Dado o workflow beta.yml
    Quando os gatilhos e passos são lidos
    Então o único gatilho é workflow_dispatch
    E e um passo sai com erro fora de refs/heads/dev
```
